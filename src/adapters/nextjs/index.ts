import type { SEOConfig, OpenGraphImage } from "../../types/index.js";
import { buildTitle } from "../../core/index.js";

// ─── Next.js-compatible Metadata type ────────────────────────
// Mirrors Next.js App Router's Metadata interface without importing from 'next'.
// Safe to use even when 'next' is not installed.

export interface NextJSMetadataTitle {
  /** Page-level title, replaces %s in template */
  default?: string;
  /** Template applied to child pages, e.g. "%s | MySite" */
  template?: string;
  /** Absolute title, ignores template */
  absolute?: string;
}

export interface NextJSMetadataImage {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  type?: string;
}

export interface NextJSMetadataRobots {
  index?: boolean;
  follow?: boolean;
  noarchive?: boolean;
  nosnippet?: boolean;
  noimageindex?: boolean;
  notranslate?: boolean;
  "max-snippet"?: number;
  "max-image-preview"?: "none" | "standard" | "large";
  "max-video-preview"?: number;
}

export interface NextJSMetadataOpenGraph {
  title?: string;
  description?: string;
  url?: string;
  siteName?: string;
  images?: NextJSMetadataImage[];
  locale?: string;
  type?: string;
}

export interface NextJSMetadataTwitter {
  card?: "summary" | "summary_large_image" | "app" | "player";
  site?: string;
  creator?: string;
  title?: string;
  description?: string;
  images?: string[];
}

export interface NextJSMetadataAlternates {
  canonical?: string;
  languages?: Record<string, string>;
}

/**
 * Minimal subset of Next.js App Router `Metadata` type.
 * Fully compatible — pass this to `generateMetadata()` or `export const metadata`.
 */
export interface NextJSMetadata {
  title?: string | NextJSMetadataTitle;
  description?: string;
  robots?: NextJSMetadataRobots;
  openGraph?: NextJSMetadataOpenGraph;
  twitter?: NextJSMetadataTwitter;
  alternates?: NextJSMetadataAlternates;
  other?: Record<string, string | number | Array<string | number>>;
}

// ─── Converter ────────────────────────────────────────────────

/**
 * Converts a `SEOConfig` to a Next.js App Router compatible `Metadata` object.
 *
 * @example
 * // app/about/page.tsx
 * import { toNextMetadata } from 'react-ssr-seo-toolkit/adapters/nextjs';
 *
 * export function generateMetadata(): Metadata {
 *   return toNextMetadata({
 *     title: 'About Us',
 *     titleTemplate: '%s | MySite',
 *     description: 'Learn more about us.',
 *     canonical: 'https://mysite.com/about',
 *   });
 * }
 */
export function toNextMetadata(config: SEOConfig): NextJSMetadata {
  const meta: NextJSMetadata = {};

  // Title
  if (config.title) {
    if (config.titleTemplate) {
      meta.title = {
        default: config.title,
        template: config.titleTemplate,
      };
    } else {
      meta.title = config.title;
    }
  }

  // Description
  if (config.description?.trim()) {
    meta.description = config.description.trim();
  }

  // Canonical + hreflang → alternates
  const hasCanonical = !!config.canonical?.trim();
  const hasAlternates = !!config.alternates?.length;

  if (hasCanonical || hasAlternates) {
    meta.alternates = {};

    if (hasCanonical) {
      meta.alternates.canonical = config.canonical!.trim();
    }

    if (hasAlternates) {
      const languages: Record<string, string> = {};
      for (const alt of config.alternates!) {
        languages[alt.hreflang] = alt.href;
      }
      meta.alternates.languages = languages;
    }
  }

  // Robots
  if (config.robots) {
    const r = config.robots;
    const robots: NextJSMetadataRobots = {};

    if (r.index !== undefined) robots.index = r.index;
    if (r.follow !== undefined) robots.follow = r.follow;
    if (r.noarchive) robots.noarchive = r.noarchive;
    if (r.nosnippet) robots.nosnippet = r.nosnippet;
    if (r.noimageindex) robots.noimageindex = r.noimageindex;
    if (r.notranslate) robots.notranslate = r.notranslate;
    if (r.maxSnippet !== undefined) robots["max-snippet"] = r.maxSnippet;
    if (r.maxImagePreview) robots["max-image-preview"] = r.maxImagePreview;
    if (r.maxVideoPreview !== undefined)
      robots["max-video-preview"] = r.maxVideoPreview;

    meta.robots = robots;
  }

  // Open Graph
  if (config.openGraph) {
    const og = config.openGraph;
    const openGraph: NextJSMetadataOpenGraph = {};

    if (og.title) openGraph.title = og.title;
    if (og.description) openGraph.description = og.description;
    if (og.url) openGraph.url = og.url;
    if (og.siteName) openGraph.siteName = og.siteName;
    if (og.type) openGraph.type = og.type;
    if (og.locale) openGraph.locale = og.locale;

    if (og.images?.length) {
      openGraph.images = og.images.map((img: OpenGraphImage) => {
        const image: NextJSMetadataImage = { url: img.url };
        if (img.alt) image.alt = img.alt;
        if (img.width) image.width = img.width;
        if (img.height) image.height = img.height;
        if (img.type) image.type = img.type;
        return image;
      });
    }

    meta.openGraph = openGraph;
  }

  // Twitter
  if (config.twitter) {
    const tw = config.twitter;
    const twitter: NextJSMetadataTwitter = {};

    if (tw.card) twitter.card = tw.card;
    if (tw.site) twitter.site = tw.site;
    if (tw.creator) twitter.creator = tw.creator;
    if (tw.title) twitter.title = tw.title;
    if (tw.description) twitter.description = tw.description;
    if (tw.image) twitter.images = [tw.image];

    meta.twitter = twitter;
  }

  // Additional meta tags → other (name-based only; property-based are not
  // expressible in Next.js Metadata.other and are skipped)
  if (config.additionalMetaTags?.length) {
    const other: Record<string, string> = {};
    for (const tag of config.additionalMetaTags) {
      const key = tag.name ?? tag.property;
      if (key) other[key] = tag.content;
    }
    if (Object.keys(other).length > 0) meta.other = other;
  }

  return meta;
}

/**
 * Builds the resolved title string exactly as Next.js would display it.
 * Useful for `<title>` in Pages Router or for og:title overrides.
 */
export function buildNextTitle(config: SEOConfig): string {
  return buildTitle(config.title, config.titleTemplate);
}
