<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\EleveEnAttente;
use App\Models\Eleve;
use App\Http\Services\Api\EleveEnAttente as Service;
use Illuminate\Support\Facades\Storage;
use App\Http\Resources\EleveNomPrenomResource;

class ParentController extends Controller
{
    public function eleve_en_attentes(){
        //rejete_partiellement
        //accepte
        //rejete
        return response()->json([
            'success' => true,
            'data' => Service::getJsonArray(EleveEnAttente::where("email_tuteur1",auth()->user()->email)->with(["ecole","niveau"])->get())
        ], 200);
    }
    public function eleves(){
        $eleves_acceptes = EleveEnAttente::where("email_tuteur1",auth()->user()->email)->where("status","attente_paiement")->get();
        $eleves_inscrits = Eleve::where("email_tuteur1",auth()->user()->email)->get();
        return response()->json([
            'success' => true,
            'data' => [
                "acceptes" => EleveNomPrenomResource::collection($eleves_acceptes),
                "inscrits" => EleveNomPrenomResource::collection($eleves_inscrits)
            ]
        ], 200);
    }
    public function updatePendingStudent(Request $request,$id){
        $eleve = EleveEnAttente::find($id);
        if($eleve == null){
            return response()->json([
                'success' => false,
                'error' => [
                    "message" => "Eleve non retrouvé"
                ]
            ], 200);
        }
        if($eleve->email_tuteur1 !== auth()->user()->email){
            return response()->json([
                'success' => false,
                'error' => [
                    "message" => "Action non autorisée"
                ]
            ], 403);
        }
        //  'accepte','rejete','modifiable','attente_paiement'
        if($eleve->status === 'modifiable'){
            try {
                $champs = json_decode($eleve->champs,true) ?? [];
                $validationData = [];
                foreach($champs as $champ){
                    try {
                        $validationData[$champ] = EleveEnAttente::getFieldsValidation()[$champ];
                    } catch (\Exception $th) {
                        return response()->json([
                            'success' => false,
                            'error' => [
                                "message" => "Le champ $champ est inconnu"
                            ]
                        ], 422);
                    }
                }
                //dd($validationData);
                $request->validate($validationData);
                if(count($champs) != 0){
                    $textFields = [];
                    $filesInputs = [];
                    $dataForUpdated = [];
                    foreach ($champs as $champ) {
                        if(in_array("file",$validationData[$champ]) || in_array("image",$validationData[$champ])){
                            $filesInputs[] = $champ;
                        }else{
                            $textFields[] = $champ;
                            $dataForUpdated[$champ] = $request->input($champ);
                        }
                    }
                    foreach ($filesInputs as $fileName) {
                        $dossiers = EleveEnAttente::getStorageFolders();
                        $dataForUpdated[$fileName] = $request->file($fileName)?->store("eleves_attente/" . $dossiers[$fileName],"public");
                        if($eleve[$fileName])
                        Storage::disk("public")->delete($eleve[$fileName]);
                    }
                    $eleve->update($dataForUpdated);
                    return response()->json([
                        'success' => true,
                    ], 200);
                }
            } catch (\Exception $th) {
                if($th instanceof \Illuminate\Validation\ValidationException){
                    throw $th;
                }
                return response()->json([
                    'success' => false,
                    'error' => [
                        "message" => "Une erreur est survenue"
                    ]
                ], 500);
            }
        }else{
            return response()->json([
                'success' => false,
                'error' => [
                    "message" => "Vous n'êtes pas autorisé à effecturer cette action"
                ]
            ], 403);
        }
    }
}
