<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClasseResourceEcole extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * Cette méthode transforme une instance de la classe `Classe` en un tableau associatif qui sera ensuite 
     * retourné sous forme de réponse JSON. Ce format est spécifique à l'école, incluant des informations comme 
     * le niveau et la série de la classe, ainsi que la liste des élèves associés à la classe.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            // Retourne l'identifiant unique de la classe
            "id" => $this->id,
            
            // Retourne le nom de la classe, par exemple "Seconde", "Première", etc.
            "nom" => $this->nom,

            // Retourne le niveau de la classe. L'attribut `niveau_1` semble correspondre au niveau académique.
            "niveau" => $this->niveau_1,

            // Retourne la série de la classe. L'attribut `serie_1` semble correspondre à la série (par exemple, "Scientifique", "Littéraire").
            "serie" => $this->serie_1,

            // Retourne l'effectif maximum de la classe, indiquant combien d'élèves peuvent être inscrits dans cette classe.
            "effectif_max" => $this->effectif_max,

            // Retourne une collection d'élèves associés à cette classe, formatée via la ressource `EleveResource`.
            // Chaque élève dans cette collection sera transformé en utilisant la ressource `EleveResource`, ce qui permet
            // de contrôler les données renvoyées pour chaque élève.
            "eleves" => EleveResource::collection($this->eleves)
        ];
    }
}
