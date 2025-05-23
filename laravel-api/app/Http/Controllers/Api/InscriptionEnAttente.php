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
use App\Models\StudentParent;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Http\Resources\PendingStudentResource;
use App\Mail\NotificationEtatInscriptionEnAttente;

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
            if(StudentParent::where("email",$request->email_tuteur1)->first("email") == null){
                $password = Str::random(10);
                $studentParent = StudentParent::create([
                    "nom" => $request->nom_tuteur1,
                    "email" => $request->email_tuteur1,
                    "password" => Hash::make($password)
                ]);
                $mailData = [
                    "email" => $studentParent->email,
                    "password" => $password,   // Récupère l'adresse de l'utilisateur,
                    "ecole" => Ecole::where("id",$request->ecole)->first()->nom,
                    "nouveau" => true,
                    "eleve" => $eleve->nom . ' ' . $eleve->prenoms,
                ];
                Mail::to($studentParent->email)->send(new NotificationMailInscriptionAttente($mailData));
            }else{
                $mailData = [
                    "eleve" => $eleve->nom . ' ' . $eleve->prenoms,
                    "nouveau" => false,
                    "ecole" => Ecole::where("id",$request->ecole)->first()->nom
                ];
                Mail::to($request->email_tuteur1)->send(new NotificationMailInscriptionAttente($mailData));
            }
            return response()->json([], 201);
        } catch (\Exception $th) {
            return response()->json(["success" => false,"error" => "Une erreur est survenue"], 500);
        }
    }
    public function getRegistredStudent(){
        return response()->json([
            'success' => true,
            'data' => PendingStudentResource::collection(EleveEnAttente::where("ecole_id",auth()->user()->id)->where(function($query){
                $query->where("status",null)->orWhere("status",'modifiable');
            })->with(["ecole", "niveau"])->get()),
        ], 200);
    }
    private function setStatus(EleveEnAttente $eleve,$status){
        if($eleve->status == "rejete" || $eleve->status == "accepte"|| $eleve->status == "attente_paiement")
            return;
        $eleve->update([
            "status" => $status
        ]);
    }
    public function setStatusEleve(Request $request,$id){
        if($request->status !=='accepte' && $request->status !=='rejete' && $request->status !=='rejete_partiellement'){
            return response()->json([
                'success' => false,
                'error' => [
                    "status" => "Le status doit être accepte,rejete ou rejete_partiellement"
                ],
            ], 422);
        }
        if(($request->status ==='rejete' || $request->status ==='rejete_partiellement') && $request->motif == null){
            return response()->json([
                'success' => false,
                'error' => [
                    "motif" => "Le motif est obligatoire"
                ],
            ], 422);
        }
        $eleve = EleveEnAttente::where("id",$id)->where("ecole_id",auth()->user()?->id)->first();
        if($eleve == null){
            return response()->json([
                'success' => false
            ], 404);
        }
        $status = $request->status;
        if($status === "rejete_partiellement"){
            $status = "modifiable";
        }elseif($status === "accepte"){
            $status = "attente_paiement";
        }
        //$this->setStatus($eleve,$status);
        if($eleve->status == "rejete" || $eleve->status == "accepte"|| $eleve->status == "attente_paiement")
            return response()->json([
                'success' => false
            ], 404);
        $updatedData = [
            "status" => $status
        ];
        if($request->status !=='accepte'){
            $updatedData["motif"] = $request->motif;
        }
        if($request->status ==='rejete_partiellement'){
            try {
                $updatedData["champs"] = json_encode($request->champs ?? []);
            } catch (\Exception $th) {

            }
        }
        $eleve->update($updatedData);
        $mailData = [
            "ecole" => Ecole::where("id",$eleve->ecole_id)->first()->nom,
            "motif" => null,
            "champs" => [],
            "etat" => "    ",
            "eleve" => $eleve->nom . ' ' . $eleve->prenoms,
        ];
        if($request->status !=='accepte'){
            $mailData["motif"] = $request->motif;
        }
        if($request->status ==='accepte'){
            $mailData["etat"] = "acceptée et vous devez payer les frais d'inscription pour que l'inscription soit prise en compte";
        }else if($request->status ==='rejete'){
            $mailData["etat"] = "rejetée";
        }else if($request->status ==='rejete_partiellement'){
            $mailData["etat"] = "rejetée sous réserve que vous modifiez le dossier en modifiant les informations demandées";
            try {
                $mailData["champs"] = $request->champs ?? [];
            } catch (\Exception $th) {

            }
        }
        //Mail::to($eleve->email_tuteur1)->send(new NotificationEtatInscriptionEnAttente($mailData));
        return response()->json([
            'success' => true
        ], 200);
    }
}