<h1>Edit Tag</h1>

<form method="POST" action="{{ route('blogavel.admin.tags.update', $tag) }}">
    @csrf
    @method('PUT')

    <div>
        <label>Name</label>
        <input name="name" value="{{ old('name', $tag->name) }}" />
        @error('name')<div>{{ $message }}</div>@enderror
    </div>

    <div>
        <label>Slug (optional)</label>
        <input name="slug" value="{{ old('slug', $tag->slug) }}" />
        @error('slug')<div>{{ $message }}</div>@enderror
    </div>

    <button type="submit">Save</button>
</form>
