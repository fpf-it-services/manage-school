<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Mail;
use App\Mail\InscriptionEnAttente as InscriptionEnAttenteMail;
use App\Http\Controllers\Controller; 
use Illuminate\Http\JsonResponse;
use App\Http\Requests\AddEleveEnAttenteRequest;
use App\Models\EleveEnAttente;
use App\Mail\NotificationMailInscriptionAttente;
use App\Models\Ecole;

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
    public function register_student(AddEleveEnAttenteRequest $request){
        try {
            $photo = $request->file("photo")->store("eleves_attente/photos","public");
            $releve_de_notes = $request->file("releve_de_notes")?->store("eleves_attente/releve_de_notes","public");
            $releve_de_notes_examen = $request->file("releve_de_notes_examen")?->store("eleves_attente/releve_de_notes_examen","public");
            $acte_de_naissance = $request->file("acte_de_naissance")->store("eleves_attente/acte_de_naissance","public");
            $eleve = EleveEnAttente::create([
                "niveau_id" => $request->niveau,
                "ecole_id" => $request->ecole,
                "nom" => $request->nom,
                "prenoms" => $request->prenoms,
                "date_naissance" => $request->date_de_naissance,
                "lieu_naissance" => $request->lieu_de_naissance,
                "nationalite" => $request->nationalite,
                "sexe" => $request->sexe,
                "photo" => $photo,               //---------------
                "nom_complet_tuteur1" => $request->nom_tuteur1,
                "telephone_tuteur1" => $request->telephone_tuteur1,
                "adresse_tuteur1" => $request->adresse_tuteur1,
                "email_tuteur1" => $request->email_tuteur1,
                "nom_complet_tuteur2" => $request->nom_tuteur2,
                "telephone_tuteur2" => $request->telephone_tuteur2,
                "adresse_tuteur2" => $request->adresse_tuteur2,
                "email_tuteur2" => $request->email_tuteur2,
                "releve_de_notes" => $releve_de_notes,
                "releve_de_notes_examen" => $releve_de_notes_examen,
                "acte_de_naissance" => $acte_de_naissance
            ]);

            $mailData = [
                "email" => $eleve->email_tuteur1,
                "password" => "password",   // Récupère l'adresse de l'utilisateur,
                "ecole" => Ecole::where("id",$request->ecole)->first()->nom
            ];
            Mail::to($eleve->email_tuteur1)->send(new NotificationMailInscriptionAttente($mailData));
            return response()->json([], 201);
        } catch (\Exception $th) {
            return response()->json(["success" => false,"error" => "Une erreur est survenue"], 500);
        }
    }
}