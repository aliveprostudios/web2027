# Alive ProStudios — Website Style Guide (Handoff for Claude Code)

Build target: **Astro**, lightweight, CSS-first. All animation is pure CSS (no JS animation libraries).
Reference implementation: `Brand Name & Identity B.dc.html` + global components (`SiteNav`, `VideoHero`, `BookConsult`, `RelatedServices`, `NextStep`). Match that page's rendering exactly.

---

## 1. Design tokens (single source of truth)

Declare ALL of these as CSS custom properties on `:root` in one global stylesheet (`/src/styles/tokens.css`). Nothing may hard-code a color, easing, or z-index that exists here.

### 1.1 Brand palette (fixed, never theme-switched)

```css
:root {
  --brand-black:  #000000;
  --brand-forest: #346632;
  --brand-lime:   #95C83F;
  --brand-orange: #F76E1E;  /* THE accent. CTAs, dots, highlights, hover color */
  --brand-mist:   #E6E7E8;

  /* Dark surfaces (grey family — NOT forest green) */
  --surface-hero-top:    #333333;   /* hero gradient start */
  --surface-hero-bottom: #1A1A1A;   /* hero gradient end */
  --surface-dark:        #161616;   /* dark section blocks (Next Step) */
  --surface-video:       #1A1A1A;   /* video letterbox backing */
}
```

### 1.2 Theme tokens — LIGHT / DARK mode

Theme is toggled by setting `data-theme="light" | "dark"` on `<body>` (persisted in `localStorage` key `aps-theme`, default `light`). Every content section styles ONLY against these:

```css
body {                       /* light (default) */
  --pg-bg:   #FFFFFF;
  --pg-fg:   #000000;
  --pg-fg2:  rgba(0,0,0,0.72);   /* body copy */
  --pg-fg3:  rgba(0,0,0,0.55);   /* muted labels, numbers */
  --pg-line: #E6E7E8;            /* hairlines */
  --pg-band: #F4F4F4;            /* soft alternating band (quote block) */
}
body[data-theme="dark"] {
  --pg-bg:   #111111;
  --pg-fg:   #FFFFFF;
  --pg-fg2:  rgba(255,255,255,0.78);
  --pg-fg3:  rgba(255,255,255,0.55);
  --pg-line: rgba(255,255,255,0.16);
  --pg-band: #1A1A1A;
}
/* global theme transition */
body * { transition: background-color 300ms ease, color 300ms ease, border-color 300ms ease; }
/* links */
a { color: var(--brand-forest); text-decoration: none; }
a:hover { color: var(--brand-orange); }
body[data-theme="dark"] a { color: var(--brand-lime); }
```

Notes:
- Dark hero, orange CTA block, black footer, and Next Step block are theme-INVARIANT (they look the same in both modes). Only white/mist content sections flip.
- The theme toggle lives in the top nav between "Est. 1997" and the hamburger: a 40px circular icon button (1px `rgba(255,255,255,0.35)` border, orange border on hover), sun icon in light mode, moon in dark. Lucide-style 1.8px strokes, 18px.

### 1.3 Typography

```css
:root {
  --font-sans:      'Barlow', sans-serif;            /* UI + body + light display */
  --font-condensed: 'Barlow Condensed', sans-serif;  /* bold display only */
  --font-mono:      'JetBrains Mono', monospace;     /* index numbers ONLY */
}
```

Load Barlow weights **200, 300, 400, 500, 600, 700**; Barlow Condensed **700, 800**; JetBrains Mono **400**.

The brand's core typographic move is **extreme weight contrast**: Barlow 200 (extra-light) directly against Barlow Condensed 800. Never use middle-weight display type.

