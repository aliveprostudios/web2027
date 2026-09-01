# Start Here Pilot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the Start Here plumbing plus the three pages that carry Javad's September and October commercial focus, so every remaining page is a Markdown file and no further code.

**Architecture:** A new `startHere` content collection drives one index route and one dynamic detail route. Each page carries two distinct strings: `need` is the visitor's own sentence, used for the menu and index row, and `title` is Alive Pro's answer, used as the H1. Frontmatter also carries a `services` array of canonical URLs, resolved at build time, so a wrong URL fails the build rather than shipping a dead link.

**Tech Stack:** Astro 7 static output, TypeScript, Zod content schemas, Wrangler for preview. No test framework in this repo: verification is `astro check`, `astro build`, and assertions against `dist/`.

## Global Constraints

- **Canadian English** (colour, behaviour, centre, catalogue), "ize" endings kept.
- **No em dashes anywhere. Ever.**
- No filler. Tone is strategic and authoritative, a partner not a vendor.
- **Never invent copy.** A template slot with no source is omitted, not filled.
- **The content collection is always the source of truth.** Never hard-code a page list.
- **The first paragraph of a page's Markdown IS the H4 lede.** Two to three sentences.
- **Body is two to three short paragraphs, then a closing invitation. Nothing more.**
- **No numbered rows.** Never write `### Heading.` in a Start Here page. `MasterPage`
  turns those into the numbered Slot 4 rows used by service pages, and this section
  is deliberately not that shape. See spec §2b.
- **The close asks for one concrete thing and admits they may not be a fit.**
- `need` is first person singular ("I", "my"). `title` is the answer. **They must never be the same string.**
- Keywords live in the body, never in the headline.
- `seoDescription` must measure **150 to 160 characters**.
- One H1 per page, no skipped heading levels.
- JSON-LD: `WebPage` plus `BreadcrumbList`. **Never `Service`** on a Start Here page.
- Verify through `npm run preview`, not `astro dev`.
- Commit after every task.

## Content status

**All nine pages of copy are already written** in `content/start-here/`, validated
for description length, the no-numbered-rows rule, the em dash rule, and service
URL resolution. Every one of the 28 services is reachable.

That means **this plan is now code only.** No task here writes page copy. Where a
task references a content file, the file exists: read it, do not recreate it.

| File | Menu item |
|---|---|
| `more-leads.md` | I want more leads to grow my sales |
| `need-a-consultant.md` | I need an expert to look at my business |
| `packaging.md` | I need packaging that sells my product |
| `reach-my-audience.md` | I want to reach my ideal audiences |
| `tell-my-story.md` | I need authentic content to tell my story |
| `one-brand.md` | My brand looks different everywhere it shows up |
| `marketing-that-matches.md` | My product is amazing, but my marketing is bad |
| `custom-system.md` | One centralized system to run my business |
| `efficiency.md` | I need efficiency and productivity in my business |

Because all nine exist, the first build produces **10 new routes, not 4**, and the
site goes from 49 routes to 59. Update the counts in Task 4 Step 4 and Task 6
Step 4 accordingly.

---

## File Structure

| File | Responsibility |
|---|---|
| `src/content.config.ts` (modify) | Declare the `startHere` collection and its schema |
| `src/lib/start-here.ts` (create) | Collection queries, URL derivation, service-URL resolver that fails the build |
| `src/pages/start-here/index.astro` (create) | The numbered index, rows labelled by `need` |
| `src/pages/start-here/[slug].astro` (create) | One route per Markdown file, through `MasterPage` |
| `src/lib/nav.ts` (modify) | Prepend the Start Here row, children labelled by `need` |
| `content/start-here/*.md` (create) | The page copy. Source of truth for routes, nav and index |
| `content/work/hero-videos.md` (modify) | Give the section its own video pool |
| `SITEMAP.md`, `CLAUDE.md` (modify) | Record the section |

---

