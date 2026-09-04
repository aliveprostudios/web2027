# CLAUDE.md — Alive ProStudios (Astro)

> Read this fully before writing any code.

---

## What this project is

aliveprostudios.com, rebuilt on **Astro**, replacing the previous Next.js + Sanity
site. Built, deployed to staging, and awaiting launch.

**Client:** Alive ProStudios Inc.
**Owner:** Javad Ahmadi — Founder & Brand Transformation Architect
**Co-Founder:** Homayra Ahmadi — Operations Director
**Location:** Toronto, Canada (GTA) · **Founded:** 1997
**Markets:** Canada, USA, Germany, Middle East

---

## Decisions already made

Settled. Do not reopen without asking Javad.

1. **Astro, not Next.js.** Fully static: every route is prerendered, there is no
   SSR and no server function.
2. **No CMS.** Sanity is gone. Content is Markdown in this repo, edited with
   Claude Code or Codex. No API, no CDN, no tokens, no `/studio`.
3. **Cloudflare, not Vercel.** The Vercel adapter has been removed; `dist/` is
   plain files. `STYLEGUIDE.md` §9 still says "Deploy target: Vercel" — that line
   is superseded.
4. **Content came from the Sanity export** and is not re-pulled.
5. **Design is locked, and Design System C is the standard.** Approved by Javad
   2026-09-03. The canonical reference is
   `content/assets/templates and styleguide/Design System C (APPROVED 2026-09-03).html`,
   also published at
   `https://claude.ai/code/artifact/04f3e18a-d203-4654-b865-209f8228e7ec`.
   It merges the semantic H1-H6 mapping from the August handoff with the shipped
   tokens and every component, and it carries a White/Black switch.
   **It supersedes `Style Guide.dc.html` (22 August) wherever the two disagree**,
   which they do on H1 line-height (0.88, not 0.9), H3 size, the retired
   `aps-btn-ghost-dark` name, and the H1 nowrap rule. `STYLEGUIDE.md` and the
   page `.dc.html` templates still stand for anything C does not cover.
   **C is ahead of the website on purpose**: it specifies four approved changes
   the site has not received yet, listed under "Design System C rollout" in
   Known gaps. Build new work to C; do not treat the current CSS as the spec.
   If something looks wrong, ask before changing it.
6. **The hero H1 wraps.** `STYLEGUIDE.md` §1.3 and the `.dc.html` templates say
   the page title is a single line (`white-space:nowrap`). That line is
   superseded. It clipped 11 of the 55 titles at every viewport >= 761px, invisibly, because
   `.hero__line-mask` is `overflow:hidden`. Titles that fit still sit on one
   line; the rest wrap and balance. Do not restore `nowrap`.
7. **Case Studies is its own menu row, but its routes live under `/work`.**
   Settled 2026-09-01. The row sits after Work and expands to every client
   in the collection, ten since ASSA ABLOY was parked on 2026-09-02; the URLs stay `/work/case-studies/<slug>`, which is where the
   section was built and approved. Menu position and URL depth were treated as
   separate decisions deliberately. Moving to a top-level `/case-studies/` is
   free only until it shipped. **It shipped on 2026-09-03**, so moving to a
   top-level `/case-studies/` now costs a permanent redirect.

8. **Common Questions replaced the FAQ.** Settled 2026-09-01. `/resources/faqs`
   is gone, along with `content/faqs.md` and `src/lib/faqs.ts`; `/faqs` and
   `/resources/faqs` both 301 to `/common-questions`. Javad's reason was that
   the seven questions read like nobody wrote them, which is fair: they came
   from the Sanity export. Do not rebuild a second FAQ under Resources.
   **Flat since 2026-09-02.** No categories: the hub is one list of topics at
   `/common-questions/<topic>`, one Markdown file per topic directly in
   `content/common-questions/`. Javad's reason was scale: three fixed buckets
   looked like a structure that could not grow. Do not reintroduce grouping in
   the URL; if the list needs themes, do it on the hub as presentation only.
   **Two hub bands since 2026-09-02, By Topic and By Business.** Javad's
   direction: Systems is a topic, not a band, so the three systems clusters sit
   with brand, marketing and search under By Topic (6 clusters, 19 answers);
   By Business is by reader and holds the industries (2 clusters, 5 answers).
   He could not find the systems and business work because the flattening left
   one band labelled "Topics" and those words appeared nowhere on the site.
   **This amends the frontmatter half of the 2026-09-02 rule.** The band comes
   from an optional `audience: topic | business` on each cluster, defaulting to
   `topic`. Deriving it on the hub instead would mean a hard-coded slug list,
   so adding `law-firms.md` would land it in the wrong band silently, which
   breaks rule 1. Verified by dropping a temporary industry file: it appeared
   under By Business with its route and both counts, no code change. The URL
   rule is untouched, every cluster still builds at `/common-questions/<slug>`,
   and an empty band renders nothing rather than a bare heading.
   **In the Resources menu since 2026-09-02, URLs unchanged.** Javad's call, the
   same day it got its own row: the section is a Resources child, from a
   numbered `##` in `content/landing/resources.md`, with the display name
   mapped to `/common-questions` in `CHILD_URL_OVERRIDES`. Menu position and
   URL depth are separate decisions, as with Case Studies; moving the URL under
   `/resources/` was free only until it shipped, and it shipped 2026-09-03, so
   it now costs a permanent redirect. "Do not rebuild a
   second FAQ under Resources" still holds: this is the one FAQ, linked from
   where visitors expect it.

9. **Legal pages are documents, not service pages.** `/privacy-policy` has its
   own route and renders its Markdown through Astro, NOT through
   `MasterPage` + `parseAnatomy`. See `TEMPLATE-ANATOMY.md` §4 for why.

10. **DataForSEO is not used on this project.** Javad's call, 2026-09-01: he is
    not planning to use it any more. Do not call it, do not propose it, and do
    not leave "re-validate with DataForSEO" as a follow-up. Where a decision
    was made without volume data, say so plainly and move on.

11. **One enumerated framework on the whole site.** The Brand-to-Revenue
   Performance System, four domains, owned by `/alive-pro/our-system`. Settled
   2026-08-25 because three frameworks were competing under overlapping names:
   the System on Home, a "Brand Transformation System" on Our Process that was
   the same four domains relabelled as phases, and a separate "Four Pillars" on
   Our Philosophy. Every other page now argues in prose and links to Our System.
   Do not give any page its own four- or five-part model, and do not reintroduce
   the name "Brand Transformation System".