| Role | Spec |
|---|---|
| Page title (hero H1) | Condensed 800, `clamp(30px, 7.6vw, 144px)`, line-height 0.88, uppercase, single line (`white-space:nowrap`) |
| Display light line | Sans 200, `clamp(26px, 3.4vw, 58px)`, tracking −0.01em, uppercase |
| Display bold line | Condensed 800, `clamp(44px, 7vw, 124px)`, line-height 0.92, uppercase |
| Section H2 | Condensed 800, `clamp(48px, 6vw, 104px)`, line-height 0.92, uppercase |
| Statement/lede | Condensed 700, `clamp(24px, 2.4vw, 38px)`, line-height 1.12, uppercase, two-tone (`--pg-fg` + `--pg-fg3` spans) |
| Eyebrow | Sans 600, 12px, tracking 0.14em, uppercase. Under hero eyebrow: 1px `--brand-orange` rule, `width:fit-content`, 16px below text |
| Body copy | Sans 400, 17px, line-height 1.6, `--pg-fg2`. Markdown-friendly: plain `<p>` + `<ul><li>` (disc bullets, 22px indent, 8px gap). No custom bullet components |
| Big list item (related services) | Sans 200, `clamp(28px, 3.6vw, 60px)`, tracking −0.01em |
| Index numbers | Mono 400: 13px in lists, 11-12px in nav |
| Micro-label / marquee small | Sans 300-700, 12-14px, tracking 0.14–0.24em, uppercase |
| Mobile minimums | body ≥16px, sub-nav links 16px, big display min set by clamp() floors above |

**Semantic heading map (SEO / web standards)** — tag names only; the visual specs above are LOCKED as designed and must never change:

| Tag | Style role |
|---|---|
| `h1` | Page title (one per page, from MD frontmatter `title`) |
| `h2` | Section heading |
| `h3` | Subsection / pillar heading (Condensed 800, clamp(40px,4.4vw,72px), lh 0.96) |
| `h4` | Statement / lede |
| `h5` | Kicker / pillar subheader (orange, 17px) |
| `h6` | Breadcrumb / eyebrow (route-generated) |
| `p` | Body copy (Markdown) |
| `.hero-caption` | Hero caption `p` (frontmatter `caption`, hidden on mobile) |
| `.display-light` | Light display line inside stacked display lockups — a `span`, never a heading |
| `.list-display` | Big light list rows (related services, menu) — `a` |
| `.index` | Mono index numbers — `span` |

Heading levels never skip; decorative display lines are spans so the outline stays clean.

**Orange dot device**: headline-ending dot = inline-block circle, `0.13–0.14em` square, `border-radius:999px`, background `--brand-orange` (or black on orange surfaces), `margin-left:0.05em`. Headlines only — one per screen zone. In the Next Step block it pulses (see §4).

### 1.4 Layout & grid

```css
:root {
  --gutter: clamp(24px, 4vw, 56px);   /* page gutter — EVERYTHING aligns to it */
  --col-label: 220px;                  /* eyebrow/label column in 2-col sections */
  --col-num: 120px;                    /* number column in numbered rows */
}
```

- Section verticals: 96–128px desktop.
- 2-col content pattern: `grid-template-columns: var(--col-label) 1fr; gap:40px`.
- Numbered rows: `grid-template-columns: var(--col-num) 1fr; gap:clamp(24px,3vw,56px)`; hairline `1px solid var(--pg-line)` on top of each row.
- **Mobile (≤760px)**: these grids stack to single column (`display:flex; flex-direction:column`). Breakpoint token: `--bp-mobile: 760px`.

### 1.5 Z-index scale (strict)

```css
:root {
  --z-video: 1;      /* hero video iframe */
  --z-rails: 5;      /* animated background lines overlay */
  --z-content: 6;    /* all text/content wrappers (paints OVER rails) */
  --z-nav: 30;       /* header/nav stacking context */
  --z-menu: 100;     /* full-screen orange menu overlay */
}
```

Rails sit above section backgrounds but below content: every content wrapper inside a section gets `position:relative; z-index:var(--z-content)`.

### 1.6 Motion tokens

