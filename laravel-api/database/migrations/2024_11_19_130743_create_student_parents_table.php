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
        Schema::create('student_parents', function (Blueprint $table) {
            $table->id();
            $table->string("nom");
            $table->string("email")->unique();
            $table->string("password");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_parents');
    }
};
/*
create table student_parents(
    id int not null primary key auto_increment,
    nom varchar(255) not null,
    email varchar(255) not null unique,
    password varchar(255) not null
) engine=InnoDB charset=utf8mb4 collate= utf8mb4_unicode_ci;*/