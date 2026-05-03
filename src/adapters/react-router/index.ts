import type { SEOConfig } from "../../types/index.js";
import {
  buildTitle,
  buildRobotsDirectives,
  buildOpenGraph,
  buildTwitterMetadata,
  buildAlternateLinks,
} from "../../core/index.js";

// ─── Descriptor types ─────────────────────────────────────────
// Mirrors React Router 7's MetaDescriptor and LinkDescriptor
// without importing from 'react-router', so no peer dep is needed.

export type RouterTitleDescriptor = { title: string };

export type RouterNameMetaDescriptor = {
  name: string;
  content: string;
};

export type RouterPropertyMetaDescriptor = {
  property: string;
  content: string;
};

export type RouterLinkDescriptor = {
  tagName: "link";
  rel: string;
  href: string;
  hrefLang?: string;
  type?: string;
  sizes?: string;
  [key: string]: string | undefined;
};

export type RouterMetaDescriptor =
  | RouterTitleDescriptor
  | RouterNameMetaDescriptor
  | RouterPropertyMetaDescriptor
  | RouterLinkDescriptor;

// ─── toRouterMeta ─────────────────────────────────────────────

/**
 * Converts a `SEOConfig` to a React Router 7 meta descriptor array.
 *
 * Use the return value inside your route's `meta()` export.
 * Includes title, description, robots, Open Graph, Twitter, hreflang,
 * canonical, and any additional meta/link tags.
 *
 * @example
 * // routes/about.tsx
 * import { toRouterMeta } from 'react-ssr-seo-toolkit/adapters/react-router';
 *
 * export function meta(): MetaDescriptor[] {
 *   return toRouterMeta({
 *     title: 'About Us',
 *     titleTemplate: '%s | MySite',
 *     description: 'Learn more about us.',
 *     canonical: 'https://mysite.com/about',
 *     openGraph: { type: 'website', title: 'About Us' },
 *   });
 * }
 */
export function toRouterMeta(config: SEOConfig): RouterMetaDescriptor[] {
  const descriptors: RouterMetaDescriptor[] = [];

  // Title
  const resolvedTitle = buildTitle(config.title, config.titleTemplate);
  if (resolvedTitle) {
    descriptors.push({ title: resolvedTitle });
  }

  // Description
  if (config.description?.trim()) {
    descriptors.push({ name: "description", content: config.description.trim() });
  }

  // Canonical
  if (config.canonical?.trim()) {
    descriptors.push({
      tagName: "link",
      rel: "canonical",
      href: config.canonical.trim(),
    });
  }

  // Robots
  const robotsContent = buildRobotsDirectives(config.robots);
  if (robotsContent) {
    descriptors.push({ name: "robots", content: robotsContent });
  }

  // Open Graph
  for (const tag of buildOpenGraph(config.openGraph)) {
    descriptors.push({ property: tag.property, content: tag.content });
  }

  // Twitter
  for (const tag of buildTwitterMetadata(config.twitter)) {
    descriptors.push({ name: tag.name, content: tag.content });
  }

  // Hreflang alternates
  for (const link of buildAlternateLinks(config.alternates)) {
    descriptors.push({
      tagName: "link",
      rel: link.rel,
      href: link.href,
      hrefLang: link.hreflang,
    });
  }

  // Additional meta tags
  if (config.additionalMetaTags) {
    for (const tag of config.additionalMetaTags) {
      if (tag.name) {
        descriptors.push({ name: tag.name, content: tag.content });
      } else if (tag.property) {
        descriptors.push({ property: tag.property, content: tag.content });
      }
    }
  }

  // Additional link tags
  if (config.additionalLinkTags) {
    for (const link of config.additionalLinkTags) {
      descriptors.push({
        tagName: "link",
        rel: link.rel,
        href: link.href,
        ...(link.hreflang && { hrefLang: link.hreflang }),
        ...(link.type && { type: link.type }),
        ...(link.sizes && { sizes: link.sizes }),
      });
    }
  }

  return descriptors;
}

// ─── toRouterLinks ────────────────────────────────────────────

/**
 * Converts link-type entries from `SEOConfig` to React Router 7 `LinkDescriptor[]`.
 *
 * Use the return value inside your route's `links()` export for canonical
 * and hreflang links. This is an alternative to including them in `meta()`.
 *
 * @example
 * // routes/about.tsx
 * import { toRouterLinks } from 'react-ssr-seo-toolkit/adapters/react-router';
 *
 * export function links() {
 *   return toRouterLinks({
 *     canonical: 'https://mysite.com/about',
 *     alternates: [{ hreflang: 'en', href: 'https://mysite.com/about' }],
 *   });
 * }
 */
export function toRouterLinks(
  config: Pick<SEOConfig, "canonical" | "alternates" | "additionalLinkTags">
): Array<{ rel: string; href: string; hrefLang?: string; type?: string; sizes?: string }> {
  const links: Array<{
    rel: string;
    href: string;
    hrefLang?: string;
    type?: string;
    sizes?: string;
  }> = [];

  if (config.canonical?.trim()) {
    links.push({ rel: "canonical", href: config.canonical.trim() });
  }

  for (const alt of buildAlternateLinks(config.alternates)) {
    links.push({ rel: alt.rel, href: alt.href, hrefLang: alt.hreflang });
  }

  if (config.additionalLinkTags) {
    for (const link of config.additionalLinkTags) {
      links.push({
        rel: link.rel,
        href: link.href,
        ...(link.hreflang && { hrefLang: link.hreflang }),
        ...(link.type && { type: link.type }),
        ...(link.sizes && { sizes: link.sizes }),
      });
    }
  }

  return links;
}