```css
:root {
  --ease-settle: cubic-bezier(0.22, 1, 0.36, 1);  /* fast start, soft settle — the only easing */
  --dur-micro: 220ms;   /* color/hover */
  --dur-move: 350ms;    /* transform settling */
  --dur-roll: 400ms;    /* button label roll */
  --dur-hero: 900ms;    /* hero line reveals */
}
@media (prefers-reduced-motion: reduce) { * { animation: none !important; } }
```

---

### Logo files (assets/)

`logo-full.svg` (colour, light bg) · `logo-full-white.svg` (dark bg, nav/footer/menu) · `logo-white.svg` (alt white lockup) · `icon.svg` / `icon-white.svg` / `icon-orange.svg` (favicon, avatars, accents) · `brand-colours.svg` (palette reference). Clear space = height of the "a" in "alive"; min width 96px wordmark / 32px icon.

## 2. Global background: animated grid rails  `[GLOBAL: .bg-rails]`

Full-page decorative layer. One element per page, `position:absolute; inset:0; z-index:var(--z-rails); pointer-events:none` on a `position:relative` page root.

- **5 vertical hairlines, 1px, `rgba(128,128,128,0.12)`** (reads on both light & dark), aligned to the page grid:
  - `left: var(--gutter)`
  - `left: calc(var(--gutter) + (100% - var(--gutter)*2) * 0.25)` — and 0.5, 0.75
  - `left: calc(100% - var(--gutter))`
- Each rail carries one **sweeping pulse**: a 1px segment, height 5–6% of page, gradient fade in/out (alternate orange `rgba(247,110,30,0.35–0.5)` and grey `rgba(128,128,128,0.4–0.5)`), animating:

```css
@keyframes lineSweep { 0% {transform:translateY(-100%);} 100% {transform:translateY(2100%);} }
/* durations 26s / 34s / 30s / 38s / 32s, delays 0 / 7s / 14s / 3s / 10s, linear, infinite */
```

Expose knobs: `--rail-color`, `--rail-pulse-orange`, `--rail-pulse-grey`, `--rail-opacity`.

## 3. Hero  `[GLOBAL: .hero]`

- Background: `linear-gradient(180deg, var(--surface-hero-top) 0%, var(--surface-hero-bottom) 100%)`, white text, `overflow:hidden`. Theme-invariant.
- Content wrapper: `z-index:var(--z-nav)` (nav dropdown must beat video).
- Eyebrow: lime `--brand-lime` on dark ("FOUNDATION · STAGE 01"), orange 1px underline rule.
- H1 reveal: each line wrapped in `overflow:hidden`; inner line animates:

```css
@keyframes heroRise { from {transform:translateY(110%);opacity:0;} to {transform:translateY(0);opacity:1;} }
/* 900ms var(--ease-settle), stagger 150ms per line */
@keyframes heroFade { from{opacity:0;} to{opacity:1;} } /* eyebrow 100ms, caption 600ms delay */
```

- Caption under title: Sans 600, 22px, uppercase; first sentence white, second `--brand-orange`.

## 4. Global components

### 4.1 VideoHero  `[GLOBAL: <VideoHero/>]`
Every page has a looping hero video directly under the hero.
- Container: `aspect-ratio: 1280/600` (matches the 2.13:1 masters — NO letterboxing), background `--surface-video`, `overflow:hidden`.
- Vimeo background embed: `https://player.vimeo.com/video/{ID}?autoplay=1&muted=1&loop=1&background=1&controls=0&dnt=1&playsinline=1`, iframe `position:absolute; inset:0; z-index:var(--z-video); border:none`.
- **Video pool**: one exported const `HERO_VIDEOS: string[]` (8-10 Vimeo IDs, to be supplied). Page picks deterministically: hash of `pathname` mod pool length — stable per page, no flicker on reload. Optional per-page override prop `videoId`.

