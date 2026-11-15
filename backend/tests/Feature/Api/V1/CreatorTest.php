<?php

namespace Tests\Feature\Api\V1;

use App\Models\Category;
use App\Models\City;
use App\Models\Country;
use App\Models\Creator;
use App\Models\Style;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CreatorTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Charger les données des Seeders
        $this->seed();
    }

    /*
    |--------------------------------------------------------------------------
    | 1. Vérifier les Creators des Seeders
    |--------------------------------------------------------------------------
    */

    public function test_it_has_seeded_creators(): void
    {
        $this->assertGreaterThan(
            0,
            Creator::count()
        );
    }

    /*
    |--------------------------------------------------------------------------
    | 2. Liste des Creators publiés
    |--------------------------------------------------------------------------
    */

    public function test_it_returns_the_list_of_published_creators(): void
    {
        $response = $this->getJson('/api/v1/creators');

        $response
            ->assertOk()
            ->assertJsonStructure([
                'success',
                'data',
                'meta',
            ]);
    }

    /*
    |--------------------------------------------------------------------------
    | 3. Détail d'un Creator avec ses relations
    |--------------------------------------------------------------------------
    */

    public function test_it_returns_a_single_creator_with_its_relations(): void
    {
        // Récupérer un Creator existant dans les Seeders
        $creator = Creator::query()->firstOrFail();

        $response = $this->getJson(
            "/api/v1/creators/{$creator->id}"
        );

        $response
            ->assertOk()
            ->assertJsonStructure([
                'success',
                'data' => [
                    'id',
                    'name',
                    'slug',
                    'profile_image',
                    'cover_image',
                    'gender',
                    'short_bio',
                    'biography',
                    'website_url',
                    'social_links',
                    'verification_status',
                    'country_of_origin',
                    'country_of_residence',
                    'city_of_residence',
                    'categories',
                    'styles',
                    'brands',
                    'portfolio_count',
                ],
            ]);
    }

    /*
    |--------------------------------------------------------------------------
    | 4. Création sans authentification
    |--------------------------------------------------------------------------
    */

    public function test_it_rejects_creator_creation_without_authentication(): void
    {
        $response = $this->postJson(
            '/api/v1/creators',
            []
        );

        $response->assertUnauthorized();
    }

    /*
    |--------------------------------------------------------------------------
    | 5. Création avec authentification Sanctum
    |--------------------------------------------------------------------------
    */

    public function test_it_creates_a_creator_when_authenticated(): void
    {
        // Récupérer l'administrateur défini dans UserSeeder
        $admin = User::where(
            'email',
            'admin@africaglobal.test'
        )->firstOrFail();

        // Générer un token Sanctum
        $token = $admin
            ->createToken('test-token')
            ->plainTextToken;

        // Récupérer les données nécessaires
        $countryOrigin = Country::query()
            ->firstOrFail();

        $countryResidence = Country::query()
            ->skip(1)
            ->firstOrFail();

        $city = City::query()
            ->firstOrFail();

        // Données envoyées à l'API
        $payload = [
            'name' => 'Creator Test API',
            'slug' => 'creator-test-api',

            'country_of_origin_id' => $countryOrigin->id,
            'country_of_residence_id' => $countryResidence->id,
            'city_of_residence_id' => $city->id,

            'gender' => 'female',

            'short_bio' => 'Creator créé pour le test API.',
            'biography' => 'Biographie de test.',

            'website_url' => 'https://example.com',

            'status' => 'published',
            'verification_status' => 'unverified',
        ];

        // Requête avec Bearer Token
        $response = $this
            ->withToken($token)
            ->postJson(
                '/api/v1/creators',
                $payload
            );

        $response
            ->assertCreated()
            ->assertJsonPath('success', true);

        // Vérifier la création en base
        $this->assertDatabaseHas('creators', [
            'name' => 'Creator Test API',
            'slug' => 'creator-test-api',
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | 6. Modifier un Creator
    |--------------------------------------------------------------------------
    */

    public function test_it_updates_a_creator(): void
    {
        // Récupérer l'administrateur
        $admin = User::where(
            'email',
            'admin@africaglobal.test'
        )->firstOrFail();

        // Générer un token Sanctum
        $token = $admin
            ->createToken('test-token')
            ->plainTextToken;

        // Récupérer un Creator existant
        $creator = Creator::query()
            ->firstOrFail();

        // Modifier le Creator
        $response = $this
            ->withToken($token)
            ->putJson(
                "/api/v1/creators/{$creator->id}",
                [
                    'name' => 'Creator Updated',
                ]
            );

        $response
            ->assertOk()
            ->assertJsonPath('success', true);

        // Vérifier la modification en base
        $this->assertDatabaseHas('creators', [
            'id' => $creator->id,
            'name' => 'Creator Updated',
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | 7. Soft Delete
    |--------------------------------------------------------------------------
    */

    public function test_it_soft_deletes_a_creator(): void
    {
        // Récupérer l'administrateur
        $admin = User::where(
            'email',
            'admin@africaglobal.test'
        )->firstOrFail();

        // Générer un token Sanctum
        $token = $admin
            ->createToken('test-token')
            ->plainTextToken;

        // Récupérer les données nécessaires
        $countryOrigin = Country::query()
            ->firstOrFail();

        $countryResidence = Country::query()
            ->skip(1)
            ->firstOrFail();

        $city = City::query()
            ->firstOrFail();

        // Créer un Creator spécialement pour le test
        $createResponse = $this
            ->withToken($token)
            ->postJson(
                '/api/v1/creators',
                [
                    'name' => 'Creator Delete Test',
                    'slug' => 'creator-delete-test',

                    'country_of_origin_id' => $countryOrigin->id,
                    'country_of_residence_id' => $countryResidence->id,
                    'city_of_residence_id' => $city->id,

                    'gender' => 'female',

                    'short_bio' => 'Delete test',
                    'biography' => 'Delete test',

                    'status' => 'published',
                    'verification_status' => 'unverified',
                ]
            );

        // Vérifier que le Creator a bien été créé
        $createResponse->assertCreated();

        // Récupérer son ID
        $creatorId = $createResponse->json('data.id');

        // Supprimer le Creator avec le même Bearer Token
        $deleteResponse = $this
            ->withToken($token)
            ->deleteJson(
                "/api/v1/creators/{$creatorId}"
            );

        // Vérifier la réponse HTTP
        $deleteResponse->assertOk();

        // Vérifier le Soft Delete
        $this->assertSoftDeleted('creators', [
            'id' => $creatorId,
        ]);
    }

    /*
    |--------------------------------------------------------------------------
    | 8. Recherche par nom
    |--------------------------------------------------------------------------
    */

    public function test_it_searches_creators_by_name(): void
    {
        $creator = Creator::query()
            ->orderBy('name')
            ->firstOrFail();

        $response = $this->getJson(
            '/api/v1/creators?search=' .
            urlencode($creator->name)
        );

        $response
            ->assertOk()
            ->assertJsonPath('success', true);
    }

    /*
    |--------------------------------------------------------------------------
    | 9. Filtre par catégorie
    |--------------------------------------------------------------------------
    */

    public function test_it_filters_creators_by_category(): void
    {
        $category = Category::query()
            ->firstOrFail();

        $response = $this->getJson(
            "/api/v1/creators?category={$category->id}"
        );

        $response
            ->assertOk()
            ->assertJsonPath('success', true);
    }

    /*
    |--------------------------------------------------------------------------
    | 10. Filtre par style
    |--------------------------------------------------------------------------
    */

    public function test_it_filters_creators_by_style(): void
    {
        $style = Style::query()
            ->firstOrFail();

        $response = $this->getJson(
            "/api/v1/creators?style={$style->id}"
        );

        $response
            ->assertOk()
            ->assertJsonPath('success', true);
    }

    /*
    |--------------------------------------------------------------------------
    | 11. Filtre par pays d'origine
    |--------------------------------------------------------------------------
    */

    public function test_it_filters_creators_by_country_of_origin(): void
    {
        $country = Country::query()
            ->firstOrFail();

        $response = $this->getJson(
            "/api/v1/creators?country_origin={$country->id}"
        );

        $response
            ->assertOk()
            ->assertJsonPath('success', true);
    }

    /*
    |--------------------------------------------------------------------------
    | 12. Filtre alphabétique
    |--------------------------------------------------------------------------
    */

    public function test_it_filters_creators_by_letter(): void
    {
        $creator = Creator::query()
            ->orderBy('name')
            ->firstOrFail();

        $letter = strtoupper(
            substr($creator->name, 0, 1)
        );

        $response = $this->getJson(
            "/api/v1/creators?letter={$letter}"
        );

        $response
            ->assertOk()
            ->assertJsonPath('success', true);
    }
}