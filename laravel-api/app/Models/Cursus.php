<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Cursus extends Model
{
    use HasFactory;
    protected $fillable = ['eleve_id', 'ecole_id', 'classe_id', 'annee_id', 'decision'];
}