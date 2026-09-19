import type { Challenge, Course, CourseModule, Lesson, Project } from '@/content/types';
import type { ProgressState } from './progress';

export type Status = 'not_started' | 'in_progress' | 'completed' | 'locked';

export function lessonStatus(p: ProgressState, lesson: Lesson): Status {
  const s = p.lessons[lesson.id];
  return s === 'completed' ? 'completed' : s === 'in_progress' ? 'in_progress' : 'not_started';
}

export function moduleCompletion(p: ProgressState, m: CourseModule) {
  const total = m.lessons.length;
  const done = m.lessons.filter((l) => p.lessons[l.id] === 'completed').length;
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

export function moduleStatus(p: ProgressState, course: Course, m: CourseModule): Status {
  if (!m.available) return 'locked';
  const { done, total } = moduleCompletion(p, m);
  if (total > 0 && done === total) return 'completed';
  const started = m.lessons.some((l) => p.lessons[l.id]);
  if (started) return 'in_progress';
  if (p.unlockAll) return 'not_started';
  const idx = course.modules.indexOf(m);
  const prev = course.modules.slice(0, idx).filter((x) => x.available).pop();
  if (prev && moduleCompletion(p, prev).pct < 100) return 'locked';
  return 'not_started';
}

export function courseCompletion(p: ProgressState, course: Course) {
  // Planned modules count by their estimated size so the bar reflects the whole course.
  const total = course.lessons.length;
  const done = course.lessons.filter((l) => p.lessons[l.id] === 'completed').length;
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

/** The lesson to continue: last opened unfinished lesson, else first unfinished in order. */
export function nextLesson(p: ProgressState, ordered: Lesson[]): Lesson | undefined {
  const last = ordered.find((l) => l.id === p.lastLesson);
  if (last && p.lessons[last.id] !== 'completed') return last;
  return ordered.find((l) => p.lessons[l.id] !== 'completed');
}

export function projectStatus(p: ProgressState, course: Course, project: Project): Status {
  const s = p.projects[project.id];
  if (s) return s;
  if (p.unlockAll) return 'not_started';
  const m = course.modules.find((x) => x.number === project.module);
  if (!m || !m.available) return 'locked';
  return moduleStatus(p, course, m) === 'locked' ? 'locked' : 'not_started';
}

export function challengeStatus(p: ProgressState, c: Challenge): Status {
  if (p.challenges[c.id]) return 'completed';
  if (!c.unlockAfter || p.unlockAll) return 'not_started';
  return p.lessons[c.unlockAfter] === 'completed' ? 'not_started' : 'locked';
}

export function quizAverage(p: ProgressState): number | null {
  const results = Object.values(p.quizzes);
  if (!results.length) return null;
  const sum = results.reduce((acc, r) => acc + (r.total ? r.best / r.total : 0), 0);
  return Math.round((sum / results.length) * 100);
}

export function formatDuration(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (h) return `${h} ч ${m} мин`;
  return `${m} мин`;
}
