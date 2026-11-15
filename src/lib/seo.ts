import { splitSentences } from './anatomy';

/**
 * Search results truncate a meta description around 155 to 160 characters, and
 * they cut mid-word, which reads as a mistake rather than as a summary.
 *
 * Landing page descriptions are taken from the page's own intro paragraph,
 * which is written for the page and routinely runs past that: /execution was
 * 179 characters and /work 170.
 *
 * This drops WHOLE SENTENCES from the end until the rest fits, so the result is
 * always the author's own prose ending on a full stop. Nothing is invented and
 * nothing is cut mid-thought. A single sentence that is already too long is
 * returned untouched, because truncating it would do the very thing this
 * exists to avoid; that case wants an editor, not code.
 */
export const META_DESCRIPTION_MAX = 160;

export function clampDescription(text: string, max = META_DESCRIPTION_MAX): string {
  const trimmed = text.trim().replace(/\s+/g, ' ');
  if (trimmed.length <= max) return trimmed;

  const sentences = splitSentences(trimmed);
  for (let count = sentences.length - 1; count >= 1; count--) {
    const candidate = sentences.slice(0, count).join(' ');
    if (candidate.length <= max) return candidate;
  }

  return trimmed;
}

/**
 * A schema.org date that Google accepts.
 *
 * Content stores plain dates (`2026-08-30`), and the site shipped them that way.
 * Google's Search Console then flagged every one: all 17 dated videos as
 * "Invalid datetime value" and "missing a timezone", and the Rich Results Test
 * gave the same warning on blog `datePublished` (2026-11-15 audit).
 *
 * A bare date becomes midnight in Toronto with that day's real offset, -05:00
 * or -04:00, so the calendar date never shifts. The offset is read at 05:00 UTC,
 * which is midnight or 1 a.m. in Toronto and so always before the 2 a.m.
 * daylight-saving change. A value that already carries a time, such as
 * YouTube's `2015-10-23T15:14:07-07:00`, passes through untouched.
 *
 * Never parse the date with `new Date('2026-08-30')` for display: that is UTC
 * midnight, the previous day in Toronto (CLAUDE.md trap).
 */
export function schemaDateTime(value: string): string {
  if (value.includes('T')) return value;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const zone = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/Toronto',
    timeZoneName: 'longOffset',
  })
    .formatToParts(new Date(`${value}T05:00:00Z`))
    .find((part) => part.type === 'timeZoneName')?.value;
  const offset = zone?.replace('GMT', '') || '-05:00';
  return `${value}T00:00:00${offset}`;
}
