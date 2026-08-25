---
title: "Start Here design spec"
date: 2026-08-24
status: awaiting review
owner: Javad Ahmadi
---

# Start Here

A new top-level section of nine pages that meet a visitor at the need they
arrived with, in their own words, and route them to the services that answer it.

---

## 1. Why this exists

The site is organized the way the work is organized: Foundation, Execution,
Growth, Infrastructure, and 28 services beneath them. That structure is correct
and it stays. It serves the visitor who already knows what to buy.

It does not serve the visitor who has a goal instead of a service name. Someone
who thinks "we want to grow sales" has to translate that into Lead Generation,
Sales Funnel Building, Digital Marketing and Customer Retention Marketing before
the site can help them. Start Here does that translation for them.

### The admission test

A need earns a Start Here page only when **no single existing page already
answers it**, for one of two reasons:

1. **It spans several services.** "We want to grow sales" is four services.
2. **The capability is real but has no page.** Packaging design is one bullet on
   line 30 of `content/services/execution/communication-design.md`. Consulting
   has no page and the word "consultant" does not appear anywhere on the site.

A need that one service page already answers is **excluded**. Rebranding, Web
Solutions and Video Production all have clear single front doors. Someone who
searches "rebranding" wants `/foundation/rebranding`, and a Start Here page on
the same topic would only compete with it.

That test, not a target number, produced the nine pages below.

---

## 2. Evidence

Monthly search volume pulled from Google Ads data on 2026-08-24, Canada and
United States, English.

| Cluster | CA | US | Present on the site today |
|---|---|---|---|
| Consultant (marketing 880/14,800 · brand 140/1,000 · brand strategy 70/1,000 · marketing strategy 50/720) | ~1,160 | ~17,900 | **Nothing. Zero occurrences of the word.** |
| Search visibility (seo services 6,600/74,000 · answer engine optimization 320/2,400) | ~6,900 | ~76,400 | Two service pages |
| Packaging and labels (packaging design 590/4,400 · label design 260/1,600 · product packaging design 90/590) | ~940 | ~6,600 | **One bullet inside another page** |
| Brand strategy and positioning (590/5,400 · 320/1,900) | ~910 | ~7,300 | One service page |
| Lead generation (services 140/1,600 · b2b 170/1,900) | ~310 | ~3,500 | Two service pages |
| Audit and diagnostic (brand audit 70/480 · marketing audit 90/320) | ~160 | ~800 | Brand Pulse, which has no route |

Three findings that shaped the spec:

**Consulting is the largest hole.** Roughly 19,000 searches a month across both
markets, and the site does not contain the word once. "Brand Transformation
Architect" is right for positioning and invisible to search.

**Lead generation is small and expensive.** Only ~3,800 searches combined, but
cost per click runs $45.73 and $51.25 in the US. Low volume, extreme commercial
intent.

**"Generative engine optimization" returned no volume in either market**, while
"answer engine optimization" holds 320 and 2,400 steadily across all twelve
months. The existing AEO service page is named correctly.

**One figure deliberately not used.** "Brand identity design" reports 18,100 US,
but that average is dragged by a single month of 165,000 in August 2025. Every
other month sits near 2,400. Treated as 2,400.

### What the evidence does not support

There is no meaningful search volume for pain-shaped phrasing: "our marketing is
not working", "everything looks different", "our tools slow us down". Those
pages exist to serve someone already browsing the site, not to be found cold.
They are still worth building, and they carry no search expectation.

---

## 3. Voice

**Headlines carry the need. Keywords live in the body.**

The H1 is the sentence the visitor would say out loud about their own business.
It never names a service and never uses internal vocabulary. The searched terms
appear in the body copy, where they read naturally.

The page's job, in order: name the problem so they recognize themselves, state
plainly that this is solved work here, give one concrete thing they gain, then
route them.

Per `CLAUDE.md`: Canadian English, no em dashes, no filler, partner not vendor.
The first paragraph of each file is the H4 lede and stays at two to three
sentences.

---

## 4. The nine pages

| | H1 | Body carries | Routes to |
|---|---|---|---|
| 01 | We want to grow our sales | lead generation, b2b lead generation, sales funnel, demand generation | Lead Generation · Sales Funnel Building · Digital Marketing · Customer Retention Marketing |
| 02 | We need someone to look at everything and tell us what to do | brand consultant, marketing consultant, brand strategy consultant, brand audit, marketing audit, brand positioning | Brand Strategy & Positioning · Marketing Innovation · Rebranding · Our Process · Brand Pulse · Partnership |
| 03 | Our packaging has to sell before anyone reads a word | packaging design, label design, product packaging design, print production | Communication Design · Brand Name & Identity · Brand Voice |
| 04 | Nobody can find us | seo services, answer engine optimization, content marketing, local search | SEO · AEO · Content Marketing · Social Media Management |
| 05 | Our content is not as good as our business | video production, brand photography, motion graphics, content marketing | Video Production · Photography · Motion Graphics & Animation · AI-Generated Production · Content Marketing |
| 06 | We look like a different company everywhere | brand consistency, brand guidelines, brand voice | Brand Voice · Communication Design · Sales & Marketing Collateral · Social Media Branding · Web Solutions · Ongoing Brand Guardianship |
| 07 | We cannot tell if our marketing is working | marketing audit, marketing analytics, marketing ROI, reporting dashboard | Marketing Innovation · Dashboards & Analytics · Digital Marketing · Reputation Management |
| 08 | Our systems slow us down | systems integration, custom software, workflow automation, business dashboards | Intelligent Systems Integration · Custom App Development · Solution Architecture & Design · Dashboards & Analytics · LifeCycle Support |
| 09 | We know what to do, we do not have the hands | outsourced marketing team, fractional marketing, marketing partner | Partnership · LifeCycle Support · Ongoing Brand Guardianship |

