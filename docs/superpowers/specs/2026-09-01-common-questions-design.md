# Common Questions — Knowledge Base Design

**Date:** 2026-09-01
**Status:** Architecture and question map approved by Javad. Content not yet written.
**Scope:** A top-level educational knowledge base at `/common-questions`, built for
SEO, AEO and AI search visibility. 24 questions across 8 cluster pages plus a hub.

---

## 1. Why this section exists

The site sells four domains of work. Search does not. People search their problem
("traffic but no leads"), their trigger ("when to replace spreadsheets"), or their
definition ("what is business process automation"). None of those match a service
page title, so none of them reach the site today.

This section answers those questions directly enough that an answer engine can quote
a single paragraph, and links each answer to the service that solves it. It is not a
sales FAQ. `/resources/faqs` is the sales FAQ and stays exactly as it is.

### Relationship to what already exists

| Section | Job | Status |
|---|---|---|
| `/resources/faqs` | Company FAQ: who we are, how we work, cost | Live on staging, design approved 2026-09-01. **Untouched by this work.** |
| `/common-questions` | Subject knowledge base: branding, marketing, systems | This spec |
| `/start-here` | Router: visitor's need to the right service | 9 files written, copy rejected 2026-08-31, nothing wired |

The seven questions on `/resources/faqs` are all company-scoped, so none of them
duplicates a question here. The two sections cross-link once each.

Start Here and Common Questions are structurally similar and could compete. They do
not, because they do different jobs: Start Here routes a visitor who already knows
they need help, Common Questions teaches a visitor who does not yet. When Start Here
is rebuilt, its rows should link into the matching cluster rather than re-explain.

---

## 2. Decisions settled

1. **Top-level `/common-questions/`, not under Resources.** Its own menu row, placed
   after Case Studies. Same call as Case Studies: menu position and URL depth are
   separate decisions.
2. **Cluster pages, not one page per question.** At the answer spec below, a
   single-question page runs about 350 words, which would be the thinnest route on the
   site. Case studies run 651 to 968. Clusters run 1,200 to 1,800 with a linkable
   anchor per question, so answer engines still extract one answer at a time.
3. **No category hub routes.** `/common-questions/systems` is not a page. Three
   clusters does not earn a router. Breadcrumbs skip the category so nothing links to
   a path that 404s. Revisit past roughly 15 clusters.
4. **Weighting is systems-heavy:** 10 systems, 9 topics, 5 business. Matches the
   Sept/Oct commercial focus on custom software for manufacturers.
5. **Two industries, not five.** Manufacturing and dental/medical, because 8 of the 11
   case studies are manufacturing or industrial and Vitality Dentistry covers dental.
   Law firms and gyms have no proof behind them and go on the future list.
6. **No search volume data was used.** DataForSEO returned HTTP 402, out of credit, on
   both the Google Ads volume and Keyword Difficulty endpoints on 2026-09-01, the same
   failure recorded on 2026-08-31. The map is judgment. Re-validate before any paid
   search spend on these terms.

---

## 3. Routes

Nine new routes. Staging goes 68 to 77. No redirects: none of these URLs existed before.

```
/common-questions                                  hub
/common-questions/systems/custom-software          4 questions
/common-questions/systems/automation-and-ai        3
/common-questions/systems/data-and-dashboards      3
/common-questions/topics/brand-and-positioning     3
/common-questions/topics/marketing-and-leads       3
/common-questions/topics/seo-and-ai-search         3
/common-questions/business/manufacturing           3
/common-questions/business/dental-and-medical      2
```

Menu becomes: Foundation, Execution, Growth, Infrastructure, Work, Case Studies,
**Common Questions**, Alive Pro, Resources, Contact. Numbers reassign automatically in
`src/lib/nav.ts`.

---

## 4. The 24 questions

Every question below is the H2 on its cluster page, worded as searched. The anchor is
the slugified heading, declared explicitly in frontmatter so rewording a question is a
deliberate change to a public URL fragment rather than a silent one.

### Systems (10)

