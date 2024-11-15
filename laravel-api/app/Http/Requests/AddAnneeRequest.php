<?php

namespace App\Http\Requests;

use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class AddAnneeRequest extends FormRequest
{
    /**
     * Détermine si l'utilisateur est autorisé à effectuer cette requête.
     *
     * Cette méthode détermine si l'utilisateur est autorisé à soumettre cette requête.
     * Elle retourne `true`, ce qui signifie que tous les utilisateurs sont autorisés
     * à soumettre cette requête.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true; // Autorise tous les utilisateurs.
    }

    /**
     * Règles de validation qui s'appliquent à la requête.
     *
     * Cette méthode définit les règles de validation pour les données soumises
     * dans la requête. Les règles incluent :
     * - `annee_academique` : doit être une chaîne de caractères, d'une longueur minimale de 9 caractères
     *   et unique dans la table `annees`.
     * - `date_debut` : doit être une date au format `d/m/Y` et doit être après la date actuelle.
     * - `date_fin` : doit être une date au format `d/m/Y` et doit être après `date_debut`.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'annee_academique' => ["required", "string", "min:9", "unique:annees"],
            'date_debut' => ["required", "date_format:d/m/Y", "after:" . now()],
            'date_fin' => ["required", "date_format:d/m/Y", "after:date_debut"],
        ];
    }

    /**
     * Prépare les données avant la validation.
     *
     * Cette méthode modifie les données de la requête avant leur validation.
     * Elle génère l'année académique en fonction des dates de début et de fin,
     * et les merge dans la requête.
     */
    public function prepareForValidation()
    {
        $this->merge([
            'annee_academique' => $this->getYearOfFrenchDate($this->date_debut) . "-" . $this->getYearOfFrenchDate($this->date_fin),
        ]);
    }

    /**
     * Remplace les données après la validation.
     *
     * Cette méthode permet de formater les dates du format français (`d/m/Y`)
     * en format anglais (`Y-m-d`) après la validation, et remplace également
     * l'année académique dans la requête validée.
     */
    public function passedValidation(): void
    {
        $this->replace([
            "date_debut" => $this->formatFrenchDatetoEnglishFormat($this->date_debut),
            "date_fin" => $this->formatFrenchDatetoEnglishFormat($this->date_fin),
            "annee_academique" => $this->annee_academique
        ]);
    }

    /**
     * Messages personnalisés pour les erreurs de validation.
     *
     * Cette méthode définit des messages d'erreur personnalisés pour les règles
     * de validation. Les erreurs sont spécifiées pour l'`annee_academique` :
     * - Si l'année académique existe déjà dans la base de données, un message spécifique sera renvoyé.
     * - Si l'année académique est invalide (moins de 9 caractères), un autre message sera affiché.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'annee_academique.unique' => "Cette année académique existe déjà",
            'annee_academique.min' => "Dates invalides"
        ];
    }

    /**
     * Récupère l'année d'une date au format français (d/m/Y).
     *
     * Cette méthode extrait l'année d'une date au format français `d/m/Y`.
     * Si la date est `null`, elle retourne `0`.
     *
     * @param string|null $date La date au format `d/m/Y`.
     * @return int L'année extraite de la date.
     */
    private function getYearOfFrenchDate(?string $date): int
    {
        if ($date === null)
            return 0;
        return Carbon::createFromFormat("d/m/Y", $date)->year;
    }

    /**
     * Formate une date du format français (d/m/Y) vers le format anglais (Y-m-d).
     *
     * Cette méthode prend une date au format français `d/m/Y` et la convertit
     * en format anglais `Y-m-d` pour être compatible avec la base de données.
     *
     * @param string $date La date au format `d/m/Y`.
     * @return string La date au format `Y-m-d`.
     */
    private function formatFrenchDatetoEnglishFormat(string $date): string
    {
        return Carbon::createFromFormat("d/m/Y", $date)->format("Y-m-d");
    }
}
