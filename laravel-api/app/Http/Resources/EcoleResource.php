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
     * Cette méthode transforme une instance de l'école (resource) en un tableau associatif contenant
     * des informations sur l'école, notamment son nom, logo, coordonnées, et la date de création.
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

            // Retourne l'URL du logo de l'école, en utilisant la méthode 'Storage::disk' pour accéder
            // à l'emplacement du fichier stocké sur le disque public et générer une URL publique.
            "logo" => Storage::disk("public")->url($this->logo),

            // Retourne le numéro de téléphone de l'école
            "telephone" => $this->telephone,

            // Retourne l'adresse email de l'école
            "email" => $this->email,

            // Retourne l'adresse physique de l'école
            "adresse" => $this->adresse,

            // Retourne le centre de composition associé à l'école
            "centre_de_composition" => $this->centre_de_composition,

            // Retourne la date de création de l'école formatée sous la forme 'jour/mois/année à heure:minute:seconde'
            "created_at" => $this->created_at->format('d/m/Y à H:i:s'),
        ];
    }
}
