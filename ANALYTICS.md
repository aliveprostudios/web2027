# ANALYTICS.md — Alive ProStudios measurement stack

> Everything about GA4, Search Console, Tag Manager, Google Ads, Meta and
> LinkedIn for aliveprostudios.com. **Read this before touching any of them.**
>
> Audited end to end on **2026-09-06**. Every fact below was measured — from the
> live page's own network activity, or read directly in the console named — not
> inferred from code. Where something is unverified it says so.

---

## The short version

**Pageviews are captured correctly. Conversions are not, and have not been for
over a year.** All three systems are installed properly; what fails is quieter
than that. Three conversion triggers point at a URL this site does not serve,
call tracking matches a phone-number format the site does not use, and GA4 reads
its Search Console data from an empty property.

**You have two of everything, and the empty ones are easy to open by accident:**
two GA4 properties, two Search Console properties, three GTM containers. This is
the single most confusing thing about the setup and the cause of at least part of
the "traffic has dropped" impression.

---

## Account map

Every ID in one place. **Renaming never changes an ID** — the names below were
changed on 2026-09-06 to carry a year, the IDs are untouched.

### Google Tag Manager

| | Value |
|---|---|
| Account | **Alive ProStudios**, account id `78231353` |
| **LIVE container** | **`GTM-PJLQRZC`** · name **Alive GTM 2026** · container id `33409948` · workspace `32` |
| Dead container | `GTM-KRVGH63H` · Server · container id `226423722` · name "aliveprostudios.com" |
| Dead container | `GTM-P2NFJT` · Web · container id `1227063` · name "www.aliveprostudios.com (old before 2022)" |

Container is **fully published**, 0 pending changes. 15 tags, 8 triggers.
"Enable consent overview (BETA)" is ticked. Google tag gateway: **Not started**.

**Both dead containers appear 0 times in the live HTML**, and no server-side
tagging endpoint is configured, so the Server container is provably inert.
Verified by grepping the served page for each ID.

### Google Analytics 4

| | Value |
|---|---|
| Account | **Alive ProStudios 2026** (was "Alive Pro A4 (2023)") · account id `16824566` |
| **LIVE property** | **Alive GA 2026** (was "GoA4 \| APS Feb 2023") · property id `250060348` |
| **DEAD property** | "http://www.aliveprostudios…" · property id `399273383` · **1 session in 12 months** |
| Data stream | **Alive Web 2026** (was "GoAnalytics 4 \| APS 2020") · stream id `2121857355` |
| **Measurement ID** | **`G-L9G3DSQCJQ`** |
| Stream URL | `https://aliveprostudios.com` · confirmed receiving traffic |
| Locale | (GMT-04:00) Toronto · Canadian Dollar · Country Canada |

**Do not open property `399273383`.** It is the old www property, it has one
session in a year, and opening it is indistinguishable from "all our traffic
vanished". It should be deleted; see Open items.

### Search Console

| | Value |
|---|---|
| **REAL property** | `https://aliveprostudios.com/` · URL-prefix · 55 indexed / 133 not · 23 clicks |
| **EMPTY property** | `https://www.aliveprostudios.com/` · URL-prefix · **0 indexed** / 2 not · 7 clicks · added 2022-07-23 |
| Verification | Verified owner. **No `google-site-verification` DNS TXT record exists** — only Microsoft's `MS=ms79490828` and SPF — so verification runs through Analytics or Tag Manager |
| Sitemap | `/sitemap-index.xml` submitted 2026-08-24, Success, **72 URLs** |
| Old sitemap | `/sitemap_index.xml` still listed. **Leave it.** GSC no longer offers removal, and the URL 301s to the current sitemap, so Google follows it correctly |
| robots.txt | Valid · 279 crawl requests in 90 days |

The `www` property's Associations list "Google Analytics, YouTube channel" —
that association is the wrong-property link described below.

**Search Console properties cannot be renamed.** The property name is the URL.
The only way to get a consolidated, current property is to create a **Domain
property**, which requires a DNS TXT record.

### Advertising and social

