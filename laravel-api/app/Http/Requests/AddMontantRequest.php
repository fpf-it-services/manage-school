<?php

namespace App\Http\Requests;

use App\Models\Annee;
use App\Models\Montant;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;

class AddMontantRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            "niveau_id" => ["required", "exists:niveaux,id"],
            "serie_id" => ["nullable", "exists:series,id"],
            "annee_id" => ["required", "exists:annees,id"],
            "frais_inscription" => ["required", "integer", "min:1"],
            "frais_reinscription" => ["required", "integer", "min:1"],
            "frais_formation" => ["required", "integer", "min:1"],
            "frais_annexe" => ["required", "integer", "min:0"],
            "tranche" => ["required", "array", "size:3"],
            "tranche.*.montant" => ["required", "integer", "min:0"],
            "tranche.*.dueDate" => ["required", "date"],
            "somme_tranches" => [Rule::in([0])],
            "avant_la_rentree" => [Rule::in([true])],
            "unique_constraint" => [Rule::in([true])],
            "tranche.0.dueDate" => "required|date|after:" . now(),
            "tranche.1.dueDate" => "required|date|after:fees.tranche.0.dueDate",
            "tranche.2.dueDate" => "required|date|after:fees.tranche.1.dueDate",
        ];
    }

    public function messages()
    {
        return [
            "somme_tranches.*" => "Les montants sont mal répartis en tranches",
            "avant_la_rentree.*" => "Vous ne pouvez pas définir un montant pour une année en cours",
            "unique_constraint.*" => "Un montant existe déjà pour cette année et cette classe",
            "tranche.*.montant" => "Montant de tranche invalide",
            "tranche.*.dueDate" => "Date d'échéance de tranche invalide",
            "tranche.0.dueDate.*" => "Echéance de la première tranche invalide",
            "tranche.1.dueDate.*" => "Echéance de la deuxième tranche invalide",
            "tranche.2.dueDate.*" => "Echéance de la troisième tranche invalide",
        ];
    }

    protected function prepareForValidation()
    {
        $annee_courante = Annee::orderBy("id", "desc")->first();
        $fees = $this->fees ?? [];

        // Calcul de la somme des tranches
        $trancheSum = array_reduce($fees['tranche'] ?? [], function ($sum, $tranche) {
            return $sum + ($tranche['montant'] ?? 0);
        }, 0);

        $this->merge([
            "somme_tranches" => $trancheSum - ($fees['frais_formation'] ?? 0),
            "annee_id" => $annee_courante?->id,
            "avant_la_rentree" => $annee_courante?->date_debut?->isAfter(now()),
            "unique_constraint" => Montant::where([
                ["niveau_id", $this->niveau_id],
                ["annee_id", $this->annee_id],
                ["serie_id", $this->serie_id],
                ["ecole_id", auth()->id()]
            ])->count() === 0
        ]);
    }

    public function passedValidation(): void
    {
        $this->replace([
            "niveau_id" => $this->niveau_id,
            "serie_id" => $this->serie_id,
            "annee_id" => $this->annee_id,
            "frais_inscription" => $this->frais_inscription ?? 0,
            "frais_reinscription" => $this->frais_reinscription ?? 0,
            "frais_formation" => $this->frais_formation ?? 0,
            "frais_annexe" => $this->frais_annexe ?? 0,
            "tranche1" => $this->tranche[0]['montant'] ?? 0,
            "tranche2" => $this->tranche[1]['montant'] ?? 0,
            "tranche3" => $this->tranche[2]['montant'] ?? 0,
            "echeance_tranche1" => $this->tranche[0]['dueDate'] ?? null,
            "echeance_tranche2" => $this->tranche[1]['dueDate'] ?? null,
            "echeance_tranche3" => $this->tranche[2]['dueDate'] ?? null,
        ]);
    }
}
