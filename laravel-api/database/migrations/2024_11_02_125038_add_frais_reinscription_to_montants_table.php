<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('montants', function (Blueprint $table) {
            $table->unsignedInteger("frais_reinscription")->after("frais_inscription");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('montants', function (Blueprint $table) {
            $table->dropColumn("frais_reinscription");
        });
    }
};