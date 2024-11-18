<?php

namespace App\Http\Controllers\Api;

use App\Models\Ecole;
use App\Models\Annee;
use App\Models\Niveau;
// use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\EcoleResource;
use App\Http\Resources\EcoleEleveResource;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\EcoleStoreRequest;
use App\Http\Requests\UpdateEcoleRequest;
use App\Http\Resources\EcoleAnneeClasseEleveResourceEcole;

class EcoleController extends Controller
{
    /**
     * Récupère et affiche toutes les écoles.
     *
     * @return \Illuminate\Http\JsonResponse La liste des écoles sous forme de JSON.
     */
    public function index()
    {
        return response()->json([
            "success" => true,
            "data" => EcoleResource::collection(Ecole::all())
        ]);
    }

    /**
     * Enregistre une nouvelle école dans la base de données.
     *
     * @param EcoleStoreRequest $request La requête validée contenant les données de l'école.
     * @return \Illuminate\Http\JsonResponse L'école créée sous forme de JSON.
     */
    public function store(EcoleStoreRequest $request)
    {
        // Initialise le chemin du logo à null
        $logoPath = null;

        // Si un fichier de logo est présent dans la requête, le sauvegarde dans le dossier "logos" dans le stockage public.
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('logos', 'public');
        }

        // Crée une nouvelle école avec les données fournies et le chemin du logo (si disponible).
        $ecole = Ecole::create([
            'nom' => $request->nom,
            'email' => $request->email,
            'password' => bcrypt($request->password ?? "password"),  // Hash du mot de passe par défaut s'il n'est pas fourni
            'adresse' => $request->adresse,
            'telephone' => $request->contact,
            'logo' => $logoPath,
            'centre_de_composition' => $request->centre_de_composition == "true",  // Convertit en booléen
        ]);

        // Retourne la nouvelle école créée en format JSON.
        return response()->json([
            "success" => true,
            "data" => $ecole
        ], 201);
    }

    /**
     * Affiche les informations d'une école spécifique.
     *
     * @param Ecole $ecole L'école à afficher.
     * @return \Illuminate\Http\JsonResponse Les informations de l'école.
     */
    public function show(Ecole $ecole)
    {
        return response()->json([
            "success" => true,
            "data" => new EcoleResource($ecole)
        ]);
    }

    /**
     * Met à jour les informations d'une école existante.
     *
     * @param UpdateEcoleRequest $request La requête validée contenant les nouvelles données.
     * @return \Illuminate\Http\JsonResponse Les informations de l'école mise à jour.
     */
    public function update(UpdateEcoleRequest $request)
    {
        // Récupère l'école actuellement authentifiée.
        $ecole = auth()->user();
        
        // Initialise le chemin du logo actuel de l'école.
        $logoPath = $ecole->logo;

        // Si un nouveau fichier de logo est présent, supprime l'ancien logo et sauvegarde le nouveau.
        if ($request->hasFile('logo')) {
            if ($logoPath !== null) {
                Storage::disk("public")->delete($logoPath);
            }
            $logoPath = $request->file('logo')->store('logos', 'public');
        }

        // Met à jour les données de l'école avec les informations fournies dans la requête.
        $ecole->update([
            'nom' => $request->nom,
            'email' => $request->email,
            'password' => $request->password ? bcrypt($request->password) : $ecole->password,
            'adresse' => $request->adresse,
            'telephone' => $request->contact ?? $ecole->telephone,
            'logo' => $logoPath,
            'centre_de_composition' => $request->centre_de_composition ?? $ecole->centre_de_composition,
        ]);

        // Retourne l'école mise à jour en format JSON.
        return response()->json([
            "success" => true,
            "data" => new EcoleResource($ecole)
        ], 200);
    }

    /**
     * Supprime une école de la base de données.
     *
     * @param Ecole $ecole L'école à supprimer.
     * @return \Illuminate\Http\JsonResponse Réponse vide en cas de succès.
     */
    public function destroy(Ecole $ecole)
    {
        // Supprime l'école spécifiée de la base de données.
        $ecole->delete();

        return response()->json([], 204);
    }

    /**
     * Récupère les élèves et les classes associés à une école spécifique.
     *
     * @param Ecole $ecole L'école dont on souhaite obtenir les informations.
     * @return \Illuminate\Http\JsonResponse La liste des élèves et classes de l'école.
     */
    public function ecoles_eleves(Ecole $ecole)
    {
        return response()->json([
            "success" => true,
            "data" => EcoleEleveResource::collection(Ecole::with(["eleves", "classes"])->get())
        ]);
    }
    public function getLevels(){
        $annee_courante = Annee::orderBy("id","desc")->first("id");
        
        if($annee_courante === null)
            return response()->json([
                "success" => false,
                "message" => "Aucune année définie",
            ],404);
        $ecoles = Ecole::all();
        foreach($ecoles as $ecole){
            $ecole->niveaux = Niveau::whereHas("montants" , function($query) use ($annee_courante,$ecole){
                $query->where("ecole_id", "=", $ecole->id)->where("annee_id",$annee_courante->id);
            })->get();
        }
        return response()->json([
            "success" => true,
            "data" => $ecoles
        ]);
    }

    /**
     * Récupère les écoles avec leurs années académiques, classes, et élèves.
     *
     * @return \Illuminate\Http\JsonResponse La liste structurée des écoles, années, classes et élèves.
     */
    public function getEcolesAnneesClassesEleves()
    {
        // Récupère toutes les années académiques
        $annees = Annee::all();

        // Récupère toutes les écoles avec leurs classes et leurs élèves associés
        $ecoles = Ecole::with(["classes.eleves"])->get();

        // Structure de la réponse en JSON
        $responseData = $ecoles->map(function ($ecole) use ($annees) {
            return [
                'ecole_id' => $ecole->id,
                'nom' => $ecole->nom,
                'annees' => $annees->map(function ($annee) use ($ecole) {
                    // Récupère les classes de l'école pour l'année académique en cours
                    $classes = $this->getClasses($ecole, $annee);
                    return [
                        'annee_id' => $annee->id,
                        'annee_academique' => $annee->annee_academique,
                        'classes' => $classes->map(function ($classe) {
                            return [
                                'classe_id' => $classe->id,
                                'nom' => $classe->nom,
                                'eleves' => $classe->eleves->map(function ($eleve) {
                                    return [
                                        'eleve_id' => $eleve->id,
                                        'nom' => $eleve->nom,
                                        'prenom' => $eleve->prenoms,
                                    ];
                                })
                            ];
                        })
                    ];
                })
            ];
        });

        // Retourne la réponse structurée en JSON
        return response()->json([
            "success" => true,
            "data" => $responseData
        ]);
    }

    /**
     * Filtre et retourne les classes d'une école pour une année académique spécifique.
     *
     * @param Ecole $ecole L'école pour laquelle on récupère les classes.
     * @param Annee $annee L'année académique pour le filtrage des classes.
     * @return \Illuminate\Support\Collection Les classes filtrées.
     */
    private function getClasses($ecole, $annee)
    {
        // Filtre les classes créées avant la fin de l'année académique spécifiée.
        return $ecole->classes->filter(function ($classe) use ($annee) {
            return $classe->created_at->isBefore($annee->date_fin);
        });
    }
}
