/**
 * Markdown -> template slot mapping.
 *
 * THE RULE (STYLEGUIDE.md §9 Clarifications): extract by TYPE, place by SLOT.
 * Not document order. A `>` blockquote sitting mid-document is hoisted into its
 * own quote band; the final paragraph becomes the closing statement wherever it
 * happens to sit.
 *
 * Nothing here invents copy. A slot with no source is omitted, not filled.
 *
 * See TEMPLATE-ANATOMY.md §4 for the full table this implements.
 */

/* ---------------------------------------------------------------- escaping */

/** Escape first, always. Content is repo-authored but never trusted raw. */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** Minimal inline Markdown, applied to already-escaped text. */
function inline(text: string): string {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');
}

/* ---------------------------------------------------------------- two-tone */

/**
 * Display copy is two-tone: part of it drops to `--pg-fg3`.
 *
 * Placement varies by design intent, so it is authored, not guessed. Wrap the
 * muted span in single-asterisk emphasis to place it explicitly. With no
 * emphasis marker the default is the last sentence, which is what the approved
 * hero statement does.
 */
export type TwoTone = { lead: string; muted: string; tail: string };

export function twoTone(text: string): TwoTone {
  const explicit = text.match(/^([\s\S]*?)(?<!\*)\*(?!\*)([\s\S]+?)(?<!\*)\*(?!\*)([\s\S]*)$/);
  if (explicit) {
    return {
      lead: inline(explicit[1]!.trim()),
      muted: inline(explicit[2]!.trim()),
      tail: inline(explicit[3]!.trim()),
    };
  }

  const sentences = splitSentences(text);
  if (sentences.length < 2) return { lead: inline(text), muted: '', tail: '' };

  return {
    lead: inline(sentences.slice(0, -1).join(' ')),
    muted: inline(sentences[sentences.length - 1]!),
    tail: '',
  };
}

