import { getCollection } from 'astro:content';
import { SECTIONS, sectionLabel, stageIndex, type Section } from './sections';

/**
 * The four pillar rows on the Home page (STYLEGUIDE.md §9, Home slot 4).
 *
 * Each row IS a category landing page, so the data is COLLECTION-derived, not
 * hard-coded: renaming a pillar or rewriting its intro in
 * `content/landing/{section}.md` updates the homepage with no code change.
 *
 * Verified against the approved template: pillar 01's kicker and body are
 * verbatim from `content/landing/foundation.md`.
 */
export type Pillar = {
  num: string;
  /** "Foundation" */
  name: string;
  /** H5 orange kicker, from the landing page's display headline. */
  kicker: string;
  /** Body copy, from the landing page's intro paragraph. */
  body: string;
  url: string;
};

/**
 * The landing files are scrapes of the live site, so their display headline
 * arrives with the two-tone halves run together: "where every greatBRAND
 * BEGINS". Re-separate at the lowercase-to-uppercase boundary. CSS uppercases
 * the result, so only the word break matters.
 */
function unmash(heading: string): string {
  return heading.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\s+/g, ' ').trim();
}

/** First real paragraph: skips the scrape's orphan index numbers and headings. */
function introParagraph(body: string): string {
  const chunks = body
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((c) => c.trim())
    .filter(Boolean);

  for (const chunk of chunks) {
    if (/^#{1,6}\s/.test(chunk)) continue;
    if (/^[-*+>|]/.test(chunk)) continue;
    // Orphan list numbers sit on their own line: "01", "02", ...
    if (/^\d{1,2}$/.test(chunk)) continue;
    // The eyebrow line: "01 Foundation"
    if (/^\d{1,2}\s+\w+$/.test(chunk)) continue;
    return chunk.replace(/\n/g, ' ');
  }
  return '';
}

function displayHeading(body: string): string {
  const match = body.match(/^#\s+(.*)$/m);
  return match ? unmash(match[1]!.trim()) : '';
}

export async function pillars(): Promise<Pillar[]> {
  const landing = await getCollection('landing');

  return SECTIONS.map((section: Section, i): Pillar => {
    const entry = landing.find((e) => e.id === section);
    const body = entry?.body ?? '';
    return {
      num: stageIndex(section),
      name: sectionLabel(section),
      kicker: displayHeading(body),
      body: introParagraph(body),
      url: `/${section}`,
    };
  }).filter((p) => p.body !== '');
}
