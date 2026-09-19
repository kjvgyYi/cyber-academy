import type {
  Challenge,
  CommandRef,
  Course,
  CourseModule,
  Difficulty,
  Lab,
  Lesson,
  LessonKind,
  ModuleOutline,
  Phase,
  Project,
  Quiz,
  ResourceCategory,
  Skill,
  ToolRef,
} from './types';
import { extractFencedBlocks, parseFrontmatter, parseYaml } from './parse';

/** Raw file map: path → file text. Produced by import.meta.glob in `index.ts`. */
export type RawFiles = Record<string, string>;

interface CourseYaml {
  title: string;
  subtitle: string;
  phases: Phase[];
  modules: ModuleOutline[];
}

interface ModuleFrontmatter {
  number: number;
  objectives?: string[];
  prerequisites?: string[];
  skills?: string[];
  project?: string;
}

interface LessonFrontmatter {
  id: string;
  module: number;
  order: number;
  kind?: LessonKind;
  title: string;
  estimatedTime?: number;
  difficulty?: Difficulty;
  prerequisites?: string[];
  skills?: string[];
  tags?: string[];
}

function pick<T>(files: RawFiles, suffix: string, fallback: T): T {
  const key = Object.keys(files).find((k) => k.endsWith(suffix));
  return key ? parseYaml<T>(files[key]) ?? fallback : fallback;
}

function taskIdsOf(body: string): string[] {
  return extractFencedBlocks(body, 'task')
    .map((raw) => (parseYaml<{ id?: string }>(raw) ?? {}).id)
    .filter((id): id is string => Boolean(id));
}

function quizIdsOf(body: string): string[] {
  return extractFencedBlocks(body, 'quiz').map((raw) => raw.trim());
}

export function parseLesson(path: string, raw: string): Lesson {
  const { data, body } = parseFrontmatter<LessonFrontmatter>(raw);
  if (!data.id || data.module === undefined || !data.title) {
    throw new Error(`Lesson ${path}: frontmatter needs id, module and title`);
  }
  return {
    id: String(data.id),
    module: Number(data.module),
    order: Number(data.order ?? 0),
    kind: data.kind ?? 'lesson',
    title: data.title,
    estimatedTime: Number(data.estimatedTime ?? 40),
    difficulty: data.difficulty ?? 'beginner',
    prerequisites: data.prerequisites ?? [],
    skills: data.skills ?? [],
    tags: data.tags ?? [],
    body,
    taskIds: taskIdsOf(body),
    quizIds: quizIdsOf(body),
    sourcePath: path,
  };
}

export interface ContentSources {
  /** /content/course.yaml, skills.yaml, projects.yaml, ... */
  data: RawFiles;
  /** /content/modules/<dir>/module.md */
  modules: RawFiles;
  /** /content/modules/<dir>/<anything>.md except module.md */
  lessons: RawFiles;
  /** /content/quizzes/*.yaml */
  quizzes: RawFiles;
}

