<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * Cette méthode transforme une instance de `Transaction` en un tableau. 
     * Le tableau contient les détails de la transaction, y compris l'email de l'utilisateur, 
     * l'année scolaire, la classe, le type de frais, le montant payé, la référence de la transaction 
     * et la date de création formatée de la transaction.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            // L'email de l'utilisateur ayant effectué la transaction
            "email" => $this->email,

            // L'année scolaire associée à la transaction
            "annee" => $this->annee1,

            // La classe associée à la transaction
            "classe" => $this->classe1,

            // Le type de frais payé (par exemple, inscription, réinscription, etc.)
            "type_frais" => $this->type_frais,

            // Le montant de la transaction
            "montant" => $this->montant,

            // La référence unique associée à cette transaction
            "reference" => $this->reference,

            // La date de la transaction formatée
            'date' => $this->created_at->format("d/m/Y H:i:s")
        ];
    }
}
