# Start Here Pilot Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the Start Here section's full plumbing plus its first three pages, so every remaining page is a Markdown file and no further code.

**Architecture:** A new `startHere` content collection drives one index route and one dynamic detail route, exactly as `services` drives `/[section]`. Each page's Markdown frontmatter carries a `services` array of canonical URLs, resolved against the `services` and `pages` collections at build time, so a wrong URL fails the build rather than shipping a dead link. One row is prepended to the nav.

**Tech Stack:** Astro 7 static output, TypeScript, Zod content schemas, Wrangler for preview. No test framework in this repo: verification is `astro check`, `astro build`, and assertions against `dist/`.

## Global Constraints

- **Canadian English** (colour, behaviour, centre, catalogue), "ize" endings kept.
- **No em dashes anywhere. Ever.**
- No filler. Tone is strategic and authoritative, a partner not a vendor.
- **Never invent copy.** A template slot with no source is omitted, not filled.
- **The content collection is always the source of truth.** Never hard-code a list of pages.
- **The first paragraph of a page's Markdown IS the H4 lede.** Two to three sentences.
- Headlines carry the need. Keywords live in the body. A headline never names a service.
- `seoDescription` must measure **150 to 160 characters**.
- One H1 per page, no skipped heading levels.
- JSON-LD on every page: `WebPage` plus `BreadcrumbList`. **Never `Service`** on a Start Here page.
- Verify through `npm run preview`, not `astro dev`. A plain dev server applies neither `_headers` nor `_redirects`.
- Commit after every task.

## File Structure

| File | Responsibility |
|---|---|
| `src/content.config.ts` (modify) | Declare the `startHere` collection and its schema |
| `src/lib/start-here.ts` (create) | Collection queries, URL derivation, and the service-URL resolver that fails the build |
| `src/pages/start-here/index.astro` (create) | The two-tier index |
| `src/pages/start-here/[slug].astro` (create) | One route per Markdown file, rendered through `MasterPage` |
| `src/lib/nav.ts` (modify) | Prepend the Start Here row |
| `content/start-here/*.md` (create) | The page copy. Source of truth for routes, nav and index rows |
| `content/work/hero-videos.md` (modify) | Give the section its own video pool |
| `SITEMAP.md` (modify) | Record the new URLs |

---

### Task 1: Collection, resolver, and the AI page

**Files:**
- Modify: `src/content.config.ts`
- Create: `src/lib/start-here.ts`
- Create: `content/start-here/using-ai.md`

**Interfaces:**
- Consumes: `pageFields` from `src/content.config.ts`; `getCollection` from `astro:content`.
- Produces:
  - `type Tier = 'situation' | 'job'`
  - `startHereEntries(tier?: Tier): Promise<CollectionEntry<'startHere'>[]>`
  - `startHereUrl(entry: CollectionEntry<'startHere'>): string`
  - `startHerePages(tier?: Tier): Promise<NavChild[]>`
  - `resolveServices(urls: string[], sourceId: string): Promise<RelatedItem[]>`

- [ ] **Step 1: Add the collection to `src/content.config.ts`**

Insert after the `services` collection definition:

```ts
/**
 * Start Here: need-shaped entry pages that route to the services answering them.
 *
 * `services` holds canonical service URLs rather than titles, so renaming a
 * service updates every Start Here page with no content edit. The URLs are
 * resolved in src/lib/start-here.ts, which throws on an unknown one.
 */
const startHere = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/start-here' }),
  schema: z.object({
    ...pageFields,
    /** Which index group this page sits in. */
    tier: z.enum(['situation', 'job']),
    /** Service URLs this need routes to, in display order. */
    services: z.array(z.string()).min(1),
  }),
});
```

Then change the export line to include it:

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

export type Tier = 'situation' | 'job';
export type StartHereEntry = CollectionEntry<'startHere'>;

/** Group headings for the index. Structural, so they live here, not in content. */
export const TIER_LABELS: Record<Tier, string> = {
  situation: 'Where are you stuck?',
  job: 'Or you know exactly what you need',
};

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