---

## Current state

**LIVE at https://aliveprostudios.com. 74 routes, 86 redirects.**

**The full rebuild went to production on 2026-09-03**, Javad's approval, a
fast-forward of `main` to `staging` at `0848638`, 30 commits. Production had been
serving the launch-day 54-route build since 2026-08-24; that gap is now closed and
`main` and `staging` are identical. This push shipped Case Studies, Common
Questions, the new home page and the new footer together.

Verified on the live domain after the deploy, not from the build log: all 72
sitemap URLs return 200, `X-Robots-Tag` is absent so production is indexable, the
sitemap carries 72 URLs all on the live host with no `workers.dev` leakage, the
four security headers are present, the WordPress redirects resolve, and both audit
fixes are in the shipped CSS.

The WordPress site is gone. GoDaddy still holds the registration but has not
served DNS for some time: the nameservers point at Cloudflare, and the apex is a
Custom Domain on the `aliveprostudios` Worker. Microsoft mail was never touched
and its four records are untouched to this day (MX, two TXT, `autodiscover`).

Production and staging both build 74 HTML routes and 86 redirects as of 2026-09-03, when `main` was fast-forwarded to `staging`. Counts here are `find dist -name '*.html' | wc -l`, which includes `404` and `thank-you`; the sitemap carries 72, correctly excluding those two. The history: 48 at the 2026-08-24 launch, 54 on 2026-08-30 when Resources came back in part, then 67 and 74 on staging as Case Studies, Common Questions and the new home page landed. One Resources route is still parked, see Known gaps.

**The audit that preceded the go-live.**
A full pre-launch audit ran 2026-09-02 against the built output and the served
site, not the source: SEO, AEO, accessibility, security, responsive, content
rules. 31 checks passed, 2 blockers were fixed and pushed the same evening, 13
findings remain and none of them block the push. The report, with evidence and
per-finding fixes, is the artifact
`https://claude.ai/code/artifact/41754051-0d13-42e1-84fe-0b6f0d92a627`; the open
findings are also in the Known gaps table below. Nothing in the audit was taken
from reading code alone.

Shipped 2026-09-02 after the audit: `5b5eb96` javad.ca links open in a new tab,
`5be6672` the two audit blockers, `2f1bb27` the Common Questions hub split into By
Topic and By Business. Then 2026-09-03 before the push: `dc9ad19` the Gallery
Specialty name and slug correction plus Javad's three case study headlines, and
`0848638` the Claritas retitle and the nine replacement home gallery photographs.
All of it is now on production.

```
alive-astro/
├── CLAUDE.md              ← this file
├── SITEMAP.md             ← canonical URL map + 86 redirects
├── TEMPLATE-ANATOMY.md    ← how the templates decompose; READ THIS FIRST
├── astro.config.mjs       ← static, no adapter
├── wrangler.jsonc         ← Cloudflare: ./dist, drop-trailing-slash
├── scripts/
│   ├── postbuild.mjs      ← generates dist/_headers and dist/_redirects
│   └── fetch-video-meta.mjs ← video dimensions + poster frames
├── src/
│   ├── components/        ← SiteNav, SiteMenu, VideoHero, BookConsult,
│   │                        RelatedServices, NextStep, SiteFooter, BgRails,
│   │                        Lightbox
│   ├── layouts/           ← BaseLayout, MasterPage
│   ├── lib/               ← anatomy, nav, landing, sections, videos, gallery,
│   │                        caseStudies, commonQuestions, figures, seo, pillars
│   ├── pages/             ← 74 routes on staging (+ `_resources/brochure` parked)
│   └── styles/            ← tokens.css, base.css
└── content/               ← Markdown, the source of truth for all copy
    ├── common-questions/  ← 8 cluster files, 24 answers; one file per CLUSTER
    └── work/hero-videos.md ← which video each SECTION uses; carries its own guide
```

### URLs

| | |
|---|---|
| **Live** | **`aliveprostudios.com`** |
| Production (`main`) | `aliveprostudios.javad-ade.workers.dev` |
| Staging (`staging`) | `staging-aliveprostudios.javad-ade.workers.dev` |
| Repo | `github.com/aliveprostudios/web2027` |

Push to `main` → production. Push to `staging` → staging. Nothing manual.
Staging carries `X-Robots-Tag: noindex`; production must not.

---

## The rules that keep this site consistent

**Read `TEMPLATE-ANATOMY.md` before touching a template or a route.** It records
where every slot's content comes from and the traps already hit.

1. **The content collection is always the source of truth** for nav sub-menus,
   related services, and every count. Never hard-code a list. Adding a Markdown
   file must add its route, its menu entry, and its count with no code change.
2. **Extract by type, place by slot.** `lib/anatomy.ts` maps Markdown to template
   slots by kind, not document order.
3. **Never invent copy.** A slot with no source is omitted, not filled.
4. **The first paragraph of a page's Markdown IS the H4 lede.** Keep it to 2–3
   sentences. Never split a paragraph in code to fake the design; fix the source.
5. **`--brand-orange` never changes.** It is the brand, used for surfaces, fills,
   dots, and rules. Small orange TEXT uses `--orange-ink`, which is theme-aware.
6. **Scroll locks go on `<html>`, never `<body>`.**
7. **Fixed overlays live outside `.page-root`.** `.hero` and `.page-root` both
   clip fixed descendants.

---

## Non-negotiables

1. **Ship every redirect.** 86 as of 2026-09-02, generated into `dist/_redirects`
   from `SITEMAP.md` by `scripts/postbuild.mjs`. The number grows; do not hard-code
   it anywhere but a dated note. Audited 2026-09-02: no duplicates, nothing
   shadowing a real page, every target resolves.
2. **One H1 per page**, no skipped heading levels.
3. **JSON-LD**: Organization, Service, FAQPage, Article, BreadcrumbList.
4. **Canonical URL per page.** The old site inherited the homepage canonical
   everywhere. Do not repeat it.
5. **WCAG 2.1 AA**, visible focus, keyboard navigation, `prefers-reduced-motion`.
6. **i18n-ready.** English has no prefix; fr/de/es/zh/ar are Phase 2, Arabic RTL.

