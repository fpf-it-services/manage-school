<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class PendingStudentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "niveau_id" => $this->niveau->niveau,
            "ecole_id" => $this->ecole->nom,
            "nom" => $this->nom,
            "prenoms" => $this->prenoms,
            "date_naissance" => $this->date_naissance->format("d/m/Y"),
            "lieu_naissance" => $this->lieu_naissance,
            "nationalite" => $this->nationalite,
            "sexe" => $this->sexe,
            "photo" => Storage::disk("public")->url($this->photo),
            "nom_tuteur1" => $this->nom_complet_tuteur1,
            "telephone_tuteur1" => $this->telephone_tuteur1,
            "adresse_tuteur1" => $this->adresse_tuteur1,
            "email_tuteur1" => $this->email_tuteur1,
            "nom_tuteur2" => $this->nom_complet_tuteur2,
            "telephone_tuteur2" => $this->telephone_tuteur2,
            "adresse_tuteur2" => $this->adresse_tuteur2,
            "email_tuteur2" => $this->email_tuteur2,
            "releve_de_notes" => Storage::disk("public")->url($this->releve_de_notes),
            "releve_de_notes_examen" => Storage::disk("public")->url($this->releve_de_notes_examen),
            "acte_de_naissance" => Storage::disk("public")->url($this->acte_de_naissance),
            "date_depot" => $this->updated_at->format("d/m/Y H:i:s"),
        ];
    }
}
