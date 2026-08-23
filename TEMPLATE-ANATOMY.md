# TEMPLATE-ANATOMY.md

How the three approved templates decompose into Astro components, and where every
piece of content on screen comes from.

**Authority order** (highest wins):

1. `STYLEGUIDE.md` §9 Clarifications
2. `STYLEGUIDE.md` body
3. The three `.dc.html` templates (visual reference: structure, inline styles, order)
4. This document

The `.dc.html` files are a design tool's export. Read them for exact structure and
values. Their runtime (`x-dc`, `dc-import`, `sc-for`, `sc-if`, `DCLogic`, `support.js`,
`image-slot.js`) is **not** ported.

---

## 1. The Rosetta Stone

`Master Page Template.dc.html` is `content/services/foundation/brand-name-identity.md`
rendered. Every string in the template comes from that one file, except the hero caption
(see §4). This is what makes the mapping derivable rather than guessed, and it is the
reference page for the vertical slice.

---

## 2. Source classes

Every slot on every page draws from exactly one of these:

| Class | Meaning |
|---|---|
| `CONST` | Fixed in the template. Same on every page. |
| `FM` | Page frontmatter. |
| `MD` | Extracted from the page's Markdown body by type (see §4). |
| `ROUTE` | Derived from the URL. |
| `COLLECTION` | Built from the content collection at build time. Never hard-coded. |
| `GLOBAL` | A shared component with its own data source. |

---

## 3. Master Page Template

Applies to all 29 service pages, the 8 Alive Pro pages, the 8 landing pages, Contact,
and 404. Section order is locked by `STYLEGUIDE.md` §9.

| # | Section | Source | Notes |
|---|---|---|---|
| 1 | Hero: grey gradient `#333 → #1A1A1A` | `CONST` | Theme-invariant |
| 1a | Breadcrumb eyebrow "FOUNDATION · STAGE 01" | `ROUTE` | `{section} · Stage {index}`. Foundation 01, Execution 02, Growth 03, Infrastructure 04. Lime on dark, 1px orange rule under. Never hard-coded per page |
| 1b | H1 + orange dot | `FM.title` | One per page. `white-space:nowrap` desktop, wraps at 44px on mobile |
| 1c | Hero caption | `FM.caption` → fallback `MD` | See §4 |
| 2 | VideoHero | `GLOBAL` | Route-hash pick from the shared pool |
| 3 | "(01) Why It Matters" | `CONST` label + `MD` | See §4 slot map |
| 4 | Numbered content rows | `MD` | One row per heading after the first |
| 5 | Quote band | `MD` | Omitted entirely when the page has no blockquote |
| 6 | Closing H4 statement | `MD` | Final paragraph, two-tone |
| 7 | BookConsult | `GLOBAL` | |
| 8 | "(02) Related Services" | `GLOBAL` + `COLLECTION` | |
| 9 | NextStep | `GLOBAL` | `sectionNum="03"` |
| 10 | Black footer bar | `GLOBAL` | |

Plus, on every page: the `.bg-rails` layer (`CONST`, `z-index:5`) behind all content
(`z-index:6`).

---

## 4. Markdown to slot mapping

**Rule (STYLEGUIDE §9 Clarifications): extract by TYPE, place by SLOT. Not document
order.**

Worked against `brand-name-identity.md`:

| Markdown | Slot | Treatment |
|---|---|---|
| First `##` | 3, H2 | Condensed 800, `clamp(48px,6vw,104px)` |
| Intro paragraph, sentence 1 | 1c, hero caption | Fallback only, when `FM.caption` is absent or empty |
| Intro paragraph, remainder | 3, H4 statement | Two-tone: last sentence drops to `--pg-fg3` |
| Further paragraphs before next heading | 3, body copy | 17px / 1.6 / `--pg-fg2` |
| `**bold**` standalone paragraph | 3, stat block | Leading figure ("72%") extracted as the number, remainder becomes the caption, two-tone |
| `---` on its own line | 4, section break | Opens a section whose items ARE numbered. Renders nothing itself |
| `***` on its own line | 4, section break | Opens a section whose items are NOT numbered |
| A heading straight after either | 4, section head | **Always unnumbered**, full width, no hairline, H2 at `t-h2` scale |
| Each other subsequent `##` / `###` | 4, item | `01`, `02`, … **within the current section**, or no number in a `***` section. Condensed 800 H3 either way, on the same left edge |
| Paragraphs under those headings | 4, row body | |
| `![alt](/assets/diagrams/x.png)` alone on a line | 4, figure | **Edge to edge**, pulled out of the row grid and placed after that row's text |
| `**Label:**` followed by a `-` list | 4, row body | 12px uppercase label + disc `ul`, 22px indent |
| `>` blockquote | 5, quote band | **Hoisted** out of document order into its own band |
| Bold line following the blockquote | 5, attribution | "Name, Role" splits at the comma |
| Final paragraph | 6, closing H4 | Two-tone |

