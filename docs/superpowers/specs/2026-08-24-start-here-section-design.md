---
title: "Start Here design spec"
date: 2026-08-24
revised: 2026-08-24
status: approved, Tier A
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

It does not serve two other people.

**The visitor with a goal instead of a service name.** Someone thinking "I want
more leads" has to translate that into Lead Generation, Sales Funnel Building,
Digital Marketing and Customer Retention Marketing before the site can help.

**The visitor looking for something Alive Pro does but does not advertise.** The
service pages are written as capability lists, and the capabilities inside them
cannot be found. `video-production.md` lists 16 video types.
`communication-design.md` lists 9 design disciplines. `custom-app-development.md`
lists 7 application types. That is roughly 40 real capabilities living as
bullets, unreachable by search and invisible to anyone browsing.

Packaging was not an exception to that. It was a symptom of it.

### The admission test

A need earns a page only when **no single existing page already answers it**:

1. **It spans several services.** "I want more leads" is four services.
2. **The capability is real but has no page.** Packaging design is one bullet on
   line 30 of `communication-design.md`. Consulting has no page at all and the
   word "consultant" does not appear anywhere on the site.

A need one service page already answers is **excluded**. Rebranding, Web
Solutions and Video Production each own a clear front door.

**Subject and destination are separate lists.** The admission test governs what a
page is *about*. It does not restrict what a page links *to*.

---

## 2. Structure: two lines per page

Every page carries two pieces of copy that say different things.

**The menu item is the visitor's sentence**, in first person, in their words.
"I need packaging that sells my product."

**The H1 is Alive Pro's answer.** "Packaging that sells, at a print cost that
works."

They click a sentence that sounds like their own thought, and the page replies.
A page that answers you is more persuasive than a page that repeats you back.

This also forces every page to earn its keep: **the H1 must promise something
specific enough to be checked.** "Leads that convert, not just traffic" commits
to something. "Lead Generation Services" does not.

### Voice

Menu items are first person singular. Not "we" and "our", which is how a company
describes itself, but "I" and "my", which is how an owner thinks about their own
business at eleven at night. That difference is what makes this section feel
unlike the rest of the site, which is the point of a second front door.

Per `CLAUDE.md`: Canadian English, no em dashes, no filler, partner not vendor.
Keywords live in the body, never in the headline. The first paragraph of each
file is the H4 lede and stays at two to three sentences.

**One spelling exception.** Headings keep Canadian spelling ("catalogue"). Body
copy must also carry "catalog" naturally, because the US market outsearches
Canada on that spelling 590 to 110.

---

## 2b. Content direction

**These pages do not look like service pages.** Javad's direction, 2026-08-24.

People arrive with a specific problem, not an appetite for a rebrand. They want
more sales, or packaging that sells and costs less to print. The page has one
job: convince them that a conversation is worth having.

**The shape.** Two to three short paragraphs, then a closing invitation. That is
all.

**No numbered rows.** Never use `### Heading.` in a Start Here page. `MasterPage`
turns those into the numbered Slot 4 rows that every service page uses, and this
section is deliberately not that. Verified at `MasterPage.astro:233`:
`anatomy.rows.length > 0` gates the whole section, so omitting the headings
omits the rows with no code change.

**The argument, in order.**

1. Name the problem in a way that shows you have seen it before.
2. Go to the root cause. Say why the obvious fix fails, because that is the
   sentence that earns the trust.
3. Say what Alive Pro does differently, in terms of results rather than method.

**The close is an invitation, not a pitch.** Ask for one concrete thing, so the
conversation has somewhere to start: how an order moves through the business,
what happens after someone lands on the site. And say plainly that they may not
be a fit. A page willing to disqualify the reader is more credible than one
that wants everybody, and it filters the enquiries that reach Javad.

**Sales copy, not salesy.** Short sentences. No hype, no filler, no stacked
adjectives. The persuasion comes from accurate description of the reader's own
situation, not from claims about Alive Pro.

The service routing still happens: it lives in Related Services beneath the copy,
which is generated from the collection. The prose convinces, the component routes.

## 3. The nine pages

| | Menu item (their words) | H1 (the answer) | URL |
|---|---|---|---|
| 01 | I want more leads to grow my sales | Leads that convert, not just traffic | `/start-here/more-leads` |
| 02 | I need an expert to look at my business | An outside read on where you actually stand | `/start-here/need-a-consultant` |
| 03 | I need packaging that sells my product | Packaging that sells, at a print cost that works | `/start-here/packaging` |
| 04 | I want to reach my ideal audiences | Found by the people worth reaching | `/start-here/reach-my-audience` |
| 05 | I need authentic content to tell my story | Your story, told the way you would tell it | `/start-here/tell-my-story` |
| 06 | My brand looks different everywhere it shows up | One brand, everywhere it shows up | `/start-here/one-brand` |
| 07 | My product is amazing, but my marketing is bad | Marketing that finally matches the product | `/start-here/marketing-that-matches` |
| 08 | One centralized system to run my business | One place where the whole business runs | `/start-here/custom-system` |
| 09 | I need efficiency and productivity in my business | Hours back, every week | `/start-here/efficiency` |