### 4.2 SiteNav + full-screen menu  `[GLOBAL: <SiteNav/>]`
- Header row: white logo left; right cluster `gap:28px`: "EST. 1997" label → theme toggle (§1.2) → hamburger (two 30×3px white bars, 6px gap).
- Overlay: `position:fixed; inset:0; z-index:var(--z-menu); background:var(--brand-orange)`, fade-in 300ms.
- **8 primary items** (accordion): 01 Foundation, 02 Execution, 03 Growth, 04 Infrastructure, 05 Work, 06 Alive Pro, 07 Resources, 08 Contact. Foundation/Execution/Growth/Infrastructure/Alive Pro expand; the rest are direct links.
- Row: mono number (11px, `rgba(0,0,0,0.55)`, 24px col) + label Sans **200**, 22px, uppercase, white (current page = black) + thin `+`/`−` toggle glyph right. Hairline `rgba(255,255,255,0.25)` between rows.
- Sub-menu: indent 40px (aligns with label), 16px Sans 500 white links, each with a 14px right-arrow icon (2px stroke, 0.7 opacity), 12px gap. Expanding list fades in 350ms settle.
- Hover FX (all menu rows and sub-links): `translateX(8px)` (6px for sub-links) with `transition: transform var(--dur-move) var(--ease-settle)` + color to black on sub-link hover. Never abrupt: every hover state must have a transition on BOTH enter and leave.
- Footer of overlay: "TORONTO, CANADA" + "INFO@ALIVEPROSTUDIOS.COM", 12px, `rgba(0,0,0,0.55)`.
- Menu scrolls (`overflow:auto`) — it must never be covered by page content (z-scale §1.5).

### 4.3 Pill buttons  `[GLOBAL: .aps-btn]`
Rolling-label pills (Brading-style):

```css
.aps-btn { display:inline-flex; align-items:center; gap:14px; border-radius:999px; padding:20px 40px;
  font:700 13px/1 var(--font-sans); letter-spacing:0.16em; text-transform:uppercase; overflow:hidden;
  transition: background-color 300ms ease, color 300ms ease, border-color 300ms ease, transform 150ms ease; }
.aps-btn:active { transform: translateY(2px); }
.aps-btn .roll { position:relative; overflow:hidden; height:1.3em; display:block; }
.aps-btn .roll span { display:block; line-height:1.3em; transition: transform var(--dur-roll) var(--ease-settle); }
.aps-btn .roll span + span { position:absolute; top:100%; left:0; width:100%; }
.aps-btn:hover .roll span { transform: translateY(-100%); }   /* label rolls up, duplicate rolls in */
.aps-btn svg { transition: transform 300ms var(--ease-settle); }
.aps-btn:hover svg { transform: translate(3px,-3px); }        /* ↗ arrow nudge */
```

Markup: label duplicated inside `.roll` (`<span>Label</span><span>Label</span>`), optional 16px ↗ arrow.
Variants: `-dark` (black → white/black text on hover), `-ghost` (transparent, 1px `rgba(255,255,255,0.55)` border → fills white), `-primary` (orange → white/orange text). **One orange primary per view.**

### 4.4 Related Services  `[GLOBAL: <RelatedServices section exclude/>]`
- Eyebrow: "(02) RELATED SERVICES (n)" — count auto, muted.
- Rows (scales 4–11 items): top hairline `--pg-line`; mono number (13px, 40px col) + name Sans **200** `clamp(28px,3.6vw,60px)` + right-aligned **EXPLORE NOW ↗** in `--brand-orange` (14px/700/0.16em + 22px arrow).
- Hover: whole row `translateX(12px)` settle + name turns orange; EXPLORE NOW itself nudges `translate(4px,-4px)`.
- Data: services keyed by pillar (foundation/execution/growth/infrastructure — lists in §4.2 sub-menus); current page excluded. In Astro derive pillar from the route.
- Mobile: when the row wraps, EXPLORE NOW gets `margin-left:68px` so it aligns with the service NAME, not the number.

