<?php

namespace Tests\Feature\Api\V1;

use App\Models\Category;

class CategoryTest extends ApiV1TestCase
{
    public function test_it_has_seeded_categories(): void
    {
        $this->assertGreaterThan(0, Category::count());
    }

    public function test_it_returns_categories(): void
    {
        $response = $this->getJson('/api/v1/categories')
            ->assertOk()
            ->assertJsonStructure(['success', 'data', 'meta']);

        $this->assertNotEmpty($response->json('data'));
    }

    public function test_it_returns_one_category_with_relations(): void
    {
        $category = Category::query()->firstOrFail();

        $this->getJson("/api/v1/categories/{$category->id}")
            ->assertOk()
            ->assertJsonStructure([
                'success',
                'data' => ['id', 'name', 'slug', 'description'],
            ]);
    }

    public function test_it_rejects_creation_without_authentication(): void
    {
        $this->postJson('/api/v1/categories', [])
            ->assertUnauthorized();
    }

    private function validPayload(): array
    {
        return [
            'name' => 'Category Test API',
            'slug' => 'category-test-api',
            'description' => 'Category de test.',
        ];
    }

    public function test_regular_user_cannot_create_category(): void
    {
        $this->actingAsRegularUser();

        $this->postJson('/api/v1/categories', $this->validPayload())
            ->assertForbidden();
    }

    public function test_admin_can_create_category(): void
    {
       $this->actingAsAdminWithToken();

        $response = $this->postJson(
            '/api/v1/categories',
            $this->validPayload()
        )
            ->assertCreated()
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('categories', [
            'id' => $response->json('data.id'),
            'slug' => 'category-test-api',
        ]);
    }

    public function test_category_creation_validates_input(): void
    {
       $this->actingAsAdminWithToken();

        $this->postJson('/api/v1/categories', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'slug']);
    }

    public function test_category_slug_must_be_unique(): void
    {
       $this->actingAsAdminWithToken();

        $category = Category::query()->firstOrFail();
        $payload = $this->validPayload();
        $payload['slug'] = $category->slug;

        $this->postJson('/api/v1/categories', $payload)
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['slug']);
    }

    public function test_regular_user_cannot_update_category(): void
    {
        $this->actingAsRegularUser();

        $category = Category::query()->firstOrFail();

        $this->putJson("/api/v1/categories/{$category->id}", [
            'name' => 'Unauthorized Category',
        ])->assertForbidden();
    }

    public function test_admin_can_update_category(): void
    {
        $this->actingAsAdminWithToken();
        $category = Category::query()->firstOrFail();

        $this->putJson("/api/v1/categories/{$category->id}", [
            'name' => 'Updated Category',
        ])->assertOk();

        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'name' => 'Updated Category',
        ]);
    }

    public function test_regular_user_cannot_delete_category(): void
    {
        $this->actingAsRegularUser();
        $category = Category::query()->firstOrFail();

        $this->deleteJson("/api/v1/categories/{$category->id}")
            ->assertForbidden();
    }

    public function test_admin_can_soft_delete_category(): void
    {
       $this->actingAsAdminWithToken();

        $response = $this->postJson('/api/v1/categories', $this->validPayload())
            ->assertCreated();

        $id = $response->json('data.id');

        $this->deleteJson("/api/v1/categories/{$id}")
            ->assertOk();

        $this->assertSoftDeleted('categories', ['id' => $id]);
        $this->getJson("/api/v1/categories/{$id}")
            ->assertNotFound();
    }

    public function test_it_searches_categories(): void
    {
        $category = Category::query()->firstOrFail();

        $response = $this->getJson(
            '/api/v1/categories?search=' . urlencode($category->name)
        )->assertOk();

        $this->assertNotEmpty($response->json('data'));
    }
}
