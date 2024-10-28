<?php

namespace App\Http\Services\Api;
use App\Models\Classe;

class ClasseService{
    public static function getClassesByLevelAndSerie($level, $serie){
        $query = Classe::where("niveau_id", $level);
        if($serie != null)
            $query = $query->where("serie_id", $serie);
        return $query->get();
    }
}
