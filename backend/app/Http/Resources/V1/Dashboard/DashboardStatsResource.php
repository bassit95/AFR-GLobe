<?php

namespace App\Http\Resources\V1\Dashboard;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DashboardStatsResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'creators' => $this->resource['creators'],
            'brands' => $this->resource['brands'],
            'articles' => $this->resource['articles'],
            'products' => $this->resource['products'],
        ];
    }
}