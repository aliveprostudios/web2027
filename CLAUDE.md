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
5. **Design is locked.** Typography, spacing, colour, and motion values come from
   `STYLEGUIDE.md` and the three `.dc.html` templates. If something looks wrong,
   ask before changing it.
6. **The hero H1 wraps.** `STYLEGUIDE.md` §1.3 and the `.dc.html` templates say
   the page title is a single line (`white-space:nowrap`). That line is
   superseded. It clipped 11 of the 55 titles at every viewport >= 761px, invisibly, because
   `.hero__line-mask` is `overflow:hidden`. Titles that fit still sit on one
   line; the rest wrap and balance. Do not restore `nowrap`.
7. **Legal pages are documents, not service pages.** `/privacy-policy` has its
   own route and renders its Markdown through Astro, NOT through
   `MasterPage` + `parseAnatomy`. See `TEMPLATE-ANATOMY.md` §4 for why.

8. **One enumerated framework on the whole site.** The Brand-to-Revenue
   Performance System, four domains, owned by `/alive-pro/our-system`. Settled
   2026-08-25 because three frameworks were competing under overlapping names:
   the System on Home, a "Brand Transformation System" on Our Process that was
   the same four domains relabelled as phases, and a separate "Four Pillars" on
   Our Philosophy. Every other page now argues in prose and links to Our System.
   Do not give any page its own four- or five-part model, and do not reintroduce
   the name "Brand Transformation System".

---

## Current state

**LIVE at https://aliveprostudios.com since 2026-08-24. 54 routes, 85 redirects.**

The WordPress site is gone. GoDaddy still holds the registration but has not
served DNS for some time: the nameservers point at Cloudflare, and the apex is a
Custom Domain on the `aliveprostudios` Worker. Microsoft mail was never touched
and its four records are untouched to this day (MX, two TXT, `autodiscover`).

54 as of 2026-08-30, up from 48: Resources came back in part, adding `/resources`, `/resources/blog` and four posts. Two Resources routes are still parked, see Known gaps. `/alive-pro/our-system` was added and `/alive-pro/our-philosophy` retired on 2026-08-25.

