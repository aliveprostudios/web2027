import type { ImageMetadata } from 'astro';

/**
 * Portfolio gallery source (STYLEGUIDE.md §9, Gallery slot 3).
 *
 * The count is DYNAMIC: the grid, the lightbox counter, and the slideshow all
 * derive from this array's length, so dropping a photo into
 * `content/assets/portfolio/` adds a tile with no code change, and an empty
 * folder renders gracefully rather than breaking the page.
 *
 * The glob pattern must stay a literal string for Vite to statically analyse it.
 */
const modules = import.meta.glob<{ default: ImageMetadata }>(
  '../../content/assets/portfolio/*.{jpg,jpeg,png,webp,avif}',
  { eager: true },
);

export type GalleryImage = {
  src: ImageMetadata;
  /** Filename without extension, used to build the alt text. */
  name: string;
};

export const galleryImages: GalleryImage[] = Object.entries(modules)
  // Filename order keeps the sequence stable and predictable across builds.
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([path, module]) => ({
    src: module.default,
    name: path.split('/').pop()!.replace(/\.[^.]+$/, ''),
  }));
