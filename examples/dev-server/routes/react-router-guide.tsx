import React from "react";
import { mergeSEOConfig, buildCanonicalUrl } from "../../../src/index.js";
import { siteConfig, SITE_URL } from "../config/seo.js";

export function meta() {
  return mergeSEOConfig(siteConfig, {
    title: "React Router 7 Guide",
    description:
      "Learn how to use react-ssr-seo-toolkit with React Router 7 — meta(), loaders, JSON-LD, and the toRouterMeta adapter for SSR.",
    canonical: buildCanonicalUrl(SITE_URL, "/react-router-guide"),
  });
}

export const handle = { activeRoute: "/react-router-guide" };

export default function ReactRouterGuidePage() {
  return (
    <>
      <div className="page-header">
        <h1>React Router 7 Integration Guide</h1>
        <p>
          How to use react-ssr-seo-toolkit with React Router 7's SSR — the{" "}
          <code>meta()</code> export, loaders, JSON-LD, and the{" "}
          <code>toRouterMeta()</code> adapter. All SEO tags are rendered
          server-side through <code>{"<Meta />"}</code> in your root layout.
        </p>
      </div>

      <div className="narrow-container" style={{ paddingBottom: "4rem" }}>

        {/* Step 1 — How it works */}
        <div className="demo-section">
          <h2 className="demo-section-title">
            <span className="step">1</span>
            How React Router 7 SSR SEO works
          </h2>
          <p style={{ color: "#64748b", marginBottom: "1rem" }}>
            In React Router 7 SSR, every SEO tag is produced by a route's{" "}
            <code>meta()</code> function. React Router collects all descriptors
            from active routes and renders them server-side via{" "}
            <code>{"<Meta />"}</code> in <code>root.tsx</code>. No client-side
            injection — the tags are in the HTML from the first byte.
          </p>
          <div className="card card-elevated" style={{ overflowX: "auto" }}>
            <table className="api-table">
              <thead>
                <tr>
                  <th>What</th>
                  <th>Route export</th>
                  <th>How</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    Title, description, canonical, OG, Twitter, robots
                  </td>
                  <td>
                    <code>meta()</code> in each route
                  </td>
                  <td>
                    <code>toRouterMeta(config)</code> — converts any{" "}
                    <code>SEOConfig</code> to a descriptor array in one call.
                    Includes the canonical <code>{"<link>"}</code> tag too.
                  </td>
                </tr>
                <tr>
                  <td>JSON-LD structured data</td>
                  <td>Route component body</td>
                  <td>
                    Schema generators +{" "}
                    <code>safeJsonLdSerialize</code> inside a{" "}
                    <code>{"<script>"}</code> tag
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="callout callout-warning">
            <div className="callout-icon">!</div>
            <div className="callout-content">
              <p>
                <strong>Do not</strong> put canonical in <code>links()</code>{" "}
                when using <code>toRouterMeta()</code>. That adapter already
                emits <code>{"{ tagName: 'link', rel: 'canonical', href }"}</code>{" "}
                which <code>{"<Meta />"}</code> renders as a proper{" "}
                <code>{"<link rel=\"canonical\">"}</code> tag. Adding the same
                URL via <code>links()</code> creates a <strong>duplicate</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Step 2 — Project structure */}
        <div className="demo-section">
          <h2 className="demo-section-title">
            <span className="step">2</span>
            Project structure (React Router 7)
          </h2>
          <p style={{ color: "#64748b", marginBottom: "1rem" }}>
            React Router 7 uses Vite under the hood. The <code>app/</code>{" "}
            folder holds all route modules, the root layout, and shared utilities.
          </p>
          <div className="folder-structure">
            <span className="folder">my-rr7-app/</span><br />
            {"├── "}<span className="folder">app/</span><br />
            {"│   ├── "}<span className="file">root.tsx</span>{"              "}<span className="comment">{"  # Root layout — <html>, <head>, <Meta />, <Links />"}</span><br />
            {"│   ├── "}<span className="file">routes.ts</span>{"             "}<span className="comment">{"  # Route-to-file mapping (index, route, prefix)"}</span><br />
            {"│   ├── "}<span className="folder">routes/</span><br />
            {"│   │   ├── "}<span className="file">home.tsx</span>{"           "}<span className="comment">{"  # / — mapped as index() in routes.ts"}</span><br />
            {"│   │   ├── "}<span className="file">about.tsx</span>{"          "}<span className="comment">{"  # /about"}</span><br />
            {"│   │   ├── "}<span className="file">blog.tsx</span>{"           "}<span className="comment">{"  # /blog (listing)"}</span><br />
            {"│   │   ├── "}<span className="file">blog.$slug.tsx</span>{"     "}<span className="comment">{"  # /blog/:slug (dynamic)"}</span><br />
            {"│   │   └── "}<span className="file">dashboard.tsx</span>{"      "}<span className="comment">{"  # /dashboard (noindex)"}</span><br />
            {"│   └── "}<span className="folder">lib/</span><br />
            {"│       └── "}<span className="file">seo.ts</span>{"             "}<span className="comment">{"  # Shared SEO config + SITE_URL"}</span><br />
            {"├── "}<span className="folder">public/</span>{"                  "}<span className="comment">{"  # Static assets"}</span><br />
            {"├── "}<span className="file">react-router.config.ts</span>{"    "}<span className="comment">{"  # SSR / prerender settings"}</span><br />
            {"├── "}<span className="file">vite.config.ts</span>{"            "}<span className="comment">{"  # Vite + React Router plugin"}</span><br />
            {"├── "}<span className="file">tsconfig.json</span><br />
            {"└── "}<span className="file">package.json</span>
          </div>

          <p style={{ color: "#64748b", margin: "1rem 0 0.5rem" }}>
            <strong>routes.ts</strong> maps each file to its URL path.{" "}
            <code>index()</code> marks the <code>/</code> route;{" "}
            <code>route()</code> maps everything else.
          </p>
          <div className="code-block">
            <div className="code-header">
              <span className="code-header-title">app/routes.ts</span>
              <span className="code-header-lang">TypeScript</span>
            </div>
            <pre>{`import {
  type RouteConfig,
  index,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),                         // → /
  route("about",     "routes/about.tsx"),           // → /about
  route("blog",      "routes/blog.tsx", [           // → /blog
    route(":slug",   "routes/blog.$slug.tsx"),      //   → /blog/:slug
  ]),
  route("dashboard", "routes/dashboard.tsx"),       // → /dashboard
] satisfies RouteConfig;`}</pre>
          </div>

          <div className="callout callout-info">
            <div className="callout-icon">i</div>
            <div className="callout-content">
              <p>
                Prefer flat-file auto-discovery? Use{" "}
                <code>{'import { flatRoutes } from "@react-router/fs-routes"'}</code>{" "}
                and rename files to the dot-segment convention:{" "}
                <code>_index.tsx</code> → <code>/</code>,{" "}
                <code>blog.$slug.tsx</code> → <code>/blog/:slug</code>.
                The SEO code in this guide works identically with both approaches.
              </p>
            </div>
          </div>
        </div>

        {/* Step 3 — Shared config */}
        <div className="demo-section">
          <h2 className="demo-section-title">
            <span className="step">3</span>
            Shared SEO config
          </h2>
          <p style={{ color: "#64748b", marginBottom: "1rem" }}>
            Define site-wide defaults once. Every route merges its own overrides on top.
          </p>
          <div className="code-block">
            <div className="code-header">
              <span className="code-header-title">app/lib/seo.ts</span>
              <span className="code-header-lang">TypeScript</span>
            </div>
            <pre>{`import { createSEOConfig } from "react-ssr-seo-toolkit";

export const siteConfig = createSEOConfig({
  titleTemplate: "%s | My Site",
  description: "A site about web development.",
  openGraph: {
    siteName: "My Site",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@mysite",
  },
});

export const SITE_URL = "https://mysite.com";`}</pre>
          </div>
        </div>

        {/* Step 4 — root.tsx */}
        <div className="demo-section">
          <h2 className="demo-section-title">
            <span className="step">4</span>
            Root layout (root.tsx)
          </h2>
          <p style={{ color: "#64748b", marginBottom: "1rem" }}>
            <code>{"<Meta />"}</code> is the only place you need to care about.
            It collects every descriptor returned by the active route's{" "}
            <code>meta()</code> and renders them as actual{" "}
            <code>{"<title>"}</code>, <code>{"<meta>"}</code>, and{" "}
            <code>{"<link>"}</code> tags on the server — before any JavaScript runs.
          </p>
          <div className="code-block">
            <div className="code-header">
              <span className="code-header-title">app/root.tsx</span>
              <span className="code-header-lang">TSX</span>
            </div>
            <pre>{`import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

export default function Root() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Each route's meta() descriptors are server-rendered here */}
        <Meta />
        {/* Stylesheet <link> tags from each route's links() */}
        <Links />
      </head>
      <body>
        <nav>{/* Shared navigation */}</nav>
        <Outlet />
        <footer>{/* Shared footer */}</footer>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}`}</pre>
          </div>
          <div className="callout callout-info">
            <div className="callout-icon">i</div>
            <div className="callout-content">
              <p>
                <code>{"<Links />"}</code> is for stylesheet and preload{" "}
                <code>{"<link>"}</code> tags from a route's <code>links()</code>{" "}
                export — <strong>not for SEO</strong>. Canonical and hreflang
                tags are already rendered by <code>{"<Meta />"}</code> via{" "}
                <code>toRouterMeta()</code>.
              </p>
            </div>
          </div>
        </div>

        {/* Step 5 — Static page */}
        <div className="demo-section">
          <h2 className="demo-section-title">
            <span className="step">5</span>
            Static page with <code>meta()</code>
          </h2>
          <p style={{ color: "#64748b", marginBottom: "1rem" }}>
            Call <code>toRouterMeta()</code> inside <code>meta()</code>.
            It returns a flat descriptor array — React Router passes it to{" "}
            <code>{"<Meta />"}</code> which renders every tag server-side,
            including the canonical <code>{"<link>"}</code>.
          </p>
          <div className="code-block">
            <div className="code-header">
              <span className="code-header-title">app/routes/about.tsx</span>
              <span className="code-header-lang">TSX</span>
            </div>
            <pre>{`import { toRouterMeta } from "react-ssr-seo-toolkit/adapters/react-router";
import { mergeSEOConfig, buildCanonicalUrl } from "react-ssr-seo-toolkit";
import { siteConfig, SITE_URL } from "~/lib/seo";
import type { MetaDescriptor } from "react-router";

export function meta(): MetaDescriptor[] {
  return toRouterMeta(
    mergeSEOConfig(siteConfig, {
      title: "About Us",
      description: "Learn about our team and mission.",
      canonical: buildCanonicalUrl(SITE_URL, "/about"),
      openGraph: { type: "website" },
    })
  );
}

export default function AboutPage() {
  return (
    <main>
      <h1>About Us</h1>
      <p>Our mission is to build great software.</p>
    </main>
  );
}`}</pre>
          </div>
        </div>

        {/* Step 6 — SSR output */}
        <div className="demo-section">
          <h2 className="demo-section-title">
            <span className="step">6</span>
            What the server renders
          </h2>
          <p style={{ color: "#64748b", marginBottom: "1rem" }}>
            When a user requests <code>/about</code>, React Router SSR renders
            the above <code>meta()</code> output through <code>{"<Meta />"}</code>.
            The final HTML sent to the browser already contains all SEO tags:
          </p>
          <div className="code-block">
            <div className="code-header">
              <span className="code-header-title">SSR output — /about</span>
              <span className="code-header-lang">HTML</span>
            </div>
            <pre>{`<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <!-- Rendered by <Meta /> from meta() descriptors -->
    <title>About Us | My Site</title>
    <meta name="description" content="Learn about our team and mission." />
    <link rel="canonical" href="https://mysite.com/about" />
    <meta property="og:title" content="About Us" />
    <meta property="og:description" content="Learn about our team and mission." />
    <meta property="og:url" content="https://mysite.com/about" />
    <meta property="og:site_name" content="My Site" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="en_US" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:site" content="@mysite" />
  </head>
  <body>
    ...
  </body>
</html>`}</pre>
          </div>
          <div className="callout callout-tip">
            <div className="callout-icon">TIP</div>
            <div className="callout-content">
              <p>
                These tags exist in the HTML <strong>before</strong> any
                JavaScript runs. Search engine crawlers and social media
                previews see them immediately — this is why SSR matters for SEO.
              </p>
            </div>
          </div>
        </div>

        {/* Step 7 — Dynamic page with loader */}
        <div className="demo-section">
          <h2 className="demo-section-title">
            <span className="step">7</span>
            Dynamic page with loader + <code>meta()</code>
          </h2>
          <p style={{ color: "#64748b", marginBottom: "1rem" }}>
            For dynamic routes, fetch data in a <code>loader</code> and access
            it in <code>meta()</code> via the <code>data</code> argument.
            Both run on the server — SEO tags are built from real data before
            the HTML is sent.
          </p>
          <div className="code-block">
            <div className="code-header">
              <span className="code-header-title">app/routes/blog.$slug.tsx</span>
              <span className="code-header-lang">TSX</span>
            </div>
            <pre>{`import { toRouterMeta } from "react-ssr-seo-toolkit/adapters/react-router";
import {
  mergeSEOConfig,
  buildCanonicalUrl,
  createArticleSchema,
  createBreadcrumbSchema,
  safeJsonLdSerialize,
} from "react-ssr-seo-toolkit";
import { siteConfig, SITE_URL } from "~/lib/seo";
import type { Route } from "./+types/blog.$slug";

// Runs on the server — fetches post data
export async function loader({ params }: Route.LoaderArgs) {
  const post = await fetchPost(params.slug);
  return { post };
}

// Runs on the server — builds SEO tags from loader data
export function meta({ data }: Route.MetaArgs): ReturnType<typeof toRouterMeta> {
  if (!data?.post) return [{ title: "Post not found" }];
  const { post } = data;
  const url = buildCanonicalUrl(SITE_URL, \`/blog/\${post.slug}\`);

  return toRouterMeta(
    mergeSEOConfig(siteConfig, {
      title: post.title,
      description: post.excerpt,
      canonical: url,
      openGraph: {
        type: "article",
        title: post.title,
        description: post.excerpt,
        url,
        images: [{ url: post.image, width: 1200, height: 630, alt: post.title }],
      },
      twitter: { card: "summary_large_image", title: post.title },
    })
  );
}

// Page component — JSON-LD goes in the body, not <head>
export default function BlogPostPage({ loaderData }: Route.ComponentProps) {
  const { post } = loaderData;
  const url = buildCanonicalUrl(SITE_URL, \`/blog/\${post.slug}\`);

  const articleSchema = createArticleSchema({
    headline: post.title,
    url,
    datePublished: post.date,
    author: [{ name: post.author }],
    publisher: { name: "My Site", logo: \`\${SITE_URL}/logo.png\` },
    images: [post.image],
  });

  const breadcrumb = createBreadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Blog", url: buildCanonicalUrl(SITE_URL, "/blog") },
    { name: post.title, url },
  ]);

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdSerialize(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdSerialize(breadcrumb) }}
      />
      <h1>{post.title}</h1>
      <p>By {post.author} on {post.date}</p>
      <div>{post.content}</div>
    </article>
  );
}

async function fetchPost(slug: string) {
  return {
    title: "My Blog Post",
    excerpt: "A short description of the post.",
    content: "Full post content...",
    author: "Jane Doe",
    date: "2025-06-15",
    image: \`\${SITE_URL}/images/\${slug}.jpg\`,
    slug,
  };
}`}</pre>
          </div>
          <div className="callout callout-tip">
            <div className="callout-icon">TIP</div>
            <div className="callout-content">
              <p>
                JSON-LD <code>{"<script>"}</code> tags go in the component body —
                React Router has no built-in way to inject inline scripts via{" "}
                <code>meta()</code>. Google reads JSON-LD from anywhere in the
                document, so body placement is perfectly valid.
              </p>
            </div>
          </div>
        </div>

        {/* Step 8 — Noindex */}
        <div className="demo-section">
          <h2 className="demo-section-title">
            <span className="step">8</span>
            Dashboard page (noindex)
          </h2>
          <p style={{ color: "#64748b", marginBottom: "1rem" }}>
            Pass <code>robots</code> in the config — <code>toRouterMeta()</code>{" "}
            automatically emits the robots meta tag.
          </p>
          <div className="code-block">
            <div className="code-header">
              <span className="code-header-title">app/routes/dashboard.tsx</span>
              <span className="code-header-lang">TSX</span>
            </div>
            <pre>{`import { toRouterMeta } from "react-ssr-seo-toolkit/adapters/react-router";
import { mergeSEOConfig } from "react-ssr-seo-toolkit";
import { siteConfig } from "~/lib/seo";
import type { MetaDescriptor } from "react-router";

export function meta(): MetaDescriptor[] {
  return toRouterMeta(
    mergeSEOConfig(siteConfig, {
      title: "Dashboard",
      robots: { noIndex: true, noFollow: false },
    })
  );
  // Renders: <meta name="robots" content="noindex,follow">
}

export default function DashboardPage() {
  return (
    <main>
      <h1>Dashboard</h1>
      <p>Your private dashboard content.</p>
    </main>
  );
}`}</pre>
          </div>
        </div>

        {/* Step 9 — Reusable helper */}
        <div className="demo-section">
          <h2 className="demo-section-title">
            <span className="step">9</span>
            Reusable meta helper
          </h2>
          <p style={{ color: "#64748b", marginBottom: "1rem" }}>
            Wrap merge + adapter in a thin helper so every route needs just one
            line.
          </p>
          <div className="code-block">
            <div className="code-header">
              <span className="code-header-title">app/lib/seo.ts — extended</span>
              <span className="code-header-lang">TypeScript</span>
            </div>
            <pre>{`import { createSEOConfig, mergeSEOConfig, buildCanonicalUrl } from "react-ssr-seo-toolkit";
import { toRouterMeta } from "react-ssr-seo-toolkit/adapters/react-router";
import type { SEOConfig } from "react-ssr-seo-toolkit";

export const siteConfig = createSEOConfig({
  titleTemplate: "%s | My Site",
  openGraph: { siteName: "My Site", type: "website", locale: "en_US" },
  twitter: { card: "summary_large_image", site: "@mysite" },
});

export const SITE_URL = "https://mysite.com";

export function buildRouteMeta(override: Partial<SEOConfig>, path?: string) {
  return toRouterMeta(
    mergeSEOConfig(siteConfig, {
      ...override,
      ...(path && { canonical: buildCanonicalUrl(SITE_URL, path) }),
    })
  );
}`}</pre>
          </div>
          <p style={{ color: "#64748b", marginTop: "1rem" }}>
            Any route now generates all SEO tags in one line:
          </p>
          <div className="code-block">
            <div className="code-header">
              <span className="code-header-title">app/routes/about.tsx (simplified)</span>
              <span className="code-header-lang">TSX</span>
            </div>
            <pre>{`import { buildRouteMeta } from "~/lib/seo";

export const meta = () =>
  buildRouteMeta({ title: "About Us", description: "Learn about our team." }, "/about");

export default function AboutPage() {
  return (
    <main>
      <h1>About Us</h1>
      <p>Our mission is to build great software.</p>
    </main>
  );
}`}</pre>
          </div>
        </div>

        {/* Summary */}
        <div className="demo-section">
          <h2 className="section-title" style={{ fontSize: "1.35rem" }}>
            Summary
          </h2>
          <div className="card card-elevated" style={{ overflowX: "auto" }}>
            <table className="api-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Where</th>
                  <th>Tool</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Title, description, canonical, OG, Twitter, robots</td>
                  <td><code>meta()</code> → <code>{"<Meta />"}</code> (SSR)</td>
                  <td><code>toRouterMeta(config)</code></td>
                </tr>
                <tr>
                  <td>JSON-LD structured data</td>
                  <td>Component body (<code>{"<script>"}</code>)</td>
                  <td>Schema generators + <code>safeJsonLdSerialize</code></td>
                </tr>
                <tr>
                  <td>Dynamic SEO (data from DB/CMS)</td>
                  <td><code>loader()</code> → <code>{"meta({ data })"}</code></td>
                  <td>Same <code>toRouterMeta()</code>, called with fetched data</td>
                </tr>
                <tr>
                  <td>Noindex</td>
                  <td><code>meta()</code></td>
                  <td><code>{"robots: { noIndex: true }"}</code> in config</td>
                </tr>
                <tr>
                  <td>Stylesheets / preload hints</td>
                  <td><code>links()</code> → <code>{"<Links />"}</code></td>
                  <td>Native React Router (not an SEO concern)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Next Steps */}
        <div className="demo-section">
          <div className="feature-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            <a href="/react-guide" className="feature-card" style={{ textDecoration: "none" }}>
              <h3>React + Express SSR</h3>
              <p>Guide for using the toolkit with a plain React + Express SSR setup.</p>
            </a>
            <a href="/nextjs-guide" className="feature-card" style={{ textDecoration: "none" }}>
              <h3>Next.js Guide</h3>
              <p>App Router and Pages Router integration with generateMetadata.</p>
            </a>
            <a href="/recipes" className="feature-card" style={{ textDecoration: "none" }}>
              <h3>Recipes</h3>
              <p>Copy-paste examples for blogs, products, FAQs, and more.</p>
            </a>
            <a href="/api" className="feature-card" style={{ textDecoration: "none" }}>
              <h3>API Reference</h3>
              <p>Complete documentation of every function and type.</p>
            </a>
          </div>
        </div>

      </div>
    </>
  );
}
