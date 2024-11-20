<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EleveEnAttente extends Model
{
    use HasFactory;
    protected $fillable = [
        "niveau_id",
        "ecole_id",
        "nom",
        "prenoms",
        "date_naissance",
        "lieu_naissance",
        "nationalite",
        "sexe",
        "photo",
        "nom_complet_tuteur1",
        "telephone_tuteur1",
        "adresse_tuteur1",
        "email_tuteur1",
        "nom_complet_tuteur2",
        "telephone_tuteur2",
        "adresse_tuteur2",
        "email_tuteur2",
        "releve_de_notes",
        "releve_de_notes_examen",
        "acte_de_naissance"
    ];
    public function ecole(){
        return $this->belongsTo(Ecole::class);
    }
    public function niveau(){
        return $this->belongsTo(Niveau::class);
    }
    public function casts(){
        return [
            "date_naissance" => "datetime",
        ];
    }
}