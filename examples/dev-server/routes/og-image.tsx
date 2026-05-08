import React from "react";
import { mergeSEOConfig, buildCanonicalUrl } from "../../../src/index.js";
import { createOGImageSVG } from "../../../src/og/index.js";
import { siteConfig, SITE_URL } from "../config/seo.js";

// Generate all three SVGs server-side at render time
const defaultSvg = createOGImageSVG({
  title: "How to Build an SSR App with React",
  description: "A complete guide to server-rendered React with proper SEO.",
  brand: "react-ssr-seo-toolkit",
  accentColor: "#6366f1",
});

const articleSvg = createOGImageSVG({
  title: "Premier League Preview 2026",
  description: "Everything you need to know about the upcoming season.",
  template: "article",
  category: "Sports",
  author: "James Walker",
  dateString: "May 8, 2026",
  brand: "Trustix UK",
  accentColor: "#e63946",
});

const sportsSvg = createOGImageSVG({
  title: "Liverpool vs Arsenal",
  template: "sports-event",
  homeTeam: "Liverpool",
  awayTeam: "Arsenal",
  eventDate: "Saturday, May 15, 2026 · 17:30",
  brand: "Trustix UK",
  accentColor: "#ffd700",
});

function toDataUri(svg: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function meta() {
  return mergeSEOConfig(siteConfig, {
    title: "OG Image Generation Demo",
    description:
      "Generate 1200×630 Open Graph images server-side — no external service, no Puppeteer, no API keys.",
    canonical: buildCanonicalUrl(SITE_URL, "/og-image"),
    openGraph: {
      title: "OG Image Generation — No External Service",
      description: "Generate social images server-side with SVG templates.",
      type: "website",
      url: `${SITE_URL}/og-image`,
    },
  });
}

export const handle = { activeRoute: "/og-image" };

export default function OGImagePage() {
  return (
    <>
      <div className="page-header">
        <h1>OG Image Generation</h1>
        <p>
          Generate 1200×630 social images server-side — no external service, no Puppeteer, no
          API keys. Pure SVG, served directly or converted to PNG with{" "}
          <code>sharp</code>.
        </p>
        <div className="page-tags" style={{ marginTop: "0.75rem" }}>
          <span className="tag">createOGImageSVG</span>
          <span className="tag">default template</span>
          <span className="tag">article template</span>
          <span className="tag">sports-event template</span>
        </div>
      </div>

      <div className="narrow-container" style={{ paddingBottom: "4rem" }}>

        {/* ── Default Template ───────────────────────────────── */}
        <div className="demo-section">
          <h2 className="section-title" style={{ fontSize: "1.35rem" }}>
            Default Template — Dark Gradient
          </h2>
          <p className="section-subtitle">
            A clean dark background with title, description, accent bar, and brand name. Works
            for any page type.
          </p>

          <div
            className="card card-elevated"
            style={{ padding: 0, overflow: "hidden", borderRadius: 12 }}
          >
            <img
              src={toDataUri(defaultSvg)}
              alt="Default OG image template preview"
              style={{ width: "100%", display: "block", aspectRatio: "1200/630" }}
            />
          </div>

          <div className="code-block" style={{ marginTop: "1rem" }}>
            <div className="code-header">
              <span className="code-header-title">Default template</span>
              <span className="code-header-lang">TypeScript</span>
            </div>
            <pre>{`import { createOGImageSVG } from "react-ssr-seo-toolkit/og";

const svg = createOGImageSVG({
  title: "How to Build an SSR App with React",
  description: "A complete guide to server-rendered React with proper SEO.",
  brand: "My Blog",
  accentColor: "#6366f1",
  // template: "default" is the default
});

// Serve from Express:
app.get("/og/default.svg", (req, res) => {
  res.type("image/svg+xml").send(svg);
});

// Dynamic endpoint with query param:
app.get("/og/:slug.svg", (req, res) => {
  const page = getPageBySlug(req.params.slug);
  res.type("image/svg+xml").send(
    createOGImageSVG({ title: page.title, brand: "My Blog" })
  );
});

// Use as og:image:
openGraph: {
  images: [{ url: "https://mysite.com/og/my-post.svg", width: 1200, height: 630 }]
}`}</pre>
          </div>
        </div>

        {/* ── Article Template ───────────────────────────────── */}
        <div className="demo-section">
          <h2 className="section-title" style={{ fontSize: "1.35rem" }}>
            Article Template — Light with Category Tag
          </h2>
          <p className="section-subtitle">
            A light background with a colored category pill, author byline, and publication date.
            Great for blog posts and news articles.
          </p>

          <div
            className="card card-elevated"
            style={{ padding: 0, overflow: "hidden", borderRadius: 12 }}
          >
            <img
              src={toDataUri(articleSvg)}
              alt="Article OG image template preview"
              style={{ width: "100%", display: "block", aspectRatio: "1200/630" }}
            />
          </div>

          <div className="code-block" style={{ marginTop: "1rem" }}>
            <div className="code-header">
              <span className="code-header-title">Article template</span>
              <span className="code-header-lang">TypeScript</span>
            </div>
            <pre>{`const svg = createOGImageSVG({
  title: "Premier League Preview 2026",
  description: "Everything you need to know about the upcoming season.",
  template: "article",
  category: "Sports",
  author: "James Walker",
  dateString: "May 8, 2026",
  brand: "Trustix UK",
  accentColor: "#e63946",
});`}</pre>
          </div>
        </div>

        {/* ── Sports Event Template ──────────────────────────── */}
        <div className="demo-section">
          <h2 className="section-title" style={{ fontSize: "1.35rem" }}>
            Sports Event Template — VS Layout
          </h2>
          <p className="section-subtitle">
            A dark dramatic layout with home team vs away team, separated by a glowing divider.
            Pass <code>homeTeam</code> and <code>awayTeam</code> to activate the VS layout.
          </p>

          <div
            className="card card-elevated"
            style={{ padding: 0, overflow: "hidden", borderRadius: 12 }}
          >
            <img
              src={toDataUri(sportsSvg)}
              alt="Sports event OG image template preview"
              style={{ width: "100%", display: "block", aspectRatio: "1200/630" }}
            />
          </div>

          <div className="code-block" style={{ marginTop: "1rem" }}>
            <div className="code-header">
              <span className="code-header-title">Sports event template</span>
              <span className="code-header-lang">TypeScript</span>
            </div>
            <pre>{`const svg = createOGImageSVG({
  title: "Liverpool vs Arsenal",
  template: "sports-event",
  homeTeam: "Liverpool",
  awayTeam: "Arsenal",
  eventDate: "Saturday, May 15, 2026 · 17:30",
  brand: "Trustix UK",
  accentColor: "#ffd700",
});`}</pre>
          </div>
        </div>

        {/* ── PNG Conversion ─────────────────────────────────── */}
        <div className="demo-section">
          <h2 className="section-title" style={{ fontSize: "1.35rem" }}>
            Convert to PNG (optional)
          </h2>
          <p className="section-subtitle">
            SVG works directly as <code>og:image</code> in most platforms. For maximum
            compatibility, convert to PNG with{" "}
            <code>sharp</code> — no headless browser needed.
          </p>

          <div className="code-block">
            <div className="code-header">
              <span className="code-header-title">SVG → PNG with sharp</span>
              <span className="code-header-lang">TypeScript</span>
            </div>
            <pre>{`import sharp from "sharp";
import { createOGImageSVG } from "react-ssr-seo-toolkit/og";

app.get("/og/:slug.png", async (req, res) => {
  const page = await getPage(req.params.slug);

  const svg = createOGImageSVG({
    title: page.title,
    description: page.excerpt,
    brand: "Trustix UK",
  });

  const png = await sharp(Buffer.from(svg))
    .resize(1200, 630)
    .png()
    .toBuffer();

  res
    .type("image/png")
    .set("Cache-Control", "public, max-age=86400")
    .send(png);
});`}</pre>
          </div>

          <div className="callout callout-warning" style={{ marginTop: "1rem" }}>
            <div className="callout-icon">!</div>
            <div className="callout-content">
              <p>
                <code>sharp</code> is an optional dependency — install separately with{" "}
                <code>npm install sharp</code>. It is not bundled with react-ssr-seo-toolkit
                to keep the package size minimal.
              </p>
            </div>
          </div>
        </div>

        {/* ── Customization ─────────────────────────────────── */}
        <div className="demo-section">
          <h2 className="section-title" style={{ fontSize: "1.35rem" }}>
            Full Options Reference
          </h2>
          <div className="card card-elevated" style={{ overflowX: "auto" }}>
            <table className="api-table">
              <thead>
                <tr>
                  <th>Option</th>
                  <th>Type</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                <tr><td><code>title</code></td><td>string</td><td>Main headline (required)</td></tr>
                <tr><td><code>description</code></td><td>string?</td><td>Subtitle / description</td></tr>
                <tr><td><code>template</code></td><td>"default" | "article" | "sports-event"</td><td>Visual template</td></tr>
                <tr><td><code>brand</code></td><td>string?</td><td>Brand name shown in corner</td></tr>
                <tr><td><code>backgroundColor</code></td><td>string?</td><td>Override background color</td></tr>
                <tr><td><code>textColor</code></td><td>string?</td><td>Override text color</td></tr>
                <tr><td><code>accentColor</code></td><td>string?</td><td>Override accent / highlight color</td></tr>
                <tr><td><code>category</code></td><td>string?</td><td>Category pill (article template)</td></tr>
                <tr><td><code>author</code></td><td>string?</td><td>Author byline (article template)</td></tr>
                <tr><td><code>dateString</code></td><td>string?</td><td>Display date (article template)</td></tr>
                <tr><td><code>homeTeam</code></td><td>string?</td><td>Home team name (sports-event)</td></tr>
                <tr><td><code>awayTeam</code></td><td>string?</td><td>Away team name (sports-event)</td></tr>
                <tr><td><code>eventDate</code></td><td>string?</td><td>Event date text (sports-event)</td></tr>
              </tbody>
            </table>
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
              <h3>No External Service</h3>
              <p>
                Pure SVG generation — no Cloudinary, no Vercel Edge, no API keys. Works
                anywhere Node.js runs.
              </p>
            </div>
            <div className="card">
              <h3>3 Built-in Templates</h3>
              <p>
                Default (dark gradient), Article (light with category), Sports Event (VS layout).
                Each is fully customizable.
              </p>
            </div>
            <div className="card">
              <h3>Text Wrapping</h3>
              <p>
                Long titles and descriptions are automatically wrapped across lines and truncated
                with an ellipsis if needed.
              </p>
            </div>
            <div className="card">
              <h3>SSR-Ready</h3>
              <p>
                Runs on the server — generate at build time, serve dynamically, or cache with
                HTTP <code>Cache-Control</code> headers.
              </p>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
