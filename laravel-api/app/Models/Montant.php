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
        "echeance_tranche1",
        "tranche2",
        "echeance_tranche2",
        "tranche3",
        "echeance_tranche3",
    ];

    protected function casts(): array
    {
        return [
            'echeance_tranche1' => 'date',
            'echeance_tranche2' => 'date',
            'echeance_tranche3' => 'date',
        ];
    }

    public function scopeWithUpcomingDueDates($query)
    {
        return $query->whereDate('echeance_tranche1', '>=', now())
                     ->orWhereDate('echeance_tranche2', '>=', now())
                     ->orWhereDate('echeance_tranche3', '>=', now());
    }

}