### Task 1: Collection, resolver, and the custom system page

**Files:**
- Modify: `src/content.config.ts`
- Create: `src/lib/start-here.ts`
- Create: `content/start-here/custom-system.md`

**Interfaces:**
- Consumes: `pageFields` from `src/content.config.ts`; `getCollection` from `astro:content`.
- Produces:
  - `startHereEntries(): Promise<CollectionEntry<'startHere'>[]>`
  - `startHereUrl(entry: CollectionEntry<'startHere'>): string`
  - `startHerePages(): Promise<NavChild[]>` (titles are `need`, not `title`)
  - `resolveServices(urls: string[], sourceId: string): Promise<RelatedItem[]>`

- [ ] **Step 1: Add the collection to `src/content.config.ts`**

Insert after the `services` collection definition:

```ts
/**
 * Start Here: need-shaped entry pages that route to the services answering them.
 *
 * Two strings do different jobs. `need` is the VISITOR's sentence, first person,
 * used for the menu item and the index row. `title` is ALIVE PRO's answer, used
 * as the H1. They are deliberately different: the visitor clicks a sentence that
 * sounds like their own thought, and the page replies to it.
 *
 * `services` holds canonical URLs rather than titles, so renaming a service
 * updates every Start Here page with no content edit. Resolved in
 * src/lib/start-here.ts, which throws on an unknown one.
 */
const startHere = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/start-here' }),
  schema: z.object({
    ...pageFields,
    /** The visitor's own sentence. Menu item and index row; never the H1. */
    need: z.string(),
    /** Service URLs this need routes to, in display order. */
    services: z.array(z.string()).min(1),
  }),
});
```

Then change the export line:

```ts
export const collections = { services, landing, pages, blog, startHere };
```

- [ ] **Step 2: Create `src/lib/start-here.ts`**

```ts
import { getCollection, type CollectionEntry } from 'astro:content';
import type { NavChild } from './nav';
import type { RelatedItem } from '../components/RelatedServices.astro';

/**
 * Start Here data, built from the content collection at build time.
 *
 * Adding a Markdown file to content/start-here/ adds its route, its index row
 * and its menu entry with no code change (CLAUDE.md, rule 1).
 */

export type StartHereEntry = CollectionEntry<'startHere'>;

/** Declared in a collection but with NO route file: linking to one 404s. */
const UNROUTED = new Set<string>(['/brand-pulse']);

export function startHereUrl(entry: StartHereEntry): string {
  return entry.data.url ?? `/start-here/${entry.id}`;
}

function byOrderThenTitle(
  a: { data: { order?: number; title: string } },
  b: { data: { order?: number; title: string } },
) {
  const ao = a.data.order ?? Number.MAX_SAFE_INTEGER;
  const bo = b.data.order ?? Number.MAX_SAFE_INTEGER;
  if (ao !== bo) return ao - bo;
  return a.data.title.localeCompare(b.data.title);
}

/** Published entries, in display order. */
export async function startHereEntries(): Promise<StartHereEntry[]> {
  const all = await getCollection('startHere', (e) => e.data.published !== false);
  return all.sort(byOrderThenTitle);
}

/**
 * Menu children. Labelled by `need`, so the menu reads as the visitor's own
 * sentences rather than as nine promises from Alive Pro.
 */
export async function startHerePages(): Promise<NavChild[]> {
  const entries = await startHereEntries();
  return entries.map((e) => ({ title: e.data.need, url: startHereUrl(e) }));
}

/** Every routable URL in the site's collections, mapped to its display title. */
async function urlIndex(): Promise<Map<string, string>> {
  const map = new Map<string, string>();

  for (const e of await getCollection('services', (x) => x.data.published !== false)) {
    const url = e.data.url ?? `/${e.data.category}/${e.id.split('/').pop()}`;
    map.set(url, e.data.navLabel ?? e.data.title);
  }

  for (const e of await getCollection('pages', (x) => x.data.published !== false)) {
    const url = e.data.url ?? `/alive-pro/${e.id}`;
    map.set(url, e.data.navLabel ?? e.data.title);
  }

  return map;
}

/**
 * Turn a page's `services:` URLs into numbered Related rows.
 *
 * Throws rather than rendering a dead link. A typo, an unpublished target, or a
 * URL that no route builds are all build failures, which is the point: the
 * mapping is editorial and lives in Markdown, so the compiler is the only thing
 * standing between a typo and a 404 in production.
 */
export async function resolveServices(urls: string[], sourceId: string): Promise<RelatedItem[]> {
  const index = await urlIndex();

  return urls.map((url, i) => {
    if (UNROUTED.has(url)) {
      throw new Error(
        `content/start-here/${sourceId}.md lists "${url}", which has no route file. ` +
          `Build the route or remove the link.`,
      );
    }
    const title = index.get(url);
    if (!title) {
      throw new Error(
        `content/start-here/${sourceId}.md lists "${url}", which matches no published ` +
          `service or page. Check the URL against the content collection.`,
      );
    }
    return { title, url, num: String(i + 1).padStart(2, '0') };
  });
}
```

