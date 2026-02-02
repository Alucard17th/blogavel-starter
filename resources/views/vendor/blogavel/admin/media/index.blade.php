<h1>Admin - Media</h1>

<form method="POST" action="{{ route('blogavel.admin.media.store') }}" enctype="multipart/form-data">
    @csrf

    <div>
        <label>Upload image</label>
        <input type="file" name="file" />
        @error('file')<div>{{ $message }}</div>@enderror
    </div>

    <button type="submit">Upload</button>
</form>

<hr />

@if ($media->count() === 0)
    <p>No media.</p>
@else
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Preview</th>
                <th>Path</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($media as $item)
                <tr>
                    <td>{{ $item->id }}</td>
                    <td>
                        <img src="{{ \Illuminate\Support\Facades\Storage::disk($item->disk)->url($item->path) }}" alt="" style="max-height:60px" />
                    </td>
                    <td>{{ $item->path }}</td>
                    <td>
                        <form method="POST" action="{{ route('blogavel.admin.media.destroy', $item) }}" style="display:inline">
                            @csrf
                            @method('DELETE')
                            <button type="submit">Delete</button>
                        </form>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    {{ $media->links() }}
@endif
