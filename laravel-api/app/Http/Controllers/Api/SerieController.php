<?php

namespace App\Http\Controllers\Api;

use App\Models\Serie;  
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class SerieController extends Controller
{
    /**
     * Affiche une liste de toutes les séries.
     * Cette méthode récupère toutes les séries de la base de données et les renvoie sous forme de réponse JSON.
     */
    public function index(){
        return response()->json([
            "success" => true,  // Indique que l'opération a réussi
            "data" => Serie::all()  // Récupère toutes les séries de la base de données via le modèle Serie
        ]);
    }

    /**
     * Crée une nouvelle série.
     * Cette méthode valide les données d'entrée pour la série, et crée ensuite une nouvelle série dans la base de données.
     */
    public function store(Request $request){
        // Validation de la requête : s'assure que la série est une chaîne de caractères de 5 caractères maximum,
        // et qu'elle est unique dans la table 'series'.
        $request->validate([
            "serie" => "required|string|max:5|unique:series,serie"
        ]);

        // Création d'une nouvelle série dans la base de données avec les données validées et retour de la série créée
        return response()->json([
            "success" => true,  // Indique que l'opération a réussi
            "data" => Serie::create([
                "serie" => $request->serie  // La série est récupérée de la requête et enregistrée dans la base de données
            ])
        ]);
    }

    /**
     * Supprime une série spécifique.
     * Cette méthode supprime une série de la base de données, puis renvoie une réponse avec un code HTTP 204,
     * ce qui signifie que la suppression a réussi et qu'il n'y a pas de contenu supplémentaire à retourner.
     */
    public function destroy(Serie $serie){
        $serie->delete();  // Supprime la série de la base de données
        return response()->json([],204);  // Retourne un code HTTP 204 (No Content) pour indiquer une suppression réussie
    }
}
