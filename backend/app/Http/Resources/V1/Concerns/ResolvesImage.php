<?php

namespace App\Http\Resources\V1\Concerns;

use Illuminate\Support\Facades\Storage;

trait ResolvesImage
{
    protected function image(?string $path): ?string
    {
        if (! $path) return null;
        
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return $path;
        }
        return Storage::url($path);
    }
}