/** Published entries, optionally one tier, in display order. */
export async function startHereEntries(tier?: Tier): Promise<StartHereEntry[]> {
  const all = await getCollection('startHere', (e) => e.data.published !== false);
  const scoped = tier ? all.filter((e) => e.data.tier === tier) : all;
  return scoped.sort(byOrderThenTitle);
}

export async function startHerePages(tier?: Tier): Promise<NavChild[]> {
  const entries = await startHereEntries(tier);
  return entries.map((e) => ({ title: e.data.navLabel ?? e.data.title, url: startHereUrl(e) }));
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

- [ ] **Step 3: Create `content/start-here/using-ai.md`**

```markdown
---
title: "We want to use AI and do not know where to start"
navLabel: "Using AI"
url: "/start-here/using-ai"
tier: "job"
order: 10
seoTitle: "Where to start with AI"
seoDescription: "Most companies do not have an AI problem, they have a starting point problem. We map where AI automation actually pays back first, then build in that order."
services:
  - "/infrastructure/solution-architecture-design"
  - "/infrastructure/intelligent-systems-integration"
  - "/execution/ai-generated-production"
  - "/growth/marketing-innovation"
  - "/infrastructure/dashboards-analytics"
  - "/infrastructure/custom-app-development"
---
## Start Where It Pays, Not Where It Is Loudest

Most companies do not have an AI problem. They have a starting point problem, and the pressure to act is arriving from every direction except a clear business case.

The question we hear is almost always the same one. Everyone says we should be using AI, our competitors claim they already are, and nobody can tell us what to actually do on Monday morning. That is a reasonable place to be standing. AI implementation fails most often not because the technology was wrong, but because it was pointed at the wrong problem.

> *"The companies getting real returns from AI did not start with the technology. They started with the three things costing them the most time, and worked backwards. That is a business exercise, not a technical one."*

**Javad Ahmadi, Brand Transformation Architect**

**So where does it actually pay?**

In four places, usually. Work that is repetitive and rule-based. Decisions that are slow because the data lives in five systems that do not speak. Content and production that costs more than it returns. And customer interactions that scale badly. AI automation earns its keep in those four and struggles almost everywhere else.

**We start with what you already run.**

Before anything gets built, we map how work actually moves through the business: which systems hold what, where the handoffs are, and where people are doing work a machine should be doing. That map is what turns AI consulting from a conversation into a plan with a sequence and a number attached.

Then we build in the order that pays back first, rather than the order that demonstrates best.

### Where AI Fits Your Operations.

Workflow mapping and system architecture that show where automation returns real hours, and where it would only add another layer to maintain.

### Connecting What You Already Have.

API connectivity, real-time synchronization and intelligent routing between your existing systems, so data stops being re-keyed by hand between them.

### Production Without the Production Cost.

Photorealistic product imagery and video generated without a shoot, in unlimited environments, at a fraction of what studio time would cost.

### Marketing That Uses AI Properly.

Where AI genuinely improves content production, personalization and campaign performance, proven through controlled pilots rather than adopted on faith.

### Decisions You Can See.

Executive and operational dashboards with AI-enhanced insights, so your reporting tells you what changed and why it changed.

### Software Built Around Your Process.

Custom applications for the places where an off-the-shelf tool would force you to change how you already work well.

Start with a conversation about where your time and money actually go. The AI part comes after that, and it is the easier half.
```

- [ ] **Step 4: Verify the schema and resolver compile**

Run: `npm run check`
Expected: PASS, 0 errors. The collection is declared, the lib typechecks, and `using-ai.md` satisfies the schema.

- [ ] **Step 5: Prove the resolver fails the build on a bad URL**

Temporarily append one bad URL to `content/start-here/using-ai.md`'s `services` list:

```yaml
  - "/growth/does-not-exist"
```

Run: `npm run build`
Expected: FAIL, with the message `content/start-here/using-ai.md lists "/growth/does-not-exist", which matches no published service or page.`

Then remove that line and run `npm run build` again.
Expected: PASS.

This is the contract that lets the editorial mapping live in Markdown safely. Do not skip it.

- [ ] **Step 6: Commit**

```bash
git add src/content.config.ts src/lib/start-here.ts content/start-here/using-ai.md
git commit -m "Add the Start Here content collection and its first page"
```

---

### Task 2: The detail route

**Files:**
- Create: `src/pages/start-here/[slug].astro`

**Interfaces:**
- Consumes: `startHereEntries`, `startHereUrl`, `resolveServices` from `src/lib/start-here.ts`; `parseAnatomy` from `src/lib/anatomy.ts`; `MasterPage`.
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
 * These are entry points, not offerings, so the schema type is WebPage. Marking
 * them as Service would put them in competition with the real service pages in
 * the same result set (spec §6).
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
    { name: entry.data.title, url: path },
  ]}
  footerLabel="All Start Here"
  footerHref="/start-here"
  schemaType="WebPage"
