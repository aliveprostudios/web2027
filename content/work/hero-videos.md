---
title: "Hero video assignments"
source: "authored 2026-08-24"
---

# Hero videos

Every page on the site carries an edge-to-edge looping background video. This
file decides which one. Edit it and rebuild; nothing else needs touching.

## How to use this file

**One URL under a heading means every page in that section uses that video.**
That is how `## Home` is set up, so the home page is never a surprise.

**Two or more URLs means the pages in that section spread across them.** The
choice is fixed per page, not random: `/growth/lead-generation` resolves to the
same video on every build, so the site does not reshuffle when you deploy.

**Sections match the top-level URL.** `/execution/photography` reads
`## Execution`. Anything with no section of its own falls to `## Default`:
`/contact`, `/privacy-policy`, `/thank-you`, `/404`.

**To pin one single page**, put `videoId` in that page's own frontmatter with a
full Vimeo or YouTube URL. That beats everything here.

Both Vimeo and YouTube links work, in any format you would normally copy from
the address bar. Lines that are not links are ignored, so write notes freely.
Delete a whole section and it falls back to Default.

One thing to know: adding or removing a URL inside a section reshuffles which
video the other pages in THAT section get. Sections with a single URL never
move. Nothing outside the edited section is affected.

**The arrangement below is a starting point, grouped roughly by subject. Move
the lines around freely.**

## Home

https://youtu.be/fch5EecRUSE

## Foundation

https://vimeo.com/943871850
https://vimeo.com/465976202
https://www.youtube.com/watch?v=aHA7-3GgaJk

## Execution

https://vimeo.com/1164689131
https://vimeo.com/621071497
https://vimeo.com/528293787
https://vimeo.com/807475567
https://www.youtube.com/watch?v=GLFMdn3BW5U

## Growth

https://vimeo.com/1210526678
https://vimeo.com/926410644
https://vimeo.com/996727685
https://www.youtube.com/watch?v=OL3-EaomQbU
https://www.youtube.com/watch?v=GqqRMsKU-pM

## Infrastructure

https://vimeo.com/1018991594
https://vimeo.com/731000077
https://www.youtube.com/watch?v=TWiz0vpnRUs
https://www.youtube.com/watch?v=u5cpinXDlxY

## Work

https://vimeo.com/578035784
https://vimeo.com/468519838
https://vimeo.com/1009310104
https://www.youtube.com/watch?v=Fk2npFAjPsc

## Alive Pro

https://vimeo.com/517615313
https://vimeo.com/750915718
https://vimeo.com/336615361

## Default

https://www.youtube.com/watch?v=1_F4c33ZLWw
https://vimeo.com/1210526678
