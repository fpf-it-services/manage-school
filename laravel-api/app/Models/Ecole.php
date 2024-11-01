<?php

namespace App\Models;

use Laravel\Passport\HasApiTokens;
//use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Ecole extends Authenticatable
{
    use HasFactory,Notifiable, HasApiTokens;

    protected $fillable = [
        'nom',
        'email',
        'password',
        'adresse',
        'telephone',
        'logo',
        // 'capacite',
        'centre_de_composition',
    ];
    public function classes(){
        return $this->hasMany(Classe::class);
    }
    public function eleves(){
        return $this->belongsToMany(Eleve::class,"cursuses");
    }
}