| Platform | ID | State |
|---|---|---|
| Google Ads | `AW-967661948` · account **477-278-3263** ("Alive ProStudios 2023") | Linked to GA4, Enabled, personalised advertising on, linked 2023-01-27 |
| Meta pixel | `314453825678590` | Firing. Bootstrap tag violates CSP but retries through an allowed path |
| LinkedIn Insight | `7456860` | Firing |

---

## Verified working

Measured on the live production page 2026-09-06:

- GTM loads on **74 of 74 routes**, both the script and the `<noscript>` iframe
- Snippet sits inside `<head>`, ~935 characters in
- **All four platforms transmitting**: GA4, Google Ads, Meta, LinkedIn
- GA4 sends `page_view`, `scroll`, `session_start`, `user_engagement`
- Enhanced measurement **on**: page views, scrolls, outbound clicks, +4 more
- Google Ads correctly linked to GA4
- Container fully published, no pending changes
- `Form_Thank_You` key event **fires and counts** — fixed 2026-09-06, verified in Realtime
- Search Console: sitemap accepted, robots.txt valid, breadcrumbs valid on 34 pages, video enhancements valid on 52

---

## Broken, with evidence

### 1. Three conversion tags have never fired on this site

The triggers match a URL with a **trailing slash**. The Astro site canonicalises
without one, so the match never succeeds.

```
Trigger expects   https://aliveprostudios.com/thank-you/
Site serves       https://aliveprostudios.com/thank-you
```

Affected triggers:

| Trigger | Type | Filter | Tags |
|---|---|---|---|
| `Window Loaded (thank you page)` | Initialization | Page URL contains `https://aliveprostudios.com/thank-you/` | 2 |
| `Page View Thank you contact` | Page View | Page URL contains `https://aliveprostudios.com/thank-you/` | 1 |

Affected tags: **GA4 Conversion (Dec 2023)**, **Web form 2023** (Google Ads),
**G Ad Conversion Sept 2025 (Contact Form Submission)** (Google Ads).

**Fix:** change the filter to `Page URL contains /thank-you`. Do not include the
domain or the trailing slash. This is the single highest-value fix in this file.

### 2. Call tracking matches a phone format the site does not use

```
Trigger expects   tel:905-553-3044
Site serves       tel:+19055533044
```

Trigger `Just Links (call tracking)`, tag `Call Tracking 2023` (Google Ads
Conversion). The phone number is the largest element in the closing block on all
74 pages, so this is likely the most-clicked conversion on the site, and it has
recorded nothing.

**Fix:** match on `tel:` alone, so it survives any future formatting change.

### 3. GA4 read Search Console from the empty property — FIXED 2026-09-07

From October 2023 until 2026-09-07, GA4 was linked to
`https://www.aliveprostudios.com/` — a property with **0 indexed pages and 7
clicks** — instead of the apex, which has 55 indexed and 23 clicks. Every
organic-search report inside GA4 drew on an empty property for nearly three
years.

Now linked to `https://aliveprostudios.com/` (URL-prefix) against stream
**Alive Web 2026** `2121857355`. Relinked by `aliveprostudios@gmail.com`.

Search Console data in GA4 is **not retroactive** — expect the organic reports to
begin populating from the relink date forward, not to backfill.

### 4. The internal traffic filter had nothing to filter on

Two separate problems, and the second was the real one.

```
GA4 → Admin → Data filters
  Internal Traffic   Exclude   state: TESTING     ← still Testing

GA4 → Data streams → Alive Web 2026 → Configure tag settings
     → Define internal traffic
  "No rules yet."                                 ← FIXED 2026-09-07
```

The filter excludes events where `traffic_type = internal`. **No rule existed to
ever set that parameter**, so activating the filter would have excluded exactly
zero events while appearing to work. Checking the definition before activating is
what caught this.

A rule now exists: **"Alive Pro office"**, `traffic_type = internal`, matching
`184.146.149.60/32`, created 2026-09-07.

**The filter is deliberately still in Testing.** Google's own warning on
activation reads: *"Filter changes are by nature destructive and irreversible.
They are also not retroactive. You should only enable this if you have already
successfully tested your filter."* The rule is hours old and has never matched
anything. Leave it in Testing until the exclusion is confirmed, then activate.

