import type {
  BreadcrumbItem,
  GenerateSitemapOptions,
  GenerateRobotsOptions,
  SitemapRoute,
} from "../types/index.js";

// ─── Sitemap ──────────────────────────────────────────────────

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function matchesExclude(path: string, pattern: string): boolean {
  if (pattern.endsWith("/*")) {
    return path.startsWith(pattern.slice(0, -2) + "/") || path === pattern.slice(0, -2);
  }
  if (pattern.endsWith("*")) {
    return path.startsWith(pattern.slice(0, -1));
  }
  if (pattern.startsWith("*")) {
    return path.endsWith(pattern.slice(1));
  }
  return path === pattern;
}

export function generateSitemap(options: GenerateSitemapOptions): string {
  const { routes, baseUrl, exclude = [], defaultChangefreq, defaultPriority } = options;
  const normalizedBase = baseUrl.replace(/\/+$/, "");

  const normalized: SitemapRoute[] = routes.map((r) =>
    typeof r === "string" ? { path: r } : r
  );

  const filtered = normalized.filter(
    (route) => !exclude.some((pattern) => matchesExclude(route.path, pattern))
  );

  const urlEntries = filtered.map((route) => {
    const loc = route.path === "/" ? normalizedBase : `${normalizedBase}${route.path}`;
    const lines: string[] = [
      `  <url>`,
      `    <loc>${escapeXml(loc)}</loc>`,
      `    <lastmod>${route.lastmod ?? new Date().toISOString().split("T")[0]}</lastmod>`,
    ];

    const changefreq = route.changefreq ?? defaultChangefreq;
    if (changefreq) lines.push(`    <changefreq>${changefreq}</changefreq>`);

    const priority = route.priority ?? defaultPriority;
    if (priority !== undefined) lines.push(`    <priority>${priority.toFixed(1)}</priority>`);

    lines.push(`  </url>`);
    return lines.join("\n");
  });

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urlEntries,
    `</urlset>`,
  ].join("\n");
}

// ─── Robots.txt ───────────────────────────────────────────────

export function generateRobots(options: GenerateRobotsOptions): string {
  const { rules = [], sitemap } = options;
  const normalizedRules = Array.isArray(rules) ? rules : [rules];
  const lines: string[] = [];

  for (const rule of normalizedRules) {
    const agents = rule.userAgent
      ? Array.isArray(rule.userAgent)
        ? rule.userAgent
        : [rule.userAgent]
      : ["*"];

    for (const agent of agents) {
      lines.push(`User-agent: ${agent}`);
    }

    const allows = rule.allow
      ? Array.isArray(rule.allow)
        ? rule.allow
        : [rule.allow]
      : [];
    for (const path of allows) lines.push(`Allow: ${path}`);

    const disallows = rule.disallow
      ? Array.isArray(rule.disallow)
        ? rule.disallow
        : [rule.disallow]
      : [];
    for (const path of disallows) lines.push(`Disallow: ${path}`);

    if (rule.crawlDelay !== undefined) lines.push(`Crawl-delay: ${rule.crawlDelay}`);

    lines.push("");
  }

  const sitemaps = sitemap
    ? Array.isArray(sitemap)
      ? sitemap
      : [sitemap]
    : [];
  for (const sm of sitemaps) lines.push(`Sitemap: ${sm}`);

  return lines.join("\n").trim();
}

// ─── Auto Breadcrumb ──────────────────────────────────────────

export interface AutoBreadcrumbOptions {
  baseUrl?: string;
  labels?: Record<string, string>;
  formatLabel?: (segment: string) => string;
}

function defaultFormatLabel(segment: string): string {
  return segment
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function autoBreadcrumb(
  currentPath: string,
  options: AutoBreadcrumbOptions = {}
): BreadcrumbItem[] {
  const { baseUrl = "", labels = {}, formatLabel = defaultFormatLabel } = options;

  const segments = currentPath.split("/").filter(Boolean);
  const items: BreadcrumbItem[] = [
    { name: labels[""] ?? labels["/"] ?? "Home", url: `${baseUrl}/` },
  ];

  let accPath = "";
  for (const segment of segments) {
    accPath += `/${segment}`;
    const name = labels[accPath] ?? labels[segment] ?? formatLabel(segment);
    items.push({ name, url: `${baseUrl}${accPath}` });
  }

  return items;
}
