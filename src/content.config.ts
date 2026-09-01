import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { glob } from 'astro/loaders';

/**
 * Content lives in `content/` at the repo root, not `src/content/`, so every
 * collection uses an explicit glob base. The collection is ALWAYS the source of
 * truth for nav sub-menus, related services, and section counts
 * (STYLEGUIDE.md §9 Clarifications).
 */

const pageFields = {
  title: z.string(),
  slug: z.string().optional(),
  /** Canonical route. Absent on the 8 Alive Pro pages; derived in src/lib/nav.ts. */
  url: z.string().optional(),
  /** Hero caption. Absent across the Sanity export; falls back per §9. */
  caption: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  /** Manual override for the route-hash video pick. */
  videoId: z.string().optional(),
  /** ISO date a legal document last changed, rendered as its "last updated" line. */
  updated: z.string().optional(),
  /** Set false when the page's last paragraph is body copy, not a closing statement. */
  closing: z.boolean().optional(),
  /**
   * Position within its section's menu, landing rows and Related Services.
   * Lower comes first. Anything without one sorts alphabetically after the
   * ordered pages, so a new file still appears without needing a number.
   */
  order: z.number().optional(),
  /** Short label for the menu and Related Services when the page title is long. */
  navLabel: z.string().optional(),
  /**
   * Set false to take a page off the site without deleting anything: no route
   * is built, and it disappears from the menu, the landing rows, Related
   * Services, the counts and the sitemap. Flip it back to republish.
   */
  published: z.boolean().optional(),
  source: z.string().optional(),
};

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/services' }),
  schema: z.object({
    ...pageFields,
    category: z.enum(['foundation', 'execution', 'growth', 'infrastructure']),
  }),
});

const landing = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/landing' }),
  schema: z.object(pageFields),
});

const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/pages' }),
  schema: z.object({ ...pageFields, category: z.string().optional() }),
});

const blog = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/blog' }),
  schema: z.object({
    ...pageFields,
    date: z.string().optional(),
    author: z.string().optional(),
    categories: z.array(z.string()).optional(),
    /** Assigned by `npm run blog-tags` from content/taxonomy.md, never by hand. */
    tags: z.array(z.string()).optional(),
  }),
});

/**
 * Case studies. One file per client, imagery in
 * `content/assets/case-studies/<slug>/` (see `src/lib/caseStudies.ts`).
 */
const caseStudies = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/case-studies' }),
  schema: z.object({
    ...pageFields,
    /** Client name for the index row and Related, when the H1 is a headline. */
    client: z.string().optional(),
  }),
});

/**
 * Home-B: the draft home page at `/home-b`, noindex and out of the sitemap.
 *
 * Two entries, `page` and `intro`, both in `content/home-b/`. Every string the
 * route renders that is not a full block of prose lives in frontmatter here,
 * so the draft can be reworked without opening the template. When Home-B is
 * approved its copy replaces the live home page's and the route is deleted.
 */
const homeB = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/home-b' }),
  schema: z.object({
    title: z.string(),
    caption: z.string().optional(),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    source: z.string().optional(),
    /** Small credit line on the hero photo. Omitted when empty. */
    heroCredit: z.string().optional(),
    /** One line under the brand reel. Omitted when empty. */
    reelCaption: z.string().optional(),
    /** H2 over the case study tiles. */
    proofHeading: z.string().optional(),
    /** Case study slugs to feature, in order. Defaults to the first three by `order`. */
    caseStudies: z.array(z.string()).optional(),
    /** Credit line on the feature image, and where it links. */
    featureCredit: z.string().optional(),
    featureCreditHref: z.string().optional(),
    /** The text link under the intro block. */
    linkLabel: z.string().optional(),
    linkHref: z.string().optional(),
  }),
});

export const collections = { services, landing, pages, blog, caseStudies, homeB };
