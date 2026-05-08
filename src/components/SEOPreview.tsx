import React from "react";
import type { SEOConfig } from "../types/index.js";

export interface SEOPreviewProps {
  config: SEOConfig;
  platform?: "twitter" | "facebook" | "linkedin" | "google";
  className?: string;
  style?: React.CSSProperties;
}

function extractDomain(url?: string): string {
  if (!url) return "example.com";
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\/(www\.)?/, "").split("/")[0];
  }
}

function truncate(str: string | undefined, max: number): string {
  if (!str) return "";
  return str.length > max ? `${str.slice(0, max - 1)}…` : str;
}

const BASE: React.CSSProperties = {
  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  boxSizing: "border-box",
  userSelect: "none",
};

function ImagePlaceholder({
  src,
  height,
  bg = "#e4e6ea",
}: {
  src?: string;
  height: number;
  bg?: string;
}): React.ReactElement {
  const style: React.CSSProperties = {
    width: "100%",
    height,
    background: bg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    flexShrink: 0,
  };
  if (src) {
    return React.createElement(
      "div",
      { style },
      React.createElement("img", {
        src,
        alt: "",
        style: { width: "100%", height: "100%", objectFit: "cover" },
      })
    );
  }
  return React.createElement(
    "div",
    { style },
    React.createElement(
      "span",
      { style: { color: "#bcc0c9", fontSize: 13 } },
      "No image"
    )
  );
}

function TwitterCard({
  config,
  style,
}: {
  config: SEOConfig;
  style?: React.CSSProperties;
}): React.ReactElement {
  const title = truncate(config.openGraph?.title ?? config.title, 70);
  const description = truncate(
    config.openGraph?.description ?? config.description,
    125
  );
  const image = config.openGraph?.images?.[0]?.url ?? config.twitter?.image;
  const domain = extractDomain(config.canonical ?? config.openGraph?.url);
  const isLarge = config.twitter?.card !== "summary";

  const card: React.CSSProperties = {
    ...BASE,
    border: "1px solid #cfd9de",
    borderRadius: 16,
    overflow: "hidden",
    maxWidth: 550,
    background: "#fff",
    ...style,
  };

  const meta: React.CSSProperties = {
    padding: "12px 14px",
  };

  const domainStyle: React.CSSProperties = {
    fontSize: 13,
    color: "#536471",
    marginBottom: 4,
  };

  const titleStyle: React.CSSProperties = {
    fontSize: 15,
    fontWeight: 700,
    color: "#0f1419",
    lineHeight: 1.3,
    marginBottom: 4,
  };

  const descStyle: React.CSSProperties = {
    fontSize: 15,
    color: "#536471",
    lineHeight: 1.4,
  };

  if (!isLarge) {
    return React.createElement(
      "div",
      { style: { ...card, display: "flex", alignItems: "center" } },
      React.createElement(ImagePlaceholder, {
        src: image,
        height: 110,
        bg: "#e7e9ea",
      }),
      React.createElement(
        "div",
        { style: { ...meta, flex: 1 } },
        React.createElement("div", { style: domainStyle }, domain),
        React.createElement("div", { style: titleStyle }, title),
        React.createElement("div", { style: descStyle }, description)
      )
    );
  }

  return React.createElement(
    "div",
    { style: card },
    React.createElement(ImagePlaceholder, { src: image, height: 275, bg: "#e7e9ea" }),
    React.createElement(
      "div",
      { style: meta },
      React.createElement("div", { style: domainStyle }, domain),
      React.createElement("div", { style: titleStyle }, title),
      React.createElement("div", { style: descStyle }, description)
    )
  );
}