**Two caveats on that IP.** It is Javad's public IP as measured on 2026-09-07 and
is very likely **dynamic** — if the ISP changes it, the rule silently stops
matching and internal traffic returns to the reports. And **an IP rule cannot
catch the staging site**, because that is a hostname problem, not an address one.
Staging needs the repo fix in finding 5.

### 5. Staging fires the production container

`staging-aliveprostudios.javad-ade.workers.dev` serves the **identical**
`GTM-PJLQRZC`. Every visit to staging records a GA4 session, a Google Ads page
view feeding remarketing audiences, and Meta and LinkedIn pixel fires.

This is what Google's own container diagnostics flags as **"Container quality:
Urgent — Additional domains detected for configuration."** Google proposes a
change to the Conversion Linker tag; that proposal was **reviewed and left
unapplied** on 2026-09-06.

**Fix in the repo, not the container.** `scripts/postbuild.mjs` already detects
staging (`STAGING=1`, or any branch that is not `main`); `BaseLayout.astro` can
omit the GTM snippet on the same condition. A GA4 hostname filter is the weaker
fallback because it cleans GA4 only and leaves Ads, Meta and LinkedIn firing.

### 6. Dead tags and two CSP errors

| Item | Why it is dead |
|---|---|
| `Custom HTML HubSpot form` | No HubSpot on this site; the form is Formspree. Also causes a CSP violation |
| `HubSpot Event Trigger` | Waits for `hsFormCallback` events that never occur |
| `GA4 Event Tag form Submission 2025` | Fires on the HubSpot trigger above |
| `Sprint Form Trigger` + `G Ad Conversion Sept 2025 (Sprint Form Submission)` | Points at `/thank-you-sprints/`; Precision Impact Sprints is unpublished |

Exactly **two CSP console errors** on every page load, both inline scripts inside
Custom HTML tags: the Meta pixel bootstrap and the HubSpot listener. Meta still
works because GTM retries through an allowed path. Converting Meta to the native
GTM template clears one; deleting the HubSpot tag clears the other.

**Do not try to fix this by loosening the CSP.** `'unsafe-inline'` is inert
alongside `'strict-dynamic'`, and hashing container-authored scripts breaks on
the next container edit. See CLAUDE.md.

### 7. Three key events have never received data

`close_convert_lead`, `qualify_lead` and `purchase` all read "No stream data
detected". Nothing on the site or in the container ever sends them. Retire them
or wire them up; leaving them implies measurement that is not happening.

### 8. The site pushes nothing to the dataLayer

The only entries are GTM's own `gtm.js`, `gtm.dom`, `gtm.scrollDepth`,
`gtm.load`. A lead therefore carries no context — there is no way to tell which
service page produced an enquiry.

**Fix:** push a `generate_lead` event in the success branch of the contact
handler (`src/pages/contact.astro`, beside `window.location.assign('/thank-you')`)
carrying the referring page.

### 9. `tel:` and `mailto:` are invisible to GA4

`tel:` is on all 74 pages. **`mailto:` is on only 2 since 2026-09-07** — Javad
removed the menu footer, which was the only email link on the other 72; it now
appears on `/contact` and `/privacy-policy` alone. Email is still reachable from
everywhere, because all 74 pages link to `/contact`.

GA4 enhanced measurement's outbound-click tracking covers `http`/`https`
destinations only, so neither `tel:` nor `mailto:` is counted. The Google Ads
tags that attempt it are broken (finding 2). Note that the `Just Links (email
tracking @info)` trigger now has far less to fire on, so if email clicks matter,
that is worth revisiting alongside the trigger fixes.

---

## Read this first when you start on Google Ads

Javad is creating campaigns from **October 2026**. Before spending anything:

1. **Fix findings 1 and 2 first.** Every Google Ads conversion tag in the
   container is currently dead. Running campaigns before fixing them means paying
   for clicks with **no conversion data at all**, which also starves Smart
   Bidding of the signal it needs.
