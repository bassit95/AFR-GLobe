<?php

namespace App\Services;

use App\Models\Article;
use App\Models\Brand;
use App\Models\Creator;
use App\Models\Product;

class DashboardService
{
    public function getStats(): array
    {
        return [
            'creators' => Creator::count(),
            'brands' => Brand::count(),
            'articles' => Article::count(),
            'products' => Product::count(),
        ];
    }
}