### 4.5 Book a Consult (orange CTA)  `[GLOBAL: <BookConsult/>]`
- Full-bleed `--brand-orange`, white text, 96px vertical padding, theme-invariant.
- Left: eyebrow (black 55%, black underline rule) + 3-line stacked headline (`display:flex; column; gap:10px`): light 200 line → Condensed 800 line + black dot → light 200 line at `rgba(0,0,0,0.65)`.
- Buttons row: `.aps-btn-dark` "Book a Consult ↗" + `.aps-btn-ghost` "Explore Our Work" + phone `905-553-3044` (tel: link, Sans 600, NO underline, white → black on hover).
- Right: **rotating circular badge** 180–240px: SVG text-on-circle "BOOK A CONSULT · 29 YEARS OF BRAND MARKETING ·" (13.5px, 700, 0.28em, black), `@keyframes spinSlow` 360° / 22s linear infinite; black center circle (44%) with white ↗; whole badge scales 1.06 on hover (300ms settle). Links to /contact.
- Bottom marquee band: top hairline `rgba(0,0,0,0.25)`, Sans **200**, 22px, uppercase, 0.1em, `rgba(0,0,0,0.7)`: "LET'S TALK · BOOK A CONSULT · REQUEST A QUOTE ·".
- Mobile: grid stacks (badge below text).

### 4.6 Next Step (pre-footer)  `[GLOBAL: <NextStep sectionNum/>]`
- `--surface-dark` background, theme-invariant. Eyebrow "(03) NEXT STEP" in orange (number = prop).
- Headline: "READY TO TRANSFORM" Sans 200 `clamp(36px,4vw,68px)` white 75% / "YOUR BRAND" Condensed 800 `clamp(44px,11vw,200px)` + pulsing orange dot:
  `@keyframes dotPulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.55;transform:scale(0.82);} }` 2.4s infinite.
- Giant link row "START THE CONVERSATION" (Sans 200, `clamp(24px,2.6vw,44px)`, uppercase) between hairlines `rgba(255,255,255,0.18)` + 40px ↗; hover: orange + `translateX(12px)` settle.
- Contact row: `info@aliveprostudios.com` · `905-553-3044` · Toronto, Canada — Sans 600 15px, `rgba(255,255,255,0.65)`, no underline, orange on hover.
- Bottom micro-marquee: 12px, 300 weight, 0.24em, `rgba(255,255,255,0.4)`: "IMPOSSIBLE TO IGNORE · ONE TEAM · ONE SYSTEM ·".

### 4.7 Marquee mechanics  `[GLOBAL: .marquee]`
All marquees MUST loop seamlessly: track = `display:flex; width:max-content`, containing **two identical copies**, each `flex:none; display:flex; gap:48px; padding-right:48px`;
`@keyframes ctaMarquee { from{transform:translateX(0);} to{transform:translateX(-50%);} }` linear infinite (26–30s). Never animate a single copy (causes the pop/jump glitch).

### 4.8 Footer bar
Black, white 12px/600/0.14em uppercase: back-link ← / "ALIVE PROSTUDIOS INC. TORONTO, CANADA" / next-page link →. Flex-wrap on mobile.

## 5. Content patterns

- **Stat blocks**: 2px top rule (fg or orange), Condensed 800 number `clamp(64px,6vw,112px)`, muted uppercase caption below.
- **Quote band**: `--pg-band` background, Condensed 700 `clamp(26px,3vw,44px)` uppercase two-tone quote, attribution Sans 700 15px + muted role.
- **Markdown body**: sections render MD as-is — `p` 17px/1.6 `--pg-fg2`, `ul` disc bullets. No decorative bullets, no emoji, no unicode arrows in copy.
- Voice: direct, second person, short declaratives. CTAs in Title Case ("Book a Consult", "Let's Talk").

## 6. Accessibility & misc

