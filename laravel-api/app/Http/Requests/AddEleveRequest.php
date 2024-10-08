<?php

namespace App\Http\Requests;

use App\Models\Annee;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class AddEleveRequest extends FormRequest
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
            'nom' => "required|string|min:3",
            'prenoms' => "required|string|min:3",
            'date_naissance' => "required|date|after:" . now()->subYears(5),
            'lieu_naissance' => "required|string",
            'nationalite' => "required|string",
            'sexe' =>"required|in:M,F",
            'photo' => "required|image|max:4048",
            'nom_complet_tuteur1' => "required|string|min:7",
            'telephone_tuteur1' => "required|string|min:8",
            'adresse_tuteur1' => "required|string|min:4",
            'email_tuteur1' => "required|email",
            'nom_complet_tuteur2' => "nullable|string|min:7",
            'telephone_tuteur2' => "nullable|string|min:8",
            'adresse_tuteur2' => "required|string|min:4",
            'email_tuteur2' => "nullable|email",
            "classe_id" => "required|exists:classes,id",
            "annee_exits" => [Rule::in([true])]
        ];
    }
    public function prepareForValidation(){
        $this->merge([
            "annee_exits"=> Annee::count() !== 0
        ]);
    }
    public function messages(): array{
        return [
            "annee_exits.*" => "Aucune année n'existe donc impossible d'inscrire l'élève"
        ];
    }
}
