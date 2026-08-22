# CLAUDE.md — Alive ProStudios (Astro rebuild)

> Read this fully before writing any code.

---

## What this project is

A ground-up rebuild of aliveprostudios.com on **Astro**, replacing the existing
Next.js + Sanity site.

**Client:** Alive ProStudios Inc.
**Owner:** Javad Ahmadi — Founder & Brand Transformation Architect
**Co-Founder:** Homayra Ahmadi — Operations Director
**Location:** Toronto, Canada (GTA) · **Founded:** 1997
**Markets:** Canada, USA, Germany, Middle East

---

## Decisions already made

These are settled. Do not reopen without asking Javad.

1. **Astro, not Next.js.**
2. **No CMS.** Sanity is gone. Content lives as Markdown in this repo and is
   edited with Claude Code or Codex. No API, no CDN, no tokens, no `/studio`.
3. **Text only.** Images, portfolio items, and page templates were deliberately
   excluded from the migration. Design comes fresh from Javad.
4. **Content is already exported** and sits in `content/`. Do not re-pull from
   Sanity.

---

## Current state

```
20 Alive Astro/
├── CLAUDE.md          ← this file
├── SITEMAP.md         ← canonical URL map + 63 redirects. Read before routing.
└── content/           ← 45 Markdown files, ~19,100 words
    ├── README.md
    ├── homepage.md
    ├── faqs.md
    ├── site-copy.md       footer + pre-footer copy
    ├── services/
    │   ├── foundation/       4 pages
    │   ├── execution/        8 pages
    │   ├── growth/          11 pages
    │   └── infrastructure/   6 pages
    ├── pages/             8 Alive Pro pages
    ├── blog/              3 posts
    └── work/videos.md     26 video URLs + tags
```

**Astro is not scaffolded yet.** Nothing has been installed. Javad is supplying
design templates and the master brand style guide before the build starts.

---

## Content format

Every file carries frontmatter and clean Markdown:

```markdown
---
title: "Ongoing Brand Guardianship"
slug: "ongoing-brand-guardianship"
category: "growth"
url: "/growth/ongoing-brand-guardianship"
seoTitle: "..."
seoDescription: "..."
---
```

These map onto Astro **Content Collections**. Define the schema in
`src/content/config.ts` with zod so frontmatter is type-checked at build.

---

## Brand tokens

Carried over from the previous build. Use these exact values.

| Name | Hex | Usage |
|---|---|---|
| Black | `#000000` | Primary background, dominant surfaces |
| Dark Green | `#346632` | Secondary brand, supporting accents |
| Light Green | `#95C83F` | Energy accent, highlights |
| Orange | `#F76E1E` | ALL primary CTAs, hover, key highlights |
| Light Grey | `#E6E7E8` | Light-mode background, dividers |

Extended UI: `#1A1A1A` surface · `#2E2E2E` border · `#6B6B6B` body text on light
(note: `#6B6B6B` fails WCAG AA on light backgrounds — darken it this time).

Orange hover: `#D85A0A`. Radius near-zero, sharp. 8pt spacing grid.

**Confirm the type stack against Javad's style guide before building.** The old
site used Bebas Neue (display), Barlow (body), DM Mono (labels). Never Inter,
Roboto, Arial, or system-ui.

---

## Content rules

- **Canadian English** — colour, behaviour, centre, catalogue, honour
  ("ize" endings kept: organize, recognize)
- **No em dashes anywhere. Ever.**
- No filler ("In today's world", "In conclusion", "As a trusted partner")
- Tone: strategic, authoritative, a partner not a vendor
- 3–5 paragraphs per section

---

## Non-negotiables for the build

1. **Ship the 63 redirects** in `SITEMAP.md`. Losing them discards years of SEO
   equity on the old WordPress URLs.
2. **One H1 per page**, clean H2/H3 hierarchy, no skipped levels.
3. **JSON-LD**: Organization (home), Service (service pages), FAQPage, Article
   (blog), BreadcrumbList (all).
4. **Canonical URL per page.** The old site shipped a bug where every page
   inherited the homepage canonical. Do not repeat it.
5. **Accessibility**: WCAG 2.1 AA, visible focus states, keyboard navigation,
   `prefers-reduced-motion` respected on every animation.
6. **i18n-ready structure.** English has no prefix. Phase 2 adds fr/de/es/zh/ar,
   with Arabic RTL.

---

## Lessons from the previous build

Worth knowing so they are not repeated:

- **Verify visual bugs with rendered pixels, not `getBoundingClientRect()`.** A
  footer gap was declared fixed across ~10 sessions on box-model measurements
  that read zero. The real cause was a video letterboxing itself *inside* an
  iframe, which the box model cannot see. It blocked launch for weeks.
- **Never hardcode a media aspect ratio.** Derive it from the asset.
- Framer Motion drove the old animations. Astro ships no JS by default — reach
  for CSS first, and use a React/Svelte island only where genuinely needed.
- The old repo accumulated per-breakpoint magic numbers that masked bugs rather
  than fixing them. Prefer one correct value over three tuned ones.

---

## Working agreements

- Ask before structural decisions not covered here
- One component per file
- TypeScript throughout
- Run commands directly rather than asking Javad to copy-paste
- Commit messages: clear, descriptive, present tense
- **Do not claim something works until it has been verified.** Show the evidence.

---

## Reference

The previous site remains at `../04 Alive-Reborn/` (live, Next.js) for anything
needing to be looked up: portfolio data, images, component behaviour, the full
old `CLAUDE.md`. Sanity project `22a48h68` is still intact and untouched.

---

*Alive ProStudios Inc. — Confidential — Astro rebuild — started August 22, 2026*
