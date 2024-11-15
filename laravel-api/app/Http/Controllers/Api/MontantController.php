<?php

namespace App\Http\Controllers\Api;

use App\Models\Annee;
use App\Models\Niveau;
use App\Models\Montant;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use App\Http\Resources\MontantResource;
use App\Http\Requests\AddMontantRequest;
use App\Http\Requests\EditMontantRequest;
use App\Http\Requests\EditFraisMontantRequest;
use App\Http\Resources\LevelMontantResource;

class MontantController extends Controller
{
    /**
     * Affiche une liste des ressources.
     * Cette méthode récupère les niveaux ayant des montants associés à l'année en cours
     * pour l'école de l'utilisateur authentifié.
     */
    public function index()
    {
        // Récupère l'année courante, celle ayant l'ID le plus élevé
        $annee_courante = Annee::orderBy("id","desc")->first("id");
        
        // Si aucune année n'est définie, retourne un message d'erreur
        if($annee_courante === null)
            return response()->json([
                "success" => false,
                "message" => "Aucune année définie",
            ],404);

        // Récupère les niveaux avec les montants associés pour l'année courante et l'école de l'utilisateur
        $niveaus = Niveau::withWhereHas("montants" , function($query) use ($annee_courante){
            $query->where("ecole_id", "=", auth()->id())->where("annee_id",$annee_courante->id);
        })->get();

        // Retourne les données dans un format structuré
        return response()->json([
            "success"=> true,
            "data" => LevelMontantResource::collection($niveaus)
        ]);
    }

    /**
     * Affiche les montants pour un niveau spécifique.
     * Cette méthode récupère les montants associés à un niveau donné pour l'année courante
     * et l'école de l'utilisateur.
     */
    public function montant_niveau(Request $request)
    {
        // Valide que l'ID du niveau existe dans la base de données
        $request->validate([
            "niveau_id" => "required|exists:niveaux,id",
        ]);
        
        // Récupère l'année courante
        $annee_courante = Annee::orderBy("id","desc")->first("id");
        
        // Si aucune année n'est définie, retourne un message d'erreur
        if($annee_courante === null)
            return response()->json([
                "success" => false,
                "message" => "Aucune année définie",
            ],404);

        // Retourne les montants associés au niveau demandé
        return response()->json([
            "success" => true,
            "data" => MontantResource::collection(Montant::where("niveau_id", $request->niveau_id)
                                        ->where("ecole_id", auth()->id())
                                        ->where("annee_id",$annee_courante->id)
                                        ->get())
        ]);
    }

    /**
     * Enregistre un nouveau montant dans la base de données.
     * Cette méthode permet d'ajouter un montant pour un niveau et une année donnés.
     */
    public function store(AddMontantRequest $request)
    {
        // Crée un nouveau montant et retourne les données associées dans la réponse
        return response()->json([
            "sucess" => true,
            "data" => new MontantResource
                (
                Montant::create
                    (
                        array_merge($request->all(),["ecole_id" => auth()->id()])
                    )
                )
        ],201);
    }

    /**
     * Affiche la ressource spécifiée.
     * (Cette méthode n'est pas encore implémentée.)
     */
    public function show(Montant $montant)
    {
        //
    }

    /**
     * Met à jour la ressource spécifiée.
     * Cette méthode met à jour un montant pour un niveau et une année donnés.
     */
    public function update(EditMontantRequest $request, Montant $montant)
    {
        // Appelle une méthode privée pour effectuer la mise à jour
        return $this->update_montant($request, $montant);
    }

    /**
     * Met à jour les frais associés à un montant spécifique.
     * Cette méthode utilise une logique similaire à `update` mais avec une validation différente.
     */
    public function update_frais(EditFraisMontantRequest $request, Montant $montant)
    {
        // Appelle une méthode privée pour effectuer la mise à jour des frais
        return $this->update_montant($request, $montant);
    }

    /**
     * Méthode privée pour effectuer la mise à jour d'un montant.
     * Cette méthode vérifie si l'utilisateur est autorisé à effectuer la mise à jour via la porte (Gate).
     */
    private function update_montant(Request $request, Montant $montant)
    {
        // Vérifie si l'utilisateur est autorisé à mettre à jour ce montant
        if(Gate::allows("update-montant", $montant)){
            // Met à jour le montant avec les données validées
            $montant->update($request->validated());
            
            // Retourne la réponse avec les données mises à jour
            return response()->json([
                "sucess" => true,
                "data" => new MontantResource($montant)
            ]);
        }

        // Si l'utilisateur n'est pas autorisé, retourne un message d'erreur
        return response()->json([
            "success" => false,
            "message" => "Accès non autorisé"
        ],403);
    }

    /**
     * Supprime la ressource spécifiée.
     * (Cette méthode n'est pas encore implémentée.)
     */
    public function destroy(Montant $montant)
    {
        //
    }
}
