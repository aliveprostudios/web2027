# Content export

Pulled from Sanity on 2026-08-22. Text only.


**blog/**

The three exported posts were Lorem ipsum placeholders and were deleted
2026-08-30. This folder now holds original posts only, written through the
`blog-writer` skill rather than pulled from Sanity. Live at `/resources/blog`.

`categories` and `tags` in these files are GENERATED. `npm run blog-tags` scores
each post against `content/taxonomy.md` and rewrites both fields, so editing
them here is pointless. Edit the vocabulary instead.

- brand-builds-trust-positioning-sharpens-focus.md
- your-business-already-runs-on-a-system-nobody-designed-it.md
- stop-treating-symptoms-real-growth-starts-with-a-diagnosis.md
- fragmented-marketing-has-a-price-nobody-sends-you-the-bill.md

**taxonomy.md**

The controlled vocabulary for the blog: two Markdown tables, one for categories
and one for tags, each mapping a label to its match terms. Read by
`scripts/blog-taxonomy.mjs`. Not a collection, so it produces no route.

**root/**

- faqs.md
- homepage.md

**pages/**

- about-us.md
- our-philosophy.md  (unpublished 2026-08-25)
- our-process.md
- our-system.md
- partnership.md
- precision-impact-sprints.md
- testimonials.md
- what-to-expect.md
- why-alive-pro.md

**services/execution/**

- ai-generated-production.md
- communication-design.md
- motion-graphics-animation.md
- photography.md
- sales-marketing-collateral.md
- social-media-branding.md
- video-production.md
- web-solutions.md

**services/foundation/**

- brand-name-identity.md
- brand-strategy-positioning.md
- brand-voice.md
- rebranding.md

**services/growth/**

- aeo-answer-engine-optimization.md
- content-marketing.md
- customer-retention-marketing.md
- digital-marketing.md
- lead-generation.md
- marketing-innovation.md
- ongoing-brand-guardianship.md
- reputation-management.md
- sales-funnel-building.md
- seo-search-engine-optimization.md
- social-media-management.md

**services/infrastructure/**

- custom-app-development.md
- dashboards-analytics.md
- intelligent-systems-integration.md
- lifecycle-support.md
- solution-architecture-design.md

**root/**

- site-copy.md
