# Alive ProStudios — Design System

A design system for **Alive ProStudios**, a Toronto-based full-service brand marketing agency (est. 1997). This repo captures the colors, type, tone, iconography and UI patterns needed to design on-brand assets, decks, web pages, and prototypes.

---

## Company Context

**Alive ProStudios** (aliveprostudios.com) is a multidisciplinary **brand transformation company** serving clients across Canada, the USA, Germany, Dubai, China, and Mexico. Founded by Javad Ahmadi. The agency positions itself as the antidote to fragmented marketing — one team, one strategic foundation, one integrated system spanning strategy, identity, content, design, campaigns, production, and technology.

### Service pillars (the four-stage "Alive Pro System")
1. **Foundation** — Brand Clarity, Foundation & Blueprint  (strategy, positioning, naming, voice, rebrand)
2. **Execution** — Brand Execution, Systems & Market Presence  (communication design, web, collateral, video, motion, photo, AI production, social branding)
3. **Growth** — Revenue-Driven Marketing & Demand Generation  (funnels, digital marketing, lead gen, content, social mgmt, retention, reputation, SEO / AEO)
4. **Infrastructure** — Ongoing Growth & Market Leadership  (solution architecture, custom apps, systems integration, dashboards, lifecycle support)

### Tagline themes
- "The All-In-One Brand Transformation System That Replaces Fragmented Marketing"
- "29 Years of Experience in Brand Marketing"
- "Unleash Your Brand's True Potential"
- "Dedicated · All-Inclusive · Lifecycle Support"

### Source materials provided
- `uploads/alivepro-logo.svg` — primary horizontal wordmark
- `uploads/alivepro_icon.svg` — standalone icon mark
- `uploads/Alive Pro System diagram 2026.pdf` — the 4-stage system diagram
- `uploads/ailve-hex-colours.jpg` — official 5-color palette
- Live site: <https://aliveprostudios.com/>
- Founder: <https://javad.ca/>

> **Reader note:** These links may not be accessible to you. All critical content has been transcribed into this repo so you can design without reaching out.

---

## Index — What's In This System

| Path | Purpose |
|---|---|
| `README.md` | You are here. Start here. |
| `SKILL.md` | Claude-Code-compatible skill manifest. |
| `styles.css` | **Root stylesheet — link this one.** Imports the token layer. |
| `colors_and_type.css` | CSS custom properties for color, type, spacing, shadow, motion. |
| `components/` | Exported React components (listed below). |
| `assets/` | Logos (full, mark, white, black mono), brand palette reference, original system PDF. |
| `preview/` | Small standalone HTML cards for the Design System tab — colors, type specimens, components, etc. |
| `ui_kits/website/` | Marketing-site UI kit: nav, hero, service grid, testimonial, CTA, footer. `index.html` is a click-thru demo. |
| `slides/` | Deck template samples (title, stat, four-stage system diagram, services grid, closing). |
| `styleguide.html` | The complete brand guide on one page. |

---

## Components

Five components compile into the bundle and are available on the design-system namespace:

| Component | What it's for |
|---|---|
| **Button** | Pill actions in five variants — `primary` (orange), `dark`, `ghost`, `light`, `text`. One orange primary per view. |
| **Chip** | Compact status pill with an optional leading dot, in lime / forest / orange / neutral. |
| **Eyebrow** | Uppercase, wide-tracked section announcer. Forest on light, lime on dark. |
| **ServiceCard** | Service tile with category eyebrow, title, description and action cue. Has a dark variant. |
| **StageCard** | One stage of the four-part Alive Pro System, each carrying its own stage accent. |

```js
const { Button, Chip, Eyebrow, ServiceCard, StageCard } = window.AliveProStudiosDesignSystem_a3c754;
```

---

## Content Fundamentals

### Voice
Alive Pro's copy is **direct, confrontational, and business-outcome-focused**. It talks *to* a CEO / marketing lead who is frustrated by fragmented vendors and patchwork results. It is not playful, not cute, and does not use emoji. It respects the reader's intelligence and budget.

**Three sentences that capture the tone:**
> "How many people are responsible for your brand right now? … A brand that looks different on every platform, sounds different in every channel, and pulls in a different direction every quarter. Budget leaks. Messaging conflicts. And nobody owns the outcome."

Notice: short declarative sentences, list-like cadence, named consequences, no hedging.

### Person & address
- **Second-person "you" / "your brand"** dominates — "your sales and marketing," "your pipeline," "your growth."
- **"We" for the agency** — "we combine brand strategy, creative execution …"
- Rarely uses "I" — this is a studio, not a solo practitioner (even though there is a named founder).

