<?php

namespace Tests\Feature\Api\V1;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Collection;
use App\Models\Product;
use App\Models\Style;

class ProductTest extends ApiV1TestCase
{
    public function test_it_has_seeded_products(): void
    {
        $this->assertGreaterThan(0, Product::count());
    }

    public function test_it_returns_published_products(): void
    {
        $response = $this->getJson('/api/v1/products')
            ->assertOk()
            ->assertJsonStructure(['success', 'data', 'meta']);

        $this->assertNotEmpty($response->json('data'));

        foreach ($response->json('data') as $item) {
            $this->assertSame('published', $item['status']);
        }
    }

    public function test_it_returns_one_product_with_relations(): void
    {
        $product = Product::query()->firstOrFail();

        $this->getJson("/api/v1/products/{$product->id}")
            ->assertOk()
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id', 'name', 'slug', 'description', 'image',
                    'price', 'currency', 'gender', 'product_url',
                    'availability', 'status', 'brand', 'collection',
                    'categories', 'styles',
                ],
            ]);
    }

    public function test_it_returns_collection_products(): void
    {
        $collection = Collection::query()->has('products')->firstOrFail();

        $this->getJson(
            "/api/v1/collections/{$collection->id}/products"
        )
            ->assertOk()
            ->assertJsonStructure(['success', 'data', 'meta']);
    }

    public function test_it_rejects_creation_without_authentication(): void
    {
        $this->postJson('/api/v1/products', [])
            ->assertUnauthorized();
    }

    private function validPayload(): array
    {
        return [
            'brand_id' => Brand::query()->firstOrFail()->id,
            'collection_id' => Collection::query()->firstOrFail()->id,
            'name' => 'Product Test API',
            'slug' => 'product-test-api',
            'description' => 'Produit créé pour les tests.',
            'image' => 'products/test.jpg',
            'price' => 15000,
            'currency' => 'XOF',
            'gender' => 'unisex',
            'product_url' => 'https://example.com/product-test',
            'availability' => 'in_stock',
            'status' => 'published',
            'category_ids' => [Category::query()->firstOrFail()->id],
            'style_ids' => [Style::query()->firstOrFail()->id],
        ];
    }

    public function test_regular_user_cannot_create_product(): void
    {
        $this->actingAsRegularUser();

        $this->postJson('/api/v1/products', $this->validPayload())
            ->assertForbidden();
    }

    public function test_admin_can_create_product(): void
    {
        $this->actingAsAdminWithToken();

        $response = $this->postJson(
            '/api/v1/products',
            $this->validPayload()
        )
            ->assertCreated()
            ->assertJsonPath('success', true);

        $id = $response->json('data.id');

        $this->assertDatabaseHas('products', [
            'id' => $id,
            'slug' => 'product-test-api',
        ]);

        $this->assertDatabaseHas('product_category', [
            'product_id' => $id,
            'category_id' => Category::query()->firstOrFail()->id,
        ]);

        $this->assertDatabaseHas('product_style', [
            'product_id' => $id,
            'style_id' => Style::query()->firstOrFail()->id,
        ]);
    }

    public function test_product_creation_validates_input(): void
    {
        $this->actingAsAdminWithToken();

        $this->postJson('/api/v1/products', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors([
                'brand_id',
                'name',
                'slug',
                'currency',
            ]);
    }

    public function test_product_slug_must_be_unique(): void
    {
        $this->actingAsAdminWithToken();
        $product = Product::query()->firstOrFail();

        $payload = $this->validPayload();
        $payload['slug'] = $product->slug;

        $this->postJson('/api/v1/products', $payload)
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['slug']);
    }

    public function test_regular_user_cannot_update_product(): void
    {
        $this->actingAsRegularUser();
        $product = Product::query()->firstOrFail();

        $this->putJson("/api/v1/products/{$product->id}", [
            'name' => 'Unauthorized Product',
        ])->assertForbidden();
    }

    public function test_admin_can_update_product(): void
    {
        $this->actingAsAdminWithToken();
        $product = Product::query()->firstOrFail();

        $this->putJson("/api/v1/products/{$product->id}", [
            'name' => 'Updated Product',
        ])->assertOk();

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'name' => 'Updated Product',
        ]);
    }

    public function test_admin_can_update_product_relationships(): void
    {
        $this->actingAsAdminWithToken();
        $product = Product::query()->firstOrFail();
        $category = Category::query()->firstOrFail();
        $style = Style::query()->firstOrFail();

        $this->putJson("/api/v1/products/{$product->id}", [
            'category_ids' => [$category->id],
            'style_ids' => [$style->id],
        ])->assertOk();

        $this->assertDatabaseHas('product_category', [
            'product_id' => $product->id,
            'category_id' => $category->id,
        ]);

        $this->assertDatabaseHas('product_style', [
            'product_id' => $product->id,
            'style_id' => $style->id,
        ]);
    }

    public function test_regular_user_cannot_delete_product(): void
    {
        $this->actingAsRegularUser();
        $product = Product::query()->firstOrFail();

        $this->deleteJson("/api/v1/products/{$product->id}")
            ->assertForbidden();
    }

    public function test_admin_can_soft_delete_product(): void
    {
        $this->actingAsAdminWithToken();

        $response = $this->postJson('/api/v1/products', $this->validPayload())
            ->assertCreated();

        $id = $response->json('data.id');

        $this->deleteJson("/api/v1/products/{$id}")
            ->assertOk();

        $this->assertSoftDeleted('products', ['id' => $id]);
        $this->getJson("/api/v1/products/{$id}")
            ->assertNotFound();
    }

    public function test_it_searches_products_by_name(): void
    {
        $product = Product::query()
            ->where('status', 'published')
            ->firstOrFail();

        $response = $this->getJson(
            '/api/v1/products?search=' . urlencode($product->name)
        )->assertOk();

        $this->assertNotEmpty($response->json('data'));
    }

    public function test_it_filters_products_by_brand(): void
    {
        $product = Product::query()->where('status', 'published')->firstOrFail();

        $response = $this->getJson(
            "/api/v1/products?brand_id={$product->brand_id}"
        )->assertOk();

        foreach ($response->json('data') as $item) {
            $this->assertSame($product->brand_id, $item['brand']['id']);
        }
    }

    public function test_it_filters_products_by_collection(): void
    {
        $product = Product::query()
            ->where('status', 'published')
            ->whereNotNull('collection_id')
            ->firstOrFail();

        $response = $this->getJson(
            "/api/v1/products?collection_id={$product->collection_id}"
        )->assertOk();

        foreach ($response->json('data') as $item) {
            $this->assertSame($product->collection_id, $item['collection']['id']);
        }
    }

    public function test_it_filters_products_by_category(): void
    {
        $product = Product::query()
            ->where('status', 'published')
            ->has('categories')
            ->firstOrFail();
            
        $categoryId = $product->categories()->firstOrFail()->id;

        $response = $this->getJson(
            "/api/v1/products?category_id={$categoryId}"
        )->assertOk();

        foreach ($response->json('data') as $item) {
            $ids = collect($item['categories'] ?? [])->pluck('id')->all();
            $this->assertContains($categoryId, $ids);
        }
    }

    public function test_it_filters_products_by_style(): void
    {
        $product = Product::query()
            ->where('status', 'published')
            ->has('styles')
            ->firstOrFail();
        $styleId = $product->styles()->firstOrFail()->id;

        $response = $this->getJson(
            "/api/v1/products?style_id={$styleId}"
        )->assertOk();

        foreach ($response->json('data') as $item) {
            $ids = collect($item['styles'] ?? [])->pluck('id')->all();
            $this->assertContains($styleId, $ids);
        }
    }

    public function test_it_filters_products_by_gender(): void
    {
        $product = Product::query()
            ->where('status', 'published')
            ->whereNotNull('gender')
            ->firstOrFail();

        $response = $this->getJson(
            '/api/v1/products?gender=' . urlencode($product->gender)
        )->assertOk();

        foreach ($response->json('data') as $item) {
            $this->assertSame($product->gender, $item['gender']);
        }
    }

    public function test_it_filters_products_by_availability(): void
    {
        $product = Product::query()
            ->where('status', 'published')
            ->whereNotNull('availability')
            ->firstOrFail();

        $response = $this->getJson(
            '/api/v1/products?availability=' . urlencode($product->availability)
        )->assertOk();

        foreach ($response->json('data') as $item) {
            $this->assertSame($product->availability, $item['availability']);
        }
    }
}
