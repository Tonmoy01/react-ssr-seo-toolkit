import type { OGImageOptions } from "../types/index.js";

const W = 1200;
const H = 630;
const FONT = "system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function wrapText(text: string, maxChars: number, maxLines: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    if (lines.length >= maxLines) break;
    const test = line ? `${line} ${word}` : word;
    if (test.length > maxChars && line) {
      if (lines.length === maxLines - 1) {
        lines.push(`${line.slice(0, maxChars - 1)}…`);
        line = "";
        break;
      }
      lines.push(line);
      line = word;
    } else if (!line && test.length > maxChars) {
      lines.push(`${test.slice(0, maxChars - 1)}…`);
    } else {
      line = test;
    }
  }
  if (line && lines.length < maxLines) lines.push(line);
  return lines;
}

function multilineText(
  lines: string[],
  x: number,
  y: number,
  fontSize: number,
  fill: string,
  fontWeight = "400",
  textAnchor = "start"
): string {
  if (!lines.length) return "";
  const lh = Math.round(fontSize * 1.35);
  const tspans = lines
    .map((l, i) => `<tspan x="${x}" dy="${i === 0 ? 0 : lh}">${esc(l)}</tspan>`)
    .join("");
  return `<text x="${x}" y="${y}" font-family="${FONT}" font-size="${fontSize}" font-weight="${fontWeight}" fill="${fill}" text-anchor="${textAnchor}">${tspans}</text>`;
}

// ─── Default template ─────────────────────────────────────────

function createDefaultSVG(options: OGImageOptions): string {
  const {
    title,
    description,
    brand,
    textColor = "#ffffff",
    accentColor = "#6366f1",
  } = options;

  const bg1 = options.backgroundColor ?? "#0f0c29";
  const bg2 = options.backgroundColor ?? "#24243e";

  const titleLines = wrapText(title, 24, 2);
  const descLines = description ? wrapText(description, 55, 2) : [];

  const titleSize = 68;
  const descSize = 34;
  const titleLH = Math.round(titleSize * 1.35);
  const descLH = Math.round(descSize * 1.4);
  const gap = 28;

  const totalH =
    titleLines.length * titleLH +
    (descLines.length ? gap + descLines.length * descLH : 0);

  const startY = Math.round((H - totalH) / 2) + titleSize;
  const descY = startY + titleLines.length * titleLH + gap;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="${W}" y2="${H}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${bg1}"/>
      <stop offset="100%" stop-color="${bg2}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect x="0" y="0" width="8" height="${H}" fill="${accentColor}"/>
  <rect x="80" y="${startY - titleSize - 24}" width="56" height="5" fill="${accentColor}" rx="2.5"/>
  ${multilineText(titleLines, 80, startY, titleSize, textColor, "700")}
  ${descLines.length ? multilineText(descLines, 80, descY, descSize, "rgba(255,255,255,0.72)") : ""}
  ${brand ? `<text x="${W - 60}" y="${H - 40}" font-family="${FONT}" font-size="26" fill="rgba(255,255,255,0.38)" text-anchor="end">${esc(brand)}</text>` : ""}
</svg>`.trim();
}

// ─── Article template ─────────────────────────────────────────

function createArticleSVG(options: OGImageOptions): string {
  const {
    title,
    description,
    brand,
    category,
    author,
    dateString,
    accentColor = "#e63946",
  } = options;

  const bg = options.backgroundColor ?? "#f8f9fa";
  const textColor = options.textColor ?? "#1a1a2e";

  const titleLines = wrapText(title, 38, 3);
  const descLines = description ? wrapText(description, 68, 2) : [];

  const titleSize = 52;
  const descSize = 28;
  const titleLH = Math.round(titleSize * 1.3);

  const titleY = category ? 200 : 170;
  const descY = titleY + titleLines.length * titleLH + 24;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="${bg}"/>
  <rect x="0" y="0" width="${W}" height="8" fill="${accentColor}"/>
  ${
    category
      ? `<rect x="60" y="120" width="${category.length * 13 + 32}" height="36" fill="${accentColor}" rx="18"/>
  <text x="${60 + 16}" y="144" font-family="${FONT}" font-size="18" font-weight="600" fill="#ffffff">${esc(category.toUpperCase())}</text>`
      : ""
  }
  ${multilineText(titleLines, 60, titleY, titleSize, textColor, "700")}
  ${descLines.length ? multilineText(descLines, 60, descY, descSize, `${textColor}b3`) : ""}
  <rect x="60" y="${H - 80}" width="${W - 120}" height="1" fill="rgba(0,0,0,0.1)"/>
  ${
    author
      ? `<text x="60" y="${H - 44}" font-family="${FONT}" font-size="22" fill="${textColor}99">${esc(author)}</text>`
      : ""
  }
  ${
    dateString
      ? `<text x="${W - 60}" y="${H - 44}" font-family="${FONT}" font-size="22" fill="${textColor}66" text-anchor="end">${esc(dateString)}</text>`
      : ""
  }
  ${
    brand
      ? `<text x="${W / 2}" y="${H - 44}" font-family="${FONT}" font-size="22" font-weight="600" fill="${accentColor}" text-anchor="middle">${esc(brand)}</text>`
      : ""
  }
</svg>`.trim();
}

