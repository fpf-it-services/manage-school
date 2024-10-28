<?php

namespace App\Http\Controllers\Api;

use Exception;
use App\Models\Annee;
use App\Models\Eleve;
use App\Models\Cursus;
use App\Models\Classe;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Resources\EleveResource;
use App\Http\Requests\AddEleveRequest;
use Illuminate\Support\Facades\Storage;

class EleveController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {

    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(AddEleveRequest $request): JsonResponse
    {
        $annee_id = Annee::orderByDesc("id")->first("id")?->id;
        if($annee_id == null){
            return response()->json([
                "success" => false,
                "message" => "Aucune année enregistrée."
            ],422);
        }
        $student_infos = $request->safe([
            'nom',
            'prenoms',
            'date_naissance',
            'lieu_naissance',
            'nationalite',
            'sexe',
            'nom_complet_tuteur1',
            'telephone_tuteur1',
            'adresse_tuteur1',
            'email_tuteur1',
            'nom_complet_tuteur2',
            'telephone_tuteur2',
            'adresse_tuteur2',
            'email_tuteur2'
        ]);
        $student_infos["photo"] = null;
        if($request->hasFile("photo")){
            $student_infos["photo"] = $request->file("photo")->store("eleves_photos","public");
        }
        $eleve = $this->storeStudent($student_infos,$annee_id,$request->input("classe_id"));
        // DB::beginTransaction();
        // try {
        //     $eleve = Eleve::create(array_merge($request->safe([
        //         'nom',
        //         'prenoms',
        //         'date_naissance',
        //         'lieu_naissance',
        //         'nationalite',
        //         'sexe',
        //         'nom_complet_tuteur1',
        //         'telephone_tuteur1',
        //         'adresse_tuteur1',
        //         'email_tuteur1',
        //         'nom_complet_tuteur2',
        //         'telephone_tuteur2',
        //         'adresse_tuteur2',
        //         'email_tuteur2'
        //     ]),['photo' => $request->file("photo")->store("eleves_photos","public")]));
        //     $cursus = Cursus::create([
        //         'eleve_id' => $eleve->id,
        //         'ecole_id' => auth()->id(),
        //         'classe_id' => $classe_id,
        //         'annee_id' => $annee_id
        //     ]);
        //     $success = true;
        // } catch (\Exception $e) {
        //     DB::rollBack();
        // }
        // DB::commit();
        if($eleve != null){
            return response()->json(["success" => true, "data" => new EleveResource($eleve)]);
        }else{
            if($student_infos["photo"] != null){
                try {
                    Storage::disk("public")->delete($student_infos["photo"]);
                } catch (Exception $th) {
                }
            }
            return response()->json([
                "success" => false,
                "message" => "Une erreur est survenue"
            ],500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Eleve $eleve)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Eleve $eleve)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Eleve $eleve)
    {
        //
    }
    private function storeStudent($student_infos,$annee_id,$classe_id){
        DB::beginTransaction();
        try {
            $eleve = Eleve::create($student_infos);
            Cursus::create([
                'eleve_id' => $eleve->id,
                'ecole_id' => auth()->id(),
                'classe_id' => $classe_id,
                'annee_id' => $annee_id
            ]);
        } catch (Exception $e) {
            DB::rollBack();
        }
        DB::commit();
        return [$eleve ?? null];
    }
    public function ajout_eleve_classe(Request $request,Classe $classe){
        $request->validate([
            'eleves' =>'required|array'
        ]);
        $data = $request->input('eleves');
        $annee_id = Annee::orderByDesc("id")->first("id")?->id;
        if($annee_id == null){
            return response()->json([
                "success" => false,
                "message" => "Aucune année enregistrée."
            ],422);
        }
        $eleves = collect();
        foreach($data as $student_infos){
            $student_infos["photo"] = null;
            $eleve = $this->storeStudent($student_infos,$annee_id,$classe->id)[0];
            if($eleve != null)
                $eleves->add($eleve);
        }
        return response()->json([
            "success" => true,
            "data" => EleveResource::collection($eleves)
        ]);
    }
}