### Casing
- **Headlines: Title Case** for primary section heads ("Meet Alive Pro", "The Problems Most Businesses Won't Talk About").
- **Subheads: Sentence case** occasionally — mixed with Title Case in marketing copy.
- **Eyebrows / overlines: UPPERCASE** with wide tracking — e.g. "DEDICATED · ALL-INCLUSIVE · LIFECYCLE SUPPORT".
- **CTAs: Title Case** — "Request a Quote," "Book a Consultation," "Let's Talk."

### Sentence style
- **Fragments are welcome** when they hit hard ("Budget leaks. Messaging conflicts.")
- **Em-dashes** are frequent and intentional: "one team — one strategic foundation — one outcome."
- **Three-part lists** recur: "Strategy. Identity. Growth." / "Noticed—fill your pipeline—measurable ROI."
- **Avoid**: exclamation points, question-marks-as-headers, meme language, slang, emoji.

### Vocabulary signatures
Use these words liberally — they are the brand's native vocabulary:
> **system, integrated, synchronized, foundation, transformation, compound, measurable, ROI, pipeline, authority, precision, lifecycle, guardianship, high-converting, sales-ready, future-proof, audit, innovation lab, blueprint.**

Avoid: "revolutionary," "game-changing," "disrupt," "synergy," "solutions provider," "world-class" — generic agency filler.

### Emoji, unicode, icons-in-text
- **No emoji in copy.** Ever.
- **No unicode icons** as decorative bullets (no ★, ✓, →) — the brand uses the signature orange dot mark instead.
- **Bullet points** are plain discs or none; structure is done with layout, not typographic decoration.

### Example CTAs (in-brand)
- "Start the conversation."
- "Let's talk."
- "Book a consultation."
- "Request a quote."
- "Unleash your brand's true potential."
- "Transform fragmented marketing into one synchronized system."

---

## Visual Foundations

### Palette
Five named brand colors (see `assets/brand-hex-colors.jpg`):

| Role | Hex | Use |
|---|---|---|
| **Brand Black** | `#000000` | Primary wordmark, display headlines, dark inverse surfaces |
| **Brand Forest** | `#346632` | "ostudios" wordmark segment, body headings, link states, dark section backgrounds |
| **Brand Lime** | `#95C83F` | Energy / growth accents, data highlights, icon fills, one-of-one callouts |
| **Brand Orange** | `#F76E1E` | The *signature dot* — CTAs, focus rings, highlight words, the single "pop" |
| **Brand Mist** | `#E6E7E8` | Dividers, soft chips, inactive states, page backgrounds-adjacent |

**Rule of thumb:** Forest is the workhorse dark, lime is the high-energy spot color, orange is used sparingly as the *single* call-to-action signal (matching the orange dot in the logo). Never stack orange and lime at equal weight — orange leads, lime supports, forest grounds.

### Typography
- **Primary family: Barlow** (Google Fonts). A low-contrast grotesque with a slight width — feels modern, readable, and confident. Used for all UI, headlines, and body.
- **Condensed accent: Barlow Condensed** — for posters, section number markers, tight data/metric moments.
- **Mono: JetBrains Mono** — for data, phone numbers, small labels, code.
- **Display size:** up to 112px, tight tracking (-0.02em), `line-height: 1.02` — confidence through scale.
- **Body:** 16px, 1.55 line-height, 400 weight.
- **Eyebrows:** 12px, semibold, UPPERCASE, 0.14em tracking, colored forest — the main way sections announce themselves.

### Spacing & layout
- **Base unit: 4px**, scale 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64 / 80 / 96 / 128.
- **Containers:** max-width 1280px (comfortable) or 1440px (wide marketing); gutter `clamp(16px, 4vw, 48px)`.
- **Generous vertical rhythm** on marketing surfaces — sections breathe at 96–128px.
- **Grid:** 12-col on desktop, 6-col tablet, stacked mobile. Service tiles typically 3 or 4 across.

### Backgrounds
- **White primary** for marketing surfaces — the agency's work should lead, not the chrome.
- **Deep forest (`--forest-900` / `#0A140A`)** for hero sections, testimonials, CTAs where the brand wants gravitas.
- **Mist** (`#E6E7E8`) for soft alternating bands.
- **No gradients** as primary backgrounds (except the subtle forest→lime→orange progression used *only* in the 4-stage system diagram — it is diegetic, not decorative).
- **Photography** is hero: warm, professional commercial portraits / environmental shots. Subjects are people, products, workspaces. No stock slop.
- **No repeating patterns, textures, hand-drawn illustrations, or doodle-style vectors.**

### Shadows & elevation
Restrained. Soft, confident, never heavy.
- `--shadow-sm` for cards at rest.
- `--shadow-md` for modals, popovers.
- `--shadow-lg` for overlays.
- `--shadow-focus` — 4px orange glow — for keyboard focus. **Focus is always orange**; it is the brand's attention color.

