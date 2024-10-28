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
        Schema::create('eleves', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('prenoms');
            $table->date('date_naissance');
            $table->string('lieu_naissance');
            $table->string('nationalite');
            $table->char('sexe', 1);
            $table->text('photo')->nullable();
            $table->string('nom_complet_tuteur1');
            $table->string('telephone_tuteur1');
            $table->string('adresse_tuteur1');
            $table->string('email_tuteur1');
            $table->string('nom_complet_tuteur2')->nullable();
            $table->string('telephone_tuteur2')->nullable();
            $table->string('adresse_tuteur2')->nullable();
            $table->string('email_tuteur2')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('eleves');
    }
};