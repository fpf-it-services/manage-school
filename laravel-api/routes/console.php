<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Http\Controllers\Api\NotificationMailController;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();


Schedule::call(function(){
    NotificationMailController::notifyBeforeTranche("tranche1","echeance_tranche1");
})->everyMinute();
Schedule::call(function(){
    NotificationMailController::notifyBeforeTranche("tranche2","echeance_tranche2");
})->everyMinute();
Schedule::call(function(){
    NotificationMailController::notifyBeforeTranche("tranche3","echeance_tranche3");
})->everyMinute();