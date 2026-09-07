# Tasks

## Active

- [ ] **Build the /services landing page** - Alive ProStudios site, Javad's plan for the week of 2026-09-07
  - Javad's call 2026-09-06: he wants a real landing page at `https://aliveprostudios.com/services`. There is no content and no page today.
  - **`/services` currently returns a 302** to `/alive-pro/our-system`, deliberately, not a 301. A 301 is permanent and browsers cache it hard, so returning visitors would keep being bounced off the new page after it shipped. Same reasoning as the existing `/precision-impact-sprints` and `/sprints` chains.
  - **Delete the `/services` row from the redirect table in SITEMAP.md when the page ships. Do not repoint it.** The row carries a comment saying so.
  - Google has been crawling `/services/` and getting a 404 since launch, so the URL has history worth landing on something real.

- [ ] **Filter bot traffic out of GA4** - Alive ProStudios site, raised 2026-09-06
  - Measured 2026-09-06: of 297 active users in 7 days, **Singapore 148 and Vietnam 49**, against Canada 26 and Toronto 7. Direct accounted for 304 of roughly 347 sessions. Organic search was 6.
  - Until this is filtered every number in GA4 is meaningless, including the conversion rate that the new `Form_Thank_You` key event will start producing.
  - This is separate from the staging-traffic gap: that one is internal traffic, this one is external bots.

- [ ] **Find out why the 404 page is the most-viewed page on the site** - Alive ProStudios site, raised 2026-09-06
  - "Page not found | Alive ProStudios" took **163 views in 7 days, up 1,382%**, more than the homepage at 110.
  - The 2026-09-06 trailing-slash fix should account for a large share of it: every one of the 86 redirects was 404ing when the URL ended in a slash, which is the form WordPress published. **Re-check the number before investigating further**; it may have largely resolved itself.
  - If it has not, find the actual paths in GA4 under Pages and screens by page path, not page title.

- [ ] **Decide on the two unused GTM containers** - Alive ProStudios site, raised 2026-09-06
  - The Alive ProStudios account holds three containers. Only `GTM-PJLQRZC` is on the site.
  - `GTM-KRVGH63H` is a SERVER container and `GTM-P2NFJT` is the old `www` web container from before 2022. Both appear **0 times** in the live HTML, and no server-side tagging endpoint is configured, so both are provably inert.
  - Deleting a GTM container is irreversible, so it was deliberately left to Javad. Nothing breaks either way.