```
alive-astro/
├── CLAUDE.md              ← this file
├── SITEMAP.md             ← canonical URL map + 83 redirects
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
│   │                        faqs, figures, seo, pillars
│   ├── pages/             ← 54 routes (+ `_resources/`, faqs + brochure parked)
│   └── styles/            ← tokens.css, base.css
└── content/               ← Markdown, the source of truth for all copy
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

1. **Ship the 63 redirects.** Generated into `dist/_redirects` from `SITEMAP.md`.
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

## Known gaps at end of 2026-08-26

| Item | Impact |
|---|---|
| **Alive Pro section rewritten 2026-08-25** | Shipped in `3090e98`. `/alive-pro/our-system` is new and owns the four domains, the Brand Core and the system diagram, which moved off Why Alive Pro. Our Process became six moments in time (First Conversation, Diagnosis, Blueprint, Build, Activation, Compounding) wrapped in a LifeCycle Support section, with no durations and no deliverable bullets, at Javad's direction. Why Alive Pro became a four-way comparison of the alternatives. Partnership leads with two paragraphs on what the relationship obligates both ways. What to Expect was cut to a lede plus two paragraphs on quality, precision and dedication. Each page owns a distinct stat so no figure is claimed twice: 29 (Why Alive Pro), 400+ (Our System), 6 (Our Process), 70% (Partnership) |
| **Our Philosophy unpublished 2026-08-25** | `published: false` in `content/pages/our-philosophy.md`, file intact, one line flips it back. Its two strongest ideas, the positioning-discipline argument and "your brand is what your staff deliver", were folded into Why Alive Pro as prose rather than lost. `/alive-pro/our-philosophy` and the legacy `/our-philosophy` both 301 to `/alive-pro/why-alive-pro`, verified live |
| Menu order is About, Why, System, Process, Partnership, What to Expect, Testimonials | Set by `order:` frontmatter. Sprints stays unpublished at 7. Blurbs on the `/alive-pro` landing rows are name-matched out of `content/landing/alive-pro.md`, so **a new page under `content/pages/` gets a row automatically but renders with no blurb until that file gains a matching `##` heading**. That is how Our System shipped bare for a build |
| About Us still reads as a large company | Javad's positioning is boutique, and it is now stated on Why Alive Pro ("We are not a large agency and have never wanted to be one"). About Us still says "all under one roof" and Our System says "one team", which read as size. Javad was offered a boutique line on About Us on 2026-08-25 and it was left open, not declined |
| **`content/faqs.md` still says "four pillars"** | The site says four domains. **This is the blocker for the FAQ section, which is the next piece of work (Javad, 2026-08-30).** `/resources/faqs` is still parked in `src/pages/_resources/faqs.astro`. To ship it: fix the copy, move the route to `src/pages/resources/`, restore the `01` number line above `## FAQs` in `content/landing/resources.md` so the menu row and the landing card come back on their own, and repoint the `/faqs` redirect in `SITEMAP.md` from `/` to `/resources/faqs` in the SAME commit |
| **Work pages renamed 2026-08-25** | `/work/videos` is titled "Brand Marketing Videos" and `/work/portfolio` is "Projects & Campaigns", across H1, meta title, eyebrow, BreadcrumbList, gallery schema, nav sub-menu, `/work` rows and the prev/next footers. **Both routes are unchanged and that is deliberate.** Nav URLs are slugified from the display name, so both names are in `CHILD_URL_OVERRIDES` in `src/lib/landing.ts`; without them the menu would point at `/work/projects-and-campaigns` and `/work/brand-marketing-videos`, which do not exist, while the real pages stayed put. Rename either page again and that map must be updated in the same commit |
| Video library is 24, was 26 | Maple Investment Realty and "Alive ProStudios, Branding Company Toronto" removed 2026-08-25 at Javad's request. Titles now mix two separator styles, pipes ("Bellini Modern Living \| Brand Video") and colons ("Claritas: Market Leader & Authority"); both read fine alone but the mix is visible scanning the grid. Javad has not chosen one |
| **Google Tag Manager live 2026-08-26** | `GTM-PJLQRZC`, in `BaseLayout.astro`, on all 48 pages. The container fires GA4 `G-L9G3DSQCJQ`, Google Ads `AW-967661948`, a Meta pixel `314453825678590` and LinkedIn Insight `7456860`; all four verified sending on production. Two GTM **Custom HTML** tags log a CSP violation each: the Meta bootstrap, which still works because GTM retries through an allowed path, and a HubSpot form listener that is dead weight here since the contact form is Formspree. Converting both to native GTM templates clears the console. Consent: Javad's decision 2026-08-26 is that Canada does not require it, so no banner and no Consent Mode |
| **Resources part-restored 2026-08-30** | `/resources` and `/resources/blog` are live. `faqs.astro` and `brochure.astro` are still parked under `src/pages/_resources/`. Nothing links to them because their rows in `content/landing/resources.md` had their number lines removed, and `parseLanding` only treats a NUMBERED `##` as a child (`src/lib/landing.ts`). That one edit controls the menu row, the landing card and the count together |
| ~~5 redirects point at blog posts never migrated~~ **RESOLVED 2026-08-30** | Those five, plus `/brand-marketing-blog`, now 301 to `/resources/blog`. The posts they named were never migrated and never will be, so the index is the correct destination. Only `/faqs` and `/digital-brochure` are still parked at `/` |
| **Marketing Blog live 2026-08-30** | Resources was restored and the section renamed **Marketing Blog**. 4 posts, 54 routes. Categories and tags are assigned by `npm run blog-tags` from `content/taxonomy.md`, never by hand; a post's `categories`/`tags` are overwritten on every run. Tags are labels plus Article `keywords`, NOT routes: a tag archive holding one post is thin content. Category archives are not built yet either, and should wait until a category holds 3 or more posts. `/resources/faqs` and `/resources/brochure` stay parked; their rows in `content/landing/resources.md` lost their number lines, which is what keeps them out of the menu and the landing page at once |
| Blog holds real writing now | The 3 Lorem ipsum placeholders were **deleted 2026-08-30** at Javad's request. `content/blog/` holds original posts written through the `blog-writer` skill, staged first in `intake/`. Routes stay down with Resources, so nothing is live yet. Javad wants at least 6 posts before the section returns |
| `homepage.md` is Sanity block descriptors | Home slots 2 (Why It Matters), 5 (founder quote) and 7 (closing) still render nothing. Slot 1b, the four intro blocks added 2026-08-23, reads from `content/home-intro.md` instead and is unaffected. That file gained a market-coverage caption above the four cards on 2026-08-25 |
| Home hero rewritten 2026-08-25 | H1 "Fragmented Marketing is Expensive.", caption "Brand transformation is not." A new system-diagram section (heading + caption + `content/assets/diagrams/brand-to-revenue-system.svg`, full-bleed) was inserted into the existing pillars section, above the four Foundation/Execution/Growth/Infrastructure rows, which now each end in an EXPLORE NOW button (`.aps-btn-primary`, real link, no more whole-row anchor — heading and button are the two link targets). A second looping video (Vimeo `1211175802`, pinned via `VideoHero`'s `videoId` prop, not through `hero-videos.md`) sits right after the pillar rows, above the feature image |
| Home hero video is YouTube, not Vimeo | `fch5EecRUSE`, pinned in `hero-videos.md`'s `## Home` section. YouTube's logo watermark cannot be removed via any public embed param (`modestbranding`, `fs=0`, `iv_load_policy=3` were added, that's the ceiling) — every other hero video is Vimeo specifically to avoid this. Swap to a Vimeo source if a fully chrome-free loop is wanted here too |
| `brand-to-revenue-system.svg`'s capsule background is baked into the artwork | It is opaque white regardless of theme; only the transparent margins around it (near "DAY ONE" / "MARKET LEADERSHIP") are CSS-controlled. Both containers now match `--pg-bg` in either theme: `.pillars__figure` on Home, and `.rows__figure` in `MasterPage.astro` as of 2026-08-25, which previously forced `#fff` and painted a white band across the dark Our System page. Dark mode still shows a mostly-white diagram because the capsule itself is baked in. Javad confirmed 2026-08-25 to leave the SVG alone; a dark-mode export from the source `.ai` file is the real fix if that ever changes |
| ~~Contact form~~ **DONE** | Live on Formspree `mwlejogn`, verified end to end 2026-08-24: POST, redirect to `/thank-you`, mail to `javad@`. reCAPTCHA must stay OFF in Formspree or AJAX submissions 403. Form Flow's iframe embed was evaluated and rejected, see `LAUNCH.md` |
| Privacy policy describes a cookie banner | Javad's rewrite landed 2026-08-23 and fixed the false processors. §2 and §3 still promise a consent banner and a "Cookie settings" footer link that do not exist. **Sharper since 2026-08-26:** GTM now sets Google, Meta and LinkedIn cookies on first load, so the policy describes a control the site does not offer. Javad decided no banner is required in Canada, which makes this a copy fix rather than a consent build |
| Cloudflare Access not yet on staging | Staging is noindexed but publicly reachable. The `*-aliveprostudios` preview URL is still enabled |
| Cloudflare blocks AI training crawlers | Its managed robots.txt disallows GPTBot, ClaudeBot, Google-Extended, CCBot and others. Search crawlers and the AI *retrieval* bots are allowed, so citation still works. Toggle in AI Crawl Control. Worth a deliberate decision given the AEO service page |
| Organization schema has no `sameAs` | No social profile links, which is most of how an engine resolves the entity. Waiting on Javad's LinkedIn, Instagram, YouTube, GBP URLs |
| 35 service pages have 44-60 char meta descriptions | Under the 150-160 spec. Thin, not broken |
| Homayra's headshot is 400x500 | Displays at 260px, so it is soft on retina. Javad's is 2000x2500 |
| Foundation and Infrastructure are alphabetical | Execution, Growth and Alive Pro were sequenced by priority 2026-08-24; the other two await Javad's order |
| ~~**"honest" site-wide sweep**~~ **DONE 2026-08-31** | Banned in Content rules, then removed everywhere in 21 individual rewrites, not a find and replace. Each was rewritten to say the thing rather than announce it: "an honest audit" became "an audit nobody enjoys", "the honest trade" became "the trade", "the honest opinion you did not ask for" lost the adjective because the clause already proved it. `partnership.md`'s H3 "The Honest History." is now "What Was Tried Before.". The Resources intro was fixed in BOTH `content/landing/resources.md` and the hard-coded string in `src/pages/resources/index.astro`, which is duplicated and would otherwise have left the rendered page unchanged. Zero occurrences remain outside the rule itself |
| **Start Here written, NOT approved** | 9 Markdown files in `content/start-here/`, **content rejected by Javad 2026-08-31**. He is giving per-page guidance next session, so treat the current copy as a first draft to be replaced rather than edited. What IS settled: the nine menu items (his words, confirmed), the menu-plus-answer structure (`need` is the visitor's sentence and drives the menu, index row and breadcrumb; `title` is Alive Pro's answer and is the H1, and the two must never match), the no-numbered-rows rule, and the routing (all 28 services reachable, verified). **Nothing is wired up:** no `startHere` collection, no routes, no nav row, so the files build nothing and are invisible in production. Spec: `docs/superpowers/specs/2026-08-24-start-here-section-design.md`. Plan (code only, copy lives in the files): `docs/superpowers/plans/2026-08-24-start-here-pilot.md` |
| **Javad's Sept/Oct 2026 focus: custom software for manufacturers** | Marketing stays the core business. The push is custom system design for manufacturing companies, which is why Start Here pages 08 and 09 lead the build order ahead of packaging. **No search data exists for that vertical:** DataForSEO returned HTTP 402, out of credit, on 2026-08-31, and no volume figure for it appears in any document. Run that research before committing paid search budget |
| `/brand-pulse` | No route yet. `/thank-you` was built 2026-08-23, noindex and out of the sitemap |

---

## Reference

Previous site at `../04 Alive-Reborn/` (Next.js) for portfolio data, images, and
component behaviour. Sanity project `22a48h68` intact and untouched.

---

*Alive ProStudios Inc. — Confidential — Astro rebuild — started 2026-08-22*
