<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Requests\MontantVerificationRequest; 
use App\Models\Transaction;  
use App\Models\Classe;  
use App\Models\Montant;  
use App\Models\Eleve;  
use App\Models\Annee;  
use App\Models\Ecole;  
use Illuminate\Validation\Rule;
use App\Http\Requests\AddMontantRequest; 
use App\Http\Resources\TransactionResource;  
use App\Http\Services\Api\MontantService;  
use App\Http\Requests\AddTransactionRequest;  

class TransactionController extends Controller
{
    /**
     * Vérifie le montant restant à payer pour un élève dans une classe donnée.
     */
    public function montant_du(MontantVerificationRequest $request){
        // Récupère le type de frais (ex : frais d'inscription, de scolarité, etc.) depuis la requête
        $type_frais = $request->input("type_frais");

        // Recherche la classe en fonction de l'ID fourni dans la requête
        $classe = Classe::where("classe_id", $request->classe_id)->first();

        // Si la classe n'existe pas, retourne une erreur
        if($classe == null){
            if($montantModel == null){
                return response()->json([
                    "success" => false,
                    "message" => "Classe non retrouvée"  // Message d'erreur si la classe n'est pas trouvée
                ]);
            }
        }

        // Récupère le montant total payé par l'élève pour cette classe, année et type de frais
        $montant_paye = Transaction::where("annee_id", $request->annee_id)
                                        ->where("eleve_id", $request->eleve_id)
                                        ->where("classe_id", $classe->id)
                                        ->where("type_frais", $type_frais)
                                        ->get()->sum("montant");

        // Recherche du montant total défini pour cette classe, niveau, série et année
        $montantModel = Montant::where("ecole_id", $classe->ecole_id)
                                    ->where("niveau_id", $classe->niveau_id)
                                    ->where("serie_id", $classe->serie_id)
                                    ->where("annee_id", $request->annee_id)
                                    ->first();

        // Si le montant n'est pas défini pour la classe, retourne une erreur
        if($montantModel == null){
            return response()->json([
                "success" => false,
                "message" => "Montant non défini pour la classe " . $classe->nom . " pour l'année choisie"
            ]);
        }

        // Récupère le montant total à payer pour le type de frais spécifié
        $montant_total = $montantModel[$type_frais];

        // Retourne la différence entre le montant total et le montant payé jusqu'à présent
        return response()->json([
            "success" => true,  // Indique que la requête a réussi
            "montant" => $montant_total - $montant_paye  // Montant restant à payer
        ]);
    }

    /**
     * Enregistre une nouvelle transaction.
     */
    public function save(AddTransactionRequest $request){
        // Crée une nouvelle transaction avec les données validées de la requête
        Transaction::create($request->validated());

        // Retourne une réponse JSON indiquant le succès de l'opération
        return response()->json([
            "success" => true  // Indique que la transaction a été enregistrée avec succès
        ], 201);  // Retourne le code HTTP 201 (Créé)
    }

    /**
     * Affiche l'historique des transactions d'un élève.
     */
    public function historique(Eleve $eleve){
        // Retourne l'historique des transactions de l'élève, avec les informations sur l'année et la classe
        return response()->json([
            "success" => true,  // Indique que la requête a réussi
            "data" => TransactionResource::collection($eleve->transactions()->addSelect([
                    "annee1" => Annee::whereColumn("id", "transactions.annee_id")->limit(1)->select("annee_academique"),  // Récupère l'année académique associée à chaque transaction
                    "classe1" => Classe::whereColumn("id", "transactions.classe_id")->limit(1)->select("nom"),  // Récupère le nom de la classe associée à chaque transaction
            ])->get())
        ], 201);  // Retourne le code HTTP 201 (Créé) avec les données des transactions
    }

    /**
     * Affiche les statistiques de paiement d'un élève (montants totaux à payer, payés et dus).
     */
    public function stats_eleves(Eleve $eleve){
        // Charge les classes et cursus associés à l'élève
        $eleve->load(["cursuses.classe"]);

        // Initialisation du montant total à payer
        $montant_a_payer = 0;

        // Parcours chaque cursus de l'élève pour récupérer le montant à payer pour chaque classe
        foreach($eleve->cursuses as $cursus){
            // Récupère le montant défini pour la classe et l'année académique de l'élève
            $montant = MontantService::getMontantOfClasse($cursus->classe, $cursus->annee_id);

            // Si le montant n'est pas défini, retourne une erreur
            if($montant == null){
                return response()->json([
                    "success" => false,
                    "message" => "Le montant n'est pas défini pour la classe " . $cursus->classe->nom . " de l'école " . (Ecole::where("id", $cursus->classe->ecole_id)->first()->nom)
                ]);
            }

            // Ajoute les frais à payer pour cette classe au montant total
            $montant_a_payer += $montant->frais_inscription + $montant->frais_reinscription + $montant->frais_formation + $montant->frais_annexe;
        }

        // Récupère toutes les transactions de l'élève
        $transactions = $eleve->transactions;

        // Calcul du montant total payé par l'élève
        $montant_payer = 0;

        foreach($transactions as $transaction){
            $montant_payer += $transaction->montant;
        }

        // Retourne les statistiques de paiement de l'élève (montant total, payé et dû)
        return response()->json([
            "success" => true,  // Indique que la requête a réussi
            "data" => [
                "montant_total" => $montant_a_payer,  // Montant total à payer
                "montant_paye" => $montant_payer,  // Montant payé
                "montant_du" => $montant_a_payer - $montant_payer,  // Montant restant dû
            ]
        ]);
    }
}
