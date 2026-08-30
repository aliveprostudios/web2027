# LAUNCH.md

Launch record for aliveprostudios.com. Written 2026-08-22 as a checklist,
kept afterwards as the record of what shipped and what is still open.

**LAUNCHED 2026-08-24.** `aliveprostudios.com` serves the Astro site from the
`aliveprostudios` Worker. The WordPress site is retired. Sections 1 to 5 below
are done; what remains is in "Still open" at the bottom.

---

## Where things stand

| | |
|---|---|
| **Live** | **`aliveprostudios.com`**, verified 2026-08-24 |
| Routes | 49, all 200 on the live domain |
| Redirects | 83, every one verified 301 to a target that returns 200 |
| Old WordPress URLs | all 84 from its Yoast sitemap covered |
| Heading structure | one H1 per page, no skipped levels, all 49 |
| Canonicals | unique per page, absolute, https |
| robots.txt | generated per environment; production allows and names the sitemap |
| Security headers | CSP with per-build script hashes, HSTS, nosniff, DENY, referrer-policy |
| Contact form | Formspree `mwlejogn`, verified end to end |
| Microsoft mail | MX, both TXT and `autodiscover` verified intact after cutover |
| Staging | `staging-aliveprostudios.javad-ade.workers.dev`, `noindex` + `Disallow: /` |
| Production worker | `aliveprostudios.javad-ade.workers.dev`, still publicly reachable |

---

## 1. Content decisions to make first

These need Javad, not code.

- [x] **RESOURCES: BLOG SHIPPED 2026-08-30.** `/resources` and
      `/resources/blog` are live, and the section is titled **Marketing Blog**.
      Four real posts replaced the three Lorem ipsum placeholders, which were
      deleted at Javad's request. Route count went 48 to 54.
- [ ] **RESOURCES: FAQs AND BROCHURE STILL PARKED.** Next piece of work.
      `src/pages/_resources/faqs.astro` and `brochure.astro` are the only two
      files left under the underscore. Nothing on the site links to either, so
      there are no dead links today.

      **To ship the FAQ section, four edits in ONE commit:**
      1. Fix `content/faqs.md`: it still says "four pillars" where the site says
         **four domains** (CLAUDE.md decision 8, one framework site-wide).
      2. `git mv src/pages/_resources/faqs.astro src/pages/resources/faqs.astro`
      3. In `content/landing/resources.md`, restore a number line above
         `## FAQs`. `parseLanding` only treats a NUMBERED `##` as a child, so
         that single line brings back the menu entry AND the landing card.
         Renumber so the rows read 01, 02 in order.
      4. In `SITEMAP.md`, repoint `/faqs` from `/` to `/resources/faqs`. The
         redirect and the route must move together: a 301 to a 404 is worse
         than a 301 to the homepage.

      Then `npm run build` and confirm 55 routes. The brochure follows the same
      four steps whenever its PDF is ready.
- [x] **The five `/branding/*` and `/marketing/*` redirects are resolved.**
      They pointed at WordPress posts that were never migrated and never will
      be. Since 2026-08-30 they 301 to `/resources/blog`, which is topically
      what the visitor asked for. Only `/faqs` and `/digital-brochure` are still
      parked at `/`.
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

## 5. Cut over, the point of no return

Verified state as of 2026-08-23: GoDaddy already delegates to Cloudflare
(`etienne.ns.cloudflare.com`, `meilani.ns.cloudflare.com`), so **the registrar
does not need to be touched at all**. The apex A record still points at
`208.109.16.226`, the old WordPress host, which is what visitors see today.

### What the cutover does and does not touch

It replaces ONE record: the apex `A`. Email lives on different names and types
and is not involved:

| Record | Value | Cutover |
|---|---|---|
| `aliveprostudios.com` A | `208.109.16.226` | **REPLACED** by the Worker |
| `aliveprostudios.com` MX | `...mail.protection.outlook.com` | untouched |
| `aliveprostudios.com` TXT | `v=spf1 ...` | untouched |
| `aliveprostudios.com` TXT | `MS=ms79490828` | untouched |
| `autodiscover` CNAME | `autodiscover.outlook.com` | untouched |
| `www` CNAME | `aliveprostudios.com` | see step 3 |

Microsoft mail keeps flowing throughout. HSTS is deliberately set WITHOUT
`includeSubDomains` so it can never reach `autodiscover.aliveprostudios.com`.

### Steps

Do them in this order. The www rule goes FIRST so www never has a broken window.

1. **Promote to production.** Done 2026-08-23: `main` is at the same commit as
   `staging` and `aliveprostudios.javad-ade.workers.dev` serves the current
   build with no `x-robots-tag` and the production `robots.txt`.
2. **Create the www redirect rule.** Rules, Redirect Rules, Create. Hostname
   equals `www.aliveprostudios.com`, then Dynamic redirect 301 to
   `concat("https://aliveprostudios.com", http.request.uri.path)`, preserve
   query string. Safe to create before the cutover: it just sends www to the
   apex, which is the same site either way.
