<?php

namespace App\Http\Controllers\Api;

use DB;
use App\Models\User;
use App\Models\StudentParent;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\LoginRequest;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use App\Http\Resources\EcoleResource;
// use Illuminate\Http\Request;
use App\Http\Requests\RegisterRequest;
use App\Http\Services\Api\EcoleService;
use App\Http\Requests\LoginEcoleRequest;
use App\Http\Requests\UpdateUserProfileRequest;

class AuthController extends Controller
{
    /**
     * Inscription d'un utilisateur.
     * Cette méthode enregistre un nouvel utilisateur et génère un jeton d'accès OAuth.
     *
     * @param RegisterRequest $request La requête contenant les données validées pour l'inscription
     * @return JsonResponse Réponse JSON contenant l'utilisateur créé et le jeton d'accès
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $userData = $request->validated();

        // Définition de la date de vérification de l'email pour confirmer l'inscription
        $userData['email_verified_at'] = now();
        $user = User::create($userData);

        // Récupération des informations du client OAuth
        $client = $this->getClientInfos();

        // Envoi de la requête pour obtenir le jeton d'accès OAuth
        $response = Http::post(env('APP_URL') . '/oauth/token', [
            'grant_type' => 'password',
            'client_id' => $client->id,
            'client_secret' => $client->secret,
            'username' => $userData['email'],
            'password' => $userData['password'],
            'scope' => '',
        ]);

        // Ajout du jeton à la réponse de l'utilisateur
        $user['token'] = $response->json();

        return response()->json([
            'success' => true,
            'message' => 'User has been registered successfully.',
            'data' => $user,
        ], 201);
    }

    /**
     * Connexion d'un utilisateur.
     * Appelle la méthode locale pour gérer la logique de connexion.
     *
     * @param LoginRequest $request La requête contenant les informations de connexion
     * @return JsonResponse Réponse JSON indiquant le succès ou l'échec de la connexion
     */
    public function login(LoginRequest $request): JsonResponse
    {
        return $this->local_login($request);
    }

    /**
     * Récupère les informations de l'utilisateur authentifié.
     *
     * @return JsonResponse Réponse JSON contenant les informations de l'utilisateur
     */
    public function me(): JsonResponse
    {
        $user = auth()->user();

        return response()->json([
            'success' => true,
            'message' => 'Authenticated user info.',
            'data' => $user,
        ], 200);
    }

    /**
     * Récupère les informations de l'école authentifiée.
     *
     * @return JsonResponse Réponse JSON contenant les informations de l'école
     */
    public function ecole_me() : JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Authenticated school info.',
            'data' => new EcoleResource(auth()->user()),
        ], 200);
    }

    /**
     * Déconnexion de l'utilisateur en révoquant tous ses jetons.
     *
     * @return JsonResponse Réponse JSON indiquant le succès de la déconnexion
     */
    public function logout() /*: JsonResponse*/
    {
        if(Auth::user()){
            Auth::user()->tokens()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Logged out successfully.',
            ], 204);
        }
        return response()->json([
            'success' => false,
            'message' => 'Non autorisé',
        ], 401);
    }

    /**
     * Récupère les informations du client OAuth utilisé pour la génération de jetons.
     *
     * @return object Les informations du client OAuth
     */
    private function getClientInfos()
    {
        return DB::table('oauth_clients')->where('password_client', 1)->first();
    }

    /**
     * Connexion d'un administrateur d'école en vérifiant les informations fournies.
     *
     * @param LoginEcoleRequest $request La requête contenant les informations de connexion de l'école
     * @return JsonResponse Réponse JSON indiquant le succès ou l'échec de la connexion
     */
    public function login_ecole_admin(LoginEcoleRequest $request): JsonResponse
    {
        $tab = [];
        foreach($request->validated() as $key => $value)
            if($key != "password")
                $tab[] = ["$key", "=", $value];

        // Vérification des informations de l'école
        $ecole = EcoleService::getByInfos($tab);
        if($ecole !== null && !Hash::check($request->password, $ecole?->password))
            $ecole = null;

        return $this->local_login($request, $ecole);
    }

    /**
     * Gère la logique de connexion locale pour l'utilisateur ou l'école.
     *
     * @param mixed $request La requête de connexion
     * @param mixed $userLogged L'utilisateur (ou l'école) connecté, s'il est déjà authentifié
     * @return JsonResponse Réponse JSON contenant le jeton d'accès et le rôle de l'utilisateur
     */
    private function local_login($request, $userLogged = null)
    {
        $studentParent = null;
        // Si l'utilisateur est déjà authentifié, le connecter directement
        if($userLogged !== null) {
            Auth::login($userLogged);
        }else{
            $studentParent = StudentParent::where("email",$request->email)->first();
            
            if($studentParent !== null && !Hash::check($request->password, $studentParent?->password))
                $studentParent = null;
            
                if($studentParent !== null) {
                    Auth::login($studentParent);
                }
        }

        // Authentification standard si non déjà connecté
        if ($userLogged !== null || $studentParent !== null || Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $user = Auth::user();
            if($user?->updated_at)
                unset($user->updated_at); // Retirer le champ `updated_at` de la réponse
            $client = $this->getClientInfos();

            // Détermination du rôle en fonction du type d'utilisateur
            //$role = $userLogged === null ? "admin" : "ecole";
            $role = null;
            if($userLogged === null){
                if($studentParent !== null){
                    $role = "parent";
                }else{
                    $role = "admin";
                }
            }else{
                $role = "ecole";
            }

            // Création du jeton d'accès et ajout au modèle de l'utilisateur
            $user['token'] = $user->createToken('Token-name')->accessToken;

            return response()->json(["token" => $user['token'], "role" => $role], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized.',
                'errors' => 'Unauthorized',
            ], 401);
        }
    }

    /**
     * Met à jour le profil de l'utilisateur authentifié.
     *
     * @param UpdateUserProfileRequest $request La requête contenant les données mises à jour
     * @return JsonResponse Réponse JSON contenant l'utilisateur mis à jour
     */
    public function updateProfile(UpdateUserProfileRequest $request)
    {
        // Prépare les données de mise à jour
        $updateData = [
            "name" => $request->input('name'),
            "email" => $request->input('email'),
        ];

        // Met à jour le mot de passe si un nouveau est fourni
        if($request->input("password") !== null) {
            $updateData["password"] = bcrypt($request->input("password"));
        }

        // Met à jour les informations de l'utilisateur dans la base de données
        auth()->user()->update($updateData);

        return response()->json([
            "success" => true,
            "message" => "Profile updated successfully.",
            "data" => auth()->user(),
        ]);
    }
}
