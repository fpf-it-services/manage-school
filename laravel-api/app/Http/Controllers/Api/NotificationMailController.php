<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Annee;
use App\Models\Montant;
use App\Http\Services\Api\ClasseService;
use App\Mail\NotificationMailTranche;
use Mail;

class NotificationMailController extends Controller
{
    public static function notifyBeforeTranche($tranche = "tranche1",$echance = "echeance_tranche1"){
        $annee = self::getCurrentYear();
        if($annee != null){
            $montants = Montant::where($echance,"<=",now()->addweeks(3))->get();
            foreach($montants as $montant){
                $classes = ClasseService::getClassesByLevelAndSerieAndTransactions($montant->niveau_id,$montant->serie_id,$montant->annee_id);
                foreach($classes as $classe){
                    foreach($classe->eleves as $eleve){
                        $montant_paye = 0;
                        foreach($eleve->transactions as $transaction){
                            if($transaction->classe_id == $classe->id){
                                $montant_paye += $transaction->montant;
                            }
                        }
                        $montant_du = 0;
                        $numeroTranche = 1;
                        $montantTranche = 0;
                        if($tranche == "tranche1"){
                            $montant_du = $montant->tranche1;
                            $montantTranche = $montant->tranche1;
                        }else if($tranche == "tranche2"){
                            $montant_du += $montant->tranche2;
                            $numeroTranche = 2;
                            $montantTranche = $montant->tranche2;
                        }else if($tranche == "tranche3"){
                            $montant_du += $montant->tranche3;
                            $numeroTranche = 3;
                            $montantTranche = $montant->tranche3;
                        }
                        if($montant_paye < $montant_du){
                            $mailData = [
                                "tranche" => $numeroTranche,
                                "eleve" => $eleve->nom . ' ' . $eleve->prenoms . "(" . $classe->nom . ")" ,
                                "montant_tranche" => $montantTranche,
                                "echeance_tranche" => $montant->echeance_tranche1->format("d/m/Y"),
                                "montant_du" => $montant_du,
                            ];
                            Mail::to($eleve->email_tuteur1)->send(new NotificationMailTranche($mailData));
                        }
                    }
                }
            }
        }
    }
    private static function getCurrentYear(){
        return Annee::orderByDesc("id")->first();
    }
}