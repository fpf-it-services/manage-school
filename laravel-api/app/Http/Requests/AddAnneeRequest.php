<?php

namespace App\Http\Requests;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class AddAnneeRequest extends FormRequest
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
            'annee_academique' => ["required","string","min:9","unique:annees"],
            'date_debut' => ["required","date_format:d/m/Y","after:" . now()],
            'date_fin' => ["required","date_format:d/m/Y","after:date_debut"],
        ];
    }
    public function prepareForValidation(){
        $this->merge([
            'annee_academique' => $this->getYearOfFrenchDate($this->date_debut) . "-" .  $this->getYearOfFrenchDate($this->date_fin),
        ]);
    }
    public function passedValidation(): void{
        $this->replace([
            "date_debut" => $this->formatFrenchDatetoEnglishFormat($this->date_debut),
            "date_fin" => $this->formatFrenchDatetoEnglishFormat($this->date_fin),
            "annee_academique" => $this->annee_academique
        ]);
    }
    public function messages(): array{
        return [
            'annee_academique.unique' => "Cette année académique existe déjà",
            'annee_academique.min' => "Dates invalides"
        ];
    }
    private function getYearOfFrenchDate(?string $date): int{
        if($date === null)
            return 0;
        return Carbon::createFromFormat("d/m/Y",$date)->year;
    }
    private function formatFrenchDatetoEnglishFormat(string $date): string{
        return Carbon::createFromFormat("d/m/Y",$date)->format("Y-m-d");
    }
}
