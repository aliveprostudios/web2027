/**
 * Generate `dist/_headers` and `dist/_redirects` for Cloudflare.
 *
 * Both are GENERATED, never hand-edited:
 *
 *  - `_redirects` is derived from the redirect table in SITEMAP.md, so the
 *    sitemap stays the single source of truth. Losing these 301s discards years
 *    of SEO equity on the old WordPress URLs.
 *
 *  - `_headers` carries a CSP whose script hashes are computed from the built
 *    HTML. Hand-maintaining hashes guarantees they drift the first time a
 *    component script changes; computing them means the CSP is always exact and
 *    never needs 'unsafe-inline'.
 *
 * Staging builds additionally get `X-Robots-Tag: noindex`. A crawlable staging
 * copy is duplicate content competing with the real site.
 *
 * Run: node scripts/postbuild.mjs   (wired into `npm run build`)
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');

/* ------------------------------------------------------------ staging flag */

// Cloudflare sets one of these on a build. Anything that is not the production
// branch is treated as staging.
const branch =
  process.env.WORKERS_CI_BRANCH ?? process.env.CF_PAGES_BRANCH ?? process.env.BRANCH ?? '';
const isStaging = process.env.STAGING === '1' || (branch !== '' && branch !== 'main');

/* --------------------------------------------------------------- CSP hashes */

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (entry.endsWith('.html')) out.push(full);
  }
  return out;
}

const pages = walk(dist);

// CSP applies only to scripts the browser EXECUTES. `application/ld+json` and
// `application/json` are data blocks, so they are deliberately not hashed.
const DATA_TYPES = new Set(['application/ld+json', 'application/json']);
const hashes = new Set();

for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  for (const match of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
    const [, attrs, body] = match;
    if (/\ssrc=/.test(attrs) || body.trim() === '') continue;
    const type = attrs.match(/type="([^"]+)"/)?.[1] ?? 'text/javascript';
    if (DATA_TYPES.has(type)) continue;
    hashes.add(`'sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}'`);
  }
}

/* ------------------------------------------------------- form endpoint origin */

// The contact form POSTs to a hosted endpoint whose URL lives in ONE place,
// FORM_ENDPOINT in src/pages/contact.astro, which renders it onto the form as
// `data-endpoint`. Read it back out of the built HTML so `connect-src` cannot
// drift from it. Without this, setting the endpoint would ship a form whose
// every submission is blocked by the CSP, and the failure is invisible until
// someone opens the console.
const formOrigins = new Set();
for (const page of pages) {
  const endpoint = readFileSync(page, 'utf8').match(/data-endpoint="(https:\/\/[^"]+)"/)?.[1];
  if (!endpoint) continue;
  try {
    formOrigins.add(new URL(endpoint).origin);
  } catch {
    throw new Error(`postbuild: FORM_ENDPOINT is not a valid URL: ${endpoint}`);
  }
}

const connectSrc = ["'self'", ...[...formOrigins].sort()].join(' ');

// The same origins also belong in `form-action`, because the form now carries a
// real `action` and `method="post"` as a no-JavaScript fallback. `connect-src`
// governs the fetch() path only; a NATIVE form POST is governed by
// `form-action`, and with `'self'` alone the browser blocks the fallback
// silently, which would make it worse than useless. Derived from the same set
// so the two can never disagree.
const formAction = ["'self'", ...[...formOrigins].sort()].join(' ');
if (formOrigins.size > 0) {
  console.log(
    `postbuild: contact form endpoint allowed in connect-src and form-action (${[...formOrigins].join(', ')})`,
  );
}