**Figures.** A line that is nothing but a Markdown image becomes a full-bleed figure.
The file lives in `content/assets/diagrams/`, NOT `public/`, and the Markdown points at
the virtual path `/assets/diagrams/<filename>`; `src/lib/figures.ts` resolves the two by
filename. A raster goes through `<Image>` for the AVIF/WebP srcset; an SVG is emitted
as-is, because a vector gains nothing from that pipeline, and its size is read from its
own `viewBox`. Either way what matters is the intrinsic `width`/`height`. Those dimensions are load-bearing: a
bare `<img src>` has no height until it loads, so the figure never intersects the
viewport, so `loading="lazy"` never fires and the image silently never appears. A
missing file throws at build time rather than shipping a broken image, and so does an SVG
with no `viewBox` and no width/height, since its aspect ratio could not be reserved. Only
site-absolute paths parse, so a content file cannot pull in an off-origin image.

`.rows__figure` paints a white ground in BOTH themes. The diagrams are transparent SVGs
drawn for white, so a themed ground would break them; in dark mode the figure therefore
reads as a full-bleed white band.

Images are extracted by type and placed by slot like everything else, which means an
image is rendered AFTER its row's text, not at the point it sits in the source. Author it
last in the row and the source reads the way the page renders.

**Section breaks.** By default every heading after the first is a numbered row and the
count runs straight down the page, which is what made `/alive-pro/why-alive-pro` number
its closing section "13". A thematic break on its own line ends that run: the heading
after it becomes a section head, rendered without a number and without the hairline that
chains the rows, and the count starts over beneath it.

CommonMark treats `---`, `___` and `***` as the same thematic break, so the character is
free to carry which KIND of section is being opened:

| Marker | The section head | Its items |
|---|---|---|
| `---` | unnumbered, `t-h2`, full width | numbered `01`, `02`, … restarting at 01 |
| `***` | unnumbered, `t-h2`, full width | no number at all |

An item in a `***` section is still an item: it keeps the hairline and the H3 scale and
stays on the same left edge as a numbered one, it simply has no number in the column.
That is the difference between a section head and a plain item, and it is why `Row`
carries both `num` and `section` rather than inferring one from the other.

Both markers are ordinary Markdown and no file used either before this was introduced, so
adding one is the only thing that changes a page. `parseAnatomy` decides `Row.num`; the
template never counts. `/growth/sales-funnel-building` uses both and is the worked example.

**Heading levels.** The Markdown's own `##`/`###` mix is not authoritative for output
level. Slot 3 renders `h2`, slot 4 rows render `h3`. This keeps one H1 and no skipped
levels regardless of how the source file was authored. (`brand-name-identity.md` mixes
`## Brand Naming.` with `### Brand Identity Design.` for two peer rows.)

**Never invent copy.** Where a slot has no source, the slot is omitted, not filled.

**A single `#` in the body is NOT a heading here.** `tokenize()` matches `^#{2,6}`,
so a `# Title` line falls through to the paragraph branch and renders the hash
literally. Four scraped files still carry one at line 10 (`brochure.md` and the three
blog posts), which is why `/resources/brochure` prints "# digitalBROCHURE" and
`/resources/blog/brand-marketing-toronto` prints "# GTA Market Growth" as its H4
statement. The H1 comes from frontmatter `title`, so the fix is to delete the line
from the source, not to widen the regex.

