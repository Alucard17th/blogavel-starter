<h1>Create Tag</h1>

<form method="POST" action="{{ route('blogavel.admin.tags.store') }}">
    @csrf

    <div>
        <label>Name</label>
        <input name="name" value="{{ old('name') }}" />
        @error('name')<div>{{ $message }}</div>@enderror
    </div>

    <div>
        <label>Slug (optional)</label>
        <input name="slug" value="{{ old('slug') }}" />
        @error('slug')<div>{{ $message }}</div>@enderror
    </div>

    <button type="submit">Save</button>
</form>
