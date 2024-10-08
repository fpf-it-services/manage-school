<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Niveau;

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
}