/>
```

- [ ] **Step 2: Build and confirm the route exists**

Run: `npm run build && ls dist/start-here/`
Expected: `using-ai.html` present.

- [ ] **Step 3: Confirm the page renders the H1, the lede and all six service links**

Run:
```bash
grep -c 'We want to use AI and do not know where to start' dist/start-here/using-ai.html
grep -o 'href="/infrastructure/[a-z-]*"' dist/start-here/using-ai.html | sort -u
grep -c '"@type":"WebPage"' dist/start-here/using-ai.html
grep -c '"@type":"Service"' dist/start-here/using-ai.html
grep -o 'rel="canonical" href="[^"]*"' dist/start-here/using-ai.html
```
Expected: the H1 appears at least once; the three `/infrastructure/` links appear; `WebPage` count is 1 or more; **`Service` count is 0**; the canonical reads exactly `https://aliveprostudios.com/start-here/using-ai`, not the homepage. The old site inherited the homepage canonical on every page, which is the specific mistake this asserts against (`CLAUDE.md` non-negotiable 4).

- [ ] **Step 4: Confirm exactly one H1**

Run: `grep -o '<h1' dist/start-here/using-ai.html | wc -l`
Expected: `1`

- [ ] **Step 5: Commit**

```bash
git add src/pages/start-here/\[slug\].astro
git commit -m "Render Start Here pages through the master template"
```

---

### Task 3: The two-tier index

**Files:**
- Create: `src/pages/start-here/index.astro`

**Interfaces:**
- Consumes: `startHereEntries`, `startHereUrl`, `TIER_LABELS`, `type Tier` from `src/lib/start-here.ts`; `clampDescription` from `src/lib/seo.ts`.
- Produces: the route `/start-here`.

- [ ] **Step 1: Create `src/pages/start-here/index.astro`**

Modelled on `src/pages/[section]/index.astro`, which is the established landing pattern in this repo. Rows are numbered continuously across both groups, so the numbering reads 01 upward down the whole page.

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import BgRails from '../../components/BgRails.astro';
import SiteNav from '../../components/SiteNav.astro';
import VideoHero from '../../components/VideoHero.astro';
import BookConsult from '../../components/BookConsult.astro';
import NextStep from '../../components/NextStep.astro';
import SiteFooter from '../../components/SiteFooter.astro';
import { startHereEntries, startHereUrl, TIER_LABELS, type Tier } from '../../lib/start-here';
import { clampDescription } from '../../lib/seo';

/**
 * The Start Here index: two groups on one page.
 *
 * Situations first, for the visitor with a goal instead of a service name.
 * Specific jobs beneath, for the visitor who knows what they want but cannot
 * find it because it lives as a bullet inside a service page.
 *
 * Numbering runs continuously across both groups, so a row's number is its
 * position on the page rather than its position in its group.
 */
