<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EcoleAnneeClasseEleveResourceEcole extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * Cette méthode transforme une instance de l'école (resource) en un tableau associatif contenant
     * des informations sur l'école, y compris son nom et les années académiques qui lui sont associées.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            // Retourne l'identifiant unique de l'école
            "id" => $this->id,

            // Retourne le nom de l'école
            "nom" => $this->nom,

            // Retourne une collection d'années académiques associées à cette école.
            // Chaque année académique est transformée en utilisant la ressource `EcoleAnneeClasseEleveResourceAnnee`
            // pour encapsuler les informations pertinentes.
            "annees" => EcoleAnneeClasseEleveResourceAnnee::collection($this->annees),
        ];
    }
}
