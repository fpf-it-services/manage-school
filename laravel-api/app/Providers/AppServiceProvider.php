<?php

namespace App\Providers;

use App\Models\Ecole;
use App\Models\Classe;
use App\Models\Montant;
use Laravel\Passport\Passport;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Passport::tokensExpireIn(now()->addDays(15));
        Passport::refreshTokensExpireIn(now()->addDays(30));
        Passport::personalAccessTokensExpireIn(now()->addMonths(6));
        Passport::enablePasswordGrant();
        Gate::define('update-classe', function (Ecole $ecole, Classe $classe) {
            return $ecole->id === $classe->ecole_id;
        });
        Gate::define('update-montant', function (Ecole $ecole, Montant $montant) {
            return $ecole->id === $montant->ecole_id;
        });

        Route::fallback(function () {
            if(request()->header("accept") === 'application/json')
                return response()->json(["success" => false],404);
        });
    }
}
