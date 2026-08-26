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

**LIVE at https://aliveprostudios.com since 2026-08-24. 48 routes, 85 redirects.**

The WordPress site is gone. GoDaddy still holds the registration but has not
served DNS for some time: the nameservers point at Cloudflare, and the apex is a
Custom Domain on the `aliveprostudios` Worker. Microsoft mail was never touched
and its four records are untouched to this day (MX, two TXT, `autodiscover`).

48 rather than 55 because Resources is unpublished, see Known gaps. `/alive-pro/our-system` was added and `/alive-pro/our-philosophy` retired on 2026-08-25, so the count is unchanged from launch.

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
│   ├── pages/             ← 48 routes (+ `_resources/`, unpublished)
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
- **A wildcard host does not match the bare domain.** `https://*.analytics.google.com`
  leaves `analytics.google.com` blocked, which is exactly where GA4 posts its
  events. List both forms.

---

## Content rules

- **Canadian English** — colour, behaviour, centre, catalogue, honour
  ("ize" endings kept: organize, recognize)
- **No em dashes anywhere. Ever.**
- No filler ("In today's world", "As a trusted partner")
- Tone: strategic, authoritative, a partner not a vendor

---

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
| `content/faqs.md` still says "four pillars" | The site now says four domains. Not live, since FAQs is unpublished with Resources, but fix it before that section returns |
| **Work pages renamed 2026-08-25** | `/work/videos` is titled "Brand Marketing Videos" and `/work/portfolio` is "Projects & Campaigns", across H1, meta title, eyebrow, BreadcrumbList, gallery schema, nav sub-menu, `/work` rows and the prev/next footers. **Both routes are unchanged and that is deliberate.** Nav URLs are slugified from the display name, so both names are in `CHILD_URL_OVERRIDES` in `src/lib/landing.ts`; without them the menu would point at `/work/projects-and-campaigns` and `/work/brand-marketing-videos`, which do not exist, while the real pages stayed put. Rename either page again and that map must be updated in the same commit |
| Video library is 24, was 26 | Maple Investment Realty and "Alive ProStudios, Branding Company Toronto" removed 2026-08-25 at Javad's request. Titles now mix two separator styles, pipes ("Bellini Modern Living \| Brand Video") and colons ("Claritas: Market Leader & Authority"); both read fine alone but the mix is visible scanning the grid. Javad has not chosen one |
| **Google Tag Manager live 2026-08-26** | `GTM-PJLQRZC`, in `BaseLayout.astro`, on all 48 pages. The container fires GA4 `G-L9G3DSQCJQ`, Google Ads `AW-967661948`, a Meta pixel `314453825678590` and LinkedIn Insight `7456860`; all four verified sending on production. Two GTM **Custom HTML** tags log a CSP violation each: the Meta bootstrap, which still works because GTM retries through an allowed path, and a HubSpot form listener that is dead weight here since the contact form is Formspree. Converting both to native GTM templates clears the console. Consent: Javad's decision 2026-08-26 is that Canada does not require it, so no banner and no Consent Mode |
| **Resources unpublished 2026-08-23** | 7 routes pulled at Javad's request, content not ready. Files intact under `src/pages/_resources/`. Revert steps in `LAUNCH.md` §1 |
| 5 redirects point at blog posts never migrated | Now moot while Resources is down: all 8 Resources redirects temporarily point at `/` |
| All 3 blog posts are Lorem ipsum | Unpublished with the rest of Resources |
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
| `/brand-pulse` | No route yet. `/thank-you` was built 2026-08-23, noindex and out of the sitemap |

---

## Reference

Previous site at `../04 Alive-Reborn/` (Next.js) for portfolio data, images, and
component behaviour. Sanity project `22a48h68` intact and untouched.

---

*Alive ProStudios Inc. — Confidential — Astro rebuild — started 2026-08-22*
