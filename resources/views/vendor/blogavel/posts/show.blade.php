<h1>{{ $post->title }}</h1>

@if ($post->featuredMedia)
    <div>
        <img src="{{ \Illuminate\Support\Facades\Storage::disk($post->featuredMedia->disk)->url($post->featuredMedia->path) }}" alt="" style="max-width:100%" />
    </div>
@endif

<div>
    {!! nl2br(e($post->content)) !!}
</div>

<hr />

<h2>Comments</h2>

<form method="POST" action="{{ route('blogavel.comments.store', $post) }}">
    @csrf
    <div>
        <label>Comment</label>
        <textarea name="content" rows="4">{{ old('content') }}</textarea>
        @error('content')<div>{{ $message }}</div>@enderror
    </div>
    <div>
        <label>Name (guest)</label>
        <input name="guest_name" value="{{ old('guest_name') }}" />
        @error('guest_name')<div>{{ $message }}</div>@enderror
    </div>
    <div>
        <label>Email (guest)</label>
        <input name="guest_email" value="{{ old('guest_email') }}" />
        @error('guest_email')<div>{{ $message }}</div>@enderror
    </div>
    <button type="submit">Submit</button>
</form>

@if ($post->comments->count() === 0)
    <p>No comments yet.</p>
@else
    @foreach ($post->comments as $comment)
        @include('blogavel::posts._comment', ['comment' => $comment, 'post' => $post, 'depth' => 0])
    @endforeach
@endif
