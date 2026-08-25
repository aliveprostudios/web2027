// Inlined by Vite at build time. A runtime fs read would resolve against the
// bundled server output, not the repo, and fail during prerender.
import videosMarkdown from '../../content/work/videos.md?raw';
import heroVideosMarkdown from '../../content/work/hero-videos.md?raw';

/**
 * Hero videos, assigned per SECTION (STYLEGUIDE.md §4.1, §7).
 *
 * `content/work/hero-videos.md` is the control surface and carries its own
 * instructions. Each `## Heading` is a section; the links beneath it are that
 * section's pool. A section with ONE link always shows that link, which is how
 * the home page is pinned.
 *
 * Within a pool the pick is by route hash, not random, so a given page keeps
 * "its" video across rebuilds and the site does not reshuffle on deploy.
 *
 * Kept separate from `content/work/videos.md`, which drives the /work/videos
 * gallery. One file doing both jobs meant removing a video from the gallery
 * silently pulled it out of the hero rotation too.
 */

export type HeroVideo = { provider: 'vimeo' | 'youtube'; id: string };

/** Any Vimeo or YouTube URL in the shapes you would copy from an address bar. */
export function parseVideoUrl(text: string): HeroVideo | null {
  const vimeo = text.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return { provider: 'vimeo', id: vimeo[1]! };

  const youtube = text.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{6,})/,
  );
  if (youtube) return { provider: 'youtube', id: youtube[1]! };

  return null;
}

/** "Alive Pro" -> "alive-pro", so a heading matches the first URL segment. */
function slugifySection(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const DEFAULT_SECTION = 'default';
const HOME_SECTION = 'home';

function parseSections(): Map<string, HeroVideo[]> {
  const sections = new Map<string, HeroVideo[]>();
  let current: string | null = null;

  for (const line of heroVideosMarkdown.replace(/\r\n/g, '\n').split('\n')) {
    const heading = line.match(/^##\s+(.+?)\s*$/);
    if (heading) {
      current = slugifySection(heading[1]!);
      if (!sections.has(current)) sections.set(current, []);
      continue;
    }

    if (!current) continue;
    const video = parseVideoUrl(line);
    if (!video) continue;

    const pool = sections.get(current)!;
    // A link repeated inside one section would double its odds.
    if (pool.some((v) => v.provider === video.provider && v.id === video.id)) continue;
    pool.push(video);
  }

  // "How to use this file" is a `##` heading too, and prose carries no links,
  // so empty sections are dropped rather than shadowing Default.
  for (const [name, pool] of sections) if (pool.length === 0) sections.delete(name);

  return sections;
}

const SECTIONS: Map<string, HeroVideo[]> = parseSections();

/** Every video referenced anywhere, used only for the empty-pool guard. */
export const HERO_VIDEOS: HeroVideo[] = [...SECTIONS.values()].flat();

/** Stable 32-bit hash. Same string always yields the same index. */
function hash(input: string): number {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h * 31 + input.charCodeAt(i)) >>> 0;
  }
  return h;
}

/** "/execution/photography" -> "execution". "/" -> "home". */
export function sectionForRoute(pathname: string): string {
  const first = pathname.split('/').filter(Boolean)[0];
  return first ? first.toLowerCase() : HOME_SECTION;
}

/**
 * Deterministic pick: a route always resolves to the same video.
 *
 * Falls back to `## Default`, then to anything at all, so a page never loses
 * its video because a section was renamed or emptied.
 */
export function videoForRoute(pathname: string): HeroVideo | null {
  const pool =
    SECTIONS.get(sectionForRoute(pathname)) ??
    SECTIONS.get(DEFAULT_SECTION) ??
    HERO_VIDEOS;

  if (pool.length === 0) return null;
  return pool[hash(pathname) % pool.length]!;
}

/** Background-embed URL: autoplay, muted, looping, no controls, no chrome. */
export function embedUrl(video: HeroVideo): string {
  if (video.provider === 'vimeo') {
    return `https://player.vimeo.com/video/${video.id}?autoplay=1&muted=1&loop=1&background=1&controls=0&dnt=1&playsinline=1`;
  }
  // YouTube needs `playlist` set to its own id for a single video to loop.
  // `fs=0` and `iv_load_policy=3` strip the fullscreen button and annotation
  // cards, but YouTube's own logo watermark cannot be removed via any public
  // embed param, unlike Vimeo's `background=1` mode above. A Vimeo source is
  // the only way to get a fully chrome-free loop on this site.
  return `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&mute=1&loop=1&playlist=${video.id}&controls=0&modestbranding=1&playsinline=1&rel=0&disablekb=1&fs=0&iv_load_policy=3`;
}

