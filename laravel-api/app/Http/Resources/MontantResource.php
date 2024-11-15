<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MontantResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * Cette méthode transforme une instance de `Montant` en un tableau. 
     * Le tableau contient les détails du montant pour un niveau scolaire, 
     * y compris les frais d'inscription, de réinscription, de formation, annexes 
     * ainsi que les tranches associées avec leurs dates d'échéance.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            // L'identifiant unique du montant
            "id" => $this->id,

            // Identifiant de la série associée à ces montants
            "serie_id" => $this->serie_id,

            // Frais d'inscription pour ce niveau scolaire
            "frais_inscription" => $this->frais_inscription,

            // Frais de réinscription pour ce niveau scolaire
            "frais_reinscription" => $this->frais_reinscription,

            // Frais de formation pour ce niveau scolaire
            "frais_formation" => $this->frais_formation,

            // Frais annexes pour ce niveau scolaire
            "frais_annexe" => $this->frais_annexe,

            // Tranches des paiements associés à ce montant
            // Chaque tranche a un montant et une date d'échéance formatée
            "tranches" => [
                [
                    "montant" => $this->tranche1,
                    "dueDate" => $this->echeance_tranche1->format("d/m/Y"), // Date d'échéance formatée pour la tranche 1
                ],
                [
                    "montant" => $this->tranche2,
                    "dueDate" => $this->echeance_tranche2->format("d/m/Y"), // Date d'échéance formatée pour la tranche 2
                ],
                [
                    "montant" => $this->tranche3,
                    "dueDate" => $this->echeance_tranche3->format("d/m/Y"), // Date d'échéance formatée pour la tranche 3
                ],
            ],

            // Date de dernière mise à jour du montant
            'mise_a_jour' => $this->updated_at->format("d/m/Y H:i:s"),
        ];
    }
}
