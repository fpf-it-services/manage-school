<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

use Illuminate\Foundation\Http\FormRequest;

class EcoleStoreRequest extends FormRequest
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
            'nom' => 'required|string|max:255',
            "email" => "required|unique:ecoles,email",
            'adresse' => 'required|string|max:255',
            'contact' => 'required|string|min:8|max:20',
            'logo' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:2048',
            // 'capacite' => 'nullable|integer|min:1',
            'password' => 'nullable|string|min:8',
            'centre_de_composition' => Rule::in(["true","false"])
        ];
    }
}