// ---------------------------------------------------------------- aspect ---

import videoMeta from '../../content/work/video-meta.json';

type Dimensions = { width: number; height: number; title?: string; poster?: string };
const META = videoMeta as Record<string, Dimensions>;

/** The frame every hero video is fitted into (STYLEGUIDE.md §4.1). */
export const FRAME_ASPECT = 1280 / 600;

/**
 * True aspect of the source, from `content/work/video-meta.json` (generated by
 * scripts/fetch-video-meta.mjs from each provider's oEmbed endpoint).
 *
 * Never hardcode a media aspect ratio: the frame is 2.13:1 and the sources are
 * not, so the embed has to be scaled to cover using the real number or it
 * pillarboxes inside its own iframe.
 */
export function aspectOf(video: HeroVideo): number {
  const dims = META[`${video.provider}:${video.id}`];
  if (!dims || !dims.height) return 16 / 9;
  return dims.width / dims.height;
}

// ------------------------------------------------------- the video library ---

/**
 * Full video library for /work/videos, parsed from the `## All videos` table in
 * `content/work/videos.md`. Titles, tags, and the filter-tab counts all come
 * from that table, so adding a row adds a tile and updates its tab count with
 * no code change.
 */
export type LibraryVideo = HeroVideo & {
  n: number;
  title: string;
  tags: string[];
  /** Filename in content/assets/video-posters, when one was fetched. */
  poster: string | null;
  width: number;
  height: number;
};

function parseLibrary(): LibraryVideo[] {
  const start = videosMarkdown.indexOf('## All videos');
  const end = videosMarkdown.indexOf('## Plain URL list');
  const table = videosMarkdown.slice(start === -1 ? 0 : start, end === -1 ? undefined : end);

  const out: LibraryVideo[] = [];

  for (const line of table.split('\n')) {
    // | # | Title | URL | Tags | Client | Year |
    //
    // Titles carry "|" as a visual separator ("Bellini Modern Living | Brand
    // Video"), so the row cannot be split blindly into fixed positions: doing
    // that puts the subtitle in the URL column and silently drops the video.
    // Locate the URL cell first, then the title is everything between the
    // number and it. An escaped \| is honoured too, so the file stays a valid
    // Markdown table if it is ever authored that way.
    const cells = line.split(/(?<!\\)\|/).map((c) => c.trim().replace(/\\\|/g, '|'));
    if (cells.length < 6) continue;
    const num = cells[1];
    if (!num || !/^\d+$/.test(num)) continue;

    const URL_RE = /vimeo\.com\/\d+|(?:youtube\.com\/watch\?v=|youtu\.be\/)[\w-]{6,}/;
    const urlAt = cells.findIndex((c, i) => i > 1 && URL_RE.test(c));
    if (urlAt === -1) {
      // Loud on purpose. A row with a mistyped URL used to disappear from the
      // page with no error, which is how four videos went missing at once.
      throw new Error(
        `content/work/videos.md row ${num} has no Vimeo or YouTube URL in it. ` +
          `Check the pipes: every cell boundary is a "|".\n  ${line.trim()}`,
      );
    }
    const title = cells.slice(2, urlAt).join(' | ');
    const url = cells[urlAt];
    const tags = cells[urlAt + 1];

    const vimeo = url?.match(/vimeo\.com\/(\d+)/);
    const youtube = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{6,})/);
    const base: HeroVideo | null = vimeo
      ? { provider: 'vimeo', id: vimeo[1]! }
      : youtube
        ? { provider: 'youtube', id: youtube[1]! }
        : null;
    if (!base) continue;

    const dims = META[`${base.provider}:${base.id}`];
    out.push({
      ...base,
      n: Number(num),
      title: title ?? '',
      tags: (tags ?? '').split(/\s*,\s*/).filter(Boolean),
      poster: dims?.poster ?? null,
      width: dims?.width ?? 1280,
      height: dims?.height ?? 720,
    });
  }

  return out.sort((a, b) => a.n - b.n);
}

export const VIDEO_LIBRARY: LibraryVideo[] = parseLibrary();

/** Filter tabs, derived from the tags actually present. Counts are automatic. */
export function videoTags(): Array<{ label: string; count: number }> {
  const counts = new Map<string, number>();
  for (const video of VIDEO_LIBRARY) {
    for (const tag of video.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

/** Watch embed: unlike the hero pool this one keeps controls and sound. */
export function watchUrl(video: HeroVideo): string {
  return video.provider === 'vimeo'
    ? `https://player.vimeo.com/video/${video.id}?autoplay=1&dnt=1&playsinline=1`
    : `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&playsinline=1&rel=0`;
}
