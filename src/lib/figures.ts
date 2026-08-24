import type { ImageMetadata } from 'astro';

/**
 * Inline figures referenced from Markdown body copy.
 *
 * The Markdown carries a stable virtual path (`/assets/diagrams/foo.svg`) while
 * the file lives in `content/assets/diagrams/`, so the build can process it the
 * same way it processes the portfolio gallery.
 *
 * Intrinsic dimensions are the point of this module. Without a width and height
 * the figure has no height until the image loads, so it never intersects the
 * viewport, so `loading="lazy"` never fires and the image silently never
 * appears. A bare `<img src>` cannot supply them.
 *
 * Raster and vector take different routes. A raster goes through `<Image>` for
 * the AVIF/WebP srcset (STYLEGUIDE.md §8). An SVG is already resolution
 * independent and gains nothing from that pipeline, so it is emitted as-is and
 * its size is read from its own `viewBox`.
 *
 * Every glob pattern must stay a literal string for Vite to statically analyse it.
 */
const diagramRasters = import.meta.glob<{ default: ImageMetadata }>(
  '../../content/assets/diagrams/*.{jpg,jpeg,png,webp,avif}',
  { eager: true },
);

const peopleRasters = import.meta.glob<{ default: ImageMetadata }>(
  '../../content/assets/people/*.{jpg,jpeg,png,webp,avif}',
  { eager: true },
);

const rasters = { ...diagramRasters, ...peopleRasters };

const svgUrls = import.meta.glob<string>('../../content/assets/diagrams/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
});

const svgSources = import.meta.glob<string>('../../content/assets/diagrams/*.svg', {
  eager: true,
  query: '?raw',
  import: 'default',
});

const filename = (path: string): string => path.split('/').pop() ?? path;

const rasterByName = new Map<string, ImageMetadata>(
  Object.entries(rasters).map(([path, module]) => [filename(path), module.default]),
);

/** "0 0 854.59 408.81" -> 855 x 409. Falls back to the width/height attributes. */
function svgSize(source: string, name: string): { width: number; height: number } {
  const viewBox = source.match(/viewBox\s*=\s*["']([^"']+)["']/);
  if (viewBox) {
    const parts = viewBox[1]!.trim().split(/[\s,]+/).map(Number);
    if (parts.length === 4 && parts[2]! > 0 && parts[3]! > 0) {
      return { width: Math.round(parts[2]!), height: Math.round(parts[3]!) };
    }
  }

  const width = source.match(/\bwidth\s*=\s*["'](\d+(?:\.\d+)?)/);
  const height = source.match(/\bheight\s*=\s*["'](\d+(?:\.\d+)?)/);
  if (width && height) {
    return { width: Math.round(Number(width[1])), height: Math.round(Number(height[1])) };
  }

  throw new Error(
    `content/assets/diagrams/${name} has no viewBox and no width/height, so its aspect ` +
      `ratio cannot be reserved. Add a viewBox to the SVG.`,
  );
}

const svgByName = new Map<string, { src: string; width: number; height: number }>(
  Object.entries(svgUrls).map(([path, url]) => {
    const name = filename(path);
    return [name, { src: url, ...svgSize(svgSources[path] ?? '', name) }];
  }),
);

export type Figure =
  | { kind: 'raster'; image: ImageMetadata }
  | { kind: 'svg'; src: string; width: number; height: number };

/**
 * Resolve a Markdown image path to its processed asset.
 *
 * Throws rather than rendering a broken image: the site is fully static, so a
 * typo in a content file should stop the build, not reach a visitor.
 */
export function figure(src: string): Figure {
  const name = filename(src);

  const svg = svgByName.get(name);
  if (svg) return { kind: 'svg', ...svg };

  const raster = rasterByName.get(name);
  if (raster) return { kind: 'raster', image: raster };

  const available =
    [...svgByName.keys(), ...rasterByName.keys()].sort().join(', ') || '(the folders are empty)';
  throw new Error(
    `Markdown references the image "${src}", but no file named ${name} exists in ` +
      `content/assets/diagrams/ or content/assets/people/. Available: ${available}`,
  );
}
