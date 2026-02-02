<h1>Edit Post</h1>

<form method="POST" action="{{ route('blogavel.admin.posts.update', $post) }}" enctype="multipart/form-data">
    @csrf
    @method('PUT')

    <div>
        <label>Title</label>
        <input name="title" value="{{ old('title', $post->title) }}" />
        @error('title')<div>{{ $message }}</div>@enderror
    </div>

    <div>
        <label>Slug (optional)</label>
        <input name="slug" value="{{ old('slug', $post->slug) }}" />
        @error('slug')<div>{{ $message }}</div>@enderror
    </div>

    <div>
        <label>Category</label>
        <select name="category_id">
            <option value="">(none)</option>
            @foreach ($categories as $category)
                <option value="{{ $category->id }}" @selected((string) old('category_id', $post->category_id) === (string) $category->id)>
                    {{ $category->name }}
                </option>
            @endforeach
        </select>
        @error('category_id')<div>{{ $message }}</div>@enderror
    </div>

    <div>
        <label>Tags</label>
        @php($selectedTags = (array) old('tags', $post->tags->pluck('id')->all()))
        <div>
            @foreach ($tags as $tag)
                <label>
                    <input type="checkbox" name="tags[]" value="{{ $tag->id }}" @checked(in_array((string) $tag->id, array_map('strval', $selectedTags), true)) />
                    {{ $tag->name }}
                </label>
            @endforeach
        </div>
        @error('tags')<div>{{ $message }}</div>@enderror
        @error('tags.*')<div>{{ $message }}</div>@enderror
    </div>

    <div>
        <label>Status</label>
        <select name="status">
            @foreach (['draft','scheduled','published'] as $status)
                <option value="{{ $status }}" @selected(old('status', $post->status) === $status)>{{ $status }}</option>
            @endforeach
        </select>
        @error('status')<div>{{ $message }}</div>@enderror
    </div>

    <div>
        <label>Published at</label>
        <input name="published_at" value="{{ old('published_at', optional($post->published_at)->format('Y-m-d H:i:s')) }}" />
        @error('published_at')<div>{{ $message }}</div>@enderror
    </div>

    <div>
        <label>Content</label>
        <textarea name="content" rows="10">{{ old('content', $post->content) }}</textarea>
        @error('content')<div>{{ $message }}</div>@enderror
    </div>

    <div>
        <label>Featured image</label>
        @if ($post->featuredMedia)
            <div>
                <img src="{{ \Illuminate\Support\Facades\Storage::disk($post->featuredMedia->disk)->url($post->featuredMedia->path) }}" alt="" style="max-height:80px" />
            </div>
            <label>
                <input type="checkbox" name="remove_featured_image" value="1" />
                Remove featured image
            </label>
        @endif
        <div>
            <input type="file" name="featured_image" />
            @error('featured_image')<div>{{ $message }}</div>@enderror
        </div>
    </div>

    <button type="submit">Save</button>
</form>