---

## Commands

```bash
npm run build          # build + generate _headers and _redirects
npm run preview        # build, then serve through wrangler WITH headers
npm run check          # astro check
npm run video-meta     # refresh video dimensions and poster frames
```

**Verify through `npm run preview`, not `astro dev`.** A plain dev server applies
neither `_headers` nor `_redirects`, so it cannot tell you whether either works.

---

## Traps already hit — do not re-learn these

- **The build image runs npm 10.** A lockfile written by npm 11 fails `npm ci`
  there even though it passes locally. Regenerate with
  `npx npm@10 install --package-lock-only` and check under both.
- **Never hardcode a media aspect ratio.** Hero videos are scaled to cover using
  each source's real aspect, fetched from the provider. Assuming 16:9 is what
  makes a video letterbox inside its own iframe, which the box model cannot see.
- **Verify visual bugs with rendered pixels**, not `getBoundingClientRect()`.
- **`overflow: clip` and Safari's `overflow: hidden` clip fixed descendants.**
- **Astro renders `alt=""` as a bare `alt`.** Both are valid; audit for both.
- Framer Motion drove the old animations. All animation here is CSS.
- **`content/work/videos.md` titles may contain `|`.** The table is parsed by
  LOCATING the URL cell, not by counting columns, because titles are written
  "Bellini Modern Living | Brand Video". Splitting on position put the subtitle
  in the URL column, matched no provider, and dropped the row: four videos
  vanished from the page at once with no error. A numbered row carrying no
  Vimeo or YouTube URL now throws at build time.
- **`script-src` uses `'strict-dynamic'`, so `'self'` and every host source are
  IGNORED by modern browsers.** Every script this site emits must stay inline, so
  `postbuild.mjs` can hash it; a parser-inserted `<script src>` would be blocked
  at runtime. The build throws if one appears. This is what lets GTM inject GA4,
  Google Ads, Meta and LinkedIn without `'unsafe-inline'`, and it means editing
  the GTM container can never break the CSP.
- **`'unsafe-inline'` is inert here and always will be.** A policy carrying
  hashes makes browsers ignore it, and so does `'strict-dynamic'`. Adding it to
  fix a blocked script does nothing; add a hash or an origin instead.
- **`content/blog` and `content/drafts/blog` are not the same place.** The blog
  collection globs `*.md` in `content/blog` and does NOT recurse, so a post in a
  subfolder is invisible: no route, no error, no warning.
- **Slot 4 lifts images OUT of the copy by default.** `MasterPage` renders row
  images full bleed after the row, which is right for a service page's one
  poster diagram and wrong for an article, where it stranded a figure several
  paragraphs from the sentence introducing it. Articles pass `inlineFigures`.
  Do not change the default: `/alive-pro/our-system` depends on the full bleed.
- **Vite inlines any asset under 4KB as a base64 `data:` URI.** Seven of the
  twelve blog diagrams ship inside the HTML, not as files, so grepping `dist/`
  for a figure FILENAME under-counts them and looks like images were dropped.
  Count `<img src="data:image/svg` too before concluding anything is missing.
- **`schemaType="Article"` on `MasterPage` emits a SECOND Article.** The layout
  builds a `#page` entity from `schemaType`, so passing `Article` there put a
  thin stub (name + description) in the same graph as the real `#article`. Pass
  `WebPage` and let the route's `extraSchema` own the Article.
- **`new Date('2026-08-30')` is UTC midnight**, which is the previous day in
  Toronto, so post dates rendered one day early. Parse `${iso}T00:00:00`.
- **`aspect-ratio` loses to Astro's width/height attributes.** Every `<Image>`
  ships `width` and `height`, and without an explicit `height: auto` the
  presentational height wins: the case study gallery tiles rendered at their
  SOURCE height, 2160px for one, and the page carried 4,800px of empty column
  on a phone. Everything else measured correctly, including a computed
  `aspect-ratio: 1 / 1`, which is what made it hard to see. Any cropped
  `<Image>` needs `height: auto` beside the ratio.
- **Astro scopes component CSS with a data attribute, so a rule cannot reach an
  element built at runtime.** `InlineVideo` swaps its poster for an iframe on
  click; the new node carries no `data-astro-cid-*`, so the plain
  `.cs-video__frame` rule never matched and the player collapsed to an iframe's
  default 150px. Scope through a static parent and mark the runtime node
  `:global()`.
- **`figures.ts` resolves by BARE FILENAME across one flat folder.** That is why
  blog figures carry a slug prefix. Case study imagery instead lives one folder
  per client and resolves by FULL PATH, so eleven clients can each hold a
  `body-01.jpg`. Markdown must therefore carry the whole virtual path,
  `/assets/case-studies/<slug>/body-01.jpg`.
- **`content/case-studies/*.md` and the `intake/` drafts are two copies.**
  Regenerating the content files from intake silently reverted an edit made
  only in `content/`, dropping Alfred's video URL. The CSP hash count falling
  from 9 to 8 in the build output was the only signal. Edit both, or regenerate
  and re-apply.
- **A deploy-wait loop needs a marker unique to the NEW build.** Polling staging
  for `aspect-ratio:1` matched the hero's `1280 / 600` on the first request and
  reported a deploy that had not happened. Key on a string that cannot exist in
  the previous build.
- **`--pg-bg` / `--pg-fg` and `data-theme` live on `body`, NOT `:root`.** Reading
  them off `document.documentElement` returns empty and makes correct pages look
  like they have lost their theme tokens. `tokens.css` sets them on `body` and
  `body[data-theme='dark']`.
- **The hero H1's reveal animation looks exactly like a clipping bug.**
  `.hero__line-mask` is `overflow:hidden` and `heroRise` translates the line up
  from below, so a screenshot taken before the animation settles shows the last
  line cut in half. Wait for it before concluding anything. Separately, every
  wrapping title overhangs its mask by ~16px because `.t-h1` is
  `line-height: 0.88`; that is site-wide and by design, not a defect.
- **A hidden browser pane reports a 0x0 viewport and starves
  `requestAnimationFrame`.** `body` then measures 0 wide, text wraps at zero
  width, screenshots come back blank, and any double-rAF callback never fires.
  All three look like real bugs and are not. Check `window.innerWidth` and
  `document.hidden` before debugging layout through the pane, and call
  `resize_window` to force a real viewport.
