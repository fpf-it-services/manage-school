<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddEleveEnAttenteRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "ecole" => ["required", "exists:ecoles,id"],
            "niveau" => ["required", "exists:niveaux,id"],
            "nom" => ["required", "string","min:3"],
            "prenoms" => ["required", "string","min:3"],
            "date_de_naissance" => ["required", "date","before:" . now()->subYears(5)],
            "lieu_de_naissance" => ["required", "string"],
            "nationalite" => ["required", "string"],
            "sexe" => ["required", "in:M,F"],
            "photo" => ["required","image","max:4048"],
            "nom_tuteur1" => ["required", "string","min:7"],
            "telephone_tuteur1" => ["required", "string","min:8"],
            "email_tuteur1" => ["required", "email"],
            "adresse_tuteur1" => ["required", "string","min:3"],
            "nom_tuteur2" => ["nullable", "string","min:7"],
            "telephone_tuteur2" => ["nullable", "string","min:8"],
            "email_tuteur2" => ["nullable", "email"],
            "adresse_tuteur2" => ["nullable", "string","min:3"],
            "releve_de_notes" => ["nullable", "file"],
            "releve_de_notes_examen" => ["nullable", "file"],
            "acte_de_naissance" => ["required", "file"],
        ];
    }
}