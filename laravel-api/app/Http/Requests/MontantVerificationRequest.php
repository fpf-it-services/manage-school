<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MontantVerificationRequest extends FormRequest
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
                            ]
        ];
    }
}
