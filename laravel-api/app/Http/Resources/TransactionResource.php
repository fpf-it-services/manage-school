<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransactionResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "email" => $this->email,
            "annee" => $this->annee1,
            "classe" => $this->classe1,
            "type_frais" => $this->type_frais,
            "montant" => $this->montant,
            "reference" => $this->reference,
            'date' => $this->created_at->format("d/m/Y H:i:s")
        ];
    }
}
