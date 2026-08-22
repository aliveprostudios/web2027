# Site Structure — Alive ProStudios

Canonical URL map for the Astro rebuild. Generated from the exported content.

Domain: **aliveprostudios.com**
Locale: English only at launch. Architecture should stay i18n-ready
(`/fr/`, `/de/`, `/es/`, `/zh/`, `/ar/` are Phase 2; English carries no prefix).

**Totals:** 28 service pages · 8 Alive Pro pages · 3 blog posts · 26 videos · 63 redirects

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
| `/work/portfolio` | Image gallery | not exported (excluded) |
| `/work/videos` | Video wall | `content/work/videos.md` |
| `/alive-pro` | Alive Pro landing | `content/landing/alive-pro.md` |
| `/resources` | Resources landing | `content/landing/resources.md` |
| `/resources/blog` | Blog index | `content/landing/blog-index.md` |
| `/resources/faqs` | FAQs | `content/faqs.md` |
| `/resources/brochure` | Digital brochure | `content/pages/brochure.md` |
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
| `/alive-pro/our-philosophy` | Our Philosophy | `content/pages/our-philosophy.md` |
| `/alive-pro/our-process` | Our Process | `content/pages/our-process.md` |
| `/alive-pro/partnership` | Partnership | `content/pages/partnership.md` |
| `/alive-pro/precision-impact-sprints` | Precision Impact Sprints | `content/pages/precision-impact-sprints.md` |
| `/alive-pro/testimonials` | Testimonials | `content/pages/testimonials.md` |
| `/alive-pro/what-to-expect` | What to Expect | `content/pages/what-to-expect.md` |
| `/alive-pro/why-alive-pro` | Why Alive Pro | `content/pages/why-alive-pro.md` |

---

## Blog (3)

| URL | Title | Source file |
|---|---|---|
| `/resources/blog/brand-marketing-toronto` | Brand Marketing Toronto | `content/blog/brand-marketing-toronto.md` |
| `/resources/blog/branding-restaurants` | Branding Restaurants | `content/blog/branding-restaurants.md` |
| `/resources/blog/digital-marketing-redefined` | Digital Marketing Redefined | `content/blog/digital-marketing-redefined.md` |

---

## Videos

26 videos on `/work/videos`. Full list with URLs, tags, client and year:
`content/work/videos.md`

Filter tabs come from tags: **Brand Marketing**, **Promotional & Educational**.

---

## Redirects — carry these over

63 permanent redirects from the WordPress era. **These must ship with the Astro
site.** Dropping them discards accumulated SEO equity on the old URLs.

In Astro, set them in `astro.config.mjs` under `redirects`, or at the host.

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
| `/our-philosophy` | `/alive-pro/our-philosophy` | 301 |
| `/what-to-expect` | `/alive-pro/what-to-expect` | 301 |
| `/why-alive-pro-2` | `/alive-pro/why-alive-pro` | 301 |
| `/testimonials` | `/alive-pro/testimonials` | 301 |
| `/precision-impact-sprints` | `/alive-pro/precision-impact-sprints` | 301 |
| `/sprints` | `/alive-pro/precision-impact-sprints` | 301 |
| `/partnership-niu` | `/alive-pro/partnership` | 301 |
| `/partnership-new` | `/alive-pro/partnership` | 301 |
| `/faqs` | `/resources/faqs` | 301 |
| `/digital-brochure` | `/resources/brochure` | 301 |
| `/brand-marketing-blog` | `/resources/blog` | 301 |
| `/branding/online-digital-advertising` | `/resources/blog/online-digital-advertising` | 301 |
| `/branding/a-guide-to-developing-a-successful-brand-architecture` | `/resources/blog/a-guide-to-developing-a-successful-brand-architecture` | 301 |
| `/marketing/7-ways-influencer-marketing-levels-up-your-branding` | `/resources/blog/7-ways-influencer-marketing-levels-up-your-branding` | 301 |
| `/branding/top-5-misconceptions-about-branding` | `/resources/blog/top-5-misconceptions-about-branding` | 301 |
| `/branding/lights-camera-action-unleashing-the-power-of-video-marketing-for-smbs-in-2024` | `/resources/blog/lights-camera-action-unleashing-the-power-of-video-marketing-for-smbs-in-2024` | 301 |
| `/contact-us` | `/contact` | 301 |
| `/request-a-quote` | `/contact` | 301 |
| `/thank-you-sprints` | `/` | 301 |
| `/services-master-template` | `/` | 301 |
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
