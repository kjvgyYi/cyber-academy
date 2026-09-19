import YAML from 'yaml';

export interface Parsed<T> {
  data: T;
  body: string;
}

const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/;

/** Splits "---\nyaml\n---\nbody" into data and body. */
export function parseFrontmatter<T = Record<string, unknown>>(raw: string): Parsed<T> {
  const match = FRONTMATTER.exec(raw);
  if (!match) return { data: {} as T, body: raw };
  return { data: (YAML.parse(match[1]) ?? {}) as T, body: match[2] };
}

export function parseYaml<T>(raw: string): T {
  return YAML.parse(raw) as T;
}

/** Returns the raw text of every fenced block with the given language. */
export function extractFencedBlocks(body: string, lang: string): string[] {
  const re = new RegExp('^```' + lang + '\\s*\\n([\\s\\S]*?)^```', 'gm');
  const out: string[] = [];
  for (const m of body.matchAll(re)) out.push(m[1]);
  return out;
}

export interface Section {
  id: string;
  title: string;
  body: string;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-');
}

/**
 * Splits a lesson body into "## " sections, ignoring headings inside code fences.
 * Text before the first heading becomes an untitled intro section.
 */
export function splitSections(body: string): Section[] {
  const lines = body.split(/\r?\n/);
  const sections: Section[] = [];
  let current: Section = { id: 'intro', title: '', body: '' };
  let fence = '';
  const used = new Set<string>();

  for (const line of lines) {
    const marker = /^(`{3,}|~{3,})/.exec(line)?.[1];
    if (marker) {
      if (!fence) fence = marker;
      else if (marker.length >= fence.length && marker[0] === fence[0] && line.trim() === marker) fence = '';
    }
    const heading = !fence && !marker && /^## (.+)$/.exec(line);
    if (heading) {
      if (current.title || current.body.trim()) sections.push(current);
      let id = slugify(heading[1]) || `section-${sections.length}`;
      while (used.has(id)) id += '-x';
      used.add(id);
      current = { id, title: heading[1].trim(), body: '' };
    } else {
      current.body += line + '\n';
    }
  }
  if (current.title || current.body.trim()) sections.push(current);
  return sections;
}

/** Plain text for search: drops code fences markers, markdown symbols and YAML keys noise. */
export function toPlainText(md: string): string {
  return md
    .replace(/```\w*/g, ' ')
    .replace(/[#>*_`|[\]()-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function normalizeAnswer(s: string): string {
  return s.trim().replace(/\s+/g, ' ').toLowerCase();
}
