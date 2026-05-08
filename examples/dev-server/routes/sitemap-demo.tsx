import React from "react";
import { mergeSEOConfig, buildCanonicalUrl, createBreadcrumbSchema } from "../../../src/index.js";
import { generateSitemap, generateRobots, autoBreadcrumb } from "../../../src/sitemap/index.js";
import { siteConfig, SITE_URL } from "../config/seo.js";

const sampleRoutes = [
  { path: "/", priority: 1.0, changefreq: "daily" as const },
  { path: "/tickets", priority: 0.9, changefreq: "hourly" as const },
  { path: "/tickets/liverpool-vs-arsenal", priority: 0.8, changefreq: "weekly" as const },
  { path: "/about", priority: 0.5, changefreq: "monthly" as const },
  { path: "/blog", priority: 0.7, changefreq: "daily" as const },
  "/contact",
  "/faq",
];

const sitemapOutput = generateSitemap({
  baseUrl: "https://trustix.uk",
  routes: sampleRoutes,
  exclude: ["/dashboard/*", "/admin/*"],
  defaultChangefreq: "weekly",
  defaultPriority: 0.6,
});

const robotsOutput = generateRobots({
  rules: [
    {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/admin", "/login"],
    },
    {
      userAgent: "Googlebot",
      allow: "/",
      crawlDelay: 2,
    },
  ],
  sitemap: "https://trustix.uk/sitemap.xml",
});

const breadcrumbItems = autoBreadcrumb("/ticket/liverpool-vs-arsenal", {
  baseUrl: "https://trustix.uk",
  labels: { "/ticket": "Tickets" },
});

const breadcrumbSchema = createBreadcrumbSchema(breadcrumbItems);

export function meta() {
  return mergeSEOConfig(siteConfig, {
    title: "Sitemap & Robots Demo",
    description:
      "Generate sitemap.xml and robots.txt automatically from your route config. Auto-generate breadcrumbs from URL paths.",
    canonical: buildCanonicalUrl(SITE_URL, "/sitemap-demo"),
    openGraph: {
      title: "Sitemap & Robots Generation",
      description: "Automatically generate sitemap.xml, robots.txt, and breadcrumbs from routes.",
      type: "website",
      url: `${SITE_URL}/sitemap-demo`,
    },
  });
}

export const handle = {
  activeRoute: "/sitemap-demo",
  schemas: [breadcrumbSchema],
};

