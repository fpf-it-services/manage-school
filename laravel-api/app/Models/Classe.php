<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Classe extends Model
{
    use HasFactory;
    protected $fillable = ['ecole_id', 'nom', 'niveau_id', 'serie_id','effectif_max'];

    public function ecole(){
        return $this->belongsTo(Ecole::class);
    }
    // public function niveau(){
    //     return $this->belongsTo(Niveau::class);
    // }
    // public function serie(){
    //     return $this->belongsTo(Serie::class);
    // }
    public function eleves(){
        return $this->belongsToMany(Eleve::class,"cursuses");
    }
}
