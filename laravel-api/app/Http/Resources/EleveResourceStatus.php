<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;
use App\Models\Transaction;

class EleveResourceStatus extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * Cette méthode transforme une instance d'élève en un tableau associatif, tout en ajoutant une logique supplémentaire
     * pour déterminer si l'élève a payé les frais de réinscription pour sa classe.
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

            // Date de naissance formatée en 'd/m/Y'
            'date_naissance' => $this->date_naissance->format("d/m/Y"),

            // Lieu de naissance de l'élève
            'lieu_naissance' => $this->lieu_naissance,

            // Nationalité de l'élève
            'nationalite' => $this->nationalite,

            // Sexe de l'élève
            'sexe' => $this->sexe,

            // Photo de l'élève stockée sur le disque public, et générée avec une URL publique
            'photo' => Storage::disk("public")->url($this->photo),

            // Informations sur le premier tuteur
            'nom_complet_tuteur1' => $this->nom_complet_tuteur1,
            'telephone_tuteur1' => $this->telephone_tuteur1,
            'adresse_tuteur1' => $this->adresse_tuteur1,
            'email_tuteur1' => $this->email_tuteur1,

            // Informations sur le deuxième tuteur
            'nom_complet_tuteur2' => $this->nom_complet_tuteur2,
            'telephone_tuteur2' => $this->telephone_tuteur2,
            'adresse_tuteur2' => $this->adresse_tuteur2,
            'email_tuteur2' => $this->email_tuteur2,

            // Vérification si l'élève a payé les frais de réinscription pour la classe associée
            // Cette logique recherche une transaction correspondante aux frais de réinscription pour l'élève et la classe en question.
            "reinscris" => Transaction::where("eleve_id", $this->id)
                                      ->where("classe_id", $this->classe_id)
                                      ->where("type_frais", "frais_reinscription")
                                      ->first() != null
        ];
    }
}
