/**
 * Assign `categories` and `tags` to every post in content/blog/.
 *
 * The vocabulary is content, not code: it lives in `content/taxonomy.md` so it
 * can be edited without touching this file. Run `npm run blog-tags` after
 * adding a post or changing the tables, and the frontmatter is rewritten in
 * place. The pass is idempotent: same input, same output, no diff.
 *
 * Scoring weights a match by WHERE it appears, because a term in the title is
 * evidence about what the piece is, while the same term in the body may be an
 * aside:
 *
 *   title 6 · heading 3 · body 1
 *
 * Categories are navigation, so a post gets exactly ONE, the highest scorer.
 * Tags are description, so a post gets every tag above the floor, capped at
 * MAX_TAGS and ordered by score, then alphabetically for a stable diff.
 */
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const BLOG = join(root, 'content', 'blog');
const VOCAB = join(root, 'content', 'taxonomy.md');

const MIN_TAG_SCORE = 6;
const MAX_TAGS = 6;
const MIN_TAGS = 3;

const W_TITLE = 6;
const W_HEADING = 3;
const W_BODY = 1;

/** Parse the two Markdown tables. Returns { categories, tags } as label -> terms[]. */
function loadVocabulary() {
  const text = readFileSync(VOCAB, 'utf8');
  const out = { categories: new Map(), tags: new Map() };
  let bucket = null;

  for (const line of text.split('\n')) {
    const h2 = line.match(/^##\s+(.+?)\s*$/);
    if (h2) {
      const name = h2[1].toLowerCase();
      bucket = name === 'categories' ? out.categories : name === 'tags' ? out.tags : null;
      continue;
    }
    if (!bucket) continue;

    const row = line.match(/^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*$/);
    if (!row) continue;
    const label = row[1].trim();
    if (!label || /^-+$/.test(label) || /^(category|tag)$/i.test(label)) continue;

    const terms = row[2]
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);
    if (terms.length) bucket.set(label, terms);
  }

  if (!out.categories.size) throw new Error('blog-taxonomy: no categories parsed from content/taxonomy.md');
  if (!out.tags.size) throw new Error('blog-taxonomy: no tags parsed from content/taxonomy.md');
  return out;
}

/** Split a post into the three weighted zones. */
function zones(source) {
  const m = source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error('no frontmatter');
  const [, fm, body] = m;

  const title = (fm.match(/^title:\s*"(.*)"\s*$/m)?.[1] ?? '').toLowerCase();
  const headings = [...body.matchAll(/^##\s+(.+)$/gm)].map((h) => h[1]).join(' ').toLowerCase();

  // Body copy only: strip image lines so alt text does not vote.
  const prose = body
    .replace(/^!\[[^\]]*\]\([^)]*\)$/gm, ' ')
    .replace(/^##\s+.+$/gm, ' ')
    .toLowerCase();

  return { fm, body, title, headings, prose };
}

/**
 * Count matches at a WORD BOUNDARY, not anywhere in the string.
 *
 * Plain substring matching quietly poisons the scores: "lead" fires on
 * "leadership", "brand" on "brand-new", "ai" on "said". A short term is matched
 * as a whole word so "ai", "crm" and "seo" behave; a longer one is matched as a
 * prefix so "differentiat" still covers differentiate and differentiation.
 */
const cache = new Map();
function patternFor(term) {
  let re = cache.get(term);
  if (!re) {
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const boundary = term.length <= 3 ? '\\b' : '';
    re = new RegExp(`\\b${escaped}${boundary}`, 'g');
    cache.set(term, re);
  }
  return re;
}

const countOf = (haystack, needle) => {
  if (!needle) return 0;
  const re = patternFor(needle);
  re.lastIndex = 0;
  let n = 0;
  while (re.exec(haystack) !== null) n++;
  return n;
};

function score(z, terms) {
  let total = 0;
  for (const term of terms) {
    total += countOf(z.title, term) * W_TITLE;
    total += countOf(z.headings, term) * W_HEADING;
    total += countOf(z.prose, term) * W_BODY;
  }
  return total;
}

/** Replace a frontmatter key, or insert it after `after` when absent. */
function setField(fm, key, value, after) {
  const line = `${key}: ${value}`;
  const re = new RegExp(`^${key}:.*$`, 'm');
  if (re.test(fm)) return fm.replace(re, line);
  const afterRe = new RegExp(`^(${after}:.*)$`, 'm');
  if (afterRe.test(fm)) return fm.replace(afterRe, `$1\n${line}`);
  return `${fm}\n${line}`;
}

const arr = (values) => `[${values.map((v) => `"${v}"`).join(', ')}]`;

function main() {
  const vocab = loadVocabulary();
  const files = readdirSync(BLOG).filter((f) => f.endsWith('.md')).sort();
  if (!files.length) {
    console.log('blog-taxonomy: no posts in content/blog/');
    return;
  }

  const rows = [];
  for (const file of files) {
    const path = join(BLOG, file);
    const source = readFileSync(path, 'utf8');
    const z = zones(source);

    const cats = [...vocab.categories]
      .map(([label, terms]) => ({ label, n: score(z, terms) }))
      .sort((a, b) => b.n - a.n || a.label.localeCompare(b.label));

    if (!cats[0] || cats[0].n === 0) {
      throw new Error(
        `blog-taxonomy: ${file} matched no category. Add a term to content/taxonomy.md.`,
      );
    }
    const category = cats[0].label;

    let tags = [...vocab.tags]
      .map(([label, terms]) => ({ label, n: score(z, terms) }))
      .sort((a, b) => b.n - a.n || a.label.localeCompare(b.label));

    const above = tags.filter((t) => t.n >= MIN_TAG_SCORE);
    // Never fewer than MIN_TAGS: fall back to the best scorers that matched at all.
    const chosen = (above.length >= MIN_TAGS ? above : tags.filter((t) => t.n > 0))
      .slice(0, MAX_TAGS)
      .map((t) => t.label)
      .sort();

    let fm = z.fm;
    fm = setField(fm, 'categories', arr([category]), 'author');
    fm = setField(fm, 'tags', arr(chosen), 'categories');

    const next = `---\n${fm}\n---\n${z.body}`;
    const changed = next !== source;
    if (changed) writeFileSync(path, next);

    rows.push({
      file: basename(file, '.md'),
      category,
      runnerUp: cats[1] ? `${cats[1].label} (${cats[1].n})` : '-',
      top: cats[0].n,
      tags: chosen,
      changed,
    });
  }

  const width = Math.max(...rows.map((r) => r.file.length));
  for (const r of rows) {
    console.log(
      `  ${r.changed ? 'set ' : 'same'}  ${r.file.padEnd(width)}  ${r.category} (${r.top}), next: ${r.runnerUp}`,
    );
    console.log(`        tags: ${r.tags.join(', ')}`);
  }

  const used = new Set(rows.map((r) => r.category));
  const unused = [...vocab.categories.keys()].filter((c) => !used.has(c));
  console.log(
    `\nblog-taxonomy: ${rows.length} post(s), ${used.size} categor${used.size === 1 ? 'y' : 'ies'} in use` +
      (unused.length ? `, ${unused.length} unused (no archive page generated): ${unused.join(', ')}` : ''),
  );
}

main();
