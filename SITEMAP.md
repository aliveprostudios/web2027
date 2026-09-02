# Site Structure — Alive ProStudios

Canonical URL map for the Astro rebuild. Generated from the exported content.

Domain: **aliveprostudios.com**
Locale: English only at launch. Architecture should stay i18n-ready
(`/fr/`, `/de/`, `/es/`, `/zh/`, `/ar/` are Phase 2; English carries no prefix).

**Totals:** 28 service pages · 7 Alive Pro pages · 4 blog posts · 24 videos · 9 Common Questions routes (24 answers) · 66 redirects

---

## Top level

| URL | Purpose | Content |
|---|---|---|
| `/` | Homepage | `content/homepage.md` |
| `/foundation` | Category landing | `content/landing/foundation.md` |
| `/execution` | Category landing | `content/landing/execution.md` |
| `/growth` | Category landing | `content/landing/growth.md` |
| `/infrastructure` | Category landing | `content/landing/infrastructure.md` |
| `/work` | Work landing | `content/landing/work.md` |
| `/work/portfolio` | Image gallery. Titled **Projects & Campaigns** since 2026-08-25; the route is deliberately unchanged | not exported (excluded) |
| `/work/videos` | Video wall. Titled **Brand Marketing Videos** since 2026-08-25; the route is deliberately unchanged | `content/work/videos.md` |
| `/work/case-studies` | Case Studies index, 10 clients (ASSA ABLOY parked in `content/drafts/case-studies/` 2026-09-02). Its OWN top-level menu row, added after Work on 2026-09-01, despite sitting under `/work` | `content/case-studies/*.md` |
| `/work/case-studies/<slug>` | One per client, 11 routes. Imagery in `content/assets/case-studies/<slug>/`; a missing `hero.jpg` falls back to the shared video, absent `gallery-*` renders no gallery | `content/case-studies/<slug>.md` |
| `/alive-pro` | Alive Pro landing | `content/landing/alive-pro.md` |
| ~~`/resources`~~ | **UNPUBLISHED 2026-08-23.** Resources landing | `content/landing/resources.md` |
| ~~`/resources/blog`~~ | **UNPUBLISHED 2026-08-23.** Blog index | `content/landing/blog-index.md` |
| `/common-questions` | Common Questions hub. **Added 2026-09-01.** Its OWN top-level menu row, after Case Studies. Replaced `/resources/faqs` | `content/common-questions/**/*.md` |
| `/common-questions/<topic>` | 8 topic pages holding 24 anchored questions. Flat since 2026-09-02: no categories, no subfolders, no category routes. The hub lists topics only. Adding a topic is adding a file | `content/common-questions/*.md` |
| ~~`/resources/brochure`~~ | **UNPUBLISHED 2026-08-23.** Digital brochure | `content/pages/brochure.md` |
| `/contact` | Contact form | `content/pages/contact.md` |
| `/thank-you` | Post-submit (noindex) | — |
| `/brand-pulse` | Interactive diagnostic | `content/pages/brand-pulse.md` |
| `/privacy-policy` | Legal | `content/pages/privacy-policy.md` |

---

## Services (29 pages)


### /foundation (4)

| URL | Title | Source file |
|---|---|---|
| `/foundation/brand-name-identity` | Brand Name & Identity | `content/services/foundation/brand-name-identity.md` |
| `/foundation/brand-strategy-positioning` | Brand Strategy & Positioning | `content/services/foundation/brand-strategy-positioning.md` |
| `/foundation/brand-voice` | Brand Voice | `content/services/foundation/brand-voice.md` |
| `/foundation/rebranding` | Rebranding | `content/services/foundation/rebranding.md` |

### /execution (8)

| URL | Title | Source file |
|---|---|---|
| `/execution/ai-generated-production` | AI-Generated Production | `content/services/execution/ai-generated-production.md` |
| `/execution/communication-design` | Communication Design | `content/services/execution/communication-design.md` |
| `/execution/motion-graphics-animation` | Motion Graphics & Animation | `content/services/execution/motion-graphics-animation.md` |
| `/execution/photography` | Photography | `content/services/execution/photography.md` |
| `/execution/sales-marketing-collateral` | Sales & Marketing Collateral | `content/services/execution/sales-marketing-collateral.md` |
| `/execution/social-media-branding` | Social Media Branding | `content/services/execution/social-media-branding.md` |
| `/execution/video-production` | Video Production | `content/services/execution/video-production.md` |
| `/execution/web-solutions` | Web Solutions | `content/services/execution/web-solutions.md` |

### /growth (11)

