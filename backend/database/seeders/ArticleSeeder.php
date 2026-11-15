<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\User;
use Database\Seeders\Support\SeedRecord;
use Illuminate\Database\Seeder;

class ArticleSeeder extends Seeder
{
    public function run(): void
    {
        $authorId = User::where('role', 'admin')->value('id');

        SeedRecord::upsert(Article::class, ['slug' => 'six-maisons-mode-africaine-a-decouvrir'], [
            'title' => 'Six maisons de mode africaine à découvrir',
            'slug' => 'six-maisons-mode-africaine-a-decouvrir',
            'excerpt' => 'Six parcours de création, du prêt-à-porter contemporain à la couture, à explorer à travers les sites et sources officiels des maisons.',
            'content' => "La mode africaine contemporaine réunit des démarches très diverses : travail textile, couture, recherche sur les silhouettes, artisanat et narration visuelle. Ce panorama présente six créateurs et maisons à explorer à partir de sources publiques.\n\nThebe Magugu développe une maison sud-africaine de prêt-à-porter pour femmes et hommes, articulant références culturelles, nouveauté et qualité. Imane Ayissi présente des collections de couture, du prêt-à-porter et des accessoires, avec une attention portée aux matières et aux savoir-faire.\n\nKenneth Ize réinterprète l’artisanat nigérian et le textile aso-oke dans une esthétique contemporaine. Lisa Folawiyo transforme notamment des textiles tels que l’Ankara et l’Akwete avec des embellissements faits main et une coupe moderne.\n\nLoza Maléombho développe une approche du design nourrie par son parcours multiculturel et des références ivoiriennes. Selly Raby Kane associe mode, réalisation et imaginaire urbain de Dakar.\n\nLes informations d’un annuaire doivent évoluer avec les maisons : consultez les sites officiels liés à chaque fiche pour les collections, coordonnées et produits les plus récents. Les prix et disponibilités peuvent changer.",
            'cover_image' => null,
            'article_type' => 'culture',      // ← AJOUT explicite (bug #19)
            'author_id' => $authorId,
            'published_at' => now(),
            'status' => 'published',
        ]);
    }
}