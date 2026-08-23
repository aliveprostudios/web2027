import faqsMarkdown from '../../content/faqs.md?raw';

/**
 * FAQ content, parsed from `content/faqs.md`.
 *
 * Drives both the rendered accordion and the FAQPage structured data, so the
 * two can never drift: adding a `### Question` + answer to the Markdown adds it
 * to the page AND to the schema.
 */
export type Faq = { q: string; a: string };
export type FaqGroup = { heading: string; items: Faq[] };

export function faqGroups(): FaqGroup[] {
  const body = faqsMarkdown.replace(/^---\n[\s\S]*?\n---\n/, '');
  const groups: FaqGroup[] = [];
  let group: FaqGroup | null = null;
  let current: Faq | null = null;

  for (const chunk of body.split(/\n{2,}/).map((c) => c.trim()).filter(Boolean)) {
    const h2 = chunk.match(/^##\s+(.*)$/);
    if (h2) {
      group = { heading: h2[1]!.trim(), items: [] };
      groups.push(group);
      current = null;
      continue;
    }
    const h3 = chunk.match(/^###\s+(.*)$/);
    if (h3) {
      if (!group) {
        group = { heading: 'General', items: [] };
        groups.push(group);
      }
      current = { q: h3[1]!.trim(), a: '' };
      group.items.push(current);
      continue;
    }
    if (/^[#>|-]/.test(chunk)) continue;
    if (current && !current.a) current.a = chunk.replace(/\n/g, ' ');
  }

  return groups.filter((g) => g.items.length > 0);
}

export const allFaqs = (): Faq[] => faqGroups().flatMap((g) => g.items);
