# Redirect map for the old WordPress addresses

Drafted 2026-11-15 from the site audit and the independent Codex audit. **Approved by Javad 2026-11-15 and applied to `SITEMAP.md` on staging.** Not in production until `main` is pushed.

## Where the addresses came from

- **Internet Archive**, collected by Codex: 546 addresses the archive recorded as live pages on the old site between 2015 and 2026. 487 of them returned 404 (472 distinct paths once query strings are dropped, since `_redirects` ignores the query string).
- **Google Search Console**, "Not found (404)" report, 8 November 2026: 28 addresses, 2 of them not in the archive (`/rebranding-services-2/`, `/digital-marketing-2/`).
- Together: **474 distinct dead paths.**

## What happens to each

| Outcome | Paths |
|---|---|
| One-to-one redirect | 149 |
| Caught by a wildcard | 260 |
| Left as 404 on purpose | 65 |
| Unaccounted for | 0 |

## Rules the map follows

- **Closest current page, never the home page by default.** The home page is used only where the old page was itself about the home page (`/index.php`, `/branding-company-toronto`).
- **Existing decisions are reused.** Old blog posts go to `/resources/blog` because no post was migrated, the same as the six old posts already redirected there. Tags and categories go to the matching section, as the existing tag rules do. Old philosophy pages go to Why Alive Pro, as `/our-philosophy` already does.
- **Theme demos, test pages and system paths stay 404.** They were never Alive ProStudios content, and redirecting them would tell Google they were.
- **Every destination is a live page** in today's sitemap, no source duplicates a rule that existed before today, and no wildcard sits over a live page. Checked by script, not by eye.

## Cloudflare and wildcard order

**Cloudflare does not honour file order between overlapping wildcards.** Measured on staging 2026-11-15: `/blog/*` won over a narrower `/blog/portfolio-item/*` listed above it, while `wrangler dev` honoured the order and passed. Exact rows do beat wildcards on Cloudflare. So no wildcard may overlap another one, and an address that needs a different destination from a broader wildcard gets an exact row. Test redirects on staging, not only in the local preview. The first staging push had three narrower `/blog/portfolio-*` wildcards above `/blog/*`; the 55 addresses they were meant to catch went to the blog index instead of the portfolio. They are now exact rows.

## Rule count

92 existing + 149 new one-to-one = 241 rows, 482 rules with slash twins, plus 9 wildcards: **250 rows, 491 rules.** Cloudflare allows 2,000 static and 100 dynamic rules.

---

<!-- BEGIN block as applied at the end of SITEMAP.md -->

## Old WordPress addresses, 2026-11-15

Found by the 2026-11-15 audit. The 2026-09 tables were built from the WordPress export and from Search Console, which together missed most of what the old site had published over eleven years. Codex collected 546 addresses from the Internet Archive and 487 returned 404; these rows cover every one that was Alive ProStudios content. Theme demo pages (`/redmond/*` and similar), test pages, date archives and system paths were left as 404 on purpose. Each destination was checked to exist in the build before being written here. Full reasoning: `docs/audits/2026-11-15/redirect-map.md`.

### Old service pages