- [ ] **Step 3: Create `content/start-here/custom-system.md`**

**Already written: `content/start-here/custom-system.md`.**

The copy exists and is validated. Do not recreate or overwrite it. Read it, confirm the frontmatter matches the Task 1 schema, and move on.

- [ ] **Step 4: Verify the schema and resolver compile**

Run: `npm run check`
Expected: PASS, 0 errors.

- [ ] **Step 5: Prove the resolver fails the build on a bad URL**

Temporarily append one bad URL to the `services` list in `content/start-here/custom-system.md`:

```yaml
  - "/infrastructure/does-not-exist"
```

Run: `npm run build`
Expected: FAIL with `content/start-here/custom-system.md lists "/infrastructure/does-not-exist", which matches no published service or page.`

Remove that line, run `npm run build` again.
Expected: PASS.

This contract is what makes it safe for the editorial mapping to live in Markdown. Do not skip it.

- [ ] **Step 6: Commit**

```bash
git add src/content.config.ts src/lib/start-here.ts content/start-here/custom-system.md
git commit -m "Add the Start Here content collection and the custom system page"
```

---

### Task 2: The detail route

**Files:**
- Create: `src/pages/start-here/[slug].astro`

**Interfaces:**
- Consumes: `startHereEntries`, `startHereUrl`, `resolveServices`; `parseAnatomy`; `MasterPage`.
- Produces: one built route per Markdown file at `/start-here/<id>`.

- [ ] **Step 1: Create `src/pages/start-here/[slug].astro`**

```astro
---
import MasterPage from '../../layouts/MasterPage.astro';
import { parseAnatomy } from '../../lib/anatomy';
import { startHereEntries, startHereUrl, resolveServices } from '../../lib/start-here';

/**
 * One Start Here page per Markdown file.
 *
 * The H1 is `title`, Alive Pro's answer to the need. The visitor's own sentence
 * lives in `need` and is used by the menu and the index, not here: this page is
 * the reply, so repeating the question back would waste the headline.
 *
 * schemaType is WebPage. These are entry points, not offerings, and marking them
 * as Service would put them in competition with the real service pages in the
 * same result set.
 */
export async function getStaticPaths() {
  const entries = await startHereEntries();
  return entries.map((entry) => ({
    params: { slug: entry.id },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const path = startHereUrl(entry);

// `caption: ""` is a placeholder awaiting copy, not a caption.
const caption = entry.data.caption?.trim() || undefined;
const anatomy = parseAnatomy(entry.body ?? '', caption);
const related = await resolveServices(entry.data.services, entry.id);
---

<MasterPage
  title={entry.data.title}
  description={entry.data.seoDescription}
  {path}
  {anatomy}
  {caption}
  {related}
  relatedLabel="Services That Answer This"
  videoId={entry.data.videoId}
  crumb="Start Here"
  breadcrumbs={[
    { name: 'Home', url: '/' },
    { name: 'Start Here', url: '/start-here' },
    { name: entry.data.need, url: path },
  ]}
  footerLabel="All Start Here"
  footerHref="/start-here"
  schemaType="WebPage"
/>
```

