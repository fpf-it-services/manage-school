<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

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
        "reference",
        "recu"
    ];

    public function eleve(){
        return $this->belongsTo(Eleve::class);
    }
    public function classe(){
        return $this->belongsTo(Classe::class);
    }
    public static function getTransactionsTypes(){
        return ["frais_inscription","frais_formation","frais_annexe"];
    }
}