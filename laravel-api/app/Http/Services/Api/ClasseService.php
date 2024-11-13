<?php

namespace App\Http\Services\Api;
use App\Models\Classe;
use App\Models\Annee;

class ClasseService{
    public static function getClassesByLevelAndSerie($level, $serie,$annee_id){
        $query = Classe::where("niveau_id", $level);
        if($serie != null)
            $query = $query->where("serie_id", $serie);
        if($annee_id != null){
            $annee = Annee::where("id",$annee_id)->first();
            if($annee != null)
                $query = $query->where("created_at","<=",$annee->date_fin->format("Y-m-d"));
            else
                return collect();
        }
        return $query->with(["eleves"])->get();
    }
}
