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
    public function montant_du(MontantVerificationRequest $request){
        $type_frais = $request->input("type_frais");
        $classe = Classe::where("classe_id",$request->classe_id)->first();
        if($classe == null){
            if($montantModel == null){
                return response()->json([
                    "success" => false,
                    "message" => "Classe non retrouvée"
                ]);
            }
        }
        $montant_paye = Transaction::where("annee_id",$request->annee_id)
                                        ->where("eleve_id",$request->eleve_id)
                                        ->where("classe_id",$classe->id)
                                        ->where("type_frais",$type_frais)
                                        ->get()->sum("montant");
        $montantModel = Montant::where("ecole_id",$classe->ecole_id)
                                    ->where("niveau_id",$classe->niveau_id)
                                    ->where("serie_id",$classe->serie_id)
                                    ->where("annee_id",$request->annee_id)
                                    ->first();
        if($montantModel == null){
            return response()->json([
                "success" => false,
                "message" => "Montant non défini pour la classe " . $classe->nom . " pour l'année choisie"
            ]);
        }
        $montant_total = $montantModel[$type_frais];
        return response()->json([
            "success" => true,
            "montant" => $montant_total-$montant_paye
        ]);
    }
    public function save(AddTransactionRequest $request){
        Transaction::create($request->validated());
        return response()->json([
            "success" => true
        ], 201);
    }
    public function historique(Eleve $eleve){
        return response()->json([
            "success" => true,
            "data" => TransactionResource::collection($eleve->transactions()->addSelect([
                    "annee1" => Annee::whereColumn("id","transactions.annee_id")->limit(1)->select("annee_academique"),
                    "classe1" => Classe::whereColumn("id","transactions.classe_id")->limit(1)->select("nom"),
            ])->get())
        ], 201);
    }
    public function stats_eleves(Eleve $eleve){
        $eleve->load(["cursuses.classe"]);
        $montant_a_payer = 0;
        foreach($eleve->cursuses as $cursus){
            $montant = MontantService::getMontantOfClasse($cursus->classe,$cursus->annee_id);
            if($montant == null){
                return response()->json([
                    "success" => false,
                    "message" => "Le montant n'est pas défini pour la classe " . $cursus->classe->nom . " de l'école " . (Ecole::where("id",$cursus->classe->ecole_id)->first()->nom)
                ]);
            }
            $montant_a_payer += $montant->frais_inscription + $montant->frais_reinscription + $montant->frais_formation + $montant->frais_annexe;
        }

        $transactions = $eleve->transactions;
        $montant_payer = 0;

        foreach($transactions as $transaction){
            $montant_payer += $transaction->montant;
        }

        return response()->json([
            "success" => true,
            "data" => [
                "montant_total" => $montant_a_payer,
                "montant_paye" => $montant_payer,
                "montant_du" => $montant_a_payer - $montant_payer,
            ]
        ]);
    }
}