// Google Tag Manager, added 2026-08-25. The container fires GA4, Google Ads
// conversion tracking and the LinkedIn Insight Tag, and GTM injects some of
// those as INLINE scripts from Custom HTML tags. A build-time hash cannot cover
// those: their contents live in the GTM container, which changes without ever
// rebuilding this site.
//
// 'strict-dynamic' is the way out. The GTM snippet in BaseLayout is hashed
// above, and strict-dynamic propagates that trust to everything it goes on to
// inject, however deep. Editing the container therefore cannot break the CSP,
// and script-src still needs neither 'unsafe-inline' nor a host allowlist.
//
// This is only safe because EVERY script this site emits is inline and hashed.
// strict-dynamic makes modern browsers ignore 'self' and host sources, so a
// parser-inserted <script src> would be blocked; the guard below fails the
// build if one ever appears.
const external = [];
for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  for (const m of html.matchAll(/<script[^>]*\ssrc="([^"]+)"[^>]*>/g)) {
    if (!/^https?:\/\//.test(m[1])) external.push(`${page}: ${m[1]}`);
  }
}
if (external.length > 0) {
  throw new Error(
    "postbuild: script-src uses 'strict-dynamic', which makes browsers ignore " +
      "'self'. These parser-inserted scripts would be blocked at runtime:\n  " +
      external.slice(0, 5).join('\n  '),
  );
}

// Beacon destinations. strict-dynamic covers script-src only, so the pixels and
// fetches each tag sends still need img-src and connect-src. Google's
// remarketing pings go to the visitor's local Google TLD, so the markets this
// site serves are listed; a visitor elsewhere loses that one ping, not GA4 or
// conversion tracking.
const GOOGLE_TLDS = [
  'https://www.google.com',
  'https://www.google.ca',
  'https://www.google.de',
  'https://www.google.ae',
];
// A wildcard host does NOT match the bare domain: 'https://*.analytics.google.com'
// leaves analytics.google.com itself blocked, which is where GA4 actually sends
// its events. Both forms are listed wherever that applies.
const ANALYTICS = [
  'https://*.google-analytics.com',
  'https://www.google-analytics.com',
  'https://analytics.google.com',
  'https://*.analytics.google.com',
  'https://*.googletagmanager.com',
  'https://*.doubleclick.net',
];
// The container also fires the LinkedIn Insight Tag and a Meta pixel.
const SOCIAL = [
  'https://px.ads.linkedin.com',
  'https://www.linkedin.com',
  'https://snap.licdn.com',
  'https://www.facebook.com',
  'https://connect.facebook.net',
];
const MARKETING = {
  // Kept for browsers too old to understand strict-dynamic, which fall back to
  // the host allowlist.
  script: [
    'https://*.googletagmanager.com',
    'https://*.doubleclick.net',
    'https://www.googleadservices.com',
    'https://snap.licdn.com',
    'https://connect.facebook.net',
  ],
  img: [...ANALYTICS, ...SOCIAL, ...GOOGLE_TLDS],
  connect: [...ANALYTICS, ...SOCIAL, ...GOOGLE_TLDS],
  frame: ['https://www.googletagmanager.com', 'https://td.doubleclick.net'],
};

const csp = [
  "default-src 'self'",
  `script-src 'strict-dynamic' 'self' ${MARKETING.script.join(' ')} ${[...hashes].sort().join(' ')}`,
  // Inline style ATTRIBUTES are used for the rails and the video aspect vars.
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  `img-src 'self' data: ${MARKETING.img.join(' ')}`,
  `frame-src https://player.vimeo.com https://www.youtube-nocookie.com ${MARKETING.frame.join(' ')}`,
  `connect-src ${connectSrc} ${MARKETING.connect.join(' ')}`,
  "object-src 'none'",
  "base-uri 'self'",
  `form-action ${formAction}`,
  "frame-ancestors 'none'",
  'upgrade-insecure-requests',
].join('; ');

const headers = `# GENERATED by scripts/postbuild.mjs — do not edit by hand.
# CSP script hashes are computed from the built HTML on every build.
${isStaging ? `# Staging build (branch: ${branch || 'unknown'}) — indexing disabled.\n` : ''}
/*
  Content-Security-Policy: ${csp}
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  X-Frame-Options: DENY
  Strict-Transport-Security: max-age=31536000
  Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
${isStaging ? '  X-Robots-Tag: noindex, nofollow\n' : ''}
# Astro fingerprints these filenames, so they can be cached forever.
/_astro/*
  Cache-Control: public, max-age=31536000, immutable
`;

// Cloudflare rejects a `_headers` line over 2000 characters (error 100324), and the
// CSP line grows by about 60 characters per distinct inline script hash. This failed
// the 2026-11-25 staging deploy while `npm run build` passed locally, so fail here.
for (const [i, line] of headers.split('\n').entries()) {
  if (line.length > 2000) {
    throw new Error(
      `postbuild: _headers line ${i + 1} is ${line.length} characters; Cloudflare's limit is 2000. ` +
        'A new distinct inline <script> adds a CSP hash. Reuse an existing script byte for byte, or trim the CSP.',
    );
  }
}
writeFileSync(join(dist, '_headers'), headers);

/* ------------------------------------------------------------- robots.txt */