**`/common-questions/systems/custom-software`** — Build, Buy, or Neither

| # | Question | Intent | Services |
|---|---|---|---|
| 1 | Does a small business need custom software? | Qualifying | Solution Architecture |
| 2 | Should we build custom software or use an off-the-shelf platform? | Commercial comparison | Solution Architecture, Custom App Development |
| 3 | How much does custom business software cost? | "How much", decision | Custom App Development |
| 4 | How long does it take to build a custom application? | "How long", decision | Custom App Development, Lifecycle Support |

Q1 and Q2 carry the objectivity rule. Both answers must be able to end at "buy the
platform". A knowledge base where every road leads to a build is an advertisement, and
readers and answer engines both discount it.

**`/common-questions/systems/automation-and-ai`** — Automation and AI in a Real Business

| # | Question | Intent | Services |
|---|---|---|---|
| 5 | What is business process automation? | Definitional | Intelligent Systems Integration |
| 6 | Which processes should a company automate first? | Sequencing | Intelligent Systems Integration, Solution Architecture |
| 7 | Can AI take over repetitive work in a business that already has software? | Feasibility | Intelligent Systems Integration, AI-Generated Production |

**`/common-questions/systems/data-and-dashboards`** — Spreadsheets, Integration, One Source of Truth

| # | Question | Intent | Services |
|---|---|---|---|
| 8 | When should a company replace spreadsheets with a real system? | Trigger | Solution Architecture, Custom App Development |
| 9 | How do you connect software that was never built to work together? | How-to | Intelligent Systems Integration |
| 10 | What is an executive dashboard, and what belongs on one? | Definitional + practical | Dashboards & Analytics |

### Topics (9)

**`/common-questions/topics/brand-and-positioning`**

| # | Question | Intent | Services |
|---|---|---|---|
| 11 | What is brand positioning, and how is it different from a logo? | Disambiguating | Brand Strategy & Positioning, Brand Name & Identity |
| 12 | When does a business actually need to rebrand? | Trigger | Rebranding |
| 13 | Why does our brand look different everywhere it shows up? | Problem-based | Brand Voice, Ongoing Brand Guardianship |

**`/common-questions/topics/marketing-and-leads`**

| # | Question | Intent | Services |
|---|---|---|---|
| 14 | Why does our website get traffic but almost no leads? | Problem-based | Lead Generation, Sales Funnel Building |
| 15 | How much should a business spend on marketing? | "How much" | Digital Marketing, Marketing Innovation |
| 16 | What is marketing automation, and what does it actually do? | Definitional | Customer Retention Marketing, Intelligent Systems Integration |

**`/common-questions/topics/seo-and-ai-search`**

| # | Question | Intent | Services |
|---|---|---|---|
| 17 | What is AEO, and how is it different from SEO? | Definitional comparison | AEO, SEO |
| 18 | How does a business get mentioned in ChatGPT and other AI answers? | How-to, thin competition | AEO, Content Marketing |
| 19 | Does local SEO matter for a company selling across Canada and the US? | Geographic | SEO |

Q19 is the only question where Toronto, the GTA and Ontario belong in the body copy.
Geography is not inserted anywhere else.

### Business (5)

**`/common-questions/business/manufacturing`**

| # | Question | Intent | Services and proof |
|---|---|---|---|
| 20 | Should a manufacturer invest in marketing, or is it all relationships and trade shows? | Objection-handling | Brand Strategy, Lead Generation · MCON Pipe, Lawrence Hardware |
| 21 | How does a manufacturer stop quoting jobs out of spreadsheets? | Problem-based | Custom App Development, Solution Architecture · Gallery Specialty |
| 22 | Why do manufacturers struggle to explain what makes them different? | Problem-based | Brand Strategy, Sales & Marketing Collateral · ASSA ABLOY, Darmaga |

Q21 is the commercial centre of the section. It is also the only question that joins
the branding half of the business to the systems half inside one answer.

**`/common-questions/business/dental-and-medical`**

