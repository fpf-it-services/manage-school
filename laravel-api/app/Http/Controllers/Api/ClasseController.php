<?php

namespace App\Http\Controllers\Api;

use App\Models\Annee;
use App\Models\Classe;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use App\Http\Resources\ClasseResource;
use App\Http\Requests\AddClasseRequest;
use App\Http\Services\Api\EcoleService;
use App\Http\Requests\EditClasseRequest;
use App\Http\Services\Api\ClasseService;
use App\Http\Resources\ClasseResourceEcole;

class ClasseController extends Controller
{
    /**
     * Affiche une liste des classes pour l'année académique spécifiée.
     *
     * @param Request $request La requête contenant l'ID de l'année académique.
     * @return \Illuminate\Http\JsonResponse La liste des classes sous forme de JSON.
     */
    public function index(Request $request)
    {
        // Récupère l'ID de l'année académique depuis la requête ou utilise l'année la plus récente si absent.
        $annee_id = $request->get('annee_id');
        if ($annee_id === null) {
            $annee_id = Annee::orderBy("id", "desc")->first("id")?->id;
        }

        // Récupère les classes de l'école pour l'année académique et retourne en format JSON.
        return response()->json([
            "success" => true,
            "data" => ClasseResourceEcole::collection(EcoleService::getClasses(auth()->id(), $annee_id))
        ]);
    }

    /**
     * Enregistre une nouvelle classe dans la base de données.
     *
     * @param AddClasseRequest $request La requête validée contenant les données de la classe.
     * @return \Illuminate\Http\JsonResponse L'ID de la classe créée.
     */
    public function store(AddClasseRequest $request)
    {
        // Crée une nouvelle classe avec les données validées et associe l'école de l'utilisateur connecté.
        return response()->json([
            "success" => true,
            "data" => Classe::create(
                array_merge(
                    $request->validated(),
                    ["ecole_id" => auth()->user()->id]
                )
            )->id
        ], 201);
    }

    /**
     * Affiche les détails d'une classe spécifique.
     *
     * @param Classe $classe La classe à afficher.
     * @return \Illuminate\Http\JsonResponse Les détails de la classe ou un message d'erreur si l'accès est refusé.
     */
    public function show(Classe $classe)
    {
        // Vérifie si l'utilisateur a la permission de voir la classe.
        if (!Gate::allows('update-classe', $classe)) {
            return response()->json([
                "success" => false,
                "message" => "Accès refusé"
            ], 403);
        }

        // Charge les informations de l'école associée et retourne les détails de la classe.
        $classe->load(["ecole"]);
        return response()->json([
            "success" => true,
            "data" => new ClasseResource($classe)
        ], 200);
    }

    /**
     * Met à jour les informations d'une classe existante.
     *
     * @param EditClasseRequest $request La requête validée contenant les nouvelles données.
     * @param Classe $classe La classe à mettre à jour.
     * @return \Illuminate\Http\JsonResponse Les informations mises à jour de la classe ou un message d'erreur si l'accès est refusé.
     */
    public function update(EditClasseRequest $request, Classe $classe)
    {
        // Vérifie si l'utilisateur a la permission de mettre à jour la classe.
        if (!Gate::allows('update-classe', $classe)) {
            return response()->json([
                "success" => false,
                "message" => "Accès refusé"
            ], 403);
        }

        // Met à jour la classe avec les données validées et retourne la classe mise à jour.
        $classe->update($request->validated());
        return response()->json([
            "success" => true,
            "data" => new ClasseResource($classe)
        ], 200);
    }

    /**
     * Supprime une classe de la base de données.
     *
     * @param Classe $classe La classe à supprimer.
     * @return \Illuminate\Http\JsonResponse Réponse vide si la suppression réussit ou message d'erreur si accès refusé.
     */
    public function destroy(Classe $classe)
    {
        // Vérifie si l'utilisateur a la permission de supprimer la classe.
        if (!Gate::allows('update-classe', $classe)) {
            return response()->json([
                "success" => false,
                "message" => "Accès refusé"
            ], 403);
        }

        // Supprime la classe de la base de données.
        $classe->delete();
        return response()->json([], 204);
    }

    /**
     * Récupère les classes filtrées par niveau et série pour une année académique spécifique.
     *
     * @param Request $request La requête contenant les IDs du niveau, de la série et de l'année académique.
     * @return \Illuminate\Http\JsonResponse La liste des classes correspondant aux critères spécifiés.
     */
    public function getClassesByLevelAndSerie(Request $request)
    {
        // Récupère les classes correspondant aux critères fournis et les retourne sous forme de collection JSON.
        return response()->json([
            "success" => true,
            "data" => ClasseResource::collection(
                ClasseService::getClassesByLevelAndSerie(
                    $request->get("niveau_id"),
                    $request->get("serie_id"),
                    $request->get("annee_id")
                )
            )
        ]);
    }
}
