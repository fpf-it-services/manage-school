<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class EcoleResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id" => $this->id,
            "nom" => $this->nom,
            "logo" => Storage::disk("public")->url($this->logo),
            "telephone" => $this->telephone,
            "email" => $this->email,
            "adresse" => $this->adresse,
            // "capacite" => $this->capacite,
            "centre_de_composition" => $this->centre_de_composition,
            "created_at" => $this->created_at->format('d/m/Y à H:i:s'),
        ];
    }
}