/** Sentence split that tolerates curly apostrophes and trailing quotes. */
export function splitSentences(text: string): string[] {
  return text
    .trim()
    .split(/(?<=[.!?][""'’”]?)\s+(?=[A-Z“"'])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/* ------------------------------------------------------------------ blocks */

export type Block =
  | { kind: 'p'; html: string }
  | { kind: 'list'; label: string | null; items: string[] }
  /**
   * A standalone Markdown image.
   *
   * `full` goes edge to edge, outside the row grid. `portrait` and `aside` both
   * sit INSIDE the row beside the text; `portrait` is cropped to the 4:5 people
   * ratio so headshots line up, `aside` keeps the image's own shape, which is
   * what a tall object like an award needs.
   *
   * The variant comes from the image's Markdown title:
   *   `![alt](/assets/people/x.jpg "portrait")`
   */
  | { kind: 'image'; src: string; alt: string; variant: 'full' | 'portrait' | 'aside' };

/**
 * A slot-4 entry, either a section head or an item inside one.
 *
 * `num` is decided HERE, not by the template's map index, so the numbering rule
 * lives in one place. It is null for every section head, and also for an item in
 * a section that was opened with `***` rather than `---`.
 */
/** `Block` narrowed to the image case, so `.filter()` can carry the type. */
export type ImageBlock = Extract<Block, { kind: 'image' }>;
export const isImageBlock = (block: Block): block is ImageBlock => block.kind === 'image';

export type Row = {
  heading: string;
  blocks: Block[];
  num: string | null;
  /** True for a section head: full width, no hairline, H2 scale. */
  section: boolean;
};

export type Anatomy = {
  /** Slot 3 H2: the document's first heading. */
  h2: string | null;
  /** Slot 1c fallback. Only set when frontmatter carries no `caption`. */
  caption: string | null;
  /** Slot 3 H4 statement. */
  statement: TwoTone | null;
  /** Slot 3 body copy: intro paragraphs after the statement. */
  intro: Block[];
  /** Slot 3 stat block. */
  stat: { figure: string; caption: TwoTone } | null;
  /** Slot 4 numbered rows, one per heading after the first. */
  rows: Row[];
  /** Slot 5 quote band. Hoisted out of document order. */
  quote: { html: string; name: string; role: string } | null;
  /** Slot 6 closing statement: the document's final paragraph. */
  closing: TwoTone | null;
};

type Raw =
  /** `numbered` distinguishes a `---` break from a `***` one. */
  | { type: 'break'; numbered: boolean }
  | { type: 'image'; src: string; alt: string; variant: 'full' | 'portrait' | 'aside' }
  | { type: 'heading'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'bold'; text: string }
  | { type: 'p'; text: string };

/** Split the body on blank lines and classify each chunk by type. */
function tokenize(body: string): Raw[] {
  const chunks = body
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((c) => c.trim())
    .filter(Boolean);

  return chunks.map((chunk): Raw => {
    // A Markdown thematic break is the SECTION BREAK marker. The heading that
    // follows it starts a new standalone section, always unnumbered itself.
    // CommonMark treats `---`, `___` and `***` as the same thematic break, which
    // leaves the character free to carry which KIND of section it opens:
    //   `---` (or `___`)  items beneath it are numbered, restarting at 01
    //   `***`             items beneath it carry no number at all
    if (/^(-{3,}|_{3,})$/.test(chunk)) return { type: 'break', numbered: true };
    if (/^\*{3,}$/.test(chunk)) return { type: 'break', numbered: false };

    // A paragraph that is nothing but an image: `![alt](/assets/thing.svg)`.
    // Only site-absolute paths, so the src cannot reach off-origin.
    // An optional Markdown title carries the layout variant.
    const image = chunk.match(/^!\[([^\]]*)\]\((\/[^)\s]+)(?:\s+"([^"]*)")?\)$/);
    if (image) {
      return {
        type: 'image',
        src: image[2]!,
        alt: image[1]!.trim(),
        variant:
          image[3]?.trim() === 'portrait'
            ? 'portrait'
            : image[3]?.trim() === 'aside'
              ? 'aside'
              : 'full',
      };
    }

    const heading = chunk.match(/^#{2,6}\s+(.*)$/);
    if (heading) return { type: 'heading', text: heading[1]!.trim() };

    if (/^>/.test(chunk)) {
      const text = chunk
        .split('\n')
        .map((l) => l.replace(/^>\s?/, ''))
        .join(' ')
        .replace(/^\*(.*)\*$/s, '$1')
        .trim();
      return { type: 'quote', text };
    }

    if (/^[-*+]\s+/m.test(chunk) && chunk.split('\n').every((l) => /^[-*+]\s+/.test(l.trim()))) {
      const items = chunk
        .split('\n')
        .map((l) => l.trim().replace(/^[-*+]\s+/, ''))
        .filter(Boolean);
      return { type: 'list', items };
    }

    // A paragraph that is entirely bold: a stat line, a label, or an attribution.
    const boldOnly = chunk.match(/^\*\*(.+)\*\*$/s);
    if (boldOnly && !/\n/.test(chunk)) {
      return { type: 'bold', text: chunk.replace(/\*\*/g, '').trim() };
    }

    return { type: 'p', text: chunk.replace(/\n/g, ' ').trim() };
  });
}

/** A stat line leads with its figure: "72% of the best brand names ...". */
function asStat(text: string): { figure: string; caption: TwoTone } | null {
  const match = text.match(/^([\d.,]+\s*(?:%|x|\+|k|m)?)\s+(.+)$/i);
  if (!match) return null;
  return { figure: match[1]!.trim(), caption: twoTone(match[2]!.trim()) };
}

/** "Javad Ahmadi, Brand Transformation Architect" */
function asAttribution(text: string): { name: string; role: string } {
  const [name, ...rest] = text.split(',');
  return { name: (name ?? '').trim(), role: rest.join(',').trim() };
}

/* ------------------------------------------------------------------ parser */

export type AnatomyOptions = {
  /**
   * Whether the document's final paragraph is lifted into the slot 6 closing
   * statement. True by default, which is right for a marketing page.
   *
   * Set false when the last paragraph is body copy that belongs where it sits.
   * On About Us it is the second half of the award story, and hoisting it left
   * that section as a heading and a photograph with nothing under it.
   */
  closing?: boolean;
};

export function parseAnatomy(
  body: string,
  frontmatterCaption?: string,
  options: AnatomyOptions = {},
): Anatomy {
  const tokens = tokenize(body);

  const result: Anatomy = {
    h2: null,
    caption: null,
    statement: null,
    intro: [],
    stat: null,
    rows: [],
    quote: null,
    closing: null,
  };

  // Hoist the quote band and its attribution out of the flow first, so document
  // order cannot place them into a numbered row.
  const flow: Raw[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i]!;
    if (token.type === 'quote' && !result.quote) {
      const next = tokens[i + 1];
      const attribution =
        next?.type === 'bold' && !asStat(next.text)
          ? asAttribution(next.text)
          : { name: '', role: '' };
      if (next?.type === 'bold' && !asStat(next.text)) i++;
      result.quote = { html: inline(token.text), ...attribution };
      continue;
    }
    flow.push(token);
  }

  // The document's final paragraph is the closing statement, wherever it sits.
  for (let i = flow.length - 1; options.closing !== false && i >= 0; i--) {
    if (flow[i]!.type === 'p') {
      result.closing = twoTone((flow[i] as { text: string }).text);
      flow.splice(i, 1);
      break;
    }
  }

  let seenHeading = false;
  let introParagraphs = 0;
  let currentRow: Row | null = null;
  /** Set by a thematic break; consumed by the next heading. */
  let pendingBreak: { numbered: boolean } | null = null;
  /** Whether the CURRENT section numbers its items. Pages with no break keep
   *  the original behaviour: one implicit numbered section for the whole page. */
  let sectionNumbers = true;
  /** Item counter WITHIN the current section. A section head resets it. */
  let itemNum = 0;

  const push = (block: Block) => {
    if (currentRow) currentRow.blocks.push(block);
    else result.intro.push(block);
  };

  for (let i = 0; i < flow.length; i++) {
    const token = flow[i]!;

    if (token.type === 'break') {
      pendingBreak = { numbered: token.numbered };
      continue;
    }

    if (token.type === 'heading') {
      if (!seenHeading && pendingBreak) {
        // A break BEFORE the first heading sets the numbering mode for the page
        // and opens no section. Testimonials needs this: its H1 already names
        // the section, so there is no heading to spare for a section head, and
        // every name has to be a plain unnumbered item.
        seenHeading = true;
        sectionNumbers = pendingBreak.numbered;
        pendingBreak = null;
        let num: string | null = null;
        if (sectionNumbers) {
          itemNum += 1;
          num = String(itemNum).padStart(2, '0');
        }
        currentRow = { heading: token.text, blocks: [], num, section: false };
        result.rows.push(currentRow);
      } else if (!seenHeading) {
        // First heading is the slot 3 H2, not a row.
        result.h2 = token.text;
        seenHeading = true;
        pendingBreak = null;
      } else if (pendingBreak) {
        // A section head. Never numbered itself; it decides whether the items
        // beneath it are, and the count starts over.
        sectionNumbers = pendingBreak.numbered;
        pendingBreak = null;
        itemNum = 0;
        currentRow = { heading: token.text, blocks: [], num: null, section: true };
        result.rows.push(currentRow);
      } else {
        let num: string | null = null;
        if (sectionNumbers) {
          itemNum += 1;
          num = String(itemNum).padStart(2, '0');
        }
        currentRow = { heading: token.text, blocks: [], num, section: false };
        result.rows.push(currentRow);
      }
      continue;
    }

    if (token.type === 'bold') {
      const stat = asStat(token.text);
      if (stat && !result.stat) {
        result.stat = stat;
        continue;
      }
      // A bold label introducing a list: "What the identity system includes:"
      const next = flow[i + 1];
      if (next?.type === 'list') {
        push({ kind: 'list', label: token.text.replace(/:$/, ''), items: next.items.map(inline) });
        i++;
        continue;
      }
      push({ kind: 'p', html: inline(`**${token.text}**`) });
      continue;
    }

    if (token.type === 'list') {
      push({ kind: 'list', label: null, items: token.items.map(inline) });
      continue;
    }

    if (token.type === 'image') {
      push({ kind: 'image', src: token.src, alt: token.alt, variant: token.variant });
      continue;
    }

    // Paragraph.
    if (!currentRow && introParagraphs === 0) {
      introParagraphs++;
      const sentences = splitSentences(token.text);

      if (frontmatterCaption) {
        // Caption is authored; the intro paragraph stays whole.
        result.statement = twoTone(token.text);
      } else if (sentences.length > 1) {
        // §9 fallback: first sentence is the caption, the remainder the statement.
        result.caption = sentences[0]!;
        result.statement = twoTone(sentences.slice(1).join(' '));
      } else {
        result.statement = twoTone(token.text);
      }
      continue;
    }

    push({ kind: 'p', html: inline(token.text) });
  }

  return result;
}
