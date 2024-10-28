<?php

namespace App\Http\Controllers\Api;

use App\Models\Serie;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class SerieController extends Controller
{
    public function index(){
        return response()->json([
            "success" => true,
            "data" => Serie::all()
        ]);
    }
    public function store(Request $request){
        $request->validate([
            "serie" => "required|string|max:5|unique:series,serie"
        ]);

        return response()->json([
            "success" => true,
            "data" => Serie::create([
                "serie" => $request->serie
            ])
        ]);
    }
    public function destroy(Serie $serie){
        $serie->delete();
        return response()->json([],204);
    }
}
// ->
