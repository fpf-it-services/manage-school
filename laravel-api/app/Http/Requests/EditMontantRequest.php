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
            "frais_formation" => ["required","integer","min:1"],
            "frais_annexe" => ["required","integer","min:0"],
            "tranche1" => ["required","integer","min:0"],
            "tranche2" => ["required","integer","min:0"],
            "tranche3" => ["required","integer","min:0"],
            "somme_tranches" => [Rule::in([0])],
            "avant_la_rentree" => [Rule::in([true])],
        ];
    }
    public function messages(){
        return [
            "somme_tranches.*"   => "Les montants sont mals répartis en tranches",
            "avant_la_rentree.*" => "Vous ne pouvez pas définir un montant pour une année en cours",
        ];
    }
    public function prepareForvalidation(){
        $this->merge([
            "somme_tranches" => $this->tranche1 + $this->tranche2 + $this->tranche3 - $this->frais_inscription - $this->frais_formation - $this->frais_annexe,
            "avant_la_rentree" => Annee::where("id",$this->route("montant")->id)->first()->date_debut?->isAfter(now()),
        ]);
    }
}