- All hover transforms/opacity must also define resting `transition` (smooth enter AND leave).
- `prefers-reduced-motion: reduce` kills all animation (rails, marquees, spin, pulses).
- Focus ring: 4px orange glow on interactive elements.
- Tap targets ≥44px on mobile; hamburger/close/theme-toggle are 40-44px.
- Phone numbers are always `tel:` links, styled Sans 600, no underline. Email `mailto:`.
- Images/video hover: opacity 0.85. No bounces, no springs, no scale-pops beyond the 1.06 badge.

### Icons — Phosphor

One family site-wide: **Phosphor** (`@phosphor-icons/web`, or per-icon SVG imports from `@phosphor-icons/core` for a lightweight Astro build). Default weight **light** — it matches the Barlow 200 display type; regular/bold only at ≤16px. Sizes 16/20/24/32, never below 14px. Color via `currentColor`; orange only when the icon IS the action cue. Template glyphs map to: `arrow-up-right` (Explore ↗), `list` (hamburger), `x` (close), `sun`/`moon` (theme toggle), `plus`/`minus` (accordion). No emoji, no unicode glyph icons in copy.

## 8. Extended coverage

- **Forms**: no boxed inputs — bottom hairline only, 20px Barlow value, 12px uppercase label at fg3, placeholder 35% opacity; focus turns the hairline orange; errors = orange hairline + 13px message; submit is a primary pill; short forms only.
- **Imagery**: hero video 1280/600 edge-to-edge; full-bleed features 100vh desktop / 52vh mobile; gallery thumbs 19:9, 8px radius, 30px gutter, 1-col mobile; portraits 4:5 or square at 12px radius; hover opacity 0.85 + scale 1.07; lightbox 900px on rgba(0,0,0,0.9) with 2s auto-slide; photography warm/professional/people-forward, no stock slop.
- **States**: focus-visible = 4px orange glow, never removed; active = 2px press; disabled = 40% opacity; current page = black label in orange menu; loading spinner = icon mark with spinSlow.
- **Breakpoints**: ≤760px mobile (stack, hero 62vh, caption hidden, H1 44px wrapping, EXPLORE indents to name column); 761-1280 fluid via clamp() — no separate tablet layout; >1440 type caps. Tap targets ≥44px.
- **SEO/meta**: `{Page Title} | Alive ProStudios`; description from frontmatter (150-160 chars); favicon = icon.svg; OG image 1200×630 (dark grey bg, white Condensed title, orange dot); alt text on all images (empty alt when decorative); one H1, ordered headings, nav/main/footer landmarks; XML sitemap + canonical URLs.
- **Performance**: lazy video embeds with poster frames; AVIF/WebP via Astro Image with srcset; only the 6 listed font weights with `font-display: swap`; zero framework runtime on content pages — menu/theme/lightbox as small vanilla islands; all animation CSS-only.
- **404 page**: Master template shell, dark hero, H1 "Lost the thread." + primary pill back home — same rails and video pool.

## 7. Astro content model (IMPORTANT — data flow rules)

- **Master templates**: `Master Page Template` (inside/service page), `Home Page Template`, `Gallery Page Template`. Every route is built from one of these three.
- **Breadcrumb eyebrow**: the small text above the H1 ("FOUNDATION · STAGE 01") is a BREADCRUMB derived from the route — `{section} · Stage {sectionIndex}` (e.g. Foundation·01, Execution·02, Growth·03, Infrastructure·04). Never hard-code it per page.
- **Page content from Markdown**: each page's H1 title, hero caption, and body copy come from that page's `.md` file (frontmatter: `title`, `caption`, `section`; body = MD content rendered with the §5 body rules). The template supplies layout only.
- **Related Services is DYNAMIC**: the bottom "Related Services" list must be generated from the content collection at build time — all pages under the current page's section (e.g. every page in `foundation/`), excluding the current page, numbered in collection order, count auto. Menu items are added/renamed/removed constantly; NEVER maintain a hard-coded list. The full-screen nav accordion sub-menus derive from the same collection.
- **Hero videos**: EVERY page on the domain has an edge-to-edge looping background video (VideoHero). The pool is 12 Vimeo/YouTube links supplied by the client, stored in ONE shared const; each page picks deterministically (hash of route mod pool length) so the assignment is stable per page. Aspect 1280/600, background embed params, no controls.