| # | Question | Intent | Services and proof |
|---|---|---|---|
| 23 | How does a dental practice attract more qualified implant patients? | Industry lead generation | Lead Generation, Digital Marketing · Vitality Dentistry |
| 24 | How does a clinic or medical spa stand out in a crowded local market? | Differentiation + local | Brand Strategy, SEO, Reputation Management |

### Merged deliberately

Two questions from the brief are folded in rather than written separately, because they
target the same intent as a question already on the map:

- "Can custom software connect with our existing CRM" folds into Q9.
- "How can automation reduce human error" folds into Q6.

### Known gap in round one

**Video and photography get no question.** Execution is 8 of the 28 service pages and
video is central to how Alive Pro presents itself. The systems-heavy weighting left no
slot. The cleanest swap, if wanted, is Q15 (marketing spend, a commodity question) for
"Is video worth the investment for a B2B company?" It is item 1 on the future list.

---

## 5. Page anatomy

### A question block

Each question is one block on its cluster page:

1. **H2, the question verbatim**, carrying `id="<anchor>"`.
2. **Direct answer, 40 to 70 words**, as the first paragraph, styled as a lede so it
   reads as the answer and not as an introduction. This paragraph is the unit an answer
   engine quotes and the unit that goes into the schema. It must stand alone with no
   preceding context.
3. **Detail, 150 to 300 words** of prose. What it means, why it matters, when it is
   relevant, what people get wrong.
4. **Related line:** the service pages, the case study where one exists, and 2 to 4
   sibling questions.

No answer opens with a scene-setting clause. No "In today's". The first sentence
answers the question.

### The bullets question

The brief specifies a standing "Key Considerations, 3 to 5 bullet points" block.
Javad's standing preference is heading plus prose, and he strips bullets, deliverable
lists and timeframes from page copy.

