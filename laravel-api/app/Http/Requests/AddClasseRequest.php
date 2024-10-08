<?php

namespace App\Http\Requests;

use App\Models\Classe;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class AddClasseRequest extends FormRequest
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
            'nom' => ['required','string','max:20'],
            'niveau_id' => ['required','exists:niveaux,id'],
            'serie_id' => ['nullable','exists:series,id'],
            'effectif_max' => ['required','integer','min:0'],
            "unique" => ["boolean",Rule::in(true)]
        ];
    }
    public function prepareForValidation(){
        $this->merge([
            'unique' => Classe::where(["nom" => $this->nom, "niveau_id" => $this->niveau_id,"serie_id" => $this->serie_id,"ecole_id" => auth()->id()])->count() == 0
        ]);
    }
    public function messages(){
        return [
            "unique.*" => "Cette classe existe déjà pour cette école, niveaux et série avec le même nom"
        ];
    }
}
