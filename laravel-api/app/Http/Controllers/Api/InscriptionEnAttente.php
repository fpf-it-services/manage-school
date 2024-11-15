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
     * Méthode d'enregistrement de l'utilisateur
     * Cette méthode envoie un e-mail de notification pour informer
     * qu'une inscription est en attente.
     */
    public function register(Request $request): JsonResponse
    {
        // Récupère les informations de l'utilisateur à partir de la requête HTTP
        // pour les inclure dans le contenu de l'e-mail
        $mailData = [
            "nom" => $request->input("name"),          // Récupère le nom de l'utilisateur
            "email" => $request->input("email"),       // Récupère l'adresse e-mail de l'utilisateur
            "adresse" => $request->input("address"),   // Récupère l'adresse de l'utilisateur
            "telephone" => $request->input("phone")    // Récupère le numéro de téléphone de l'utilisateur
        ];

        // Envoie l'e-mail à l'adresse spécifiée avec les informations d'inscription en attente
        Mail::to("fadelsew@gmail.com")->send(new InscriptionEnAttenteMail($mailData));

        // Retourne une réponse JSON indiquant le succès de l'envoi de l'e-mail
        return response()->json([
            'success' => true,
        ], 200);
    }
}