| From | To | Code |
|---|---|---|
| `/services/branding/brand-architecture` | `/foundation/brand-strategy-positioning` | 301 |
| `/services/branding/our-brand-architecture` | `/foundation/brand-strategy-positioning` | 301 |
| `/services/branding/creative-strategy-art-direction` | `/foundation/brand-strategy-positioning` | 301 |
| `/services/branding/corporate-identity-design` | `/foundation/brand-name-identity` | 301 |
| `/services/branding/name-development-process` | `/foundation/brand-name-identity` | 301 |
| `/services/branding/content-and-message-development` | `/foundation/brand-voice` | 301 |
| `/services/branding/re-branding-process` | `/foundation/rebranding` | 301 |
| `/services/branding/integrated-branding-services` | `/foundation` | 301 |
| `/services/branding/packaging-design-services` | `/execution/communication-design` | 301 |
| `/services/branding/trade-show-design-services` | `/execution/sales-marketing-collateral` | 301 |
| `/services/branding/ui-design-services` | `/execution/web-solutions` | 301 |
| `/services/marketing/lead-generation` | `/growth/lead-generation` | 301 |
| `/services/marketing/marketing-consulting` | `/growth` | 301 |
| `/services/motion-media/video-production-services` | `/execution/video-production` | 301 |
| `/services/motion-media/corporate-video-production` | `/execution/video-production` | 301 |
| `/services/motion-media/training-video-production` | `/execution/video-production` | 301 |
| `/services/motion-media/tv-infomercial-production-services` | `/execution/video-production` | 301 |
| `/services/motion-media/post-production-services` | `/execution/video-production` | 301 |
| `/services/motion-media/photography` | `/execution/photography` | 301 |
| `/services/online-media/custom-web-design-services` | `/execution/web-solutions` | 301 |
| `/services/online-media/custom-web-applications` | `/infrastructure/custom-app-development` | 301 |
| `/services/online-media/seo-services` | `/growth/seo-search-engine-optimization` | 301 |
| `/services/online-media/social-media-marketing` | `/growth/social-media-management` | 301 |
| `/services/print-media/print-design-services` | `/execution/sales-marketing-collateral` | 301 |
| `/services/print-media/specialty-printing-services` | `/execution/sales-marketing-collateral` | 301 |

### Old top-level service pages

| From | To | Code |
|---|---|---|
| `/lead-generation` | `/growth/lead-generation` | 301 |
| `/photography` | `/execution/photography` | 301 |
| `/brand-identity` | `/foundation/brand-name-identity` | 301 |
| `/visual-identity` | `/foundation/brand-name-identity` | 301 |
| `/verbal-identity` | `/foundation/brand-voice` | 301 |
| `/brand-voice-tone` | `/foundation/brand-voice` | 301 |
| `/brand-experience-2` | `/foundation` | 301 |
| `/strategic-brand-consulting` | `/foundation/brand-strategy-positioning` | 301 |
| `/rebranding-services` | `/foundation/rebranding` | 301 |
| `/rebranding-services-2` | `/foundation/rebranding` | 301 |
| `/digital-advertising` | `/growth/digital-marketing` | 301 |
| `/digital-marketing-2` | `/growth/digital-marketing` | 301 |
| `/integrated-marketing` | `/growth` | 301 |
| `/strategic-marketing-plan` | `/growth` | 301 |
| `/cro-conversion-sales-optimization` | `/growth/sales-funnel-building` | 301 |
| `/social-media-marketing` | `/growth/social-media-management` | 301 |
| `/sales-marketing-tools` | `/execution/sales-marketing-collateral` | 301 |
| `/design-creative-problem-solving` | `/execution/communication-design` | 301 |
| `/video-motion` | `/execution/video-production` | 301 |
| `/web-ecommerce` | `/execution/web-solutions` | 301 |
| `/3d-modeling` | `/work/portfolio` | 301 |
| `/brand-marketing` | `/services` | 301 |
| `/our-services` | `/services` | 301 |
| `/what-we-do` | `/services` | 301 |
| `/branding-company-toronto` | `/` | 301 |

### Old company pages

