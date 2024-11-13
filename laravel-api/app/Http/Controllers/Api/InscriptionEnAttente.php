<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Mail;
use App\Mail\InscriptionEnAttente as InscriptionEnAttenteMail;
use App\Http\Controllers\Controller; 
use Illuminate\Http\JsonResponse;

class InscriptionEnAttente extends Controller
{
    /**
     * User registration
     */
    public function register(Request $request): JsonResponse
    {
        $mailData = [
            "nom" => $request->input("name"),
            "email" => $request->input("email"),
            "adresse" => $request->input("address"),
            "telephone" => $request->input("phone")
        ];
        Mail::to("fadelsew@gmail.com")->send(new InscriptionEnAttenteMail($mailData));
        return response()->json([
            'success' => true,
        ], 200);
    }
}

