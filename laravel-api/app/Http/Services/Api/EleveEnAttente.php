<?php

namespace App\Http\Services\Api;

use Illuminate\Support\Facades\Storage;
use App\Models\EleveEnAttente as Model;
use App\Http\Services\Api\MontantService;

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
}