export function buildCourse(src: ContentSources): Course {
  const outline = pick<CourseYaml>(src.data, 'course.yaml', {
    title: 'Course',
    subtitle: '',
    phases: [],
    modules: [],
  });

  const lessons = Object.entries(src.lessons)
    .map(([path, raw]) => parseLesson(path, raw))
    .sort((a, b) => a.module - b.module || a.order - b.order);

  const moduleMeta = new Map<number, { fm: ModuleFrontmatter; body: string }>();
  for (const [path, raw] of Object.entries(src.modules)) {
    const { data, body } = parseFrontmatter<ModuleFrontmatter>(raw);
    if (data.number === undefined) throw new Error(`${path}: module.md needs "number"`);
    moduleMeta.set(Number(data.number), { fm: data, body });
  }

  const modules: CourseModule[] = outline.modules.map((m) => {
    const meta = moduleMeta.get(m.number);
    const own = lessons.filter((l) => l.module === m.number);
    return {
      ...m,
      body: meta?.body ?? '',
      objectives: meta?.fm.objectives ?? [],
      prerequisites: meta?.fm.prerequisites ?? [],
      skills: meta?.fm.skills ?? [],
      project: meta?.fm.project,
      lessons: own,
      available: own.length > 0,
    };
  });

  const quizzes = Object.values(src.quizzes).map((raw) => parseYaml<Quiz>(raw));

  return {
    title: outline.title,
    subtitle: outline.subtitle,
    phases: outline.phases,
    modules,
    lessons,
    quizzes,
    skills: pick<Skill[]>(src.data, 'skills.yaml', []),
    projects: pick<Project[]>(src.data, 'projects.yaml', []),
    labs: pick<Lab[]>(src.data, 'labs.yaml', []),
    challenges: pick<Challenge[]>(src.data, 'challenges.yaml', []),
    resources: pick<ResourceCategory[]>(src.data, 'resources.yaml', []),
    commands: pick<CommandRef[]>(src.data, 'commands.yaml', []),
    tools: pick<ToolRef[]>(src.data, 'tools.yaml', []),
  };
}

/** Cross-checks ids and references. Returns human-readable problems (empty = valid). */
export function validateCourse(course: Course): string[] {
  const errors: string[] = [];
  const dupes = (label: string, ids: string[]) => {
    const seen = new Set<string>();
    for (const id of ids) {
      if (seen.has(id)) errors.push(`Duplicate ${label} id: ${id}`);
      seen.add(id);
    }
  };

  const lessonIds = new Set(course.lessons.map((l) => l.id));
  const quizIds = new Set(course.quizzes.map((q) => q.id));
  const skillIds = new Set(course.skills.map((s) => s.id));
  const moduleNums = new Set(course.modules.map((m) => m.number));

  dupes('lesson', course.lessons.map((l) => l.id));
  dupes('quiz', course.quizzes.map((q) => q.id));
  dupes('project', course.projects.map((p) => p.id));
  dupes('lab', course.labs.map((l) => l.id));
  dupes('challenge', course.challenges.map((c) => c.id));
  dupes('task', [
    ...course.lessons.flatMap((l) => l.taskIds),
    ...course.labs.flatMap((l) => l.tasks.map((t) => t.id)),
    ...course.projects.flatMap((p) => p.tasks.map((t) => t.id)),
  ]);

  for (const l of course.lessons) {
    if (!moduleNums.has(l.module)) errors.push(`Lesson ${l.id}: unknown module ${l.module}`);
    for (const q of l.quizIds) if (!quizIds.has(q)) errors.push(`Lesson ${l.id}: unknown quiz "${q}"`);
    for (const s of l.skills) if (!skillIds.has(s)) errors.push(`Lesson ${l.id}: unknown skill "${s}"`);
    for (const p of l.prerequisites)
      if (!lessonIds.has(p)) errors.push(`Lesson ${l.id}: unknown prerequisite "${p}"`);
  }
  for (const q of course.quizzes) {
    q.questions.forEach((qq, i) => {
      if (qq.answer < 0 || qq.answer >= qq.options.length)
        errors.push(`Quiz ${q.id} question ${i + 1}: answer index out of range`);
    });
  }
  for (const m of course.modules) {
    if (m.project && !course.projects.some((p) => p.id === m.project))
      errors.push(`Module ${m.number}: unknown project "${m.project}"`);
  }
  for (const c of course.challenges) {
    if (c.unlockAfter && !lessonIds.has(c.unlockAfter))
      errors.push(`Challenge ${c.id}: unknown unlockAfter lesson "${c.unlockAfter}"`);
  }
  for (const lab of course.labs) {
    if (lab.lesson && !lessonIds.has(lab.lesson))
      errors.push(`Lab ${lab.id}: unknown lesson "${lab.lesson}"`);
  }
  for (const p of course.projects) {
    for (const s of p.skills) if (!skillIds.has(s)) errors.push(`Project ${p.id}: unknown skill "${s}"`);
  }
  return errors;
}