**This mapping is for marketing pages only.** Run over a legal document it produces
nonsense: `privacy-policy.md` yielded "1. Who we are" as the page's opening H2 under
"(01) Why It Matters", every numbered clause as a display row, one single-item `<ul>`
per blank-line-separated bullet, and "Back to home" promoted to the closing statement.
`/privacy-policy` therefore has its own route (`src/pages/privacy-policy.astro`) that
renders the Markdown through Astro's own pipeline: numbered `##` sections styled as
the §1.3 H5 kicker, body copy, and real grouped lists, inside the usual hero, video,
and global closing sections. Any future legal page should follow it, not this table.

**Authoring rule for the lede.** The first paragraph of a page's Markdown IS the
H4 lede, so keep it to **2 to 3 sentences**. Everything after the first paragraph
break is body copy. When an opening paragraph runs long, insert a paragraph break
at the natural point in the source file. Never split a paragraph in code to fake
the design: the split point is an editorial decision and belongs in the content,
where it is visible and reviewable.

---

## 5. Home Page Template

**Slot order.** 1 Hero · **1b Intro blocks** · 2 Why It Matters · 3 VideoHero · 4 Pillars ·
5 Founder quote · 6 Feature image · 7 Closing · 8 NextStep · 9 Footer.

**Slot 1b, the four intro blocks**, is read raw from `content/home-intro.md`, the same
`?raw` route `homepage.md` already uses, and split on `##` into heading + paragraph pairs.
It deliberately does NOT go through `parseAnatomy`: that parser maps a document onto the
Master template's slots, so it would hoist the first heading into an H2, number the rest
as rows, and promote the last paragraph to a closing statement. Four peers want a flat
split. Adding or removing a `##` block in that file changes the grid with no code change.

**Slot 6, the feature image**, is 60vh (reduced 40% from 100vh on 2026-08-23) and
parallaxes on scroll. The image is 125% of the frame, so 25% of the frame is spare travel,
and shifting it by 20% of its OWN height moves it exactly that far; both figures are
relative to the frame, so the maths holds at any height. It uses a CSS scroll-driven
animation (`animation-timeline: view()`), so there is no scroll listener and no JS.
Browsers without support keep the centred crop, which is also what `prefers-reduced-motion`
leaves behind since base.css kills every animation globally.

Differs from Master: photo hero instead of gradient, pillar rows instead of content
rows, and **no BookConsult and no Related Services**.

| # | Section | Source | Notes |
|---|---|---|---|
| 1 | Hero: full-bleed photo, no overlay | `CONST` asset | 85vh desktop / 62vh mobile. Caption hidden on mobile |
| 2 | "(01) Why It Matters" | `MD` | |
| 3 | VideoHero | `GLOBAL` | Note: **after** the Why It Matters section here, unlike Master |
| 4 | Four pillar rows | `COLLECTION` | See below |
| 5 | Founder quote band + portrait | `MD` | 320px portrait column, 12px radius |
| 6 | Full-screen feature image | `CONST` asset | 100vh desktop / 52vh mobile |
| 7 | Closing H4 statement | `MD` | |
| 8 | NextStep | `GLOBAL` | |
| 9 | Footer | `GLOBAL` | |

**Pillar rows are `COLLECTION`, not `CONST`.** Each of the four rows is one category
landing page:

| Row | Source file | H3 pillar | H5 orange kicker | Body |
|---|---|---|---|---|
| 01 | `content/landing/foundation.md` | "Foundation" | "Where every great brand begins" | intro paragraph |
| 02 | `content/landing/execution.md` | "Execution" | | |
| 03 | `content/landing/growth.md` | "Growth" | | |
| 04 | `content/landing/infrastructure.md` | "Infrastructure" | | |

Confirmed: pillar 01's body in the template is verbatim from `landing/foundation.md`.

> **OPEN — blocks the Home route, not the vertical slice.** `content/homepage.md` holds
> Sanity block descriptors (`[blockKineticHero]`, `[blockStats]`, `[blockGiantWord]`, …),
> not prose. It has no H1 text, no Why It Matters copy, no founder quote. The template's
> H1 reads "Supercharge your brand"; `homepage.md` says `headlineLines: Unleash Your /
> Brand's True`. Slots 2, 5, and 7 have no source. Needs either a rewritten
> `homepage.md` or a decision on where that copy comes from.

> **OPEN — `landing/*.md` are scrapes, not clean Markdown.** They carry orphan list
> numbers on their own lines and mashed headings (`# where every greatBRAND BEGINS`).
> The four pillar bodies are extractable; the rest of each file needs a cleanup pass
> before those four routes can render.