const path = '/start-here';
const TIERS: Tier[] = ['situation', 'job'];

let counter = 0;
const groups = await Promise.all(
  TIERS.map(async (tier) => {
    const entries = await startHereEntries(tier);
    return {
      tier,
      label: TIER_LABELS[tier],
      rows: entries.map((entry) => ({
        num: String(++counter).padStart(2, '0'),
        name: entry.data.title,
        url: startHereUrl(entry),
        blurb: entry.data.seoDescription ?? '',
      })),
    };
  }),
);

const populated = groups.filter((group) => group.rows.length > 0);
const total = counter;
const first = populated[0]?.rows[0];

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

      {
        populated.map((group) => (
          <section class="rows">
            <p class="rows__eyebrow t-eyebrow z-content">
              {group.label}&nbsp;&nbsp;<span class="rows__count">({group.rows.length})</span>
            </p>

            {group.rows.map((row) => (
              <a class="row z-content" href={row.url} data-stack>
                <span class="row__num">{row.num}</span>
                <div class="row__body">
                  <h2 class="row__name">
                    {row.name}
                    <span class="row__dot" />
                  </h2>
                  {row.blurb && <p class="row__blurb">{row.blurb}</p>}
                </div>
                <span class="row__explore">
                  <span>Explore Now</span>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="M7 17L17 7M9 7h8v8"></path>
                  </svg>
                </span>
              </a>
            ))}
            <div class="rows__end" />
          </section>
        ))
      }

      <BookConsult />
    </main>

    <NextStep sectionNum="01" />
    <SiteFooter nextLabel={first?.name ?? 'All Services'} nextHref={first?.url ?? '/'} />
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

Note the H1 is smaller here than on a section landing (`clamp(24px, 2.6vw, 42px)` against `clamp(28px, 3.6vw, 60px)`), because Start Here row titles are full sentences rather than two-word service names.

- [ ] **Step 2: Build and confirm the index renders one group**

Run: `npm run build && grep -o 'Or you know exactly what you need' dist/start-here.html`
Expected: one match. Only the `job` tier has a page so far, so the `situation` group is correctly absent, not empty.

- [ ] **Step 3: Confirm the empty group is omitted rather than rendered blank**

Run: `grep -c 'Where are you stuck' dist/start-here.html`
Expected: `0`. `populated` filters out groups with no rows, per the never-fill-an-empty-slot rule.

- [ ] **Step 4: Commit**

```bash
git add src/pages/start-here/index.astro
git commit -m "Add the two-tier Start Here index"
```

---

### Task 4: The navigation row

**Files:**
- Modify: `src/lib/nav.ts`

**Interfaces:**
- Consumes: `startHerePages` from `src/lib/start-here.ts`.
- Produces: a `Start Here` row numbered `01`, with the four sections renumbering to `02` through `05`.

- [ ] **Step 1: Import the helper at the top of `src/lib/nav.ts`**

Add below the existing imports:

```ts
import { startHerePages } from './start-here';
```

- [ ] **Step 2: Prepend the row inside `navItems()`**

Replace the `const rows: Omit<NavItem, 'num'>[] = [` block with:

```ts
  /**
   * Twenty children is unusable in one accordion, so past a threshold the menu
   * shows the `situation` tier only and the rest are reached from the index,
   * which is what the overview row is for. Below the threshold it shows
   * everything, because hiding half of six rows would just look broken.
   *
   * This is the one place the menu deliberately does not mirror the collection.
   */
  const allStartHere = await startHerePages();
  const startHereChildren =
    allStartHere.length > 12 ? await startHerePages('situation') : allStartHere;

  const rows: Omit<NavItem, 'num'>[] = [
    { label: 'Start Here', url: '/start-here', children: startHereChildren },
    ...sectionItems,
    { label: 'Work', url: '/work', children: await workPages() },
    { label: 'Alive Pro', url: '/alive-pro', children: await aliveProPages() },
    { label: 'Resources', url: '/resources', children: await resourcesPages() },
    { label: 'Contact', url: '/contact', children: [] },
  ];
```

