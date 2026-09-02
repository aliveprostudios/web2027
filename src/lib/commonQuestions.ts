import { getCollection } from 'astro:content';

/**
 * Common Questions, the knowledge base at `/common-questions`.
 *
 * One Markdown file per CLUSTER, not per question. A cluster page holds two to
 * four related questions, each with its own anchor, so an answer engine can
 * quote a single answer while the page itself stays substantial. At the answer
 * spec below (40-70 word direct answer, 150-300 words of detail) a page per
 * question would be roughly 350 words, which would be the thinnest route on the
 * site: case studies run 651 to 968.
 *
 * Prose and metadata are split on purpose. The body holds the questions and the
 * writing, editable as Markdown. Frontmatter holds the anchor and the outbound
 * links as data, so nothing is buried in prose and every link can be checked at
 * build time.
 *
 * The direct answer is the FIRST paragraph after each `##`, which reuses the
 * rule the rest of the site already teaches (the first paragraph of a page's
 * Markdown is its lede). That same paragraph is what goes into the FAQPage
 * schema, so visible text and structured data cannot drift.
 *
 * Anchors are declared in frontmatter rather than derived from the heading.
 * Deriving them would mean that rewording a question silently changes a public
 * URL fragment and breaks every inbound link to it.
 *
 * There are no categories. A topic is one file directly in
 * `content/common-questions/`, its id is the slug, and the hub lists topics in
 * `order`. Javad's direction, 2026-09-02: three fixed buckets looked like a
 * structure that could not grow; a flat list grows by adding a file.
 *
 * Everything here throws at build rather than degrading. A knowledge base is a
 * graph, and a graph with silently broken edges rots without anyone noticing.
 */

export type Block = { type: 'p'; text: string } | { type: 'ul'; items: string[] };

export type Link = { label: string; url: string };

export type Question = {
  anchor: string;
  /** The question, verbatim, as written and as searched. */
  q: string;
  /** The direct answer. Plain text, 40-70 words, the unit quoted and the unit in the schema. */
  answer: string;
  detail: Block[];
  services: Link[];
  caseStudies: Link[];
  related: Link[];
};

export type Cluster = {
  title: string;
  url: string;
  /** The file id and the route param for `[slug].astro`, e.g. `custom-software`. */
  slug: string;
  order: number;
  caption: string;
  seoTitle: string;
  seoDescription: string;
  quote: string;
  lede: string;
  questions: Question[];
};

/** Split a Markdown body into paragraph and list blocks. */
function toBlocks(lines: string[]): Block[] {
  const blocks: Block[] = [];
  let buffer: string[] = [];

  const flush = () => {
    if (buffer.length === 0) return;
    if (buffer[0]!.startsWith('- ')) {
      blocks.push({ type: 'ul', items: buffer.map((l) => l.replace(/^-\s+/, '').trim()) });
    } else {
      blocks.push({ type: 'p', text: buffer.join(' ').trim() });
    }
    buffer = [];
  };

  for (const line of lines) {
    if (line.trim() === '') {
      flush();
      continue;
    }
    // A list item always starts its own block, so a list directly after a
    // paragraph is not swallowed into it.
    if (line.startsWith('- ') && buffer.length > 0 && !buffer[0]!.startsWith('- ')) flush();
    buffer.push(line.trim());
  }
  flush();
  return blocks;
}

type ParsedQuestion = { q: string; answer: string; detail: Block[] };

