import type { Course } from '@/content/types';
import { splitSections, slugify, toPlainText } from '@/content/parse';

export type SearchKind =
  | 'Модуль'
  | 'Урок'
  | 'Раздел урока'
  | 'Команда'
  | 'Инструмент'
  | 'Проект'
  | 'Лаборатория'
  | 'Challenge'
  | 'Ресурс';

export interface SearchEntry {
  kind: SearchKind;
  title: string;
  subtitle: string;
  href: string;
  text: string;
}

export function buildSearchIndex(course: Course): SearchEntry[] {
  const out: SearchEntry[] = [];

  for (const m of course.modules) {
    out.push({
      kind: 'Модуль',
      title: `Module ${m.number} — ${m.title}`,
      subtitle: m.available ? `${m.lessons.length} уроков` : 'В разработке',
      href: `/modules/${m.number}`,
      text: `${m.summary} ${toPlainText(m.body)}`,
    });
  }

  for (const l of course.lessons) {
    out.push({
      kind: 'Урок',
      title: l.title,
      subtitle: `Lesson ${l.id}`,
      href: `/lessons/${l.id}`,
      text: `${l.tags.join(' ')} ${toPlainText(l.body)}`,
    });
    for (const s of splitSections(l.body)) {
      if (!s.title) continue;
      out.push({
        kind: 'Раздел урока',
        title: s.title,
        subtitle: `Lesson ${l.id} · ${l.title}`,
        href: `/lessons/${l.id}#${slugify(s.title)}`,
        text: toPlainText(s.body),
      });
    }
  }

  for (const c of course.commands) {
    out.push({
      kind: 'Команда',
      title: c.name,
      subtitle: `${c.category} · ${c.purpose}`,
      href: `/reference/commands#cmd-${slugify(c.name)}`,
      text: `${c.purpose} ${c.syntax} ${c.security} ${c.examples.map((e) => e.cmd + ' ' + e.note).join(' ')}`,
    });
  }

  for (const t of course.tools) {
    out.push({
      kind: 'Инструмент',
      title: t.name,
      subtitle: `${t.category} · ${t.phase}`,
      href: `/reference/tools#tool-${slugify(t.name)}`,
      text: `${t.purpose} ${t.usage} ${t.example} ${t.output}`,
    });
  }

  for (const p of course.projects) {
    out.push({
      kind: 'Проект',
      title: p.title,
      subtitle: `Module ${p.module}`,
      href: `/projects/${p.id}`,
      text: `${p.summary} ${p.description} ${p.requirements.join(' ')}`,
    });
  }

  for (const lab of course.labs) {
    out.push({
      kind: 'Лаборатория',
      title: lab.title,
      subtitle: lab.category,
      href: `/labs/${lab.id}`,
      text: `${lab.objective} ${lab.environment.join(' ')} ${lab.tasks.map((t) => t.prompt).join(' ')}`,
    });
  }

  for (const c of course.challenges) {
    out.push({
      kind: 'Challenge',
      title: c.title,
      subtitle: `Challenge #${String(c.number).padStart(2, '0')}`,
      href: `/challenges#${c.id}`,
      text: `${c.scenario} ${c.skills.join(' ')}`,
    });
  }

  for (const cat of course.resources) {
    for (const r of cat.items) {
      out.push({
        kind: 'Ресурс',
        title: r.title,
        subtitle: cat.category,
        href: `/resources#res-${slugify(cat.category)}`,
        text: r.note,
      });
    }
  }

  return out;
}

export interface SearchHit extends SearchEntry {
  score: number;
  snippet: string;
}

function snippetAround(text: string, term: string): string {
  const idx = text.toLowerCase().indexOf(term);
  if (idx < 0) return text.slice(0, 110);
  const start = Math.max(0, idx - 45);
  return (start > 0 ? '…' : '') + text.slice(start, idx + 75) + '…';
}

/** Every term must match title or text; title matches rank higher. */
export function search(index: SearchEntry[], query: string, limit = 30): SearchHit[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const hits: SearchHit[] = [];
  for (const e of index) {
    const title = e.title.toLowerCase();
    const text = e.text.toLowerCase();
    let score = 0;
    let ok = true;
    for (const t of terms) {
      if (title === t) score += 20;
      else if (title.startsWith(t)) score += 12;
      else if (title.includes(t)) score += 8;
      else if (text.includes(t)) score += 1 + Math.min(3, text.split(t).length - 1) * 0.5;
      else {
        ok = false;
        break;
      }
    }
    if (!ok) continue;
    if (e.kind === 'Урок' || e.kind === 'Команда' || e.kind === 'Инструмент') score += 1;
    hits.push({ ...e, score, snippet: snippetAround(e.text, terms[0]) });
  }
  return hits.sort((a, b) => b.score - a.score).slice(0, limit);
}
