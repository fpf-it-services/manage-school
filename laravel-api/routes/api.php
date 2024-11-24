<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AnneeController;
use App\Http\Controllers\Api\EcoleController;
use App\Http\Controllers\Api\EleveController;
use App\Http\Controllers\Api\SerieController;
use App\Http\Controllers\Api\ClasseController;
use App\Http\Controllers\Api\NiveauController;
use App\Http\Controllers\Api\MontantController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\InscriptionEnAttente;
use App\Http\Controllers\Api\ParentController;

/* Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum'); */

Route::prefix("v2")->group(function(){

    Route::group(['middleware' => ['replace_json_request']], function () {
        Route::post('login', [AuthController::class, 'login_ecole_admin']);
        //Route::post('/register', [AuthController::class, 'register']);
        Route::group(['middleware' => ['auth:api']], function () {
            Route::get('me', [AuthController::class, 'me']);
            Route::put('update-profile', [AuthController::class, 'updateProfile']);
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::apiResource("ecoles", EcoleController::class)->except(["update"]);
            Route::apiResource("annees", AnneeController::class)->except(['destroy','update','index']);
            //Route::get("niveaux",[NiveauController::class,"index"]);
            Route::apiResource( "series", SerieController::class)->except(["update","index"]);
            Route::apiResource("niveaux", NiveauController::class)->except(["update","index"]);
        });
        Route::get("ecoles_eleves",[EcoleController::class,"ecoles_eleves"]);
        Route::get("series",[SerieController::class,"index"]);
        Route::get("annees",[AnneeController::class,"index"]);
        Route::get("annee-actuelle",[AnneeController::class,"currentYear"]);
        Route::get("niveaux",[NiveauController::class,"index"]);
        Route::get("getClassesByLevelAndSerie",[ClasseController::class, "getClassesByLevelAndSerie"]);
        Route::get("ecoles_annees_classes_eleves",[EcoleController::class, "getEcolesAnneesClassesEleves"]);
        Route::get("montants/a_payer",[TransactionController::class, "montant_du"]);
        Route::get("montants/historique/{eleve}",[TransactionController::class, "historique"]);
        Route::post("montants",[TransactionController::class, "save"]);
        Route::get("montants/statistiques/{eleve}",[TransactionController::class, "stats_eleves"]);
        Route::post("inscription/attente",[InscriptionEnAttente::class, "register"]);


        Route::post("inscription/attente/eleve",[InscriptionEnAttente::class, "register_student"]);
        Route::get("inscription/attente/eleve",[InscriptionEnAttente::class, "getRegistredStudent"])
        ->middleware(['auth:ecole']);
        Route::put("inscription/attente/{id}",[InscriptionEnAttente::class, "setStatusEleve"])
        ->middleware(['auth:ecole']);
        Route::get("niveaux-ecoles",[EcoleController::class, "getLevels"]);
        Route::get("transactions",[TransactionController::class, "getAllTransactions"]);

        Route::prefix("ecole")->group(function () {
            //Route::post('login', [AuthController::class, 'login_ecole']);
            Route::group(['middleware' => ['auth:ecole']], function () {
                Route::get("transactions",[TransactionController::class, "getAllTransactions"]);
                Route::get('me', [AuthController::class, 'ecole_me']);
                Route::apiResource("classes", ClasseController::class,['parameters' => [
                    'classes' => 'classe'
                ]]);
                Route::get('mes-niveaux', [NiveauController::class, 'mes_niveaux']);
                Route::put("update-profile",[EcoleController::class,"update"]);
                Route::apiResource("montants", MontantController::class)->except(["show","destroy"]);
                Route::put("montants_frais/{montant}",[MontantController::class,"update_frais"]);
                Route::apiResource("eleves", EleveController::class)->except(["show","destroy"]);
                Route::post('/eleves/classe/{classe}', [EleveController::class, 'ajout_eleve_classe']);
                Route::get("montants-par-niveau",[MontantController::class,"montant_niveau"]);
            });
        });
        Route::prefix("parents")->group(function () {
            Route::group(['middleware' => ['auth:parent']], function () {
                Route::get("eleves/attente",[ParentController::class, "eleve_en_attentes"]);
                Route::post("eleves/attente/{id}",[ParentController::class, "updatePendingStudent"]);
                Route::get("eleves",[ParentController::class, "eleves"]);
                Route::post("eleves/accepte/{id}",[TransactionController::class, "saveInscriptionFree"]);
            });
        });
    });
});



//Il faut que je gère les missings des models
