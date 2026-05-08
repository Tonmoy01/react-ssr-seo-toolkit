import type {
  SEOConfig,
  SEOValidationIssue,
  RouteWithSEO,
  SEOScoreResult,
  SEOScoreCheck,
} from "../types/index.js";

// ─── Validate SEO ─────────────────────────────────────────────

export function validateSEO(routes: RouteWithSEO[]): SEOValidationIssue[] {
  const issues: SEOValidationIssue[] = [];

  for (const route of routes) {
    const page = route.name ?? route.path;
    const seo = route.seo ?? {};

    if (!seo.title) {
      issues.push({ page, field: "title", message: "Missing page title", severity: "error" });
    } else if (seo.title.length > 60) {
      issues.push({
        page,
        field: "title",
        message: `Title is ${seo.title.length} chars (recommended ≤60)`,
        severity: "warning",
      });
    }

    if (!seo.description) {
      issues.push({ page, field: "description", message: "Missing meta description", severity: "error" });
    } else if (seo.description.length > 160) {
      issues.push({
        page,
        field: "description",
        message: `Description is ${seo.description.length} chars (recommended ≤160)`,
        severity: "warning",
      });
    }

    if (!seo.canonical) {
      issues.push({ page, field: "canonical", message: "Missing canonical URL", severity: "warning" });
    }

    if (!seo.openGraph?.images?.length) {
      issues.push({ page, field: "og:image", message: "Missing og:image", severity: "warning" });
    }

    if (!seo.openGraph?.title && !seo.title) {
      issues.push({ page, field: "og:title", message: "Missing og:title", severity: "warning" });
    }

    if (!seo.twitter?.card) {
      issues.push({ page, field: "twitter:card", message: "Missing twitter:card", severity: "warning" });
    }

    if (!seo.jsonLd) {
      issues.push({
        page,
        field: "structured-data",
        message: "No structured data (JSON-LD)",
        severity: "warning",
      });
    }
  }

  return issues;
}

export function printValidationReport(issues: SEOValidationIssue[]): string {
  if (!issues.length) return "✅ All pages passed SEO validation.";

  const byPage = new Map<string, SEOValidationIssue[]>();
  for (const issue of issues) {
    const list = byPage.get(issue.page) ?? [];
    list.push(issue);
    byPage.set(issue.page, list);
  }

  const lines: string[] = [];
  for (const [page, pageIssues] of byPage) {
    lines.push(`\n${page}:`);
    for (const issue of pageIssues) {
      const icon = issue.severity === "error" ? "❌" : "⚠️ ";
      lines.push(`  ${icon} [${issue.field}] ${issue.message}`);
    }
  }
  return lines.join("\n").trim();
}

// ─── SEO Score ────────────────────────────────────────────────

const SCORE_CHECKS: Array<{
  name: string;
  field: string;
  maxPoints: number;
  check: (config: SEOConfig) => { passed: boolean; points: number; message?: string };
}> = [
  {
    name: "Title",
    field: "title",
    maxPoints: 20,
    check: (c) => {
      if (!c.title) return { passed: false, points: 0, message: "Missing title" };
      if (c.title.length > 60)
        return { passed: true, points: 10, message: `Too long (${c.title.length}/60 chars)` };
      return { passed: true, points: 20 };
    },
  },
  {
    name: "Description",
    field: "description",
    maxPoints: 15,
    check: (c) => {
      if (!c.description) return { passed: false, points: 0, message: "Missing description" };
      if (c.description.length > 160)
        return { passed: true, points: 8, message: `Too long (${c.description.length}/160 chars)` };
      return { passed: true, points: 15 };
    },
  },
  {
    name: "Canonical URL",
    field: "canonical",
    maxPoints: 10,
    check: (c) =>
      c.canonical
        ? { passed: true, points: 10 }
        : { passed: false, points: 0, message: "Missing canonical URL" },
  },
  {
    name: "og:image",
    field: "og:image",
    maxPoints: 15,
    check: (c) =>
      c.openGraph?.images?.length
        ? { passed: true, points: 15 }
        : { passed: false, points: 0, message: "Missing og:image" },
  },
  {
    name: "og:title",
    field: "og:title",
    maxPoints: 5,
    check: (c) =>
      c.openGraph?.title || c.title
        ? { passed: true, points: 5 }
        : { passed: false, points: 0, message: "Missing og:title" },
  },
  {
    name: "og:description",
    field: "og:description",
    maxPoints: 5,
    check: (c) =>
      c.openGraph?.description || c.description
        ? { passed: true, points: 5 }
        : { passed: false, points: 0, message: "Missing og:description" },
  },
  {
    name: "Twitter Card",
    field: "twitter:card",
    maxPoints: 10,
    check: (c) =>
      c.twitter?.card
        ? { passed: true, points: 10 }
        : { passed: false, points: 0, message: "Missing twitter:card" },
  },
  {
    name: "Structured Data",
    field: "structured-data",
    maxPoints: 10,
    check: (c) =>
      c.jsonLd
        ? { passed: true, points: 10 }
        : { passed: false, points: 0, message: "No JSON-LD structured data" },
  },
  {
    name: "Robots Directives",
    field: "robots",
    maxPoints: 5,
    check: (c) =>
      c.robots !== undefined
        ? { passed: true, points: 5 }
        : { passed: false, points: 0, message: "No robots directives" },
  },
  {
    name: "Hreflang",
    field: "hreflang",
    maxPoints: 5,
    check: (c) =>
      c.alternates?.length
        ? { passed: true, points: 5 }
        : { passed: false, points: 0, message: "No hreflang alternates" },
  },
];

export function getSEOScore(config: SEOConfig, pageName = "Page"): SEOScoreResult {
  let score = 0;
  const maxScore = SCORE_CHECKS.reduce((sum, c) => sum + c.maxPoints, 0);
  const checks: SEOScoreCheck[] = [];

  for (const def of SCORE_CHECKS) {
    const result = def.check(config);
    score += result.points;
    checks.push({
      name: def.name,
      passed: result.passed,
      points: result.points,
      maxPoints: def.maxPoints,
      message: result.message,
    });
  }

  return {
    page: pageName,
    score,
    maxScore,
    percentage: Math.round((score / maxScore) * 100),
    checks,
  };
}

export function formatSEOScore(result: SEOScoreResult): string {
  const bar = result.percentage >= 80 ? "🟢" : result.percentage >= 50 ? "🟡" : "🔴";
  const lines = [
    `${bar} SEO Score: ${result.page}  ${result.score}/${result.maxScore} (${result.percentage}%)`,
  ];

  for (const check of result.checks) {
    const icon = check.passed ? "✅" : "❌";
    const detail = check.message ? ` — ${check.message}` : "";
    const pts = !check.passed ? ` (-${check.maxPoints})` : "";
    lines.push(`  ${icon} ${check.name}${pts}${detail}`);
  }

  return lines.join("\n");
}
