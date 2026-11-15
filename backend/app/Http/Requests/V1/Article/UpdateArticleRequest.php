<?php

namespace App\Http\Requests\V1\Article;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateArticleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $article = $this->route('article');

        return [
            'title' => 'sometimes|required|string|max:255',

            'slug' => [
                'sometimes', 'required', 'string', 'max:255',
                Rule::unique('articles', 'slug')->ignore($article?->id),
            ],

            'excerpt' => 'sometimes|nullable|string',

            // ✅ AJOUT — SEO
            'meta_title' => 'sometimes|nullable|string|max:255',
            'meta_description' => 'sometimes|nullable|string|max:500',

            // ✅ AJOUT — article_type
            'article_type' => [
                'sometimes', 'nullable',
                Rule::in([
                    'culture', 'mode', 'portrait', 'interview',
                    'reportage', 'actualite', 'autre',
                ]),
            ],

            'content' => 'sometimes|required|string',
            'cover_image' => 'sometimes|nullable|string|max:2048',
            'author_id' => 'sometimes|nullable|integer|exists:users,id',
            'published_at' => 'sometimes|nullable|date',
            'status' => ['sometimes', 'nullable', Rule::in(['draft', 'published', 'archived'])],
            'source_ids' => 'sometimes|nullable|array',
            'source_ids.*' => 'integer|exists:sources,id',
        ];
    }
}