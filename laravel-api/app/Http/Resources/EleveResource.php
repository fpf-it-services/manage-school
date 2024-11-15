<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class EleveResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * Cette méthode transforme une instance d'élève en un tableau associatif, incluant des informations complètes
     * sur l'élève telles que ses informations personnelles, sa photo, ainsi que celles de ses tuteurs.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            // Identifiant unique de l'élève
            'id' => $this->id,

            // Nom de l'élève
            'nom' => $this->nom,

            // Prénoms de l'élève
            'prenoms' => $this->prenoms,

            // Date de naissance de l'élève formatée en 'd/m/Y'
            'date_naissance' => $this->date_naissance->format("d/m/Y"),

            // Lieu de naissance de l'élève
            'lieu_naissance' => $this->lieu_naissance,

            // Nationalité de l'élève
            'nationalite' => $this->nationalite,

            // Sexe de l'élève
            'sexe' => $this->sexe,

            // Photo de l'élève stockée dans le disque public, avec une URL accessible
            'photo' => Storage::disk("public")->url($this->photo),

            // Nom complet du premier tuteur
            'nom_complet_tuteur1' => $this->nom_complet_tuteur1,

            // Téléphone du premier tuteur
            'telephone_tuteur1' => $this->telephone_tuteur1,

            // Adresse du premier tuteur
            'adresse_tuteur1' => $this->adresse_tuteur1,

            // Email du premier tuteur
            'email_tuteur1' => $this->email_tuteur1,

            // Nom complet du deuxième tuteur
            'nom_complet_tuteur2' => $this->nom_complet_tuteur2,

            // Téléphone du deuxième tuteur
            'telephone_tuteur2' => $this->telephone_tuteur2,

            // Adresse du deuxième tuteur
            'adresse_tuteur2' => $this->adresse_tuteur2,

            // Email du deuxième tuteur
            'email_tuteur2' => $this->email_tuteur2,
        ];
    }
}