// ─── Sports event template ────────────────────────────────────

function createSportsEventSVG(options: OGImageOptions): string {
  const {
    title,
    brand,
    homeTeam,
    awayTeam,
    eventDate,
    accentColor = "#ffd700",
  } = options;

  const bg1 = options.backgroundColor ?? "#0a0a1a";
  const bg2 = options.backgroundColor ?? "#1a1a3e";
  const textColor = options.textColor ?? "#ffffff";

  if (homeTeam && awayTeam) {
    const homeLines = wrapText(homeTeam.toUpperCase(), 12, 2);
    const awayLines = wrapText(awayTeam.toUpperCase(), 12, 2);
    const teamSize = 64;
    const teamY = homeLines.length > 1 ? 300 : 330;

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="${W}" y2="${H}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${bg1}"/>
      <stop offset="100%" stop-color="${bg2}"/>
    </linearGradient>
    <linearGradient id="div" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(255,215,0,0)"/>
      <stop offset="50%" stop-color="rgba(255,215,0,0.25)"/>
      <stop offset="100%" stop-color="rgba(255,215,0,0)"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect x="591" y="60" width="18" height="510" fill="url(#div)" rx="9"/>
  ${multilineText(homeLines, 300, teamY, teamSize, textColor, "800", "middle")}
  <text x="600" y="345" font-family="${FONT}" font-size="56" font-weight="900" fill="${accentColor}" text-anchor="middle">VS</text>
  ${multilineText(awayLines, 900, teamY, teamSize, textColor, "800", "middle")}
  ${eventDate ? `<text x="${W / 2}" y="510" font-family="${FONT}" font-size="26" fill="rgba(255,255,255,0.55)" text-anchor="middle">${esc(eventDate)}</text>` : ""}
  ${brand ? `<text x="${W - 60}" y="${H - 36}" font-family="${FONT}" font-size="24" fill="rgba(255,255,255,0.3)" text-anchor="end">${esc(brand)}</text>` : ""}
</svg>`.trim();
  }

  const titleLines = wrapText(title, 28, 2);
  const titleSize = 64;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="${W}" y2="${H}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="${bg1}"/>
      <stop offset="100%" stop-color="${bg2}"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect x="0" y="0" width="8" height="${H}" fill="${accentColor}"/>
  ${multilineText(titleLines, 80, 300, titleSize, textColor, "700")}
  ${eventDate ? `<text x="80" y="410" font-family="${FONT}" font-size="28" fill="rgba(255,255,255,0.55)">${esc(eventDate)}</text>` : ""}
  ${brand ? `<text x="${W - 60}" y="${H - 36}" font-family="${FONT}" font-size="24" fill="rgba(255,255,255,0.3)" text-anchor="end">${esc(brand)}</text>` : ""}
</svg>`.trim();
}

// ─── Public API ───────────────────────────────────────────────

export function createOGImageSVG(options: OGImageOptions): string {
  switch (options.template) {
    case "article":
      return createArticleSVG(options);
    case "sports-event":
      return createSportsEventSVG(options);
    default:
      return createDefaultSVG(options);
  }
}
