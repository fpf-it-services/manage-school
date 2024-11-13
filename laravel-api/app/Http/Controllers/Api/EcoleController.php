<?php

namespace App\Http\Controllers\Api;

use App\Models\Ecole;
use App\Models\Annee;
// use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\EcoleResource;
use App\Http\Resources\EcoleEleveResource;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\EcoleStoreRequest;
use App\Http\Requests\UpdateEcoleRequest;
use App\Http\Resources\EcoleAnneeClasseEleveResourceEcole;

class EcoleController extends Controller
{

    public function index()
    {
        return response()->json([
            "success" => true,
            "data" => EcoleResource::collection(Ecole::all())
        ]);
    }

    public function store(EcoleStoreRequest $request)
    {
        $logoPath = null;
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('logos', 'public');
        }
        $ecole = Ecole::create([
            'nom' => $request->nom,
            'email' => $request->email,
            'password' => bcrypt($request->password ?? "password"),
            'adresse' => $request->adresse,
            'telephone' => $request->contact,
            'logo' => $logoPath,
            // 'capacite' => $request->capacite ?? 0,
            'centre_de_composition' => $request->centre_de_composition == "true",
        ]);

        return response()->json([
            "success" => true,
            "data" => $ecole
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Ecole $ecole)
    {
        return response()->json([
            "success" => true,
            "data" => new EcoleResource($ecole)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateEcoleRequest $request)
    {
        $ecole = auth()->user();
        $logoPath = $ecole->logo;
        if ($request->hasFile('logo')) {
            if($logoPath  !== null){
                Storage::disk("public")->delete($logoPath);
            }
            $logoPath = $request->file('logo')->store('logos', 'public');
        }

        $ecole->update([
            'nom' => $request->nom,
            'email' => $request->email,
            'password' => $request->password ? bcrypt($request->password) : $ecole->password,
            'adresse' => $request->adresse,
            'telephone' => $request->contact ?? $ecole->telephone,
            'logo' => $logoPath,
            // 'capacite' => $request->capacite ?? $ecole->capacite,
            'centre_de_composition' => $request->centre_de_composition ?? $ecole->centre_de_composition,
        ]);
        return response()->json([
            "success" => true,
            "data" => new EcoleResource($ecole)
        ], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ecole $ecole)
    {
        $ecole->delete();
        return response()->json([

        ],204);
    }
    public function ecoles_eleves(Ecole $ecole)
    {
        return response()->json([
            "success" => true,
            "data" => EcoleEleveResource::collection(Ecole::with(["eleves","classes"])->get())
        ]);
    }
    // public function getEcolesAnneesClassesEleves(){
    //     $annees = Annee::all();
    //     session()->put("annees",$annees);
    //     $ecoles = Ecole::with(["classes.eleves"])->get();
    //     $es = collect();
    //     foreach($ecoles as $ecole){
    //         $ecole->annees = session()->get("annees");
    //         foreach($ecole->annees as $annee){
    //             $annee->classes = $this->getClasses($ecole,$annee);
    //         }
    //         //return $ecoles->first()->annees->first();
    //     }
    //     //return $es->first();
    //     return $ecoles->first()->annees->first();
    //     session()->forget("annees");
    //     return response()->json([
    //         "success" => true,
    //         "data" => EcoleAnneeClasseEleveResourceEcole::collection($ecoles)
    //     ]);
    // }
    public function getEcolesAnneesClassesEleves()
    {
        // Récupère toutes les années académiques
        $annees = Annee::all();

        // Charge toutes les écoles avec leurs classes et élèves
        $ecoles = Ecole::with(["classes.eleves"])->get();

        // Structure de la réponse JSON
        $responseData = $ecoles->map(function ($ecole) use ($annees) {
            return [
                'ecole_id' => $ecole->id,
                'nom' => $ecole->nom,
                'annees' => $annees->map(function ($annee) use ($ecole) {
                    // Récupère les classes de l'école pour l'année académique courante
                    $classes = $this->getClasses($ecole, $annee);
                    return [
                        'annee_id' => $annee->id,
                        'annee_academique' => $annee->annee_academique,  // Utilise l'année académique ici
                        'classes' => $classes->map(function ($classe) {
                            return [
                                'classe_id' => $classe->id,
                                'nom' => $classe->nom,
                                'eleves' => $classe->eleves->map(function ($eleve) {
                                    return [
                                        'eleve_id' => $eleve->id,
                                        'nom' => $eleve->nom,
                                        'prenom' => $eleve->prenoms,
                                    ];
                                })
                            ];
                        })
                    ];
                })
            ];
        });

        // Retourne la réponse structurée en JSON
        return response()->json([
            "success" => true,
            "data" => $responseData
        ]);
    }


    private function getClasses($ecole,$annee){
        return $ecole->classes->filter(function($classe) use ($annee){
            return $classe->created_at->isBefore($annee->date_fin);
        });
    }
}
