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
  }),
});

export const collections = { services, landing, pages, blog };