## 9. Template section maps (build each route EXACTLY in this order)

**Master Page Template** (all inside/service pages):
1. Hero — grey gradient (#333→#1A1A1A), breadcrumb H6, H1 (one line + orange dot), hero caption
2. VideoHero (global pool)
3. "(01) Why It Matters" — label column + H2 + H4 statement + stat block (2px orange rule)
4. Content rows — number column + H3 + MD body (page's .md content)
5. Quote band (--pg-band) — optional per page
6. Closing H4 statement
7. BookConsult [GLOBAL]
8. "(02) Related Services" [GLOBAL, dynamic from section collection, exclude current page]
9. NextStep [GLOBAL] · 10. Black footer bar

**Home Page Template**:
1. Hero — full-bleed PHOTO (assets/hero-bg.jpg style), NO overlay, 85vh desktop / 62vh mobile, caption hidden on mobile, H1 44px wrapping on mobile
2. "(01) Why It Matters" section
3. VideoHero
4. Four pillar rows — number + H3 pillar name (FOUNDATION…) + H5 orange kicker + body
5. Founder quote band — portrait (assets/javad-ahmadi-portrait.jpg, 320px col, 12px radius) + H4 quote + attribution
6. Full-screen feature image — 100vh desktop / 52vh mobile, edge-to-edge
7. Closing H4 statement · 8. NextStep · 9. Footer
(NO BookConsult, NO Related Services on Home.)

**Gallery Page Template**:
1. Hero — grey gradient, breadcrumb, H1, caption
2. VideoHero
3. Gallery grid — 3 cols desktop / 1 col mobile, 30px gutter, 19:9 thumbs, 8px radius, hover lift 6px + zoom 1.07; COUNT IS DYNAMIC from the designated photo folder (import.meta.glob — any number of photos)
4. Lightbox — rgba(0,0,0,0.9) backdrop, 900px-wide image, prev/next arrows, close, counter, 2s auto-slide (arrows reset timer, close stops it)
5. BookConsult · 6. Related Services · 7. NextStep · 8. Footer

### Clarifications (authoritative — override anything above that conflicts)

- **Markdown → template mapping rule**: extract by TYPE, place by template SLOT. Not document order. (Example: a `>` blockquote mid-document is hoisted into its own quote band after the numbered rows.)
- **Hero caption**: not present in existing frontmatter. Add `caption:` going forward. When absent, use the intro paragraph's first sentence as the caption and the remainder as the H4 statement. Never invent copy.
- **Video pool size**: use however many links the source list holds (currently 26 in `videos.md`). The rule is one shared const + deterministic pick by route hash — pool size is irrelevant.
- **Service lists in this document are ILLUSTRATIVE EXAMPLES ONLY.** The content collection is always the source of truth for nav sub-menus, related services, and section counts. Never reconcile the collection to this doc; reconcile this doc to the collection.
- **Type stack is final**: Barlow / Barlow Condensed / JetBrains Mono. Any other font named elsewhere in the repo (e.g. Bebas Neue) is stale — delete it.
- **Deploy target**: Vercel.
- **Gallery source**: `import.meta.glob` over the gallery content folder; render gracefully when the folder is empty.

**Audit notes (verified consistent):** nav accordion sub-menus, RelatedServices lists, and breadcrumb sections all derive from the SAME collection (lists currently mirror the live site: Foundation 4, Execution 8, Growth 11, Infrastructure 5, Alive Pro 8). Button hover spec: dark→white, ghost→fills white, primary→white with orange text. Videos pending: 12 links from client. Contact/Resources routes exist in nav but have no template yet — build Contact from Master shell with the hairline form (§8).

