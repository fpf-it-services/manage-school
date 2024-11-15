<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AnneeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * Cette méthode transforme l'instance de la ressource Annee en un tableau associatif
     * qui sera renvoyé au client sous forme de réponse JSON.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            // Retourne l'identifiant unique de l'année académique
            'id' => $this->id,

            // Retourne le nom de l'année académique, par exemple "2024-2025"
            'annee_academique' => $this->annee_academique,

            // Formate la date de début de l'année académique au format "jour/mois/année" (par exemple "01/09/2024")
            'date_debut' => $this->date_debut->format("d/m/Y"),

            // Formate la date de fin de l'année académique au format "jour/mois/année" (par exemple "30/06/2025")
            'date_fin' => $this->date_fin->format("d/m/Y")
        ];
    }
}
