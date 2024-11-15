<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EleveNomPrenomResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * Cette méthode transforme une instance d'élève en un tableau associatif contenant
     * les informations essentielles de l'élève, à savoir son identifiant, son nom, et ses prénoms.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            // Retourne l'identifiant unique de l'élève
            'id' => $this->id,

            // Retourne le nom de l'élève
            'nom' => $this->nom,

            // Retourne les prénoms de l'élève
            'prenoms' => $this->prenoms,
        ];
    }
}
