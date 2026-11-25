import markdown from '../../content/resources/marketing-insights-in-minutes.md?raw';
import { parseVideoUrl, posterName, uploadDateOf, watchUrl, type HeroVideo } from './videos';

/**
 * The Marketing Insights in Minutes series at `/resources/marketing-insights-in-minutes`, parsed from the table in
 * `content/resources/marketing-insights-in-minutes.md`. Adding a row adds a tile, with its
 * dimensions, poster and upload date coming from `npm run video-meta`.
 *
 * Kept apart from `content/work/videos.md` on purpose: that file is the work
 * library, with its own count and filter tabs.
 */
export type SeriesVideo = HeroVideo & {
  n: number;
  title: string;
  description: string;
  poster: string | null;
  uploadDate: string | null;
  embed: string;
};

function parse(): SeriesVideo[] {
  const out: SeriesVideo[] = [];
  for (const line of markdown.split('\n')) {
    // | # | Title | URL | Description |  (titles may carry "|", so locate the URL cell)
    const cells = line.split(/(?<!\\)\|/).map((c) => c.trim().replace(/\\\|/g, '|'));
    if (cells.length < 5 || !/^\d+$/.test(cells[1] ?? '')) continue;
    const urlAt = cells.findIndex((c, i) => i > 1 && parseVideoUrl(c));
    if (urlAt === -1) {
      throw new Error(`content/resources/marketing-insights-in-minutes.md row ${cells[1]} has no Vimeo or YouTube URL.\n  ${line}`);
    }
    const video = parseVideoUrl(cells[urlAt]!)!;
    out.push({
      ...video,
      n: Number(cells[1]),
      title: cells.slice(2, urlAt).join(' | '),
      description: cells[urlAt + 1] ?? '',
      poster: posterName(video),
      uploadDate: uploadDateOf(video),
      embed: watchUrl(video),
    });
  }
  return out.sort((a, b) => a.n - b.n);
}

export const SERIES: SeriesVideo[] = parse();
