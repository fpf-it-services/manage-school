<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AnneeController;
use App\Http\Controllers\Api\EcoleController;
use App\Http\Controllers\Api\SerieController;
use App\Http\Controllers\Api\ClasseController;
use App\Http\Controllers\Api\NiveauController;
use App\Http\Controllers\Api\MontantController;

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
            Route::get("series",[SerieController::class,"index"]);
            Route::post("series",[SerieController::class,"store"]);
            Route::get("niveaux",[NiveauController::class,"index"]);
            Route::post("niveaux",[NiveauController::class,"store"]);
        });
        Route::get("annees",[AnneeController::class,"index"]);
        Route::get("annee-actuelle",[AnneeController::class,"currentYear"]);
        Route::get("niveaux",[NiveauController::class,"index"]);
        Route::prefix("ecole")->group(function () {
            //Route::post('login', [AuthController::class, 'login_ecole']);
            Route::group(['middleware' => ['auth:ecole']], function () {
                Route::get('me', [AuthController::class, 'ecole_me']);
                Route::apiResource("classes", ClasseController::class,['parameters' => [
                    'classes' => 'classe'
                ]]);
                Route::put("update-profile",[EcoleController::class,"update"]);
                Route::apiResource("montants", MontantController::class)->except(["show","destroy"]);
                Route::get("montants-par-niveau",[MontantController::class,"montant_niveau"]);
            });
        });
    });
});



//Il faut que je gère les missings des models
