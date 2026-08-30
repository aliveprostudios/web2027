/**
 * Validate every blog post against the contract `src/lib/anatomy.ts` enforces.
 *
 * WHY THIS EXISTS
 *
 * The site does not render Markdown. `anatomy.ts` tokenizes a post and places
 * each chunk into a template slot BY TYPE, so a post can be perfectly valid
 * Markdown, build green, and still render wrong or drop content silently:
 *
 *   - a file in a subfolder is invisible to the loader (the glob is `*.md`,
 *     not `**` / *.md), so it produces no route AND no error
 *   - a relative image path is not recognized as an image and prints as raw
 *     Markdown in the middle of a paragraph
 *   - the second blockquote in a file is flattened into a plain paragraph
 *   - a bold "stat" line that does not START with its figure never reaches the
 *     stat block
 *   - two posts both shipping `fig-01-*.svg` collide, because figures resolve
 *     by FILENAME across one flat folder, and the last one globbed wins
 *
 * Every one of those is invisible at build time. This script makes them loud.
 *
 * ERRORS fail the build. WARNINGS print and pass: they are judgement calls
 * (length, banned phrases) rather than breakage.
 *
 * Run: node scripts/blog-check.mjs   (wired into `npm run build`)
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const blogDir = join(root, 'content', 'blog');
const diagramsDir = join(root, 'content', 'assets', 'diagrams');
const peopleDir = join(root, 'content', 'assets', 'people');

const errors = [];
const warnings = [];
const fail = (file, message) => errors.push(`${file}: ${message}`);
const warn = (file, message) => warnings.push(`${file}: ${message}`);

/* ------------------------------------------------------------------ routes */

/**
 * The set of routes a body link may point at.
 *
 * Derived from the content collections rather than SITEMAP.md, because the
 * sitemap's table also lists the 85 redirect SOURCES, and an old WordPress URL
 * would validate as if it were a live page.
 *
 * Deliberately a WARNING, not an error: this mirrors `src/lib/nav.ts` rather
 * than importing it (that file is TypeScript), so it can drift. A warning
 * surfaces a typo without a false positive ever blocking a release.
 */
function knownRoutes() {
  const routes = new Set([
    '/',
    '/contact',
    '/thank-you',
    '/work',
    '/work/portfolio',
    '/work/videos',
    '/alive-pro',
    '/privacy-policy',
  ]);

  const read = (dir) => (existsSync(dir) ? readdirSync(dir) : []);
  const frontmatterOf = (path) => parseFrontmatter(readFileSync(path, 'utf8')).data;

  // Services: /<category>/<slug>, plus the category landing pages.
  for (const category of read(join(root, 'content', 'services'))) {
    const dir = join(root, 'content', 'services', category);
    if (!statSync(dir).isDirectory()) continue;
    routes.add(`/${category}`);
    for (const file of read(dir).filter((f) => f.endsWith('.md'))) {
      const data = frontmatterOf(join(dir, file));
      if (data.published === 'false') continue;
      routes.add(data.url || `/${category}/${basename(file, '.md')}`);
    }
  }

  // Landing pages sit at the root: content/landing/work.md -> /work.
  for (const file of read(join(root, 'content', 'landing')).filter((f) => f.endsWith('.md'))) {
    const data = frontmatterOf(join(root, 'content', 'landing', file));
    if (data.published === 'false') continue;
    routes.add(data.url || `/${basename(file, '.md')}`);
  }

  // content/pages: an explicit `url`, otherwise an Alive Pro page (CLAUDE.md).
  for (const file of read(join(root, 'content', 'pages')).filter((f) => f.endsWith('.md'))) {
    const data = frontmatterOf(join(root, 'content', 'pages', file));
    if (data.published === 'false') continue;
    routes.add(data.url || `/alive-pro/${basename(file, '.md')}`);
  }

  return routes;
}

/* ------------------------------------------------------------ frontmatter */

/**
 * Enough YAML for this schema: scalars, quoted scalars, and inline arrays.
 * Values keep their raw text so a check can tell `2026-08-29` (a YAML date,
 * which Zod's z.string() rejects) from `"2026-08-29"` (a string).
 */
function parseFrontmatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { data: {}, raw: {}, body: source, found: false };

  const data = {};
  const raw = {};
  for (const line of match[1].split('\n')) {
    const kv = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (!kv) continue;
    const [, key, value] = kv;
    raw[key] = value.trim();
    data[key] = value.trim().replace(/^["'](.*)["']$/s, '$1');
  }

  return { data, raw, body: source.slice(match[0].length), found: true };
}

/* ---------------------------------------------------------------- helpers */

/** Split a body into blank-line separated chunks, exactly as tokenize() does. */
const chunksOf = (body) =>
  body
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((c) => c.trim())
    .filter(Boolean);

/** Every Markdown image in the body, as {alt, src, whole}. */
function imagesIn(body) {
  return [...body.matchAll(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g)].map((m) => ({
    alt: m[1],
    src: m[2],
    whole: m[0],
  }));
}

/** Every Markdown link, images excluded. */
function linksIn(body) {
  return [...body.matchAll(/(!?)\[([^\]]+)\]\(([^)\s]+)\)/g)]
    .filter((m) => m[1] !== '!')
    .map((m) => ({ text: m[2], href: m[3] }));
}

const BANNED = [
  "in today's fast-paced world",
  'cutting-edge',
  'innovative solutions',
  'one-stop shop',
  'boutique agency',
  'marketing toolbox',
  'contact us today',
];

/* -------------------------------------------------------------- SVG checks */

/**
 * An SVG is emitted as `<img src>`, NOT inlined, so CSS cannot reach inside it:
 * `currentColor` does nothing and it never adapts to the theme. Without an
 * opaque ground covering the whole canvas, dark ink renders straight onto the
 * dark-mode page background and the diagram effectively disappears.
 *
 * Looks for a rect that covers the viewBox and carries a flat colour fill. A
 * grid PATTERN fill (`fill="url(#grid)"`) does not count: the pattern paints
 * lines over transparency, which is exactly the trap this catches.
 */