| From | To | Code |
|---|---|---|
| `/about-us/company` | `/alive-pro/about-us` | 301 |
| `/about-us/achievements` | `/alive-pro/about-us` | 301 |
| `/about-us/the-winning-team` | `/alive-pro/about-us` | 301 |
| `/about-us/our-process` | `/alive-pro/our-process` | 301 |
| `/about-us/our-philosophy` | `/alive-pro/why-alive-pro` | 301 |
| `/about-us/our-clients` | `/work/case-studies` | 301 |
| `/about-us/contact-us` | `/contact` | 301 |
| `/about-us/request-form` | `/contact` | 301 |
| `/index.php/about-us/company` | `/alive-pro/about-us` | 301 |
| `/about-me` | `/alive-pro/about-us` | 301 |
| `/about-us2` | `/alive-pro/about-us` | 301 |
| `/our-team` | `/alive-pro/about-us` | 301 |
| `/javad-7` | `/alive-pro/about-us` | 301 |
| `/our-structured-process` | `/alive-pro/our-process` | 301 |
| `/our-4-philosophy-pillars` | `/alive-pro/why-alive-pro` | 301 |
| `/why-alive-prostudios` | `/alive-pro/why-alive-pro` | 301 |
| `/whyalivepro/why-alive-pro` | `/alive-pro/why-alive-pro` | 301 |
| `/whyalivepro/serious-about-growing` | `/alive-pro/why-alive-pro` | 301 |
| `/whyalivepro/videos` | `/work/videos` | 301 |
| `/results/expectations` | `/alive-pro/what-to-expect` | 301 |
| `/results/testimonials` | `/alive-pro/testimonials` | 301 |
| `/faq-page` | `/common-questions` | 301 |

### Clients and work

| From | To | Code |
|---|---|---|
| `/lawrence-hardware` | `/work/case-studies/lawrence-hardware` | 301 |
| `/vitality-dentistry` | `/work/case-studies/vitality-dentistry` | 301 |
| `/alfred-locks-international` | `/work/case-studies/alfred-smart-locks` | 301 |
| `/our-clients` | `/work/case-studies` | 301 |
| `/recent-projects` | `/work` | 301 |
| `/mulberrys-oven` | `/work/portfolio` | 301 |
| `/demo-reel` | `/work/videos` | 301 |
| `/html/showcase/videos/infomercials/1.html` | `/work/videos` | 301 |

### Enquiry routes

| From | To | Code |
|---|---|---|
| `/get-in-touch` | `/contact` | 301 |
| `/start-a-project` | `/contact` | 301 |
| `/getting-started` | `/contact` | 301 |

### Old blog posts

| From | To | Code |
|---|---|---|
| `/7-ways-influencer-marketing-levels-up-your-branding-2` | `/resources/blog` | 301 |
| `/a-guide-to-developing-a-successful-brand-architecture` | `/resources/blog` | 301 |
| `/top-5-misconceptions-about-branding` | `/resources/blog` | 301 |
| `/blog` | `/resources/blog` | 301 |
| `/branding-blog` | `/resources/blog` | 301 |

### Tag and category pages

| From | To | Code |
|---|---|---|
| `/tag/alive-prostudios` | `/alive-pro` | 301 |
| `/tag/branding` | `/foundation` | 301 |
| `/tag/digital-advertising` | `/growth/digital-marketing` | 301 |
| `/tag/marketing-company` | `/growth` | 301 |
| `/category/branding-marketing` | `/services` | 301 |

### Other

| From | To | Code |
|---|---|---|
| `/index.php` | `/` | 301 |

### Old theme portfolio items under /blog

Exact rows, not a wildcard: see the Cloudflare note under Wildcards.