function FacebookCard({
  config,
  style,
}: {
  config: SEOConfig;
  style?: React.CSSProperties;
}): React.ReactElement {
  const title = truncate(config.openGraph?.title ?? config.title, 88);
  const description = truncate(
    config.openGraph?.description ?? config.description,
    110
  );
  const image = config.openGraph?.images?.[0]?.url;
  const domain = extractDomain(config.canonical ?? config.openGraph?.url);

  const card: React.CSSProperties = {
    ...BASE,
    border: "1px solid #dddfe2",
    maxWidth: 527,
    background: "#fff",
    ...style,
  };

  return React.createElement(
    "div",
    { style: card },
    React.createElement(ImagePlaceholder, { src: image, height: 275 }),
    React.createElement(
      "div",
      { style: { background: "#f0f2f5", padding: "10px 12px" } },
      React.createElement(
        "div",
        {
          style: {
            color: "#606770",
            fontSize: 11,
            textTransform: "uppercase" as const,
            marginBottom: 4,
            letterSpacing: "0.5px",
          },
        },
        domain
      ),
      React.createElement(
        "div",
        {
          style: {
            fontWeight: 600,
            fontSize: 14,
            color: "#1c2b33",
            lineHeight: 1.3,
            marginBottom: 2,
          },
        },
        title
      ),
      React.createElement(
        "div",
        { style: { color: "#606770", fontSize: 14, lineHeight: 1.4 } },
        description
      )
    )
  );
}

function LinkedInCard({
  config,
  style,
}: {
  config: SEOConfig;
  style?: React.CSSProperties;
}): React.ReactElement {
  const title = truncate(config.openGraph?.title ?? config.title, 120);
  const image = config.openGraph?.images?.[0]?.url;
  const domain = extractDomain(config.canonical ?? config.openGraph?.url);

  const card: React.CSSProperties = {
    ...BASE,
    border: "1px solid #e0e0e0",
    borderRadius: 2,
    maxWidth: 552,
    background: "#fff",
    ...style,
  };

  return React.createElement(
    "div",
    { style: card },
    React.createElement(ImagePlaceholder, { src: image, height: 288, bg: "#dce6f1" }),
    React.createElement(
      "div",
      { style: { padding: "8px 12px 12px" } },
      React.createElement(
        "div",
        {
          style: {
            fontSize: 14,
            fontWeight: 600,
            color: "rgba(0,0,0,0.9)",
            lineHeight: 1.4,
            marginBottom: 4,
          },
        },
        title
      ),
      React.createElement(
        "div",
        { style: { fontSize: 12, color: "rgba(0,0,0,0.6)" } },
        domain
      )
    )
  );
}

function GoogleCard({
  config,
  style,
}: {
  config: SEOConfig;
  style?: React.CSSProperties;
}): React.ReactElement {
  const title = truncate(config.openGraph?.title ?? config.title, 60);
  const description = truncate(
    config.openGraph?.description ?? config.description,
    160
  );
  const siteName = config.openGraph?.siteName ?? extractDomain(config.canonical);
  const canonical = config.canonical ?? config.openGraph?.url ?? "https://example.com";

  return React.createElement(
    "div",
    {
      style: {
        ...BASE,
        fontFamily: "arial,sans-serif",
        maxWidth: 600,
        padding: 4,
        ...style,
      },
    },
    React.createElement(
      "div",
      { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 4 } },
      React.createElement(
        "div",
        {
          style: {
            width: 26,
            height: 26,
            borderRadius: "50%",
            background: "#e8eaed",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            color: "#444",
            fontWeight: 600,
          },
        },
        siteName[0].toUpperCase()
      ),
      React.createElement(
        "div",
        null,
        React.createElement(
          "div",
          { style: { fontSize: 14, color: "#202124", lineHeight: 1.3 } },
          siteName
        ),
        React.createElement(
          "div",
          { style: { fontSize: 12, color: "#4d5156", lineHeight: 1.3 } },
          truncate(canonical, 60)
        )
      )
    ),
    React.createElement(
      "div",
      {
        style: {
          fontSize: 20,
          color: "#1a0dab",
          lineHeight: 1.3,
          marginBottom: 4,
          cursor: "pointer",
        },
      },
      title
    ),
    React.createElement(
      "div",
      { style: { fontSize: 14, color: "#4d5156", lineHeight: 1.5 } },
      description
    )
  );
}

export function SEOPreview({
  config,
  platform = "twitter",
  style,
}: SEOPreviewProps): React.ReactElement {
  switch (platform) {
    case "facebook":
      return React.createElement(FacebookCard, { config, style });
    case "linkedin":
      return React.createElement(LinkedInCard, { config, style });
    case "google":
      return React.createElement(GoogleCard, { config, style });
    default:
      return React.createElement(TwitterCard, { config, style });
  }
}
