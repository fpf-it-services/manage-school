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
        "acte_de_naissance",
        "status",
        "champs",
        "motif"
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
    public static function getFieldsValidation(){
        return [
            "nom" => ["required", "string","min:3"],
            "prenoms" => ["required", "string","min:3"],
            "date_naissance" => ["required", "date","before:" . now()->subYears(5)],
            "lieu_naissance" => ["required", "string"],
            "nationalite" => ["required", "string"],
            "sexe" => ["required", "in:M,F"],
            "photo" => ["required","image","max:4048"],
            "nom_tuteur1" => ["required", "string","min:7"],
            "telephone_tuteur1" => ["required", "string","min:8"],
            "email_tuteur1" => ["required", "email"],
            "adresse_tuteur1" => ["required", "string","min:3"],
            "nom_tuteur2" => ["nullable", "string","min:7"],
            "telephone_tuteur2" => ["nullable", "string","min:8"],
            "email_tuteur2" => ["nullable", "email"],
            "adresse_tuteur2" => ["nullable", "string","min:3"],
            "releve_de_notes" => ["nullable", "file"],
            "releve_de_notes_examen" => ["nullable", "file"],
            "acte_de_naissance" => ["required", "file"],
        ];
    }
    public static function getStorageFolders(){
        return  [
            "photo" => "photos",
            "releve_de_notes" => "releve_de_notes",
            "releve_de_notes_examen" => "releve_de_notes_examen",
            "acte_de_naissance" => "acte_de_naissance"
        ];
    }
}