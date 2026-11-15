<?php

namespace Database\Seeders;

use App\Models\Article;
use App\Models\Source;
use Illuminate\Database\Seeder;

class SiwakArticleSeeder extends Seeder
{
    /**
     * Seed a researched editorial article and its bibliography.
     * Safe to run more than once: existing records are updated by stable slug/URL.
     */
    public function run(): void
    {
        $article = Article::withTrashed()->firstOrNew(
            ['slug' => 'le-siwak-sothiou-histoire-et-usages']
        );

        $article->fill([
                'title' => 'Le siwak et le sothiou : histoire d’un bâtonnet frotte-dents',
                'slug' => 'le-siwak-sothiou-histoire-et-usages',
                'article_type' => 'culture',
                'excerpt' => 'Du siwak associé au monde arabophone au sothiou documenté au Sénégal, l’histoire des bâtonnets frotte-dents éclaire des pratiques d’hygiène, des transmissions culturelles et des savoirs locaux qui ne se résument pas à une seule origine.',
                'content' => <<<'MARKDOWN'
## Un objet simple, plusieurs histoires

Un petit bâtonnet, une extrémité mâchonnée jusqu’à former des fibres : le geste peut sembler modeste, mais il appartient à une histoire longue et diverse de l’hygiène bucco-dentaire. Selon les lieux et les langues, on rencontre les mots *siwak*, *miswak*, *sothiou* ou d’autres noms locaux. Ils ne désignent pas toujours exactement la même plante ni une pratique parfaitement identique.

Pour raconter cette histoire avec précision, il faut éviter une idée trop simple : le siwak ne constitue pas une invention exclusivement africaine, et tous les bâtonnets utilisés en Afrique ne proviennent pas nécessairement de la même espèce végétale. Les recherches sur les bâtonnets frotte-dents décrivent des usages dans plusieurs régions d’Afrique, du Moyen-Orient et d’Asie, avec des plantes et des habitudes qui varient selon les contextes.

## Siwak, miswak : de quoi parle-t-on ?

Le mot arabe *siwak* (également écrit *miswak* ou *miswaak*) est associé au nettoyage des dents. Dans la littérature scientifique, il désigne souvent un bâtonnet issu de *Salvadora persica*, un arbuste également connu sous le nom d’arak dans plusieurs sources. Les racines, tiges ou petites branches de cette plante ont été décrites dans les pratiques d’hygiène buccale.

Mais l’expression « bâtonnet frotte-dents » est plus large que le seul siwak de *Salvadora persica*. Des communautés ont utilisé des espèces végétales différentes pour fabriquer un outil similaire. Le nom, la plante choisie, la préparation et la façon de se brosser les dents doivent donc être replacés dans leur contexte local.

## Une pratique antérieure à l’époque contemporaine

Les revues scientifiques consacrées au miswak rappellent que les instruments végétaux de nettoyage des dents ont une histoire ancienne. Certaines traditions ont été transmises dans des contextes sociaux, pratiques et religieux. L’usage du miswak est particulièrement associé à la culture islamique, mais les travaux historiques signalent que les bâtonnets nettoyants existaient aussi avant l’islam et dans d’autres traditions.

Il est toutefois difficile de fixer une origine unique à l’ensemble des bâtonnets frotte-dents. Les objets, les plantes et les pratiques n’ont pas partout la même histoire. Il est donc plus rigoureux de parler de traditions multiples, qui se sont développées et diffusées dans des sociétés différentes, plutôt que d’attribuer toute la pratique à un seul peuple ou à un seul continent.

## Le Sénégal : le sothiou et les bâtonnets frotte-dents

Le Sénégal offre un exemple documenté de cette diversité. Une thèse universitaire publiée en 2018, consacrée au *sothiou*, décrit l’usage de bâtonnets frotte-dents comme une pratique traditionnelle répandue dans le pays. Le principe décrit consiste à humidifier une branche ou une racine, puis à mâchonner son extrémité afin de dégager des fibres utilisées pour nettoyer les dents.

Un article scientifique plus ancien, paru en 1983 dans la revue *Odonto-Stomatologie Tropicale*, porte également sur l’utilisation du « soccu » au Sénégal. Ces références montrent l’intérêt de conserver les noms employés localement et de documenter les pratiques dans leurs contextes. Elles ne permettent pas, à elles seules, d’affirmer que tous les groupes du Sénégal utilisent le même bâtonnet, la même plante ou la même technique.

Dans le Sahel et d’autres régions, les bâtonnets frotte-dents s’inscrivent dans des réalités écologiques, économiques et culturelles diverses. Disponibilité des plantes, transmission familiale, habitudes quotidiennes et contexte religieux peuvent jouer des rôles différents selon les communautés. Une documentation sérieuse doit laisser apparaître cette pluralité.

## Entre savoir traditionnel et recherche scientifique

Le siwak intéresse aussi la recherche en santé bucco-dentaire. Certaines études évaluent son action mécanique sur la plaque dentaire et les indicateurs liés aux gencives. Les résultats ne doivent cependant pas être résumés par une promesse universelle : les études utilisent des méthodes, des durées et des techniques qui diffèrent, ce qui rend les comparaisons délicates.

Une revue de portée publiée en 2021 a relevé des résultats favorables dans certaines études, tout en signalant que des problèmes comme la récession gingivale ou la perte d’attache clinique étaient davantage rapportés dans certains groupes d’utilisateurs. Les auteurs soulignent le rôle possible de la manière d’utiliser le bâtonnet et le manque d’uniformité des protocoles. Une revue publiée en 2025 confirme que les méthodes de préparation, la fréquence, la durée, l’angle du brossage et le stockage varient entre populations étudiées.

Ces travaux sont utiles pour comprendre les recherches en cours, mais ils ne transforment pas une pratique culturelle en conseil médical universel. Le contexte, la technique, l’état bucco-dentaire et l’avis d’un professionnel restent importants.

## Pourquoi documenter cette histoire dans Africa Global ?

Les histoires de la création et des cultures ne concernent pas uniquement les vêtements ou les objets exposés dans les musées. Elles traversent aussi les gestes du quotidien, les outils, les matières, les noms et les savoirs transmis. Le siwak et le sothiou offrent un exemple de la manière dont un objet apparemment ordinaire peut ouvrir des questions d’histoire, de langage, de botanique, de religion, de santé et de transmission culturelle.

Africa Global souhaite documenter ces récits sans les uniformiser. Notre rôle est de proposer des points de départ vérifiables, d’indiquer les sources consultées et de laisser de la place aux recherches et aux témoignages locaux qui pourront compléter ou nuancer le récit.

> Comprendre un objet, c’est aussi comprendre les lieux, les langues et les personnes qui lui donnent son sens.

## Sources et lectures complémentaires

Les références ci-dessous documentent l’histoire générale des bâtonnets nettoyants, les usages du miswak et le cas du sothiou au Sénégal. Elles n’ont pas toutes la même nature : revue scientifique, étude clinique et travail universitaire doivent être lus selon leur objet et leurs limites.

MARKDOWN,
                'cover_image' => 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Miswak.jpg',
                'author_id' => null,
                'status' => 'published',
        ]);

        if (! $article->published_at) {
            $article->published_at = now();
        }

        $article->save();

        if (method_exists($article, 'trashed') && $article->trashed()) {
            $article->restore();
        }

        $sources = [
            [
                'title' => 'A review on miswak (Salvadora persica) and its effect on various aspects of oral health',
                'source_type' => 'academic_review',
                'url' => 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3723367/',
                'publisher' => 'Saudi Dental Journal / PubMed Central',
                'published_at' => '2012-04-01',
            ],
            [
                'title' => 'Miswak (Salvadora persica chewing stick): the natural toothbrush revisited',
                'source_type' => 'academic_review',
                'url' => 'https://pubmed.ncbi.nlm.nih.gov/24979958/',
                'publisher' => 'Odonto-Stomatologie Tropicale',
                'published_at' => '2014-03-01',
            ],
            [
                'title' => 'Le « Sothiou » ou bâtonnet frotte-dents comme outil d’hygiène bucco-dentaire : exemple du Sénégal',
                'source_type' => 'university_thesis',
                'url' => 'https://utheme.utoulouse.fr/s/fr/item/32431',
                'publisher' => 'Université de Toulouse — Karen Da Luz',
                'published_at' => '2018-12-18',
            ],
            [
                'title' => 'Clinical benefits and adverse effects of siwak use on periodontal health: a scoping review',
                'source_type' => 'academic_review',
                'url' => 'https://pubmed.ncbi.nlm.nih.gov/34861857/',
                'publisher' => 'PubMed',
                'published_at' => '2021-01-01',
            ],
            [
                'title' => 'Knowledge, Awareness, and Practice Towards the Use of Salvadora persica L. (Miswak) Chewing Stick: A Scoping Review',
                'source_type' => 'academic_review',
                'url' => 'https://pubmed.ncbi.nlm.nih.gov/41228114/',
                'publisher' => 'Healthcare (Basel) / PubMed',
                'published_at' => '2025-10-30',
            ],
            [
                'title' => 'Miswak.jpg — description et licence de l’image',
                'source_type' => 'image_license',
                'url' => 'https://commons.wikimedia.org/wiki/File:Miswak.jpg',
                'publisher' => 'Wikimedia Commons — auteur : Kriplozoik',
                'published_at' => '2013-09-17',
            ],
        ];

        foreach ($sources as $sourceData) {
            $source = Source::withTrashed()->updateOrCreate(
                ['url' => $sourceData['url']],
                [
                    'title' => $sourceData['title'],
                    'source_type' => $sourceData['source_type'],
                    'url' => $sourceData['url'],
                    'publisher' => $sourceData['publisher'],
                    'published_at' => $sourceData['published_at'],
                    'checked_at' => now(),
                ]
            );

            if (method_exists($source, 'trashed') && $source->trashed()) {
                $source->restore();
            }

            $article->sources()->syncWithoutDetaching([$source->id]);
        }
    }
}
