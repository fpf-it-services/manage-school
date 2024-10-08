<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClasseResourceEcole extends JsonResource
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
            "nom" => $this->nom,
            "niveau" => $this->niveau_1,
            "serie" => $this->serie_1,
            "effectif_max" => $this->effectif_max,
            "ecoles" => EleveResource::collection($this->ecoles)
        ];
    }
}
