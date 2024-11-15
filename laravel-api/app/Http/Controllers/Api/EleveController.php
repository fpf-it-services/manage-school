<?php
namespace App\Http\Controllers\Api;

use Exception;
use App\Models\Annee;
use App\Models\Eleve;
use App\Models\Cursus;
use App\Models\Classe;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use App\Http\Resources\EleveResource;
use App\Http\Requests\AddEleveRequest;
use Illuminate\Support\Facades\Storage;

class EleveController extends Controller
{
    /**
     * Affiche la liste des ressources (ici, vide).
     */
    public function index()
    {
        // Code pour afficher la liste des élèves (non implémenté dans cet exemple).
    }

    /**
     * Enregistre un nouvel élève dans la base de données.
     */
    public function store(AddEleveRequest $request): JsonResponse
    {
        // Récupère l'ID de l'année académique la plus récente.
        $annee_id = Annee::orderByDesc("id")->first("id")?->id;

        // Vérifie si une année est enregistrée ; si non, retourne une réponse d'erreur.
        if($annee_id == null){
            return response()->json([
                "success" => false,
                "message" => "Aucune année enregistrée."
            ],422);
        }

        // Extrait les informations de l'élève fournies dans la requête.
        $student_infos = $request->safe([
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
        ]);

        // Initialise la photo de l'élève à null.
        $student_infos["photo"] = null;

        // Si une photo est téléchargée, elle est stockée et son chemin est sauvegardé.
        if($request->hasFile("photo")){
            $student_infos["photo"] = $request->file("photo")->store("eleves_photos","public");
        }

        // Enregistre l'élève en base de données, en utilisant une méthode privée.
        $eleve = $this->storeStudent($student_infos, $annee_id, $request->input("classe_id"))[0];

        // DB::beginTransaction(); // Démarre une transaction pour gérer les opérations critiques.

        // Tente de créer l'élève et son cursus. Si une erreur survient, la transaction est annulée.
        if($eleve != null){
            return response()->json(["success" => true, "data" => new EleveResource($eleve)]);
        } else {
            // En cas d'erreur, supprime la photo enregistrée, si elle existe.
            if($student_infos["photo"] != null){
                try {
                    Storage::disk("public")->delete($student_infos["photo"]);
                } catch (Exception $th) {
                    // Gestion des exceptions silencieuse (aucune action supplémentaire).
                }
            }
            // Retourne une réponse d'erreur indiquant qu'une erreur est survenue.
            return response()->json([
                "success" => false,
                "message" => "Une erreur est survenue"
            ],500);
        }
    }

    /**
     * Affiche les informations spécifiques d'un élève (non implémenté dans cet exemple).
     */
    public function show(Eleve $eleve)
    {
        // Code pour afficher un élève spécifique.
    }

    /**
     * Met à jour les informations d'un élève (non implémenté dans cet exemple).
     */
    public function update(Request $request, Eleve $eleve)
    {
        // Code pour mettre à jour un élève.
    }

    /**
     * Supprime un élève (non implémenté dans cet exemple).
     */
    public function destroy(Eleve $eleve)
    {
        // Code pour supprimer un élève.
    }

    /**
     * Enregistre un élève et son cursus, en utilisant une transaction pour garantir l'intégrité des données.
     */
    private function storeStudent($student_infos, $annee_id, $classe_id)
    {
        DB::beginTransaction(); // Démarre une transaction pour assurer la cohérence des opérations.

        try {
            // Crée l'élève dans la base de données avec les informations fournies.
            $eleve = Eleve::create($student_infos);

            // Crée le cursus correspondant de l'élève pour l'année et la classe données.
            Cursus::create([
                'eleve_id' => $eleve->id,
                'ecole_id' => auth()->id(),
                'classe_id' => $classe_id,
                'annee_id' => $annee_id
            ]);
        } catch (Exception $e) {
            DB::rollBack(); // Annule la transaction en cas d'erreur.
        }

        DB::commit(); // Valide la transaction si toutes les opérations ont réussi.
        return [$eleve ?? null];
    }

    /**
     * Ajoute plusieurs élèves à une classe spécifiée.
     */
    public function ajout_eleve_classe(Request $request, Classe $classe)
    {
        // Valide que la requête contient un tableau d'élèves.
        $request->validate([
            'eleves' => 'required|array'
        ]);

        $data = $request->input('eleves');

        // Récupère l'ID de l'année académique la plus récente.
        $annee_id = Annee::orderByDesc("id")->first("id")?->id;

        // Vérifie si une année est enregistrée ; si non, retourne une réponse d'erreur.
        if($annee_id == null){
            return response()->json([
                "success" => false,
                "message" => "Aucune année enregistrée."
            ],422);
        }

        // Initialise une collection pour stocker les élèves ajoutés avec succès.
        $eleves = collect();

        // Parcourt chaque élève pour les ajouter à la classe.
        foreach($data as $student_infos){
            // Initialise la photo de l'élève à null.
            $student_infos["photo"] = null;

            // Enregistre chaque élève et ajoute les élèves créés à la collection.
            $eleve = $this->storeStudent($student_infos, $annee_id, $classe->id)[0];
            if($eleve != null)
                $eleves->add($eleve);
        }

        // Retourne une réponse JSON contenant la liste des élèves ajoutés.
        return response()->json([
            "success" => true,
            "data" => EleveResource::collection($eleves)
        ]);
    }
}
