import React from "react";
import { mergeSEOConfig, buildCanonicalUrl } from "../../../src/index.js";
import {
  validateSEO,
  printValidationReport,
  getSEOScore,
  formatSEOScore,
} from "../../../src/validation/index.js";
import { siteConfig, SITE_URL } from "../config/seo.js";

// ── Sample routes to validate ──────────────────────────────────
const sampleRoutes = [
  {
    path: "/",
    name: "HomePage",
    seo: {
      title: "Trustix UK — Buy Event Tickets Online",
      description: "Find and buy tickets for football, concerts, theatre, and more.",
      openGraph: {
        images: [{ url: "https://trustix.uk/og/home.jpg" }],
      },
      twitter: { card: "summary_large_image" as const },
      // canonical missing
    },
  },
  {
    path: "/tickets",
    name: "TicketListPage",
    seo: {
      title: "Browse Tickets",
      description: "Browse all available tickets.",
      canonical: "https://trustix.uk/tickets",
      twitter: { card: "summary_large_image" as const },
      // og:image missing
      // structured-data missing
    },
  },
  {
    path: "/tickets/liverpool-vs-arsenal",
    name: "TicketDetailPage",
    seo: {
      title: "Liverpool vs Arsenal — Premier League Tickets",
      description: "Buy tickets for Liverpool vs Arsenal at Anfield, Saturday May 15.",
      canonical: "https://trustix.uk/tickets/liverpool-vs-arsenal",
      openGraph: {
        images: [{ url: "https://trustix.uk/og/liverpool-arsenal.jpg" }],
        title: "Liverpool vs Arsenal",
      },
      twitter: { card: "summary_large_image" as const },
      jsonLd: { "@context": "https://schema.org", "@type": "SportsEvent" },
      robots: { index: true, follow: true },
    },
  },
];

const issues = validateSEO(sampleRoutes);
const report = printValidationReport(issues);

// Score for a well-configured page
const goodScore = getSEOScore(
  {
    title: "Liverpool vs Arsenal — Premier League Tickets",
    description: "Buy tickets for Liverpool vs Arsenal at Anfield, Saturday May 15.",
    canonical: "https://trustix.uk/tickets/liverpool-vs-arsenal",
    openGraph: {
      images: [{ url: "https://trustix.uk/og/liverpool-arsenal.jpg" }],
      title: "Liverpool vs Arsenal",
    },
    twitter: { card: "summary_large_image" },
    jsonLd: { "@context": "https://schema.org", "@type": "SportsEvent" },
    robots: { index: true, follow: true },
  },
  "TicketDetailPage"
);

// Score for a sparse page
const poorScore = getSEOScore(
  {
    title: "Browse Tickets",
    description: "Browse all available tickets.",
  },
  "TicketListPage"
);

export function meta() {
  return mergeSEOConfig(siteConfig, {
    title: "SEO Validation & Scoring Demo",
    description:
      "Catch missing SEO fields at build time. Score each page out of 100 and identify exactly what's missing.",
    canonical: buildCanonicalUrl(SITE_URL, "/validation"),
    openGraph: {
      title: "SEO Validation & Scoring",
      description: "Build-time SEO validation and per-page scoring.",
      type: "website",
      url: `${SITE_URL}/validation`,
    },
  });
}

export const handle = { activeRoute: "/validation" };

function IssueRow({ page, field, message, severity }: {
  page: string; field: string; message: string; severity: "error" | "warning";
}) {
  const icon = severity === "error" ? "❌" : "⚠️";
  const color = severity === "error" ? "#dc2626" : "#d97706";
  return (
    <tr>
      <td style={{ color: "#64748b", fontSize: "0.85rem" }}>{page}</td>
      <td>
        <code style={{ fontSize: "0.82rem" }}>{field}</code>
      </td>
      <td>{message}</td>
      <td>
        <span style={{ color, fontSize: "0.9rem" }}>{icon} {severity}</span>
      </td>
    </tr>
  );
}

function ScoreBar({ percentage }: { percentage: number }) {
  const color = percentage >= 80 ? "#16a34a" : percentage >= 50 ? "#d97706" : "#dc2626";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
      <div
        style={{
          flex: 1,
          height: 10,
          background: "#e2e8f0",
          borderRadius: 5,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            background: color,
            borderRadius: 5,
            transition: "width 0.3s",
          }}
        />
      </div>
      <span style={{ fontWeight: 700, color, minWidth: 48 }}>{percentage}%</span>
    </div>
  );
}

