<h1>Create Post</h1>

<form method="POST" action="{{ route('blogavel.admin.posts.store') }}" enctype="multipart/form-data">
    @csrf

    <div>
        <label>Title</label>
        <input name="title" value="{{ old('title') }}" />
        @error('title')<div>{{ $message }}</div>@enderror
    </div>

    <div>
        <label>Slug (optional)</label>
        <input name="slug" value="{{ old('slug') }}" />
        @error('slug')<div>{{ $message }}</div>@enderror
    </div>

    <div>
        <label>Category</label>
        <select name="category_id">
            <option value="">(none)</option>
            @foreach ($categories as $category)
                <option value="{{ $category->id }}" @selected((string) old('category_id') === (string) $category->id)>
                    {{ $category->name }}
                </option>
            @endforeach
        </select>
        @error('category_id')<div>{{ $message }}</div>@enderror
    </div>

    <div>
        <label>Tags</label>
        @php($selectedTags = (array) old('tags', []))
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
                <option value="{{ $status }}" @selected(old('status','draft') === $status)>{{ $status }}</option>
            @endforeach
        </select>
        @error('status')<div>{{ $message }}</div>@enderror
    </div>

    <div>
        <label>Published at</label>
        <input name="published_at" value="{{ old('published_at') }}" />
        @error('published_at')<div>{{ $message }}</div>@enderror
    </div>

    <div>
        <label>Content</label>
        <textarea name="content" rows="10">{{ old('content') }}</textarea>
        @error('content')<div>{{ $message }}</div>@enderror
    </div>

    <div>
        <label>Featured image</label>
        <input type="file" name="featured_image" />
        @error('featured_image')<div>{{ $message }}</div>@enderror
    </div>

    <button type="submit">Save</button>
</form>
