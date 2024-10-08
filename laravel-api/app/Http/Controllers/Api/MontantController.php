<?php

namespace App\Http\Controllers\Api;

use App\Models\Annee;
use App\Models\Niveau;
use App\Models\Montant;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Gate;
use App\Http\Resources\MontantResource;
use App\Http\Requests\AddMontantRequest;
use App\Http\Requests\EditMontantRequest;
use App\Http\Resources\LevelMontantResource;

class MontantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $annee_courante = Annee::orderBy("id","desc")->first("id");
        if($annee_courante === null)
            return response()->json([
                "success" => false,
                "message" => "Aucune année définie",
            ],404);

        $niveaus = Niveau::with(["montants" => function($query) use ($annee_courante){
            $query->where("ecole_id", "=", auth()->id())->where("annee_id",$annee_courante->id);
        }])->get();


        return response()->json([
            "success"=> true,
            "data" => LevelMontantResource::collection($niveaus)
        ]);

    }
    public function montant_niveau(Request $request){
        $request->validate([
            "niveau_id" => "required|exists:niveaux,id",
        ]);
        $annee_courante = Annee::orderBy("id","desc")->first("id");
        if($annee_courante === null)
            return response()->json([
                "success" => false,
                "message" => "Aucune année définie",
            ],404);


        return response()->json([
            "success" => true,
            "data" => MontantResource::collection(Montant::where("niveau_id", $request->niveau_id)
                                        ->where("ecole_id", auth()->id())
                                        ->where("annee_id",$annee_courante->id)
                                        ->get())
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(AddMontantRequest $request)
    {
        return response()->json([
            "sucess" => true,
            "data" => new MontantResource
                (
                Montant::create
                    (
                        array_merge($request->validated(),["ecole_id" => auth()->id()])
                    )
                )
        ],201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Montant $montant)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(EditMontantRequest $request, Montant $montant)
    {
        if(Gate::allows("update-montant",$montant)){
            $montant->update($request->validated());
            return response()->json([
                "sucess" => true,
                "data" => new MontantResource($montant)
            ]);
        }
       return response()->json([
        "success" => false,
        "message" => "Accès non autorisé"
       ],403);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Montant $montant)
    {
        //
    }
}