2. The Ads account is **477-278-3263**, conversion ID `AW-967661948`, already
   linked to GA4 and enabled.
3. Ads-related tags in the container: `Call Tracking 2023`, `Email Tracking
   2023`, `G Ad Conversion Sept 2025 (Contact Form Submission)`, `G Ad Conversion
   Sept 2025 (Sprint Form Submission)`, `Web form 2023`, `Google Ads Remarketing
   Dec 2023`, `Google Tag AW-967661948`, `Conversion Linker Jan 2023`.
4. **Check what conversion actions exist in the Ads account itself.** This audit
   covered GA4, GSC and GTM. The Ads account's own conversion actions were NOT
   inspected, and a tag firing is not the same as a conversion action being
   configured to receive it.
5. **Fix the internal traffic filter and the staging leak before launching**, or
   remarketing audiences will be built partly from your own team.
6. Bot traffic is heavy (see below). Consider whether it reaches the campaign
   reporting too.

---

## The traffic question, settled

Javad's impression on 2026-09-06 was that visits used to be high and had
dropped. Three separate things were happening.

**One: the empty properties.** The GA4 property and the Search Console property
he had open were both the `www` ones — 1 session in a year, and 7 clicks with 0
indexed pages. Opening those looks exactly like a collapse.

**Two: there is a real decline, and it predates the rebuild.** In the live
property, traffic peaked November 2025 to April 2026 and stepped down through
**May and June 2026**. The Astro site launched **24 August 2026**, roughly three
months later. The rebuild did not cause it.

**Three: most of it was never human.** Full year, 1 Sep 2025 to 6 Sep 2026:

| Channel | Sessions | Share |
|---|---|---|
| Direct | 6,866 | 87.61% |
| Referral | 407 | 5.19% |
| **Organic Search** | **242** | **3.09%** |
| Organic Social | 172 | 2.19% |
| Unassigned | 170 | 2.17% |
| Paid Search | 28 | 0.36% |
| **Total** | **7,837** | — |
| **Key events** | **0.00** | for the entire year |

87% direct against 3% organic, with 9 seconds average engagement, is the
signature of automated traffic. In the last 7 days, Singapore 150 and Vietnam 51
against Canada 24. GA4's own anomaly detection flagged the 3 September spike as
"users from Singapore, who climbed from 4 to 34".

**Organic search has never been meaningful in this property: ~20 sessions a
month for twelve months.** That is the number to grow, and the one to judge the
rebuild by. Do not use total sessions.

Separately, until 2026-09-06 **every one of the 86 redirects returned 404 when
the URL ended in a slash**, which is the form WordPress published and Google
indexed. That cost real traffic from old inbound links for the whole life of the
new site. It is fixed; watch whether organic recovers.

---

## Changed on 2026-09-06

Everything done to these accounts, so a future session can tell what was
deliberate.

| Change | Where | Detail |
|---|---|---|
| Created `Form_Thank_You` event | GA4 | On `page_view` where URL contains `/thank-you`. Feeds the pre-existing key event of the same name. **Verified firing in Realtime.** One test conversion in the data is Claude's |
| Renamed account | GA4 | "Alive Pro A4 (2023)" → **Alive ProStudios 2026** |
| Renamed property | GA4 | "GoA4 \| APS Feb 2023" → **Alive GA 2026** |
| Renamed data stream | GA4 | "GoAnalytics 4 \| APS 2020" → **Alive Web 2026** |
| Renamed container | GTM | "Alive ProStudios Inc" → **Alive GTM 2026** |

Renames changed no IDs; tracking was re-verified afterwards and all four
platforms still fire.

### 2026-09-07

| Change | Where | Detail |
|---|---|---|
| Relinked Search Console | GA4 | Unlinked `https://www.aliveprostudios.com/`, linked `https://aliveprostudios.com/` to stream `2121857355`. Closes finding 3 |
| Created internal traffic rule | GA4 | "Alive Pro office", `traffic_type = internal`, `184.146.149.60/32`. There were **no rules at all** before this |
| Internal traffic filter | GA4 | **Left in Testing on purpose.** Activation is destructive and irreversible per Google's own warning, and the new rule is untested |

