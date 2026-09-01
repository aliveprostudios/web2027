import type { ImageMetadata } from 'astro';

/**
 * Case study imagery, addressed by slug.
 *
 * Assets live in `content/assets/case-studies/<slug>/`, ONE FOLDER PER CLIENT.
 * That is deliberate. `src/lib/figures.ts` globs a single flat directory and
 * resolves by bare filename, which is why blog figures have to carry a slug
 * prefix or they collide. A folder per case study removes the problem instead
 * of working around it: every client can hold its own `hero.jpg` and
 * `body-01.jpg` without any chance of one silently winning.
 *
 * The role of an image is carried by its FILENAME, so dropping a file into a
 * folder is the whole authoring step. Nothing is registered anywhere:
 *
 *   hero.jpg        the signature photo, replaces the looping video in slot 2
 *   body-01.jpg     column-width figures, in numbered order
 *   gallery-01.jpg  the edge-to-edge lightbox gallery at the foot of the page
 *
 * Absent roles are absent features. No `hero.*` falls back to `VideoHero`, and
 * no `gallery-*` renders no gallery section at all, rather than an empty one.
 *
 * The glob pattern must stay a literal string for Vite to analyse it
 * statically, so everything is globbed once here and grouped in JS. A per-slug
 * glob built at runtime would resolve to nothing in the build.
 */
const modules = import.meta.glob<{ default: ImageMetadata }>(
  '../../content/assets/case-studies/**/*.{jpg,jpeg,png,webp,avif}',
  { eager: true },
);

export type CaseStudyImage = {
  src: ImageMetadata;
  /** Filename without extension: `hero`, `body-01`, `gallery-03`. */
  name: string;
};

export type CaseStudyAssets = {
  hero: CaseStudyImage | null;
  body: CaseStudyImage[];
  gallery: CaseStudyImage[];
};

const EMPTY: CaseStudyAssets = { hero: null, body: [], gallery: [] };

/** `.../case-studies/alfred-smart-locks/body-01.jpg` -> slug and name. */
function locate(path: string): { slug: string; name: string } | null {
  const parts = path.split('/');
  const file = parts.pop();
  const slug = parts.pop();
  if (!file || !slug) return null;
  return { slug, name: file.replace(/\.[^.]+$/, '') };
}

const bySlug = new Map<string, CaseStudyAssets>();

for (const [path, module] of Object.entries(modules)) {
  const found = locate(path);
  if (!found) continue;

  const bucket = bySlug.get(found.slug) ?? { hero: null, body: [], gallery: [] };
  const image: CaseStudyImage = { src: module.default, name: found.name };

  if (found.name === 'hero') bucket.hero = image;
  else if (found.name.startsWith('body-')) bucket.body.push(image);
  else if (found.name.startsWith('gallery-')) bucket.gallery.push(image);

  bySlug.set(found.slug, bucket);
}

// Filename order keeps the sequence stable and predictable across builds, the
// same guarantee `gallery.ts` gives the portfolio grid.
for (const bucket of bySlug.values()) {
  bucket.body.sort((a, b) => a.name.localeCompare(b.name));
  bucket.gallery.sort((a, b) => a.name.localeCompare(b.name));
}

export function assetsFor(slug: string): CaseStudyAssets {
  return bySlug.get(slug) ?? EMPTY;
}