Note the breadcrumb uses `need`, not `title`. A breadcrumb is a wayfinding trail back through what the visitor clicked, so it must echo their sentence.

- [ ] **Step 2: Build and confirm the route exists**

Run: `npm run build && ls dist/start-here/`
Expected: `custom-system.html` present.

- [ ] **Step 3: Confirm the H1 is the answer, not the need**

Run:
```bash
grep -c 'One place where the whole business runs' dist/start-here/custom-system.html
grep -c 'One centralized system to run my business' dist/start-here/custom-system.html
grep -o '<h1' dist/start-here/custom-system.html | wc -l
```
Expected: the answer appears at least once; the need appears at least once (the breadcrumb); exactly one `<h1>`.

- [ ] **Step 4: Confirm schema, canonical and service links**

Run:
```bash
grep -o 'href="/infrastructure/[a-z-]*"' dist/start-here/custom-system.html | sort -u
grep -c '"@type":"WebPage"' dist/start-here/custom-system.html
grep -c '"@type":"Service"' dist/start-here/custom-system.html
grep -o 'rel="canonical" href="[^"]*"' dist/start-here/custom-system.html
```
Expected: all four `/infrastructure/` links present; `WebPage` 1 or more; **`Service` exactly 0**; canonical reads `https://aliveprostudios.com/start-here/custom-system`, not the homepage. The old site inherited the homepage canonical everywhere, which is the specific mistake this asserts against (`CLAUDE.md` non-negotiable 4).

- [ ] **Step 5: Confirm the page carries no numbered rows**

Run:
```bash
grep -c 'class="rows"' dist/start-here/custom-system.html
grep -c 'row__num' dist/start-here/custom-system.html
grep -c '<h3' dist/start-here/custom-system.html
```
Expected: **0 for all three.** These pages are prose plus a closing invitation, not
a numbered list of deliverables (spec §2b). `MasterPage.astro:233` gates the rows
section on `anatomy.rows.length > 0`, so writing no `###` headings omits it. A
non-zero count here means a `###` heading crept into the copy.

- [ ] **Step 6: Commit**

```bash
git add src/pages/start-here/\[slug\].astro
git commit -m "Render Start Here pages through the master template"
```

---

### Task 3: The index

**Files:**
- Create: `src/pages/start-here/index.astro`

**Interfaces:**
- Consumes: `startHereEntries`, `startHereUrl`; `clampDescription` from `src/lib/seo.ts`.
- Produces: the route `/start-here`.

- [ ] **Step 1: Create `src/pages/start-here/index.astro`**

Modelled on `src/pages/[section]/index.astro`, the established landing pattern in this repo. Rows are labelled by `need` and subtitled by `title`, so the page reads as a list of the visitor's own sentences, each with the answer underneath.

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import BgRails from '../../components/BgRails.astro';
import SiteNav from '../../components/SiteNav.astro';
import VideoHero from '../../components/VideoHero.astro';
import BookConsult from '../../components/BookConsult.astro';
import NextStep from '../../components/NextStep.astro';
import SiteFooter from '../../components/SiteFooter.astro';
import { startHereEntries, startHereUrl } from '../../lib/start-here';
import { clampDescription } from '../../lib/seo';

/**
 * The Start Here index.
 *
 * Each row leads with the visitor's sentence (`need`) and answers it underneath
 * (`title`). That pairing is the whole section in miniature: they recognize
 * themselves in the first line and get the promise in the second.
 */
const path = '/start-here';