/** Body Markdown to a lede plus one entry per `##` heading. */
function parseBody(body: string, file: string): { lede: string; parsed: ParsedQuestion[] } {
  const sections: { heading: string | null; lines: string[] }[] = [{ heading: null, lines: [] }];

  for (const line of body.split('\n')) {
    const h2 = line.match(/^##\s+(.*)$/);
    if (h2) {
      sections.push({ heading: h2[1]!.trim(), lines: [] });
      continue;
    }
    if (/^#{1,2}(?!#)\s/.test(line) && !h2) continue;
    sections[sections.length - 1]!.lines.push(line);
  }

  const intro = toBlocks(sections[0]!.lines);
  const lede = intro.find((b) => b.type === 'p')?.text ?? '';
  if (!lede) throw new Error(`[common-questions] ${file}: no lede paragraph before the first "##".`);

  const parsed = sections.slice(1).map((section) => {
    const blocks = toBlocks(section.lines);
    const first = blocks[0];
    if (!first || first.type !== 'p') {
      throw new Error(
        `[common-questions] ${file}: "${section.heading}" has no direct answer. ` +
          'The first block after the heading must be a paragraph.',
      );
    }
    return { q: section.heading!, answer: first.text, detail: blocks.slice(1) };
  });

  return { lede, parsed };
}

let cache: Cluster[] | null = null;

export async function clusters(): Promise<Cluster[]> {
  if (cache) return cache;

  const [entries, services, studies] = await Promise.all([
    getCollection('commonQuestions', (e) => e.data.published !== false),
    getCollection('services'),
    getCollection('caseStudies'),
  ]);

  const serviceByUrl = new Map(
    services.map((s) => [
      s.data.url ?? `/${s.data.category}/${s.id.split('/').pop()}`,
      s.data.navLabel ?? s.data.title,
    ]),
  );
  const studyById = new Map(studies.map((s) => [s.id, s.data.client ?? s.data.title]));

  // Pass one: parse each file and pair headings with their frontmatter entries.
  const draft = entries
    .sort((a, b) => (a.data.order ?? 0) - (b.data.order ?? 0))
    .map((entry) => {
      const file = entry.id;
      const { lede, parsed } = parseBody(entry.body ?? '', file);
      const meta = entry.data.questions;

      if (parsed.length !== meta.length) {
        throw new Error(
          `[common-questions] ${file}: ${parsed.length} "##" headings but ` +
            `${meta.length} frontmatter questions. They pair by position, so the counts must match.`,
        );
      }

      const questions = parsed.map((p, i) => {
        const m = meta[i]!;
        for (const url of m.services) {
          if (!serviceByUrl.has(url)) {
            throw new Error(`[common-questions] ${file} "${m.anchor}": no service at ${url}`);
          }
        }
        for (const slug of m.caseStudies) {
          if (!studyById.has(slug)) {
            throw new Error(`[common-questions] ${file} "${m.anchor}": no case study "${slug}"`);
          }
        }
        return {
          anchor: m.anchor,
          q: p.q,
          answer: p.answer,
          detail: p.detail,
          services: m.services.map((url) => ({ label: serviceByUrl.get(url)!, url })),
          caseStudies: m.caseStudies.map((slug) => ({
            label: studyById.get(slug)!,
            url: `/work/case-studies/${slug}`,
          })),
          relatedRefs: m.related,
        };
      });

      const anchors = questions.map((q) => q.anchor);
      const duplicate = anchors.find((a, i) => anchors.indexOf(a) !== i);
      if (duplicate) {
        throw new Error(`[common-questions] ${file}: duplicate anchor "${duplicate}"`);
      }

      const slug = entry.id;
      const url = `/common-questions/${slug}`;
      if (entry.data.url && entry.data.url !== url) {
        throw new Error(
          `[common-questions] ${file}: frontmatter url "${entry.data.url}" does not match ` +
            `"${url}", which is where this file builds. Rename the file or fix the url.`,
        );
      }

      return {
        title: entry.data.title,
        url,
        slug,
        order: entry.data.order ?? 0,
        caption: entry.data.caption ?? '',
        seoTitle: entry.data.seoTitle ?? entry.data.title,
        seoDescription: entry.data.seoDescription ?? '',
        quote: entry.data.quote,
        lede,
        questions,
        file,
      };
    });

  // Pass two: resolve `related` now that every anchor on the site is known. The
  // label is the target question's own heading, so a reworded question updates
  // every link to it without touching those files.
  const byAnchor = new Map<string, string>();
  for (const c of draft) {
    for (const q of c.questions) byAnchor.set(`${c.url}#${q.anchor}`, q.q);
  }

  cache = draft.map((c) => ({
    ...c,
    questions: c.questions.map(({ relatedRefs, ...q }) => ({
      ...q,
      related: relatedRefs.map((ref) => {
        const label = byAnchor.get(ref);
        if (!label) {
          throw new Error(`[common-questions] ${c.file} "${q.anchor}": related link ${ref} resolves to nothing`);
        }
        return { label, url: ref };
      }),
    })),
  }));

  return cache;
}

export async function clusterBySlug(slug: string): Promise<Cluster | undefined> {
  return (await clusters()).find((c) => c.slug === slug);
}

export async function allQuestions(): Promise<Question[]> {
  return (await clusters()).flatMap((c) => c.questions);
}

export async function questionCount(): Promise<number> {
  return (await allQuestions()).length;
}
