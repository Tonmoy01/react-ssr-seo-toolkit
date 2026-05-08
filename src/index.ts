// Types
export type {
  SEOConfig,
  OpenGraphConfig,
  OpenGraphImage,
  OpenGraphType,
  TwitterConfig,
  TwitterCardType,
  RobotsConfig,
  AlternateLink,
  JSONLDBase,
  BreadcrumbItem,
  OrganizationSchemaInput,
  WebsiteSchemaInput,
  ArticleSchemaInput,
  ProductSchemaInput,
  FAQItem,
  EventSchemaInput,
  EventStatus,
  EventAttendanceMode,
  PersonSchemaInput,
  RecipeSchemaInput,
  RecipeInstruction,
  JobPostingSchemaInput,
  ChangeFreq,
  SitemapRoute,
  GenerateSitemapOptions,
  RobotsRule,
  GenerateRobotsOptions,
  SEOValidationIssue,
  RouteWithSEO,
  SEOScoreCheck,
  SEOScoreResult,
  OGImageTemplate,
  OGImageOptions,
} from "./types/index.js";

// Core SEO builders
export {
  createSEOConfig,
  mergeSEOConfig,
  normalizeSEOConfig,
  buildTitle,
  buildDescription,
  buildCanonicalUrl,
  buildRobotsDirectives,
  buildOpenGraph,
  buildTwitterMetadata,
  buildAlternateLinks,
  noIndex,
  noIndexNoFollow,
} from "./core/index.js";

// Schema / JSON-LD generators
export {
  createOrganizationSchema,
  createWebsiteSchema,
  createBreadcrumbSchema,
  createArticleSchema,
  createProductSchema,
  createFAQSchema,
  createEventSchema,
  createPersonSchema,
  createRecipeSchema,
  createJobPostingSchema,
  composeSchemas,
} from "./schema/index.js";

// Sitemap, robots.txt, breadcrumb
export {
  generateSitemap,
  generateRobots,
  autoBreadcrumb,
} from "./sitemap/index.js";
export type { AutoBreadcrumbOptions } from "./sitemap/index.js";

// SEO validation & scoring
export {
  validateSEO,
  printValidationReport,
  getSEOScore,
  formatSEOScore,
} from "./validation/index.js";

// OG image generation
export { createOGImageSVG } from "./og/index.js";

// Utilities
export {
  safeJsonLdSerialize,
  omitEmpty,
  deepMerge,
  normalizeUrl,
  buildFullUrl,
} from "./utils/index.js";

// React components
export { SEOHead } from "./components/SEOHead.js";
export { JsonLd } from "./components/JsonLd.js";
export { SEOPreview } from "./components/SEOPreview.js";
export type { SEOHeadProps } from "./components/SEOHead.js";
export type { JsonLdProps } from "./components/JsonLd.js";
export type { SEOPreviewProps } from "./components/SEOPreview.js";