const entries = await startHereEntries();
const rows = entries.map((entry, i) => ({
  num: String(i + 1).padStart(2, '0'),
  need: entry.data.need,
  answer: entry.data.title,
  url: startHereUrl(entry),
}));

const description = clampDescription(
  'Tell us what you are dealing with and we will point you at the work that fixes it.',
);

const schema = [
  {
    '@type': 'CollectionPage',
    '@id': `https://aliveprostudios.com${path}#collection`,
    name: 'Start Here',
    description,
    isPartOf: { '@id': 'https://aliveprostudios.com/#organization' },
  },
];

const breadcrumbs = [
  { name: 'Home', url: '/' },
  { name: 'Start Here', url: path },
];
---

<BaseLayout title="Start Here" {description} {path} {schema} {breadcrumbs}>
  <div class="page-root">
    <BgRails />

    <section class="hero">
      <div class="hero__inner">
        <SiteNav active={path} />
        <div class="hero__copy">
          <p class="hero__crumb t-eyebrow">Start Here</p>
          <h1 class="hero__title t-h1">
            <span class="hero__line-mask">
              <span class="hero__line dot">I need help with</span>
            </span>
          </h1>
        </div>
      </div>
    </section>

    <VideoHero route={path} title="Start Here reel" />

    <main id="main">
      <section class="section">
        <p class="lede t-h4 z-content">{description}</p>
      </section>

      <section class="rows">
        <p class="rows__eyebrow t-eyebrow z-content">
          Where to start&nbsp;&nbsp;<span class="rows__count">({rows.length})</span>
        </p>

        {
          rows.map((row) => (
            <a class="row z-content" href={row.url} data-stack>
              <span class="row__num">{row.num}</span>
              <div class="row__body">
                <h2 class="row__name">
                  {row.need}
                  <span class="row__dot" />
                </h2>
                <p class="row__blurb">{row.answer}</p>
              </div>
              <span class="row__explore">
                <span>Explore Now</span>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M7 17L17 7M9 7h8v8"></path>
                </svg>
              </span>
            </a>
          ))
        }
        <div class="rows__end"></div>
      </section>

      <BookConsult />
    </main>

    <NextStep sectionNum="01" />
    <SiteFooter nextLabel={rows[0]?.need ?? 'All Services'} nextHref={rows[0]?.url ?? '/'} />
  </div>
</BaseLayout>

<style>
  .hero {
    position: relative;
    background: linear-gradient(180deg, var(--surface-hero-top) 0%, var(--surface-hero-bottom) 100%);
    color: #fff;
    padding-bottom: 88px;
    overflow: hidden;
  }
  .hero__inner { position: relative; z-index: var(--z-nav); }
  .hero__copy { padding: 56px var(--gutter) 0; }
  .hero__crumb {
    color: var(--brand-lime);
    margin: 0 0 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--brand-orange);
    width: fit-content;
    animation: heroFade 800ms var(--ease-settle) both 100ms;
  }
  .hero__title { margin: 0; }
  .hero__line-mask { display: block; overflow: hidden; }
  .hero__line { display: block; animation: heroRise var(--dur-hero) var(--ease-settle) both 150ms; }

  .lede { max-width: 760px; margin: 0; }

  .rows { padding: 0 var(--gutter) 64px; }
  .rows__eyebrow { color: var(--pg-fg); margin: 0 0 40px; }
  .rows__count { color: var(--pg-fg3); }

  .row {
    display: grid;
    grid-template-columns: var(--col-num) 1fr auto;
    gap: clamp(24px, 3vw, 56px);
    align-items: center;
    border-top: 1px solid var(--pg-line);
    padding: 40px 0;
    text-decoration: none;
    color: var(--pg-fg);
    transform: translateX(0);
    transition: transform var(--dur-micro) var(--ease-settle), color var(--dur-micro) ease;
  }
  .row:hover { transform: translateX(12px); color: var(--orange-ink); }

  .row__num { font-family: var(--font-mono); font-size: 13px; color: var(--pg-fg3); }

  /* Row titles are full sentences here, not two-word service names, so the
     scale sits below the section landings' clamp(28px, 3.6vw, 60px). */
  .row__name {
    margin: 0;
    font-size: clamp(24px, 2.6vw, 42px);
    font-weight: 200;
    letter-spacing: -0.01em;
    line-height: 1.1;
    color: inherit;
    text-transform: none;
  }
  .row__dot {
    display: inline-block;
    width: 0.14em;
    height: 0.14em;
    margin-left: 0.06em;
    background: var(--brand-orange);
    border-radius: 999px;
  }

  .row__blurb {
    margin: 10px 0 0;
    font-size: 17px;
    line-height: 1.6;
    color: var(--pg-fg2);
    max-width: 620px;
  }

  .row__explore {
    display: flex;
    align-items: center;
    gap: 14px;
    flex: none;
    color: var(--orange-ink);
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    transform: translate(0, 0);
    transition: transform var(--dur-micro) var(--ease-settle);
  }
  .row:hover .row__explore { transform: translate(4px, -4px); }

  .rows__end { border-top: 1px solid var(--pg-line); }

  @media (max-width: 760px) {
    .row__explore { margin-left: 68px; }
  }
