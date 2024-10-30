<?php

namespace App\Http\Controllers\Api;

use App\Models\Niveau;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class NiveauController extends Controller
{
    public function index(){
        return response()->json([
            "success" => true,
            "data" => Niveau::all()
        ]);
    }
    public function store(Request $request){
        $request->validate([
            "niveau" => "required|string|max:10"
        ]);

        return response()->json([
            "success" => true,
            "data" => Niveau::create([
                "niveau" => $request->niveau
            ])
        ]);
    }
    public function destroy(Niveau $niveau){
        $niveau->delete();
        return response()->json([
        ],204);
    }
    public function mes_niveaux(){
        return response()->json([
            "success" => true,
            "data"=> Niveau::whereIn(
                    "id",
                    Montant::where(
                            "ecole_id",
                            auth()->user()->id
                        )->get("id")->pluck("niveau_id")
                )->get()
        ]);
    }
}
