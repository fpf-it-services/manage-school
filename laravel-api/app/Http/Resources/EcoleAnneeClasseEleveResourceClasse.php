<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EcoleAnneeClasseEleveResourceClasse extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * Cette méthode transforme une instance de la ressource `Classe` en un tableau associatif. Ce tableau est ensuite
     * renvoyé sous forme de réponse JSON. Il contient des informations relatives à une classe, ainsi que les élèves
     * qui lui sont associés.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            // Retourne l'identifiant unique de la classe
            "id" => $this->id,

            // Retourne une collection des élèves associés à cette classe,
            // chaque élève étant transformé par la ressource `EleveNomPrenomResource`
            // pour afficher uniquement les informations nécessaires, comme le nom et le prénom
            "eleves" => EleveNomPrenomResource::collection($this->eleves),
        ];
    }
}
