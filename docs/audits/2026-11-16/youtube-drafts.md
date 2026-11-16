# YouTube channel drafts for approval, 2026-11-16

From the 2026-11-16 check of both channels. **Approved by Javad 2026-11-16 ("Approve all") and applied the same day.** Sections 1 to 3 are live on both channels, each field read back after entry and confirmed by YouTube ("Changes published", "Settings saved"). Section 4 is live on the website. **Not applied:** the optional watermark (needs a 150 px logo file), the LinkedIn company link (needs the URL), and every item in section 5, which are Javad's decisions.

Rules applied, the same as the website: wording taken from the site's own approved copy (Home, About Us, What We Do, Brand Marketing Videos), Canadian spelling, no em dashes, never "honest", no cost or price claims. **"Since 1997" is used instead of "29 years"** so the text never goes stale; one channel still says "25 years" today. **"Four pillars"** matches the menu and `/services` since 2026-09-07.

Checked by script: no dashes, no banned words, no cost claims, all within YouTube's 1,000-character limit.

## 1. Alive ProStudios Inc. (@AliveProstudios), the company channel

Owns 7 of the website's YouTube videos.

### Channel description (826 characters)

**Replaces** the pre-rebuild copy, which opens in capitals ("WE BRAND COMPANIES…") and ends on results "at a lower cost", a cost claim the site no longer makes.

```
Alive ProStudios is a boutique brand transformation studio in Toronto. Since 1997, we have turned fragmented marketing into one connected growth system for businesses across Canada, the USA, Germany and the Middle East.

Our work runs on the Brand-to-Revenue Performance System and its four pillars:
Foundation: brand strategy, positioning, identity, voice and rebranding.
Execution: design, web, video, photography, AI production and sales collateral.
Growth: digital marketing, content, SEO, AEO, social media and lead generation.
Infrastructure: custom applications, systems integration, dashboards and lifecycle support.

This channel holds the corporate videos, commercials, brand films and product videos we have made for our clients.

Website: https://aliveprostudios.com
Talk to us: https://aliveprostudios.com/contact
```

### Upload-default description (205 characters)

Pre-filled on every new upload. **Replaces** the current default, which says the services "save time and money".

```
Produced by Alive ProStudios, a boutique brand transformation studio in Toronto, since 1997.

See our work: https://aliveprostudios.com/work
Talk to us about your brand: https://aliveprostudios.com/contact
```

### Links (replace all five)

| # | Title | URL | Note |
|---|---|---|---|
| 1 | Website | https://aliveprostudios.com | Was `http://www.AliveProStudios.com` |
| 2 | What We Do | https://aliveprostudios.com/services |  |
| 3 | Case Studies | https://aliveprostudios.com/work/case-studies |  |
| 4 | Brand Marketing Videos | https://aliveprostudios.com/work/videos |  |
| 5 | Javad Ahmadi | https://javad.ca/ | Was the old `/about-us/team` page |
| 6 | LinkedIn | *the company page URL, from you* | The current link is an old personal-profile address (`profile/view?id=…`) |
| 7 | X | https://x.com/aliveprostudios | Keep only if the account is still active; the current link uses twitter.com |

Dropped: "Branding Company Vaughan" (a deep link into the old portfolio) and "Branding Company Toronto" (replaced by Website). The first link is the one YouTube shows beside the channel name, so Website stays first.

### Contact email

Currently `javad@aliveprostudios.com`; the personal channel uses `info@`. **Recommend `info@aliveprostudios.com`** on both: one address for public enquiries, and your own inbox stays off a public page. Your call.

## 2. Javad Ahmadi (@javadahmadi), your personal channel

Owns 3 of the website's YouTube videos, including the home page reel and the `/services` hero.

### Channel description (311 characters)

**Light edit** of your own text, which reads: "My goal is to provide small and medium-sized businesses owners short educational videos to help their business grow. Feel free to let me know If you would like me to talk about any other topics. http://aliveprostudios.com". Same message, grammar fixed, links on `https`, and one line saying who you are.

```
Short educational videos for owners of small and medium-sized businesses, to help their businesses grow.

I am Javad Ahmadi, founder of Alive ProStudios in Toronto, building brands since 1997. If there is a topic you would like me to cover, tell me in the comments.

https://aliveprostudios.com
https://javad.ca
```

### Upload-default description: one change only

The current default reads "For the past 25 years, he has built brands from concept to successful businesses." **Change "For the past 25 years," to "Since 1997,"** and leave the rest of your text as it is.

### Links (replace all four)

| # | Title | URL | Note |
|---|---|---|---|
| 1 | Alive ProStudios | https://aliveprostudios.com | Was `https://www.aliveprostudios.com` |
| 2 | Javad Ahmadi | https://javad.ca/ | New |
| 3 | What We Do | https://aliveprostudios.com/services | Replaces `/integrated-marketing/`, which 404'd until 2026-11-15 |
| 4 | Common Questions | https://aliveprostudios.com/common-questions | Fits a channel of educational videos. Replaces `/brand-experience-2/`, which 404'd until 2026-11-15 |

Dropped: "Portfolio" (`/portfolio/`), now covered by the website link.

## 3. Settings, both channels

| Setting | Now | Proposed |
|---|---|---|
| Audience (Settings → Channel → Advanced settings) | "I want to review this setting for every video" | **"No, set this channel as not made for kids"**. Business content; removes a question from every upload and keeps comments and personalised ads available |
| Video watermark (Customization → Profile) | None | Optional: the Alive ProStudios mark as a subscribe watermark, 150 × 150 px |
| Third-party AI training | Off | **Your call.** Not changed. It differs from the website, where every AI crawler is allowed |

## 4. On the website (needs your OK)

- **Add `https://www.youtube.com/@AliveProstudios` to the Organization's `sameAs`** in `src/layouts/BaseLayout.astro`. It is verifiably the official channel: it owns 7 of the site's videos. This is the first of the profile links the audit asked for.
- **Add `https://www.youtube.com/@javadahmadi` to Javad's `sameAs`** in the same file, on the founder entry, so engines can tie the person to his channel too.

## 5. Decisions only you can make

- **The empty duplicate channel** "Alive ProStudios" (@aliveprostudios9936), no subscribers. Deleting it removes a look-alike of the real channel. Irreversible.
- **Google Ads account 414-705-0543** is linked to your personal channel alongside the main account 477-278-3263. Unlink it if it is no longer in use.
- **Who has access to the company channel.** Google asked for your passkey before showing it: YouTube Studio → Settings → Permissions → Manage permissions.
- **The 10 YouTube videos' own descriptions** on YouTube are short, dated and mostly links. Rewriting them on YouTube would also give the website something to use for the missing video descriptions.