---

## 6. Gallery Page Template

| # | Section | Source | Notes |
|---|---|---|---|
| 1 | Hero: grey gradient, breadcrumb, H1, caption | same as Master 1 | |
| 2 | VideoHero | `GLOBAL` | |
| 3 | Gallery grid | `COLLECTION` | `import.meta.glob` over the gallery folder. 3 cols desktop / 1 col mobile, 30px gutter, 19:9 thumbs, 8px radius. Hover: lift 6px + zoom 1.07 |
| 4 | Lightbox | client island | `rgba(0,0,0,0.9)`, 900px image, prev/next, close, counter, 2s auto-slide. Arrows reset the timer, close stops it |
| 5 | BookConsult | `GLOBAL` | |
| 6 | Related Services | `GLOBAL` + `COLLECTION` | |
| 7 | NextStep | `GLOBAL` | |
| 8 | Footer | `GLOBAL` | |

Count is dynamic, any number of photos. Renders gracefully when the folder is empty
(§9 Clarifications).

**Built at `/work/portfolio`.** Source is `content/assets/portfolio/` via
`import.meta.glob` in `src/lib/gallery.ts`, sorted by filename so the sequence is
stable across builds. Currently 35 photos, all 1200x675, so the 19:9 thumbs crop
via `object-fit: cover` and the 900px lightbox never upscales. Thumbnails render
at 400/800 widths and lightbox frames at min(1800, source width), all WebP via
Astro Image. Adding or removing a file changes the grid, the counter, and the
slideshow with no code change.

`RelatedServices` needs a pillar and the Work routes have none, so both are set
to `execution` (the disciplines that produce this work). Change the prop in the
page if a different pillar reads better.

### Work section

`/work` has two children, both driven by `content/landing/work.md`:

| Route | Source | Count |
|---|---|---|
| `/work` | `landing/work.md` via `src/lib/landing.ts` | 2 rows |
| `/work/portfolio` | `content/assets/portfolio/` via `import.meta.glob` | 35 photos |
| `/work/videos` | `## All videos` table in `content/work/videos.md` | 26 videos |

The nav accordion for Work reads the same landing file, so adding a `## Name`
row there adds both the landing row and the menu entry. The counts shown on the
`/work` rows are read live from each child's own source, so they cannot drift.

**Video wall.** Titles, tags, and filter-tab counts all parse out of the videos
table; the tabs derive their counts from the tags actually present (currently
Promotional & Educational 16, Brand Marketing 10). Tiles are POSTER FRAMES, not
embeds: 26 autoplaying iframes would be unusable, so `scripts/fetch-video-meta.mjs`
downloads a poster per video into `content/assets/video-posters/` (committed, so
a network failure at deploy cannot break the build) and the embed is created only
on click and destroyed on close, so nothing keeps playing behind the scrim.

---

## 7. Global components

### Menu reachability

Every route must be reachable from chrome that appears on all 54 pages. Audit it
by crawling the built HTML, not by reading the component:

- An accordion row is a TOGGLE, not a link (§4.2), so each section's own landing
  page would be unreachable. `withOverview()` in `lib/nav.ts` prepends a
  "{Section} Overview" entry to every accordion, which keeps the specced row
  behaviour and makes the landing reachable.
- `/privacy-policy` sits in the black footer bar, so it is reachable everywhere.
- Blog posts are reachable one level down from `/resources/blog`, which is
  normal for an index.

Current state: 51 of 54 routes reachable directly from the menu or footer; the
3 remaining are the blog posts behind their index.

### SiteNav
Header: white wordmark left; right cluster at `gap:28px` = "EST. 1997" → theme toggle →
hamburger (two 30×3px bars, 6px gap).

Overlay: `position:fixed; inset:0; z-index:100`, orange, `navFade` 300ms.

8 primary rows, `COLLECTION`-driven. Foundation / Execution / Growth / Infrastructure /
Alive Pro expand into accordions; Work / Resources / Contact are direct links. Row =
mono number (11px, 24px column) + label Barlow **200** 22px uppercase + `+`/`−` glyph.
Current page renders black instead of white. Hover `translateX(8px)`, sub-links `6px`.