</style>
```

- [ ] **Step 2: Build and confirm the index pairs need with answer**

Run:
```bash
npm run build
grep -c 'One centralized system to run my business' dist/start-here.html
grep -c 'One place where the whole business runs' dist/start-here.html
```
Expected: both appear. The need is the row heading, the answer is the line underneath.

- [ ] **Step 3: Commit**

```bash
git add src/pages/start-here/index.astro
git commit -m "Add the Start Here index"
```

---

### Task 4: The navigation row

**Files:**
- Modify: `src/lib/nav.ts`

**Interfaces:**
- Consumes: `startHerePages` from `src/lib/start-here.ts`.
- Produces: a `Start Here` row numbered `01`, sections renumbering to `02` through `05`.

- [ ] **Step 1: Import the helper at the top of `src/lib/nav.ts`**

```ts
import { startHerePages } from './start-here';
```

This is a runtime import in one direction only. `start-here.ts` imports `NavChild` from `nav.ts` with `import type`, which is erased at compile time, so there is no runtime cycle.

- [ ] **Step 2: Prepend the row inside `navItems()`**

Replace the `const rows: Omit<NavItem, 'num'>[] = [` block with:

```ts
  const rows: Omit<NavItem, 'num'>[] = [
    // Children are labelled by `need`, so the menu reads as nine first-person
    // sentences rather than nine promises. See src/lib/start-here.ts.
    { label: 'Start Here', url: '/start-here', children: await startHerePages() },
    ...sectionItems,
    { label: 'Work', url: '/work', children: await workPages() },
    { label: 'Alive Pro', url: '/alive-pro', children: await aliveProPages() },
    { label: 'Resources', url: '/resources', children: await resourcesPages() },
    { label: 'Contact', url: '/contact', children: [] },
  ];
```

- [ ] **Step 3: Confirm Start Here precedes Foundation and carries the overview child**

Run:
```bash
npm run build
python3 -c "
h = open('dist/index.html').read()
sh, fo = h.find('Start Here'), h.find('Foundation')
assert 0 <= sh < fo, f'order wrong: Start Here {sh}, Foundation {fo}'
assert 'Start Here Overview' in h, 'overview child missing'
assert 'One centralized system to run my business' in h, 'menu not using need'
print('OK: Start Here first, overview present, menu labelled by need')
"
```
Expected: `OK:` line printed, no assertion error.

- [ ] **Step 4: Confirm nothing else broke**

Run: `npm run check && npm run build`
Expected: check passes with 0 errors. Build reports 51 pages: the 49 existing plus `/start-here` and `/start-here/custom-system`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/nav.ts
git commit -m "Put Start Here first in the main navigation"
```

---

### Task 5: The efficiency and leads pages

**Files:**
- Create: `content/start-here/efficiency.md`
- Create: `content/start-here/more-leads.md`

**Interfaces:**
- Consumes: the `startHere` schema from Task 1. No code changes: both routes come from the existing `[slug].astro`.
- Produces: `/start-here/efficiency` and `/start-here/more-leads`.

- [ ] **Step 1: Create `content/start-here/efficiency.md`**

**Already written: `content/start-here/efficiency.md`.**

The copy exists and is validated. Do not recreate or overwrite it. Read it, confirm the frontmatter matches the Task 1 schema, and move on.

- [ ] **Step 2: Create `content/start-here/more-leads.md`**

**Already written: `content/start-here/more-leads.md`.**

The copy exists and is validated. Do not recreate or overwrite it. Read it, confirm the frontmatter matches the Task 1 schema, and move on.

- [ ] **Step 3: Build and confirm three pages exist**

Run: `npm run build && ls dist/start-here/`
Expected: `custom-system.html`, `efficiency.html`, `more-leads.html`.

- [ ] **Step 4: Confirm index ordering follows `order`**

Run: `python3 -c "
import re
h = open('dist/start-here.html').read()
needs = re.findall(r'row__name\"[^>]*>\s*([^<]+)', h)
print([n.strip() for n in needs])
"`
Expected: leads first (`order: 1`), then custom system (`order: 8`), then efficiency (`order: 9`).

- [ ] **Step 5: Confirm every `need` differs from its `title`**

Run:
```bash
python3 -c "
import glob, re, sys
bad = []
for f in sorted(glob.glob('content/start-here/*.md')):
    t = open(f).read()
    title = re.search(r'^title:\s*\"(.*)\"\s*\$', t, re.M).group(1)
    need  = re.search(r'^need:\s*\"(.*)\"\s*\$', t, re.M).group(1)
    print(f'{f}\n  need : {need}\n  title: {title}')
    if title.strip().lower() == need.strip().lower(): bad.append(f)
sys.exit(1 if bad else 0)
"
```
Expected: three pairs printed, each visibly different, exit code 0.

- [ ] **Step 6: Confirm meta descriptions and the em dash rule**

Run:
```bash
python3 -c "
import glob, re, sys
bad = []
for f in sorted(glob.glob('content/start-here/*.md')):
    m = re.search(r'^seoDescription:\s*\"(.*)\"\s*\$', open(f).read(), re.M)
    n = len(m.group(1)) if m else 0
    print(f'{n:4d}  {f}')
    if not 150 <= n <= 160: bad.append(f)
sys.exit(1 if bad else 0)
"
grep -l $'\u2014' content/start-here/*.md; echo "em dash exit $?"
```
Expected: three lines each between 150 and 160, exit 0; no filenames from the grep, which exits 1.

- [ ] **Step 7: Commit**

```bash
git add content/start-here/efficiency.md content/start-here/more-leads.md
git commit -m "Add the efficiency and lead generation Start Here pages"
```

---

### Task 6: Hero videos, documentation, and full verification

**Files:**
- Modify: `content/work/hero-videos.md`
- Modify: `SITEMAP.md`
- Modify: `CLAUDE.md`

- [ ] **Step 1: Give the section its own video pool**

In `content/work/hero-videos.md`, add immediately before `## Foundation`. Reuse two URLs already present in the file, so nothing depends on an unverified video ID:

```markdown
## Start Here

https://vimeo.com/943871850
https://vimeo.com/465976202
```

`slugifySection("Start Here")` yields `start-here`, which matches `sectionForRoute("/start-here/...")`. Without this heading the section falls to `## Default`, which works but gives every page the same video.

- [ ] **Step 2: Record the routes in `SITEMAP.md`**

Add immediately after the `## Top level` table:

```markdown
---

## Start Here (3 of 9 built)

Need-shaped entry pages. Design spec:
`docs/superpowers/specs/2026-08-24-start-here-section-design.md`

| URL | Menu item | Content |
|---|---|---|
| `/start-here` | index | derived from the collection |
| `/start-here/more-leads` | I want more leads to grow my sales | `content/start-here/more-leads.md` |
| `/start-here/custom-system` | One centralized system to run my business | `content/start-here/custom-system.md` |
| `/start-here/efficiency` | I need efficiency and productivity in my business | `content/start-here/efficiency.md` |

The remaining 6 pages are specified but not written. Adding one is adding a
Markdown file: no code change, no route change, no redirect.
```

Then update the `**Totals:**` line:

```markdown
**Totals:** 28 service pages · 8 Alive Pro pages · 4 Start Here pages · 3 blog posts · 26 videos · 63 redirects
```

- [ ] **Step 3: Record the section in `CLAUDE.md`**

Change the route count line in `## Current state`:

```markdown
**LIVE at https://aliveprostudios.com since 2026-08-24. 53 routes, 83 redirects.**
```

Add one row to the Known gaps table:

```markdown
| **Start Here at 3 of 9 pages** | Section shipped with the two custom-system pages that carry the Sept/Oct manufacturing focus, plus lead generation. The other 6 are specified in `docs/superpowers/specs/2026-08-24-start-here-section-design.md` and each is one Markdown file, no code. A page's `need` is the visitor's sentence and drives the menu; its `title` is the answer and is the H1. They must never match |
```

- [ ] **Step 4: Full build**

Run: `npm run check && npm run build`
Expected: check passes with 0 errors. Build reports **53 pages**.

- [ ] **Step 5: Confirm the new URLs reach the XML sitemap**

Run: `grep -o '/start-here[a-z/-]*' dist/sitemap-0.xml | sort -u`
Expected: four lines. The `@astrojs/sitemap` integration picks them up automatically; only `/thank-you` is filtered.

- [ ] **Step 6: Verify through the real preview server**

Run: `npm run preview`

Check in the browser, because the build cannot assert these:

1. `/start-here` lists three rows, each showing the need with the answer beneath
2. The menu shows Start Here as `01` reading as first-person sentences, and Foundation through Infrastructure as `02` to `05`
3. Every service link on all three pages loads a real page, no 404s
4. Keyboard tab order moves through the index with a visible focus ring
5. The hero video plays and respects `prefers-reduced-motion`
6. All three pages render at 375px wide with no horizontal scroll

Stop the server when finished.

- [ ] **Step 7: Commit**

```bash
git add content/work/hero-videos.md SITEMAP.md CLAUDE.md
git commit -m "Ship Start Here with its hero videos and documentation"
```

---

## Deferred, and why

**The remaining six Tier A pages.** Specified in §3 of the design spec: packaging (copy already drafted in the previous revision of this plan, recoverable from git history at `a649567`), consultant, reach my audience, tell my story, one brand, marketing that matches. Each is one Markdown file against the Task 1 schema.

**Tier B, eleven pages.** Archived in the previous spec revision. Tier A covers all 28 services on its own, so Tier B is optional rather than required. AI is the largest single opportunity in it, at roughly 21,600 searches a month.

**Manufacturing keyword research.** The DataForSEO account returned HTTP 402, out of credit, on 2026-08-24. No volume figures exist for custom software development, manufacturing software, ERP for manufacturing, or related terms. **Run this before committing paid search budget to the September and October push.**

**Brand Pulse.** Declares `url: "/brand-pulse"` with no route file. It is a five-question scored diagnostic with four result bands, so it is an interactive application and this site ships no client-side JavaScript. Removed from page 02's routing. The `UNROUTED` set fails the build if anything links to it before the route exists.

**Reputation Management keyword work.** Independent of this plan. The existing `/growth/reputation-management` page should target "online reputation management", roughly 4,720 searches a month at a $95.35 cost per click, the most expensive keyword measured.
