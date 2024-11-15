<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClasseNomResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * Cette méthode permet de transformer l'instance de la ressource "Classe" en un tableau associatif
     * qui sera renvoyé au client sous forme de réponse JSON.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            // Retourne l'identifiant unique de la classe
            "id" => $this->id,

            // Retourne le nom de la classe (par exemple, "Seconde", "1ère", etc.)
            "nom" => $this->nom
        ];
    }
}
