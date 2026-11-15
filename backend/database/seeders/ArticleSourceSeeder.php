<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Source;
use Illuminate\Database\Seeder;

class ArticleSourceSeeder extends Seeder
{
    public function run(): void
    {
        $article = Article::where('slug', 'six-maisons-mode-africaine-a-decouvrir')->firstOrFail();

        // Bug #21 — URL "industrieafrica.com/resources/designers/kenneth-ize" retirée.
        // Elle était référencée ici mais n'existe pas dans SourceSeeder → sync() l'ignorait.
        $article->sources()->sync(Source::query()->whereIn('url', [
            'https://www.thebemagugu.com/about/',
            'https://imane-ayissi.com/en',
            'https://www.lisafolawiyo.com/about',
            'https://www.lozamaleombho.com/fr/about',
            'https://www.sellyrabykane.net/',
        ])->pluck('id')->all());
    }
}