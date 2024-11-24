<?php

namespace App\Http\Services\Api;

use App\Models\Eleve;
use App\Models\Cursus;
use DB;

class EleveService
{
    public static function storeStudent($student_infos, $annee_id, $classe_id,$ecole_id = null)
    {
        if($ecole_id == null){
            return [null];
        }
        DB::beginTransaction(); // Démarre une transaction pour assurer la cohérence des opérations.

        try {
            // Crée l'élève dans la base de données avec les informations fournies.
            $eleve = Eleve::create($student_infos);

            // Crée le cursus correspondant de l'élève pour l'année et la classe données.
            Cursus::create([
                'eleve_id' => $eleve->id,
                'ecole_id' => $ecole_id,
                'classe_id' => $classe_id,
                'annee_id' => $annee_id
            ]);
        } catch (\Exception $e) {
            DB::rollBack(); // Annule la transaction en cas d'erreur.
        }

        DB::commit(); // Valide la transaction si toutes les opérations ont réussi.
        return [$eleve ?? null];
    }
}