**Deliberately NOT done:**

- Google's proposed Conversion Linker change was opened, read and **left
  unapplied**
- **No container version was created and nothing was published.** The container
  still shows 0 pending changes
- The two dead GTM containers were **not deleted** — deletion is irreversible
- The two Google tags inside the container are still named `GoAnalytics 4 | Jan
  2023` and `Alive ProStudios 2023`. Renaming them requires publishing a
  container version, so it should be bundled with the trigger fixes rather than
  published on its own

---

## Open items

Ordered by value. Items 1 and 2 restore conversion tracking outright.

| # | Fix | Where | Blocking Ads? |
|---|---|---|---|
| 1 | Repoint the two thank-you triggers to `/thank-you` | GTM | **Yes** |
| 2 | Change call tracking to match `tel:` | GTM | **Yes** |
| ~~3~~ | ~~Relink Search Console to the apex property~~ **DONE 2026-09-07** | GA4 | — |
| 4 | Activate the Internal Traffic filter **after confirming the new rule actually excludes** | GA4 | Yes, for audiences |
| 5 | Stop staging firing production tags | Repo | Yes, for audiences |
| 6 | Delete dead tags, convert Meta to native template | GTM | No |
| 7 | Push `generate_lead` with the referring page | Repo | No |
| 8 | Delete GTM `GTM-KRVGH63H` and `GTM-P2NFJT`, and GA4 property `399273383` | Javad | No |
| 9 | Create a Search Console Domain property | Javad + DNS | No |
| 10 | Filter bot traffic | GA4 | Yes |

**Item 8 is Javad's to do.** Export each container first (Admin → Export
Container) so it is recoverable, then Admin → Show More → Delete Container.

**Item 9 needs a DNS TXT record in Cloudflare.** The existing Microsoft mail
records (`MS=ms79490828`, SPF, MX, `autodiscover`) must not be disturbed.

---

## Traps

- **A trailing slash is the recurring failure on this project.** It broke all 86
  redirects and it broke every conversion trigger, in both cases silently. When
  anything matches a URL here, check the exact form the site serves. Astro is
  configured `trailingSlash: 'never'`.
- **Renaming is safe; IDs are what matter.** `G-L9G3DSQCJQ`, `GTM-PJLQRZC` and
  `AW-967661948` never change. Names are labels only.
- **A tag firing is not a conversion being recorded.** All four platforms were
  confirmed transmitting long before anyone noticed that no conversion had ever
  been counted. Check the key-event count, not the network tab.
- **"No stream data detected" on a key event means it has never fired**, not that
  it is misconfigured. Four key events existed for over a year in exactly that
  state.
- **Deep links into the GA4 admin redirect to Home.** Navigate the Admin UI
  instead, or the URL silently lands you somewhere else.
- **GA4 and GSC both have a live property and an empty `www` twin.** Check which
  one is selected before concluding anything about traffic.

---

## How any of this was verified

Reproducible, so the next session does not have to take this file on trust.

**Is the tag on every page?**

```bash
find dist -name '*.html' | wc -l
grep -rl "GTM-PJLQRZC" dist --include="*.html" | wc -l
```

**What does the live page actually send?** Open the site in the browser pane and
read the Performance API rather than trusting the network panel:

```js
performance.getEntriesByType('resource')
  .map(r => r.name)
  .filter(u => u.includes('/g/collect'));   // GA4 hits, with en= and tid=
```

**Which container and tags are loaded?**

```js
Object.keys(window.google_tag_manager || {});
(window.dataLayer || []).map(e => e && e.event).filter(Boolean);
```

**Are the CSP violations still exactly two?** Read the browser console on a
freshly loaded page.

**Does a trigger pattern match reality?** Compare the trigger's filter against
what the site serves:

```bash
curl -sSL -o /dev/null -w '%{url_effective}\n' https://aliveprostudios.com/thank-you
curl -sS https://aliveprostudios.com/ | grep -o 'href="tel:[^"]*"' | sort -u
```

---

*Audited 2026-09-06. Update this file whenever any of it changes.*
