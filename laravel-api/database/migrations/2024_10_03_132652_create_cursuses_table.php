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
        Schema::create('cursuses', function (Blueprint $table) {
            $table->id();
            $table->foreignId("eleve_id")->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId("ecole_id")->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId("classe_id")->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId("annee_id")->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->enum("decision",["admis","double"])->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cursuses');
    }
};
