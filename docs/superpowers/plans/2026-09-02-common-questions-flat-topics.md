# Common Questions Flat Topics Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn `/common-questions` into one flat list of topics at `/common-questions/<topic>`, with no categories anywhere and no price estimates in any answer.

**Architecture:** The `commonQuestions` content collection loses its `category` field and its subfolders; a topic is one Markdown file directly in `content/common-questions/`, and its URL is derived from the file id. The library, the two routes, and the docs follow. There are no unit tests in this repo: the build is the test, because `src/lib/commonQuestions.ts` throws on any dangling link or mismatched URL, and `grep` on `dist/` proves what rendered.

**Tech Stack:** Astro 5 static build, content collections with the `glob` loader, TypeScript, Markdown. Verify with `npm run build`, never `astro dev`.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-09-02-common-questions-flat-topics-design.md`.
- Canadian English. No em dashes anywhere. Never "honest" or "honestly".
- No figure, percentage or range for cost anywhere in the section. Cost "depends on your needs, your expectations and the scope"; invite the reader to contact us.
- The content collection is the source of truth for every list and count. Nothing hard-coded.
- One H1 per page, no skipped heading levels.
- `--brand-orange` for surfaces only; small orange text uses `--orange-ink`.
- Everything in `src/lib/commonQuestions.ts` throws at build rather than degrading.
- The content, schema, library and route changes ship in ONE commit: the build is red between them.

---

### Task 1: Flatten the content and rewrite the cost answers

**Files:**
- Move: `content/common-questions/{systems,topics,business}/*.md` to `content/common-questions/*.md` (8 files)
- Modify: every moved file's frontmatter (`category:` removed, `url:` and `related:` flattened)
- Modify: `content/common-questions/custom-software.md` (cost answer)
- Modify: `content/common-questions/marketing-and-leads.md` (budget answer)
- Modify: `content/drafts/case-studies/README.md:18` (path mention)

**Interfaces:**
- Produces: eight files whose id is the slug (`custom-software`, `automation-and-ai`, `data-and-dashboards`, `brand-and-positioning`, `marketing-and-leads`, `seo-and-ai-search`, `manufacturing`, `dental-and-medical`) and whose `url:` is `/common-questions/<slug>`. Task 2 derives the same URL and throws if they disagree.

- [ ] **Step 1: Move the files with git so history follows them**

```bash
cd content/common-questions
for f in systems/*.md topics/*.md business/*.md; do git mv "$f" "$(basename "$f")"; done
rmdir systems topics business
ls
```

Expected: eight `.md` files, no subfolders.

- [ ] **Step 2: Strip `category:` and flatten every URL**

```bash
python3 - <<'PY'
import pathlib, re
for p in sorted(pathlib.Path("content/common-questions").glob("*.md")):
    s = p.read_text()
    s2 = re.sub(r"^category: .*\n", "", s, count=1, flags=re.M)
    assert s2 != s, f"{p}: no category line"
    s3, n = re.subn(r"/common-questions/(?:systems|topics|business)/", "/common-questions/", s2)
    p.write_text(s3)
    print(p.name, "urls rewritten:", n)
PY
grep -rn "category:\|/common-questions/\(systems\|topics\|business\)/" content/common-questions/ | wc -l
```

Expected: per-file counts summing to 56, then `0`.

- [ ] **Step 3: Rewrite the custom software cost answer**

In `content/common-questions/custom-software.md`, replace the paragraph directly under `## How much does custom business software cost?`:

Old:
```
A focused internal tool that replaces a few spreadsheets typically runs in the low tens of thousands. A connected system with several integrations, user roles and reporting runs higher, often into six figures. The range is wide because cost follows scope and integration count rather than screen count. Discovery is what turns a range into a number.
```

New:
```
It depends on your needs, your expectations and the scope. The same brief can be a focused tool that replaces a few spreadsheets or a connected system with integrations, user roles and reporting, and the two are not close in cost. The way to get a real number is a conversation about what the software has to do. Contact us and we will talk it through.
```

Every other paragraph in that answer stays.

- [ ] **Step 4: Rewrite the marketing budget answer**

In `content/common-questions/marketing-and-leads.md`, under `## How much should a business spend on marketing?`:

Old first paragraph:
```
A common benchmark is five to ten percent of revenue for an established business, and more for one pursuing growth or entering a new market. The benchmark is a starting point rather than an answer. What matters more is whether the spending is concentrated enough to be noticed, because a budget spread thin across six channels usually buys nothing anywhere.
```
New:
```
There is no single figure. The right amount depends on your needs, your expectations and what marketing has to do for you. What matters more than the amount is whether it is concentrated enough to be noticed, because a budget spread across six channels usually buys nothing anywhere. For a number that fits your situation, contact us and we will work it out with you.
```

Old second paragraph opening:
```
Percentage-of-revenue rules survive because they are easy to quote, not because they are accurate.
```
New:
```
Percentage-of-revenue rules are easy to quote and rarely accurate.
```

Old third paragraph opening:
```
Three questions get closer than a benchmark.
```
New:
```
Three questions get closer than any rule of thumb.
```

- [ ] **Step 5: Fix the path in the parked case study README**

`content/drafts/case-studies/README.md` line 18: `content/common-questions/business/manufacturing.md` becomes `content/common-questions/manufacturing.md`.

- [ ] **Step 6: Verify no estimate survives in the source**

```bash
grep -rn -i "tens of thousands\|six figures\|percent of revenue\|benchmark" content/common-questions/
```

Expected: no output.

---

### Task 2: Schema and library

**Files:**
- Modify: `src/content.config.ts` (the `commonQuestions` collection, around line 134)
- Modify: `src/lib/commonQuestions.ts`

**Interfaces:**
- Produces: `Cluster.slug: string` (replaces `path`), `clusterBySlug(slug)` (replaces `clusterByPath`). Removes `Cluster.category`, `CATEGORY_LABELS`, `byCategory()`. `clusters()`, `allQuestions()`, `questionCount()` unchanged. Task 3 consumes these.

- [ ] **Step 1: Remove `category` from the schema**

In `src/content.config.ts`, delete this line inside the `commonQuestions` schema:

```ts
    category: z.enum(['systems', 'topics', 'business']),
```

Update the doc comment above the collection: "One file per CLUSTER" stays; add "Files sit directly in `content/common-questions/`; the file id is the slug and the URL is `/common-questions/<slug>`."

- [ ] **Step 2: Replace `path` and `category` on the `Cluster` type**

```ts
export type Cluster = {
  title: string;
  url: string;
  /** The file id and the route param for `[slug].astro`, e.g. `custom-software`. */
  slug: string;
  order: number;
  caption: string;
  seoTitle: string;
  seoDescription: string;
  quote: string;
  lede: string;
  questions: Question[];
};
```

Delete the `CATEGORY_LABELS` constant entirely.

- [ ] **Step 3: Derive the URL from the id and throw on disagreement**

In `clusters()`, inside the `.map((entry) => { ... })`, replace the returned object's `url`, `path` and `category` lines:

```ts
      const slug = entry.id;
      const url = `/common-questions/${slug}`;
      if (entry.data.url && entry.data.url !== url) {
        throw new Error(
          `[common-questions] ${file}: frontmatter url "${entry.data.url}" does not match ` +
            `"${url}", which is where this file builds. Rename the file or fix the url.`,
        );
      }

      return {
        title: entry.data.title,
        url,
        slug,
        order: entry.data.order ?? 0,
        caption: entry.data.caption ?? '',
        seoTitle: entry.data.seoTitle ?? entry.data.title,
        seoDescription: entry.data.seoDescription ?? '',
        quote: entry.data.quote,
        lede,
        questions,
        file,
      };
