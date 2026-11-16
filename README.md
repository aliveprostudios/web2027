# aliveprostudios.com

The website of Alive ProStudios Inc., a boutique brand transformation studio in
Toronto, founded in 1997. Live at **https://aliveprostudios.com**.

Built with **Astro**, fully static, served by **Cloudflare Workers**. There is no
CMS: every word on the site is Markdown in `content/`, edited in this repository.

## Start here

| File | What it holds |
|---|---|
| [`CLAUDE.md`](CLAUDE.md) | The project's working memory: decisions already made, current state, content rules, traps already hit, and known gaps. **Read it before changing anything.** |
| [`TEMPLATE-ANATOMY.md`](TEMPLATE-ANATOMY.md) | How the page templates map Markdown to slots. Read before touching a template or a route. |
| [`SITEMAP.md`](SITEMAP.md) | Every route, and the redirect table that `scripts/postbuild.mjs` turns into `dist/_redirects`. |
| [`ANALYTICS.md`](ANALYTICS.md) | GA4, Search Console, Tag Manager, Google Ads, Meta and LinkedIn: every ID, what works, what was changed and when. Read before touching any of them. |
| [`TASKS.md`](TASKS.md) | Open work, with what is waiting on whom. |
| [`docs/audits/`](docs/audits/) | Dated audits, the redirect map, and copy drafts awaiting approval. |

## Commands

```bash
npm run build        # build, then generate _headers, _redirects, robots.txt, llms.txt
npm run preview      # build, then serve through wrangler with headers and redirects
npm run check        # astro check
npm run video-meta   # refresh video dimensions, posters and upload dates
```

Verify through `npm run preview`, not `astro dev`: a plain dev server applies
neither the headers nor the redirects. Redirect behaviour can still differ on
Cloudflare itself (see the wildcard trap in `CLAUDE.md`), so test redirects on
staging too.

## Deploying

| Branch | Deploys to |
|---|---|
| `staging` | https://staging-aliveprostudios.javad-ade.workers.dev (noindex) |
| `main` | https://aliveprostudios.com |

A push deploys automatically. Changes go to `staging` first, are verified there,
then `main` is fast-forwarded to `staging`. Staging is kept out of search
engines by an `X-Robots-Tag: noindex` header and a disallow-all `robots.txt`.

## Content rules, in brief

Canadian English. No em dashes. Never the words "honest" or "honestly". Never a
price, range or percentage for what anything costs. Never invent copy: a slot
with no source is left empty. The full rules are in `CLAUDE.md`.
