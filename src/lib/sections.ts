/**
 * Section (pillar) metadata.
 *
 * The stage index drives the breadcrumb eyebrow ("FOUNDATION · STAGE 01"), which
 * is derived from the route and never hard-coded per page (STYLEGUIDE.md §7).
 *
 * The service LISTS themselves are not here. Those come from the content
 * collection, always (§9 Clarifications).
 */

export const SECTIONS = ['foundation', 'execution', 'growth', 'infrastructure'] as const;

export type Section = (typeof SECTIONS)[number];

const LABELS: Record<Section, string> = {
  foundation: 'Foundation',
  execution: 'Execution',
  growth: 'Growth',
  infrastructure: 'Infrastructure',
};

export function isSection(value: string): value is Section {
  return (SECTIONS as readonly string[]).includes(value);
}

export function sectionLabel(section: Section): string {
  return LABELS[section];
}

/** 1-based stage number: Foundation 01, Execution 02, Growth 03, Infrastructure 04. */
export function stageIndex(section: Section): string {
  return String(SECTIONS.indexOf(section) + 1).padStart(2, '0');
}

/** "Foundation · Stage 01" */
export function breadcrumb(section: Section): string {
  return `${sectionLabel(section)}  ·  Stage ${stageIndex(section)}`;
}
