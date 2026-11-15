<?php

namespace App\Http\Requests\V1\Article;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class IndexArticleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'search' => 'nullable|string|max:255',
            'author_id' => 'nullable|integer|exists:users,id',
            'article_type' => [
                'nullable',
                'string',
                Rule::in(['culture', 'mode', 'portrait', 'reportage']),
            ],
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
        ];
    }
}