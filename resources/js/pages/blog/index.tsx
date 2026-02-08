import { Head, Link } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { LayoutGrid, List, User } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

type BlogPostListItem = {
    id: number;
    title: string;
    slug: string;
    published_at: string | null;
    featured_media_url: string | null;
    author_name: string | null;
    author: {
        id: number | null;
        name: string | null;
        email: string | null;
        created_at: string | null;
    } | null;
    category: { id: number; name: string; slug: string } | null;
    tags: { id: number; name: string; slug: string }[];
};

type SeoProps = {
    title: string;
    description: string;
    canonical: string;
    og: {
        title: string;
        description: string;
        url: string;
        image: string | null;
        type: string;
    };
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Paginated<T> = {
    data: T[];
    links: PaginationLink[];
    meta: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        next_page_url?: string | null;
    };
};

type PageProps = {
    posts: Paginated<BlogPostListItem>;
    seo: SeoProps;
};

type ViewMode = 'grid' | 'list';

function formatDate(value: string | null) {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
    });
}

export default function BlogIndex({ posts, seo }: PageProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('grid');

    const [items, setItems] = useState<BlogPostListItem[]>(posts.data);
    const [nextPageUrl, setNextPageUrl] = useState<string | null>(
        posts.meta.next_page_url ?? null,
    );
    const [loadingMore, setLoadingMore] = useState(false);

    const sentinelRef = useRef<HTMLDivElement | null>(null);

    const hasMore = useMemo(() => {
        return !!nextPageUrl;
    }, [nextPageUrl]);

    useEffect(() => {
        try {
            const stored = window.localStorage.getItem('blog:index:view');
            if (stored === 'grid' || stored === 'list') {
                setViewMode(stored);
            }
        } catch {
            // ignore
        }
    }, []);

    useEffect(() => {
        setItems(posts.data);
        setNextPageUrl(posts.meta.next_page_url ?? null);
    }, [posts.data, posts.meta.next_page_url]);

    async function loadMore() {
        if (!nextPageUrl) return;
        if (loadingMore) return;

        setLoadingMore(true);
        try {
            const res = await fetch(nextPageUrl, {
                headers: {
                    Accept: 'application/json',
                },
            });
            if (!res.ok) return;

            const payload = (await res.json()) as {
                posts: {
                    data: BlogPostListItem[];
                    meta: { next_page_url: string | null };
                };
            };

            setItems((prev) => [...prev, ...(payload.posts.data ?? [])]);
            setNextPageUrl(payload.posts.meta?.next_page_url ?? null);
        } finally {
            setLoadingMore(false);
        }
    }

    useEffect(() => {
        const el = sentinelRef.current;
        if (!el) return;
        if (!hasMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        void loadMore();
                    }
                }
            },
            {
                root: null,
                rootMargin: '600px',
                threshold: 0,
            },
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [hasMore, nextPageUrl]);

    function setMode(mode: ViewMode) {
        setViewMode(mode);
        try {
            window.localStorage.setItem('blog:index:view', mode);
        } catch {
            // ignore
        }
    }

    return (
        <>
            <Head title={seo.title}>
                <link rel="canonical" href={seo.canonical} />
                <meta name="description" content={seo.description} />

                <meta property="og:type" content={seo.og.type} />
                <meta property="og:title" content={seo.og.title} />
                <meta property="og:description" content={seo.og.description} />
                <meta property="og:url" content={seo.og.url} />
                {seo.og.image ? (
                    <meta property="og:image" content={seo.og.image} />
                ) : null}
            </Head>

            <div className="min-h-screen bg-background text-foreground">
                <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
                    <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
                        <Link href="/" className="flex items-center gap-2">
                            <AppLogo />
                        </Link>

                        <nav className="flex items-center gap-2">
                            <Button asChild variant="ghost">
                                <Link href="/">Home</Link>
                            </Button>
                        </nav>
                    </div>
                </header>

                <main>
                    <section className="border-b">
                        <div className="mx-auto max-w-6xl px-6 py-14">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                                <div>
                                    <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                                        Blog
                                    </h1>
                                    <p className="mt-2 max-w-prose text-muted-foreground">
                                        Product updates, guides, and notes.
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant={
                                            viewMode === 'grid'
                                                ? 'default'
                                                : 'outline'
                                        }
                                        size="sm"
                                        aria-label="Grid view"
                                        onClick={() => setMode('grid')}
                                    >
                                        <LayoutGrid className="size-4" />
                                    </Button>
                                    <Button
                                        variant={
                                            viewMode === 'list'
                                                ? 'default'
                                                : 'outline'
                                        }
                                        size="sm"
                                        aria-label="List view"
                                        onClick={() => setMode('list')}
                                    >
                                        <List className="size-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="mx-auto max-w-6xl px-6 py-14">
                            {items.length === 0 ? (
                                <div className="rounded-2xl border bg-card p-10 text-center">
                                    <div className="text-lg font-medium">
                                        No posts yet
                                    </div>
                                    <div className="mt-2 text-sm text-muted-foreground">
                                        When you publish posts, they’ll show up here.
                                    </div>
                                    <div className="mt-6">
                                        <Button asChild variant="outline">
                                            <Link href="/">Back to home</Link>
                                        </Button>
                                    </div>
                                </div>
                            ) : viewMode === 'list' ? (
                                <div className="grid gap-3">
                                    {items.map((post) => (
                                        <Card
                                            key={post.id}
                                            className="group overflow-hidden"
                                        >
                                            <div className="flex gap-4 p-4">
                                                <div className="h-20 w-32 shrink-0 overflow-hidden rounded-lg bg-muted">
                                                    {post.featured_media_url ? (
                                                        <img
                                                            src={post.featured_media_url}
                                                            alt=""
                                                            className="h-full w-full object-cover"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                                                            No image
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="min-w-0">
                                                            <div className="line-clamp-2 font-medium">
                                                                {post.title}
                                                            </div>
                                                            <div className="mt-1 text-xs text-muted-foreground">
                                                                <span className="inline-flex items-center gap-2">
                                                                    {post.author_name ? (
                                                                        <Tooltip>
                                                                            <TooltipTrigger asChild>
                                                                                <button
                                                                                    type="button"
                                                                                    className="inline-flex items-center gap-1 text-foreground/90 underline-offset-4 hover:underline"
                                                                                >
                                                                                    <User className="size-3.5 opacity-80" />
                                                                                    {post.author_name}
                                                                                </button>
                                                                            </TooltipTrigger>
                                                                            <TooltipContent className="p-3">
                                                                                <div className="text-xs">
                                                                                    <div className="font-medium">
                                                                                        {post.author?.name ??
                                                                                            post.author_name}
                                                                                    </div>
                                                                                    {post.author?.email ? (
                                                                                        <div className="mt-1 opacity-90">
                                                                                            {post.author.email}
                                                                                        </div>
                                                                                    ) : null}
                                                                                </div>
                                                                            </TooltipContent>
                                                                        </Tooltip>
                                                                    ) : (
                                                                        <span>—</span>
                                                                    )}
                                                                    <span>
                                                                        {formatDate(
                                                                            post.published_at,
                                                                        )}
                                                                    </span>
                                                                </span>
                                                            </div>

                                                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                                                {post.category ? (
                                                                    <Badge
                                                                        asChild
                                                                        variant="secondary"
                                                                        className="font-medium"
                                                                    >
                                                                        <Link
                                                                            href={`/blog/category/${post.category.slug}`}
                                                                        >
                                                                            {post.category.name}
                                                                        </Link>
                                                                    </Badge>
                                                                ) : null}

                                                                {post.tags.map((t) => (
                                                                    <Badge
                                                                        key={t.id}
                                                                        asChild
                                                                        variant="outline"
                                                                    >
                                                                        <Link
                                                                            href={`/blog/tag/${t.slug}`}
                                                                        >
                                                                            #{t.name}
                                                                        </Link>
                                                                    </Badge>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <Button
                                                            asChild
                                                            variant="outline"
                                                            size="sm"
                                                        >
                                                            <Link href={`/blog/${post.slug}`}>
                                                                Read
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    {items.map((post) => (
                                        <Card
                                            key={post.id}
                                            className="group h-full overflow-hidden"
                                        >
                                            <div className="aspect-[16/9] w-full overflow-hidden bg-muted">
                                                {post.featured_media_url ? (
                                                    <img
                                                        src={post.featured_media_url}
                                                        alt=""
                                                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                                                        loading="lazy"
                                                    />
                                                ) : (
                                                    <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                                                        No image
                                                    </div>
                                                )}
                                            </div>

                                            <CardHeader>
                                                <CardTitle className="line-clamp-2">
                                                    {post.title}
                                                </CardTitle>
                                                <CardDescription>
                                                    <span className="inline-flex items-center gap-2">
                                                        {post.author_name ? (
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <button
                                                                        type="button"
                                                                        className="inline-flex items-center gap-1 text-foreground/90 underline-offset-4 hover:underline"
                                                                    >
                                                                        <User className="size-3.5 opacity-80" />
                                                                        {post.author_name}
                                                                    </button>
                                                                </TooltipTrigger>
                                                                <TooltipContent className="p-3">
                                                                    <div className="text-xs">
                                                                        <div className="font-medium">
                                                                            {post.author?.name ??
                                                                                post.author_name}
                                                                        </div>
                                                                        {post.author?.email ? (
                                                                            <div className="mt-1 opacity-90">
                                                                                {post.author.email}
                                                                            </div>
                                                                        ) : null}
                                                                    </div>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        ) : (
                                                            <span>—</span>
                                                        )}
                                                        <span>
                                                            {formatDate(
                                                                post.published_at,
                                                            )}
                                                        </span>
                                                    </span>
                                                </CardDescription>
                                            </CardHeader>

                                            <CardContent>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    {post.category ? (
                                                        <Badge
                                                            asChild
                                                            variant="secondary"
                                                            className="font-medium"
                                                        >
                                                            <Link
                                                                href={`/blog/category/${post.category.slug}`}
                                                            >
                                                                {post.category.name}
                                                            </Link>
                                                        </Badge>
                                                    ) : null}

                                                    {post.tags.map((t) => (
                                                        <Badge
                                                            key={t.id}
                                                            asChild
                                                            variant="outline"
                                                        >
                                                            <Link
                                                                href={`/blog/tag/${t.slug}`}
                                                            >
                                                                #{t.name}
                                                            </Link>
                                                        </Badge>
                                                    ))}
                                                </div>

                                                <div className="mt-4">
                                                    <Button asChild variant="outline">
                                                        <Link href={`/blog/${post.slug}`}>
                                                            Read
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}

                            <div className="mt-10">
                                {loadingMore ? (
                                    <div className="text-center text-sm text-muted-foreground">
                                        Loading more...
                                    </div>
                                ) : hasMore ? (
                                    <div className="text-center text-sm text-muted-foreground">
                                        Scroll to load more
                                    </div>
                                ) : (
                                    <div className="text-center text-sm text-muted-foreground">
                                        You’ve reached the end
                                    </div>
                                )}
                                <div ref={sentinelRef} className="h-px w-full" />
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="border-t">
                    <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                        <div>Blog</div>
                        <div className="flex items-center gap-4">
                            <a
                                href="https://laravel.com"
                                target="_blank"
                                rel="noreferrer"
                                className="hover:text-foreground"
                            >
                                Laravel
                            </a>
                            <a
                                href="https://inertiajs.com"
                                target="_blank"
                                rel="noreferrer"
                                className="hover:text-foreground"
                            >
                                Inertia
                            </a>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