3. **Delete the apex A record.** DNS, Records, delete ONLY
   `aliveprostudios.com` A `208.109.16.226`.

   Cloudflare does NOT replace this automatically. Adding the Custom Domain
   while it exists fails with "Hostname 'aliveprostudios.com' already has
   externally managed DNS records (A, CNAME, etc). Delete them first."
   Ignore the "A, CNAME, etc" phrasing, it is generic: the MX, both TXT records
   and the `autodiscover` and `www` CNAMEs must all survive. There is no AAAA
   row to delete; the IPv6 address in public DNS is Cloudflare's proxy.

   **The apex has no address record between this step and the next**, so the
   site is down for that gap. Do steps 3 and 4 back to back.
4. **Add the Custom Domain.** Workers & Pages, `aliveprostudios`, Settings,
   Domains & Routes, Add, Custom Domain. Leave the subdomain field EMPTY for the
   root domain. Certificate provisions in about a minute.
5. **Purge the cache.** Caching, Configuration, Purge Everything. Skipping this
   leaves visitors on cached WordPress pages.
6. **Check for leftovers.** Rules, Page Rules: delete anything from the
   WordPress setup (`/index.php`, `wp-admin`, caching rules). SSL/TLS Overview:
   if it reads Flexible, set Full (strict).
7. **Verify.** All 49 routes, the 83 redirects, `www` 301ing to apex, and that
   `/robots.txt` is OURS. The zone currently serves a Cloudflare-managed
   robots.txt with a stale Yoast block advertising the old WordPress
   `sitemap_index.xml`; that block must not survive. Send and receive one email
   to confirm Microsoft is unaffected.

**Rollback:** re-create one record, `aliveprostudios.com` A `208.109.16.226`,
Proxied. Keep the GoDaddy hosting alive for a few days so that remains possible.

## 6. After launch

- [ ] Watch Search Console for crawl errors on the redirected URLs
- [ ] `/thank-you` and `/brand-pulse` still have no route
- [ ] `svc-zoho` follow-up in ASIP D-051 is closed: the page was deleted
      2026-08-22 at the founder's instruction
- [ ] 21MB of design-tool screenshots sit in
      `content/assets/templates and styleguide/uploads/`. Not referenced by the
      build. Strip them if repo size matters — cheap now, awkward later.

---

## Still open at end of 2026-08-24

Nothing here blocks the site being live. In rough order of value.

- [ ] **Republish Resources** once the content is ready. Steps in §1. Blocked on
      three Lorem ipsum blog posts and five old blog URLs with no target.
      This is also the biggest AEO win available: `/resources/faqs` carries
      `FAQPage` schema, which is exactly what answer engines quote.
- [ ] **Republish `/alive-pro/precision-impact-sprints`.** Unpublished
      2026-08-24 at Javad's request while he revises the copy. Nothing was
      deleted: `content/pages/precision-impact-sprints.md` carries
      `published: false`, which removes the route, the menu entry, the landing
      row, Related Services, the counts and the sitemap entry in one flag.
      **To republish:** delete that line, and delete the
      `/alive-pro/precision-impact-sprints` to `/alive-pro` 302 from SITEMAP.md.
      The two old WordPress URLs, `/precision-impact-sprints` and `/sprints`,
      still point at the page and currently chain through that 302, so they come
      back on their own.
- [ ] **Privacy policy §2 and §3** still promise a cookie consent banner, an
      analytics opt-in and a "Cookie settings" footer link. None exist. Build
      the banner or soften the wording.
- [ ] **Decide the AI crawler stance.** Cloudflare's managed robots.txt blocks
      the training crawlers by default. Retrieval bots are allowed so citation
      still works, but for a studio selling AEO this deserves a deliberate call.
- [ ] **Add `sameAs` to the Organization schema**: LinkedIn, Instagram, YouTube,
      Google Business Profile. Entity resolution, cheap and high value.
- [ ] **35 service pages have 44-60 character meta descriptions.** Under spec.
- [ ] **Foundation and Infrastructure sub-page order.** The other three sections
      were sequenced by priority on 2026-08-24; these two are still alphabetical.
- [ ] **Four-pillar diagram on mobile.** 855x409 artwork at a 390px viewport puts
      the inner labels near 4px. Portrait variant, sideways scroll, or lightbox.
- [ ] **Homayra's headshot is 400x500**, soft on retina at the 260px slot.
- [ ] **Disable the `*-aliveprostudios` preview URL** so staging is not publicly
      reachable, and consider disabling the workers.dev production URL too.
- [ ] `/brand-pulse` has no route.
- [ ] 15.2MB of the 29MB bundle is unreferenced portfolio originals that Astro
      emits but nothing links to. Deploy weight only, no user impact.
