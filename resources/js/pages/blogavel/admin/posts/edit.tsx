import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useMemo, useState } from 'react';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { BlogavelMediaDialog } from '@/components/blogavel-media-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { apiFetch } from '@/lib/api';
import type { BreadcrumbItem } from '@/types';

type PageProps = { postId: string };

type Category = { id: number; name: string };
type Tag = { id: number; name: string };

type ResourceCollection<T> = {
    data: T[];
};

type Post = {
    id: number;
    title: string;
    slug: string;
    content: string | null;
    status: 'draft' | 'scheduled' | 'published';
    published_at: string | null;
    category: { id: number; name: string } | null;
    tags: { id: number; name: string }[];
    featured_media_id?: number | null;
    featured_media?: { id: number; url: string } | null;
};

type Resource<T> = { data: T };

type Media = {
    id: number;
    url: string;
};

type ValidationError = {
    message?: string;
    errors?: Record<string, string[]>;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Blog', href: '/dashboard/blogavel/posts' },
    { title: 'Posts', href: '/dashboard/blogavel/posts' },
    { title: 'Edit', href: '#' },
];

export default function BlogavelPostsEdit({ postId }: PageProps) {
    const [categories, setCategories] = useState<Category[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);

    const [mediaDialogOpen, setMediaDialogOpen] = useState(false);

    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState<'draft' | 'scheduled' | 'published'>(
        'draft',
    );
    const [publishedAt, setPublishedAt] = useState('');
    const [categoryId, setCategoryId] = useState<string>('__none__');
    const [tagIds, setTagIds] = useState<number[]>([]);
    const [featuredMediaId, setFeaturedMediaId] = useState<number | null>(null);
    const [featuredMediaUrl, setFeaturedMediaUrl] = useState<string>('');

    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});

    const selectedTagsLabel = useMemo(() => {
        if (tagIds.length === 0) return 'None';
        const names = tags
            .filter((t) => tagIds.includes(t.id))
            .map((t) => t.name);
        return names.length ? names.join(', ') : `${tagIds.length} selected`;
    }, [tagIds, tags]);

    useEffect(() => {
        async function load() {
            setLoading(true);
            setLoadError(null);

            try {
                const [catRes, tagRes, postRes] = await Promise.all([
                    apiFetch<ResourceCollection<Category>>(
                        '/api/blogavel/v1/admin/categories',
                    ),
                    apiFetch<ResourceCollection<Tag>>(
                        '/api/blogavel/v1/admin/tags',
                    ),
                    apiFetch<Resource<Post>>(
                        `/api/blogavel/v1/admin/posts/${postId}`,
                    ),
                ]);

                setCategories(catRes.data);
                setTags(tagRes.data);

                const post = postRes.data;
                setTitle(post.title ?? '');
                setSlug(post.slug ?? '');
                setContent(post.content ?? '');
                setStatus((post.status ?? 'draft') as any);
                setPublishedAt((post.published_at ?? '').slice(0, 16));
                setCategoryId(
                    post.category ? String(post.category.id) : '__none__',
                );
                setTagIds(post.tags.map((t) => t.id));
                const inferredFeaturedId =
                    (post.featured_media_id ?? null) ??
                    (post.featured_media?.id ?? null);
                setFeaturedMediaId(inferredFeaturedId ?? null);
                setFeaturedMediaUrl(post.featured_media?.url ?? '');

                if (
                    inferredFeaturedId &&
                    (!post.featured_media?.url || post.featured_media.url === '')
                ) {
                    try {
                        const mediaRes = await apiFetch<Resource<Media>>(
                            `/api/blogavel/v1/admin/media/${inferredFeaturedId}`,
                        );
                        setFeaturedMediaUrl(mediaRes.data.url ?? '');
                    } catch {
                        // ignore preview failures
                    }
                }
            } catch (e) {
                const err = e as ValidationError;
                setLoadError(err.message ?? 'Failed to load post');
            } finally {
                setLoading(false);
            }
        }

        void load();
    }, [postId]);

    async function submit() {
        setProcessing(true);
        setErrors({});

        try {
            const payload = {
                title,
                slug: slug || null,
                content: content || null,
                status,
                published_at: publishedAt || null,
                category_id:
                    categoryId !== '__none__' ? Number(categoryId) : null,
                tags: tagIds,
                featured_media_id: featuredMediaId,
                remove_featured_media: featuredMediaId === null,
            };

            await apiFetch(`/api/blogavel/v1/admin/posts/${postId}`, {
                method: 'PUT',
                body: JSON.stringify(payload),
            });

            router.visit('/dashboard/blogavel/posts');
        } catch (e) {
            const err = e as ValidationError;
            setErrors(err.errors ?? {});
        } finally {
            setProcessing(false);
        }
    }

    function toggleTag(id: number) {
        setTagIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Blog - Edit post" />

            <div className="p-4">
                <div className="flex items-start justify-between gap-4">
                    <Heading
                        title="Edit post"
                        description="Update the post content, status and metadata"
                    />

                    <Button variant="outline" asChild>
                        <Link href="/dashboard/blogavel/posts">Back</Link>
                    </Button>
                </div>

                {loading ? (
                    <div className="mt-6 text-sm text-muted-foreground">
                        Loading...
                    </div>
                ) : loadError ? (
                    <div className="mt-6">
                        <div className="text-sm text-destructive">{loadError}</div>
                        <div className="mt-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.reload({ only: [] })}
                            >
                                Retry
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="mt-6 grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                            <InputError message={errors.title?.[0]} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="slug">Slug</Label>
                            <Input
                                id="slug"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                            />
                            <InputError message={errors.slug?.[0]} />
                        </div>

                        <div className="grid gap-2">
                            <Label>Status</Label>
                            <Select
                                value={status}
                                onValueChange={(v) =>
                                    setStatus(
                                        v as 'draft' | 'scheduled' | 'published',
                                    )
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="scheduled">
                                        Scheduled
                                    </SelectItem>
                                    <SelectItem value="published">
                                        Published
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.status?.[0]} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="published_at">Published at</Label>
                            <Input
                                id="published_at"
                                type="datetime-local"
                                value={publishedAt}
                                onChange={(e) => setPublishedAt(e.target.value)}
                            />
                            <InputError message={errors.published_at?.[0]} />
                        </div>

                        <div className="grid gap-2">
                            <Label>Category</Label>
                            <Select
                                value={categoryId}
                                onValueChange={(v) => setCategoryId(v)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="No category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="__none__">None</SelectItem>
                                    {categories.map((c) => (
                                        <SelectItem
                                            key={c.id}
                                            value={String(c.id)}
                                        >
                                            {c.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.category_id?.[0]} />
                        </div>

                        <div className="grid gap-2">
                            <Label>Tags</Label>
                            <div className="rounded-md border p-3">
                                <div className="mb-2 text-xs text-muted-foreground">
                                    Selected: {selectedTagsLabel}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {tags.map((t) => {
                                        const selected = tagIds.includes(t.id);
                                        return (
                                            <Button
                                                key={t.id}
                                                type="button"
                                                size="sm"
                                                variant={
                                                    selected
                                                        ? 'default'
                                                        : 'outline'
                                                }
                                                onClick={() => toggleTag(t.id)}
                                            >
                                                {t.name}
                                            </Button>
                                        );
                                    })}
                                </div>
                            </div>
                            <InputError message={errors.tags?.[0]} />
                        </div>

                        <div className="grid gap-2">
                            <Label>Featured image</Label>
                            <div className="rounded-md border p-3">
                                <div className="flex flex-wrap items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setMediaDialogOpen(true)}
                                    >
                                        Choose media
                                    </Button>

                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setFeaturedMediaId(null);
                                            setFeaturedMediaUrl('');
                                        }}
                                        disabled={!featuredMediaId}
                                    >
                                        Clear
                                    </Button>

                                    <div className="text-xs text-muted-foreground">
                                        {featuredMediaId
                                            ? `Selected media #${featuredMediaId}`
                                            : 'None selected'}
                                    </div>
                                </div>

                                {featuredMediaUrl ? (
                                    <div className="mt-3 overflow-hidden rounded-md border">
                                        <img
                                            src={featuredMediaUrl}
                                            alt=""
                                            className="aspect-video w-full object-cover"
                                        />
                                    </div>
                                ) : null}
                            </div>
                            <InputError message={errors.featured_media_id?.[0]} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="content">Content</Label>
                            <textarea
                                id="content"
                                className="min-h-48 w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                            <InputError message={errors.content?.[0]} />
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                onClick={submit}
                                disabled={processing}
                            >
                                Save
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    router.visit('/dashboard/blogavel/posts')
                                }
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <BlogavelMediaDialog
                open={mediaDialogOpen}
                onOpenChange={setMediaDialogOpen}
                selectedId={featuredMediaId}
                onSelect={(media) => {
                    setFeaturedMediaId(media?.id ?? null);
                    setFeaturedMediaUrl(media?.url ?? '');
                }}
            />
        </AppLayout>
    );
}