| From | To | Code |
|---|---|---|
| `/blog/portfolio-category/all` | `/work/portfolio` | 301 |
| `/blog/portfolio-category/b2b` | `/work/portfolio` | 301 |
| `/blog/portfolio-category/b2c` | `/work/portfolio` | 301 |
| `/blog/portfolio-item` | `/work/portfolio` | 301 |
| `/blog/portfolio-item/10` | `/work/portfolio` | 301 |
| `/blog/portfolio-item/11` | `/work/portfolio` | 301 |
| `/blog/portfolio-item/13` | `/work/portfolio` | 301 |
| `/blog/portfolio-item/14` | `/work/portfolio` | 301 |
| `/blog/portfolio-item/15` | `/work/portfolio` | 301 |
| `/blog/portfolio-item/16` | `/work/portfolio` | 301 |
| `/blog/portfolio-item/17` | `/work/portfolio` | 301 |
| `/blog/portfolio-item/18` | `/work/portfolio` | 301 |
| `/blog/portfolio-item/19` | `/work/portfolio` | 301 |
| `/blog/portfolio-item/2` | `/work/portfolio` | 301 |
| `/blog/portfolio-item/20` | `/work/portfolio` | 301 |
| `/blog/portfolio-item/22` | `/work/portfolio` | 301 |
| `/blog/portfolio-item/23` | `/work/portfolio` | 301 |
| `/blog/portfolio-item/24` | `/work/portfolio` | 301 |
| `/blog/portfolio-item/24-2` | `/work/portfolio` | 301 |
| `/blog/portfolio-item/26` | `/work/portfolio` | 301 |
| `/blog/portfolio-item/27` | `/work/portfolio` | 301 |
| `/blog/portfolio-item/28` | `/work/portfolio` | 301 |
| `/blog/portfolio-item/29` | `/work/portfolio` | 301 |
| `/blog/portfolio-item/3` | `/work/portfolio` | 301 |
| `/blog/portfolio-item/31` | `/work/portfolio` | 301 |
| `/blog/portfolio-item/32` | `/work/portfolio` | 301 |
| `/blog/portfolio-item/33` | `/work/portfolio` | 301 |
| `/blog/portfolio-item/34` | `/work/portfolio` | 301 |
| `/blog/portfolio-item/4` | `/work/portfolio` | 301 |
| `/blog/portfolio-item/5` | `/work/portfolio` | 301 |
| `/blog/portfolio-item/6` | `/work/portfolio` | 301 |
| `/blog/portfolio-item/6140` | `/work/portfolio` | 301 |
| `/blog/portfolio-item/7` | `/work/portfolio` | 301 |
| `/blog/portfolio-item/8` | `/work/portfolio` | 301 |
| `/blog/portfolio-item/9` | `/work/portfolio` | 301 |
| `/blog/portfolio-item/c1` | `/work/portfolio` | 301 |
| `/blog/portfolio-item/c10` | `/work/portfolio` | 301 |
| `/blog/portfolio-item/c11` | `/work/portfolio` | 301 |
| `/blog/portfolio-item/c12` | `/work/portfolio` | 301 |
| `/blog/portfolio-item/c13` | `/work/portfolio` | 301 |
| `/blog/portfolio-item/c14` | `/work/portfolio` | 301 |
| `/blog/portfolio-item/c15` | `/work/portfolio` | 301 |
| `/blog/portfolio-item/c17` | `/work/portfolio` | 301 |
| `/blog/portfolio-item/c18` | `/work/portfolio` | 301 |
| `/blog/portfolio-item/c19` | `/work/portfolio` | 301 |
| `/blog/portfolio-item/c2` | `/work/portfolio` | 301 |
| `/blog/portfolio-item/c3` | `/work/portfolio` | 301 |
| `/blog/portfolio-item/c4` | `/work/portfolio` | 301 |
| `/blog/portfolio-item/c5` | `/work/portfolio` | 301 |
| `/blog/portfolio-item/c6` | `/work/portfolio` | 301 |
| `/blog/portfolio-item/c7` | `/work/portfolio` | 301 |
| `/blog/portfolio-item/c8` | `/work/portfolio` | 301 |
| `/blog/portfolio-item/c9` | `/work/portfolio` | 301 |
| `/blog/portfolio-tag/b2b` | `/work/portfolio` | 301 |
| `/blog/portfolio-tag/b2c` | `/work/portfolio` | 301 |

### Wildcards (keep this table LAST)

