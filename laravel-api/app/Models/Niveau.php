<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Niveau extends Model
{
    use HasFactory;
    protected $fillable = ["niveau"];
    public $timestamps = false;

    public function montants(){
        return $this->hasMany(Montant::class);
    }
}