**Resolution: prose by default, list by exception.** There is no standing bullet block.
A list appears only where the content is genuinely enumerable and a list is easier to
read than a sentence, which is what the brief itself asks for elsewhere ("use lists
where lists improve understanding"). On this map that is expected to be about 3 of 24
answers: Q6 (which processes to automate first, a real sequence), Q10 (what belongs on
a dashboard), and possibly Q8. Every other answer is prose.

**This is the one open decision in the spec.** If Javad wants the bullet block on every
question, it is a one-line change here and a consistent change across 24 answers.

### A cluster page

- Hero, eyebrow `Common Questions · Systems`, H1 = cluster title, lede.
- A jump list of the questions on the page, which doubles as the anchor nav.
- The question blocks.
- Cross-links to the two or three sibling clusters.
- `NextStep` and `BookConsult`, as every other page.

One H1 per page, no skipped levels: H1 cluster title, H2 per question, H3 only inside
an answer that needs one.

### The hub

- Hero, H1 "Common Questions", lede.
- Eight cluster cards under three headings: Business Systems, Topics, By Business.
- Counts read from the collection, never hard-coded.
- One line pointing to `/resources/faqs` for questions about working with Alive Pro.

### Javad quote

Blog posts each carry one Javad quote. These are not blog posts, but attribution helps
both E-E-A-T and AI citation. **Recommendation: one quote per cluster page, eight
total**, tagged "Javad Ahmadi, Brand Transformation Architect" as on the blog. Not one
per question, which would be 24 and would read as decoration.

---

## 6. Structured data

The brief is right not to reach for FAQPage reflexively. The reasoning, recorded so it
is not re-litigated:

- **FAQPage produces no rich result here.** Google restricted FAQ rich results to
  government and health sites in August 2023. It stays worth emitting because it is
  machine-readable at zero cost, it is consumed by answer engines and other parsers,
  and the site already emits it on `/resources/faqs`.
- **QAPage is wrong.** It describes a user-generated single-question page with answers
  and voting, which is a forum, not an editorial knowledge base.
- **Article is wrong.** These are reference pages, not authored articles, and Article
  here would compete with the blog for the same entity type.

**Per cluster page:** `WebPage` + `BreadcrumbList` + `FAQPage` whose `mainEntity` holds
only that page's questions.

**Hub:** `CollectionPage` + `BreadcrumbList`. No FAQPage, it holds no answers.

`Organization` stays global from `BaseLayout`.

Two constraints:

- **The schema answer is the direct answer paragraph, generated from the same Markdown**
  that renders on the page, exactly as `src/lib/faqs.ts` does today. Visible text and
  structured data cannot drift because there is one source.
- **Pass `schemaType="WebPage"`, never `"Article"`.** `MasterPage` builds a `#page`
  entity from `schemaType`, and passing `Article` emits a second thin Article into the
  same graph. Recorded in CLAUDE.md; repeated here because this section will be
  tempted by it.

---

## 7. Internal link graph

The section is a graph, not 8 unconnected pages. Four edge types:

**Business to Topic** — manufacturing to brand-and-positioning and marketing-and-leads;
dental-and-medical to marketing-and-leads and seo-and-ai-search.

**Topic to Systems** — marketing-and-leads Q16 to automation-and-ai and
data-and-dashboards; seo-and-ai-search Q18 to nothing in systems, it links to Content
Marketing instead.

**Systems to Business** — custom-software and data-and-dashboards to manufacturing.
Q21 is the hinge: it is reached from both directions.

**Everything to services and proof** — every question links 1 to 3 service pages;
industry questions link the case study that proves the claim.

Plus hub to all clusters and back, and one link each way between the hub and
`/resources/faqs`.

**Related questions are declared in frontmatter as full anchor paths and resolved at
build.** A link to a cluster or anchor that does not exist throws, the same discipline
as `content/work/videos.md` throwing on a row with no provider URL. Silent broken
internal links are how a knowledge graph rots.

---

## 8. Astro implementation

### Content

`content/common-questions/<category>/<cluster>.md`, 8 files. Content lives at the repo
root with an explicit glob base, not in `src/content/`. The brief's suggested
`src/content/common-questions/` is wrong for this repo.

One file per **cluster**, not per question. Metadata is frontmatter, prose is body.

```yaml
---
title: "Custom Software: Build, Buy, or Neither"
url: "/common-questions/systems/custom-software"
category: systems          # systems | topics | business
order: 1
seoTitle: "..."
seoDescription: "..."
questions:
  - anchor: does-a-small-business-need-custom-software
    services:
      - /infrastructure/solution-architecture-design
    caseStudies: []
    related:
      - /common-questions/systems/data-and-dashboards#when-to-replace-spreadsheets
---

Lede paragraph, the H4 lede, 2 to 3 sentences.

## Does a small business need custom software?

The direct answer, 40 to 70 words, standing alone.

Detail paragraphs.

## Should we build custom software or use an off-the-shelf platform?
...
```

The direct answer being the first paragraph after the heading reuses the site's
existing rule that the first paragraph of a page's Markdown is the lede. It is a
convention the repo already teaches.

### Collection

Add to `src/content.config.ts`:

```ts
const commonQuestions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/common-questions' }),
  schema: z.object({
    ...pageFields,
    category: z.enum(['systems', 'topics', 'business']),
    questions: z.array(z.object({
      anchor: z.string(),
      services: z.array(z.string()).default([]),
      caseStudies: z.array(z.string()).default([]),
      related: z.array(z.string()).default([]),
    })),
  }),
});
```

`published: false` works here as it does everywhere else, so a cluster can be taken off
the site without deleting it.

### Library

`src/lib/commonQuestions.ts`, one purpose: turn the collection into clusters and
questions, validated.

Exposes: `clusters()`, `cluster(url)`, `questionsIn(cluster)`, `allQuestions()`,
`questionCount()`, and `resolveRelated(question)`.

Throws at build when:

- a `##` heading has no matching frontmatter entry, or an entry has no heading;
- a declared `anchor` does not match the slugified heading;
- a question has no direct answer paragraph;
- a `related` path names a cluster or anchor that does not exist;
- a `services` path is not a real service route;
- a `caseStudies` slug is not a real case study.

Warns, does not throw, when a direct answer falls outside 40 to 70 words. Word count is
editorial, not structural.

### Routes

- `src/pages/common-questions/index.astro` — the hub.
- `src/pages/common-questions/[...path].astro` — clusters, catch-all because the path
  is two segments (`systems/custom-software`).

### Navigation

One row added to `rows` in `src/lib/nav.ts` after Case Studies:

```ts
{ label: 'Common Questions', url: '/common-questions', children: await commonQuestionPages() },
```

Children come from the collection. Never hard-coded, so adding a cluster file adds its
route, its menu entry and its count with no code change.

### Documents to update in the same commit

- `SITEMAP.md` — 9 routes, new totals, no redirects.
- `CLAUDE.md` — current state, route count, and the known gaps table.
- `TEMPLATE-ANATOMY.md` — how the cluster page decomposes, if it diverges from
  `MasterPage`.

### Verification

`npm run check`, then `npm run build`, then `npm run preview`. Not `astro dev`, which
applies neither `_headers` nor `_redirects`. Confirm on the built output: 9 routes
exist, FAQPage `mainEntity` count matches the visible questions per page, every
internal link resolves, one H1 per page.

---

## 9. Writing rules for the 24 answers

Beyond the standing content rules (Canadian English, no em dashes, never "honest", no
filler openers):

1. **Answer first.** The first sentence of the direct answer answers the question. No
   restating the question, no framing.
2. **Standalone.** Each direct answer must make sense lifted out of the page with no
   surrounding context, because that is how it will be quoted.
3. **Define before using.** AEO, business process automation, single source of truth,
   positioning: define on first use in each answer, not once per page.
4. **Objectivity is the credibility.** Q1, Q2 and Q8 must each be able to conclude that
   the existing platform or the spreadsheet is the right answer. If all 24 answers
   conclude "hire us", the section fails at its actual job.
5. **Mention Alive ProStudios as an example of approach, not as a pitch.** At most once
   per answer, and not in every answer.
6. **No framework invention.** One enumerated framework on the site, the
   Brand-to-Revenue Performance System, owned by `/alive-pro/our-system`. No answer
   introduces its own four-part model.
7. **Boutique, not large.** Nothing that reads as a big agency.

---

## 10. Future questions, prioritized

Thirty, in three tiers. Written later, not now.

### Tier 1 — next ten

1. Is video worth the investment for a B2B company? *(closes the execution gap)*
2. What type of marketing works best for a law firm?
3. How can a gym improve member acquisition and retention?
4. What is a customer or dealer portal, and when is one worth building?
5. Can a custom application grow as the business grows?
6. How do you tell whether a company actually needs custom software?
7. What does a brand strategy engagement actually produce?
8. How do you modernize a legacy system without stopping the business?
9. What is a single source of truth, and why does it matter?
10. How much does a website redesign cost?

### Tier 2

11. How long does a rebrand take?
12. What should a manufacturer's website actually do?
13. Is social media marketing worth it for a manufacturer?
14. What is brand voice, and how is it different from tone?
15. How do you measure whether marketing is working?
16. What is a sales funnel, and does every business need one?
17. Can AI write our marketing content?
18. What is the difference between a dashboard and a report?
19. How do you keep a brand consistent when many people produce the work?
20. What does it cost to maintain custom software after launch?

### Tier 3

21. Should a dental practice run its own social media?
22. How do you choose between hiring in-house and working with an agency?
23. What is conversion rate optimization?
24. How do product photography and video affect sales?
25. What is a brand audit?
26. How do you integrate a CRM with an accounting system?
27. What is data migration, and why does it go wrong?
28. Should a small manufacturer invest in an ERP?
29. How do you write content that AI search engines will cite?
30. What is reputation management, and when does a business need it?

Tier 1 exists to close the three holes this round leaves open: no video question, no
law firm, no gym. Tiers 2 and 3 thicken existing clusters rather than spawning new
ones, which is the whole point of the cluster architecture.

---

*Alive ProStudios Inc. — Confidential*