### Service routing

| | Routes to |
|---|---|
| 01 | Lead Generation · Sales Funnel Building · Digital Marketing · Customer Retention Marketing |
| 02 | Brand Strategy & Positioning · Marketing Innovation · Rebranding · Our Process · Partnership |
| 03 | Communication Design · Brand Name & Identity · Brand Voice |
| 04 | SEO · AEO · Content Marketing · Social Media Management |
| 05 | Video Production · Photography · Motion Graphics & Animation · AI-Generated Production · Content Marketing |
| 06 | Brand Voice · Communication Design · Sales & Marketing Collateral · Social Media Branding · Web Solutions · Ongoing Brand Guardianship |
| 07 | Digital Marketing · Lead Generation · Brand Strategy & Positioning · Reputation Management · Marketing Innovation |
| 08 | Solution Architecture & Design · Intelligent Systems Integration · Custom App Development · Dashboards & Analytics |
| 09 | Intelligent Systems Integration · Custom App Development · Solution Architecture & Design · Dashboards & Analytics · LifeCycle Support |

**All 28 services are reachable from these nine pages.** Verified, not assumed.
Tier A alone is a complete front door, which means the eleven Tier B pages in the
archived revision are genuinely optional rather than required for coverage.

### Holding 08 and 09 apart

Both point at the same Infrastructure services, so the copy has to carry the
distinction and carry it in the first sentence.

**08 is about where things live.** Scattered data, five logins, no single source
of truth, the same order typed in three times. The answer is architecture and
integration.

**09 is about how fast things move.** Manual steps, work that waits, a report
rebuilt by hand every Monday. The answer is automation and workflow.

If a sentence would sit equally well on both pages, it belongs on neither.

---

## 4. Commercial priority: custom systems for manufacturers

Javad's focus for September and October 2026 is **custom software design for
manufacturing companies**. Marketing remains the core business; this is a
deliberate push into a second one.

Pages 08 and 09 are that push. They lead the build order, ahead of packaging,
and their copy is written with manufacturers in the frame: order routing,
production scheduling, quoting, inventory, and the gap between an ERP and how a
shop floor actually runs.

**The argument those pages must make:** off the shelf where it fits, custom where
it does not. Plenty of businesses run well on tools they already own once those
tools are properly integrated. Custom software earns its place when the process
*is* the competitive advantage, and bending it to fit somebody else's product
would cost the thing that makes the company good. That is routinely true in
manufacturing, where routing, tolerances and scheduling logic are the business.

**No search data was gathered for this vertical.** The DataForSEO account
returned HTTP 402, out of credit, on 2026-08-24. The manufacturing keyword set
(custom software development, manufacturing software, ERP for manufacturing,
production planning, and related) is **untested**, and no volume figure for it
appears anywhere in this spec. Run it before committing to paid search on these
terms.

---

## 5. Evidence

Google Ads search volume, pulled 2026-08-24, Canada and United States combined.
This covers the marketing side only, per §4.

| Need cluster | Combined | Notes |
|---|---|---|
| **AI adoption** (ai automation 11,500 · ai consulting 8,980 · ai implementation 1,140) | **~21,600** | US competition index 22. High volume, low competition, which is rare |
| **Consulting** (marketing 15,680 · brand 1,140 · brand strategy 1,070) | **~19,000** | The word appears zero times on the site. Page 02 |
| **Search visibility** (seo services 80,600 · answer engine optimization 2,720) | ~83,300 | Page 04 |
| **Packaging and labels** (packaging 4,990 · label 1,860 · product packaging 680) | ~7,530 | One bullet inside another page. Page 03 |
| **Reputation** (online reputation management) | ~4,720 | **CPC $95.35, the highest measured.** Excluded, see §6 |
| **Lead generation** (services 1,740 · b2b 2,070) | ~3,810 | CPC $45.73 and $51.25. Low volume, extreme intent. Page 01 |
| **Audit and diagnostic** (brand audit 550 · marketing audit 410) | ~960 | Page 02 |

