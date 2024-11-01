<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Models\Annee;
use Illuminate\Validation\Rule;

class EditFraisMontantRequest extends FormRequest
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
            "frais_formation" => ["required","integer","min:1"],
            "tranche1" => ["required","integer","min:0"],
            "tranche2" => ["required","integer","min:0"],
            "tranche3" => ["required","integer","min:0"],
            // "avant_la_rentree" => [Rule::in([true])],
            "somme_tranches" => [Rule::in([0])],
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
            "somme_tranches" => $this->tranche1 + $this->tranche2 + $this->tranche3 - $this->frais_formation,
            "avant_la_rentree" => Annee::where("id",$this->route("montant")->id)->first()->date_debut?->isAfter(now()),
        ]);
    }
}
