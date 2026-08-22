/**
 * Fetch metadata for every video in `content/work/videos.md`:
 *
 *   1. Real pixel dimensions -> `content/work/video-meta.json`
 *   2. Poster frames         -> `content/assets/video-posters/{provider}-{id}.jpg`
 *
 * VideoHero needs each source's true aspect ratio to scale the embed to COVER
 * its 1280/600 frame. Hardcoding "16:9" is what produces letterboxed or
 * pillarboxed heroes when a source turns out to be something else, so the ratio
 * is derived from the asset and committed, never assumed at render time.
 *
 * The video wall on /work/videos shows a poster first and only loads the embed
 * on click (STYLEGUIDE.md §8: lazy video embeds with poster frames). Posters are
 * downloaded into the repo so they go through Astro Image like every other
 * asset, instead of hot-linking the providers on every page view.
 *
 * Run: node scripts/fetch-video-meta.mjs
 * Both outputs are committed, so a network failure at deploy time cannot break
 * the build.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const videosMd = fileURLToPath(new URL('../content/work/videos.md', import.meta.url));
const outFile = fileURLToPath(new URL('../content/work/video-meta.json', import.meta.url));
const posterDir = fileURLToPath(new URL('../content/assets/video-posters/', import.meta.url));

mkdirSync(posterDir, { recursive: true });

const md = readFileSync(videosMd, 'utf8');
const start = md.indexOf('## All videos');
const end = md.indexOf('## Plain URL list');
const table = md.slice(start === -1 ? 0 : start, end === -1 ? undefined : end);

const seen = new Set();
const videos = [];
for (const line of table.split('\n')) {
  const vimeo = line.match(/vimeo\.com\/(\d+)/);
  const youtube = line.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{6,})/);
  const found = vimeo
    ? { provider: 'vimeo', id: vimeo[1] }
    : youtube
      ? { provider: 'youtube', id: youtube[1] }
      : null;
  if (!found) continue;
  const key = `${found.provider}:${found.id}`;
  if (seen.has(key)) continue;
  seen.add(key);
  videos.push(found);
}

async function oembed(video) {
  const endpoint =
    video.provider === 'vimeo'
      ? `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${video.id}&width=1280`
      : `https://www.youtube.com/oembed?format=json&url=https://www.youtube.com/watch?v=${video.id}`;
  const response = await fetch(endpoint, { signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
}

/** YouTube oEmbed returns a 480px thumb; the /vi/ paths give a real poster. */
async function posterUrl(video, data) {
  if (video.provider === 'vimeo') return data.thumbnail_url ?? null;
  for (const name of ['maxresdefault', 'sddefault', 'hqdefault']) {
    const url = `https://i.ytimg.com/vi/${video.id}/${name}.jpg`;
    const head = await fetch(url, { method: 'HEAD', signal: AbortSignal.timeout(10000) });
    // YouTube serves a 120x90 grey placeholder rather than 404 for missing sizes.
    if (head.ok && Number(head.headers.get('content-length') ?? 0) > 12000) return url;
  }
  return data.thumbnail_url ?? null;
}

async function download(url, destination) {
  const response = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!response.ok) throw new Error(`poster HTTP ${response.status}`);
  writeFileSync(destination, Buffer.from(await response.arrayBuffer()));
}

const meta = {};
let posters = 0;

for (const video of videos) {
  const key = `${video.provider}:${video.id}`;
  try {
    const data = await oembed(video);
    if (!data.width || !data.height) throw new Error('no dimensions in oEmbed payload');
    meta[key] = { width: data.width, height: data.height, title: data.title ?? '' };

    const file = `${video.provider}-${video.id}.jpg`;
    const destination = `${posterDir}${file}`;
    if (existsSync(destination)) {
      meta[key].poster = file;
      posters++;
      console.log(`  ok  ${key} ${data.width}x${data.height} (poster cached)`);
      continue;
    }

    const poster = await posterUrl(video, data);
    if (poster) {
      await download(poster, destination);
      meta[key].poster = file;
      posters++;
    }
    console.log(`  ok  ${key} ${data.width}x${data.height}${poster ? ' + poster' : ' (no poster)'}`);
  } catch (error) {
    console.warn(`  !   ${key} — ${error.message}`);
  }
}

writeFileSync(outFile, `${JSON.stringify(meta, null, 2)}\n`);
console.log(
  `\n${Object.keys(meta).length}/${videos.length} entries, ${posters} posters -> content/assets/video-posters/`,
);
