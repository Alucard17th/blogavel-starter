<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Blogavel\Blogavel\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

final class FeedController extends Controller
{
    public function rss(Request $request)
    {
        $siteName = (string) config('app.name', 'Blog');
        $siteUrl = url('/');
        $feedUrl = url('/feed.xml');
        $description = 'Latest posts from '.$siteName;

        $posts = Post::query()
            ->where('status', 'published')
            ->whereNotNull('published_at')
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->limit(50)
            ->get(['id', 'title', 'slug', 'content', 'published_at']);

        $items = $posts->map(function (Post $post) {
            $title = $this->xmlEscape((string) $post->title);
            $link = url('/blog/'.$post->slug);
            $guid = $this->xmlEscape($link);

            $pubDate = null;
            if ($post->published_at) {
                try {
                    $pubDate = $post->published_at->toRfc2822String();
                } catch (\Throwable) {
                    $pubDate = null;
                }
            }

            $plain = trim(strip_tags((string) ($post->content ?? '')));
            $summary = Str::limit($plain, 280, '');
            $summaryCdata = $this->cdata($summary);

            $xml = "<item>";
            $xml .= "<title>{$title}</title>";
            $xml .= "<link>".$this->xmlEscape($link)."</link>";
            $xml .= "<guid isPermaLink=\"true\">{$guid}</guid>";
            if ($pubDate) {
                $xml .= "<pubDate>".$this->xmlEscape($pubDate)."</pubDate>";
            }
            $xml .= "<description>{$summaryCdata}</description>";
            $xml .= "</item>";

            return $xml;
        })->implode("");

        $xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
        $xml .= "<rss version=\"2.0\">";
        $xml .= "<channel>";
        $xml .= "<title>".$this->xmlEscape($siteName)."</title>";
        $xml .= "<link>".$this->xmlEscape($siteUrl)."</link>";
        $xml .= "<description>".$this->xmlEscape($description)."</description>";
        $xml .= "<language>en</language>";
        $xml .= "<generator>Blogavel Starter</generator>";
        $xml .= "<atom:link xmlns:atom=\"http://www.w3.org/2005/Atom\" href=\"".$this->xmlEscape($feedUrl)."\" rel=\"self\" type=\"application/rss+xml\" />";
        $xml .= $items;
        $xml .= "</channel>";
        $xml .= "</rss>";

        return response($xml, 200)
            ->header('Content-Type', 'application/rss+xml; charset=UTF-8');
    }

    public function sitemap(Request $request)
    {
        $base = url('/');

        $posts = Post::query()
            ->with(['category', 'tags'])
            ->where('status', 'published')
            ->whereNotNull('published_at')
            ->orderByDesc('published_at')
            ->orderByDesc('id')
            ->limit(2000)
            ->get(['id', 'slug', 'published_at', 'updated_at', 'category_id']);

        $categorySlugs = [];
        $tagSlugs = [];

        foreach ($posts as $post) {
            if ($post->category && is_string($post->category->slug) && $post->category->slug !== '') {
                $categorySlugs[$post->category->slug] = true;
            }

            foreach ($post->tags ?? [] as $tag) {
                if (is_string($tag->slug) && $tag->slug !== '') {
                    $tagSlugs[$tag->slug] = true;
                }
            }
        }

        $urls = [];
        $urls[] = $this->sitemapUrl(url('/'), null);
        $urls[] = $this->sitemapUrl(url('/blog'), null);
        $urls[] = $this->sitemapUrl(url('/feed.xml'), null);

        foreach (array_keys($categorySlugs) as $slug) {
            $urls[] = $this->sitemapUrl(url('/blog/category/'.$slug), null);
        }

        foreach (array_keys($tagSlugs) as $slug) {
            $urls[] = $this->sitemapUrl(url('/blog/tag/'.$slug), null);
        }

        foreach ($posts as $post) {
            $lastmod = null;
            $dt = $post->updated_at ?? $post->published_at;
            if ($dt) {
                try {
                    $lastmod = $dt->toAtomString();
                } catch (\Throwable) {
                    $lastmod = null;
                }
            }

            $urls[] = $this->sitemapUrl(url('/blog/'.$post->slug), $lastmod);
        }

        $xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
        $xml .= "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">";
        $xml .= implode('', $urls);
        $xml .= "</urlset>";

        return response($xml, 200)
            ->header('Content-Type', 'application/xml; charset=UTF-8');
    }

    private function sitemapUrl(string $loc, ?string $lastmod): string
    {
        $xml = '<url>';
        $xml .= '<loc>'.$this->xmlEscape($loc).'</loc>';
        if ($lastmod) {
            $xml .= '<lastmod>'.$this->xmlEscape($lastmod).'</lastmod>';
        }
        $xml .= '</url>';
        return $xml;
    }

    private function xmlEscape(string $value): string
    {
        return htmlspecialchars($value, ENT_XML1 | ENT_COMPAT, 'UTF-8');
    }

    private function cdata(string $value): string
    {
        $safe = str_replace(']]>', ']]]]><![CDATA[>', $value);
        return '<![CDATA['.$safe.']]>';
    }
}
