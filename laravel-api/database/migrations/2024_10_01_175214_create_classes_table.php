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
        Schema::create('classes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ecole_id')->constrained('ecoles')->onDelete('cascade')->onUpdate('cascade');
            $table->foreignId('niveau_id')->constrained('niveaux')->onDelete('cascade')->onUpdate('cascade');
            $table->foreignId('serie_id')->nullable()->constrained('series')->onDelete('cascade')->onUpdate('cascade');
            $table->string('nom');
            $table->unsignedInteger('effectif_max');
            $table->timestamps();
            $table->unique(['ecole_id','niveau_id','serie_id',"nom"]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('classes');
    }
};