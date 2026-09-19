import { describe, expect, it } from 'vitest';
import { buildCourse, validateCourse, parseLesson } from './loader';
import { slugify, splitSections, normalizeAnswer } from './parse';

const courseYaml = `
title: Test Course
subtitle: sub
phases:
  - number: 1
    title: Foundations
modules:
  - number: 0
    title: Orientation
    summary: intro
    phase: 1
  - number: 1
    title: Planned
    summary: later
    phase: 1
`;

const skillsYaml = `
- id: linux
  name: Linux
  target: 3
  description: d
  levels: [a, b, c]
  evidence: [e]
`;

const moduleMd = `---
number: 0
objectives: [understand]
skills: [linux]
project: proj-1
---
Module body.`;

const lessonMd = `---
id: "0.1"
module: 0
order: 1
title: First
skills: [linux]
quizIds: [quiz-1]
---

## Intro
Hello.

\`\`\`task
id: task-1
prompt: Do it
\`\`\`

\`\`\`quiz
quiz-1
\`\`\`
`;

const quizYaml = `
id: quiz-1
title: Q
lesson: "0.1"
questions:
  - q: Which?
    options: [a, b]
    answer: 1
    explanation: because b
`;

const projectsYaml = `
- id: proj-1
  title: Proj
  module: 0
  summary: s
  description: d
  requirements: [r]
  skills: [linux]
  prerequisites: []
  tasks: []
  expectedResult: ok
  checklist: [c]
  readmeTemplate: ""
`;

function build() {
  return buildCourse({
    data: {
      '/content/course.yaml': courseYaml,
      '/content/skills.yaml': skillsYaml,
      '/content/projects.yaml': projectsYaml,
    },
    modules: { '/content/modules/00-orientation/module.md': moduleMd },
    lessons: { '/content/modules/00-orientation/lesson-0-1.md': lessonMd },
    quizzes: { '/content/quizzes/quiz-1.yaml': quizYaml },
  });
}

describe('buildCourse', () => {
  const course = build();

  it('reads course metadata', () => {
    expect(course.title).toBe('Test Course');
    expect(course.modules).toHaveLength(2);
  });

  it('marks modules with lessons available, others not', () => {
    expect(course.modules[0].available).toBe(true);
    expect(course.modules[1].available).toBe(false);
  });

  it('attaches lessons, module body and project', () => {
    expect(course.modules[0].lessons.map((l) => l.id)).toEqual(['0.1']);
    expect(course.modules[0].body).toContain('Module body');
    expect(course.modules[0].project).toBe('proj-1');
  });

  it('extracts task and quiz ids from the lesson body', () => {
    const lesson = course.lessons[0];
    expect(lesson.taskIds).toEqual(['task-1']);
    expect(lesson.quizIds).toEqual(['quiz-1']);
  });

  it('parses quizzes and projects', () => {
    expect(course.quizzes[0].questions[0].answer).toBe(1);
    expect(course.projects[0].id).toBe('proj-1');
  });
});

describe('validateCourse', () => {
  it('returns no errors for a consistent course', () => {
    expect(validateCourse(build())).toEqual([]);
  });

  it('flags an out-of-range quiz answer', () => {
    const course = build();
    course.quizzes[0].questions[0].answer = 9;
    expect(validateCourse(course).some((e) => e.includes('out of range'))).toBe(true);
  });

  it('flags an unknown project reference', () => {
    const course = build();
    course.modules[0].project = 'ghost';
    expect(validateCourse(course).some((e) => e.includes('unknown project'))).toBe(true);
  });
});

describe('parseLesson', () => {
  it('throws when required frontmatter is missing', () => {
    expect(() => parseLesson('x.md', '---\ntitle: only\n---\nbody')).toThrow();
  });
});

describe('parse helpers', () => {
  it('slugify handles unicode and spaces', () => {
    expect(slugify('Hello World')).toBe('hello-world');
    expect(slugify('  Multiple   Spaces ')).toBe('multiple-spaces');
  });

  it('splitSections splits on h2 and ignores fenced headings', () => {
    const sections = splitSections('## One\ntext\n```\n## not a heading\n```\n## Two\nmore');
    expect(sections.map((s) => s.title)).toEqual(['One', 'Two']);
  });

  it('normalizeAnswer trims and lowercases', () => {
    expect(normalizeAnswer('  PWD  ')).toBe('pwd');
  });
});