- [ ] **Step 3: Build and confirm Start Here is row 01**

Run: `npm run build && grep -o '01[^<]*</span>[^<]*Start Here' dist/index.html | head -3`
Expected: a match pairing `01` with `Start Here`. If the markup shape differs, fall back to confirming both strings are present and that `Start Here` precedes `Foundation`:

```bash
python3 -c "
h=open('dist/index.html').read()
print('start here at', h.find('Start Here'))
print('foundation at', h.find('Foundation'))
assert 0 <= h.find('Start Here') < h.find('Foundation')
print('OK: Start Here precedes Foundation')
"
```

- [ ] **Step 4: Confirm the overview child exists**

Run: `grep -c 'Start Here Overview' dist/index.html`
Expected: 1 or more. `withOverview` adds it automatically because the row has children.

- [ ] **Step 5: Confirm nothing else broke**

Run: `npm run check && npm run build`
Expected: check passes with 0 errors, build reports 51 pages (49 existing plus `/start-here` and `/start-here/using-ai`).

- [ ] **Step 6: Commit**

```bash
git add src/lib/nav.ts
git commit -m "Put Start Here first in the main navigation"
```

---

### Task 5: The packaging and product range pages

**Files:**
- Create: `content/start-here/packaging.md`
- Create: `content/start-here/product-range.md`

**Interfaces:**
- Consumes: the `startHere` schema from Task 1. No code changes: both routes come from the existing `[slug].astro`.
- Produces: `/start-here/packaging` and `/start-here/product-range`, plus the `situation` group appearing on the index for the first time.

- [ ] **Step 1: Create `content/start-here/packaging.md`**

```markdown
---
title: "Our packaging has to sell before anyone reads a word"
navLabel: "Packaging"
url: "/start-here/packaging"
tier: "situation"
order: 3
seoTitle: "Packaging that sells and prints affordably"
seoDescription: "Packaging has to sell before a word is read, at a print cost that does not eat the margin. We design for the press, not the screen, and the savings are real."
services:
  - "/execution/communication-design"
  - "/foundation/brand-name-identity"
  - "/foundation/brand-voice"
---
## The Shelf Decides in Three Seconds

Your packaging is the only part of your brand a customer holds in their hands. It has to do the selling before a single word gets read, and it has to do it at a print cost that does not quietly eat the margin.

Packaging design goes wrong in one of two places. Either it looks good and prints badly, which shows up as a quote you cannot accept or a colour you cannot hold across a run. Or it prints cleanly and says nothing, which is the more expensive failure, because it costs the same either way.

**We design for the press, not just for the screen.**

Structure, substrate, colour build, die line and finish get decided alongside the artwork rather than after it. That is the part most studios hand off, and it is exactly where the money is. Building the colour correctly, choosing a finish that survives the shelf, and designing to the sheet instead of against it routinely takes thousands out of a print run without changing the design at all.

**And it carries the rest of the brand with it.**

Label design, product packaging design and the words on the back are not separate jobs handed to separate people. They are your positioning, arriving at the last moment before somebody decides.

### Packaging Design.

From concept development and mockups through to production-ready files, built with the print process in mind from the first sketch.

### Labels and Product Ranges.

Label systems that hold together across a full product line, so a range reads as a range rather than as a shelf of strangers.

### Naming and Identity.

For the products that need a name, a mark, or a visual system before the packaging can be designed properly at all.

### Packaging Copy.

What the pack says, in what order, in your brand's voice, inside the space the design leaves for it.

Bring us the product and your current print quote. We will show you what changes.
```

- [ ] **Step 2: Create `content/start-here/product-range.md`**

