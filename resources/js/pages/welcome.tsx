import { Head, Link, usePage } from '@inertiajs/react';
import { dashboard, login, register } from '@/routes';
import AppLogo from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import type { SharedData } from '@/types';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="min-h-screen bg-background text-foreground">
                <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
                    <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
                        <div className="flex items-center gap-2">
                            <AppLogo />
                        </div>

                        <nav className="flex items-center gap-2">
                            {auth.user ? (
                                <Button asChild variant="outline">
                                    <Link href={dashboard()}>Dashboard</Link>
                                </Button>
                            ) : (
                                <>
                                    <Button asChild variant="ghost">
                                        <Link href={login()}>Log in</Link>
                                    </Button>
                                    {canRegister ? (
                                        <Button asChild>
                                            <Link href={register()}>Get started</Link>
                                        </Button>
                                    ) : null}
                                </>
                            )}
                        </nav>
                    </div>
                </header>

                <main>
                    <section className="border-b">
                        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-2 lg:py-24">
                            <div className="flex flex-col justify-center">
                                <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-5xl">
                                    Ship faster with a modern Laravel + Inertia starter
                                </h1>
                                <p className="mt-4 max-w-prose text-pretty text-muted-foreground">
                                    Authentication, dashboard UI, and an extensible admin experience ready for your next product.
                                </p>

                                <div className="mt-8 flex flex-wrap items-center gap-3">
                                    {auth.user ? (
                                        <Button asChild size="lg">
                                            <Link href={dashboard()}>Go to dashboard</Link>
                                        </Button>
                                    ) : (
                                        <>
                                            {canRegister ? (
                                                <Button asChild size="lg">
                                                    <Link href={register()}>Create an account</Link>
                                                </Button>
                                            ) : (
                                                <Button asChild size="lg">
                                                    <Link href={login()}>Log in</Link>
                                                </Button>
                                            )}
                                            <Button asChild size="lg" variant="outline">
                                                <a
                                                    href="https://laravel.com/docs"
                                                    target="_blank"
                                                    rel="noreferrer"
                                                >
                                                    Read the docs
                                                </a>
                                            </Button>
                                        </>
                                    )}
                                </div>

                                <div className="mt-8 grid max-w-xl grid-cols-2 gap-6 text-sm text-muted-foreground sm:grid-cols-3">
                                    <div>
                                        <div className="text-2xl font-semibold text-foreground">
                                            ~1 day
                                        </div>
                                        <div>to a polished MVP UI</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-semibold text-foreground">
                                            0
                                        </div>
                                        <div>boilerplate screens to rebuild</div>
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <div className="text-2xl font-semibold text-foreground">
                                            100%
                                        </div>
                                        <div>Laravel-first workflow</div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>UI components</CardTitle>
                                        <CardDescription>
                                            shadcn/ui building blocks wired to Tailwind.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="text-sm text-muted-foreground">
                                        Buttons, cards, dialogs, sidebar and more.
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Inertia pages</CardTitle>
                                        <CardDescription>
                                            SPA feel with server-side routing.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="text-sm text-muted-foreground">
                                        Build product flows without a separate API layer.
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Auth ready</CardTitle>
                                        <CardDescription>
                                            Fortify scaffolding out of the box.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="text-sm text-muted-foreground">
                                        Login, registration, profile, and security settings.
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Extensible</CardTitle>
                                        <CardDescription>
                                            Add modules like Blogavel without rewrites.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="text-sm text-muted-foreground">
                                        Admin UX patterns you can reuse across features.
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </section>

                    <section className="border-b">
                        <div className="mx-auto max-w-6xl px-6 py-14">
                            <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
                                <div>
                                    <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                        Everything you need to launch an MVP
                                    </h2>
                                    <p className="mt-3 text-muted-foreground">
                                        A practical baseline: auth, UI primitives, patterns, and page structure so you can focus on product features.
                                    </p>
                                </div>
                                <div className="grid gap-4 lg:col-span-2 sm:grid-cols-2">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Opinionated UX</CardTitle>
                                            <CardDescription>
                                                Navigation, layouts, and states that feel finished.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="text-sm text-muted-foreground">
                                            Built to reduce time-to-first-usable screen.
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Server-driven</CardTitle>
                                            <CardDescription>
                                                Keep routing, validation, and policies in Laravel.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="text-sm text-muted-foreground">
                                            Inertia for SPA feel without an API-first rewrite.
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Extendable admin</CardTitle>
                                            <CardDescription>
                                                Add modules and screens without reorganizing the app.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="text-sm text-muted-foreground">
                                            A good fit for blogs, SaaS back offices, and internal tools.
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Fast iteration</CardTitle>
                                            <CardDescription>
                                                Ship small slices and validate quickly.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="text-sm text-muted-foreground">
                                            Keep the stack boring so your product can be bold.
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="border-b">
                        <div className="mx-auto max-w-6xl px-6 py-14">
                            <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
                                <div>
                                    <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                        How it works
                                    </h2>
                                    <p className="mt-3 max-w-prose text-muted-foreground">
                                        A simple workflow that keeps complexity under control as your MVP grows.
                                    </p>
                                </div>

                                <div className="grid gap-4">
                                    <div className="rounded-xl border bg-card p-6">
                                        <div className="text-sm font-medium text-foreground">
                                            1. Start with auth + layout
                                        </div>
                                        <div className="mt-2 text-sm text-muted-foreground">
                                            Use the existing pages/components as your baseline.
                                        </div>
                                    </div>
                                    <div className="rounded-xl border bg-card p-6">
                                        <div className="text-sm font-medium text-foreground">
                                            2. Add your first resource
                                        </div>
                                        <div className="mt-2 text-sm text-muted-foreground">
                                            Create a model, controller, policies, and an Inertia page.
                                        </div>
                                    </div>
                                    <div className="rounded-xl border bg-card p-6">
                                        <div className="text-sm font-medium text-foreground">
                                            3. Iterate with confidence
                                        </div>
                                        <div className="mt-2 text-sm text-muted-foreground">
                                            Refine UI/UX using shadcn/ui building blocks and Tailwind.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="border-b">
                        <div className="mx-auto max-w-6xl px-6 py-14">
                            <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
                                <div>
                                    <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                        Social proof
                                    </h2>
                                    <p className="mt-3 text-muted-foreground">
                                        Patterns that work across products: marketing pages, dashboards, and admin tools.
                                    </p>
                                </div>

                                <div className="grid gap-4 lg:col-span-2 sm:grid-cols-2">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>“It felt production-ready.”</CardTitle>
                                            <CardDescription>
                                                The layout + components saved a full day.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="text-sm text-muted-foreground">
                                            - Builder
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>“Laravel-first is a win.”</CardTitle>
                                            <CardDescription>
                                                Routing and validation stayed in one place.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent className="text-sm text-muted-foreground">
                                            - Founder
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="border-b">
                        <div className="mx-auto max-w-6xl px-6 py-14">
                            <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
                                <div>
                                    <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                        FAQ
                                    </h2>
                                    <p className="mt-3 text-muted-foreground">
                                        Quick answers to the common MVP questions.
                                    </p>
                                </div>

                                <div className="grid gap-3">
                                    <div className="rounded-xl border bg-card p-5">
                                        <div className="font-medium">Do I need a separate API?</div>
                                        <div className="mt-2 text-sm text-muted-foreground">
                                            Not for most MVPs. Inertia gives you a SPA feel while keeping the Laravel controller workflow.
                                        </div>
                                    </div>
                                    <div className="rounded-xl border bg-card p-5">
                                        <div className="font-medium">Can I add my own modules?</div>
                                        <div className="mt-2 text-sm text-muted-foreground">
                                            Yes. Add resources incrementally and reuse UI components and layouts.
                                        </div>
                                    </div>
                                    <div className="rounded-xl border bg-card p-5">
                                        <div className="font-medium">Is this meant for production?</div>
                                        <div className="mt-2 text-sm text-muted-foreground">
                                            It’s a strong starting point. You still own security hardening, testing, and deployment choices.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <div className="mx-auto max-w-6xl px-6 py-16">
                            <div className="rounded-2xl border bg-card p-8">
                                <div className="grid gap-6 lg:grid-cols-2 lg:items-center">
                                    <div>
                                        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                                            Ready to build your MVP?
                                        </h2>
                                        <p className="mt-2 text-muted-foreground">
                                            Start from a clean foundation and ship the first version faster.
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap items-center justify-start gap-3 lg:justify-end">
                                        {auth.user ? (
                                            <Button asChild>
                                                <Link href={dashboard()}>Open dashboard</Link>
                                            </Button>
                                        ) : (
                                            <>
                                                <Button asChild variant="outline">
                                                    <Link href={login()}>Log in</Link>
                                                </Button>
                                                {canRegister ? (
                                                    <Button asChild>
                                                        <Link href={register()}>
                                                            Create account
                                                        </Link>
                                                    </Button>
                                                ) : null}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>

                <footer className="border-t">
                    <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
                        <div>Laravel Starter Kit</div>
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
