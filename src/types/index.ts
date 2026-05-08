// ─── Open Graph ───────────────────────────────────────────────

export type OpenGraphType =
  | "website"
  | "article"
  | "product"
  | "profile"
  | "book"
  | "music.song"
  | "music.album"
  | "video.movie"
  | "video.episode"
  | (string & {});

export interface OpenGraphImage {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  type?: string;
}

export interface OpenGraphConfig {
  title?: string;
  description?: string;
  url?: string;
  siteName?: string;
  type?: OpenGraphType;
  locale?: string;
  images?: OpenGraphImage[];
}

// ─── Twitter ──────────────────────────────────────────────────

export type TwitterCardType =
  | "summary"
  | "summary_large_image"
  | "app"
  | "player";

export interface TwitterConfig {
  card?: TwitterCardType;
  site?: string;
  creator?: string;
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
}

// ─── Robots ───────────────────────────────────────────────────

export interface RobotsConfig {
  index?: boolean;
  follow?: boolean;
  noarchive?: boolean;
  nosnippet?: boolean;
  noimageindex?: boolean;
  notranslate?: boolean;
  maxSnippet?: number;
  maxImagePreview?: "none" | "standard" | "large";
  maxVideoPreview?: number;
}

// ─── Alternate / Hreflang ─────────────────────────────────────

export interface AlternateLink {
  hreflang: string;
  href: string;
}

// ─── SEO Config ───────────────────────────────────────────────