```

- [ ] **Step 4: Rename the lookup and delete the grouping**

Replace `clusterByPath` with:

```ts
export async function clusterBySlug(slug: string): Promise<Cluster | undefined> {
  return (await clusters()).find((c) => c.slug === slug);
}
```

Delete `byCategory()` and its doc comment. Nothing else in the file changes.

- [ ] **Step 5: Update the header comment**

In the file's opening comment, after the paragraph on anchors, add:

```
 * There are no categories. A topic is one file directly in
 * `content/common-questions/`, its id is the slug, and the hub lists topics in
 * `order`. Javad's direction, 2026-09-02: three fixed buckets looked like a
 * structure that could not grow; a flat list grows by adding a file.
```

---

### Task 3: The two routes

**Files:**
- Rename: `src/pages/common-questions/[...path].astro` to `src/pages/common-questions/[slug].astro`
- Modify: `src/pages/common-questions/[slug].astro` (params, eyebrow, siblings)
- Modify: `src/pages/common-questions/index.astro` (hub list)

**Interfaces:**
- Consumes: `clusters()`, `questionCount()`, `Cluster.slug`, `Cluster.url`, `Cluster.title`, `Cluster.caption`, `Cluster.questions` from Task 2.

- [ ] **Step 1: Rename the topic route**

```bash
git mv "src/pages/common-questions/[...path].astro" "src/pages/common-questions/[slug].astro"
```

- [ ] **Step 2: Update the topic route's script**

Import line: `import { clusters } from '../../lib/commonQuestions';` (drop `CATEGORY_LABELS`).

Header comment first line: `/common-questions/<slug>`.

`getStaticPaths`:

```ts
export async function getStaticPaths() {
  const all = await clusters();
  return all.map((cluster, i) => ({
    params: { slug: cluster.slug },
    props: {
      cluster,
      prev: all[i - 1] ?? null,
      next: all[i + 1] ?? null,
      /* Every other topic, in order. There are no categories, so the "keep
         reading" list is the whole section minus this page. */
      siblings: all.filter((c) => c.url !== cluster.url),
    },
  }));
}
```

- [ ] **Step 3: Update the topic route's eyebrow and sibling heading**

Eyebrow:
```astro
<p class="hero__crumb t-eyebrow">Alive ProStudios&nbsp;&nbsp;·&nbsp;&nbsp;Common Questions</p>
```

Sibling heading:
```astro
<h2 class="cq__heading t-h2 dot z-content">More common questions</h2>
```

No CSS changes on this route.

- [ ] **Step 4: Replace the hub's grouped grid with one topic list**

In `src/pages/common-questions/index.astro`, import line becomes:
```ts
import { questionCount, clusters } from '../../lib/commonQuestions';
```
Delete `const groups = await byCategory();`.

Replace the whole `{ groups.map(...) }` block inside `<main>` with:

```astro
      <section class="cqh section">
        <p class="cqh__eyebrow t-eyebrow z-content">
          <span class="cqh__num">(01)</span>&nbsp;&nbsp;Topics&nbsp;&nbsp;
          <span class="cqh__count">({count})</span>
        </p>
        <h2 class="cqh__heading t-h2 dot z-content">Topics</h2>

        {/* One row per topic, the list the section grows by. A topic is one
            Markdown file; this list, the menu row and every count follow it. */}
        <ol class="cqh__topics z-content">
          {all.map((topic, i) => (
            <li class="cqh__topic">
              <a class="cqh__topicLink" href={topic.url}>
                <span class="cqh__topicIndex t-index">{String(i + 1).padStart(2, '0')}</span>
                <span class="cqh__topicBody">
                  <span class="cqh__topicTitle">{topic.title}</span>
                  <span class="cqh__topicCaption">{topic.caption}</span>
                </span>
                <span class="cqh__topicMeta">
                  {topic.questions.length} {topic.questions.length === 1 ? 'answer' : 'answers'}
                </span>
              </a>
            </li>
          ))}
        </ol>
      </section>
