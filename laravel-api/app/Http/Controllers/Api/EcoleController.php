<?php

namespace App\Http\Controllers\Api;

use App\Models\Ecole;
// use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\EcoleResource;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\EcoleStoreRequest;
use App\Http\Requests\UpdateEcoleRequest;

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
            'centre_de_composition' => $request->centre_de_composition == 'true',
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
}
