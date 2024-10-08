<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Eleve extends Model
{
    use HasFactory;
    protected $fillable = [
        'nom',
        'prenoms',
        'date_naissance',
        'lieu_naissance',
        'nationalite',
        'sexe',
        'photo',
        'nom_complet_tuteur1',
        'telephone_tuteur1',
        'adresse_tuteur1',
        'email_tuteur1',
        'nom_complet_tuteur2',
        'telephone_tuteur2',
        'adresse_tuteur2',
        'email_tuteur2'
    ];
    protected $casts = ["date_naissance" => "date"];
}