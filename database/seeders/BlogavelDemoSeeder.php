<?php

namespace Database\Seeders;

use Blogavel\Blogavel\Models\Category;
use Blogavel\Blogavel\Models\Comment;
use Blogavel\Blogavel\Models\Post;
use Blogavel\Blogavel\Models\Tag;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BlogavelDemoSeeder extends Seeder
{
    public function run(): void
    {
        $categories = collect([
            'News',
            'Guides',
            'Releases',
        ])->map(function (string $name) {
            return Category::query()->firstOrCreate(
                ['slug' => Str::slug($name)],
                ['name' => $name, 'parent_id' => null],
            );
        });

        $tags = collect([
            'Laravel',
            'React',
            'Sanctum',
        ])->map(function (string $name) {
            return Tag::query()->firstOrCreate(
                ['slug' => Str::slug($name)],
                ['name' => $name],
            );
        });

        $postTitles = [
            'Welcome to Blogavel',
            'Getting Started: Writing Your First Post',
            'Publishing Workflow and Statuses',
            'Media Uploads and Managing Assets',
            'Moderating Comments',
        ];

        foreach ($postTitles as $i => $title) {
            $post = Post::query()->create([
                'category_id' => $categories->random()->id,
                'featured_media_id' => null,
                'title' => $title,
                'slug' => null,
                'content' => $this->sampleContent($title),
                'status' => $i === 0 ? 'published' : (random_int(0, 1) ? 'draft' : 'published'),
                'published_at' => now()->subDays(random_int(0, 20)),
            ]);

            $post->tags()->sync(
                $tags->shuffle()->take(random_int(1, 3))->pluck('id')->all(),
            );

            $commentCount = random_int(2, 6);
            for ($c = 0; $c < $commentCount; $c++) {
                Comment::query()->create([
                    'post_id' => $post->id,
                    'parent_id' => null,
                    'user_id' => null,
                    'guest_name' => $this->sampleGuestName(),
                    'guest_email' => $this->sampleGuestEmail(),
                    'content' => $this->sampleComment(),
                    'status' => $this->randomCommentStatus(),
                    'ip' => '127.0.0.1',
                    'user_agent' => 'Seeder',
                ]);
            }
        }
    }

    private function randomCommentStatus(): string
    {
        return collect(['pending', 'approved', 'spam'])->random();
    }

    private function sampleGuestName(): string
    {
        return collect(['Alice', 'Bob', 'Chris', 'Dana', 'Elliot', 'Fatima'])->random();
    }

    private function sampleGuestEmail(): string
    {
        $name = Str::lower(Str::slug($this->sampleGuestName()));

        return $name.'@example.com';
    }

    private function sampleComment(): string
    {
        return collect([
            'Nice post! Thanks for sharing.',
            'This helped a lot — appreciated.',
            'Could you add more details on this part?',
            'I ran into an issue but found the solution after reading this.',
            'Great write-up. Looking forward to the next one.',
        ])->random();
    }

    private function sampleContent(string $title): string
    {
        return implode("\n\n", [
            '# '.$title,
            'This is seeded demo content to help you test the Blogavel admin UI.',
            'You can edit, publish, tag, and categorize this post from the dashboard.',
        ]);
    }
}