**Cloudflare does not honour file order between overlapping wildcards.** Measured on staging 2026-11-15: `/blog/*` won over a narrower `/blog/portfolio-item/*` listed above it, while `wrangler dev` honoured the order and passed. Exact rows do beat wildcards on Cloudflare. So no wildcard may overlap another one, and an address that needs a different destination from a broader wildcard gets an exact row. Test redirects on staging, not only in the local preview. `postbuild.mjs` gives wildcard rows no trailing-slash twin.

| From | To | Code |
|---|---|---|
| `/blog/*` | `/resources/blog` | 301 |
| `/branding-blog/*` | `/resources/blog` | 301 |
| `/portfolio/*` | `/work/portfolio` | 301 |
| `/portfolio-item/*` | `/work/portfolio` | 301 |
| `/portfolio-category/*` | `/work/portfolio` | 301 |
| `/portfolio-tag/*` | `/work/portfolio` | 301 |
| `/getting-started/*` | `/contact` | 301 |
| `/services/*` | `/services` | 301 |
| `/about-us/*` | `/alive-pro/about-us` | 301 |

<!-- END block -->

---

## Notes on individual rows

| From | To | Why |
|---|---|---|
| `/services/branding/packaging-design-services` | `/execution/communication-design` | No packaging page; closest design service |
| `/brand-experience-2` | `/foundation` | Archived title: Brand Experience |
| `/rebranding-services-2` | `/foundation/rebranding` | From Search Console |
| `/digital-advertising` | `/growth/digital-marketing` | Archived title: Digital Advertising |
| `/digital-marketing-2` | `/growth/digital-marketing` | From Search Console |
| `/3d-modeling` | `/work/portfolio` | Matches the existing /3d-projects rule |
| `/what-we-do` | `/services` | Same name as the new page |
| `/branding-company-toronto` | `/` | The home page is titled Brand Transformation Agency in Toronto |
| `/about-us/our-philosophy` | `/alive-pro/why-alive-pro` | Matches the existing /our-philosophy rule |
| `/javad-7` | `/alive-pro/about-us` | Archived title: Javad 7 |
| `/our-4-philosophy-pillars` | `/alive-pro/why-alive-pro` | Our Philosophy already redirects here |
| `/faq-page` | `/common-questions` | Matches the existing /faqs rule |
| `/lawrence-hardware` | `/work/case-studies/lawrence-hardware` | Same client, now a case study |
| `/vitality-dentistry` | `/work/case-studies/vitality-dentistry` | Same client, now a case study |
| `/alfred-locks-international` | `/work/case-studies/alfred-smart-locks` | Same client, now a case study |
| `/mulberrys-oven` | `/work/portfolio` | Archived title: Mulberry's Oven, a portfolio piece |
| `/html/showcase/videos/infomercials/1.html` | `/work/videos` | 2016 infomercial showcase |
| `/getting-started` | `/contact` | Its sub-pages are covered by a wildcard |
| `/blog` | `/resources/blog` | Its sub-pages are covered by a wildcard |
| `/branding-blog` | `/resources/blog` | Its sub-pages are covered by a wildcard |
| `/tag/branding` | `/foundation` | Matches /tag/branding-services |
| `/tag/digital-advertising` | `/growth/digital-marketing` | Matches /tag/digital-marketing |
| `/tag/marketing-company` | `/growth` | Matches /tag/marketing |
| `/category/branding-marketing` | `/services` | Spans both /category/branding and /category/marketing |
| `/index.php` | `/` | WordPress's address for the home page |
| `/blog/*` | `/resources/blog` | Old posts, tags, authors and archives; no post was migrated |
| `/branding-blog/*` | `/resources/blog` | The 2018 blog, its posts, tags and calendar |
| `/portfolio/*` | `/work/portfolio` | /portfolio and /portfolio/3d already go there |
| `/portfolio-category/*` | `/work/portfolio` | The existing /portfolio-category/photography rule still wins |
| `/portfolio-tag/*` | `/work/portfolio` | The existing tag rules still win |
| `/getting-started/*` | `/contact` | Every page was a route into an enquiry |
| `/services/*` | `/services` | Safety net after the 25 one-to-one rows |
| `/about-us/*` | `/alive-pro/about-us` | Safety net after the 8 one-to-one rows |