function checkSvg(file, name) {
  const path = join(diagramsDir, name);
  const source = readFileSync(path, 'utf8');

  const viewBox = source.match(/viewBox\s*=\s*["']([^"']+)["']/);
  const hasSize = /\bwidth\s*=\s*["'][\d.]+/.test(source) && /\bheight\s*=\s*["'][\d.]+/.test(source);
  if (!viewBox && !hasSize) {
    fail(file, `${name} has no viewBox, so its aspect ratio cannot be reserved and the build throws`);
    return;
  }

  if (viewBox) {
    const [, , w, h] = viewBox[1].trim().split(/[\s,]+/).map(Number);
    const grounded = [...source.matchAll(/<rect\b[^>]*>/g)].some((m) => {
      const rect = m[0];
      const attr = (key) => {
        const found = rect.match(new RegExp(`\\b${key}\\s*=\\s*["']([^"']*)["']`));
        return found ? found[1] : null;
      };
      const fill = attr('fill');
      if (!fill || fill === 'none' || fill.startsWith('url(')) return false;
      const x = Number(attr('x') ?? 0);
      const y = Number(attr('y') ?? 0);
      const width = attr('width');
      const height = attr('height');
      const covers = (value, extent) =>
        value === '100%' || (value !== null && Number(value) >= extent - 1);
      return x <= 0 && y <= 0 && covers(width, w) && covers(height, h);
    });

    if (!grounded) {
      fail(
        file,
        `${name} has no opaque ground rect covering its ${w}x${h} viewBox. It renders as an ` +
          `<img>, so dark ink will sit on the dark-mode page background and vanish. Add ` +
          `<rect x="0" y="0" width="${w}" height="${h}" fill="#EEF2F4"/> as the first painted element`,
      );
    }
  }

  if (/[—…]/.test(source)) fail(file, `${name} contains an em dash or an ellipsis`);
}

/* ------------------------------------------------------------------- posts */

function checkPost(name, routes, figureUse) {
  const file = `content/blog/${name}`;

  if (!/^[a-z0-9][a-z0-9-]*\.md$/.test(name)) {
    fail(
      file,
      'filename must be lowercase kebab-case ending in .md. It becomes the slug and the route',
    );
  }

  const source = readFileSync(join(blogDir, name), 'utf8');
  const { data, raw, body, found } = parseFrontmatter(source);

  /* -- frontmatter ------------------------------------------------------- */

  if (!found) {
    fail(file, 'no frontmatter block');
    return;
  }

  const RETIRED = {
    description: 'seoDescription',
    pubDate: 'date',
    category: 'categories (an array)',
    heroImage: 'nothing: blog posts use VideoHero at slot 2, there is no hero image slot',
    draft: 'nothing: to hold a post back, keep it out of content/blog/',
  };
  for (const [key, instead] of Object.entries(RETIRED)) {
    if (key in data) fail(file, `frontmatter \`${key}\` is not a schema field. Use ${instead}`);
  }

  for (const key of ['title', 'caption', 'seoDescription', 'date', 'author', 'categories']) {
    if (!data[key]) fail(file, `frontmatter is missing \`${key}\``);
  }

  if (raw.date && !/^["'].*["']$/.test(raw.date)) {
    fail(file, `\`date\` must be a QUOTED string ("${data.date}"). Unquoted YAML parses as a date and Zod rejects it`);
  }
  if (data.date && !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
    fail(file, `\`date\` must be ISO YYYY-MM-DD, got "${data.date}"`);
  }
  if (raw.categories && !raw.categories.startsWith('[')) {
    fail(file, '`categories` must be an inline array, e.g. ["Brand Strategy"]');
  }
  if (raw.tags && !raw.tags.startsWith('[')) {
    fail(file, '`tags` must be an inline array. Run `npm run blog-tags` to regenerate it');
  }
  // `data` is flat text, so an inline array arrives as a string. Count entries.
  const categoryCount = raw.categories ? (raw.categories.match(/"[^"]*"/g) ?? []).length : 0;
  if (categoryCount > 1) {
    warn(file, `${categoryCount} categories. One per post keeps the archives navigable`);
  }
  if (data.seoDescription && (data.seoDescription.length < 120 || data.seoDescription.length > 165)) {
    warn(file, `seoDescription is ${data.seoDescription.length} chars, spec is 150 to 160`);
  }
  if (data.title && data.title.length > 65) {
    warn(file, `title is ${data.title.length} chars and will wrap to three lines in the hero`);
  }

  /* -- headings ---------------------------------------------------------- */

  const chunks = chunksOf(body);
  const headings = chunks.filter((c) => /^#{1,6}\s/.test(c));

  for (const heading of headings) {
    if (/^#\s/.test(heading)) {
      fail(
        file,
        `"${heading.slice(0, 48)}" uses a single #. anatomy.ts matches #{2,6} only, so this ` +
          'renders as a literal paragraph. The H1 comes from frontmatter `title`',
      );
    }
    if (/^#{3,6}\s/.test(heading)) {
      fail(file, `"${heading.replace(/^#+\s*/, '').slice(0, 48)}" uses ### or deeper. Only ## is supported`);
    }
  }

  const h2s = headings.filter((h) => /^##\s/.test(h));
  if (h2s.length < 2) {
    fail(file, `needs at least 2 ## headings: the first becomes the section H2, the rest become rows (found ${h2s.length})`);
  }

  /* -- images ------------------------------------------------------------ */

  for (const image of imagesIn(body)) {
    if (!image.src.startsWith('/assets/')) {
      fail(
        file,
        `image "${image.src}" must be a site-absolute /assets/... path. A relative path is not ` +
          'recognized as an image and prints as raw Markdown',
      );
      continue;
    }

    const filename = image.src.split('/').pop();
    const inDiagrams = existsSync(join(diagramsDir, filename));
    const inPeople = existsSync(join(peopleDir, filename));

    if (!inDiagrams && !inPeople) {
      fail(file, `image "${image.src}" has no file at content/assets/diagrams/${filename}`);
      continue;
    }

    // Figures resolve by FILENAME across one flat folder, so a name used by two
    // posts silently renders the wrong image on one of them.
    const seen = figureUse.get(filename);
    if (seen && seen !== file) fail(file, `figure "${filename}" is already used by ${seen}. Prefix it with the post slug`);
    figureUse.set(filename, file);

    if (!image.alt.trim()) {
      fail(file, `image "${image.src}" has empty alt text. There is no caption slot, so the alt carries the meaning`);
    }
    if (inDiagrams && extname(filename) === '.svg') checkSvg(file, filename);
  }

  /* -- links ------------------------------------------------------------- */

  for (const link of linksIn(body)) {
    if (!link.href.startsWith('/') || link.href.startsWith('//')) {
      fail(
        file,
        `link "${link.href}" is not site-absolute. inline() matches a single leading / only, so ` +
          'this prints as raw Markdown. Use /foundation/brand-strategy-positioning, not the full URL',
      );
      continue;
    }
    const path = link.href.split(/[?#]/)[0].replace(/\/$/, '') || '/';
    if (!routes.has(path)) warn(file, `link "${link.href}" does not match a known route`);
  }

  /* -- quote, stat, closing ---------------------------------------------- */

  const quotes = chunks.filter((c) => c.startsWith('>'));
  if (quotes.length > 1) {
    fail(
      file,
      `${quotes.length} blockquotes. Only the FIRST is hoisted into the quote band; the rest are ` +
        'flattened into plain paragraphs and lose their styling',
    );
  }

  const boldOnly = chunks.filter((c) => /^\*\*[^\n]+\*\*$/.test(c));
  const quoteIndex = chunks.findIndex((c) => c.startsWith('>'));
  for (const line of boldOnly) {
    const text = line.replace(/\*\*/g, '');
    const isAttribution = quoteIndex >= 0 && chunks[quoteIndex + 1] === line;
    if (isAttribution) continue;
    if (!/^[\d.,]+\s*(%|x|\+|k|m)?\s+/i.test(text)) {
      warn(
        file,
        `bold line "${text.slice(0, 48)}" does not start with a figure, so it renders as a bold ` +
          'paragraph, not the stat block. Lead with the number to use the stat slot',
      );
    }
  }

  const lastChunk = chunks[chunks.length - 1] ?? '';
  if (/^([-*+#>]|!\[)/.test(lastChunk)) {
    fail(
      file,
      'the file ends on a list, heading, quote or image. The LAST PARAGRAPH is hoisted into the ' +
        'closing statement band, so the post must end on prose',
    );
  }

  /* -- language ---------------------------------------------------------- */

  if (/[—]/.test(source)) fail(file, 'contains an em dash. CLAUDE.md: no em dashes anywhere, ever');
  if (/…|\.\.\./.test(source)) fail(file, 'contains an ellipsis');

  const lower = source.toLowerCase();
  for (const phrase of BANNED) {
    if (lower.includes(phrase)) warn(file, `banned phrase: "${phrase}"`);
  }

  const words = body.replace(/[#*>`\[\]()]/g, ' ').split(/\s+/).filter(Boolean).length;
  if (words < 900 || words > 1800) {
    warn(file, `${words} words. The row grid is built for 1,200 to 1,600`);
  }
}

/* -------------------------------------------------------------------- main */

if (!existsSync(blogDir)) {
  console.log('blog-check: no content/blog directory, nothing to check.');
  process.exit(0);
}

const routes = knownRoutes();
const figureUse = new Map();
const entries = readdirSync(blogDir);
let posts = 0;

for (const name of entries) {
  if (name.startsWith('.')) continue;

  if (statSync(join(blogDir, name)).isDirectory()) {
    fail(
      `content/blog/${name}/`,
      'is a directory. The loader glob is `*.md` and does NOT recurse, so everything inside is ' +
        'invisible: no route, no error. Flatten the post into content/blog/<slug>.md and move its ' +
        'images to content/assets/diagrams/',
    );
    continue;
  }

  if (extname(name) !== '.md') {
    fail(`content/blog/${name}`, 'is not a .md file and does not belong in content/blog/');
    continue;
  }

  posts++;
  checkPost(name, routes, figureUse);
}

for (const message of warnings) console.warn(`  warn   ${message}`);
for (const message of errors) console.error(`  ERROR  ${message}`);

if (errors.length) {
  console.error(`\nblog-check: ${errors.length} error(s) across ${posts} post(s). Build stopped.\n`);
  process.exit(1);
}

console.log(
  `blog-check: ${posts} post(s) OK` + (warnings.length ? `, ${warnings.length} warning(s)` : ''),
);