```markdown
---
title: "We have a huge product range to shoot and lay out"
navLabel: "Product Range"
url: "/start-here/product-range"
tier: "job"
order: 12
seoTitle: "Photography and layout for large product ranges"
seoDescription: "A large product range is a photography problem and a layout problem at once. Generated imagery changes the cost, and the catalogue still has to be designed."
services:
  - "/execution/ai-generated-production"
  - "/execution/photography"
  - "/execution/sales-marketing-collateral"
  - "/execution/communication-design"
---
## Hundreds of Products, One Consistent Look

A large product range is a photography problem and a layout problem arriving together. Shooting every item properly costs more than most budgets allow, and presenting them consistently across a catalogue, a website and a sales sheet takes longer than anyone plans for.

The usual compromise is to shoot the top sellers properly and let everything else limp along on supplier images and phone photos. It shows. A range that looks inconsistent reads as a company that is inconsistent, and the products at the back of the catalog quietly stop selling.

**There is a better answer now, and it changes the arithmetic.**

Photorealistic product imagery can be generated without a shoot, in unlimited environments and settings, across as many variations as the range needs. Seasonal versions, lifestyle contexts, ecommerce crops and campaign treatments all come from the same source at a fraction of what studio time would cost. For a large catalogue that is often the difference between doing it properly and not doing it at all.

**Traditional product photography still earns its place.**

Hero products, texture, materials, and anything where a customer has to believe the surface before they will believe the price. We use both, and we decide which is which before anything gets booked.

### Generated Product Imagery.

Photorealistic imagery and product video in any environment, with no shoot required, across unlimited variations and formats.

### Product Photography.

Studio and location photography for the products that need a real lens and a real light on them.

### Catalogues and Product Guides.

Catalogue design that stays readable at forty pages and at four hundred, with a system for adding next year's products without a redesign.

### The Visual System Behind It.

Grids, typography, colour and photographic direction that hold the whole range together across print, web and sales materials.

Send us the product list and your current catalog. We will tell you what it takes.
```

- [ ] **Step 3: Build and confirm three pages exist**

Run: `npm run build && ls dist/start-here/`
Expected: `packaging.html`, `product-range.html`, `using-ai.html`.

- [ ] **Step 4: Confirm both index groups now render, numbered continuously**

Run:
```bash
grep -c 'Where are you stuck' dist/start-here.html
grep -c 'Or you know exactly what you need' dist/start-here.html
grep -o 'row__num">[0-9]*' dist/start-here.html
```
Expected: both group headings appear once; the numbers read `01`, `02`, `03` in that order, with `01` belonging to packaging because the `situation` group renders first.

- [ ] **Step 5: Confirm every meta description is 150 to 160 characters**

Run:
```bash
python3 -c "
import glob, re, sys
bad = []
for f in sorted(glob.glob('content/start-here/*.md')):
    m = re.search(r'^seoDescription:\s*\"(.*)\"\s*$', open(f).read(), re.M)
    if not m:
        bad.append((f, 'missing')); continue
    n = len(m.group(1))
    print(f'{n:4d}  {f}')
    if not 150 <= n <= 160: bad.append((f, n))
sys.exit(1 if bad else 0)
"
```
Expected: three lines, each between 150 and 160, exit code 0.

- [ ] **Step 6: Confirm no em dashes reached the content**

Run: `grep -l $'\u2014' content/start-here/*.md; echo "exit $?"`
Expected: no filenames listed. `grep -l` exiting 1 with no output is the pass.

- [ ] **Step 7: Commit**

```bash
git add content/start-here/packaging.md content/start-here/product-range.md
git commit -m "Add the packaging and product range Start Here pages"
```

---

### Task 6: Hero videos, sitemap, and full verification

**Files:**
- Modify: `content/work/hero-videos.md`
- Modify: `SITEMAP.md`
- Modify: `CLAUDE.md`

**Interfaces:**
- Consumes: everything from Tasks 1 through 5.
- Produces: the shipped section.

- [ ] **Step 1: Give the section its own video pool**

In `content/work/hero-videos.md`, add a new section immediately before `## Foundation`. Reuse two URLs already present in the file rather than sourcing new ones, so nothing depends on an unverified video ID:

