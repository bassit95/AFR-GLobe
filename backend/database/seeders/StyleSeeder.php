<?php

namespace Database\Seeders;

use App\Models\Style;
use Database\Seeders\Support\SeedRecord;
use Illuminate\Database\Seeder;

class StyleSeeder extends Seeder
{
    public function run(): void
    {
        $parents = [
            ['traditionnel', 'Traditionnel', 'Styles inspirés des héritages culturels, vestimentaires et artisanaux.'],
            ['contemporain', 'Contemporain', 'Approches modernes de la création africaine.'],
            ['streetwear', 'Streetwear', 'Styles issus des cultures urbaines.'],
            ['luxe', 'Luxe', 'Créations axées sur le raffinement et les finitions haut de gamme.'],
            ['minimaliste', 'Minimaliste', 'Lignes épurées et sobriété visuelle.'],
            ['avant-garde', 'Avant-garde', 'Approches expérimentales et non conventionnelles.'],
            ['afro-futuriste', 'Afro-futuriste', 'Références africaines et imaginaire du futur.'],
            ['casual', 'Casual', 'Style décontracté pour le quotidien.'],
            ['formel', 'Formel', 'Tenues élégantes, professionnelles ou cérémonielles.'],
        ];

        $parentIds = [];
        foreach ($parents as [$slug, $name, $description]) {
            $style = SeedRecord::upsert(Style::class, ['slug' => $slug], [
                'name' => $name, 'slug' => $slug, 'parent_id' => null, 'description' => $description,
            ]);
            $parentIds[$slug] = $style->id;
        }

        // Child slugs are explicit and unique, including the two distinct meanings of Experimental.
        $children = [
            ['heritage-africain', 'Héritage africain', 'traditionnel', 'Créations inspirées des traditions vestimentaires africaines.'],
            ['artisanal', 'Artisanal', 'traditionnel', 'Mise en valeur des techniques et savoir-faire manuels.'],
            ['culturel', 'Culturel', 'traditionnel', 'Créations inspirées de symboles et références culturelles.'],
            ['modern-african', 'Modern African', 'contemporain', 'Interprétation contemporaine de références africaines.'],
            ['fusion', 'Fusion', 'contemporain', 'Mélange de plusieurs influences culturelles et esthétiques.'],
            ['experimental-contemporain', 'Experimental', 'contemporain', 'Exploration contemporaine de formes, matières et idées.'],
            ['urban', 'Urban', 'streetwear', 'Influences urbaines contemporaines.'],
            ['oversized', 'Oversized', 'streetwear', 'Silhouettes et volumes amples.'],
            ['sport-inspired', 'Sport-inspired', 'streetwear', 'Mode influencée par l’univers sportif.'],
            ['luxury', 'Luxury', 'luxe', 'Créations haut de gamme axées sur l’exclusivité et la qualité.'],
            ['haute-elegance', 'Haute élégance', 'luxe', 'Esthétique raffinée pour occasions prestigieuses.'],
            ['couture-inspired', 'Couture-inspired', 'luxe', 'Esthétique inspirée des codes de la couture.'],
            ['clean', 'Clean', 'minimaliste', 'Design épuré avec une attention aux lignes et proportions.'],
            ['monochrome', 'Monochrome', 'minimaliste', 'Palette chromatique réduite.'],
            ['sculptural', 'Sculptural', 'avant-garde', 'Volumes et formes utilisés comme éléments artistiques.'],
            ['experimental-avant-garde', 'Experimental', 'avant-garde', 'Approche non conventionnelle des formes et matières.'],
            ['conceptual', 'Conceptual', 'avant-garde', 'L’idée et l’expression artistique sont centrales.'],
            ['futuristic', 'Futuristic', 'afro-futuriste', 'Esthétique tournée vers l’imaginaire du futur.'],
            ['tech-inspired', 'Tech-inspired', 'afro-futuriste', 'Créations influencées par la technologie et l’innovation.'],
            ['everyday', 'Everyday', 'casual', 'Créations adaptées à la vie quotidienne.'],
            ['relaxed', 'Relaxed', 'casual', 'Silhouettes confortables et décontractées.'],
            ['business', 'Business', 'formel', 'Style destiné aux environnements professionnels.'],
            ['ceremonial', 'Ceremonial', 'formel', 'Créations destinées aux cérémonies et événements particuliers.'],
        ];

        foreach ($children as [$slug, $name, $parentSlug, $description]) {
            SeedRecord::upsert(Style::class, ['slug' => $slug], [
                'name' => $name, 'slug' => $slug, 'parent_id' => $parentIds[$parentSlug], 'description' => $description,
            ]);
        }
    }
}
