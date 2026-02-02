<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\BlogavelAdmin;

use Blogavel\Blogavel\Http\Resources\MediaResource;
use Blogavel\Blogavel\Models\Media;
use Illuminate\Routing\Controller;
use Symfony\Component\HttpFoundation\Response;

final class MediaController extends Controller
{
    public function index()
    {
        $media = Media::query()->orderByDesc('id')->paginate(50);

        return MediaResource::collection($media);
    }

    public function show(string $media)
    {
        $model = Media::query()->find($media);

        if (!$model) {
            return response()->json(
                ['message' => 'Media not found'],
                Response::HTTP_NOT_FOUND,
            );
        }

        return new MediaResource($model);
    }
}
