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