// Generated rather than kept in public/, because the two environments need
// OPPOSITE files and a static one would ship the wrong answer to one of them.
// Staging is already noindex via the header above; this closes the crawl path
// as well, since a header only helps once a crawler has fetched the page.
const robots = isStaging
  ? `# Staging build${branch ? ` (branch: ${branch})` : ''}. Not for indexing.
User-agent: *
Disallow: /
`
  : `# https://aliveprostudios.com
User-agent: *
Allow: /

Sitemap: https://aliveprostudios.com/sitemap-index.xml
`;

writeFileSync(join(dist, 'robots.txt'), robots);

/* ---------------------------------------------------------------- llms.txt */

// A map of the site for AI answer engines (https://llmstxt.org). GENERATED, so
// it can never drift from the site: the page list is the built sitemap, every
// title and description is the page's own <title> and meta description,
// verbatim, and the order is the menu's order as rendered on the home page.
// Nothing here is hand-written copy. Adding a page adds its line; renaming a
// page or reordering the menu reorders this file with no edit to this script.
//
// Grouping is by URL: a page belongs to the section whose landing page its path
// sits under (/growth/lead-generation under /growth). A landing page with no
// children (/services, /contact) is listed under "Main pages". Pages that are
// not in the menu (blog posts, Common Questions topics) still appear, after
// their section's menu entries. /privacy-policy goes under "Optional", which is
// the llms.txt convention for links an engine may skip.
//
// Wrapped in its own scope: this file is one long top-level script, and names
// like `pages` and `line` are already taken further down.

const llmsSummary = (() => {
const SITE = 'https://aliveprostudios.com';
const TITLE_SUFFIX = / \| Alive ProStudios$/;

const decode = (s) =>
  s
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');

/** `/growth/lead-generation` -> dist/growth/lead-generation.html (build.format 'file'). */
const htmlFor = (path) => join(dist, path === '/' ? 'index.html' : `${path}.html`);

function readPage(path) {
  const html = readFileSync(htmlFor(path), 'utf8');
  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '').replace(TITLE_SUFFIX, '').trim();
  const description = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '').trim();
  if (!title) throw new Error(`llms.txt: ${path} has no <title>`);
  return { path, title, description };
}