- **A button variant scoped to `a.` silently misses every `<button>`.** The three
  `.aps-btn-*` variants were written `a.aps-btn-primary`, so the contact form's
  submit matched none of them and fell back to the UA's grey button chrome on
  the page where someone decides to get in touch. Worse, the obvious repair,
  dropping the `a`, LOWERS specificity to (0,1,0) and loses to
  `body[data-theme='dark'] a` at (0,1,2), which repaints the label lime on
  orange: 1.47:1 against a 4.5 bar. Both were fixed at once by keying on both
  classes, `.aps-btn.aps-btn-primary` at (0,2,0), which matches a `<button>` AND
  outranks the dark link rule without editing it. Never scope a component
  variant to a tag, and never "fix" specificity downward.
- **`getComputedStyle` mid-transition reports the START colour, not the end.**
  Toggling `data-theme` and measuring 300ms later flagged 16 contrast failures
  on correct markup, all of them the pre-toggle colour on the post-toggle
  background. Settled after ~1.5s, the real count was 6. Any colour measurement
  after a theme change needs a real settle, and a suspiciously round failure
  count usually means the transition, not the design.
- **A hidden browser pane cannot hold document focus, so `:focus` never
  matches.** The skip link looked like it failed contrast AND failed to reveal
  on focus. `document.activeElement` was the link, but `el.matches(':focus')`
  was false and `document.hasFocus()` was false. The rule is correct and wins on
  specificity. Check `document.hasFocus()` before believing any focus-state
  finding from the pane. This is the same family as the 0x0 viewport trap above.
- **`frame-ancestors 'none'` blocks same-origin iframes, so iframe-based test
  harnesses return a null `contentDocument`.** Measuring 8 pages x 3 widths
  through hidden iframes failed on all 24 with the same error, which reads like
  a broken script rather than a working CSP. Drive real viewports with the
  browser tools instead.
- **iOS rubber-band scrolling paints from `<html>`, not `<body>`.** Scrolling past
  the black footer showed a white band on every page, and it was not a layout
  gap: the footer's bottom edge already equalled `scrollHeight` exactly. iOS
  fills the overscroll area from the ROOT element's background and falls back to
  `body` when the root is transparent, which it was, and `body` is white in
  light mode. `html { background: #000 }` fixes both ends, because the footer
  below and the hero gradient above are both theme-invariant. Measuring
  `document.scrollHeight` against the footer will never reveal this.
- **YouTube cannot be made chrome-free, and no combination of params changes
  that.** `controls=0`, `modestbranding=1`, `fs=0`, `iv_load_policy=3` and
  `rel=0` are the ceiling; iOS Safari still lays the native player UI over the
  frame. Only Vimeo's `background=1` gives a silent decorative loop. Hero videos
  are filtered to Vimeo for this reason. Do not "fix" a chrome complaint by
  adding more YouTube parameters.
- **An inline `style` attribute outranks every `:hover` rule.** A demo row
  carried `style="color:#000"`, so the row could never change colour on hover no
  matter what the stylesheet said, and the hover looked unimplemented when it
  was correct. Inline styles beat class selectors regardless of specificity.
  Check for one before debugging a hover that appears to do nothing.
- **A wildcard host does not match the bare domain.** `https://*.analytics.google.com`
  leaves `analytics.google.com` blocked, which is exactly where GA4 posts its
  events. List both forms.

---

## Content rules

- **Canadian English** — colour, behaviour, centre, catalogue, honour
  ("ize" endings kept: organize, recognize)
- **No em dashes anywhere. Ever.**
- **Never use "honest" or "honestly".** Javad's rule, 2026-08-31. Say the candid
  thing instead of announcing that you are about to be candid. Applies to headings,
  body copy, meta descriptions and quotes alike. There is no approved exception.
- **Never give a price, range, percentage or benchmark for what anything
  costs.** Javad's rule, 2026-09-02. Prospects read an estimate as a bill and
  decide we are unaffordable before a conversation. Cost "depends on your
  needs, your expectations and the scope"; invite them to contact us.
- No filler ("In today's world", "As a trusted partner")
- Tone: strategic, authoritative, a partner not a vendor

---

## The blog

Three commands, in order. Nothing about a post is edited by hand after writing.

```bash
npm run blog-tags     # assign categories + tags from content/taxonomy.md
npm run blog-check    # the contract; also runs inside npm run build
npm run build
```

- **Write** with the `blog-writer` skill. It produces a self-contained folder in
  `intake/`, which is outside `content/` so a draft can never ship by accident.
- **Publish** with the `alivepro-blog-publish` skill. It slugifies the title,
  prefixes every figure with that slug, rewrites the paths, validates, and moves
  the folder to `intake/_archive/`. A folder still in `intake/` has not shipped.
- **Categories and tags are generated.** `content/taxonomy.md` holds the
  vocabulary as editable tables; `scripts/blog-taxonomy.mjs` scores each post
  and REWRITES its `categories` and `tags`. Editing either field by hand is
  pointless, the next run overwrites it. Change the vocabulary instead.
- **One category per post**, the highest scorer. Tags are labels plus Article
  `keywords`, deliberately NOT routes: a tag archive holding one post is thin
  content. Build category archives only once a category holds 3 or more posts.
- **The slug is the permanent public URL.** Renaming a published post costs a
  redirect, so it is worth a moment before the first publish.

## Working agreements

- Ask before structural decisions not covered here
- One component per file · TypeScript throughout
- Run commands directly rather than asking Javad to copy-paste
- Commit messages: clear, descriptive, present tense
- **Do not claim something works until it has been verified. Show the evidence.**

---

## Known gaps at end of 2026-09-02

