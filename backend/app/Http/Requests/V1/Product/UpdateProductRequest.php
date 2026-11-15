<?php

namespace App\Http\Requests\V1\Product;

use App\Models\Collection;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $product = $this->route('product');

        $brandId = $this->input(
            'brand_id',
            $product?->brand_id
        );

        return [
            'brand_id' => [
                'sometimes',
                'required',
                'integer',
                'exists:brands,id',
            ],

            'collection_id' => [
                'sometimes',
                'nullable',
                'integer',
                Rule::exists('collections', 'id')
                    ->where('brand_id', $brandId)
                    ->whereNull('deleted_at'),
            ],

            'name' => [
                'sometimes',
                'required',
                'string',
                'max:255',
            ],

            'slug' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('products', 'slug')
                    ->ignore($product?->id),
            ],

            'description' => 'sometimes|nullable|string',

            'image' => 'sometimes|nullable|string|max:2048',

            'price' => 'sometimes|nullable|numeric|min:0',

            'currency' => 'sometimes|required|string|size:3',

            'gender' => 'sometimes|nullable|string|max:50',

            'product_url' => 'sometimes|nullable|url|max:2048',

            'availability' => 'sometimes|nullable|string|max:50',

            'status' => [
                'sometimes',
                'nullable',
                Rule::in([
                    'draft',
                    'published',
                    'archived',
                ]),
            ],

            'category_ids' => 'sometimes|nullable|array',
            'category_ids.*' => 'integer|exists:categories,id',

            'style_ids' => 'sometimes|nullable|array',
            'style_ids.*' => 'integer|exists:styles,id',
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $product = $this->route('product');

            if (! $product) {
                return;
            }

            // Ne pas poursuivre si les identifiants sont invalides.
            if (
                $validator->errors()->has('brand_id')
                || $validator->errors()->has('collection_id')
            ) {
                return;
            }

            // Récupérer les valeurs finales après la modification.
            $brandId = $this->input(
                'brand_id',
                $product->brand_id
            );

            $collectionId = $this->input(
                'collection_id',
                $product->collection_id
            );

            // La collection est facultative.
            if ($collectionId === null || $brandId === null) {
                return;
            }

            // Vérifier que la collection appartient à la marque.
            $belongsToBrand = Collection::query()
                ->whereKey($collectionId)
                ->where('brand_id', $brandId)
                ->exists();

            if (! $belongsToBrand) {
                $validator->errors()->add(
                    'collection_id',
                    'La collection doit appartenir à la marque sélectionnée.'
                );
            }
        });
    }
}
