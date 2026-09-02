# Common Questions: Flat Topics, No Prices

**Date:** 2026-09-02
**Status:** Approved by Javad in conversation, 2026-09-02. Supersedes the hub,
route and category parts of `2026-09-01-common-questions-design.md`. Everything
else in that spec stands: cluster pages, the answer format, the schema, the
writing rules and the future list.

---

## 1. What Javad asked for

Reviewing `/common-questions` on staging, 2026-09-02:

1. **No price estimates in any answer.** Two answers quoted figures: custom
   software at "low tens of thousands" to "six figures", and a marketing budget
   benchmark of five to ten percent of revenue. Prospects read those as a bill
   and decide Alive Pro is unaffordable before a conversation happens. An
   answer about cost says it depends on needs, expectations and scope, and
   invites the reader to contact us.
2. **Business Systems is not a section.** Its three clusters are topics like
   the others.
3. **The structure has to scale.** Three category buckets with three topics
   each looked fixed. Javad's words: "List the topics only, because that gives
   us the flexibility to add more topics."

## 2. Decisions

1. **One flat list of topics.** No categories anywhere: not on the hub, not in
   the URL, not in the frontmatter, not in the eyebrow. A topic is one Markdown
   file in `content/common-questions/`. Adding a topic is adding a file.
2. **The hub lists topics only.** One numbered row per topic: title, caption,
   answer count, linking to the topic page. No per-question links on the hub.
   Thirty topics is a screen and a half. Question discovery moves to the topic
   page, which already has the answers visible and anchored. Engines still
   reach every question through the topic pages and the sitemap.
3. **URLs flatten to `/common-questions/<topic>`.** Nothing under
   `/common-questions/` has reached production, so there is nothing to
   redirect and nothing lost. `/faqs` and `/resources/faqs` keep pointing at
   the hub.
4. **Order is one global `order` per file.** The current numbers 1 to 8 are
   already unique across the old categories, so nothing is renumbered:
   custom software, automation and AI, data and dashboards, brand, marketing,
   search, manufacturers, dental and medical.
5. **Manufacturers and dental and medical are topics** like any other. Their
   titles already read that way ("Questions from Manufacturers").
6. **The menu keeps listing every topic.** Fine at eight. Past about twelve,
   cap the row and add an "All common questions" entry. Not before.
7. **Cost questions stay, estimates go.** The two question headings remain,
   because people search for them. Their direct answers are rewritten to the
   rule in §4. No figure, percentage or range of any kind remains in the
   section.

## 3. What changes where

### Content

- `content/common-questions/{systems,topics,business}/*.md` move up to
  `content/common-questions/*.md`. Eight files.
- Frontmatter: `category:` removed; `url:` rewritten to
  `/common-questions/<slug>`; every `related:` entry loses its category
  segment. 56 URL rewrites across the eight files, the eight `url:` lines
  plus 48 `related:` entries, all mechanical.
- Two answers rewritten, §4.

### Schema, `src/content.config.ts`

- `category` removed from the `commonQuestions` schema. A file carrying it
  fails the build, which is the right outcome: the field no longer means
  anything.

### Library, `src/lib/commonQuestions.ts`

- `Cluster.category`, `CATEGORY_LABELS` and `byCategory()` removed.
- `Cluster.path` becomes `Cluster.slug`, the file's id, and
  `clusterByPath()` becomes `clusterBySlug()`. The `url` is
  `/common-questions/<slug>`, derived from the id, and a frontmatter `url`
  that disagrees with it throws, so the two cannot drift.
- Everything else is untouched: parsing, direct answers, anchors, link
  checking, the FAQPage source.

### Routes

- `src/pages/common-questions/[...path].astro` becomes `[slug].astro`.
  Eyebrow becomes `Alive ProStudios · Common Questions`, matching the hub.
  The "More on business systems" block becomes **More common questions** and
  lists every other topic, in order, as the plain text list it already is.
  Prev and next in the footer follow the global order.
- `src/pages/common-questions/index.astro`: the grouped card grid is
  replaced by one section, `(01) Topics (24)`, holding a single list. Each
  row is the topic title, its caption and its answer count, the row itself
  the link. The row treatment reuses the sibling list from the topic page,
  so the two lists look the same. "Not here" becomes `(02)` and Next Step
  `(03)`. The `CollectionPage` schema is unchanged.

### Documents in the same commit

- `SITEMAP.md`: the `/common-questions/<category>/<cluster>` row becomes
  `/common-questions/<topic>`, eight topic pages, no categories.
- `CLAUDE.md`: decision 8 and the Common Questions row in Known gaps record
  the flattening and the no-estimates rule. The no-estimates rule also goes
  under Content rules, because it applies to every page, not only this one.
- `docs/superpowers/specs/2026-09-01-common-questions-design.md` gets a
  one-line pointer at the top to this spec.

## 4. The cost answers

Rule, from Javad: cost depends on needs, expectations and scope; encourage the
reader to contact us to discuss their needs. No figures.

### How much does custom business software cost?

Direct answer:

> It depends on your needs, your expectations and the scope. The same brief can
> be a focused tool that replaces a few spreadsheets or a connected system with
> integrations, user roles and reporting, and the two are not close in cost.
> The way to get a real number is a conversation about what the software has
> to do. Contact us and we will talk it through.

Detail: the existing paragraphs stay, from "Nobody can price custom software
from a description" through the three cost drivers to the paid discovery
phase. The old opening paragraph with the ranges is deleted. "It costs a
fraction of the project" stays: it is a relationship, not an estimate.

### How much should a business spend on marketing?

Direct answer:

> There is no single figure. The right amount depends on your needs, your
> expectations and what marketing has to do for you. What matters more than the
> amount is whether it is concentrated enough to be noticed, because a budget
> spread across six channels usually buys nothing anywhere. For a number that
> fits your situation, contact us and we will work it out with you.

Detail: the percentage-of-revenue paragraph is reworded to make the point
without quoting the rule ("Percentage-of-revenue rules are easy to quote and
rarely accurate"), "Three questions get closer than a benchmark" becomes
"than any rule of thumb", and the rest stays.

## 5. Verification

- `npm run build` passes. Route count stays 74: eight topic pages plus the
  hub, same as before, at new URLs.
- `dist/common-questions/` holds eight `<slug>.html` files and no
  `systems/`, `topics/` or `business/` folders.
- No occurrence of `Business Systems`, `By Business`, `tens of thousands`,
  `six figures` or `percent of revenue` anywhere in `dist/`.
- Every `related` link resolves: the library already throws on a dangling
  one, so a passing build is the proof.
- The hub lists eight rows with the right counts; a topic page's "More common
  questions" lists the other seven.
- The menu row shows eight topics at the new URLs.

## 6. Out of scope

- Writing new topics. The future list in the 2026-09-01 spec stands.
- Category hub routes. Decision 3 of the 2026-09-01 spec said revisit past
  fifteen clusters; with categories gone that question is moot. A topic index
  by theme can be added later as a presentation choice on the hub without
  touching URLs.
- The menu cap, until the row passes about twelve.

---

*Alive ProStudios Inc. — Confidential*
