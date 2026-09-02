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
7. **Case Studies is its own menu row, but its routes live under `/work`.**
   Settled 2026-09-01. The row sits after Work and expands to all eleven
   clients; the URLs stay `/work/case-studies/<slug>`, which is where the
   section was built and approved. Menu position and URL depth were treated as
   separate decisions deliberately. Moving to a top-level `/case-studies/` is
   still free while this is staging-only, and costs a redirect once it ships.

8. **Common Questions replaced the FAQ.** Settled 2026-09-01. `/resources/faqs`
   is gone, along with `content/faqs.md` and `src/lib/faqs.ts`; `/faqs` and
   `/resources/faqs` both 301 to `/common-questions`. Javad's reason was that
   the seven questions read like nobody wrote them, which is fair: they came
   from the Sanity export. Do not rebuild a second FAQ under Resources.

9. **Legal pages are documents, not service pages.** `/privacy-policy` has its
   own route and renders its Markdown through Astro, NOT through
   `MasterPage` + `parseAnatomy`. See `TEMPLATE-ANATOMY.md` §4 for why.

10. **One enumerated framework on the whole site.** The Brand-to-Revenue
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

Staging builds 75 HTML routes as of 2026-09-01, up from 67 (Case Studies, Common Questions, the new home page and the new footer are all staging-only; production is still 54). Counts here are `find dist -name '*.html' | wc -l`, which includes `404` and `thank-you`; earlier entries saying 66 and 68 were off by one against that measure. 54 as of 2026-08-30, up from 48: Resources came back in part, adding `/resources`, `/resources/blog` and four posts. Two Resources routes are still parked, see Known gaps. `/alive-pro/our-system` was added and `/alive-pro/our-philosophy` retired on 2026-08-25.

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
| **Common Questions LIVE ON STAGING 2026-09-01, `/common-questions`** | Replaced `/resources/faqs`, which Javad asked to remove because its seven questions came from the Sanity export and read like it. 9 routes: a hub plus 8 cluster pages holding 24 answers, weighted 10 systems, 9 topics, 5 business. **Cluster pages, not one route per question:** at 40-70 words of direct answer plus 150-300 of detail a per-question page would be ~350 words, the thinnest route on the site against case studies at 651-968. Each question keeps an anchor, so answer engines still extract one answer. Its OWN top-level menu row after Case Studies. **Design:** the approved FAQ accordion grammar (pillar grid, mono index, 600-weight question, glyph, orange plus dot, 0fr-to-1fr panel), but the DIRECT ANSWER is always visible and only the detail collapses; that paragraph is also the FAQPage `acceptedAnswer`, so visible text and schema cannot drift. One Javad quote per cluster page, eight in total. Schema is `WebPage` + `FAQPage` per cluster, `CollectionPage` on the hub; not `Article` (competes with the blog) and not `QAPage` (that is for forums). **Industries cut from five to two:** manufacturing and dental have 8 and 1 case studies behind them; law firms, gyms and med spas had none and went to the future list. **No search data informed it:** DataForSEO returned HTTP 402, out of credit, on both volume and difficulty endpoints, same as 2026-08-31. Re-validate before paid search spend. **Round one has no video or photography question**, which leaves Execution's 8 service pages unsupported; it is item 1 on the 30-question future list in the spec. Spec: `docs/superpowers/specs/2026-09-01-common-questions-design.md`. Staging builds 75 HTML routes, up from 67; production still 54 |
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
| Organization schema has no `sameAs` | No social profile links, which is most of how an engine resolves the entity. Waiting on Javad's LinkedIn, Instagram, YouTube, GBP URLs |
| 35 service pages have 44-60 char meta descriptions | Under the 150-160 spec. Thin, not broken |
| Homayra's headshot is 400x500 | Displays at 260px, so it is soft on retina. Javad's is 2000x2500 |
| Foundation and Infrastructure are alphabetical | Execution, Growth and Alive Pro were sequenced by priority 2026-08-24; the other two await Javad's order |
| ~~**"honest" site-wide sweep**~~ **DONE 2026-08-31** | Banned in Content rules, then removed everywhere in 21 individual rewrites, not a find and replace. Each was rewritten to say the thing rather than announce it: "an honest audit" became "an audit nobody enjoys", "the honest trade" became "the trade", "the honest opinion you did not ask for" lost the adjective because the clause already proved it. `partnership.md`'s H3 "The Honest History." is now "What Was Tried Before.". The Resources intro was fixed in BOTH `content/landing/resources.md` and the hard-coded string in `src/pages/resources/index.astro`, which is duplicated and would otherwise have left the rendered page unchanged. Zero occurrences remain outside the rule itself |
| **Start Here written, NOT approved** | 9 Markdown files in `content/start-here/`, **content rejected by Javad 2026-08-31**. He is giving per-page guidance next session, so treat the current copy as a first draft to be replaced rather than edited. What IS settled: the nine menu items (his words, confirmed), the menu-plus-answer structure (`need` is the visitor's sentence and drives the menu, index row and breadcrumb; `title` is Alive Pro's answer and is the H1, and the two must never match), the no-numbered-rows rule, and the routing (all 28 services reachable, verified). **Nothing is wired up:** no `startHere` collection, no routes, no nav row, so the files build nothing and are invisible in production. Spec: `docs/superpowers/specs/2026-08-24-start-here-section-design.md`. Plan (code only, copy lives in the files): `docs/superpowers/plans/2026-08-24-start-here-pilot.md` |
| **Javad's Sept/Oct 2026 focus: custom software for manufacturers** | Marketing stays the core business. The push is custom system design for manufacturing companies, which is why Start Here pages 08 and 09 lead the build order ahead of packaging. **No search data exists for that vertical:** DataForSEO returned HTTP 402, out of credit, on 2026-08-31, and no volume figure for it appears in any document. Run that research before committing paid search budget |
| **Case Studies built 2026-09-01, ON STAGING ONLY** | 11 clients, 12 new routes (`/work/case-studies` plus one per client), and its OWN top-level menu row placed after Work at Javad's direction, despite the routes sitting under `/work`. Production is still 54 routes; staging is 66. Copy was written from Javad's per-client drafts, reviewed as a set so no two pages repeat an argument or a System entry point, and lengths run 651 to 968 words by what each client's material earns. **Imagery landed for all eleven on 2026-09-01.** Javad supplied the folders named by CLIENT ("ASSA ABLOY", "Gallery Specialty"); they were renamed to the SLUGS because `caseStudies.ts` resolves by folder name, so a folder that does not match a slug is silently ignored. Nine of the ten new folders carry a `hero.jpg` (2560x1200); **Stone Lamina and Vitality Dentistry have none** and fall back to `VideoHero`, which is the designed behaviour, not a bug. Nineteen `body-NN.jpg` figures (2000x1545) were placed in the Markdown, each after the section it illustrates, with alt text written from the image; body figures render ONLY where the Markdown references them, so dropping a file alone does nothing. Only Alfred has a `gallery-*` set. The `content/case-studies/*.md` files are now ahead of the `intake/` drafts by these figure lines, same as Alfred's video URL: regenerating from intake would drop them. Rule still holds: no `hero.jpg` falls back to `VideoHero`, absent `gallery-*` renders no gallery, absent `body-*` is prose. Design approved by Javad 2026-09-01 |
| **New home page LIVE ON STAGING 2026-09-01 (was Home-B)** | Built as a draft at `/home-b`, iterated with Javad through the day, then promoted to `src/pages/index.astro` at his direction; the draft route, its sitemap filter and the `homeB` collection name are gone. Copy lives in `content/home/` (`page.md`: hero, credits, case study picks, reel video, clients heading, quote, closing; `intro.md`: the help block and four cards) through the `home` collection; imagery in `content/assets/home/` (`hero.jpg`, `gallery/*.jpg`). `content/homepage.md` and `content/home-intro.md`, which fed the launch-day home page, are DELETED. Sequence: hero (DNA image, no credit), We Are Here to Help You Grow with the Alive Pro mark beside the copy and an orange button, four cards, Our Clients as two scroll-driven logo lanes from `content/assets/logos-clients/`, looping reel with caption, the System with its heading broken after "Brand-to-Revenue", three case study tiles, Watch the Reel (click-to-play `youtu.be/YoudIrML8lU`), nine-image gallery with the shared Lightbox, founder quote with both marks (Javad's links to javad.ca), Alfred feature image with credit, closing, Next Step. Title tag is "Brand Transformation Agency in Toronto"; the H1 stays "Fragmented Marketing is Expensive." **Production still serves the launch-day home page**; pushing `main` to production ships this, Case Studies, the FAQ section and the new footer together
| `/brand-pulse` | No route yet. `/thank-you` was built 2026-08-23, noindex and out of the sitemap |

---

## Reference

Previous site at `../04 Alive-Reborn/` (Next.js) for portfolio data, images, and
component behaviour. Sanity project `22a48h68` intact and untouched.

---

*Alive ProStudios Inc. — Confidential — Astro rebuild — started 2026-08-22*