| URL | Title | Source file |
|---|---|---|
| `/growth/aeo-answer-engine-optimization` | AEO (Answer Engine Optimization) | `content/services/growth/aeo-answer-engine-optimization.md` |
| `/growth/content-marketing` | Content Marketing | `content/services/growth/content-marketing.md` |
| `/growth/customer-retention-marketing` | Customer Retention Marketing | `content/services/growth/customer-retention-marketing.md` |
| `/growth/digital-marketing` | Digital Marketing | `content/services/growth/digital-marketing.md` |
| `/growth/lead-generation` | Lead Generation | `content/services/growth/lead-generation.md` |
| `/growth/marketing-innovation` | Marketing Innovation | `content/services/growth/marketing-innovation.md` |
| `/growth/ongoing-brand-guardianship` | Ongoing Brand Guardianship | `content/services/growth/ongoing-brand-guardianship.md` |
| `/growth/reputation-management` | Reputation Management | `content/services/growth/reputation-management.md` |
| `/growth/sales-funnel-building` | Sales Funnel Building | `content/services/growth/sales-funnel-building.md` |
| `/growth/seo-search-engine-optimization` | SEO (Search Engine Optimization) | `content/services/growth/seo-search-engine-optimization.md` |
| `/growth/social-media-management` | Social Media Management | `content/services/growth/social-media-management.md` |

### /infrastructure (5)

| URL | Title | Source file |
|---|---|---|
| `/infrastructure/custom-app-development` | Custom App Development | `content/services/infrastructure/custom-app-development.md` |
| `/infrastructure/dashboards-analytics` | Dashboards & Analytics | `content/services/infrastructure/dashboards-analytics.md` |
| `/infrastructure/intelligent-systems-integration` | Intelligent Systems Integration | `content/services/infrastructure/intelligent-systems-integration.md` |
| `/infrastructure/lifecycle-support` | LifeCycle Support | `content/services/infrastructure/lifecycle-support.md` |
| `/infrastructure/solution-architecture-design` | Solution Architecture & Design | `content/services/infrastructure/solution-architecture-design.md` |

---

## Alive Pro (8)

| URL | Title | Source file |
|---|---|---|
| `/alive-pro/about-us` | About Us | `content/pages/about-us.md` |
| ~~`/alive-pro/our-philosophy`~~ | **UNPUBLISHED 2026-08-25.** Our Philosophy, removed at Javad's request; its argument now lives in Why Alive Pro | `content/pages/our-philosophy.md` |
| `/alive-pro/our-process` | Our Process | `content/pages/our-process.md` |
| `/alive-pro/our-system` | Our System | `content/pages/our-system.md` |
| `/alive-pro/partnership` | Partnership | `content/pages/partnership.md` |
| ~~`/alive-pro/precision-impact-sprints`~~ | **UNPUBLISHED 2026-08-24.** Precision Impact Sprints, content being revised | `content/pages/precision-impact-sprints.md` |
| `/alive-pro/testimonials` | Testimonials | `content/pages/testimonials.md` |
| `/alive-pro/what-to-expect` | What to Expect | `content/pages/what-to-expect.md` |
| `/alive-pro/why-alive-pro` | Why Alive Pro | `content/pages/why-alive-pro.md` |

---

## Marketing Blog (4)

**RESTORED 2026-08-30.** `/resources` and `/resources/blog` are live again; the
section is titled **Marketing Blog**. `/resources/faqs` was retired 2026-09-01 and
301s to `/common-questions`, which replaced it.
`/resources/brochure` stays parked in `src/pages/_resources/` until its content
is ready, and nothing links to it: its row in `content/landing/resources.md` has
no number line, so `parseLanding` skips it (`src/lib/landing.ts`).

| URL | Title | Source file |
|---|---|---|
| `/resources/blog` | Marketing Blog, the article index | `content/landing/blog-index.md` |
| `/resources/blog/brand-builds-trust-positioning-sharpens-focus` | Brand Builds Trust. Positioning Sharpens Focus. | `content/blog/brand-builds-trust-positioning-sharpens-focus.md` |
| `/resources/blog/your-business-already-runs-on-a-system-nobody-designed-it` | Your Business Already Runs on a System. Nobody Designed It. | `content/blog/your-business-already-runs-on-a-system-nobody-designed-it.md` |
| `/resources/blog/stop-treating-symptoms-real-growth-starts-with-a-diagnosis` | Stop Treating Symptoms. Real Growth Starts With a Diagnosis. | `content/blog/stop-treating-symptoms-real-growth-starts-with-a-diagnosis.md` |
| `/resources/blog/fragmented-marketing-has-a-price-nobody-sends-you-the-bill` | Fragmented Marketing Has a Price. Nobody Sends You the Bill. | `content/blog/fragmented-marketing-has-a-price-nobody-sends-you-the-bill.md` |

