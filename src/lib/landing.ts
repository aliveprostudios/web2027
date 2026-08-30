import { getEntry } from 'astro:content';

/**
 * Landing-page parser.
 *
 * The landing files are scrapes of the live site, so they arrive with orphan
 * index numbers on their own lines and the two-tone display headline run
 * together ("see what weBUILD"). This reads that shape into structured data.
 *
 * Used for `/work`, whose children (Portfolio, Videos) are NOT collection
 * entries and so have to come from the landing file itself. The four pillar
 * landings take their child rows from the services collection instead.
 */
export type LandingChild = { num: string; name: string; blurb: string; url: string };

export type Landing = {
  /** "05 Work" -> "Work" */
  eyebrow: string;
  /** Display headline, word breaks restored. */
  heading: string;
  intro: string;
  children: LandingChild[];
};

function unmash(heading: string): string {
  return heading.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\s+/g, ' ').trim();
}

/**
 * The scraped landing headings do not slugify to the canonical routes
 * ("Digital Brochure" -> /resources/digital-brochure), so these names map to the
 * URLs SITEMAP.md declares. Shared by the nav and the landing page so the two
 * can never disagree.
 */
export const CHILD_URL_OVERRIDES: Record<string, string> = {
  // Renamed 2026-08-25 for search: the display names changed, the routes did
  // not. Without these, slugify() would send the nav to /work/projects-and-
  // campaigns and /work/brand-marketing-videos, neither of which exists.
  'projects & campaigns': '/work/portfolio',
  'brand marketing videos': '/work/videos',
  'digital brochure': '/resources/brochure',
  'brand marketing blog': '/resources/blog',
  'marketing blog': '/resources/blog',
  faqs: '/resources/faqs',
};

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Everything below "## Featured Work" (or a similar trailing block) is live-site
 * furniture: stat counters, marquee text, and a duplicate CTA that the template
 * already supplies as global components. Stop before it.
 */
const TRAILING = /^##\s+(Featured Work|READY TO TRANSFORM)/i;

export async function parseLanding(id: string, base: string): Promise<Landing | null> {
  const entry = await getEntry('landing', id);
  if (!entry) return null;

  const chunks = (entry.body ?? '')
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((c) => c.trim())
    .filter(Boolean);

  const landing: Landing = { eyebrow: '', heading: '', intro: '', children: [] };
  let pendingNum: string | null = null;
  let current: LandingChild | null = null;

  for (const chunk of chunks) {
    if (TRAILING.test(chunk)) break;

    // "05 Work"
    const eyebrow = chunk.match(/^(\d{1,2})\s+(.+)$/);
    if (eyebrow && !chunk.includes('\n') && !landing.eyebrow) {
      landing.eyebrow = eyebrow[2]!.trim();
      continue;
    }

    // Orphan index number ahead of a child heading.
    if (/^\d{1,2}$/.test(chunk)) {
      pendingNum = chunk.padStart(2, '0');
      continue;
    }

    const h1 = chunk.match(/^#\s+(.*)$/);
    if (h1) {
      landing.heading = unmash(h1[1]!.trim());
      continue;
    }

    const h2 = chunk.match(/^##\s+(.*)$/);
    if (h2) {
      // A child row is an orphan index number FOLLOWED BY a heading ("01" then
      // "## Portfolio"). A bare `##` with no number ahead of it is a content
      // section of the landing page itself, like "## WHY RESOURCES MATTER", and
      // must not become a nav entry or a link to a route that does not exist.
      if (pendingNum === null) {
        current = null;
        continue;
      }
      const name = h2[1]!.trim();
      const url = CHILD_URL_OVERRIDES[name.toLowerCase()] ?? `${base}/${slugify(name)}`;
      current = { num: pendingNum, name, blurb: '', url };
      landing.children.push(current);
      pendingNum = null;
      continue;
    }

    if (/^[-*+>|#]/.test(chunk)) continue;

    if (current && !current.blurb) {
      current.blurb = chunk.replace(/\n/g, ' ');
    } else if (!current && !landing.intro) {
      landing.intro = chunk.replace(/\n/g, ' ');
    }
  }

  return landing;
}
