<?php

namespace App\Http\Controllers\Api;

use DB;
use App\Models\User;
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
     * User registration
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        $userData = $request->validated();

        $userData['email_verified_at'] = now();
        $user = User::create($userData);

        $client = $this->getClientInfos();

        $response = Http::post(env('APP_URL') . '/oauth/token', [
            'grant_type' => 'password',
            'client_id' => $client->id,
            'client_secret' => $client->secret,
            'username' => $userData['email'],
            'password' => $userData['password'],
            'scope' => '',
        ]);

        $user['token'] = $response->json();

        return response()->json([
            'success' => true,
            'message' => 'User has been registered successfully.',
            'data' => $user,
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        return $this->local_login($request);

    }

    public function me(): JsonResponse
    {

        $user = auth()->user();


        return response()->json([
            'success' => true,
            'message' => 'Authenticated use info.',
            'data' => $user,
        ], 200);
    }
    public function ecole_me() : JsonResponse{
        return response()->json([
            'success' => true,
            'message' => 'Authenticated use info.',
            'data' => new EcoleResource(auth()->user()),
        ], 200);
    }

    public function logout(): JsonResponse
    {
        Auth::user()->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully.',
        ], 204);
    }
    private function getClientInfos(){
        return DB::table('oauth_clients')->where('password_client', 1)->first();
    }
    public function login_ecole_admin(LoginEcoleRequest $request): JsonResponse
    {
        $tab =  [];
        foreach($request->validated() as  $key => $value)
            if($key != "password")
                $tab[] = ["$key" ,"=", $value];
        $ecole = EcoleService::getByInfos($tab);
        if($ecole !== null && !Hash::check($request->password, $ecole?->password))
            $ecole = null;
        return $this->local_login($request,$ecole);
    }
    private function local_login($request,$userLogged = null){
        if($userLogged !== null){
            Auth::login($userLogged);
        }
        if ($userLogged !== null ||Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $user = Auth::user();
            unset($user->updated_at);
            $client = $this->getClientInfos();

            //return response()->json(['client' => $client],400);

            /* $response = Http::post(env('APP_URL') . '/oauth/token', [
                'grant_type' => 'password',
                'client_id' =>  $client->id,
                'client_secret' => $client->secret,
                'username' => $request->email,
                'password' => $request->password,
                'scope' => '',
            ]); */

            $role = $userLogged === null ? "admin" : "ecole";


            $user['token'] = $user->createToken('Token-name')->accessToken;

            return response()->json(["token" => $user['token'],"role" => $role], 200);
        } else {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized.',
                'errors' => 'Unauthorized',
            ], 401);
        }
    }
    public function updateProfile(UpdateUserProfileRequest $request){
        $updateData = [
            "name" => $request->input('name'),
            "email" => $request->input('email'),
        ];
        if($request->input("password") !== null){
            $updateData["password"] = bcrypt($request->input("password"));
        }
        auth()->user()->update($updateData);
        return response()->json([
            "success" => true,
            "message" => "Profile updated successfully.",
            "data" => auth()->user(),
        ]);
    }
}
