import { getCollection, type CollectionEntry } from 'astro:content';
import { SECTIONS, sectionLabel, type Section } from './sections';
import { parseLanding } from './landing';

/**
 * Navigation and Related Services data, built from the content collection at
 * build time.
 *
 * NEVER hard-code these lists. Menu items are added, renamed, and removed
 * constantly; the nav accordion, the Related Services rows, and the section
 * counts all read from here so a new Markdown file is the only change required
 * (STYLEGUIDE.md §7, §9 Clarifications).
 */

export type NavChild = { title: string; url: string };

export type NavItem = {
  num: string;
  label: string;
  url: string;
  children: NavChild[];
};

/** The 8 Alive Pro pages carry no `url:`; everything else does. */
function pageUrl(entry: CollectionEntry<'pages'>): string {
  return entry.data.url ?? `/alive-pro/${entry.id}`;
}

/**
 * Section pages are sequenced by editorial priority, not alphabetically: Growth
 * runs demand generation to nurture to retention to search, Execution starts at
 * Web Solutions. That sequence lives in each page's `order` frontmatter, so the
 * collection stays the source of truth and no list is hard-coded here.
 *
 * A page with no `order` falls to the end in alphabetical order rather than
 * disappearing or landing first, so dropping in a new Markdown file still shows
 * up with no code change.
 */
function byOrderThenTitle(
  a: { data: { order?: number; title: string } },
  b: { data: { order?: number; title: string } },
) {
  const ao = a.data.order ?? Number.MAX_SAFE_INTEGER;
  const bo = b.data.order ?? Number.MAX_SAFE_INTEGER;
  if (ao !== bo) return ao - bo;
  return a.data.title.localeCompare(b.data.title);
}

/** Every page in a section, in collection order. */
export async function servicesInSection(section: Section): Promise<NavChild[]> {
  const all = await getCollection('services', (e) => e.data.category === section);
  return all
    .sort(byOrderThenTitle)
    .map((e) => ({
      title: e.data.navLabel ?? e.data.title,
      url: e.data.url ?? `/${section}/${e.id.split('/').pop()}`,
    }));
}

/**
 * Work's children (Portfolio, Videos) are pages rather than collection entries,
 * so they come from `content/landing/work.md` instead. Still not hard-coded:
 * adding a `## Name` row to that file adds the nav entry.
 */
export async function workPages(): Promise<NavChild[]> {
  const landing = await parseLanding('work', '/work');
  return (landing?.children ?? []).map((child) => ({ title: child.name, url: child.url }));
}

/**
 * Case Studies children, straight from the collection.
 *
 * Its own top-level row rather than a child of Work: these are the proof a
 * prospect is sent to read, not a gallery to browse. The route stays under
 * /work/case-studies, which is where the section was built and approved.
 *
 * `client` is the menu label when the H1 is a headline rather than a name.
 */
export async function caseStudyPages(): Promise<NavChild[]> {
  const all = await getCollection('caseStudies', (e) => e.data.published !== false);
  return all
    .sort(byOrderThenTitle)
    .map((e) => ({
      title: e.data.navLabel ?? e.data.client ?? e.data.title,
      url: `/work/case-studies/${e.id}`,
    }));
}

/** Resources children (Brochure, Blog) from content/landing/resources.md. */
export async function resourcesPages(): Promise<NavChild[]> {
  const landing = await parseLanding('resources', '/resources');
  return (landing?.children ?? []).map((child) => ({ title: child.name, url: child.url }));
}

export async function aliveProPages(): Promise<NavChild[]> {
  // `published: false` removes a page from the menu, the Alive Pro landing rows
  // and Related Services in one place, since all three read from here.
  const all = await getCollection('pages', (e) => !e.data.url && e.data.published !== false);
  return all.sort(byOrderThenTitle).map((e) => ({ title: e.data.navLabel ?? e.data.title, url: pageUrl(e) }));
}

/**
 * The 9 primary menu rows (§4.2). Foundation, Execution, Growth, Infrastructure,
 * Work, Case Studies, Alive Pro and Resources expand into accordions; Contact is
 * a direct link. Case Studies was added after Work on 2026-09-01.
 */
/**
 * An accordion row is a toggle, not a link (STYLEGUIDE.md §4.2), which left
 * every section's own landing page unreachable from the menu. Prepending an
 * overview entry makes the landing reachable while leaving the specced row
 * behaviour untouched.
 */
function withOverview(item: NavItem): NavItem {
  if (item.children.length === 0) return item;
  return {
    ...item,
    children: [{ title: `${item.label} Overview`, url: item.url }, ...item.children],
  };
}


/**
 * Menu rows that are built but NOT published.
 *
 * Resources was pulled on 2026-08-23 and RESTORED on 2026-08-30, once the blog
 * carried real articles. `/resources` and `/resources/blog` are live again;
 * `brochure.astro` stays parked in `src/pages/_resources/` because its content
 * is still not ready. The FAQ row was retired on 2026-09-01, when the Common
 * Questions section replaced it. Common Questions had its own top-level row for
 * one day; on 2026-09-02 Javad moved it under Resources, where the FAQ had
 * lived, so it is a Resources child from `content/landing/resources.md` now.
 *
 * Nothing links to those two: the Resources sub-menu and the landing rows are
 * both built from the NUMBERED `##` headings in `content/landing/resources.md`,
 * and their numbers were removed, so `parseLanding` skips them (landing.ts).
 * Restore a number line and the row, the menu entry and the count all come back.
 *
 * To pull a whole row again: add its label here and move its routes back under
 * an underscore directory.
 */
const UNPUBLISHED = new Set<string>([]);

export async function navItems(): Promise<NavItem[]> {
  const sectionItems: Omit<NavItem, 'num'>[] = await Promise.all(
    SECTIONS.map(async (section) => ({
      label: sectionLabel(section),
      url: `/${section}`,
      children: await servicesInSection(section),
    })),
  );

  const rows: Omit<NavItem, 'num'>[] = [
    ...sectionItems,
    { label: 'Work', url: '/work', children: await workPages() },
    { label: 'Case Studies', url: '/work/case-studies', children: await caseStudyPages() },
    { label: 'Alive Pro', url: '/alive-pro', children: await aliveProPages() },
    { label: 'Resources', url: '/resources', children: await resourcesPages() },
    { label: 'Contact', url: '/contact', children: [] },
  ];

  // Number AFTER filtering, so pulling a row leaves no gap in the sequence.
  return rows
    .filter((row) => !UNPUBLISHED.has(row.label))
    .map((row, i) => withOverview({ ...row, num: String(i + 1).padStart(2, '0') }));
}

function numbered(items: NavChild[], excludeUrl: string) {
  return items
    .filter((item) => item.url !== excludeUrl)
    .map((item, i) => ({ ...item, num: String(i + 1).padStart(2, '0') }));
}

/**
 * Related Services rows: every page in this page's section except this one,
 * numbered in collection order, count auto.
 */
export async function relatedServices(section: Section, excludeUrl: string) {
  return numbered(await servicesInSection(section), excludeUrl);
}

/** The same, for the Alive Pro group, which is not one of the four pillars. */
export async function relatedAlivePro(excludeUrl: string) {
  return numbered(await aliveProPages(), excludeUrl);
}
