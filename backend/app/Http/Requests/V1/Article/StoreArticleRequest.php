<?php

namespace App\Http\Requests\V1\Article;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreArticleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:articles,slug',
            'excerpt' => 'nullable|string',

            // ✅ AJOUT — SEO
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',

            // ✅ AJOUT — article_type
            'article_type' => [
                'nullable',
                Rule::in([
                    'culture', 'mode', 'portrait', 'interview',
                    'reportage', 'actualite', 'autre',
                ]),
            ],

            'content' => 'required|string',
            'cover_image' => 'nullable|string|max:2048',
            'author_id' => 'nullable|integer|exists:users,id',
            'published_at' => 'nullable|date',
            'status' => ['nullable', Rule::in(['draft', 'published', 'archived'])],
            'source_ids' => 'nullable|array',
            'source_ids.*' => 'integer|exists:sources,id',
        ];
    }
}