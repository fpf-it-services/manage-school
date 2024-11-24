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
    public static function getClassesByLevelAndSerieAndTransactions($level, $serie,$annee_id){
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
        return $query->with(["eleves.transactions"])->get();
    }
    public static function getFreeClassByInfos($ecole_id,$niveau_id,$serie_id = null){
        $annee = Annee::orderByDesc("id")->first();
        if($annee == null){
            return null;
        }
        $query = Classe::where("ecole_id",$ecole_id)->where("niveau_id", $niveau_id);
        if($serie_id != null)
            $query = $query->where("serie_id", $serie_id);
        $classes = $query->withCount(["eleves" => function($q) use ($ecole_id){
            $q->where("cursuses.ecole_id",$ecole_id);
        }])->get();
        if($classes->count() == 0){
            return null;
        }
        foreach ($classes as $classe) {
            if($classe->effectif_max > $classe->eleves_count){
                return $classe->id;
            }
        }
        return null;
    }
}
