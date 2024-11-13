<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AddTransactionRequest extends FormRequest
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
            'annee_id' => ['required','exists:annees,id'],
            'eleve_id' => ['required','exists:eleves,id'],
            'classe_id' => ['required','exists:classes,id'],
            "type_frais" => [Rule::in([
                                    "frais_inscription",
                                    "frais_reinscription",
                                    "frais_formation",
                                    "frais_annexe"
                                ])
            ],
            'email' => ['required','email'],
            'montant' => ["required","integer","min:1"],
            "reference" => ["required","string","min:3"]
        ];
    }
}