> The three Sanity-era posts (Brand Marketing Toronto, Branding Restaurants,
> Digital Marketing Redefined) were **deleted 2026-08-30** at Javad's request.
> All three were Lorem ipsum placeholders and none of them ever shipped. Nothing
> redirected to them, so no redirect row changed. `content/blog/` now holds only
> original posts written through the `blog-writer` skill.

---

## Videos

24 videos on `/work/videos`. Two were removed on 2026-08-25. Full list with URLs,
tags, client and year: `content/work/videos.md`

Filter tabs come from tags: **Brand Marketing**, **Promotional & Educational**.

---

## Redirects — carry these over

63 permanent redirects from the WordPress era. **These must ship with the Astro
site.** Dropping them discards accumulated SEO equity on the old URLs.

In Astro, set them in `astro.config.mjs` under `redirects`, or at the host.

> **Resources came back in part on 2026-08-30.** `/resources` and
> `/resources/blog` are live, so six of the eight rows that had been parked at
> `/` now point at real pages again: `/brand-marketing-blog` and the five
> `/branding/*` and `/marketing/*` rows all land on `/resources/blog`.
>
> Those five originally pointed at WordPress posts that were never migrated, so
> there is no per-post target to restore and there never will be. The blog index
> is the right destination: it is topically what the visitor asked for, which a
> 301 to the homepage was not.
>
> **One row is still parked at `/`:** `/digital-brochure`. `/faqs` now points at
> `/common-questions`, as does `/resources/faqs`, retired the same day.
> Restore `/digital-brochure` to `/resources/brochure` in the same commit that
> unparks that route from `src/pages/_resources/`. A 301 to a 404 is worse
> than a 301 to the homepage, so the redirect and the route must move together.


### WordPress archive URLs, added 2026-08-23

Pulled from the OLD site's live Yoast sitemap (`sitemap_index.xml`, 84 URLs) and
diffed against this map. 65 were already covered; the 19 below were not and would
have 404'd the moment DNS cut over. `/portfolio` was the costly one: a top-level
page with years of equity pointing at it.

Tag and category archives have no equivalent here, so each points at the pillar
or service page closest to its subject rather than at the homepage, which
preserves more of the signal. Adjust any row whose mapping reads wrong.

`/sitemap_index.xml` is the old Yoast sitemap. Google Search Console has it
registered and keeps polling it, so it redirects to the real one rather than
starting to 404 on cutover. Its child sitemaps (`post-sitemap.xml` and the rest)
are only ever discovered through that index, so redirecting the index is enough.

