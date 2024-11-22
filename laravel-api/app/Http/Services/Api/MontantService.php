<?php

namespace App\Http\Services\Api;


use App\Models\Classe;
use App\Models\Montant;
use App\Models\Annee;

class MontantService
{
    /**
     *
     * @return ?Montant
     */
    public static function getMontantOfClasse(Classe $classe,$annee_id): ?Montant
    {
        return Montant::where([
            ["ecole_id","=",$classe->ecole_id],
            ["niveau_id","=",$classe->niveau_id],
            ["serie_id","=",$classe->serie_id],
            ["annee_id","=",$annee_id],
        ])->first();
    }
    /**
     *
     * @return ?Montant
     */
    public static function getMontantOfInfos($ecole_id,$niveau_id,$serie_id = null,$annee_id = null): ?Montant
    {
        $annee = $annee_id;
        if($annee == null){
            $lastYearCreated = Annee::orderByDesc("id")->first();
            if($lastYearCreated === null){
                return null;
            }else{
                $annee = $lastYearCreated->id;
            }
        }
        $data = [
            ["ecole_id","=",$ecole_id],
            ["niveau_id","=",$niveau_id],
            ["annee_id","=",$annee],
        ];
        if($serie_id != null){
            $data[] = ["serie_id","=",$serie_id];
        }
        return Montant::where($data)->first();
    }
}