- [ ] **Consider a Search Console Domain property** - Alive ProStudios site, raised 2026-09-06
  - The current property is **URL-prefix** `https://aliveprostudios.com/`, verified through Google Analytics or Tag Manager rather than DNS (there is no `google-site-verification` TXT record, only Microsoft's `MS=ms79490828` and SPF).
  - A URL-prefix property does not cover `https://www.` or `http://`. That cost nothing while www returned 522, but **www has redirected properly since 2026-09-06**, so a Domain property would now consolidate everything in one report.
  - A Domain property needs a DNS TXT record, which means touching Cloudflare DNS. The existing Microsoft records must not be disturbed.


- [ ] **Four analytics measurement gaps** - Alive ProStudios site, measured 2026-09-06, scheduled for week of 2026-09-07
  - **See `ANALYTICS.md` in the repo root for the full audit**: every account ID, all ten open items ranked, and a "read this first" section for the Google Ads work starting October 2026. The two highest-value fixes are GTM trigger changes that restore conversion tracking outright.
  - All four were measured against production, not read off code. What IS working: GTM `GTM-PJLQRZC` loads, GA4 `G-L9G3DSQCJQ` sends `page_view` and `scroll`, Google Ads `AW-967661948`, Meta `314453825678590` and LinkedIn `7456860` all genuinely transmit, and `/thank-you` fires `page_view` with the correct URL and title.

  - **1. Staging pollutes production analytics.** `staging-aliveprostudios.javad-ade.workers.dev` serves the IDENTICAL container `GTM-PJLQRZC`, so every visit to staging records a GA4 session, a Google Ads page view feeding remarketing audiences, and Meta + LinkedIn pixel fires. Internal traffic is in the numbers and the ad platforms are retargeting the team. Fix in the repo, not the container: `scripts/postbuild.mjs` already detects staging (`STAGING=1`, or a branch that is not `main`), so `BaseLayout.astro` can omit the GTM snippet on the same condition. A GA4 hostname filter is the weaker fallback, because it cleans GA4 only and leaves Ads, Meta and LinkedIn still firing.

  - **2. No lead event exists.** PARTLY SOLVED 2026-09-06: a `Form_Thank_You` event now fires on `/thank-you` and feeds the existing key event, verified in GA4 Realtime, so conversions are counted at last. What is still missing is the CONTEXT below. The site pushes NOTHING to the dataLayer; the only entries are GTM's own `gtm.js`, `gtm.dom`, `gtm.scrollDepth`, `gtm.load`. The sole conversion signal is a `page_view` of `/thank-you`, which counts only if that page is marked a key event in GA4, and carries no context: there is no way to tell which service page produced an enquiry. Add a real `generate_lead` dataLayer push in the success branch of the contact handler (`src/pages/contact.astro`, beside the `window.location.assign('/thank-you')` call), carrying the referring page.

  - **3. Phone and email clicks are invisible.** All 74 of 74 pages carry a `tel:` and a `mailto:` link, and the phone number is the largest element in the closing block on every page. GA4 enhanced measurement tracks NEITHER: outbound-click tracking only covers `http`/`https` destinations. Someone who reads a case study and phones is recorded as a bounce. Needs explicit click tracking.

  - **4. A refresh counts as a lead.** STILL TRUE after the 2026-09-06 fix, because the event is still derived from a page view rather than from an actual submission. Because the conversion is a page view, reloading `/thank-you` or landing on it directly counts again. Fixed for free by gap 2: a real event fires once, on actual submission.

  - **Still unverified, needs Javad's accounts:** whether `/thank-you` is marked a key event in GA4; whether the sitemap is submitted in Search Console and which property type it is; whether a Google Ads conversion action is tied to `/thank-you`.
  - **Search Console verification:** there is NO `google-site-verification` DNS TXT record (only Microsoft's `MS=ms79490828` and SPF) and no verification meta tag, so it is almost certainly verified via Google Analytics or Tag Manager. Both produce a URL-prefix property, which does NOT cover `https://www.` or `http://`. Now that www resolves (fixed 2026-09-06), a Domain property would consolidate them. The sitemap itself is correctly referenced in robots.txt and serves all 72 URLs.

- [ ] **Supply the 7 missing YouTube video upload dates** - Alive ProStudios site, raised 2026-09-06
  - Javad's call 2026-09-06: this matters for ranking and must be fixed, just not this week.
  - `uploadDate` is a REQUIRED property for Google video rich results. Without it those 7 `VideoObject` nodes on `/work/videos` are ineligible for the enhancement, and Search Console will report "Missing field 'uploadDate'" as an error. No ranking penalty and no effect on the other 17, but no rich result either.
  - 17 of 24 already carry true dates. `scripts/fetch-video-meta.mjs` reads Vimeo's oEmbed `upload_date` automatically; **YouTube's oEmbed carries no date at all**, which is the whole reason these 7 are missing. Re-running `npm run video-meta` will never fix them.
  - The 7 are the YouTube entries in `content/work/video-meta.json` with no `uploadDate` key. Their publish dates are public on each YouTube watch page.
  - Two ways to fix: read the dates off YouTube and enter them by hand, or call the YouTube Data API v3 (`videos.list`, `part=snippet`, field `publishedAt`), which needs an API key. Manual is roughly fifteen minutes for seven videos.
  - Wherever they are stored, `uploadDateOf()` in `src/lib/videos.ts` must find them, and `src/pages/work/videos.astro` already omits the property when it returns null. **Do not invent a date to fill the gap**: the bug being fixed here was all 24 asserting a hardcoded `2026-01-01`, and a wrong date is worse than a missing one.
  - `content/work/videos.md` already has an empty `Year` column in the `## All videos` table, which is the natural place to put them if a manual path is chosen.

- [ ] **Privacy policy still promises a cookie banner that does not exist** - Alive ProStudios site, raised 2026-08-26
  - `content/pages/privacy-policy.md` §2 and §3 tell visitors there is a cookie consent banner and a "Cookie settings" link in the footer. Neither was ever built.
  - This became sharper on 2026-08-26: GTM now sets Google, Meta and LinkedIn cookies on first page load, so the policy describes a control the site does not offer.
  - Javad decided consent is not required in Canada, so the fix is copy, not a consent banner: describe what the site actually does and drop the two promises.
  - `/privacy-policy` is a standalone route rendering its Markdown directly, NOT through MasterPage. See TEMPLATE-ANATOMY.md §4.

- [ ] **Clear the two GTM Custom HTML console warnings** - Alive ProStudios site, raised 2026-08-26
  - Work happens in the GTM container, not in this repo. Nothing on the site is broken; both are cosmetic.
  - The Meta pixel is a Custom HTML tag whose inline bootstrap the CSP blocks. It still works, because GTM retries through an allowed path. Switching it to GTM's built-in Meta template removes the warning.
  - The second is a HubSpot form listener waiting for `hsFormCallback` events. This site has no HubSpot forms; the contact form is Formspree. Safe to delete outright.
  - Do not try to fix this by loosening the CSP: `'unsafe-inline'` is inert alongside `'strict-dynamic'`, and hashing container-authored scripts breaks on the next container edit.

- [ ] **Colour and font size corrections in the global CSS** - Alive ProStudios site, raised 2026-08-25
  - Global styles live in `src/styles/tokens.css` (the custom properties) and `src/styles/base.css` (the type scale and element defaults). Per-page overrides sit in the `<style>` block of each `.astro` file, so decide per fix whether it belongs in the token or the component.
  - Constraints already settled: `--brand-orange` never changes, it is the brand. Small orange TEXT uses `--orange-ink`, which is theme-aware. Both are in `tokens.css`.
  - Check every change in BOTH themes. Several colours are only defined once and inherited, so a token edit can look right in light mode and fail in dark.
  - Type scale is `t-h1` through `t-h5` plus `t-eyebrow`. The hero H1 wraps and balances by design, see CLAUDE.md decision 6; do not reintroduce `white-space: nowrap` while adjusting sizes.
  - `STYLEGUIDE.md` holds the approved values. Where a correction departs from it, note which value changed and why, so the styleguide stays the record.
  - Verify through `npm run preview`, not `astro dev`, and confirm WCAG 2.1 AA contrast after any colour move.

- [ ] **Layered per-carton parallax on the home page feature image** - Alive ProStudios site, scoped for week of 2026-08-31
  - Idea: instead of the single flat image sliding as one plane, cut the three Alfred cartons out of the render into separate transparent layers and give each its own scroll timeline, so the near carton drifts faster than the far one. Reads as real depth rather than a pan.
  - Needs a new asset pipeline, not a CSS change: three cut-outs plus a clean background plate, exported as PNG/WebP with alpha.
  - Current source `content/assets/site/home-feature.jpg` is the satin nickel render on black (1500x844). The black background makes the cut-out far easier than the white version would have been.
  - Build on the existing effect in `src/pages/index.astro` section 6: `--pf-zoom-from/-to` and `--pf-shift` per layer, named view-timeline `--featureView` already declared on `.feature`.
  - Watch the two traps already hit there: `overflow: hidden` on the frame makes a bare `view()` bind to the frame and freeze at 50%, and the slide budget must come from the element being taller than the frame, not from scale.
  - Mobile only has ~18px of travel at 32vh because `cover` crops the sides there; decide whether layers are desktop-only.

## Waiting On

## Someday

## Done