const sitemapPaths = [
  ...readFileSync(join(dist, 'sitemap-0.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g),
].map(([, loc]) => loc.replace(SITE, '').replace(/\/$/, '') || '/');

const homeHtml = readFileSync(htmlFor('/'), 'utf8');
const menuOrder = [
  ...homeHtml.matchAll(/<a href="(\/[^"#]*)" class="menu__(?:home|link|sublink)"/g),
].map(([, href]) => href);
const rank = (p) => {
  const i = menuOrder.indexOf(p);
  return i === -1 ? Number.MAX_SAFE_INTEGER : i;
};

const pages = sitemapPaths
  .map(readPage)
  .sort((a, b) => rank(a.path) - rank(b.path) || a.path.localeCompare(b.path));

// A section is any depth-1 page that other pages sit under.
const isSection = (p) =>
  p !== '/' && p.split('/').length === 2 && sitemapPaths.some((q) => q.startsWith(`${p}/`));
const sectionOf = (p) => {
  const top = `/${p.split('/')[1]}`;
  return isSection(top) ? top : null;
};

const OPTIONAL = new Set(['/privacy-policy']);
const main = pages.filter((p) => !OPTIONAL.has(p.path) && !sectionOf(p.path));
const sections = pages.filter((p) => isSection(p.path));
const optional = pages.filter((p) => OPTIONAL.has(p.path));

const line = (p) => `- [${p.title}](${SITE}${p.path === '/' ? '/' : p.path})${p.description ? `: ${p.description}` : ''}`;

// Facts for the header come from the Organization node the site already emits.
const orgNode = (() => {
  for (const [, raw] of homeHtml.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    const json = JSON.parse(raw);
    const nodes = Array.isArray(json['@graph']) ? json['@graph'] : [json];
    const org = nodes.find((n) => n['@type'] === 'Organization' && n.name);
    if (org) return org;
  }
  return null;
})();
if (!orgNode) throw new Error('llms.txt: no Organization node in the home page JSON-LD');

const home = pages.find((p) => p.path === '/');
const addr = orgNode.address ?? {};
const facts = [
  addr.addressLocality && `Location: ${[addr.addressLocality, addr.addressRegion, addr.addressCountry].filter(Boolean).join(', ')}`,
  orgNode.foundingDate && `Founded: ${orgNode.foundingDate}`,
  orgNode.telephone && `Phone: ${orgNode.telephone}`,
  orgNode.email && `Email: ${orgNode.email}`,
].filter(Boolean);

const llms = [
  `# ${orgNode.name.replace(/ Inc\.?$/, '')}`,
  '',
  `> ${home.description}`,
  '',
  ...facts.map((f) => `- ${f}`),
  '',
  '## Main pages',
  '',
  ...main.map(line),
  ...sections.flatMap((s) => [
    '',
    `## ${s.title}`,
    '',
    ...pages.filter((p) => sectionOf(p.path) === s.path).map(line),
  ]),
  '',
  '## Optional',
  '',
  ...optional.map(line),
  `- [Sitemap](${SITE}/sitemap-index.xml): Every indexable URL on the site.`,
  '',
].join('\n');

const listed = main.length + optional.length + sections.reduce((n, s) => n + pages.filter((p) => sectionOf(p.path) === s.path).length, 0);
if (listed !== sitemapPaths.length) {
  throw new Error(`llms.txt lists ${listed} pages but the sitemap has ${sitemapPaths.length}`);
}

writeFileSync(join(dist, 'llms.txt'), llms);
return { pages: sitemapPaths.length, sections: sections.length };
})();

/* --------------------------------------------------------- sitemap lastmod */

// `<lastmod>` only where the page itself declares a real date: its Article's
// `dateModified`, else `datePublished` (blog posts and case studies). Read from
// the built page's own JSON-LD, so the sitemap can never disagree with the
// page. Every other URL gets none: a build timestamp on every URL tells a
// crawler that everything changed on every deploy, which teaches it to ignore
// the field. Added 2026-11-15 (audit finding 12).
const lastmodCount = (() => {
  const SITE = 'https://aliveprostudios.com';
  const file = join(dist, 'sitemap-0.xml');
  let count = 0;
  const xml = readFileSync(file, 'utf8').replace(/<url><loc>([^<]+)<\/loc>(?!<lastmod>)/g, (whole, loc) => {
    const path = loc.replace(SITE, '').replace(/\/$/, '') || '/';
    const html = readFileSync(join(dist, path === '/' ? 'index.html' : `${path}.html`), 'utf8');
    for (const [, raw] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      const json = JSON.parse(raw);
      const nodes = Array.isArray(json['@graph']) ? json['@graph'] : [json];
      const article = nodes.find((n) => n['@type'] === 'Article');
      const date = article?.dateModified ?? article?.datePublished;
      if (date) {
        count++;
        return `${whole}<lastmod>${date}</lastmod>`;
      }
    }
    return whole;
  });
  writeFileSync(file, xml);
  return count;
})();

/* ----------------------------------------------------------------- redirects */

const sitemap = readFileSync(join(root, 'SITEMAP.md'), 'utf8');
const table = sitemap.slice(sitemap.indexOf('| From | To | Code |'));

const redirects = [];
for (const line of table.split('\n')) {
  const row = line.match(/^\|\s*`([^`]+)`\s*\|\s*`([^`]+)`\s*\|\s*(\d{3})\s*\|/);
  if (row) redirects.push({ from: row[1], to: row[2], code: row[3] });
}

if (redirects.length === 0) {
  throw new Error('postbuild: no redirects parsed from SITEMAP.md — refusing to ship an empty _redirects');
}

// A row that LOOKS like a redirect but does not parse is dropped in silence,
// which is how `| `/services` | `/alive-pro/our-system` | **302** |` shipped as
// nothing on 2026-09-06: the bold markers around the status code meant the row
// never matched, the build said nothing, and the URL kept 404ing. Any line
// starting with a backticked path in a table row must parse or fail loudly.
const malformed = [];
for (const line of table.split('\n')) {
  if (!/^\|\s*`\//.test(line)) continue;
  if (!/^\|\s*`([^`]+)`\s*\|\s*`([^`]+)`\s*\|\s*(\d{3})\s*\|/.test(line)) {
    malformed.push(line.trim());
  }
}
if (malformed.length > 0) {
  throw new Error(
    'postbuild: redirect rows in SITEMAP.md that do not parse (status code must be bare digits):\n  ' +
      malformed.join('\n  '),
  );
}

// A duplicate `from` is silently harmless in _redirects (first match wins) and
// silently wrong in SITEMAP.md, where it means two rows disagree about a URL or
// one was added twice. Caught by hand during the 2026-09-02 audit and again on
// 2026-09-06 when /partnership-new was re-added; a build failure is cheaper than
// an audit. Checked before the slash twins are generated, since those are
// derived and would double every report.
const seen = new Map();
const duplicates = [];
for (const r of redirects) {
  if (seen.has(r.from)) duplicates.push(`${r.from} -> ${seen.get(r.from)} AND ${r.to}`);
  else seen.set(r.from, r.to);
}
if (duplicates.length > 0) {
  throw new Error(
    `postbuild: duplicate redirect sources in SITEMAP.md:\n  ${duplicates.join('\n  ')}`,
  );
}

/**
 * Every rule also gets a trailing-slash twin.
 *
 * WordPress published every URL with a trailing slash, so that is the form
 * Google indexed and the form old inbound links still use. `_redirects` matches
 * the path EXACTLY, and `html_handling: "drop-trailing-slash"` in wrangler.jsonc
 * only normalises paths that resolve to a built ASSET, which a redirect SOURCE
 * by definition does not. So `/about-us` returned 301 while `/about-us/`
 * returned 404, on every rule, silently, for the life of the site. The old URLs
 * that carry the SEO equity are precisely the ones that were failing.
 *
 * Measured against production 2026-09-06: 86 of 86 rules worked bare and 404'd
 * with the slash, which is exactly what Search Console was reporting as
 * "Not found (404)". Verified by testing every rule in both forms rather than
 * sampling. The 2026-09-02 audit DID sample trailing slashes, but on service
 * pages, where the asset handler does normalise, and so concluded it was fine.
 *
 * Skips `/` (its twin is itself) and any wildcard source, where a twin would
 * either duplicate or shadow the pattern.
 */
const expanded = [];
for (const r of redirects) {
  expanded.push(r);
  if (r.from !== '/' && !r.from.endsWith('/') && !r.from.includes('*')) {
    expanded.push({ ...r, from: `${r.from}/` });
  }
}

const width = Math.max(...expanded.map((r) => r.from.length));
const redirectFile = `# GENERATED by scripts/postbuild.mjs from the redirect table in SITEMAP.md.
# Do not edit by hand: edit SITEMAP.md and rebuild.
# ${redirects.length} redirects preserving the old WordPress URLs,
# each emitted twice: bare and with a trailing slash, because WordPress
# published the slash form and _redirects matches the path exactly.
# ${expanded.length} rules total.

${expanded.map((r) => `${r.from.padEnd(width)}  ${r.to}  ${r.code}`).join('\n')}
`;

writeFileSync(join(dist, '_redirects'), redirectFile);

console.log(
  `postbuild: _headers (${hashes.size} CSP script hashes${isStaging ? ', staging noindex' : ''}) ` +
    `and _redirects (${redirects.length} rules, ${expanded.length} with slash twins) written to dist/`,
);
console.log(`postbuild: llms.txt (${llmsSummary.pages} pages, ${llmsSummary.sections} sections) written to dist/`);
console.log(`postbuild: sitemap lastmod set on ${lastmodCount} URLs (pages that declare a real date)`);