```markdown
## Start Here

https://vimeo.com/943871850
https://vimeo.com/465976202
```

Without this heading the section falls to `## Default`, which works but gives every Start Here page the same video.

- [ ] **Step 2: Record the routes in `SITEMAP.md`**

Add a new section immediately after the `## Top level` table:

```markdown
---

## Start Here (3 of 20 built)

Need-shaped entry pages. Design spec:
`docs/superpowers/specs/2026-08-24-start-here-section-design.md`

| URL | Tier | Content |
|---|---|---|
| `/start-here` | index | derived from the collection |
| `/start-here/packaging` | situation | `content/start-here/packaging.md` |
| `/start-here/using-ai` | job | `content/start-here/using-ai.md` |
| `/start-here/product-range` | job | `content/start-here/product-range.md` |

The remaining 17 pages are specified but not written. Adding one is adding a
Markdown file: no code change, no route change, no redirect.
```

Then update the `**Totals:**` line near the top of the file, changing it to:

```markdown
**Totals:** 28 service pages · 8 Alive Pro pages · 4 Start Here pages · 3 blog posts · 26 videos · 63 redirects
```

- [ ] **Step 3: Record the section in `CLAUDE.md`**

In the `## Current state` section, change the route count line to read:

```markdown
**LIVE at https://aliveprostudios.com since 2026-08-24. 53 routes, 83 redirects.**
```

Then add one row to the Known gaps table:

```markdown
| **Start Here at 3 of 20 pages** | Section shipped with AI, packaging and product range. The other 17 are specified in `docs/superpowers/specs/2026-08-24-start-here-section-design.md` and each is one Markdown file, no code |
```

- [ ] **Step 4: Full build**

Run: `npm run check && npm run build`
Expected: check passes with 0 errors. Build reports **53 pages**: the 49 existing plus `/start-here` and its three pages.

- [ ] **Step 5: Confirm the new URLs are in the generated XML sitemap**

Run: `grep -o '/start-here[a-z/-]*' dist/sitemap-0.xml | sort -u`
Expected: four lines, `/start-here` plus the three pages. The `@astrojs/sitemap` integration picks them up automatically; only `/thank-you` is filtered.

- [ ] **Step 6: Verify through the real preview server, not the dev server**

Run: `npm run preview`

Then in the browser check each of the following, because these are the things the build cannot assert:

1. `/start-here` renders both groups, numbered 01, 02, 03 down the page
2. The menu shows Start Here as `01`, and Foundation through Infrastructure as `02` to `05`
3. Every service link on all three pages loads a real page, no 404s
4. Keyboard tab order moves through both index groups with a visible focus ring
5. The hero video plays and respects `prefers-reduced-motion` when that is set
6. All three pages render at 375px wide without horizontal scroll

Stop the server when finished.

- [ ] **Step 7: Commit**

```bash
git add content/work/hero-videos.md SITEMAP.md CLAUDE.md
git commit -m "Ship Start Here with its hero videos and documentation"
```

---

## Deferred, and why

**The remaining 17 pages.** Specified in §4 of the design spec. Each is one Markdown file against the schema in Task 1. No code, no route, no redirect.

**Brand Pulse.** `content/pages/brand-pulse.md` declares `url: "/brand-pulse"` but no route file exists, so it is unreachable. It is a five-question scored diagnostic with four result bands, which makes it an interactive application rather than a page, and this site currently ships no client-side JavaScript. Page 02 of the spec is its natural entry point. The `UNROUTED` set in `src/lib/start-here.ts` fails the build if anything links to it before the route exists, so this cannot be forgotten by accident.

**Reputation Management keyword work.** Independent of this plan. The existing `/growth/reputation-management` page should target "online reputation management", roughly 4,720 searches a month at a $95.35 cost per click, the most expensive keyword measured during research.

**The urgency strip.** Belongs beneath the index grid and is the natural home for Precision Impact Sprints, which is currently `published: false`. Nothing here depends on it.