> The `.dc.html` sub-menu links point at `link.href` (the parent's URL) for every child.
> That is a stub in the design file. In Astro each child gets its own URL from the
> collection.

The overlay must be a **sibling of `<header>`, not a child** — a fixed element nested in
a header that later gets `backdrop-filter` takes the header as its containing block and
collapses.

### VideoHero
`aspect-ratio: 1280/600`, `--surface-video` backing, no letterboxing. Vimeo background
embed. One shared `HERO_VIDEOS` const, currently the 26 IDs in `content/work/videos.md`
(§9 Clarifications: pool size is irrelevant, the rule is one const + route hash).
Deterministic pick: `hash(pathname) % pool.length`. Optional `videoId` prop override.

### BookConsult
Full-bleed orange, theme-invariant, 96px vertical. Three-line stacked headline: light 200
→ Condensed 800 + black dot → light 200 at `rgba(0,0,0,0.65)`. Lines are props
(`lineLight` / `lineBold` / `lineClose`), defaults "The first word" / "your market hears" /
"Make it count." Buttons: `.aps-btn-dark` + `.aps-btn-ghost` + `tel:` link. Rotating badge
180–240px, `spinSlow` 22s, scale 1.06 on hover. Bottom marquee.

### RelatedServices
Eyebrow "(02) RELATED SERVICES (n)", count auto. Rows: mono number (13px, 40px col) +
name Barlow **200** `clamp(28px,3.6vw,60px)` + right-aligned EXPLORE NOW ↗ in orange.
Row hover `translateX(12px)` + name to orange; the EXPLORE NOW group additionally nudges
`translate(4px,-4px)`. Mobile: when the row wraps, EXPLORE NOW takes `margin-left:68px`
so it aligns to the name, not the number.

Data is `COLLECTION`: every page in the current page's section, current page excluded,
numbered in collection order.

### NextStep
`--surface-dark` `#161616`, theme-invariant. Eyebrow "({sectionNum}) NEXT STEP" in orange,
`sectionNum` a prop defaulting `03`. Headline "READY TO TRANSFORM" (200) / "YOUR BRAND"
(Condensed 800) + `dotPulse` orange dot. Giant "START THE CONVERSATION" row between
hairlines with a 40px ↗. Contact row. Bottom micro-marquee.

### Footer
Black bar, 12px/600/0.14em uppercase: back-link ← / "ALIVE PROSTUDIOS INC. TORONTO,
CANADA" / next-page link →.

### BgRails
5 vertical 1px hairlines at `rgba(128,128,128,0.12)`, at the gutter, the three quarter
columns, and the right gutter. Each carries a sweeping pulse: durations 26s / 34s / 30s /
38s / 32s, delays 0 / 7s / 14s / 3s / 10s, alternating orange and grey.

### Marquees
Every marquee is two identical copies in a `width:max-content` flex track animating
`translateX(0 → -50%)`. Never a single copy: that is what causes the jump.

---

## 8. Locked values

Do not substitute, round, or "improve" these. If one looks wrong, ask.

- **Gutter** `clamp(24px, 4vw, 56px)`, everything aligns to it
- **Columns** label 220px, number 120px
- **Type** Barlow (200/300/400/500/600/700) · Barlow Condensed (700/800) · JetBrains Mono
  (400, numbers only). The core move is 200 against Condensed 800, never a middle weight
  for display
- **Easing** `cubic-bezier(0.22, 1, 0.36, 1)`, the only easing
- **Durations** 220ms hover · 350ms transform · 400ms button roll · 900ms hero reveal
- **Z-index** video 1 · rails 5 · content 6 · nav 30 · menu 100
- **Breakpoint** 760px, single mobile breakpoint. 761–1280 is fluid via `clamp()`, no
  separate tablet layout
- **One orange primary CTA per view**
- **Focus ring** 4px orange glow, never removed
- Every hover transform defines its resting `transition` so it eases out as well as in

---

## 9. Theme

`data-theme="light|dark"` on `<body>`, persisted to `localStorage` under `aps-theme`,
default light. Content sections style **only** against `--pg-bg` / `--pg-fg` / `--pg-fg2` /
`--pg-fg3` / `--pg-line` / `--pg-band`.

Theme-invariant (identical in both modes): the hero, the orange BookConsult block,
NextStep, and the black footer.

In Astro component `<style>` blocks, `[data-theme='dark'] .x` is scoped and will never
match `<body>`. Use `:global([data-theme='dark']) .x`, or drive the value from a token.

---

## 10. Route coverage

46 routes built. Every internal link resolves except the two below, checked by
crawling the built HTML rather than by inspection.

| Group | Routes | Source |
|---|---|---|
| Home | 1 | design + `landing/*.md` pillars |
| Pillar landings | 4 | `landing/{section}.md` + services collection |
| Services | 28 | `content/services/**` |
| Alive Pro | 1 + 8 | `landing/alive-pro.md` + `content/pages/*` without `url:` |
| Work | 1 + 2 | `landing/work.md`, portfolio folder, videos table |

**55 routes. Zero dead internal links**, verified by crawling the built HTML.

`/contact` carries the §8 hairline form. The site is fully static, so there is
no endpoint to POST to: the form validates client-side and then composes a
pre-filled mail message, which works today with no third-party account. Wiring a
real endpoint is a one-line change (set `action`/`method`, delete the submit
handler). Email and phone are also shown as direct links, so there is a working
path with scripting off.

`/thank-you` and `/brand-pulse` still have no route.

**5 redirects point at blog articles that were never migrated**
(`/resources/blog/online-digital-advertising` and four others). They 301
correctly and land on the 404. Either write those posts or repoint those five
rows in SITEMAP.md at `/resources/blog`; a 301 to the index beats a 301 to a
404.

## 11. Deployment (Cloudflare)

Fully static: every route is prerendered, there is no SSR and no server
function, so no adapter is involved. `dist/` is plain files.

| Setting | Value |
|---|---|
| Build command | `npm run build` |
| Output directory | `dist` |
| Production branch | `main` |
| Staging branch | `staging` (any non-`main` branch is treated as staging) |

Deployed from GitHub (`aliveprostudios/web2027`) via Workers Builds, so a push
redeploys. There is no manual deploy path for staging on purpose: a hand-run
`wrangler deploy --env staging` would create a second, stale worker that never
updates on push.

| | URL |
|---|---|
| Production (`main`) | `aliveprostudios.javad-ade.workers.dev` |
| Staging (`staging`) | `staging-aliveprostudios.javad-ade.workers.dev` |
| Per-build snapshot | `<version>-aliveprostudios.javad-ade.workers.dev` |

The staging address is a BRANCH ALIAS and is stable. The per-version URLs change
on every push, so they are for freezing one build for review, not for
bookmarking.

**Build image gotcha:** the image runs npm 10.x. A lockfile written by npm 11
fails `npm ci` there with transitive optional deps "missing from lock file",
even though `npm ci` passes locally. Regenerate with
`npx npm@10 install --package-lock-only` and check `npm ci` under both.

`wrangler.jsonc` sets `html_handling: "drop-trailing-slash"` so
`/foundation/brand-name-identity` serves the `.html` and the trailing-slash form
redirects to it. This MUST match the canonical URLs or every page gets two
addresses.

**`_headers` and `_redirects` are GENERATED** by `scripts/postbuild.mjs` on every
build. Never hand-edit them:

- **63 redirects** parsed from the table in `SITEMAP.md`, which stays the single
  source of truth. The script throws rather than shipping an empty file.
- **CSP** with script hashes computed from the built HTML, so no
  `'unsafe-inline'` and no hash drift when a component script changes. Only
  executable scripts are hashed; `application/ld+json` and `application/json` are
  data blocks the browser never executes.
- **Staging gets `X-Robots-Tag: noindex, nofollow`**, detected from
  `WORKERS_CI_BRANCH` / `CF_PAGES_BRANCH`, or forced with `STAGING=1`.
  Put Cloudflare Access in front of the staging hostname as well: noindex is a
  request, Access is a wall.

Verified through `wrangler dev` (a plain static server does not apply headers):
all 63 redirects resolve exactly as specified, headers are present, the
trailing-slash form canonicalises, `/nope` returns a real 404 with the §8 page,
and the site runs clean under the CSP with no violations, with fonts, both video
providers, the theme toggle, the menu and the lightbox all working.

**10 of the 63 redirects still point at unbuilt routes** (`/contact` and the
`/resources` tree). They 301 correctly but land on the 404 until those routes
exist.

## 12. Open items

| # | Item | Blocks |
|---|---|---|
| 1 | `homepage.md` is Sanity block descriptors, no prose. Slots 2, 5, 7 of the Home template have no source | `/` |
| 2 | `landing/*.md` are live-site scrapes; the parser handles the orphan numbers and mashed headings, but the copy below the fold is still live-site furniture | nothing, ignored by the parser |
| 2c | All 3 blog posts are Lorem ipsum | `/resources/blog` |
| 3 | 51 of 52 pages have `caption: ""` awaiting copy. Fallback applies meanwhile | nothing, degrades cleanly |
| 4 | ~~No gallery photos~~ DONE: 35 photos, `/work/portfolio` live | |
| 5 | `/thank-you` and `/brand-pulse` have no template assignment | those 2 routes |

### Colour contrast, resolved

`CLAUDE.md` requires WCAG 2.1 AA. axe-core on the first build returned 17
colour-contrast failures, all of them locked brand values. Resolved by splitting
the accent into **one colour, two ink values** (see `tokens.css`):

| | Value | Used for |
|---|---|---|
| `--brand-orange` | `#F76E1E` | surfaces, fills, dots, rules, borders. Never changes |
| `--orange-ink` | `#B84A0E` light / `#F76E1E` dark | orange **text** |

`#B84A0E` keeps the brand hue (22.1 deg) and saturation exactly and only drops
lightness. It measures 5.22:1 on `#FFFFFF` and 4.74:1 on the `#F4F4F4` quote
band. In dark mode the token maps back to `#F76E1E`, which already measures
6.48:1 on `#111111` where `#B84A0E` would fail at 3.62:1.

Also applied:

- Small text on the orange CTA surface is black, matching the block's existing
  secondary lines: eyebrow to black 75% (5.27:1), phone to black, and the ghost
  pill's 13px label to black with a black border. The block was **not** flipped
  to black text.
- Muted whites on dark raised from 0.35 / 0.40 / 0.45 to **0.6** (7.07:1 on
  `#161616`, 7.37:1 on `#000000`).
- Black 55% on the orange menu overlay raised to 75%.

**Result: 17 failures down to 2**, in both light and dark mode, menu overlay
included. The two that remain are `.cta__light` and `.cta__bold`, the white
display headline on the orange block, at 2.91:1 against a 3.0 large-text
threshold. White on `#F76E1E` cannot reach 3.0 while the orange is locked, so
this is a deliberate, accepted exception, not an oversight.

### Hero caption

`caption:` is now a frontmatter key on all 52 page files. Brand Name & Identity
carries the designed sentence transcribed from the template. The other 51 hold
`caption: ""` as a placeholder.

An empty string is normalised to `undefined` at the route, so the §9
intro-sentence fallback still applies to any page whose caption has not been
authored yet. Filling one in is a pure content edit with no code change.

The caption renders two-tone per §3: first sentence white, remainder
`--brand-orange`.

### Two-tone placement has no mechanical rule

The approved templates mute a different sentence in each case: the hero
statement mutes its **last** sentence, the closing statement mutes its
**middle** one. No rule derives both.

Implemented as: default to the last sentence, with an explicit override when the
source wraps the intended span in single-asterisk emphasis. On this page the
closing statement therefore mutes "Let's make them count." where the template
mutes "They're commercial ones." Wrapping that sentence in `*...*` in the
Markdown restores the design exactly.

### Lede paragraph breaks (done)

18 files had an opening paragraph longer than 3 sentences. A paragraph break was
inserted in each at the strongest rhetorical boundary leaving a 1 to 3 sentence
lede. **Break only: no text was reflowed, reworded, or reordered**, verified by
comparing every file against `HEAD` with all whitespace stripped (0 text-altering
diffs across 52 files).

All 29 rendered service pages now show a lede of 3 sentences or fewer.
`brand-name-identity.md` reproduces the Master template exactly: a 3-sentence H4
followed by two body paragraphs.

Three files were deliberately left alone:

| File | Why |
|---|---|
| `blog/brand-marketing-toronto.md` | entire post is Lorem ipsum placeholder |
| `blog/branding-restaurants.md` | entire post is Lorem ipsum placeholder |
| `blog/digital-marketing-redefined.md` | entire post is Lorem ipsum placeholder |
| `pages/testimonials.md` | opening paragraph is a client quotation; breaking it would split the quote. It should probably become a `>` blockquote so it lands in the quote band instead of the H4 lede |