Page 02 merges what were separately a diagnostic page and a strategy page, at
Javad's direction on 2026-08-24. It concentrates the whole consulting intent,
the site's biggest gap, on a single URL.

### Service coverage

**All 28 services are reachable** from at least one of the nine pages.

Two different things must not be confused here. The admission test excludes
Rebranding, Web Solutions and Video Production from being the **subject** of a
Start Here page, because each already owns a clear front door. It does not
exclude them as **destinations**. Someone on "our content is not as good as our
business" should absolutely be sent to Video Production, and someone told to
look at everything may well end up at Rebranding.

Subject and destination are separate lists. Only the subject list is constrained
by the admission test.

### Page 03 is the priority

There is no packaging page anywhere on the site, roughly 7,500 people a month
search for it across the two main markets, and the print production saving is a
claim no competitor makes on that page. It has no internal competition and
nothing to cannibalize.

---

## 5. Architecture

Follows `TEMPLATE-ANATOMY.md` and the collection-is-truth rule in `CLAUDE.md`.

### Content collection

New collection `startHere`, loaded from `content/start-here/*.md`, reusing the
shared `pageFields` schema in `src/content.config.ts` plus one addition:

```ts
const startHere = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/start-here' }),
  schema: z.object({
    ...pageFields,
    /** Service URLs this need routes to, in display order. */
    services: z.array(z.string()),
  }),
});
```

`services` holds canonical service URLs. They are resolved against the `services`
and `pages` collections at build time, and an unresolvable URL **fails the
build** rather than rendering a dead link. This keeps the editorial mapping in
Markdown while the titles and descriptions still come from the collection, so
renaming a service updates every Start Here page with no content edit.

### Routes

- `src/pages/start-here/index.astro` lists the nine, numbered, from the collection
- `src/pages/start-here/[slug].astro` renders each page through `MasterPage`

Both prerendered. No new build or deploy configuration.

### Navigation

One new row prepended to `rows` in `src/lib/nav.ts`, ahead of the four sections:

```ts
{ label: 'Start Here', url: '/start-here', children: await startHerePages() }
```

Numbering is computed after filtering, so Start Here becomes 01 and everything
below renumbers automatically. `withOverview` adds the "Start Here Overview"
child, matching every other accordion row.

Adding a Markdown file to `content/start-here/` adds its route, its menu entry
and its index row with no code change.

### Hero videos

Add a `## Start Here` heading to `content/work/hero-videos.md`. Without it the
section falls to `## Default`, which works but gives all nine the same treatment.

### SEO

- `seoDescription` written at **150 to 160 characters** on all nine. The existing
  35 service pages sit at 44 to 60, a known gap; these do not repeat it.
- Canonical per page.
- JSON-LD `WebPage` plus `BreadcrumbList`. Not `Service`: these are entry points,
  not offerings, and marking them up as services would compete with the real
  service pages in the same result set.
- Ten new URLs added to `SITEMAP.md`. No redirects needed, nothing is moving.

---

## 6. Dependencies and blockers

| Item | Effect | Resolution |
|---|---|---|
| **Brand Pulse has no route** | `content/pages/brand-pulse.md` carries `url: "/brand-pulse"` but no route file exists. Page 02 wants to link it. | Either build the route or drop the link from page 02. **Needs Javad's call.** |
| **Precision Impact Sprints is unpublished** | `published: false`. It is the natural target for urgency, and for page 09. | Left out until republished. Page 09 works without it. |
| Nine pages of new copy | The largest cost in this project. | Written against the table in §4, one file per page. |

### Deliberately not built

**Urgency is not a page.** "We need help fast" is a speed, not a need, and the
person with a deadline still has one of the nine. It belongs as a strip beneath
the index grid, and it is the natural home for Precision Impact Sprints once
that page returns.

---

## 7. Verification

Per `CLAUDE.md`, through `npm run preview`, not `astro dev`.

1. `npm run check` passes
2. `npm run build` produces 10 new routes, total rises from 49 to 59
3. Menu shows Start Here as 01 with nine children plus an overview, and the four
   sections renumber to 02 through 05
4. Every service link on all nine pages resolves to a built route
5. One H1 per page, no skipped heading levels
6. Each `seoDescription` measures 150 to 160 characters
7. Canonical, `WebPage` and `BreadcrumbList` present on each
8. Keyboard navigation and visible focus through the index grid
9. `prefers-reduced-motion` respected on the hero