export default function SitemapDemoPage() {
  return (
    <>
      <div className="page-header">
        <h1>Sitemap &amp; Robots Generation</h1>
        <p>
          Generate <code>sitemap.xml</code> and <code>robots.txt</code> automatically from your
          route config — and auto-build breadcrumbs from any URL path.
        </p>
        <div className="page-tags" style={{ marginTop: "0.75rem" }}>
          <span className="tag">generateSitemap</span>
          <span className="tag">generateRobots</span>
          <span className="tag">autoBreadcrumb</span>
        </div>
      </div>

      <div className="narrow-container" style={{ paddingBottom: "4rem" }}>

        {/* ── Sitemap ────────────────────────────────────────── */}
        <div className="demo-section">
          <h2 className="section-title" style={{ fontSize: "1.35rem" }}>
            sitemap.xml Generation
          </h2>
          <p className="section-subtitle">
            Pass your route list and a base URL — the library outputs a valid sitemap ready to
            serve or write to disk. Wildcard patterns exclude private routes automatically.
          </p>

          <div className="code-block">
            <div className="code-header">
              <span className="code-header-title">sitemap config (shared across all frameworks)</span>
              <span className="code-header-lang">TypeScript</span>
            </div>
            <pre>{`import { generateSitemap } from "react-ssr-seo-toolkit/sitemap";

export const sitemap = generateSitemap({
  baseUrl: "https://trustix.uk",
  routes: [
    { path: "/",        priority: 1.0, changefreq: "daily"  },
    { path: "/tickets", priority: 0.9, changefreq: "hourly" },
    { path: "/tickets/liverpool-vs-arsenal", priority: 0.8  },
    { path: "/about",   priority: 0.5, changefreq: "monthly"},
    "/blog",
    "/contact",
  ],
  exclude: ["/dashboard/*", "/admin/*"],
  defaultChangefreq: "weekly",
  defaultPriority: 0.6,
});`}</pre>
          </div>

          <div className="code-block" style={{ marginTop: "1rem" }}>
            <div className="code-header">
              <span className="code-header-title">Next.js App Router — app/sitemap.xml/route.ts</span>
              <span className="code-header-lang">Next.js</span>
            </div>
            <pre>{`// app/sitemap.xml/route.ts
import { sitemap } from "@/lib/sitemap";

export function GET() {
  return new Response(sitemap, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}`}</pre>
          </div>

          <div className="code-block" style={{ marginTop: "1rem" }}>
            <div className="code-header">
              <span className="code-header-title">React Router 7 — app/routes/sitemap[.xml].tsx</span>
              <span className="code-header-lang">React Router 7</span>
            </div>
            <pre>{`// app/routes/sitemap[.xml].tsx
import { sitemap } from "~/lib/sitemap";
import type { LoaderFunction } from "react-router";

export const loader: LoaderFunction = () =>
  new Response(sitemap, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });`}</pre>
          </div>

          <div className="code-block" style={{ marginTop: "1rem" }}>
            <div className="code-header">
              <span className="code-header-title">Express — server.ts</span>
              <span className="code-header-lang">Express</span>
            </div>
            <pre>{`// server.ts
import { sitemap } from "./lib/sitemap";

app.get("/sitemap.xml", (_req, res) =>
  res.type("application/xml").send(sitemap)
);

// Or build-time: write to disk
// import { writeFileSync } from "fs";
// writeFileSync("public/sitemap.xml", sitemap);`}</pre>
          </div>

          <div className="code-block" style={{ marginTop: "1rem" }}>
            <div className="code-header">
              <span className="code-header-title">Generated output</span>
              <span className="code-header-lang">XML</span>
            </div>
            <pre style={{ fontSize: "0.8rem" }}>{sitemapOutput}</pre>
          </div>
        </div>

        {/* ── Robots ────────────────────────────────────────── */}
        <div className="demo-section">
          <h2 className="section-title" style={{ fontSize: "1.35rem" }}>
            robots.txt Generation
          </h2>
          <p className="section-subtitle">
            Define per-agent rules, disallow private paths, and include your sitemap URL — all
            from a typed config object.
          </p>

          <div className="code-block">
            <div className="code-header">
              <span className="code-header-title">robots config (shared across all frameworks)</span>
              <span className="code-header-lang">TypeScript</span>
            </div>
            <pre>{`import { generateRobots } from "react-ssr-seo-toolkit/sitemap";

export const robots = generateRobots({
  rules: [
    {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/admin", "/login"],
    },
    {
      userAgent: "Googlebot",
      allow: "/",
      crawlDelay: 2,
    },
  ],
  sitemap: "https://trustix.uk/sitemap.xml",
});`}</pre>
          </div>

          <div className="code-block" style={{ marginTop: "1rem" }}>
            <div className="code-header">
              <span className="code-header-title">Next.js App Router — app/robots.txt/route.ts</span>
              <span className="code-header-lang">Next.js</span>
            </div>
            <pre>{`// app/robots.txt/route.ts
import { robots } from "@/lib/robots";

export function GET() {
  return new Response(robots, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}`}</pre>
          </div>

          <div className="code-block" style={{ marginTop: "1rem" }}>
            <div className="code-header">
              <span className="code-header-title">React Router 7 — app/routes/robots[.txt].tsx</span>
              <span className="code-header-lang">React Router 7</span>
            </div>
            <pre>{`// app/routes/robots[.txt].tsx
import { robots } from "~/lib/robots";
import type { LoaderFunction } from "react-router";

export const loader: LoaderFunction = () =>
  new Response(robots, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });`}</pre>
          </div>

          <div className="code-block" style={{ marginTop: "1rem" }}>
            <div className="code-header">
              <span className="code-header-title">Express — server.ts</span>
              <span className="code-header-lang">Express</span>
            </div>
            <pre>{`// server.ts
import { robots } from "./lib/robots";

app.get("/robots.txt", (_req, res) =>
  res.type("text/plain").send(robots)
);`}</pre>
          </div>

          <div className="code-block" style={{ marginTop: "1rem" }}>
            <div className="code-header">
              <span className="code-header-title">Generated output</span>
              <span className="code-header-lang">Plain Text</span>
            </div>
            <pre>{robotsOutput}</pre>
          </div>
        </div>

        {/* ── Auto Breadcrumb ────────────────────────────────── */}
        <div className="demo-section">
          <h2 className="section-title" style={{ fontSize: "1.35rem" }}>
            autoBreadcrumb — URL to BreadcrumbList
          </h2>
          <p className="section-subtitle">
            Pass any URL path and get a typed <code>BreadcrumbItem[]</code> back — hyphens become
            spaces, each segment is capitalized. Feed the result straight into{" "}
            <code>createBreadcrumbSchema()</code>.
          </p>

          <div className="card card-elevated">
            <p style={{ fontSize: "0.9rem", color: "#64748b", marginBottom: "0.75rem" }}>
              Input path: <code>/ticket/liverpool-vs-arsenal</code>
            </p>
            <nav style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
              {breadcrumbItems.map((item, i) => (
                <React.Fragment key={item.url}>
                  {i > 0 && <span style={{ color: "#94a3b8" }}>›</span>}
                  <a
                    href={item.url}
                    style={{ color: i === breadcrumbItems.length - 1 ? "#0f172a" : "#6366f1", fontSize: "0.95rem" }}
                  >
                    {item.name}
                  </a>
                </React.Fragment>
              ))}
            </nav>
          </div>

          <div className="code-block" style={{ marginTop: "1rem" }}>
            <div className="code-header">
              <span className="code-header-title">autoBreadcrumb usage</span>
              <span className="code-header-lang">TypeScript</span>
            </div>
            <pre>{`import { autoBreadcrumb } from "react-ssr-seo-toolkit/sitemap";
import { createBreadcrumbSchema } from "react-ssr-seo-toolkit";

const items = autoBreadcrumb("/ticket/liverpool-vs-arsenal", {
  baseUrl: "https://trustix.uk",
  labels: { "/ticket": "Tickets" }, // optional label overrides
});

// Result:
// [
//   { name: "Home",                 url: "https://trustix.uk/"  },
//   { name: "Tickets",              url: "https://trustix.uk/ticket" },
//   { name: "Liverpool Vs Arsenal", url: "https://trustix.uk/ticket/liverpool-vs-arsenal" },
// ]

// Feed directly into JSON-LD schema:
const schema = createBreadcrumbSchema(items);`}</pre>
          </div>

          <div className="code-block" style={{ marginTop: "1rem" }}>
            <div className="code-header">
              <span className="code-header-title">Generated JSON-LD (in &lt;head&gt; of this page)</span>
              <span className="code-header-lang">JSON-LD</span>
            </div>
            <pre style={{ fontSize: "0.82rem" }}>{JSON.stringify(breadcrumbSchema, null, 2)}</pre>
          </div>
        </div>

        {/* ── Features ─────────────────────────────────────── */}
        <div className="demo-section">
          <h2 className="section-title" style={{ fontSize: "1.35rem" }}>Features Demonstrated</h2>
          <div
            className="feature-grid"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}
          >
            <div className="card">
              <h3>generateSitemap</h3>
              <p>
                Accepts <code>string[]</code> or <code>SitemapRoute[]</code>. Supports per-route
                priority, changefreq, and lastmod. Wildcard exclude patterns.
              </p>
            </div>
            <div className="card">
              <h3>generateRobots</h3>
              <p>
                Per-agent rules with allow/disallow arrays. Crawl-delay support.
                Multiple sitemap URLs.
              </p>
            </div>
            <div className="card">
              <h3>autoBreadcrumb</h3>
              <p>
                Converts URL segments to readable labels. Custom label overrides per path.
                Custom format function for advanced cases.
              </p>
            </div>
            <div className="card">
              <h3>Zero Config</h3>
              <p>
                All functions work with sensible defaults. No setup, no schema registration —
                just call and use.
              </p>
            </div>
          </div>
        </div>

        <div className="callout callout-source">
          <div className="callout-icon">VIEW</div>
          <div className="callout-content">
            <p>
              <strong>Right-click → View Page Source</strong> to see the{" "}
              <code>BreadcrumbList</code> JSON-LD injected by <code>autoBreadcrumb</code> +{" "}
              <code>createBreadcrumbSchema</code> for this page.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
