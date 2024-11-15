<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class LevelMontantResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * Cette méthode transforme une instance d'un niveau avec ses montants associés en un tableau.
     * Le tableau résultant contient l'id du niveau, le nom du niveau, et une collection de montants associés à ce niveau.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            // Identifiant unique du niveau
            "id" => $this->id,

            // Nom du niveau
            "niveau" => $this->niveau,

            // Collection des montants associés à ce niveau. 
            // MontantResource est une ressource qui transforme chaque montant en un tableau.
            "montants" => MontantResource::collection($this->montants)
        ];
    }
}
