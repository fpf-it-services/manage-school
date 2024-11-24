<?php

namespace App\Http\Services\Api;

use Illuminate\Support\Facades\Storage;
use App\Models\EleveEnAttente as Model;
use App\Models\Eleve;
use App\Models\Annee;
use App\Models\Transaction;
use App\Http\Services\Api\MontantService;
use DB;
use App\Models\Cursus;
use App\Http\Services\Api\ClasseService;

class EleveEnAttente
{
    public static function getJsonArray($eleves){
        $datas = [];
        foreach ($eleves as $eleve) {
            if(!($eleve->status === null || $eleve->status === 'accepte')){
                $data = [
                    "id" => $eleve->id,
                    "nom" => $eleve->nom,
                    "prenoms" => $eleve->prenoms,
                    "ecole" => $eleve->ecole->nom,
                    "niveau" => $eleve->niveau->niveau,
                    "photo" => Storage::disk("public")->url($eleve->photo),
                    "status" => $eleve->status,
                ];
                if($eleve->status === 'attente_paiement'){
                    $data["status"] = "accepte";
                    $data["ecole_id"] = $eleve->ecole->id;
                    $data["niveau_id"] = $eleve->niveau->id;
                    $data["montant_inscription"] = MontantService::getMontantOfInfos($eleve->ecole->id,$eleve->niveau->id,$eleve->serie_id)?->frais_inscription;
                }
                if($eleve->status === 'modifiable' || $eleve->status === 'rejete'){
                    $data["motif"] = $eleve->motif;
                    if($eleve->status === 'modifiable'){
                        $data["status"] = "rejete_partiellement";
                        try {
                            $champs = json_decode($eleve->champs,true) ?? [];
                            $data["champs"] = json_encode($eleve->champs,true) ?? [];
                            $data["fields"] = [];
                            foreach ($champs as $champ) {
                                $rules = Model::getFieldsValidation()[$champ];
                                if($eleve[$champ] != null){
                                    if(in_array("file",$rules) || in_array("image",$rules)){
                                        $data["fields"][$champ] = Storage::disk("public")->url($eleve[$champ]);
                                    }else{
                                        $data["fields"][$champ] = $eleve[$champ];
                                    }
                                }else{
                                    $data["fields"][$champ] = null;
                                }
                            }
                        } catch (\Exception $th) {
            
                        }
                    }
                }
                $datas[] = $data;
            }
        }
        return $datas;
    }
    public function getStudents($eleves){
        $datas = [];
        foreach ($eleves as $eleve) {
            $data = [
                "nom" => $eleve->nom,
                "prenoms" => $eleve->prenoms,
                "photo" => Storage::disk("public")->url($eleve->photo),
            ];
        }
        return $datas;
    }
    public static function acceptPendingStudent(Model $eleve,$ref,$montant,$email = null){
        $eleveInscrit = null;
        DB::beginTransaction();

        try {
            $eleveInscrit = Eleve::create(
                [
                    "nom" => $eleve->nom,
                    "prenoms" => $eleve->prenoms,
                    "date_naissance" => $eleve->date_naissance->format("Y-d-m"),
                    "lieu_naissance" => $eleve->lieu_naissance,
                    "nationalite" => $eleve->nationalite,
                    "sexe" => $eleve->sexe,
                    "photo" => $eleve->photo,
                    "nom_complet_tuteur1" => $eleve->nom_complet_tuteur1,
                    "telephone_tuteur1" => $eleve->telephone_tuteur1,
                    "adresse_tuteur1" => $eleve->adresse_tuteur1,
                    "email_tuteur1" => $eleve->email_tuteur1,
                    "nom_complet_tuteur2" => $eleve->nom_complet_tuteur2,
                    "telephone_tuteur2" => $eleve->telephone_tuteur2,
                    "adresse_tuteur2" => $eleve->adresse_tuteur2,
                    "email_tuteur2" => $eleve->email_tuteur2,
                ]
            );
            $eleve->update([
                "status" => "accepte"
            ]);
            $classe_id = ClasseService::getFreeClassByInfos($eleve->ecole_id,$eleve->niveau_id,$eleve->serie_id);
            if($classe_id == null){
                throw new \Exception("Aucune classe disponible", 1);
            }
            $annee_id = Annee::orderByDesc("id")->first()?->id;
            if($annee_id == null){
                throw new \Exception("Aucune année créée", 1);
            }
            Cursus::create([
                'eleve_id' => $eleveInscrit->id,
                'ecole_id' => $eleve->ecole_id,
                'classe_id' => $classe_id,
                'annee_id' => $annee_id
            ]);
            Transaction::create([
                "email" => $email ?? $eleve->email_tuteur1,
                "annee_id" => $annee_id,
                "eleve_id" => $eleveInscrit->id,
                "classe_id" => $classe_id,
                "type_frais" => "frais_inscription",
                "montant" => $montant,
                "reference" => $ref
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            if($e->getMessage() == "Aucune classe disponible" || $e->getMessage() == "Aucune année créée"){
                return [null,$e->getMessage(),404];
            }
            return [null,"Une erreur est survenue",500];
        }

        DB::commit();
        return [0,"Opération réussie",200]; 
    }
}