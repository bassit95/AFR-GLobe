<?php

namespace Tests\Feature\Api\V1;

class SearchTest extends ApiV1TestCase
{
    /**
     * Une recherche vide doit renvoyer 422 (validation).
     */
    public function test_search_requires_q(): void
    {
        $this->getJson('/api/v1/search')
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['q']);
    }

    /**
     * q trop court → 422.
     */
    public function test_search_q_must_be_at_least_2_characters(): void
    {
        $this->getJson('/api/v1/search?q=a')
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['q']);
    }

    /**
     * q trop long → 422.
     */
    public function test_search_q_must_be_at_most_255_characters(): void
    {
        $this->getJson('/api/v1/search?q=' . str_repeat('a', 256))
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['q']);
    }

    /**
     * Recherche valide → structure attendue.
     */
    public function test_search_returns_expected_structure(): void
    {
        $this->getJson('/api/v1/search?q=africa')
            ->assertOk()
            ->assertJsonStructure([
                'success',
                'message',
                'data' => [
                    'creators',
                    'brands',
                    'products',
                ],
                'meta' => [
                    'query',
                    'has_more' => [
                        'creators',
                        'brands',
                        'products',
                    ],
                    'per_category',
                ],
            ]);
    }

    /**
     * Recherche qui ne matche rien → tableaux vides.
     */
    public function test_search_returns_empty_arrays_when_no_match(): void
    {
        $response = $this->getJson('/api/v1/search?q=zzzzzzzzzzznexistepas')
            ->assertOk();

        $this->assertEmpty($response->json('data.creators'));
        $this->assertEmpty($response->json('data.brands'));
        $this->assertEmpty($response->json('data.products'));
    }

    /**
     * Recherche d'un créateur existant → le trouve.
     */
    public function test_search_finds_creator_by_name(): void
    {
        $creator = \App\Models\Creator::query()
            ->where('status', 'published')
            ->firstOrFail();

        $response = $this->getJson(
            '/api/v1/search?q=' . urlencode($creator->name)
        )->assertOk();

        $ids = collect($response->json('data.creators'))->pluck('id')->all();

        $this->assertContains($creator->id, $ids);
    }

    /**
     * Meta.query contient la valeur recherchée.
     */
    public function test_search_meta_contains_the_query(): void
    {
        $response = $this->getJson('/api/v1/search?q=test')
            ->assertOk();

        $this->assertSame('test', $response->json('meta.query'));
    }
}