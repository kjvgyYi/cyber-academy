import { buildCourse, validateCourse } from './loader';

/*
 * Vite bundles every content file at build time. Adding a Markdown/YAML file
 * under /content is enough for it to appear in the app — no code changes needed.
 *
 * Note: import.meta.glob's options must be an inline object literal (Vite parses
 * these statically), so the shape is repeated at each call rather than shared.
 */
const data = import.meta.glob<string>('/content/*.yaml', {
  import: 'default',
  eager: true,
});
const modules = import.meta.glob<string>('/content/modules/*/module.md', {
  import: 'default',
  eager: true,
});
const lessons = import.meta.glob<string>(['/content/modules/*/*.md', '!/content/modules/*/module.md'], {
  import: 'default',
  eager: true,
});
const quizzes = import.meta.glob<string>('/content/quizzes/*.yaml', {
  import: 'default',
  eager: true,
});

export const course = buildCourse({ data, modules, lessons, quizzes });

export const contentErrors = validateCourse(course);
if (contentErrors.length && import.meta.env.DEV) {
  console.warn('[content] problems found:\n' + contentErrors.join('\n'));
}

export const lessonById = new Map(course.lessons.map((l) => [l.id, l]));
export const moduleByNumber = new Map(course.modules.map((m) => [m.number, m]));
export const quizById = new Map(course.quizzes.map((q) => [q.id, q]));
export const projectById = new Map(course.projects.map((p) => [p.id, p]));
export const labById = new Map(course.labs.map((l) => [l.id, l]));
export const skillById = new Map(course.skills.map((s) => [s.id, s]));

/** Lessons in course order (used for prev/next navigation). */
export const orderedLessons = course.modules.flatMap((m) => m.lessons);
