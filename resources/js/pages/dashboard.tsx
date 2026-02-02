import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Posts</CardTitle>
                            <CardDescription>Manage blog posts</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2">
                                <Button asChild>
                                    <Link href="/dashboard/blogavel/posts">
                                        Open
                                    </Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href="/dashboard/blogavel/posts/create">
                                        New
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Taxonomy</CardTitle>
                            <CardDescription>Categories & tags</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                <Button variant="outline" asChild>
                                    <Link href="/dashboard/blogavel/categories">
                                        Categories
                                    </Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href="/dashboard/blogavel/tags">Tags</Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Moderation</CardTitle>
                            <CardDescription>Comments & media</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                <Button variant="outline" asChild>
                                    <Link href="/dashboard/blogavel/comments">
                                        Comments
                                    </Link>
                                </Button>
                                <Button variant="outline" asChild>
                                    <Link href="/dashboard/blogavel/media">
                                        Media
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="relative min-h-[60vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                </div>
            </div>
        </AppLayout>
    );
}
