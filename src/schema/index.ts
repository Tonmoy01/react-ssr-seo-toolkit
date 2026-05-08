import type {
  JSONLDBase,
  BreadcrumbItem,
  OrganizationSchemaInput,
  WebsiteSchemaInput,
  ArticleSchemaInput,
  ProductSchemaInput,
  FAQItem,
  EventSchemaInput,
  PersonSchemaInput,
  RecipeSchemaInput,
  JobPostingSchemaInput,
} from "../types/index.js";

const CONTEXT = "https://schema.org";

// ─── Organization ─────────────────────────────────────────────

export function createOrganizationSchema(
  input: OrganizationSchemaInput
): JSONLDBase {
  const schema: JSONLDBase = {
    "@context": CONTEXT,
    "@type": "Organization",
    name: input.name,
    url: input.url,
  };

  if (input.logo) schema.logo = input.logo;
  if (input.description) schema.description = input.description;
  if (input.sameAs?.length) schema.sameAs = input.sameAs;

  if (input.contactPoint) {
    const cp: Record<string, unknown> = {
      "@type": "ContactPoint",
    };
    if (input.contactPoint.telephone)
      cp.telephone = input.contactPoint.telephone;
    if (input.contactPoint.contactType)
      cp.contactType = input.contactPoint.contactType;
    if (input.contactPoint.email) cp.email = input.contactPoint.email;
    if (input.contactPoint.areaServed)
      cp.areaServed = input.contactPoint.areaServed;
    if (input.contactPoint.availableLanguage)
      cp.availableLanguage = input.contactPoint.availableLanguage;
    schema.contactPoint = cp;
  }

  return schema;
}

// ─── Website ──────────────────────────────────────────────────

