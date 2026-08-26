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
if (formOrigins.size > 0) {
  console.log(`postbuild: contact form endpoint allowed in connect-src (${[...formOrigins].join(', ')})`);
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
  "form-action 'self'",
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

const width = Math.max(...redirects.map((r) => r.from.length));
const redirectFile = `# GENERATED by scripts/postbuild.mjs from the redirect table in SITEMAP.md.
# Do not edit by hand: edit SITEMAP.md and rebuild.
# ${redirects.length} redirects preserving the old WordPress URLs.

${redirects.map((r) => `${r.from.padEnd(width)}  ${r.to}  ${r.code}`).join('\n')}
`;

writeFileSync(join(dist, '_redirects'), redirectFile);

console.log(
  `postbuild: _headers (${hashes.size} CSP script hashes${isStaging ? ', staging noindex' : ''}) ` +
    `and _redirects (${redirects.length}) written to dist/`,
);
