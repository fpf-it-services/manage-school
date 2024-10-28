<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('montants', function (Blueprint $table) {
            $table->id();
            $table->foreignId("ecole_id")->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId("niveau_id")->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId("serie_id")->nullable()->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId("annee_id")->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->unsignedInteger("frais_inscription");
            $table->unsignedInteger("frais_formation");
            $table->unsignedInteger("frais_annexe");
            $table->unsignedInteger("tranche1");
            $table->unsignedInteger("tranche2");
            $table->unsignedInteger("tranche3");
            $table->timestamps();

            $table->unique(["ecole_id", "annee_id", "niveau_id", "serie_id"]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('montants');
    }
};