function ScoreCard({ result }: { result: ReturnType<typeof getSEOScore> }) {
  const emoji = result.percentage >= 80 ? "🟢" : result.percentage >= 50 ? "🟡" : "🔴";
  return (
    <div className="card card-elevated" style={{ marginBottom: "1rem" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "0.75rem",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "1rem" }}>
          {emoji} {result.page}
        </h3>
        <span style={{ fontWeight: 700, fontSize: "1.1rem" }}>
          {result.score}/{result.maxScore}
        </span>
      </div>
      <ScoreBar percentage={result.percentage} />
      <div style={{ marginTop: "1rem", display: "flex", flexDirection: "column", gap: "0.35rem" }}>
        {result.checks.map((check) => (
          <div
            key={check.name}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: "0.875rem",
              padding: "0.25rem 0",
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            <span>
              {check.passed ? "✅" : "❌"} {check.name}
            </span>
            <span style={{ color: check.passed ? "#16a34a" : "#dc2626", fontWeight: 600 }}>
              {check.passed
                ? `+${check.points}`
                : check.message
                ? `−${check.maxPoints} (${check.message})`
                : `−${check.maxPoints}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ValidationPage() {
  return (
    <>
      <div className="page-header">
        <h1>SEO Validation &amp; Scoring</h1>
        <p>
          Catch missing tags at build time. Score each page out of 100 so you know exactly what
          to fix before going live.
        </p>
        <div className="page-tags" style={{ marginTop: "0.75rem" }}>
          <span className="tag">validateSEO</span>
          <span className="tag">getSEOScore</span>
          <span className="tag">printValidationReport</span>
          <span className="tag">formatSEOScore</span>
        </div>
      </div>

      <div className="narrow-container" style={{ paddingBottom: "4rem" }}>

        {/* ── Validation Report ──────────────────────────────── */}
        <div className="demo-section">
          <h2 className="section-title" style={{ fontSize: "1.35rem" }}>
            validateSEO — Find Missing Tags
          </h2>
          <p className="section-subtitle">
            Pass an array of routes with their SEO configs. The library checks each page for
            missing or invalid fields and returns structured issues.
          </p>

          <div className="card card-elevated" style={{ overflowX: "auto" }}>
            <table className="api-table">
              <thead>
                <tr>
                  <th>Page</th>
                  <th>Field</th>
                  <th>Message</th>
                  <th>Severity</th>
                </tr>
              </thead>
              <tbody>
                {issues.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center", color: "#16a34a" }}>
                      ✅ All pages passed validation
                    </td>
                  </tr>
                ) : (
                  issues.map((issue, i) => <IssueRow key={i} {...issue} />)
                )}
              </tbody>
            </table>
          </div>

          <div className="code-block" style={{ marginTop: "1rem" }}>
            <div className="code-header">
              <span className="code-header-title">Console output — printValidationReport(issues)</span>
              <span className="code-header-lang">Terminal</span>
            </div>
            <pre style={{ whiteSpace: "pre-wrap", fontSize: "0.82rem" }}>{report}</pre>
          </div>

          <div className="code-block" style={{ marginTop: "1rem" }}>
            <div className="code-header">
              <span className="code-header-title">build/validate.ts — run at build time</span>
              <span className="code-header-lang">TypeScript</span>
            </div>
            <pre>{`import {
  validateSEO,
  printValidationReport,
} from "react-ssr-seo-toolkit/validation";
import { appRoutes } from "./routes";

const issues = validateSEO(appRoutes);

if (issues.some((i) => i.severity === "error")) {
  console.error(printValidationReport(issues));
  process.exit(1); // fail the build
} else if (issues.length > 0) {
  console.warn(printValidationReport(issues));
}`}</pre>
          </div>
        </div>

        {/* ── SEO Score ─────────────────────────────────────── */}
        <div className="demo-section">
          <h2 className="section-title" style={{ fontSize: "1.35rem" }}>
            getSEOScore — 100-Point Audit per Page
          </h2>
          <p className="section-subtitle">
            Scores a single page's SEO config across 10 checks. Useful for identifying the
            highest-impact missing fields.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div>
              <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "0.5rem", fontWeight: 600 }}>
                ✅ Well-configured page
              </p>
              <ScoreCard result={goodScore} />
            </div>
            <div>
              <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: "0.5rem", fontWeight: 600 }}>
                ❌ Sparse page (needs work)
              </p>
              <ScoreCard result={poorScore} />
            </div>
          </div>

          <div className="code-block" style={{ marginTop: "1.5rem" }}>
            <div className="code-header">
              <span className="code-header-title">Console output — formatSEOScore(result)</span>
              <span className="code-header-lang">Terminal</span>
            </div>
            <pre style={{ fontSize: "0.82rem" }}>{formatSEOScore(goodScore)}</pre>
          </div>

          <div className="code-block" style={{ marginTop: "1rem" }}>
            <div className="code-header">
              <span className="code-header-title">getSEOScore usage</span>
              <span className="code-header-lang">TypeScript</span>
            </div>
            <pre>{`import {
  getSEOScore,
  formatSEOScore,
} from "react-ssr-seo-toolkit/validation";

const result = getSEOScore(seoConfig, "TicketDetailPage");

console.log(formatSEOScore(result));
// 🟢 SEO Score: TicketDetailPage  75/100 (75%)
//   ✅ Title
//   ✅ Description
//   ✅ Canonical URL
//   ✅ og:image
//   ✅ og:title
//   ✅ og:description
//   ✅ Twitter Card
//   ✅ Structured Data
//   ❌ Robots Directives (-5) — No robots directives
//   ❌ Hreflang (-5) — No hreflang alternates`}</pre>
          </div>
        </div>

        {/* ── Scoring breakdown ─────────────────────────────── */}
        <div className="demo-section">
          <h2 className="section-title" style={{ fontSize: "1.35rem" }}>
            Scoring Breakdown (100 points)
          </h2>
          <div className="card card-elevated" style={{ overflowX: "auto" }}>
            <table className="api-table">
              <thead>
                <tr>
                  <th>Check</th>
                  <th>Points</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                <tr><td>Title</td><td>20</td><td>Full points if ≤60 chars, 10 if longer</td></tr>
                <tr><td>Description</td><td>15</td><td>Full points if ≤160 chars, 8 if longer</td></tr>
                <tr><td>Canonical URL</td><td>10</td><td>Must be set</td></tr>
                <tr><td>og:image</td><td>15</td><td>At least one image in openGraph.images</td></tr>
                <tr><td>og:title</td><td>5</td><td>openGraph.title or title fallback</td></tr>
                <tr><td>og:description</td><td>5</td><td>openGraph.description or description fallback</td></tr>
                <tr><td>Twitter Card</td><td>10</td><td>twitter.card must be set</td></tr>
                <tr><td>Structured Data</td><td>10</td><td>jsonLd must be set</td></tr>
                <tr><td>Robots Directives</td><td>5</td><td>robots config must be set</td></tr>
                <tr><td>Hreflang</td><td>5</td><td>alternates array must have entries</td></tr>
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
              <h3>Build-time Validation</h3>
              <p>
                Run <code>validateSEO(routes)</code> in your build script. Fail the build on
                errors, warn on missing optional fields.
              </p>
            </div>
            <div className="card">
              <h3>Per-page Scoring</h3>
              <p>
                <code>getSEOScore(config, name)</code> audits any SEO config against 10 weighted
                checks and returns a 0–100 score.
              </p>
            </div>
            <div className="card">
              <h3>Readable Reports</h3>
              <p>
                <code>printValidationReport()</code> and <code>formatSEOScore()</code> format
                results for terminal output with icons and color hints.
              </p>
            </div>
            <div className="card">
              <h3>Typed Results</h3>
              <p>
                <code>SEOValidationIssue[]</code> and <code>SEOScoreResult</code> are fully typed
                — integrate with your CI pipeline or CMS.
              </p>
            </div>
          </div>
        </div>

        <div className="callout callout-warning">
          <div className="callout-icon">TIP</div>
          <div className="callout-content">
            <p>
              Add <code>validateSEO(routes)</code> to your <strong>pre-build script</strong> and
              pipe the output to your CI logs. Pages with <code>error</code> severity should
              block deploys — pages with <code>warning</code> severity can be treated as
              tech debt.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
