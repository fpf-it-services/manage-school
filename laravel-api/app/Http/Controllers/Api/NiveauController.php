<?php

namespace App\Http\Controllers\Api;

use App\Models\Niveau;
use App\Models\Montant;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class NiveauController extends Controller
{
    /**
     * Affiche une liste de tous les niveaux.
     * Cette méthode récupère tous les niveaux de la base de données et les retourne sous forme de réponse JSON.
     */
    public function index(){
        return response()->json([
            "success" => true,
            "data" => Niveau::all()  // Récupère tous les niveaux de la base de données
        ]);
    }

    /**
     * Crée un nouveau niveau.
     * Cette méthode valide les données d'entrée et crée un niveau dans la base de données.
     */
    public function store(Request $request){
        // Validation des données de la requête pour s'assurer que le niveau est une chaîne de caractères de maximum 10 caractères
        $request->validate([
            "niveau" => "required|string|max:10"
        ]);

        // Création du niveau et retour des données du niveau créé dans la réponse JSON
        return response()->json([
            "success" => true,
            "data" => Niveau::create([
                "niveau" => $request->niveau  // Le niveau est récupéré de la requête et enregistré dans la base de données
            ])
        ]);
    }

    /**
     * Supprime un niveau spécifique.
     * Cette méthode supprime un niveau spécifié de la base de données et retourne une réponse sans contenu (204).
     */
    public function destroy(Niveau $niveau){
        $niveau->delete();  // Supprime le niveau de la base de données
        return response()->json([
        ], 204);  // Retourne un code HTTP 204 (No Content) indiquant que la suppression a réussi
    }

    /**
     * Récupère les niveaux associés à l'école de l'utilisateur.
     * Cette méthode retourne les niveaux associés aux montants pour l'école de l'utilisateur authentifié.
     * Elle utilise `auth()->user()->id` pour identifier l'école de l'utilisateur.
     */
    public function mes_niveaux(){
        return response()->json([
            "success" => true,
            "data"=> Niveau::whereIn(
                    "id",
                    Montant::where(
                            "ecole_id",
                            auth()->user()->id  // Récupère l'ID de l'école de l'utilisateur authentifié
                        )->get()->pluck("niveau_id")  // Récupère les IDs des niveaux associés à l'école de l'utilisateur
                )->get()  // Récupère les niveaux correspondants aux IDs obtenus
        ]);
    }
}
