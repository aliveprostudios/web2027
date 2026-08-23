# LAUNCH.md

Pre-launch checklist for aliveprostudios.com. Written 2026-08-22, at the end of
the build session.

**Nothing here is live yet.** `aliveprostudios.com` does not point at the new
site, so everything below can be done without risk to the current site. The
moment of no return is step 5.

---

## Where things stand

| | |
|---|---|
| Routes building | 55 |
| Redirects | 63, all verified 301 to the exact target |
| Reachable from menu or footer | 51 of 54 (3 blog posts sit behind their index) |
| axe-core (light + dark) | 2 findings, both the accepted white-on-orange exception |
| Heading structure | one H1 per page, no skipped levels, all 55 |
| Canonicals | unique per page |
| Staging | `staging-aliveprostudios.javad-ade.workers.dev`, `noindex` |
| Production | `aliveprostudios.javad-ade.workers.dev`, no custom domain yet |

---

## 1. Content decisions to make first

These need Javad, not code.

- [ ] **5 redirects land on the 404.** Old blog URLs that were never migrated:
      `/branding/online-digital-advertising`,
      `/branding/a-guide-to-developing-a-successful-brand-architecture`,
      `/branding/top-5-misconceptions-about-branding`,
      `/branding/lights-camera-action-...-smbs-in-2024`,
      `/marketing/7-ways-influencer-marketing-levels-up-your-branding`.
      Either write the posts, or repoint those five rows in `SITEMAP.md` at
      `/resources/blog`. A 301 to the index preserves far more link value than a
      301 to a dead end.
- [ ] **All 3 blog posts are Lorem ipsum.** They are the only pages on the site
      with no meta description. Either write them or drop them from the build.
- [ ] **`homepage.md` is Sanity block descriptors, not prose.** Home slots 2
      (Why It Matters), 5 (founder quote) and 7 (closing statement) render
      nothing. Write those three as ordinary Markdown and they populate with no
      code change.
- [ ] **51 pages still have `caption: ""`.** The hero falls back to the intro
      sentence, which reads fine, but the designed two-tone caption only appears
      where one is authored. Brand Name & Identity has the real thing as a model.
- [ ] **Contact form has no endpoint.** It validates, then composes a pre-filled
      mail message. Decide whether that ships or whether submissions need to land
      somewhere. Options: a Cloudflare Worker route (keeps it in-house, needs an
      email sender), or a form service (fastest, needs an account and a
      `form-action` entry in the CSP).

---

## 2. Protect staging

- [ ] **Cloudflare Access** on `staging-aliveprostudios.javad-ade.workers.dev`.
      Zero Trust → Access → Applications → Self-hosted → policy on your emails.
      Free tier covers this. `noindex` asks crawlers not to list it; Access is
      what actually stops people reading it.

---

## 3. Final verification, on staging

Run these against staging before touching DNS. Every one of them has caught a
real defect at least once.

```bash
S=https://staging-aliveprostudios.javad-ade.workers.dev

# every sitemap route returns 200
curl -s "$S/sitemap-0.xml" | grep -oE '<loc>[^<]+' | sed 's/<loc>//' \
  | sed 's|https://aliveprostudios.com||' | sed 's|^$|/|' | sort -u \
  | while read -r u; do printf '%s %s\n' "$(curl -s -o /dev/null -w '%{http_code}' "$S$u")" "$u"; done \
  | grep -v '^200' || echo "all 200"

# staging must be noindex; production must NOT be
curl -sI "$S/" | grep -i x-robots
```

- [ ] All routes 200
- [ ] All 63 redirects 301 to the exact target
- [ ] Menu opens, is not clipped, closes; scroll releases
- [ ] Theme toggle persists across a reload
- [ ] Gallery lightbox: auto-advance, arrows, Escape, focus returns
- [ ] Video wall: filters, player opens, iframe destroyed on close
- [ ] Mobile at 375px on a real device
- [ ] **Check in Safari as well as Chrome.** Both bugs found on 2026-08-22 were
      Safari-visible and Chromium-invisible.

---

## 4. Pre-DNS SEO

- [ ] `robots.txt` — the site has none yet. Add one pointing at the sitemap.
- [ ] `llms.txt` — not written yet.
- [ ] OG image — `BaseLayout` sets `og:title`/`og:description` but no
      `og:image`. §8 specs 1200×630, dark grey, white Condensed title, orange
      dot. It must live at a **permanent path**, never a build-hashed
      `/_astro/…` URL, because platforms cache the URL they scraped.
- [ ] Google Rich Results Test against a live URL once the domain is attached.

---

## 5. Cut over — the point of no return

- [ ] Worker → Settings → Domains & Routes → add `aliveprostudios.com`
      (the domain is already on this Cloudflare account)
- [ ] Confirm production does **not** send `X-Robots-Tag`
- [ ] Re-test a sample of the 63 redirects on the real domain
- [ ] Submit the sitemap in Google Search Console
- [ ] Re-scrape any previously shared URL through the LinkedIn Post Inspector and
      the Facebook Sharing Debugger — a deploy does not refresh a preview a
      platform already cached

---

## 6. After launch

- [ ] Watch Search Console for crawl errors on the redirected URLs
- [ ] `/thank-you` and `/brand-pulse` still have no route
- [ ] `svc-zoho` follow-up in ASIP D-051 is closed: the page was deleted
      2026-08-22 at the founder's instruction
- [ ] 21MB of design-tool screenshots sit in
      `content/assets/templates and styleguide/uploads/`. Not referenced by the
      build. Strip them if repo size matters — cheap now, awkward later.
