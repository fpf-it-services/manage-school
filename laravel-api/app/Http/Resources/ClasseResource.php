<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClasseResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * Cette méthode transforme l'objet `Classe` en un tableau associatif qui sera renvoyé sous forme de réponse JSON.
     * Elle inclut non seulement les informations de la classe elle-même, mais aussi les élèves qui lui sont associés, 
     * en les formatant à l'aide d'une autre ressource (EleveResourceStatus).
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // Récupération de l'identifiant de la classe
        $classe_id = $this->id;
        
        return [
            // Retourne l'identifiant unique de la classe
            "id" => $this->id,
            
            // Retourne le nom de la classe
            "nom" => $this->nom,
            
            // Retourne l'effectif maximum de la classe
            "effectif_max" => $this->effectif_max,
            
            // Retourne une collection des élèves associés à cette classe,
            // en formatant chaque élève à l'aide de la ressource EleveResourceStatus.
            // La méthode `map` permet de modifier chaque élève avant de le transmettre à la ressource.
            "eleves" => EleveResourceStatus::collection($this->eleves->map(function($eleve) use ($classe_id){
                // On ajoute l'identifiant de la classe à chaque élève pour l'inclure dans les données retournées
                $eleve->classe_id = $classe_id;
                
                // Retourne l'objet élève modifié
                return $eleve;
            }))
        ];
    }
}