export interface SEOConfig {
  title?: string;
  titleTemplate?: string;
  description?: string;
  canonical?: string;
  robots?: RobotsConfig;
  openGraph?: OpenGraphConfig;
  twitter?: TwitterConfig;
  alternates?: AlternateLink[];
  additionalMetaTags?: Array<{
    name?: string;
    property?: string;
    content: string;
  }>;
  additionalLinkTags?: Array<{
    rel: string;
    href: string;
    hreflang?: string;
    type?: string;
    sizes?: string;
  }>;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

// ─── JSON-LD / Schema.org ─────────────────────────────────────

export interface JSONLDBase {
  "@context"?: string;
  "@type": string;
  [key: string]: unknown;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface OrganizationSchemaInput {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  sameAs?: string[];
  contactPoint?: {
    telephone?: string;
    contactType?: string;
    email?: string;
    areaServed?: string | string[];
    availableLanguage?: string | string[];
  };
}

export interface WebsiteSchemaInput {
  name: string;
  url: string;
  description?: string;
  searchUrl?: string;
  searchQueryParam?: string;
}

export interface ArticleSchemaInput {
  headline: string;
  url: string;
  description?: string;
  images?: string[];
  datePublished?: string;
  dateModified?: string;
  author?: {
    name: string;
    url?: string;
  } | Array<{
    name: string;
    url?: string;
  }>;
  publisher?: {
    name: string;
    logo?: string;
  };
  section?: string;
  keywords?: string[];
}

export interface ProductSchemaInput {
  name: string;
  url: string;
  description?: string;
  images?: string[];
  brand?: string;
  sku?: string;
  gtin?: string;
  price?: number | string;
  priceCurrency?: string;
  availability?:
    | "InStock"
    | "OutOfStock"
    | "PreOrder"
    | "Discontinued"
    | (string & {});
  ratingValue?: number;
  reviewCount?: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}

// ─── Person ───────────────────────────────────────────────────

export interface PersonSchemaInput {
  name: string;
  url?: string;
  image?: string;
  jobTitle?: string;
  description?: string;
  email?: string;
  telephone?: string;
  sameAs?: string[];
  worksFor?: { name: string; url?: string };
  birthDate?: string;
  address?: string | {
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
}

// ─── Recipe ───────────────────────────────────────────────────

export type RecipeInstruction =
  | string
  | { text: string; name?: string; url?: string; image?: string };

export interface RecipeSchemaInput {
  name: string;
  description?: string;
  images?: string[];
  author?: { name: string; url?: string };
  datePublished?: string;
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  recipeYield?: string | number;
  recipeCategory?: string;
  recipeCuisine?: string;
  recipeIngredient?: string[];
  recipeInstructions?: RecipeInstruction[];
  nutrition?: Record<string, string>;
  ratingValue?: number;
  reviewCount?: number;
  keywords?: string[];
}

// ─── JobPosting ───────────────────────────────────────────────

export interface JobPostingSchemaInput {
  title: string;
  description: string;
  datePosted: string;
  validThrough?: string;
  employmentType?: string | string[];
  hiringOrganization: { name: string; sameAs?: string; logo?: string };
  jobLocation?: {
    addressLocality?: string;
    addressRegion?: string;
    addressCountry?: string;
  };
  remote?: boolean;
  baseSalary?: {
    currency: string;
    value: number | { minValue: number; maxValue: number };
    unitText?: "HOUR" | "DAY" | "WEEK" | "MONTH" | "YEAR";
  };
  experienceRequirements?: string;
  educationRequirements?: string;
  skills?: string | string[];
  url?: string;
  identifier?: { name: string; value: string };
}

// ─── Sitemap ──────────────────────────────────────────────────

export type ChangeFreq =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export interface SitemapRoute {
  path: string;
  lastmod?: string;
  changefreq?: ChangeFreq;
  priority?: number;
}

export interface GenerateSitemapOptions {
  routes: string[] | SitemapRoute[];
  baseUrl: string;
  exclude?: string[];
  defaultChangefreq?: ChangeFreq;
  defaultPriority?: number;
}

export interface RobotsRule {
  userAgent?: string | string[];
  allow?: string | string[];
  disallow?: string | string[];
  crawlDelay?: number;
}

export interface GenerateRobotsOptions {
  rules?: RobotsRule | RobotsRule[];
  sitemap?: string | string[];
}

// ─── Validation ───────────────────────────────────────────────

export interface SEOValidationIssue {
  page: string;
  field: string;
  message: string;
  severity: "error" | "warning";
}

export interface RouteWithSEO {
  path: string;
  name?: string;
  seo?: SEOConfig;
}

export interface SEOScoreCheck {
  name: string;
  passed: boolean;
  points: number;
  maxPoints: number;
  message?: string;
}

export interface SEOScoreResult {
  page: string;
  score: number;
  maxScore: number;
  percentage: number;
  checks: SEOScoreCheck[];
}

// ─── OG Image ─────────────────────────────────────────────────

export type OGImageTemplate = "default" | "article" | "sports-event";

export interface OGImageOptions {
  title: string;
  description?: string;
  template?: OGImageTemplate;
  brand?: string;
  backgroundColor?: string;
  textColor?: string;
  accentColor?: string;
  category?: string;
  author?: string;
  dateString?: string;
  homeTeam?: string;
  awayTeam?: string;
  eventDate?: string;
}

// ─── Event ────────────────────────────────────────────────────

export type EventStatus =
  | "EventScheduled"
  | "EventCancelled"
  | "EventPostponed"
  | "EventRescheduled";

export type EventAttendanceMode =
  | "OfflineEventAttendanceMode"
  | "OnlineEventAttendanceMode"
  | "MixedEventAttendanceMode";

export interface EventSchemaInput {
  name: string;
  startDate: string;
  endDate?: string;
  description?: string;
  url?: string;
  images?: string[];
  location?: {
    name: string;
    url?: string;
    address?: string | {
      streetAddress?: string;
      addressLocality?: string;
      addressRegion?: string;
      postalCode?: string;
      addressCountry?: string;
    };
  };
  organizer?: {
    name: string;
    url?: string;
  };
  performer?:
    | { name: string; url?: string }
    | Array<{ name: string; url?: string }>;
  eventStatus?: EventStatus;
  eventAttendanceMode?: EventAttendanceMode;
  /** Presence of any sports-specific field switches @type to "SportsEvent" */
  sport?: string;
  homeTeam?: { name: string; url?: string };
  awayTeam?: { name: string; url?: string };
}
