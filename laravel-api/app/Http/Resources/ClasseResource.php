<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClasseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $classe_id = $this->id;
        return [
            "id" => $this->id,
            "nom" => $this->nom,
            // "niveau_id" => $this->niveau_id,
            // "serie_id" => $this->serie_id,
            "effectif_max" => $this->effectif_max,
            "eleves" => EleveResourceStatus::collection($this->eleves->map(function($eleve) use ($classe_id){
                $eleve->classe_id = $classe_id;
                return $eleve;
            }))
        ];
    }
}
