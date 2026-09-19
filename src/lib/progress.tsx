import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export type ItemStatus = 'in_progress' | 'completed';

export interface QuizResult {
  best: number;
  last: number;
  total: number;
  attempts: number;
}

export interface ProgressState {
  version: 1;
  lessons: Record<string, ItemStatus>;
  tasks: Record<string, string>; // task id → ISO date completed
  quizzes: Record<string, QuizResult>;
  projects: Record<string, ItemStatus>;
  labs: Record<string, ItemStatus>;
  challenges: Record<string, string>;
  bookmarks: string[];
  /** Confirmed skill levels (raised by the learner after a checkpoint). */
  skills: Record<string, number>;
  /** Days (YYYY-MM-DD, local time) with learning activity. */
  activityDays: string[];
  timeSpentSec: number;
  lessonTimeSec: Record<string, number>;
  lastLesson?: string;
  /** Open every module regardless of order. */
  unlockAll: boolean;
}

export const STORAGE_KEY = 'cyber-academy:progress:v1';

export const emptyProgress = (): ProgressState => ({
  version: 1,
  lessons: {},
  tasks: {},
  quizzes: {},
  projects: {},
  labs: {},
  challenges: {},
  bookmarks: [],
  skills: {},
  activityDays: [],
  timeSpentSec: 0,
  lessonTimeSec: {},
  unlockAll: false,
});

export function todayKey(d = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Consecutive active days ending today (or yesterday, so the streak survives until tonight). */
export function computeStreak(days: string[], now = new Date()): number {
  const set = new Set(days);
  const cursor = new Date(now);
  if (!set.has(todayKey(cursor))) cursor.setDate(cursor.getDate() - 1);
  let streak = 0;
  while (set.has(todayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

/** Merges stored data over defaults so older/partial saves never crash the app. */
export function sanitize(raw: unknown): ProgressState {
  const base = emptyProgress();
  if (!raw || typeof raw !== 'object') return base;
  const r = raw as Partial<ProgressState>;
  return {
    ...base,
    ...r,
    version: 1,
    bookmarks: Array.isArray(r.bookmarks) ? r.bookmarks : [],
    activityDays: Array.isArray(r.activityDays) ? r.activityDays : [],
    timeSpentSec: Number(r.timeSpentSec) || 0,
    unlockAll: Boolean(r.unlockAll),
  };
}

function load(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? sanitize(JSON.parse(raw)) : emptyProgress();
  } catch {
    return emptyProgress();
  }
}

function withActivity(s: ProgressState): ProgressState {
  const day = todayKey();
  return s.activityDays.includes(day) ? s : { ...s, activityDays: [...s.activityDays, day] };
}

interface ProgressApi {
  state: ProgressState;
  startLesson(id: string): void;
  setLessonStatus(id: string, status: ItemStatus | null): void;
  toggleTask(id: string, done?: boolean): void;
  recordQuiz(id: string, score: number, total: number): void;
  setProjectStatus(id: string, status: ItemStatus | null): void;
  setLabStatus(id: string, status: ItemStatus | null): void;
  toggleChallenge(id: string): void;
  toggleBookmark(lessonId: string): void;
  setSkillLevel(id: string, level: number): void;
  addTime(lessonId: string, seconds: number): void;
  setUnlockAll(v: boolean): void;
  replace(next: ProgressState): void;
  reset(): void;
}

const ProgressContext = createContext<ProgressApi | null>(null);

function setOrDelete<T>(map: Record<string, T>, key: string, value: T | null): Record<string, T> {
  const next = { ...map };
  if (value === null) delete next[key];
  else next[key] = value;
  return next;
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* storage full or disabled: progress stays in memory for this session */
    }
  }, [state]);

  // Keep several open tabs in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setState(sanitize(JSON.parse(e.newValue)));
        } catch {
          /* ignore malformed data from other tabs */
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const update = useCallback((fn: (s: ProgressState) => ProgressState, activity = true) => {
    setState((s) => (activity ? withActivity(fn(s)) : fn(s)));
  }, []);

  const api = useMemo<ProgressApi>(
    () => ({
      state,
      startLesson: (id) =>
        update(
          (s) => ({
            ...s,
            lastLesson: id,
            lessons: s.lessons[id] ? s.lessons : { ...s.lessons, [id]: 'in_progress' },
          }),
          false,
        ),
      setLessonStatus: (id, status) =>
        update((s) => ({ ...s, lessons: setOrDelete(s.lessons, id, status) })),
      toggleTask: (id, done) =>
        update((s) => {
          const isDone = Boolean(s.tasks[id]);
          const target = done ?? !isDone;
          return { ...s, tasks: setOrDelete(s.tasks, id, target ? new Date().toISOString() : null) };
        }),
      recordQuiz: (id, score, total) =>
        update((s) => {
          const prev = s.quizzes[id];
          return {
            ...s,
            quizzes: {
              ...s.quizzes,
              [id]: {
                best: Math.max(prev?.best ?? 0, score),
                last: score,
                total,
                attempts: (prev?.attempts ?? 0) + 1,
              },
            },
          };
        }),
      setProjectStatus: (id, status) =>
        update((s) => ({ ...s, projects: setOrDelete(s.projects, id, status) })),
      setLabStatus: (id, status) => update((s) => ({ ...s, labs: setOrDelete(s.labs, id, status) })),
      toggleChallenge: (id) =>
        update((s) => ({
          ...s,
          challenges: setOrDelete(s.challenges, id, s.challenges[id] ? null : new Date().toISOString()),
        })),
      toggleBookmark: (lessonId) =>
        update(
          (s) => ({
            ...s,
            bookmarks: s.bookmarks.includes(lessonId)
              ? s.bookmarks.filter((b) => b !== lessonId)
              : [...s.bookmarks, lessonId],
          }),
          false,
        ),
      setSkillLevel: (id, level) =>
        update((s) => ({ ...s, skills: { ...s.skills, [id]: Math.max(0, Math.min(4, level)) } }), false),
      addTime: (lessonId, seconds) =>
        update((s) => ({
          ...s,
          timeSpentSec: s.timeSpentSec + seconds,
          lessonTimeSec: {
            ...s.lessonTimeSec,
            [lessonId]: (s.lessonTimeSec[lessonId] ?? 0) + seconds,
          },
        })),
      setUnlockAll: (v) => update((s) => ({ ...s, unlockAll: v }), false),
      replace: (next) => setState(sanitize(next)),
      reset: () => setState(emptyProgress()),
    }),
    [state, update],
  );

  return <ProgressContext.Provider value={api}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressApi {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used inside ProgressProvider');
  return ctx;
}
