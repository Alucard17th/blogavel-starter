import { Head, Link } from '@inertiajs/react';
import { User } from 'lucide-react';
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

type BlogPost = {
    id: number;
    title: string;
    slug: string;
    content: string | null;
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

type PageProps = {
    post: BlogPost;
    adjacent: {
        older: { id: number; title: string; slug: string } | null;
        newer: { id: number; title: string; slug: string } | null;
    };
    seo: {
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
};

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

function formatDateTime(value: string | null) {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: '2-digit',
    });
}

export default function BlogShow({ post, adjacent, seo }: PageProps) {
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
                                <Link href="/blog">Blog</Link>
                            </Button>
                            <Button asChild variant="ghost">
                                <Link href="/">Home</Link>
                            </Button>
                        </nav>
                    </div>
                </header>

                <main>
                    <section className="border-b">
                        <div className="mx-auto max-w-3xl px-6 py-14">
                            <div className="flex items-center justify-between gap-3">
                                <Button asChild variant="outline">
                                    <Link href="/blog">Back</Link>
                                </Button>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    {post.author_name ? (
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center gap-1 text-foreground/90 underline-offset-4 hover:underline"
                                                >
                                                    <User className="size-4 opacity-80" />
                                                    {post.author_name}
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent className="p-3">
                                                <div className="text-xs">
                                                    <div className="font-medium">
                                                        {post.author?.name ?? post.author_name}
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

                                    <span>{formatDate(post.published_at)}</span>
                                </div>
                            </div>

                            <h1 className="mt-8 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
                                {post.title}
                            </h1>

                            {post.category || post.tags.length > 0 ? (
                                <div className="mt-4 flex flex-wrap items-center gap-2">
                                    {post.category ? (
                                        <Badge asChild variant="outline">
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
                                            <Link href={`/blog/tag/${t.slug}`}>
                                                #{t.name}
                                            </Link>
                                        </Badge>
                                    ))}
                                </div>
                            ) : null}

                            {post.featured_media_url ? (
                                <div className="mt-8 overflow-hidden rounded-2xl border bg-muted">
                                    <div className="aspect-[16/9] w-full">
                                        <img
                                            src={post.featured_media_url}
                                            alt=""
                                            className="h-full w-full object-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </section>

                    <section>
                        <div className="mx-auto max-w-3xl px-6 py-14">
                            {post.content ? (
                                <article className="prose prose-neutral max-w-none leading-relaxed dark:prose-invert">
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: post.content,
                                        }}
                                    />
                                </article>
                            ) : (
                                <div className="rounded-2xl border bg-card p-10 text-center">
                                    <div className="text-lg font-medium">
                                        No content
                                    </div>
                                    <div className="mt-2 text-sm text-muted-foreground">
                                        This post doesn’t have content yet.
                                    </div>
                                    <div className="mt-6">
                                        <Button asChild variant="outline">
                                            <Link href="/blog">Back to blog</Link>
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {adjacent.older || adjacent.newer ? (
                                <div className="mt-12 grid gap-3 sm:grid-cols-2">
                                    {adjacent.newer ? (
                                        <Card className="h-full">
                                            <CardHeader>
                                                <CardDescription>
                                                    Newer post
                                                </CardDescription>
                                                <CardTitle className="line-clamp-2 text-base">
                                                    <Link
                                                        href={`/blog/${adjacent.newer.slug}`}
                                                        className="hover:underline"
                                                    >
                                                        {adjacent.newer.title}
                                                    </Link>
                                                </CardTitle>
                                            </CardHeader>
                                        </Card>
                                    ) : (
                                        <div />
                                    )}

                                    {adjacent.older ? (
                                        <Card className="h-full">
                                            <CardHeader>
                                                <CardDescription>
                                                    Older post
                                                </CardDescription>
                                                <CardTitle className="line-clamp-2 text-base">
                                                    <Link
                                                        href={`/blog/${adjacent.older.slug}`}
                                                        className="hover:underline"
                                                    >
                                                        {adjacent.older.title}
                                                    </Link>
                                                </CardTitle>
                                            </CardHeader>
                                        </Card>
                                    ) : null}
                                </div>
                            ) : null}

                            {post.author ? (
                                <div className="mt-12">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>
                                                About the author
                                            </CardTitle>
                                            <CardDescription>
                                                {post.author.name ?? '—'}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid gap-3 text-sm">
                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="text-muted-foreground">
                                                        Email
                                                    </div>
                                                    <div className="truncate">
                                                        {post.author.email ?? '—'}
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between gap-4">
                                                    <div className="text-muted-foreground">
                                                        Member since
                                                    </div>
                                                    <div>
                                                        {formatDateTime(
                                                            post.author.created_at,
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            ) : null}
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
