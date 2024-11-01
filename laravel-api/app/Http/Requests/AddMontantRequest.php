<?php

namespace App\Http\Requests;

use App\Models\Annee;
use App\Models\Montant;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class AddMontantRequest extends FormRequest
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
            "niveau_id" => ["required","exists:niveaux,id"],
            "serie_id" => ["nullable","exists:series,id"],
            "annee_id" => ["required","exists:annees,id"],
            "frais_inscription" => ["required","integer","min:1"],
            "frais_formation" => ["required","integer","min:1"],
            "frais_annexe" => ["required","integer","min:0"],
            "tranche" => ["required","array","min:3","max:3"],
            "tranche.*" => ["required","integer","min:0"],
            "somme_tranches" => [Rule::in([0])],
            "avant_la_rentree" => [Rule::in([true])],
            "unique_constraint" => [Rule::in([true])]
        ];
    }
    public function messages(){
        return [
            "somme_tranches.*"   => "Les montants sont mals répartis en tranches",
            "avant_la_rentree.*" => "Vous ne pouvez pas définir un montant pour une année en cours",
            "unique_constraint.*" => "Un montant existe déjà pour cette année et cette classe",
            "tranche.*" => "Tranches invalides",
            "tranche.0.*" => "Tranche invalide",
            "tranche.1.*" => "Tranche invalide",
            "tranche.2.*" => "Tranche invalide"
        ];
    }
    public function prepareForvalidation(){
        $annee_courante = Annee::orderBy("id","desc")->first();
        $this->merge([
            "tranche1" => $this->tranche[0] ?? 0,
            "tranche2" => $this->tranche[1] ?? 0,
            "tranche3" => $this->tranche[2] ?? 0,
            "somme_tranches" => ($this->tranche[0] ?? 0) + ($this->tranche[1] ?? 0) + ($this->tranche[2] ?? 0) - $this->frais_formation,
            "annee_id" => $annee_courante?->id,
            "avant_la_rentree" => $annee_courante?->date_debut?->isAfter(now()),
            "unique_constraint" => Montant::where([
                ["niveau_id" , $this->niveau_id],
                ["annee_id" ,$this->annee_id],
                ["serie_id" , $this->serie_id],
                ["ecole_id" , auth()->id()]
            ])->count() === 0
        ]);
    }
    public function passedValidation(): void{
        $this->replace([
            "annee_academique" => $this->annee_academique,
            "niveau_id" => $this->niveau_id,
            "serie_id" => $this->serie_id,
            "annee_id" => $this->annee_id,
            "frais_inscription" => $this->frais_inscription,
            "frais_formation" => $this->frais_formation,
            "frais_annexe" => $this->frais_annexe,
            "tranche1" => $this->tranche1,
            "tranche2" => $this->tranche2,
            "tranche3" => $this->tranche3
        ]);
    }
}
