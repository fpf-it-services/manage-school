<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Montant extends Model
{
    use HasFactory;

    protected $fillable = [
        "ecole_id",
        "niveau_id",
        "serie_id",
        "annee_id",
        "frais_inscription",
        "frais_reinscription",
        "frais_formation",
        "frais_annexe",
        "tranche1",
        "tranche2",
        "tranche3"
    ];
}