```

"Not here" eyebrow number becomes a literal `(02)` and `<NextStep sectionNum="03" />`.

Update the route's header comment: the hub lists topics, not every question; the densest link source is now the topic page.

- [ ] **Step 5: Replace the card CSS with the row CSS**

Delete the rules for `.cqh__grid`, `.cqh__card`, `.cqh__cardHead`, `.cqh__cardTitle`, `.cqh__cardMeta`, `.cqh__questions` (and their `li`/`a` rules). Add:

```css
  .cqh__topics { margin: 0; padding: 0; list-style: none; }
  .cqh__topic { border-top: 1px solid var(--pg-line); }
  .cqh__topic:last-child { border-bottom: 1px solid var(--pg-line); }
  .cqh__topicLink {
    display: grid;
    grid-template-columns: var(--col-num) 1fr auto;
    gap: clamp(24px, 3vw, 56px);
    align-items: baseline;
    padding: 26px 0;
    text-decoration: none;
    color: var(--pg-fg);
    transition: color var(--dur-micro) ease, transform var(--dur-micro) var(--ease-settle);
  }
  .cqh__topicLink:hover { color: var(--orange-ink); transform: translateX(6px); }
  .cqh__topicLink:focus-visible { outline: 2px solid var(--brand-orange); outline-offset: 4px; }
  .cqh__topicIndex { padding-top: 0.35em; }
  .cqh__topicBody { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
  .cqh__topicTitle {
    font-weight: 600;
    font-size: clamp(19px, 1.7vw, 24px);
    line-height: 1.25;
    letter-spacing: -0.01em;
  }
  .cqh__topicCaption { max-width: 62ch; font-size: 15px; line-height: 1.5; color: var(--pg-fg2); }
  .cqh__topicMeta {
    font-size: 12px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    white-space: nowrap;
    color: var(--pg-fg3);
  }
```

In the `@media (max-width: 760px)` block add:
```css
    .cqh__topicLink { grid-template-columns: 40px 1fr; gap: 12px 16px; }
    .cqh__topicMeta { grid-column: 2; }
    .cqh__topicLink:hover { transform: none; }
```

In the `prefers-reduced-motion` block add `.cqh__topicLink` to the `transition: none` rule.

---

### Task 4: Documents

**Files:**
- Modify: `SITEMAP.md:31`
- Modify: `CLAUDE.md` (decision 8, Content rules, Known gaps Common Questions row)
- Modify: `docs/superpowers/specs/2026-09-01-common-questions-design.md` (pointer at top)

- [ ] **Step 1: SITEMAP.md**

Replace the row beginning `| \`/common-questions/<category>/<cluster>\`` with:

```
| `/common-questions/<topic>` | 8 topic pages holding 24 anchored questions. Flat since 2026-09-02: no categories, no subfolders, no category routes. The hub lists topics only. Adding a topic is adding a file | `content/common-questions/*.md` |
```

- [ ] **Step 2: CLAUDE.md decision 8**

Append to decision 8:

```
   **Flat since 2026-09-02.** No categories: the hub is one list of topics at
   `/common-questions/<topic>`, one Markdown file per topic directly in
   `content/common-questions/`. Javad's reason was scale: three fixed buckets
   looked like a structure that could not grow. Do not reintroduce grouping in
   the URL or the frontmatter; if the list ever needs themes, do it on the hub
   as presentation only.
```

- [ ] **Step 3: CLAUDE.md Content rules**

Add after the "honest" rule:

```
- **Never give a price, range, percentage or benchmark for what anything
  costs.** Javad's rule, 2026-09-02. Prospects read an estimate as a bill and
  decide we are unaffordable before a conversation. Cost "depends on your
  needs, your expectations and the scope"; invite them to contact us.
```

- [ ] **Step 4: CLAUDE.md Known gaps row**

Prepend to the Common Questions row's cell: `**Flattened 2026-09-02:** one list of eight topics at \`/common-questions/<topic>\`, categories and subfolders gone, the two cost answers rewritten with no figures. Spec: \`docs/superpowers/specs/2026-09-02-common-questions-flat-topics-design.md\`. ` Then the existing text, with "9 routes: a hub plus 8 cluster pages" left as is.

- [ ] **Step 5: Old spec pointer**

Insert after the title line of `docs/superpowers/specs/2026-09-01-common-questions-design.md`:

```
> **Superseded in part, 2026-09-02.** The hub, the routes and the three
> categories were replaced by one flat list of topics; see
> `2026-09-02-common-questions-flat-topics-design.md`. Everything else here stands.
```

---

### Task 5: Build, verify, commit

**Files:** none new.

- [ ] **Step 1: Build**

```bash
npm run build 2>&1 | tail -8
```

Expected: `74 page(s) built`, `_headers` and `_redirects` written, no error. If the library throws, the message names the file and the link; fix the source, never the check.

- [ ] **Step 2: Verify the output**

```bash
ls dist/common-questions/            # eight <slug>.html, no folders
grep -rl "Business Systems\|By Business\|tens of thousands\|six figures\|percent of revenue" dist | wc -l   # 0
grep -o 'class="cqh__topic"' dist/common-questions.html | wc -l                                            # 8
grep -o 'href="/common-questions/[a-z-]*"' dist/common-questions/custom-software.html | sort -u | wc -l      # 8: menu row (8) covers the siblings too
grep -c "More common questions" dist/common-questions/custom-software.html                                   # 1
grep -o "Contact us and we will talk it through" dist/common-questions/custom-software.html | wc -l          # 1
grep -c "systems/\|topics/\|business/" dist/sitemap-0.xml                                                    # 0
npm run check 2>&1 | tail -4        # the one pre-existing blog error only
```

- [ ] **Step 3: Commit everything together**

```bash
git add content/common-questions content/drafts/case-studies/README.md src/content.config.ts src/lib/commonQuestions.ts src/pages/common-questions SITEMAP.md CLAUDE.md docs/superpowers/specs/2026-09-01-common-questions-design.md docs/superpowers/plans/2026-09-02-common-questions-flat-topics.md
git commit -m "Flatten Common Questions into one list of topics and remove cost estimates"
```

Body: Javad's review of staging on 2026-09-02, the three points, the URL change with no redirects because nothing shipped, and the no-estimates rule now in CLAUDE.md.
