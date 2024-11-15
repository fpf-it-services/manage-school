<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EcoleAnneeClasseEleveResourceAnnee extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * Cette méthode transforme une instance de la ressource `Annee` en un tableau associatif qui sera ensuite
     * renvoyé sous forme de réponse JSON. Le format de réponse est destiné à représenter une année académique
     * associée à une école, incluant les classes et les élèves qui y sont inscrits.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            // Retourne l'identifiant unique de l'année académique
            "id" => $this->id,

            // Retourne le nom de l'année académique, comme "2023/2024"
            "annee_academique" => $this->annee_academique,

            // Retourne une collection de classes associées à cette année académique.
            // Chaque classe sera transformée par la ressource `EcoleAnneeClasseEleveResourceClasse`.
            // Cela permet de structurer la réponse en incluant des informations détaillées sur les classes.
            "classes" => EcoleAnneeClasseEleveResourceClasse::collection($this->classes),
        ];
    }
}
