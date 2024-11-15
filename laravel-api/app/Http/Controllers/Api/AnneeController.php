<?php

namespace App\Http\Controllers\Api;

use App\Models\Annee;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\AnneeResource;
use App\Http\Requests\AddAnneeRequest;

class AnneeController extends Controller
{
    /**
     * Récupère la liste de toutes les années académiques et les retourne en tant que collection de ressources JSON.
     */
    public function index()
    {
        return response()->json([
            "success" => true,
            "data" => AnneeResource::collection(Annee::all())
        ]);
    }

    /**
     * Enregistre une nouvelle année académique en utilisant les données validées
     * provenant de la requête AddAnneeRequest, puis retourne la ressource de l'année créée.
     */
    public function store(AddAnneeRequest $request)
    {
        return response()->json([
            "success" => true,
            "data" => new AnneeResource(Annee::create($request->all()))
        ], 201);
    }

    /**
     * Affiche une année académique spécifique en la retournant sous forme de ressource JSON.
     *
     * @param Annee $annee L'année académique à afficher
     */
    public function show(Annee $annee)
    {
        return response()->json([
            "success" => true,
            "data" => new AnneeResource($annee)
        ], 200);
    }

    /**
     * Met à jour une année académique spécifique dans la base de données.
     * (À implémenter) Reçoit les nouvelles données à partir de la requête et met à jour l'instance d'année académique.
     *
     * @param Request $request La requête contenant les données de mise à jour
     * @param Annee $annee L'année académique à mettre à jour
     */
    public function update(Request $request, Annee $annee)
    {
        // Implémentation à ajouter
    }

    /**
     * Supprime une année académique spécifique de la base de données.
     * (À implémenter) Supprime l'instance d'année académique passée en paramètre.
     *
     * @param Annee $annee L'année académique à supprimer
     */
    public function destroy(Annee $annee)
    {
        // Implémentation à ajouter
    }

    /**
     * Récupère la dernière année académique créée, qui est considérée comme l'année académique courante.
     * Si aucune année n'existe, retourne un message d'erreur.
     *
     * @return \Illuminate\Http\JsonResponse La réponse JSON contenant l'année courante ou un message d'erreur
     */
    public function currentYear(){
        $lastYearCreated = Annee::orderByDesc("id")->first();
        if($lastYearCreated === null){
            // Aucune année trouvée, retour d'un message d'erreur
            return response()->json([
                "success" => false,
                "message" => "No année found"
            ], 404);
        }else{
            // Année courante trouvée, retour de l'année en tant que ressource
            return response()->json([
                "success" => true,
                "data" => new AnneeResource($lastYearCreated)
            ], 200);
        }
    }
}
