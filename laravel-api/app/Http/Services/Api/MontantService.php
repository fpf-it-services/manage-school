<?php

namespace App\Http\Services\Api;


use App\Models\Classe;
use App\Models\Montant;

class MontantService
{
    /**
     * Vérifie si une école existe
     *
     * @return ?Montant
     */
    public static function getMontantOfClasse(Classe $classe,$annee_id): ?Ecole
    {
        return Montant::where([
            ["ecole_id","=",$classe->ecole_id],
            ["niveau_id","=",$classe->niveau_id],
            ["serie_id","=",$classe->serie_id],
            ["annee_id","=",$annee_id],
        ])->first();
    }
}
