<?php

namespace App\Http\Requests;

use App\Models\Annee;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class EditMontantRequest extends FormRequest
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
            "frais_inscription" => ["required","integer","min:1"],
            "frais_reinscription" => ["required","integer","min:1"],
            "frais_annexe" => ["required","integer","min:0"],
            "tranche" => ["required", "array", "size:3"],
            "tranche.*.montant" => ["required", "integer", "min:0"],
            "tranche.*.dueDate" => ["required", "date"],
            "avant_la_rentree" => [Rule::in([true])],
            "echeance_tranche1" => "date|required|after:now",
            "echeance_tranche2" => "date|required|after:echeance_tranche1",
            "echeance_tranche3" => "date|required|after:echeance_tranche2",
        ];
    }

    public function messages()
    {
        return [
            "avant_la_rentree.*" => "Vous ne pouvez pas définir un montant pour une année en cours",
            "tranche.required" => "Les tranches sont obligatoires et doivent comporter trois éléments.",
            "tranche.size" => "Les tranches doivent contenir exactement trois éléments.",
            "tranche.*.montant.required" => "Le montant de chaque tranche est requis.",
            "tranche.*.montant.integer" => "Le montant de chaque tranche doit être un entier.",
            "tranche.*.montant.min" => "Le montant de chaque tranche doit être au moins de 0.",
            "tranche.*.dueDate.required" => "La date d'échéance de chaque tranche est requise.",
            "tranche.*.dueDate.date" => "La date d'échéance de chaque tranche doit être une date valide.",
            "echeance_tranche1.*" => "Echéance de la première tranche invalide",
            "echeance_tranche2.*" => "Echéance de la deuxième tranche invalide",
            "echeance_tranche3.*" => "Echéance de la troisième tranche invalide",
        ];
    }

    public function prepareForValidation()
    {
        $anneeCourante = Annee::orderBy("id", "desc")->first();
        $this->merge([
            "avant_la_rentree" => $anneeCourante?->date_debut?->isAfter(now()),
        ]);
    }
}
