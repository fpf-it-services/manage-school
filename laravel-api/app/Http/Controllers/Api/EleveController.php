<?php

namespace App\Http\Controllers\Api;

use App\Models\Annee;
use App\Models\Eleve;
use App\Models\Cursus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Resources\EleveResource;
use App\Http\Requests\AddEleveRequest;

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
    public function store(AddEleveRequest $request)
    {
        DB::beginTransaction();
        try {
            $eleve = Eleve::create(array_merge($request->safe([
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
            ]),['photo' => $request->file("photo")->store("eleves_photos","public")]));
            $cursus = Cursus::create([
                'eleve_id' => $eleve->id,
                'ecole_id' => auth()->id(),
                'classe_id' => $request->get("classe_id"),
                'annee_id' => Annee::orderByDesc("id")->first("id")->id,
                'decision'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                "success" => false,
                "message" => "Une erreur est survenue"
            ],500);
        }
        DB::commit();
        return response()->json(["success" => true, "data" => new EleveResource($eleve)]);
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
}
