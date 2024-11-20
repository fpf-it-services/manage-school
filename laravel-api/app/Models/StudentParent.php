<?php

namespace App\Models;

use Laravel\Passport\HasApiTokens;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class StudentParent extends Authenticatable
{
    use HasFactory,Notifiable, HasApiTokens;
    public $timestamps = false;
    protected $fillable = [
        "nom",
        "email",
        "password"
    ];
}

