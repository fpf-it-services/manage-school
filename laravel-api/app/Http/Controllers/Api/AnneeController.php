<?php

namespace App\Http\Controllers\Api;

use App\Models\Annee;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\AnneeResource;
use App\Http\Requests\AddAnneeRequest;

class AnneeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json([
            "success" => true,
            "data" => AnneeResource::collection(Annee::all())
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(AddAnneeRequest $request)
    {
        return response()->json([
            "success" => true,
            "data" => new AnneeResource(Annee::create($request->all()))
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Annee $annee)
    {
        return response()->json([
            "success" => true,
            "data" => new AnneeResource($annee)
        ], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Annee $annee)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Annee $annee)
    {
        //
    }
    public function currentYear(){
        $lastYearCreated = Annee::orderByDesc("id")->first();
        if($lastYearCreated === null){
            return response()->json([
                "success" => false,
                "message" => "No année found"
            ], 404);
        }else{
            return response()->json([
                "success" => true,
                "data" => new AnneeResource($lastYearCreated)
            ], 200);
        }
    }
}
