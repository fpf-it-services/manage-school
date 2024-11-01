<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MontantResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "serie_id" => $this->serie_id,
            "frais_inscription" => $this->frais_inscription,
            "frais_formation" => $this->frais_formation,
            "frais_annexe" => $this->frais_annexe,
            "tranche1" => $this->tranche1,
            "tranche2" => $this->tranche2,
            "tranche3" => $this->tranche3,
            'mise_a_jour' => $this->updated_at->format("d/m/Y H:i:s")
        ];
    }
}
