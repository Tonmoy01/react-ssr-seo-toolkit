<div align="center">

<br />

<img src="https://img.shields.io/badge/react--ssr--seo--toolkit-v1.2.0-000000?style=for-the-badge&labelColor=000000" alt="react-ssr-seo-toolkit" />

<br />
<br />

# `react-ssr-seo-toolkit`

### The Complete SEO Toolkit for React SSR Applications

<br />

[![npm](https://img.shields.io/npm/v/react-ssr-seo-toolkit?style=for-the-badge&logo=npm&logoColor=white&color=CB3837)](https://www.npmjs.com/package/react-ssr-seo-toolkit)
&nbsp;
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
&nbsp;
[![License](https://img.shields.io/npm/l/react-ssr-seo-toolkit?style=for-the-badge&color=blue)](./LICENSE)
&nbsp;
[![Bundle](https://img.shields.io/bundlephobia/minzip/react-ssr-seo-toolkit?style=for-the-badge&label=size&color=success)](https://bundlephobia.com/package/react-ssr-seo-toolkit)

<br />

**Meta Tags** &bull; **Open Graph** &bull; **Twitter Cards** &bull; **JSON-LD** &bull; **Canonical URLs** &bull; **Hreflang** &bull; **Robots** &bull; **Sitemap** &bull; **SEO Validation** &bull; **OG Image**

All in one package. Zero dependencies. Fully typed. SSR-safe.

<br />

[Live Demo](https://react-ssr-seo-toolkit.tonmoykhan.site/) &nbsp;&nbsp;|&nbsp;&nbsp; [Get Started](#-get-started) &nbsp;&nbsp;|&nbsp;&nbsp; [Examples](#-real-world-examples) &nbsp;&nbsp;|&nbsp;&nbsp; [API](#-api-reference) &nbsp;&nbsp;|&nbsp;&nbsp; [Frameworks](#-framework-integration)

<br />

---

</div>

<br />

## Why This Package?

<table>
<tr>
<td width="50%">

### The Problem

- Most SEO packages are **locked to Next.js**
- Many rely on **browser-only APIs** (`window`, `document`)
- JSON-LD usually needs a **separate package**
- No sitemap or robots.txt generation
- No way to validate SEO completeness at build time

</td>
<td width="50%">

### The Solution

- **Framework-agnostic** — works everywhere
- **Zero browser globals** — fully SSR-safe
- **JSON-LD built-in** — 9 schema types including Person, Recipe, JobPosting
- **Sitemap + robots.txt** generator built-in
- **SEO validation + scoring** — catch missing tags at build time
- **OG image SVG generator** — no external service needed
- **Social preview component** — see how your page looks on Twitter, Facebook, etc.

</td>
</tr>
</table>

<br />

## Works With

<div align="center">

| | Framework | Integration |
|:---:|---|---|
| <img src="https://img.shields.io/badge/-Next.js-000?style=flat-square&logo=nextdotjs" /> | **Next.js App Router** | `toNextMetadata()` adapter → `generateMetadata()` |
| <img src="https://img.shields.io/badge/-Next.js-000?style=flat-square&logo=nextdotjs" /> | **Next.js Pages Router** | `<SEOHead>` inside `next/head` |
| <img src="https://img.shields.io/badge/-React_Router-CA4245?style=flat-square&logo=reactrouter&logoColor=white" /> | **React Router 7** | `toRouterMeta()` adapter → `meta()` export |
| <img src="https://img.shields.io/badge/-Express-000?style=flat-square&logo=express" /> | **Express + React SSR** | `<SEOHead>` in `renderToString()` |
| <img src="https://img.shields.io/badge/-Remix-000?style=flat-square&logo=remix" /> | **Remix / Astro / Solid** | Pure utility functions (no React needed) |

</div>

<br />

---

<br />

## Get Started

### 1. Install

```bash
npm install react-ssr-seo-toolkit
```

> **Requires:** `react >= 18.0.0` as a peer dependency. Zero other dependencies.

<br />

### 2. Project Structure

The key idea: **pages never write `<html>` or `<head>` tags** — that's handled by a Document component, just like in Next.js or any modern React framework.

```
my-app/
├── config/
│   └── seo.ts              ← site-wide SEO defaults
├── components/
│   └── Document.tsx         ← handles <html>, <head>, <SEOHead>, <body>
├── pages/
│   ├── HomePage.tsx         ← just content + SEO config (no <html> tags!)
│   ├── AboutPage.tsx
│   └── BlogPost.tsx
├── server.tsx               ← Express / SSR entry point
└── package.json
```

<br />

### 3. Create Site Config (once)

```tsx
// config/seo.ts
import { createSEOConfig } from "react-ssr-seo-toolkit";

export const siteConfig = createSEOConfig({
  titleTemplate: "%s | MySite",
  description: "Default site description for SEO.",
  openGraph: { siteName: "MySite", type: "website", locale: "en_US" },
  twitter: { card: "summary_large_image", site: "@mysite" },
});

export const SITE_URL = "https://mysite.com";
```

<br />

### 3.5. Create a Document Component

```tsx
// components/Document.tsx
import { SEOHead, JsonLd } from "react-ssr-seo-toolkit";
import type { SEOConfig } from "react-ssr-seo-toolkit";

interface DocumentProps {
  children: React.ReactNode;
  seo: SEOConfig;
  schemas?: Record<string, unknown>[];
}

export function Document({ children, seo, schemas }: DocumentProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <SEOHead {...seo} />
        {schemas?.map((schema, i) => <JsonLd key={i} data={schema} />)}
      </head>
      <body>
        <nav>{/* shared navigation */}</nav>
        <main>{children}</main>
        <footer>{/* shared footer */}</footer>
      </body>
    </html>
  );
}
```

<br />

### 4. Add to Any Page

```tsx
// pages/AboutPage.tsx
import { mergeSEOConfig, buildCanonicalUrl } from "react-ssr-seo-toolkit";
import { siteConfig, SITE_URL } from "../config/seo";
import { Document } from "../components/Document";

export function AboutPage() {
  const seo = mergeSEOConfig(siteConfig, {
    title: "About Us",
    description: "Learn about our company and mission.",
    canonical: buildCanonicalUrl(SITE_URL, "/about"),
  });

  return (
    <Document seo={seo}>
      <h1>About Us</h1>
      <p>Our story...</p>
    </Document>
  );
}
```

**That's it.** Keep reading for sitemap generation, SEO validation, OG images, and more.

<br />

---

<br />

## Real-World Examples

<br />

### Sitemap Generation

```ts
// scripts/generate-sitemap.ts
import { generateSitemap } from "react-ssr-seo-toolkit/sitemap";
import { writeFileSync } from "fs";

const sitemap = generateSitemap({
  baseUrl: "https://trustix.uk",
  routes: [
    { path: "/", priority: 1.0, changefreq: "daily" },
    { path: "/tickets", priority: 0.9, changefreq: "hourly" },
    { path: "/about", priority: 0.5, changefreq: "monthly" },
    "/blog",
    "/contact",
  ],
  exclude: ["/dashboard/*", "/admin/*", "/login"],
  defaultChangefreq: "weekly",
  defaultPriority: 0.7,
});

writeFileSync("public/sitemap.xml", sitemap);
```

**Output:**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://trustix.uk</loc>
    <lastmod>2026-05-08</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ...
</urlset>
```

> **Tip:** Call this in a build script or as an Express endpoint: `res.type("application/xml").send(sitemap)`.

<br />

---

<br />

### robots.txt Generation

```ts
import { generateRobots } from "react-ssr-seo-toolkit/sitemap";

const robots = generateRobots({
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
```

**Output:**

```
User-agent: *
Allow: /
Disallow: /dashboard
Disallow: /admin
Disallow: /login

User-agent: Googlebot
Allow: /
Crawl-delay: 2

Sitemap: https://trustix.uk/sitemap.xml
```

<br />

---

<br />

### Breadcrumb Auto-Generation from URL

```ts
import { autoBreadcrumb } from "react-ssr-seo-toolkit/sitemap";
import { createBreadcrumbSchema } from "react-ssr-seo-toolkit";

// /ticket/liverpool-vs-arsenal → breadcrumb items automatically
const items = autoBreadcrumb("/ticket/liverpool-vs-arsenal", {
  baseUrl: "https://trustix.uk",
  labels: { "/ticket": "Tickets" }, // optional custom label overrides
});

// Result:
// [
//   { name: "Home",                  url: "https://trustix.uk/" },
//   { name: "Tickets",               url: "https://trustix.uk/ticket" },
//   { name: "Liverpool Vs Arsenal",  url: "https://trustix.uk/ticket/liverpool-vs-arsenal" },
// ]

// Feed directly into schema:
const schema = createBreadcrumbSchema(items);
```

<br />

---

<br />

### SEO Validation (build-time warnings)

Catch missing tags before they reach production:

```ts
import { validateSEO, printValidationReport } from "react-ssr-seo-toolkit/validation";

const issues = validateSEO([
  {
    path: "/",
    name: "HomePage",
    seo: { title: "Trustix UK", description: "Buy tickets online." },
  },
  {
    path: "/tickets",
    name: "TicketListPage",
    seo: {
      title: "Tickets",
      description: "Browse all tickets.",
      canonical: "https://trustix.uk/tickets",
      twitter: { card: "summary_large_image" },
      // og:image missing — will warn
    },
  },
]);

console.log(printValidationReport(issues));
```

**Console output:**

```
HomePage:
  ❌ [canonical] Missing canonical URL
  ⚠️  [og:image] Missing og:image
  ⚠️  [twitter:card] Missing twitter:card
  ⚠️  [structured-data] No structured data (JSON-LD)

TicketListPage:
  ⚠️  [og:image] Missing og:image
  ⚠️  [structured-data] No structured data (JSON-LD)
```

<br />

---

<br />

### SEO Score per Page

```ts
import { getSEOScore, formatSEOScore } from "react-ssr-seo-toolkit/validation";

const result = getSEOScore(
  {
    title: "Liverpool vs Arsenal — Premier League Tickets",
    description: "Buy tickets for Liverpool vs Arsenal at Anfield.",
    canonical: "https://trustix.uk/tickets/liverpool-arsenal",
    openGraph: {
      images: [{ url: "https://trustix.uk/og/liverpool-arsenal.jpg" }],
    },
    twitter: { card: "summary_large_image" },
    jsonLd: { "@context": "https://schema.org", "@type": "Event" },
  },
  "TicketDetailPage"
);

console.log(formatSEOScore(result));
```

**Console output:**

```
🟢 SEO Score: TicketDetailPage  75/100 (75%)
  ✅ Title
  ✅ Description
  ✅ Canonical URL
  ✅ og:image
  ✅ og:title
  ✅ og:description
  ✅ Twitter Card
  ✅ Structured Data
  ❌ Robots Directives (-5) — No robots directives
  ❌ Hreflang (-5) — No hreflang alternates
```

<br />

---

<br />

### OG Image Generation (no external service)

Generate 1200×630 SVG images server-side — no Puppeteer, no Vercel Edge, no API keys:

```ts
import { createOGImageSVG } from "react-ssr-seo-toolkit/og";

// Default template — dark gradient background
const svg = createOGImageSVG({
  title: "How to Build an SSR App",
  description: "A complete guide to server-rendered React.",
  brand: "My Blog",
  accentColor: "#6366f1",
});

// Serve from an Express endpoint:
app.get("/og/default.svg", (req, res) => {
  res.type("image/svg+xml").send(
    createOGImageSVG({ title: req.query.title as string, brand: "My Blog" })
  );
});
```

**Article template** (light background with category tag):

```ts
const svg = createOGImageSVG({
  title: "Premier League Preview 2026",
  description: "Everything you need to know about the upcoming season.",
  template: "article",
  category: "Sports",
  author: "James Walker",
  dateString: "May 8, 2026",
  brand: "Trustix UK",
  accentColor: "#e63946",
});
```

**Sports event template** (VS layout):

```ts
const svg = createOGImageSVG({
  title: "Liverpool vs Arsenal",
  template: "sports-event",
  homeTeam: "Liverpool",
  awayTeam: "Arsenal",
  eventDate: "Saturday, May 15, 2026 · 17:30",
  brand: "Trustix UK",
  accentColor: "#ffd700",
});
```

> The SVG output can be used directly as `og:image` or converted to PNG with `sharp`:
> ```ts
> import sharp from "sharp";
> const png = await sharp(Buffer.from(svg)).png().toBuffer();
> ```

<br />

---

<br />

### Social Preview Component (dev mode)

See exactly how your page will look on Twitter, Facebook, LinkedIn, and Google — without leaving the browser:

```tsx
import { SEOPreview } from "react-ssr-seo-toolkit/components";

// Twitter card preview
<SEOPreview config={seoConfig} platform="twitter" />

// Facebook / Open Graph preview
<SEOPreview config={seoConfig} platform="facebook" />

// LinkedIn preview
<SEOPreview config={seoConfig} platform="linkedin" />

// Google search result preview
<SEOPreview config={seoConfig} platform="google" />
```

> **Tip:** Wrap in `{process.env.NODE_ENV === "development" && ...}` so it never ships to production.

<br />

---

<br />

### Blog / Article Page

```tsx
import {
  mergeSEOConfig, buildCanonicalUrl,
  createArticleSchema, createBreadcrumbSchema,
} from "react-ssr-seo-toolkit";
import { siteConfig, SITE_URL } from "../config/seo";
import { Document } from "../components/Document";

export function BlogPostPage() {
  const seo = mergeSEOConfig(siteConfig, {
    title: "How to Build an SSR App",
    description: "A complete guide to building server-rendered React apps with proper SEO.",
    canonical: buildCanonicalUrl(SITE_URL, "/blog/ssr-guide"),
    openGraph: {
      title: "How to Build an SSR App",
      type: "article",
      url: "https://myblog.com/blog/ssr-guide",
      images: [{ url: "https://myblog.com/images/ssr-guide.jpg", width: 1200, height: 630, alt: "SSR Guide" }],
    },
    twitter: { title: "How to Build an SSR App", creator: "@authorhandle", image: "https://myblog.com/images/ssr-guide.jpg" },
  });

  const article = createArticleSchema({
    headline: "How to Build an SSR App",
    url: "https://myblog.com/blog/ssr-guide",
    datePublished: "2025-06-15",
    dateModified: "2025-07-01",
    author: [{ name: "Jane Doe", url: "https://myblog.com/authors/jane" }],
    publisher: { name: "My Blog", logo: "https://myblog.com/logo.png" },
    images: ["https://myblog.com/images/ssr-guide.jpg"],
    section: "Technology",
    keywords: ["React", "SSR", "SEO"],
  });

  const breadcrumbs = createBreadcrumbSchema([
    { name: "Home", url: "https://myblog.com" },
    { name: "Blog", url: "https://myblog.com/blog" },
    { name: "How to Build an SSR App", url: "https://myblog.com/blog/ssr-guide" },
  ]);

  return (
    <Document seo={seo} schemas={[article, breadcrumbs]}>
      <article>
        <h1>How to Build an SSR App</h1>
      </article>
    </Document>
  );
}
```

<br />

---

<br />

### E-Commerce Product Page

```tsx
import { mergeSEOConfig, buildCanonicalUrl, createProductSchema } from "react-ssr-seo-toolkit";

function ProductPage() {
  const url = buildCanonicalUrl(SITE_URL, "/products/ergonomic-keyboard");

  const seo = mergeSEOConfig(siteConfig, {
    title: "Ergonomic Mechanical Keyboard",
    description: "Premium split keyboard with Cherry MX Brown switches.",
    canonical: url,
    openGraph: {
      type: "product",
      url,
      images: [{ url: "https://acmestore.com/images/keyboard.jpg", width: 800, height: 800, alt: "Keyboard" }],
    },
  });

  const schema = createProductSchema({
    name: "Ergonomic Mechanical Keyboard",
    url,
    price: 189.99,
    priceCurrency: "USD",
    availability: "InStock",
    brand: "Acme Peripherals",
    sku: "ACME-KB-001",
    images: ["https://acmestore.com/images/keyboard.jpg"],
    ratingValue: 4.7,
    reviewCount: 342,
  });

  return (
    <Document seo={seo} schemas={[schema]}>
      <h1>Ergonomic Mechanical Keyboard</h1>
    </Document>
  );
}
```

<br />

---

<br />

### Job Posting Schema

```tsx
import { createJobPostingSchema } from "react-ssr-seo-toolkit";

const schema = createJobPostingSchema({
  title: "Senior React Engineer",
  description: "Build and maintain our SSR platform...",
  datePosted: "2026-05-01",
  validThrough: "2026-06-30",
  employmentType: "FULL_TIME",
  hiringOrganization: {
    name: "Trustix UK",
    sameAs: "https://trustix.uk",
    logo: "https://trustix.uk/logo.png",
  },
  jobLocation: { addressLocality: "London", addressCountry: "GB" },
  remote: true,
  baseSalary: {
    currency: "GBP",
    value: { minValue: 70000, maxValue: 95000 },
    unitText: "YEAR",
  },
});
```

<br />

---

<br />

### Recipe Schema

```tsx
import { createRecipeSchema } from "react-ssr-seo-toolkit";

const schema = createRecipeSchema({
  name: "Chicken Biryani",
  description: "Authentic Dhaka-style biryani with aromatic spices.",
  images: ["https://food.com/biryani.jpg"],
  author: { name: "Chef Rahman" },
  prepTime: "PT30M",
  cookTime: "PT1H",
  totalTime: "PT1H30M",
  recipeYield: "6 servings",
  recipeCategory: "Main Course",
  recipeCuisine: "Bengali",
  recipeIngredient: ["1kg chicken", "500g basmati rice", "onions"],
  recipeInstructions: [
    { name: "Marinate", text: "Marinate chicken with spices for 30 minutes." },
    { name: "Cook Rice", text: "Parboil basmati rice until 70% done." },
  ],
  ratingValue: 4.9,
  reviewCount: 128,
});
```

<br />

---

<br />

### Person Schema

```tsx
import { createPersonSchema } from "react-ssr-seo-toolkit";

const schema = createPersonSchema({
  name: "Tonmoy Khan",
  url: "https://tonmoykhan.site",
  jobTitle: "Software Engineer",
  image: "https://tonmoykhan.site/photo.jpg",
  sameAs: [
    "https://github.com/Tonmoy01",
    "https://linkedin.com/in/tonmoy",
  ],
  worksFor: { name: "Trustix UK", url: "https://trustix.uk" },
});
```

<br />

---

<br />

### Event Page (Sports Match)

```tsx
import { createEventSchema } from "react-ssr-seo-toolkit";

// @type auto-switches to "SportsEvent" when sport/homeTeam/awayTeam is provided
const schema = createEventSchema({
  name: "El Clásico",
  startDate: "2026-04-20T21:00:00+02:00",
  sport: "Soccer",
  homeTeam: { name: "FC Barcelona", url: "https://fcbarcelona.com" },
  awayTeam: { name: "Real Madrid CF", url: "https://realmadrid.com" },
  location: {
    name: "Camp Nou",
    address: { addressLocality: "Barcelona", addressCountry: "ES" },
  },
  eventStatus: "EventScheduled",
  eventAttendanceMode: "OfflineEventAttendanceMode",
});
```

<br />

---

<br />

### Multi-Language (Hreflang)

```tsx
const seo = mergeSEOConfig(siteConfig, {
  title: "Products",
  canonical: "https://mysite.com/products",
  alternates: [
    { hreflang: "en",        href: "https://mysite.com/en/products" },
    { hreflang: "es",        href: "https://mysite.com/es/products" },
    { hreflang: "fr",        href: "https://mysite.com/fr/products" },
    { hreflang: "x-default", href: "https://mysite.com/products" },
  ],
});
```

<br />

---

<br />

### No-Index Pages

```tsx
import { mergeSEOConfig, noIndex, noIndexNoFollow } from "react-ssr-seo-toolkit";

const loginSeo = mergeSEOConfig(siteConfig, {
  title: "Login",
  robots: noIndex(),            // "noindex, follow"
});

const adminSeo = mergeSEOConfig(siteConfig, {
  title: "Admin Dashboard",
  robots: noIndexNoFollow(),    // "noindex, nofollow"
});
```

<br />

---

<br />

## Framework Integration

### Next.js App Router

```tsx
// app/blog/[slug]/page.tsx
import { toNextMetadata } from "react-ssr-seo-toolkit/adapters/nextjs";
import { createArticleSchema, safeJsonLdSerialize, buildCanonicalUrl } from "react-ssr-seo-toolkit";
import type { Metadata } from "next";

export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.slug);
  return toNextMetadata({
    title: post.title,
    titleTemplate: "%s | My Blog",
    description: post.excerpt,
    canonical: buildCanonicalUrl("https://myblog.com", `/blog/${params.slug}`),
    openGraph: {
      title: post.title,
      type: "article",
      images: [{ url: post.image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: { card: "summary_large_image" },
  });
}
```

<br />

### React Router 7

```tsx
// app/routes/about.tsx
import { toRouterMeta } from "react-ssr-seo-toolkit/adapters/react-router";
import { mergeSEOConfig, buildCanonicalUrl } from "react-ssr-seo-toolkit";
import { siteConfig, SITE_URL } from "../config/seo";
import type { Route } from "./+types/about";

export function meta({}: Route.MetaArgs) {
  return toRouterMeta(
    mergeSEOConfig(siteConfig, {
      title: "About Us",
      description: "Learn about our company.",
      canonical: buildCanonicalUrl(SITE_URL, "/about"),
      openGraph: { type: "website", title: "About Us" },
      twitter: { card: "summary_large_image" },
    })
  );
}

export default function AboutPage() {
  return <main><h1>About Us</h1></main>;
}
```

<br />

### Express + React SSR

```tsx
app.get("/sitemap.xml", (req, res) => {
  const { generateSitemap } = require("react-ssr-seo-toolkit/sitemap");
  res.type("application/xml").send(
    generateSitemap({ baseUrl: "https://mysite.com", routes: appRoutes, exclude: ["/admin/*"] })
  );
});

app.get("/robots.txt", (req, res) => {
  const { generateRobots } = require("react-ssr-seo-toolkit/sitemap");
  res.type("text/plain").send(
    generateRobots({ rules: { disallow: ["/admin"] }, sitemap: "https://mysite.com/sitemap.xml" })
  );
});

app.get("/og/:title.svg", (req, res) => {
  const { createOGImageSVG } = require("react-ssr-seo-toolkit/og");
  res.type("image/svg+xml").send(
    createOGImageSVG({ title: decodeURIComponent(req.params.title), brand: "MySite" })
  );
});
```

<br />

---

<br />

## API Reference

### Config Builders

| Function | What It Does |
|---|---|
| `createSEOConfig(config?)` | Create a normalized SEO config. Use for site-wide defaults. |
| `mergeSEOConfig(base, override)` | Deep-merge site config with page-level overrides. |
| `normalizeSEOConfig(config)` | Trim strings, normalize URLs, clean up a config object. |

<br />

### Metadata Helpers

| Function | Example | Result |
|---|---|---|
| `buildTitle(title, template)` | `buildTitle("About", "%s \| MySite")` | `"About \| MySite"` |
| `buildCanonicalUrl(base, path)` | `buildCanonicalUrl("https://x.com", "/about")` | `"https://x.com/about"` |
| `buildRobotsDirectives(config)` | `buildRobotsDirectives({ index: false })` | `"noindex, follow"` |
| `noIndex()` | — | `{ index: false, follow: true }` |
| `noIndexNoFollow()` | — | `{ index: false, follow: false }` |

<br />

### JSON-LD Schema Generators

All return `{ "@context": "https://schema.org", "@type": "...", ... }`.

| Function | Schema Type | Use Case |
|---|---|---|
| `createOrganizationSchema(input)` | Organization | Company info, logo, social links, contact |
| `createWebsiteSchema(input)` | WebSite | Site name, sitelinks searchbox |
| `createArticleSchema(input)` | Article | Blog posts, news articles |
| `createProductSchema(input)` | Product | E-commerce: price, brand, SKU, ratings |
| `createBreadcrumbSchema(items)` | BreadcrumbList | Navigation hierarchy |
| `createFAQSchema(items)` | FAQPage | Question + answer pairs |
| `createEventSchema(input)` | Event / SportsEvent | Concerts, conferences, sports — auto-switches to `SportsEvent` when `sport`/`homeTeam`/`awayTeam` is set |
| `createPersonSchema(input)` | Person | Author bios, team pages |
| `createRecipeSchema(input)` | Recipe | Food blogs, cooking sites |
| `createJobPostingSchema(input)` | JobPosting | Career pages, job boards |
| `composeSchemas(...schemas)` | @graph | Combine multiple schemas into one `<script>` |

<br />

### Sitemap & Robots — `react-ssr-seo-toolkit/sitemap`

| Function | What It Does |
|---|---|
| `generateSitemap(options)` | Generates a valid `sitemap.xml` string from a list of routes |
| `generateRobots(options)` | Generates a `robots.txt` string with user-agent rules and sitemap links |
| `autoBreadcrumb(path, options?)` | Auto-generates `BreadcrumbItem[]` from a URL path like `/ticket/liverpool-vs-arsenal` |

**`generateSitemap` options:**

| Option | Type | Description |
|---|---|---|
| `routes` | `string[] \| SitemapRoute[]` | Route paths or route objects with `lastmod`, `changefreq`, `priority` |
| `baseUrl` | `string` | Base URL (e.g. `"https://mysite.com"`) |
| `exclude` | `string[]` | Glob patterns to exclude (supports `*` wildcard and `/*` suffix) |
| `defaultChangefreq` | `ChangeFreq` | Default change frequency for all routes |
| `defaultPriority` | `number` | Default priority (0.0–1.0) for all routes |

<br />

### SEO Validation & Scoring — `react-ssr-seo-toolkit/validation`

| Function | What It Does |
|---|---|
| `validateSEO(routes)` | Checks a list of routes for missing/invalid SEO fields, returns `SEOValidationIssue[]` |
| `printValidationReport(issues)` | Formats issues into a human-readable string with icons |
| `getSEOScore(config, pageName?)` | Scores a single page's SEO config out of 100 |
| `formatSEOScore(result)` | Formats the score result as a pretty-printed string |

**Scoring breakdown (100 points total):**

| Check | Points |
|---|---|
| Title (≤60 chars) | 20 |
| Description (≤160 chars) | 15 |
| Canonical URL | 10 |
| og:image | 15 |
| og:title | 5 |
| og:description | 5 |
| Twitter Card | 10 |
| Structured Data (JSON-LD) | 10 |
| Robots Directives | 5 |
| Hreflang | 5 |

<br />

### OG Image Generation — `react-ssr-seo-toolkit/og`

| Function | What It Does |
|---|---|
| `createOGImageSVG(options)` | Returns a 1200×630 SVG string — serve as `image/svg+xml` or convert to PNG with `sharp` |

**Options:**

| Option | Type | Description |
|---|---|---|
| `title` | `string` | Main headline |
| `description` | `string?` | Subtitle / description |
| `template` | `"default" \| "article" \| "sports-event"` | Visual template |
| `brand` | `string?` | Brand name shown in corner |
| `backgroundColor` | `string?` | Override background color |
| `textColor` | `string?` | Override text color |
| `accentColor` | `string?` | Override accent / highlight color |
| `category` | `string?` | Category tag (article template) |
| `author` | `string?` | Author name (article template) |
| `dateString` | `string?` | Display date (article template) |
| `homeTeam` / `awayTeam` | `string?` | Team names (sports-event template) |
| `eventDate` | `string?` | Event date display (sports-event template) |

<br />

### React Components

#### `<SEOHead>`

Renders all SEO tags inside `<head>`. Accepts the full `SEOConfig` plus an optional `nonce` for CSP.

```tsx
<SEOHead
  title="My Page"
  titleTemplate="%s | MySite"
  description="Page description."
  canonical="https://mysite.com/page"
  robots={{ index: true, follow: true }}
  openGraph={{ type: "website", images: [{ url: "...", width: 1200, height: 630 }] }}
  twitter={{ card: "summary_large_image", site: "@mysite" }}
/>
```

#### `<JsonLd>`

Standalone JSON-LD `<script>` tag renderer.

```tsx
<JsonLd data={createProductSchema({ name: "Widget", url: "...", price: 29.99 })} />
```

#### `<SEOPreview>` — `react-ssr-seo-toolkit/components`

Renders a visual social card preview. Useful in dev mode or a CMS preview panel.

```tsx
<SEOPreview config={seoConfig} platform="twitter" />    // Twitter card
<SEOPreview config={seoConfig} platform="facebook" />   // Facebook / OG
<SEOPreview config={seoConfig} platform="linkedin" />   // LinkedIn post
<SEOPreview config={seoConfig} platform="google" />     // Google search result
```

| Prop | Type | Default |
|---|---|---|
| `config` | `SEOConfig` | required |
| `platform` | `"twitter" \| "facebook" \| "linkedin" \| "google"` | `"twitter"` |
| `style` | `React.CSSProperties` | — |

<br />

### Framework Adapters

#### `react-ssr-seo-toolkit/adapters/nextjs`

| Function | What It Does |
|---|---|
| `toNextMetadata(config)` | Converts `SEOConfig` → Next.js App Router `Metadata` object |
| `buildNextTitle(config)` | Returns the resolved title string |

#### `react-ssr-seo-toolkit/adapters/react-router`

| Function | What It Does |
|---|---|
| `toRouterMeta(config)` | Converts `SEOConfig` → `MetaDescriptor[]` for a route's `meta()` export |
| `toRouterLinks(config)` | Converts canonical + hreflang → `LinkDescriptor[]` for a route's `links()` export |

<br />

### Utilities

| Function | What It Does |
|---|---|
| `safeJsonLdSerialize(data)` | Serialize JSON-LD safely — escapes `<`, `>`, `&` to prevent XSS |
| `normalizeUrl(url)` | Trim whitespace, remove trailing slashes |
| `buildFullUrl(base, path?)` | Combine base URL with path |
| `omitEmpty(obj)` | Remove keys with `undefined`, `null`, or `""` values |
| `deepMerge(base, override)` | Deep-merge two objects (arrays replaced, not concatenated) |

<br />

### TypeScript Types

```tsx
import type {
  SEOConfig,
  OpenGraphConfig, OpenGraphImage, OpenGraphType,
  TwitterConfig, TwitterCardType,
  RobotsConfig,
  AlternateLink,
  JSONLDBase, BreadcrumbItem,
  OrganizationSchemaInput, WebsiteSchemaInput,
  ArticleSchemaInput, ProductSchemaInput,
  FAQItem,
  EventSchemaInput, EventStatus, EventAttendanceMode,
  PersonSchemaInput,
  RecipeSchemaInput, RecipeInstruction,
  JobPostingSchemaInput,
  // Sitemap
  SitemapRoute, GenerateSitemapOptions, ChangeFreq,
  RobotsRule, GenerateRobotsOptions,
  // Validation
  SEOValidationIssue, RouteWithSEO,
  SEOScoreResult, SEOScoreCheck,
  // OG Image
  OGImageOptions, OGImageTemplate,
  // Components
  SEOHeadProps, JsonLdProps, SEOPreviewProps,
} from "react-ssr-seo-toolkit";
```

<br />

---

<br />

## Entry Points

The package ships separate entry points so you only import what you need:

| Import | Contents |
|---|---|
| `react-ssr-seo-toolkit` | Everything — core, schema, utils, components |
| `react-ssr-seo-toolkit/schema` | Schema generators only (no React) |
| `react-ssr-seo-toolkit/sitemap` | `generateSitemap`, `generateRobots`, `autoBreadcrumb` |
| `react-ssr-seo-toolkit/validation` | `validateSEO`, `getSEOScore`, `formatSEOScore` |
| `react-ssr-seo-toolkit/og` | `createOGImageSVG` |
| `react-ssr-seo-toolkit/components` | React components — `SEOHead`, `JsonLd`, `SEOPreview` |
| `react-ssr-seo-toolkit/adapters/nextjs` | Next.js adapter |
| `react-ssr-seo-toolkit/adapters/react-router` | React Router 7 adapter |

<br />

---

<br />

## Live Demo

```bash
git clone https://github.com/Tonmoy01/react-ssr-seo-toolkit.git
cd react-ssr-seo-toolkit
npm install
npm run demo
```

Then visit [http://localhost:3000](http://localhost:3000).

<br />

---

<br />

## Development

```bash
npm install          # install dependencies
npm run build        # build the library
npm run dev          # watch mode (auto-rebuild)
npm test             # run tests
npm run lint         # type check
npm run demo         # run demo server
```

<br />

---

<br />

## Troubleshooting

### "Cannot find module 'react-ssr-seo-toolkit'"

Ensure the package is installed and your bundler supports the `exports` field in `package.json`.

### Hydration mismatch warnings

`<SEOHead>` produces deterministic output. Ensure the same config object is used on both server and client. Avoid using `Date.now()` or random values in your SEO config.

### JSON-LD not appearing in page source

Make sure `<JsonLd>` is inside `<head>` and rendered during SSR — not in a client-only `useEffect`.

<br />

---

<br />

## Contributing

1. Fork the repo
2. Create a feature branch — `git checkout -b feature/my-feature`
3. Make your changes with tests
4. Run `npm test && npm run lint`
5. Open a PR

<br />

---

<div align="center">

<br />

**MIT License** &bull; Made by [Tonmoy](https://github.com/Tonmoy01)

<br />

</div>
