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

- [ ] **RESOURCES IS UNPUBLISHED (2026-08-23), waiting on content.** Pulled at
      Javad's request. Seven routes are gone: `/resources`, `/resources/blog`,
      the three blog posts, `/resources/brochure` and `/resources/faqs`. Nothing
      was deleted. The route files moved to `src/pages/_resources/`, which
      Astro's router ignores because of the leading underscore, and the content
      files are all untouched in `content/`.
      **To republish:** rename `src/pages/_resources/` back to
      `src/pages/resources/`, empty the `UNPUBLISHED` set in `src/lib/nav.ts`,
      and restore the eight redirect targets in `SITEMAP.md` per the note above
      its redirect table. Then rebuild; the menu row and the sitemap entries come
      back on their own.
      Still outstanding before it can go back up: the three blog posts are
      Lorem ipsum and are the only pages with no meta description, and five old
      `/branding/*` and `/marketing/*` URLs point at posts that were never
      migrated. Either write those posts or point those five rows at
      `/resources/blog`.
- [ ] **`homepage.md` is Sanity block descriptors, not prose.** Home slots 2
      (Why It Matters), 5 (founder quote) and 7 (closing statement) render
      nothing. Write those three as ordinary Markdown and they populate with no
      code change.
- [ ] **51 pages still have `caption: ""`.** The hero falls back to the intro
      sentence, which reads fine, but the designed two-tone caption only appears
      where one is authored. Brand Name & Identity has the real thing as a model.
- [ ] **Decide the mobile treatment for the four-pillar diagram.**
      `/alive-pro/why-alive-pro` renders
      `content/assets/diagrams/brand-to-revenue-system.svg` edge to edge. The
      artwork is 855x409, so at a 390px viewport it scales to 390x187 and the
      inner labels ("Brand-Led Growth Strategy", "Application Architecture") land
      around 4px. It is vector, so it is crisp, just too small to read. Options:
      a portrait variant for small screens, letting it scroll sideways inside its
      own container, or making it tappable into the lightbox that already exists
      for the portfolio. Desktop and tablet are fine as they are.
      Note the SVG is transparent and drawn for a white ground, which is why
      `.rows__figure` paints white in both themes. In dark mode that reads as a
      full-bleed white band. Deliberate, but worth a look before launch.
- [ ] **The privacy policy describes a cookie banner that does not exist.**
      Javad's rewritten policy landed 2026-08-23 and fixed the big problem: it no
      longer names Vercel, Supabase, Resend or Sanity as processors, describing
      them generically instead. What remains is §2 and §3, which promise a cookie
      consent banner, analytics only "with your consent", and a "Cookie settings"
      link in the footer. The site has no banner, no analytics and no such
      footer link. Either build the banner or soften those two sections.
- [ ] **Contact form needs a Formspree endpoint. ONE LINE FROM DONE.**
      Everything else is built: the form POSTs, redirects to `/thank-you` on
      success, shows a mailto fallback on failure instead of failing silently,
      and carries a honeypot. `scripts/postbuild.mjs` reads the endpoint back out
      of the built HTML and adds its origin to the CSP `connect-src` itself, so
      there is no second edit to forget.
      **What is needed:** a form at formspree.io with the destination set to
      `javad@aliveprostudios.com`, then paste the endpoint URL into
      `FORM_ENDPOINT` in `src/pages/contact.astro`. That is the whole change.
      Until then the form falls back to composing a mail message, which reaches
      nobody unless the visitor has a mail client and presses send.
      No redirect needs configuring in Formspree: the form POSTs with
      `Accept: application/json` and does the `/thank-you` redirect itself.

      **Form Flow was evaluated on 2026-08-23 and set aside.** Javad had a form
      at `myformflow.io/alivepro/form`, but its embed is an iframe
      (`myformflow.io/_embed/{id}`), not a submit endpoint, so it replaces the
      designed form rather than feeding it. Three reasons it was not used, all
      verified by rendering it: it cannot inherit the site's type, colour or
      dark mode; it collects Name, Last Name, REQUIRED phone, Email and message,
      which contradicts privacy policy §2 and drops the CASL consent checkbox;
      and it loads roughly twelve third-party bundles including Datadog RUM and
      a Cloudflare RUM beacon on page load, which contradicts privacy policy §3
      ("Until you click Accept, no analytics scripts are loaded"). Revisit only
      if Form Flow exposes a plain POST endpoint or webhook.
- [ ] **Decide the mobile treatment for the four-pillar diagram.**
      `/alive-pro/why-alive-pro` renders
      `content/assets/diagrams/brand-to-revenue-system.svg` edge to edge. The
      artwork is 855x409, so at a 390px viewport it scales to 390x187 and the
      inner labels ("Brand-Led Growth Strategy", "Application Architecture") land
      around 4px. It is vector, so it is crisp, just too small to read. Options:
      a portrait variant for small screens, letting it scroll sideways inside its
      own container, or making it tappable into the lightbox that already exists
      for the portfolio. Desktop and tablet are fine as they are.
      Note the SVG is transparent and drawn for a white ground, which is why
      `.rows__figure` paints white in both themes. In dark mode that reads as a
      full-bleed white band. Deliberate, but worth a look before launch.
- [ ] **The privacy policy describes a cookie banner that does not exist.**
      Javad's rewritten policy landed 2026-08-23 and fixed the big problem: it no
      longer names Vercel, Supabase, Resend or Sanity as processors, describing
      them generically instead. What remains is §2 and §3, which promise a cookie
      consent banner, analytics only "with your consent", and a "Cookie settings"
      link in the footer. The site has no banner, no analytics and no such
      footer link. Either build the banner or soften those two sections.
- [ ] **Contact form has no endpoint. DECISION PENDING.** It validates, then
      composes a pre-filled mail message and hands it to the visitor's mail
      client. That is not a submission: nothing reaches an inbox unless the
      visitor has a mail client configured and presses send themselves, which is
      why the form cannot yet redirect to `/thank-you`. The mail is now addressed
      to `javad@aliveprostudios.com` (`FORM_INBOX` in `src/pages/contact.astro`),
      separate from the public `info@` address shown on the page.
      Two ways to make it real, both needing an account from Javad:
      a hosted form endpoint (stays fully static, honours decision 1 in
      `CLAUDE.md`, needs the endpoint URL and a CSP `connect-src` entry), or a
      Cloudflare Worker plus an email API (keeps it in-house but REOPENS the
      "no server function" decision, and needs a verified sending domain).
      `/thank-you` is built and ready as the destination either way.

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