### Corners & borders
- **Radii:** 4 / 8 / 12 / 20 / 28 / 999 (pill). Most cards use **12px**. CTAs are **pill** to echo the circular quality of the icon mark. Images and large hero media use **20px**.
- **Borders:** hairline 1px, `--ink-200` (the brand mist). Dark sections use `rgba(255,255,255,0.14)`.

### Motion
- **Easing:** `cubic-bezier(0.22, 1, 0.36, 1)` — fast start, soft settle. Never springy / bouncy.
- **Duration:** 120ms (micro), 220ms (base), 420ms (section transitions), 800ms (hero sequences).
- **Fades + subtle translate-Y** are the default entrance. No scale-bounces, no swirls.
- **Hover:** opacity drop to 0.85 on images; 6% darker fill on buttons (`--accent-hover` = `--orange-600`); forest text becomes lime on hover.
- **Press:** 2px downward translate on buttons, no scale.

### Transparency & blur
Used sparingly — only on the navbar (frosted glass over photography) and modal scrims (`rgba(0,0,0,0.55)`). Not decorative.

### The signature orange dot
The orange dot (`F76E1E`) in the wordmark is a brand device. Reuse it:
- As the period at the end of a headline or CTA label ("Let's talk**.**")
- As a list bullet in hero bullets
- As a status indicator (e.g. "Live" state in dashboards)
- As the marker for the *current* step in a multi-step UI

Keep it small — 0.32em when inline. One orange dot per screen zone; it should feel rare and intentional.

---

## Iconography

Alive ProStudios does **not** publish a formal icon system. Evidence from the live site:
- Section headers use **small custom SVG pictograms** (`Toronto_branding-marketing-comapny-Alive-Pro-Studios_10.svg` style) — rendered in the brand's forest/lime palette. Roughly geometric, medium stroke, occasional filled shapes. These are agency-produced one-offs, not a licensed set.
- No icon font is used in copy.
- **No emoji.**
- **No unicode icons / arrows** as typographic decoration.

### System recommendation
For new work, use **[Lucide](https://lucide.dev/)** (open-source, MIT) as the substituted icon system:
- Consistent **1.5–2px stroke weight** — matches the clean, technical feel of the brand's pictograms.
- Open line style (not filled) — lets the palette speak.
- Color icons using `currentColor` so they inherit forest / lime / orange depending on context.
- Size defaults: **16 / 20 / 24** (UI), **32 / 48** (feature). Never scale below 14px.

**Loading via CDN** (no install needed):
```html
<script src="https://unpkg.com/lucide@0.468.0/dist/umd/lucide.min.js"></script>
<i data-lucide="arrow-right" width="20" height="20"></i>
<script>lucide.createIcons();</script>
```

> **FLAG — icon substitution:** Alive Pro's handcrafted SVG pictograms are not included in this system (they were not provided as a set). Using Lucide as a bridge. If the agency has a canonical pictogram library, request it and drop into `assets/icons/` to replace Lucide.

### Logo & mark usage
- `assets/logo-full.svg` — full-color horizontal wordmark. Use on white / light backgrounds.
- `assets/logo-full-white.svg` — all-white version. Use on forest, black, or photo backgrounds.
- `assets/logo-full-black.svg` — single-color black. Use for print / mono contexts.
- `assets/logo-mark.svg` — icon-only mark (lime + forest + black swoop). Use as avatar, favicon, loader, and social profile image.
- `assets/logo-mark-white.svg` / `logo-mark-black.svg` — mono variants.

**Clear-space:** at least the height of the "a" in "alive" on all sides. **Minimum width:** 96px (full wordmark), 32px (mark).

---

## Using the system

```html
<link rel="stylesheet" href="styles.css" />

<h1 class="as-display">One team. One system<span class="brand-dot"></span></h1>
<p class="as-lead">Transform fragmented marketing into measurable growth.</p>
<span class="as-overline">Dedicated · All-Inclusive · Lifecycle</span>
```

Semantic classes: `.as-display`, `.as-h1`…`.as-h5`, `.as-lead`, `.as-body`, `.as-small`, `.as-caption`, `.as-overline`, `.as-mono`, `.as-condensed`, `.brand-dot`.

Every color, space, shadow, and motion value is exposed as a CSS var — prefer these over magic numbers.

---

## Caveats

- **Webfont:** Barlow is loaded from Google Fonts CDN (the brand confirmed it as the primary family).
- **Icons:** Lucide is a substituted set — see iconography section.
- **Agency pictograms:** Not available as a packaged asset; request from the team for brand-accurate feature illustrations.
- **Photography:** No sample photography assets provided; use the agency's site as reference for the warm, commercial, people-forward look.