| Item | Impact |
|---|---|
| **Alive Pro section rewritten 2026-08-25** | Shipped in `3090e98`. `/alive-pro/our-system` is new and owns the four domains, the Brand Core and the system diagram, which moved off Why Alive Pro. Our Process became six moments in time (First Conversation, Diagnosis, Blueprint, Build, Activation, Compounding) wrapped in a LifeCycle Support section, with no durations and no deliverable bullets, at Javad's direction. Why Alive Pro became a four-way comparison of the alternatives. Partnership leads with two paragraphs on what the relationship obligates both ways. What to Expect was cut to a lede plus two paragraphs on quality, precision and dedication. Each page owns a distinct stat so no figure is claimed twice: 29 (Why Alive Pro), 400+ (Our System), 6 (Our Process), 70% (Partnership) |
| **Our Philosophy unpublished 2026-08-25** | `published: false` in `content/pages/our-philosophy.md`, file intact, one line flips it back. Its two strongest ideas, the positioning-discipline argument and "your brand is what your staff deliver", were folded into Why Alive Pro as prose rather than lost. `/alive-pro/our-philosophy` and the legacy `/our-philosophy` both 301 to `/alive-pro/why-alive-pro`, verified live |
| Menu order is About, Why, System, Process, Partnership, What to Expect, Testimonials | Set by `order:` frontmatter. Sprints stays unpublished at 7. Blurbs on the `/alive-pro` landing rows are name-matched out of `content/landing/alive-pro.md`, so **a new page under `content/pages/` gets a row automatically but renders with no blurb until that file gains a matching `##` heading**. That is how Our System shipped bare for a build |
| About Us still reads as a large company | Javad's positioning is boutique, and it is now stated on Why Alive Pro ("We are not a large agency and have never wanted to be one"). About Us still says "all under one roof" and Our System says "one team", which read as size. Javad was offered a boutique line on About Us on 2026-08-25 and it was left open, not declined |
| **Common Questions LIVE IN PRODUCTION 2026-09-03, `/common-questions`** | **Flattened 2026-09-02:** one list of eight topics at `/common-questions/<topic>`, categories and subfolders gone, the two cost answers rewritten with no figures. Spec: `docs/superpowers/specs/2026-09-02-common-questions-flat-topics-design.md`. Replaced `/resources/faqs`, which Javad asked to remove because its seven questions came from the Sanity export and read like it. 9 routes: a hub plus 8 cluster pages holding 24 answers, weighted 10 systems, 9 topics, 5 business. **Cluster pages, not one route per question:** at 40-70 words of direct answer plus 150-300 of detail a per-question page would be ~350 words, the thinnest route on the site against case studies at 651-968. Each question keeps an anchor, so answer engines still extract one answer. Its OWN top-level menu row after Case Studies. **Design:** the approved FAQ accordion grammar (pillar grid, mono index, 600-weight question, glyph, orange plus dot, 0fr-to-1fr panel), but the DIRECT ANSWER is always visible and only the detail collapses; that paragraph is also the FAQPage `acceptedAnswer`, so visible text and schema cannot drift. One Javad quote per cluster page, eight in total. Schema is `WebPage` + `FAQPage` per cluster, `CollectionPage` on the hub; not `Article` (competes with the blog) and not `QAPage` (that is for forums). **Industries cut from five to two:** manufacturing and dental have 8 and 1 case studies behind them; law firms, gyms and med spas had none and went to the future list. **No search volume data informed it.** The question set is judgment: real search intent, the service pages each question has to support, and the case studies that prove it. Keyword tooling is out of scope on this project (decision 10). **Round one has no video or photography question**, which leaves Execution's 8 service pages unsupported; it is item 1 on the 30-question future list in the spec. Spec: `docs/superpowers/specs/2026-09-01-common-questions-design.md`. **Two hub bands since 2026-09-02 (`2f1bb27`): By Topic, 6 clusters and 19 answers, and By Business, 2 clusters and 5 answers.** Javad could not find the systems and business work, because flattening had left one band called "Topics" and neither word appeared on the site. Systems is a topic, not a band. The band comes from `audience` on each cluster file, so a future `law-firms.md` lands in By Business with no code change; verified with a temporary file. **Law firms are still unwritten and should stay that way until there is a law-firm case study**, which is why they were cut in round one. Routes are unchanged and still flat. Live in production since 2026-09-03 |
| **Work pages renamed 2026-08-25** | `/work/videos` is titled "Brand Marketing Videos" and `/work/portfolio` is "Projects & Campaigns", across H1, meta title, eyebrow, BreadcrumbList, gallery schema, nav sub-menu, `/work` rows and the prev/next footers. **Both routes are unchanged and that is deliberate.** Nav URLs are slugified from the display name, so both names are in `CHILD_URL_OVERRIDES` in `src/lib/landing.ts`; without them the menu would point at `/work/projects-and-campaigns` and `/work/brand-marketing-videos`, which do not exist, while the real pages stayed put. Rename either page again and that map must be updated in the same commit |
| Video library is 24, was 26 | Maple Investment Realty and "Alive ProStudios, Branding Company Toronto" removed 2026-08-25 at Javad's request. Titles now mix two separator styles, pipes ("Bellini Modern Living \| Brand Video") and colons ("Claritas: Market Leader & Authority"); both read fine alone but the mix is visible scanning the grid. Javad has not chosen one |
| **Google Tag Manager live 2026-08-26** | `GTM-PJLQRZC`, in `BaseLayout.astro`, on all 48 pages. The container fires GA4 `G-L9G3DSQCJQ`, Google Ads `AW-967661948`, a Meta pixel `314453825678590` and LinkedIn Insight `7456860`; all four verified sending on production. Two GTM **Custom HTML** tags log a CSP violation each: the Meta bootstrap, which still works because GTM retries through an allowed path, and a HubSpot form listener that is dead weight here since the contact form is Formspree. Converting both to native GTM templates clears the console. Consent: Javad's decision 2026-08-26 is that Canada does not require it, so no banner and no Consent Mode |
| **Resources part-restored 2026-08-30, FAQs added 2026-09-01** | `/resources`, `/resources/blog` and `/resources/faqs` are live on the staging line. Only `brochure.astro` is still parked under `src/pages/_resources/`. Nothing links to it because its row in `content/landing/resources.md` has no number line, and `parseLanding` only treats a NUMBERED `##` as a child (`src/lib/landing.ts`). That one edit controls the menu row, the landing card and the count together |
| ~~5 redirects point at blog posts never migrated~~ **RESOLVED 2026-08-30** | Those five, plus `/brand-marketing-blog`, now 301 to `/resources/blog`. The posts they named were never migrated and never will be, so the index is the correct destination. Only `/faqs` and `/digital-brochure` are still parked at `/` |
| **Marketing Blog live 2026-08-30** | Resources was restored and the section renamed **Marketing Blog**. 4 posts, 54 routes. Categories and tags are assigned by `npm run blog-tags` from `content/taxonomy.md`, never by hand; a post's `categories`/`tags` are overwritten on every run. Tags are labels plus Article `keywords`, NOT routes: a tag archive holding one post is thin content. Category archives are not built yet either, and should wait until a category holds 3 or more posts. `/resources/brochure` stays parked; its row in `content/landing/resources.md` has no number line, which is what keeps it out of the menu and the landing page at once. `/resources/faqs` was restored 2026-09-01 |
| Blog holds real writing now | The 3 Lorem ipsum placeholders were **deleted 2026-08-30** at Javad's request. `content/blog/` holds original posts written through the `blog-writer` skill, staged first in `intake/`. Routes stay down with Resources, so nothing is live yet. Javad wants at least 6 posts before the section returns |
| ~~`homepage.md` is Sanity block descriptors~~ **RESOLVED 2026-09-01** | Deleted with `home-intro.md` when the new home page replaced the launch-day one. The founder quote and closing statement it never carried are now real copy in `content/home/page.md`
| ~~Home hero rewritten 2026-08-25~~ **SUPERSEDED on staging 2026-09-01** | The H1 and caption survive on the new home page; the second looping video (Vimeo `1211175802`) and the EXPLORE NOW row treatment described here are gone from staging. Production still shows this version until `main` is pushed
| Home hero video is YouTube, not Vimeo | `fch5EecRUSE`, pinned in `hero-videos.md`'s `## Home` section. YouTube's logo watermark cannot be removed via any public embed param (`modestbranding`, `fs=0`, `iv_load_policy=3` were added, that's the ceiling) — every other hero video is Vimeo specifically to avoid this. Swap to a Vimeo source if a fully chrome-free loop is wanted here too |
| `brand-to-revenue-system.svg`'s capsule background is baked into the artwork | It is opaque white regardless of theme; only the transparent margins around it (near "DAY ONE" / "MARKET LEADERSHIP") are CSS-controlled. Both containers now match `--pg-bg` in either theme: `.pillars__figure` on Home, and `.rows__figure` in `MasterPage.astro` as of 2026-08-25, which previously forced `#fff` and painted a white band across the dark Our System page. Dark mode still shows a mostly-white diagram because the capsule itself is baked in. Javad confirmed 2026-08-25 to leave the SVG alone; a dark-mode export from the source `.ai` file is the real fix if that ever changes |
| ~~Contact form~~ **DONE** | Live on Formspree `mwlejogn`, verified end to end 2026-08-24: POST, redirect to `/thank-you`, mail to `javad@`. reCAPTCHA must stay OFF in Formspree or AJAX submissions 403. Form Flow's iframe embed was evaluated and rejected, see `LAUNCH.md` |
| Privacy policy describes a cookie banner | Javad's rewrite landed 2026-08-23 and fixed the false processors. §2 and §3 still promise a consent banner and a "Cookie settings" footer link that do not exist. **Sharper since 2026-08-26:** GTM now sets Google, Meta and LinkedIn cookies on first load, so the policy describes a control the site does not offer. Javad decided no banner is required in Canada, which makes this a copy fix rather than a consent build |
| Cloudflare Access not yet on staging | Staging is noindexed but publicly reachable. The `*-aliveprostudios` preview URL is still enabled |
| Cloudflare blocks AI training crawlers | Its managed robots.txt disallows GPTBot, ClaudeBot, Google-Extended, CCBot and others. Search crawlers and the AI *retrieval* bots are allowed, so citation still works. Toggle in AI Crawl Control. Worth a deliberate decision given the AEO service page |
| **Organization schema has no `sameAs`** | Confirmed by the 2026-09-02 audit and still the single biggest AEO lever left. `sameAs` is most of how an engine resolves "Alive ProStudios" to a corroborated entity rather than a string. Waiting on Javad's LinkedIn, Instagram, YouTube, GBP URLs. `areaServed` is missing from the same node and can be filled from facts already in this file (Canada, USA, Germany, Middle East) |
| **Meta descriptions, both ends of the range** | Measured 2026-09-02 across all 74: none missing, all unique, but 35 sit under 120 characters (25-112, the service pages) and 13 run over 160 (162-179) and get truncated in the SERP. The over-length ones are the Common Questions clusters and the case studies, both written most recently. 26 are in the 120-160 range. Trimming and padding, not writing from scratch |
| **Blog Article schema has no `image` or `description`** | All 4 posts. Google treats `image` as required for Article rich results, so the posts are ineligible for the enhanced SERP treatment and answer engines lose the thumbnail. Every post has diagrams to point at. Add both to the blog route's `extraSchema`; `dateModified` is also absent and is recommended, not required |
| **Case study Article schema has no `datePublished`** | All 10, and it is a required Article property. Stone Lamina and Vitality Dentistry also lack `image`, being the two with no `hero.jpg`. Their `headline` values are client names, so several are very short (`BFL` is 3 characters) and would read better as titles in a snippet |
| **CTA heading is white on orange at 2.92:1** | Found 2026-09-02 while verifying the button fix, pre-existing. `.cta__light` / `.cta__bold` in `BookConsult.astro`, on **70 of 74 pages**. Large text needs 3:1. Black on orange is 7.2:1 and is already the house treatment for that exact pairing on every button, so the fix is a one-line colour change. `.cqh__askLink` on the Common Questions hub is the same pairing at 13px, where the bar is 4.5:1 |
| **Related Services "Explore Now" is 3.62:1** | Found 2026-09-02, pre-existing, on **51 pages**. `.related__explore` uses the theme-aware `--orange-ink` on a permanently dark `#111111` band, so in light theme the token resolves to its dark-ground-hostile value. Needs 4.5:1 at 16px. `--brand-orange` gives 6.48:1 and is what the 14px inner span already uses. Worth checking other always-dark sections for the same pattern |
| **No `WebSite` entity, no `llms.txt`** | The graph carries Organization on all 74 and BreadcrumbList on 72, but no site-level `WebSite` node to anchor them, which is standard for entity resolution. `llms.txt` is absent too: optional in general, arguably less so for a studio that sells AEO |
| **Mobile menu does not trap Tab** | Everything else about it is right, and verified after a 1500px scroll: body-level fixed overlay, scroll lock on `<html>`, Escape closes, focus moves in on open and returns to the burger on close, `pageshow` clears a stranded lock. What is missing is a Tab loop, so tabbing past the last item walks into content behind the overlay. Best practice for a full-screen overlay, not a strict AA failure. Fix with a focus cycle or `inert` on `.page-root` |
| **`VideoObject` omits `description`** | 24 nodes on `/work/videos` carry name, embedUrl, thumbnailUrl, uploadDate and publisher. `description` is recommended by Google and missing on all of them |
| **8 case study `og:image` values are on content-hashed paths** | Tested rather than assumed: a clean rebuild produced byte-identical URLs, so the hash is content-derived and stable, and the cards are correctly generated at 1200x630 per page. The narrow risk is that re-exporting a hero changes its URL and breaks the preview on every link already shared. These pages have never been public, so pinning them is free now and expensive later. The other 66 pages use the stable `/assets/og-image.jpg` |
| **Blog collection glob hides subfolders** | `content/blog` globs `*.md` while services and Common Questions use `**/*.md`, so a post in a subfolder produces no route, no error and no warning. Already recorded as a trap below; the audit's view is that a trap worth documenting is worth failing loudly instead. Case study imagery has the same shape: a folder whose name does not match a slug is ignored silently |
| **Service pages make numeric claims with no source** | Not a breach of the no-price rule, which holds: `$550` appears nowhere in the shipped output because Precision Impact Sprints is unpublished. The inconsistency is that blog posts cite their statistics (Gartner, Edelman, McKinsey, Google) while several service pages state figures with none: "revenue increases of 20 to 30% within 18 months", "between 23% and 33%", "60 to 80% of invested resources". Same claim type, two standards of proof, on the pages a prospect reads before deciding |
| **Design System C APPLIED 2026-09-03** | Approved, then shipped the same day in `370b7e7`. Six changes, CSS only, 17 files. **`--orange-ink` retired**: 53 usages became `--brand-orange` and the token was deleted from `tokens.css` rather than aliased, so a stray reference now fails loudly. **H2 is Brand Lime.** **Primary button ink is white.** **`.aps-btn-lime` added** as a fourth variant, the accessible alternative primary at 10.61:1. **The dark button hovers to lime.** **Related rows** take an orange index at rest, an orange name on hover and a lime EXPLORE NOW on hover; the **CTA phone is white**. **These are deliberate accessibility trades, not defects.** Orange text on white is 2.92:1 and lime H2s are 1.98:1, against floors of 4.5 and 3.0; dark mode is unaffected and stays compliant. The figures live in `tokens.css` beside the tokens with an instruction not to reintroduce a darkened variant. Verification classified every contrast failure by colour pair rather than counting them, so an intended trade is distinguishable from an accident: zero unexpected failures on home, and the four that looked unexpected on a service page were white hero text measured against a transparent background, because the hero paints a gradient and the helper walks `background-color`. Against the real gradient they are 12.63:1 and 17.40:1. **Closes audit findings 14 and 15 as decisions.** |
| **Hero loops are Vimeo only since 2026-09-03** | Javad photographed a YouTube player on `/growth/lead-generation` from his phone: title bar, channel name, transport controls and "More videos" laid over what is meant to be silent decoration. The embed already carried `controls=0`, `modestbranding`, `fs=0` and `iv_load_policy=3`, which is the ceiling of YouTube's public params, and iOS Safari surfaces the native UI regardless. Only Vimeo's `background=1` is genuinely chrome-free. `videoForRoute` now filters YouTube out of the hero pool; **21 pages carried a YouTube hero and none do**. A section left with no Vimeo falls back to Default and **throws** if that is empty too, rather than silently rendering no hero. **The video library is untouched**: `/work/videos` still lists all 24 including 14 YouTube, the click-to-play reel on Home is unchanged, and `VideoObject` schema still cites the real embed URLs. **Home had exactly one hero entry and it was YouTube**, so Home now takes the Default reel (`vimeo/1210526678`). That is a content decision Javad may want to revisit: pin a Vimeo under `## Home` in `content/work/hero-videos.md` and it takes over. Removing YouTube also reshuffles which Vimeo each page draws, because the pick is `hash(path) % pool.length` |
| **Home H1 breaks explicitly since 2026-09-03** | Javad wanted three lines, `Fragmented / Marketing / is Expensive`, rather than whatever the wrapping produced. An optional `heroLines` array on the `home` collection carries one entry per rendered line, each revealing behind its own mask on a 90ms stagger. Omit it and the title renders as one wrapping line, so nothing else changes. **The two dots after "Expensive" were a literal full stop in the copy plus the CSS `.dot` device.** The copy lost its full stop and the device supplies it; `heroLines` documents that no entry should end in one, and the dot class lands on the last line only |
| **Three checks are now unblocked and still undone** | The 2026-09-03 push made these possible; none has been run. Google Rich Results Test on a live URL, which local reasoning explicitly does not substitute for. The LinkedIn Post Inspector and Facebook Sharing Debugger, to re-scrape any URL shared before the deploy, since a redeploy alone does not refresh a cached preview. And a Safari pass on the headers and CSP, which were only ever verified in Chromium |
| Homayra's headshot is 400x500 | Displays at 260px, so it is soft on retina. Javad's is 2000x2500 |
| Foundation and Infrastructure are alphabetical | Execution, Growth and Alive Pro were sequenced by priority 2026-08-24; the other two await Javad's order |
| ~~**"honest" site-wide sweep**~~ **DONE 2026-08-31** | Banned in Content rules, then removed everywhere in 21 individual rewrites, not a find and replace. Each was rewritten to say the thing rather than announce it: "an honest audit" became "an audit nobody enjoys", "the honest trade" became "the trade", "the honest opinion you did not ask for" lost the adjective because the clause already proved it. `partnership.md`'s H3 "The Honest History." is now "What Was Tried Before.". The Resources intro was fixed in BOTH `content/landing/resources.md` and the hard-coded string in `src/pages/resources/index.astro`, which is duplicated and would otherwise have left the rendered page unchanged. Zero occurrences remain outside the rule itself |
| **Start Here written, NOT approved** | 9 Markdown files in `content/start-here/`, **content rejected by Javad 2026-08-31**. He is giving per-page guidance next session, so treat the current copy as a first draft to be replaced rather than edited. What IS settled: the nine menu items (his words, confirmed), the menu-plus-answer structure (`need` is the visitor's sentence and drives the menu, index row and breadcrumb; `title` is Alive Pro's answer and is the H1, and the two must never match), the no-numbered-rows rule, and the routing (all 28 services reachable, verified). **Nothing is wired up:** no `startHere` collection, no routes, no nav row, so the files build nothing and are invisible in production. Spec: `docs/superpowers/specs/2026-08-24-start-here-section-design.md`. Plan (code only, copy lives in the files): `docs/superpowers/plans/2026-08-24-start-here-pilot.md` |
| **Javad's Sept/Oct 2026 focus: custom software for manufacturers** | Marketing stays the core business. The push is custom system design for manufacturing companies, which is why Start Here pages 08 and 09 lead the build order ahead of packaging. **No search volume data exists for that vertical**, and none is being gathered: keyword tooling is out of scope (decision 10). Positioning for the push is judgment-led, anchored on the eight manufacturing case studies |
| **Case Studies LIVE IN PRODUCTION 2026-09-03** | **Headlines rewritten 2026-09-02** at Javad's direction: 46 headings across ten files, plain and factual instead of creative, because clients read these pages and a poetic headline gets misread (BFL would have rejected "A Portfolio That Had to Be Named Before It Could Be Sold"). Rule going forward: no headline that describes the client as lacking something, say what we did or what it produced, numbers where they exist. **ASSA ABLOY parked the same day**, not ready, Javad is reworking it: the Markdown and its two images moved to `content/drafts/case-studies/`, which no collection globs, with a README holding the restore steps and its unapproved headline proposals. Its picks were replaced with Gallery on Home and Stone Lamina on the manufacturing question; staging is 10 clients and 74 routes until it returns. Originally 11 clients, 12 new routes (`/work/case-studies` plus one per client), and its OWN top-level menu row placed after Work at Javad's direction, despite the routes sitting under `/work`. Live in production since 2026-09-03. Copy was written from Javad's per-client drafts, reviewed as a set so no two pages repeat an argument or a System entry point, and lengths run 651 to 968 words by what each client's material earns. **Imagery landed for all eleven on 2026-09-01.** Javad supplied the folders named by CLIENT ("ASSA ABLOY", "Gallery Specialty"); they were renamed to the SLUGS because `caseStudies.ts` resolves by folder name, so a folder that does not match a slug is silently ignored. Nine of the ten new folders carry a `hero.jpg` (2560x1200); **Stone Lamina and Vitality Dentistry have none** and fall back to `VideoHero`, which is the designed behaviour, not a bug. Nineteen `body-NN.jpg` figures (2000x1545) were placed in the Markdown, each after the section it illustrates, with alt text written from the image; body figures render ONLY where the Markdown references them, so dropping a file alone does nothing. Only Alfred has a `gallery-*` set. The `content/case-studies/*.md` files are now ahead of the `intake/` drafts by these figure lines, same as Alfred's video URL: regenerating from intake would drop them. Rule still holds: no `hero.jpg` falls back to `VideoHero`, absent `gallery-*` renders no gallery, absent `body-*` is prose. Design approved by Javad 2026-09-01. **Javad revised three headlines and one company name on 2026-09-03**, the morning of the go-live: new `##` headlines on MCON Pipe, Gallery and Darmaga, written by him and kept verbatim. **"Gallery Specialty Hardware" was wrong; the company is "Gallery Specialty".** The name was corrected in `title`, `seoTitle` and one figure's alt text, and the slug went with it: `gallery-specialty-hardware` to `gallery-specialty`, so the file, the `slug` and `url` fields, the image folder, both figure paths, the Home pick in `content/home/page.md`, the reference in `content/common-questions/manufacturing.md` and the ASSA ABLOY restore note all moved together. **No redirect: the URL was staging-only and never public.** Renaming a case study after production would cost a permanent one, which is why it was done the same morning. The image folder had to move in the same commit or the three images would have vanished with no error, per the folder-name rule above |
| **New home page LIVE IN PRODUCTION 2026-09-03 (was Home-B)** | **2026-09-02:** the DNA image moved from the hero to the parallax feature slot above the footer (`content/assets/home/feature.jpg`, no credit; the Alfred packaging image and its credit are gone from Home). The hero subtitle grew from 45px to 64px at the top of its range. The hero is now Javad's photograph of three older men in a car, wide-eyed at the camera (`hero-old-man.jpg` on his Desktop, copied to `content/assets/home/hero.jpg` on 2026-09-02); it arrived in chat first, which put nothing on disk, and only the named file made the swap possible. Built as a draft at `/home-b`, iterated with Javad through the day, then promoted to `src/pages/index.astro` at his direction; the draft route, its sitemap filter and the `homeB` collection name are gone. Copy lives in `content/home/` (`page.md`: hero, credits, case study picks, reel video, clients heading, quote, closing; `intro.md`: the help block and four cards) through the `home` collection; imagery in `content/assets/home/` (`hero.jpg`, `gallery/*.jpg`). `content/homepage.md` and `content/home-intro.md`, which fed the launch-day home page, are DELETED. Sequence: hero (DNA image, no credit), We Are Here to Help You Grow with the Alive Pro mark beside the copy and an orange button, four cards, Our Clients as two scroll-driven logo lanes from `content/assets/logos-clients/`, looping reel with caption, the System with its heading broken after "Brand-to-Revenue", three case study tiles, Watch the Reel (click-to-play `youtu.be/YoudIrML8lU`), nine-image gallery with the shared Lightbox, founder quote with both marks (Javad's links to javad.ca), Alfred feature image with credit, closing, Next Step. Title tag is "Brand Transformation Agency in Toronto"; the H1 stays "Fragmented Marketing is Expensive." **Shipped to production 2026-09-03** together with Case Studies, Common Questions and the new footer
| `/brand-pulse` | No route yet. `/thank-you` was built 2026-08-23, noindex and out of the sitemap |

---

## Reference

Previous site at `../04 Alive-Reborn/` (Next.js) for portfolio data, images, and
component behaviour. Sanity project `22a48h68` intact and untouched.

---

*Alive ProStudios Inc. — Confidential — Astro rebuild — started 2026-08-22*
