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
        Schema::create('eleve_en_attentes', function (Blueprint $table) {
            $table->id();
            $table->foreignId("ecole_id")->constrained()->cascadeOnDelete()->cascadeOnUpdate();
            $table->foreignId("niveau_id")->constrained()->cascadeOnDelete()->cascadeOnUpdate();
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

            $table->string('releve_de_notes')->nullable();
            $table->string('releve_de_notes_examen')->nullable();
            $table->string('acte_de_naissance')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations
     */
    public function down(): void
    {
        Schema::dropIfExists('eleve_en_attentes');
    }
};

// create table eleve_en_attentes (
//     id int not null primary key auto_increment,
//     ecole_id int not null,
//     niveau_id int not null,
//     nom varchar(255) not null,
//     prenoms varchar(255) not null,
//     date_naissance date not null,
//     lieu_naissance varchar(255) not null,
//     nationalite varchar(255) not null,
//     sexe char(1) not null,
//     photo varchar(255) null default null,
//     nom_complet_tuteur1 varchar(255) not null,
//     telephone_tuteur1 varchar(255) not null,
//     adresse_tuteur1 varchar(255) not null,
//     email_tuteur1 varchar(255) not null,
//     nom_complet_tuteur2 varchar(255) null default null,
//     telephone_tuteur2 varchar(255) not null,
//     adresse_tuteur2 varchar(255) not null,
//     email_tuteur2 varchar(255) not null,
//     releve_de_notes varchar(255) null default null,
//     releve_de_notes_examen varchar(255) null default null,
//     acte_de_naissance varchar(255) null default null,
//     created_at timestamp null default null,
//     updated_at timestamp null default null
// ) engine=InnoDB charset=utf8mb4;