| From | To | Code |
|---|---|---|
| `/home` | `/` | 301 |
| `/brand-strategy-positioning` | `/foundation/brand-strategy-positioning` | 301 |
| `/brand-name-identity` | `/foundation/brand-name-identity` | 301 |
| `/brand-voice` | `/foundation/brand-voice` | 301 |
| `/rebranding` | `/foundation/rebranding` | 301 |
| `/branding` | `/foundation` | 301 |
| `/communication-design` | `/execution/communication-design` | 301 |
| `/web-solutions` | `/execution/web-solutions` | 301 |
| `/sales-marketing-collateral` | `/execution/sales-marketing-collateral` | 301 |
| `/video-production` | `/execution/video-production` | 301 |
| `/motion-graphics-animation` | `/execution/motion-graphics-animation` | 301 |
| `/photography-services` | `/execution/photography` | 301 |
| `/ai-generated-production` | `/execution/ai-generated-production` | 301 |
| `/social-media-branding` | `/execution/social-media-branding` | 301 |
| `/sales-funnel-building` | `/growth/sales-funnel-building` | 301 |
| `/digital-marketing` | `/growth/digital-marketing` | 301 |
| `/lead-generation-old` | `/growth/lead-generation` | 301 |
| `/content-marketing` | `/growth/content-marketing` | 301 |
| `/marketing-innovation` | `/growth/marketing-innovation` | 301 |
| `/ongoing-brand-guardianship` | `/growth/ongoing-brand-guardianship` | 301 |
| `/social-media-management` | `/growth/social-media-management` | 301 |
| `/customer-retention-marketing` | `/growth/customer-retention-marketing` | 301 |
| `/reputation-management` | `/growth/reputation-management` | 301 |
| `/aeo-answer-engine-optimization` | `/growth/aeo-answer-engine-optimization` | 301 |
| `/seo-search-engine-optimization` | `/growth/seo-search-engine-optimization` | 301 |
| `/marketing-company-near-me` | `/growth` | 301 |
| `/solution-architecture-design` | `/infrastructure/solution-architecture-design` | 301 |
| `/custom-app-development` | `/infrastructure/custom-app-development` | 301 |
| `/intelligent-systems-integration` | `/infrastructure/intelligent-systems-integration` | 301 |
| `/dashboards-analytics` | `/infrastructure/dashboards-analytics` | 301 |
| `/lifecycle-support` | `/infrastructure/lifecycle-support` | 301 |
| `/system-design-development` | `/infrastructure/solution-architecture-design` | 301 |
| `/ai-business-enablement` | `/infrastructure` | 301 |
| `/reels` | `/work/videos` | 301 |
| `/work/reels` | `/work/videos` | 301 |
| `/gallery` | `/work/portfolio` | 301 |
| `/portfolio-brand-identity-design` | `/work/portfolio` | 301 |
| `/videos-production-work` | `/work/videos` | 301 |
| `/photography-work` | `/work/portfolio` | 301 |
| `/3d-projects` | `/work/portfolio` | 301 |
| `/about-us` | `/alive-pro/about-us` | 301 |
| `/our-process` | `/alive-pro/our-process` | 301 |
| `/our-philosophy` | `/alive-pro/why-alive-pro` | 301 |
| `/alive-pro/our-philosophy` | `/alive-pro/why-alive-pro` | 301 |
| `/what-to-expect` | `/alive-pro/what-to-expect` | 301 |
| `/why-alive-pro-2` | `/alive-pro/why-alive-pro` | 301 |
| `/testimonials` | `/alive-pro/testimonials` | 301 |
| `/precision-impact-sprints` | `/alive-pro/precision-impact-sprints` | 301 |
| `/sprints` | `/alive-pro/precision-impact-sprints` | 301 |
| `/alive-pro/precision-impact-sprints` | `/alive-pro` | 302 |
| `/partnership-niu` | `/alive-pro/partnership` | 301 |
| `/partnership-new` | `/alive-pro/partnership` | 301 |
| `/faqs` | `/common-questions` | 301 |
| `/resources/faqs` | `/common-questions` | 301 |
| `/digital-brochure` | `/` | 301 |
| `/brand-marketing-blog` | `/resources/blog` | 301 |
| `/branding/online-digital-advertising` | `/resources/blog` | 301 |
| `/branding/a-guide-to-developing-a-successful-brand-architecture` | `/resources/blog` | 301 |
| `/marketing/7-ways-influencer-marketing-levels-up-your-branding` | `/resources/blog` | 301 |
| `/branding/top-5-misconceptions-about-branding` | `/resources/blog` | 301 |
| `/branding/lights-camera-action-unleashing-the-power-of-video-marketing-for-smbs-in-2024` | `/resources/blog` | 301 |
| `/contact-us` | `/contact` | 301 |
| `/request-a-quote` | `/contact` | 301 |
| `/thank-you-sprints` | `/` | 301 |
| `/services-master-template` | `/` | 301 |
| `/portfolio` | `/work/portfolio` | 301 |
| `/portfolio/3d` | `/work/portfolio` | 301 |
| `/portfolio-category/photography` | `/execution/photography` | 301 |
| `/portfolio-tag/3d` | `/work/portfolio` | 301 |
| `/portfolio-tag/commercial` | `/work/portfolio` | 301 |
| `/portfolio-tag/lifestyle` | `/work/portfolio` | 301 |
| `/portfolio-tag/product` | `/work/portfolio` | 301 |
| `/portfolio-tag/product-photography` | `/execution/photography` | 301 |
| `/portfolio-tag/residential` | `/work/portfolio` | 301 |
| `/category/branding` | `/foundation` | 301 |
| `/category/marketing` | `/growth` | 301 |
| `/tag/brand-identity-name-creation-services` | `/foundation/brand-name-identity` | 301 |
| `/tag/branding-services` | `/foundation` | 301 |
| `/tag/digital-marketing` | `/growth/digital-marketing` | 301 |
| `/tag/google-ad-campaigns` | `/growth/digital-marketing` | 301 |
| `/tag/integrated-marketing-services` | `/growth` | 301 |
| `/tag/marketing` | `/growth` | 301 |
| `/author/admin` | `/alive-pro/about-us` | 301 |
| `/locations.kml` | `/contact` | 301 |
| `/sitemap_index.xml` | `/sitemap-index.xml` | 301 |
| `/alive-template` | `/` | 301 |

---

## Notes

- **Coverage: 51 of 52 live URLs have content.** The only gap is `/work/portfolio`,
  excluded on purpose. Portfolio items (94) and images (165, 122MB) remain in Sanity.
- `content/landing/` holds copy for the 7 category landing pages plus the blog
  index. This copy was **hardcoded in React components**, never in the CMS, so it
  was recovered from the rendered live site. Re-read it before reuse.
- `/privacy-policy` (1,159 words) was likewise hardcoded. It still needs the legal
  review that was outstanding on the old site.
- `homepage.md` exports as structured field dumps rather than prose, because the
  old homepage was assembled from page-builder blocks.
