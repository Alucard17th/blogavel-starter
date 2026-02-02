<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\BlogavelAdmin;

use Blogavel\Blogavel\Http\Resources\TagResource;
use Blogavel\Blogavel\Models\Tag;
use Illuminate\Routing\Controller;

final class TagController extends Controller
{
    public function index()
    {
        $tags = Tag::query()->orderBy('name')->get();

        return TagResource::collection($tags);
    }
}
