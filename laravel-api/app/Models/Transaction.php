<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;
    protected $fillable = [
        "id",
        "email",
        "annee_id",
        "eleve_id",
        "classe_id",
        "type_frais",
        "montant",
        "reference"
    ];
}