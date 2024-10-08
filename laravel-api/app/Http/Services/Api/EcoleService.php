<?php

namespace App\Http\Services\Api;

use App\Models\Ecole;
use App\Models\Serie;
use App\Models\Classe;
use App\Models\Niveau;

class EcoleService
{
    /**
     * Vérifie si une école existe
     *
     * @return ?Ecole
     */
    public static function getByInfos(array $arrayOfCredentials): ?Ecole
    {
        return Ecole::where($arrayOfCredentials)->first();
    }
    public static function getClasses(int|string|null $ecole_id,$annee_id){
        if($annee_id === null){
            return collect();
        }
        return Classe::where("ecole_id", $ecole_id)->addSelect([
            "niveau_1" => Niveau::whereColumn("id","classes.niveau_id")->limit(1)->select("niveau"),
            "serie_1" => Serie::whereColumn("id","classes.serie_id")->limit(1)->select("serie")
        ])->get();
    }
}
