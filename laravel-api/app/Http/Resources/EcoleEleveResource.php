<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EcoleEleveResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * Cette méthode transforme une instance de l'école (resource) en un tableau associatif contenant
     * des informations sur l'école, les élèves qui y sont inscrits, et les classes proposées par l'école.
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

            // Retourne une collection des élèves associés à cette école.
            // Chaque élève est transformé en utilisant la ressource `EleveNomPrenomResource`
            // pour encapsuler les informations sur le nom et prénom de chaque élève.
            "eleves" => EleveNomPrenomResource::collection($this->eleves),

            // Retourne une collection des classes proposées par cette école.
            // Chaque classe est transformée en utilisant la ressource `ClasseNomResource`
            // pour encapsuler le nom de chaque classe.
            "classes" => ClasseNomResource::collection($this->classes),
        ];
    }
}