## Wildcard coverage

| Wildcard | Dead paths it catches |
|---|---|
| `/blog/*` | 23 |
| `/branding-blog/*` | 23 |
| `/portfolio/*` | 144 |
| `/portfolio-item/*` | 38 |
| `/portfolio-category/*` | 15 |
| `/portfolio-tag/*` | 5 |
| `/getting-started/*` | 12 |
| `/services/*` | 0 |
| `/about-us/*` | 0 |

`/services/*` and `/about-us/*` catch nothing today: every known address under them has a one-to-one row. They are a safety net for addresses the archive never captured.

## Left as 404 on purpose

**Date archives** (4): `/2019/01/`, `/2020/06/`, `/2022/05/`, `/2024/01/`

**Theme demo pages** (9): `/bella/`, `/industry-home/`, `/interactive-columns/`, `/landing/`, `/metallurgy-home/`, `/oil-industry/`, `/service-table/`, `/split-slider-showcase/`, `/tabs/`

**Theme placeholder posts (lorem ipsum slugs)** (4): `/branding/amet-commodo-nulla-facilisi-vehicula-ipsum/`, `/branding/massa-ultricies-hendrerit-dolor-magna/`, `/branding/urnaneque-viverra-justo-ultrices-sapieneget/`, `/marketing/tristique-magna-amet-purus-gravida-quisblandit/`

**WordPress, Joomla and Cloudflare system paths** (4): `/cdn-cgi/l/email-protection`, `/component/users/`, `/ct_content_block/c2a-4-pages/`, `/wp-content/plugins/litespeed-cache/guest.vary.php`

**WordPress theme demo site (39 pages)** (41): `/redmond/`, `/redmond/index.php`, `/redmond/index.php/insider-tips`, `/redmond/index.php/local-cuisine`, `/redmond/index.php/our-advantage/about-us`, `/redmond/index.php/our-advantage/explore`, `/redmond/index.php/our-advantage/why-redmond`, `/redmond/index.php/products/rmc-m110a`, `/redmond/index.php/products/rmc-m150a`, `/redmond/index.php/products/rmc-m190a`, `/redmond/index.php/products/rmc-m23a`, `/redmond/index.php/products/rmc-m4502a`, `/redmond/index.php/products/rmc-m4506a`, `/redmond/index.php/products/rmc-m90a`, `/redmond/index.php/recipes`, `/redmond/index.php/recipes/appetizers`, `/redmond/index.php/recipes/bread`, `/redmond/index.php/recipes/cheese`, `/redmond/index.php/recipes/cultured-milk-products`, `/redmond/index.php/recipes/desserts`, `/redmond/index.php/recipes/drinks`, `/redmond/index.php/recipes/fondue`, `/redmond/index.php/recipes/fried`, `/redmond/index.php/recipes/main-course`, `/redmond/index.php/recipes/oatmeal`, `/redmond/index.php/recipes/pastries`, `/redmond/index.php/recipes/popcorn`, `/redmond/index.php/recipes/preserved-food`, `/redmond/index.php/recipes/salad`, `/redmond/index.php/recipes/side-dishes`, `/redmond/index.php/recipes/soup`, `/redmond/index.php/recipes/steamed`, `/redmond/index.php/shop`, `/redmond/index.php/support/contact-us`, `/redmond/index.php/support/faq`, `/redmond/index.php/support/manuals`, `/redmond/index.php/support/online-form`, `/redmond/index.php/support/return-policy`, `/redmond/index.php/support/warranty-information`, `/redmond/index.php/the-right-equipment`, `/redmond/index.php/videos`

**Test pages** (3): `/test-headings/`, `/test-homayra/`, `/test/`
