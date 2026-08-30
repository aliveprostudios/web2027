---
title: "Blog taxonomy"
caption: ""
source: "authored 2026-08-30"
---

The controlled vocabulary for the Marketing Blog. `npm run blog-tags` reads this
file, scores every post in `content/blog/` against it, and writes `categories`
and `tags` into the post's frontmatter. Nothing is assigned by hand.

Edit the tables and re-run the script. Do not edit `categories` or `tags` in a
post directly: the next run overwrites them.

---

## Categories

**One category per post**, chosen by the highest score. Categories are
navigation, so the list stays short and the entries do not overlap. A category
archive page is generated only for a category that actually has posts, so an
unused row here costs nothing and never produces an empty page.

Match terms are matched at a word boundary, case-insensitively. A term of three
characters or fewer must match a whole word, so `ai` and `crm` behave; a longer
term matches as a prefix, so `differentiat` covers differentiate and
differentiation. A term in the **title** counts 6, in a **heading** 3, in the
**body** 1.

| Category | Match terms |
|---|---|
| Branding | brand, branding, positioning, brand identity, logo, tagline, reputation, trust, promise, differentiat |
| Marketing & Advertising | advertising, campaign, creative, copywriter, messaging, content marketing, media buyer, artificial intelligence, generative, prompt, search engine, ai, tool, quick fix, produce, output, publish |
| Marketing Operations | system, workflow, integration, crm, accounting, supplier, vendor, freelancer, agency, coordination, accountable, handoff, spreadsheet, dashboard, fragmented |
| Lead Generation | lead, enquiry, inquiry, quote, estimate, funnel, conversion, prospect, pipeline, referral |
| Business Growth | growth, scale, revenue, margin, retention, pricing power, compound, profitability, expansion |

---

## Tags

**Three to six tags per post**, every tag scoring above the floor. Tags are
description, not navigation: they carry long-tail search terms and are emitted
as `keywords` on the Article JSON-LD. They do not generate archive pages, which
is deliberate. One post per tag page is thin content and costs more in crawl
quality than it returns.

| Tag | Match terms |
|---|---|
| Brand Strategy | brand strategy, positioning, brand core, differentiat |
| Brand Trust | trust, promise, credibility, reputation, referral |
| Small Business Marketing | small business, mid-sized, small and medium, owner, smb |
| Marketing Strategy | strategy, strategist, plan, diagnosis, audit |
| Marketing Systems | system, spine, integration, workflow, automation, connected |
| CRM & Automation | crm, accounting, automation, quoting, pipeline, software |
| Lead Generation | lead, enquiry, inquiry, quote, estimate, conversion |
| AI Marketing | artificial intelligence, generative, prompt, chatgpt, llm, ai, tool |
| AI Search | answer engine, search engine, google, serp, discoverability |
| Content Marketing | content, article, blog, copy, publishing, editorial |
| Marketing Operations | coordination, accountable, supplier, vendor, handoff, ownership |
| Choosing an Agency | agency, freelancer, in-house, outsourc, hire, supplier |
| Marketing ROI | roi, cost, spend, budget, invoice, saving, expensive |
| Business Growth | growth, scale, revenue, compound, retention |
| Customer Experience | customer, client, experience, service, delivery |
| Brand Consistency | consistent, inconsistency, guideline, off-brand, dilut |
| Digital Marketing | digital marketing, website, social media, online, channel |
| Sales & Marketing Alignment | sales, alignment, quota, handoff, revenue team |