**Two figures deliberately not used.** "Brand identity design" reports 18,100 US,
dragged by one month of 165,000; every other month sits near 2,400, and 2,400 is
what this spec uses. "Generative engine optimization" returned no volume in
either market, while "answer engine optimization" holds steady across twelve
months, so the existing AEO service page is named correctly.

**What the evidence does not support.** There is no meaningful search volume for
pain-shaped phrasing. Pages 06, 07 and 09 serve someone already browsing the
site, and carry no search expectation.

---

## 6. Excluded, and why

**AI is not a Tier A page.** It measured as the largest opportunity in the whole
research set, and it belongs in the archived Tier B list. Nothing here prevents
adding it later; it is one Markdown file. Its absence from Tier A is a scope
decision, not a judgment about its value.

**Online reputation** measures ~4,720/mo at a $95.35 CPC and **fails the
admission test**, because Reputation Management already owns it. The correct
action is optimizing that existing service page for "online reputation
management", the phrase people actually type. **Separate work, out of scope.**

**Urgency is not a page.** The person with a deadline still has one of the nine.
It belongs as a strip beneath the index grid, and it is the natural home for
Precision Impact Sprints once that page is republished.

---

## 7. Architecture

Follows `TEMPLATE-ANATOMY.md` and the collection-is-truth rule in `CLAUDE.md`.

### Content collection

New collection `startHere`, from `content/start-here/*.md`, reusing `pageFields`
in `src/content.config.ts` plus two additions:

```ts
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

`title` is the H1, Alive Pro's answer. `need` is the visitor's sentence, used for
the menu, the index row and the link text. They are deliberately different
strings, which is the whole structure in §2.

`services` holds canonical URLs, resolved against the `services` and `pages`
collections at build time. An unresolvable URL **fails the build** rather than
rendering a dead link.

### Routes

- `src/pages/start-here/index.astro`, one numbered list, 01 to 09
- `src/pages/start-here/[slug].astro`, rendered through `MasterPage`

Both prerendered. No new build or deploy configuration.

### Navigation

One row prepended to `rows` in `src/lib/nav.ts`, ahead of the four sections:

```ts
{ label: 'Start Here', url: '/start-here', children: await startHerePages() }
```

Numbering is computed after filtering, so Start Here becomes 01 and the sections
renumber to 02 through 05. `withOverview` adds the overview child automatically.
**Menu children use `need`, not `title`**, so the menu reads as nine first-person
sentences.

### Hero videos

Add a `## Start Here` heading to `content/work/hero-videos.md`.
`slugifySection("Start Here")` yields `start-here`, which matches
`sectionForRoute("/start-here/...")`. Verified.

### SEO

- `seoDescription` at **150 to 160 characters** on all nine. The existing 35
  service pages sit at 44 to 60, a known gap these do not repeat.
- Canonical per page. The old site inherited the homepage canonical everywhere.
- JSON-LD `WebPage` plus `BreadcrumbList`. **Never `Service`**: these are entry
  points, and marking them as offerings would put them in competition with the
  real service pages in the same result set.
- 10 new URLs in `SITEMAP.md`. No redirects, nothing moves.

---

## 8. Dependencies

| Item | Effect | Resolution |
|---|---|---|
| **Brand Pulse has no route** | `content/pages/brand-pulse.md` declares `url: "/brand-pulse"` but no route file exists. It is a five-question scored diagnostic with four result bands, so it is an interactive application, not a page, and this site ships no client-side JavaScript. | **Removed from page 02's routing.** The resolver's `UNROUTED` set fails the build if anything links to it before the route exists. |
| **Precision Impact Sprints unpublished** | `published: false`. Natural target for the urgency strip. | Left out. Nothing depends on it. |
| **Nine pages of copy** | The largest cost. The code is one collection, two routes and one nav row. | Build order in §9. |

---

## 9. Build order

1. **08, custom system.** The September and October commercial focus.
2. **09, efficiency.** Same push, same buyer.
3. **01, more leads.** The core business, and the highest-intent keywords measured.
4. **03, packaging.** Copy already drafted and validated.
5. 02, 04, 05, 06, 07 in any order.

---

## 10. Verification

Per `CLAUDE.md`, through `npm run preview`, not `astro dev`.

1. `npm run check` passes
2. `npm run build` produces the expected new routes
3. Menu shows Start Here as 01 reading as first-person sentences, sections renumber to 02 through 05
4. Index rows use `need`; each page's H1 uses `title`; the two never match
5. Every service link on every page resolves to a built route
6. One H1 per page, no skipped heading levels
7. Each `seoDescription` measures 150 to 160 characters
8. Canonical, `WebPage` and `BreadcrumbList` present and correct on each
9. Keyboard navigation and visible focus through the index
10. `prefers-reduced-motion` respected on the hero
