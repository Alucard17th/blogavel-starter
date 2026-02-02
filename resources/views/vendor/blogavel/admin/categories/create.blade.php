<h1>Create Category</h1>

<form method="POST" action="{{ route('blogavel.admin.categories.store') }}">
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

    <div>
        <label>Parent</label>
        <select name="parent_id">
            <option value="">(none)</option>
            @foreach ($parents as $parent)
                <option value="{{ $parent->id }}" @selected((string) old('parent_id') === (string) $parent->id)>{{ $parent->name }}</option>
            @endforeach
        </select>
        @error('parent_id')<div>{{ $message }}</div>@enderror
    </div>

    <button type="submit">Save</button>
</form>
