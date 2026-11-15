<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Database\Seeders\Support\SeedRecord;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // These product names, prices and URLs were listed on Imane Ayissi's official shop at preparation time.
        // Prices and availability can change; re-check the official product page before displaying them as live data.
        $products = [
            [
                'slug'=>'imane-ayissi-veste-soie-raphia', 'name'=>'Veste en soie et raphia',
                'description'=>'Article listé sur la boutique officielle d’Imane Ayissi.', 'price'=>3100.00, 'currency'=>'EUR',
                'url'=>'https://imane-ayissi.com/en/products/veste-mariage-raphia-copie?variant=52915325796699',
                'categories'=>['womenswear', 'ready-to-wear'],
            ],
            [
                'slug'=>'imane-ayissi-robe-faso-dan-fani', 'name'=>'Robe rayée en Faso Dan Fani biologique',
                'description'=>'Article listé sur la boutique officielle d’Imane Ayissi.', 'price'=>1180.00, 'currency'=>'EUR',
                'url'=>'https://imane-ayissi.com/en/products/robe-rayee-faso-dan-fani?variant=52614473744731',
                'categories'=>['womenswear', 'ready-to-wear', 'textile'],
            ],
            [
                'slug'=>'imane-ayissi-sac-sifeun', 'name'=>'Sac Sifeun',
                'description'=>'Article listé dans la section sacs de la boutique officielle d’Imane Ayissi.', 'price'=>990.00, 'currency'=>'EUR',
                'url'=>'https://imane-ayissi.com/en/products/sac-sifeun?variant=52614475284827',
                'categories'=>['bags', 'accessories'],
            ],
        ];

        $brand = Brand::where('slug', 'imane-ayissi-couture')->firstOrFail();
        foreach ($products as $data) {
            $product = SeedRecord::upsert(Product::class, ['slug' => $data['slug']], [
                'brand_id' => $brand->id, 'collection_id' => null,
                'name' => $data['name'], 'slug' => $data['slug'], 'description' => $data['description'],
                'image' => null, 'price' => $data['price'], 'currency' => $data['currency'], 'gender' => null,
                'product_url' => $data['url'], 'availability' => 'available', 'status' => 'published',
            ]);
            $categoryIds = Category::whereIn('slug', $data['categories'])->pluck('id')->all();
            $product->categories()->sync($categoryIds);
        }
    }
}
