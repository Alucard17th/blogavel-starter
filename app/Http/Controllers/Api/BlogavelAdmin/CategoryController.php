<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\BlogavelAdmin;

use Blogavel\Blogavel\Http\Resources\CategoryResource;
use Blogavel\Blogavel\Models\Category;
use Illuminate\Routing\Controller;

final class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::query()->orderBy('name')->get();

        return CategoryResource::collection($categories);
    }
}