export function createWebsiteSchema(input: WebsiteSchemaInput): JSONLDBase {
  const schema: JSONLDBase = {
    "@context": CONTEXT,
    "@type": "WebSite",
    name: input.name,
    url: input.url,
  };

  if (input.description) schema.description = input.description;

  if (input.searchUrl) {
    schema.potentialAction = {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${input.searchUrl}?${input.searchQueryParam ?? "q"}={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    };
  }

  return schema;
}

// ─── Breadcrumb ───────────────────────────────────────────────

export function createBreadcrumbSchema(items: BreadcrumbItem[]): JSONLDBase {
  return {
    "@context": CONTEXT,
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

// ─── Article ──────────────────────────────────────────────────

export function createArticleSchema(input: ArticleSchemaInput): JSONLDBase {
  const schema: JSONLDBase = {
    "@context": CONTEXT,
    "@type": "Article",
    headline: input.headline,
    url: input.url,
  };

  if (input.description) schema.description = input.description;
  if (input.images?.length) schema.image = input.images;
  if (input.datePublished) schema.datePublished = input.datePublished;
  if (input.dateModified) schema.dateModified = input.dateModified;
  if (input.section) schema.articleSection = input.section;
  if (input.keywords?.length) schema.keywords = input.keywords;

  if (input.author) {
    const authors = Array.isArray(input.author)
      ? input.author
      : [input.author];
    schema.author = authors.map((a) => {
      const person: Record<string, string> = {
        "@type": "Person",
        name: a.name,
      };
      if (a.url) person.url = a.url;
      return person;
    });
  }

  if (input.publisher) {
    const pub: Record<string, unknown> = {
      "@type": "Organization",
      name: input.publisher.name,
    };
    if (input.publisher.logo) {
      pub.logo = {
        "@type": "ImageObject",
        url: input.publisher.logo,
      };
    }
    schema.publisher = pub;
  }

  return schema;
}

// ─── Product ──────────────────────────────────────────────────

export function createProductSchema(input: ProductSchemaInput): JSONLDBase {
  const schema: JSONLDBase = {
    "@context": CONTEXT,
    "@type": "Product",
    name: input.name,
    url: input.url,
  };

  if (input.description) schema.description = input.description;
  if (input.images?.length) schema.image = input.images;
  if (input.brand) {
    schema.brand = { "@type": "Brand", name: input.brand };
  }
  if (input.sku) schema.sku = input.sku;
  if (input.gtin) schema.gtin = input.gtin;

  if (input.price !== undefined) {
    const offer: Record<string, unknown> = {
      "@type": "Offer",
      price: input.price,
      priceCurrency: input.priceCurrency ?? "USD",
    };
    if (input.availability) {
      offer.availability = `https://schema.org/${input.availability}`;
    }
    schema.offers = offer;
  }

  if (input.ratingValue !== undefined) {
    const rating: Record<string, unknown> = {
      "@type": "AggregateRating",
      ratingValue: input.ratingValue,
    };
    if (input.reviewCount !== undefined) rating.reviewCount = input.reviewCount;
    schema.aggregateRating = rating;
  }

  return schema;
}

// ─── FAQ ──────────────────────────────────────────────────────

export function createFAQSchema(items: FAQItem[]): JSONLDBase {
  return {
    "@context": CONTEXT,
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

// ─── Event / SportsEvent ─────────────────────────────────────

export function createEventSchema(input: EventSchemaInput): JSONLDBase {
  const isSports = !!(input.sport ?? input.homeTeam ?? input.awayTeam);

  const schema: JSONLDBase = {
    "@context": CONTEXT,
    "@type": isSports ? "SportsEvent" : "Event",
    name: input.name,
    startDate: input.startDate,
  };

  if (input.endDate) schema.endDate = input.endDate;
  if (input.description) schema.description = input.description;
  if (input.url) schema.url = input.url;
  if (input.images?.length) schema.image = input.images;

  if (input.eventStatus) {
    schema.eventStatus = `https://schema.org/${input.eventStatus}`;
  }
  if (input.eventAttendanceMode) {
    schema.eventAttendanceMode = `https://schema.org/${input.eventAttendanceMode}`;
  }

  if (input.location) {
    const loc = input.location;
    if (loc.url && !loc.address) {
      schema.location = {
        "@type": "VirtualLocation",
        name: loc.name,
        url: loc.url,
      };
    } else {
      const place: Record<string, unknown> = {
        "@type": "Place",
        name: loc.name,
      };
      if (loc.url) place.url = loc.url;
      if (loc.address) {
        place.address =
          typeof loc.address === "string"
            ? loc.address
            : { "@type": "PostalAddress", ...loc.address };
      }
      schema.location = place;
    }
  }

  if (input.organizer) {
    const org: Record<string, string> = {
      "@type": "Organization",
      name: input.organizer.name,
    };
    if (input.organizer.url) org.url = input.organizer.url;
    schema.organizer = org;
  }

  if (input.performer) {
    const performers = Array.isArray(input.performer)
      ? input.performer
      : [input.performer];
    const mapped = performers.map((p) => {
      const entry: Record<string, string> = { "@type": "Person", name: p.name };
      if (p.url) entry.url = p.url;
      return entry;
    });
    schema.performer = mapped.length === 1 ? mapped[0] : mapped;
  }

  if (isSports) {
    if (input.sport) schema.sport = input.sport;
    if (input.homeTeam) {
      const t: Record<string, string> = {
        "@type": "SportsTeam",
        name: input.homeTeam.name,
      };
      if (input.homeTeam.url) t.url = input.homeTeam.url;
      schema.homeTeam = t;
    }
    if (input.awayTeam) {
      const t: Record<string, string> = {
        "@type": "SportsTeam",
        name: input.awayTeam.name,
      };
      if (input.awayTeam.url) t.url = input.awayTeam.url;
      schema.awayTeam = t;
    }
  }

  return schema;
}

// ─── Person ───────────────────────────────────────────────────

export function createPersonSchema(input: PersonSchemaInput): JSONLDBase {
  const schema: JSONLDBase = {
    "@context": CONTEXT,
    "@type": "Person",
    name: input.name,
  };

  if (input.url) schema.url = input.url;
  if (input.image) schema.image = input.image;
  if (input.jobTitle) schema.jobTitle = input.jobTitle;
  if (input.description) schema.description = input.description;
  if (input.email) schema.email = input.email;
  if (input.telephone) schema.telephone = input.telephone;
  if (input.birthDate) schema.birthDate = input.birthDate;
  if (input.sameAs?.length) schema.sameAs = input.sameAs;

  if (input.worksFor) {
    const org: Record<string, string> = { "@type": "Organization", name: input.worksFor.name };
    if (input.worksFor.url) org.url = input.worksFor.url;
    schema.worksFor = org;
  }

  if (input.address) {
    schema.address =
      typeof input.address === "string"
        ? input.address
        : { "@type": "PostalAddress", ...input.address };
  }

  return schema;
}

// ─── Recipe ───────────────────────────────────────────────────

export function createRecipeSchema(input: RecipeSchemaInput): JSONLDBase {
  const schema: JSONLDBase = {
    "@context": CONTEXT,
    "@type": "Recipe",
    name: input.name,
  };

  if (input.description) schema.description = input.description;
  if (input.images?.length) schema.image = input.images;
  if (input.datePublished) schema.datePublished = input.datePublished;
  if (input.prepTime) schema.prepTime = input.prepTime;
  if (input.cookTime) schema.cookTime = input.cookTime;
  if (input.totalTime) schema.totalTime = input.totalTime;
  if (input.recipeYield !== undefined) schema.recipeYield = String(input.recipeYield);
  if (input.recipeCategory) schema.recipeCategory = input.recipeCategory;
  if (input.recipeCuisine) schema.recipeCuisine = input.recipeCuisine;
  if (input.recipeIngredient?.length) schema.recipeIngredient = input.recipeIngredient;
  if (input.keywords?.length) schema.keywords = input.keywords.join(", ");

  if (input.author) {
    const person: Record<string, string> = { "@type": "Person", name: input.author.name };
    if (input.author.url) person.url = input.author.url;
    schema.author = person;
  }

  if (input.recipeInstructions?.length) {
    schema.recipeInstructions = input.recipeInstructions.map((step) => {
      if (typeof step === "string") {
        return { "@type": "HowToStep", text: step };
      }
      const s: Record<string, unknown> = { "@type": "HowToStep", text: step.text };
      if (step.name) s.name = step.name;
      if (step.url) s.url = step.url;
      if (step.image) s.image = step.image;
      return s;
    });
  }

  if (input.nutrition && Object.keys(input.nutrition).length) {
    schema.nutrition = { "@type": "NutritionInformation", ...input.nutrition };
  }

  if (input.ratingValue !== undefined) {
    const rating: Record<string, unknown> = {
      "@type": "AggregateRating",
      ratingValue: input.ratingValue,
    };
    if (input.reviewCount !== undefined) rating.reviewCount = input.reviewCount;
    schema.aggregateRating = rating;
  }

  return schema;
}

// ─── JobPosting ───────────────────────────────────────────────

export function createJobPostingSchema(input: JobPostingSchemaInput): JSONLDBase {
  const schema: JSONLDBase = {
    "@context": CONTEXT,
    "@type": "JobPosting",
    title: input.title,
    description: input.description,
    datePosted: input.datePosted,
  };

  if (input.validThrough) schema.validThrough = input.validThrough;
  if (input.url) schema.url = input.url;
  if (input.experienceRequirements) schema.experienceRequirements = input.experienceRequirements;
  if (input.educationRequirements) {
    schema.educationRequirements = {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: input.educationRequirements,
    };
  }

  if (input.employmentType) {
    schema.employmentType = Array.isArray(input.employmentType)
      ? input.employmentType
      : input.employmentType;
  }

  if (input.skills) {
    schema.skills = Array.isArray(input.skills) ? input.skills.join(", ") : input.skills;
  }

  const org: Record<string, unknown> = {
    "@type": "Organization",
    name: input.hiringOrganization.name,
  };
  if (input.hiringOrganization.sameAs) org.sameAs = input.hiringOrganization.sameAs;
  if (input.hiringOrganization.logo) org.logo = input.hiringOrganization.logo;
  schema.hiringOrganization = org;

  if (input.remote) {
    schema.jobLocationType = "TELECOMMUTE";
  }

  if (input.jobLocation) {
    schema.jobLocation = {
      "@type": "Place",
      address: { "@type": "PostalAddress", ...input.jobLocation },
    };
  }

  if (input.baseSalary) {
    const { currency, value, unitText = "YEAR" } = input.baseSalary;
    const monetaryAmount: Record<string, unknown> = {
      "@type": "MonetaryAmount",
      currency,
    };
    if (typeof value === "number") {
      monetaryAmount.value = value;
    } else {
      monetaryAmount.value = {
        "@type": "QuantitativeValue",
        minValue: value.minValue,
        maxValue: value.maxValue,
        unitText,
      };
    }
    schema.baseSalary = monetaryAmount;
  }

  if (input.identifier) {
    schema.identifier = {
      "@type": "PropertyValue",
      name: input.identifier.name,
      value: input.identifier.value,
    };
  }

  return schema;
}

// ─── Schema composition ───────────────────────────────────────

/**
 * Compose multiple JSON-LD schemas into a single @graph array.
 * Useful for embedding multiple structured data blocks in one script tag.
 */
export function composeSchemas(...schemas: JSONLDBase[]): JSONLDBase {
  return {
    "@context": CONTEXT,
    "@type": "ItemList",
    "@graph": schemas.map(({ "@context": _ctx, ...rest }) => rest),
  };
}
