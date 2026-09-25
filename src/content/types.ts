/**
 * Content model. Everything the learner sees comes from /content (Markdown + YAML).
 * The React app only renders these structures — no lesson text lives in components.
 */

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';
export type LessonKind = 'lesson' | 'lab' | 'checkpoint';

export interface Phase {
  number: number;
  title: string;
  months?: string;
}

export interface ModuleOutline {
  number: number;
  title: string;
  summary: string;
  phase: number;
}

export interface CourseModule extends ModuleOutline {
  /** Markdown body of module.md (empty for planned modules). */
  body: string;
  objectives: string[];
  prerequisites: string[];
  skills: string[];
  /** Project id from projects.yaml. */
  project?: string;
  lessons: Lesson[];
  /** True when the module has at least one lesson file. */
  available: boolean;
}

export interface Lesson {
  /** Stable id used in URLs and progress, e.g. "0.1" or "0.cp". */
  id: string;
  module: number;
  order: number;
  kind: LessonKind;
  title: string;
  estimatedTime: number;
  difficulty: Difficulty;
  prerequisites: string[];
  skills: string[];
  tags: string[];
  body: string;
  /** Ids of ```task blocks found in the body. */
  taskIds: string[];
  /** Ids referenced by ```quiz blocks in the body. */
  quizIds: string[];
  sourcePath: string;
}

export interface Task {
  id: string;
  title?: string;
  prompt: string;
  /** Show a text input for the answer. */
  input?: boolean;
  /** Accepted answers (compared after whitespace/case normalisation). */
  answers?: string[];
  /** Regular expression alternative to `answers`. */
  answerPattern?: string;
  hints?: string[];
  solution?: string;
}

export interface QuizQuestion {
  q: string;
  options: string[];
  /** Index of the correct option. */
  answer: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  lesson?: string;
  module?: number;
  questions: QuizQuestion[];
}

export interface Skill {
  id: string;
  name: string;
  target: number;
  description: string;
  /** Meaning of levels 0..4. */
  levels: string[];
  /** What proves each level (checkpoints, projects). */
  evidence: string[];
}

export interface Project {
  id: string;
  title: string;
  module: number;
  summary: string;
  description: string;
  requirements: string[];
  skills: string[];
  prerequisites: string[];
  tasks: Task[];
  expectedResult: string;
  checklist: string[];
  readmeTemplate: string;
}

export interface Lab {
  id: string;
  title: string;
  category: string;
  module: number;
  lesson?: string;
  objective: string;
  environment: string[];
  prerequisites: string[];
  tasks: Task[];
  expectedOutput: string;
  safety: string[];
}

export interface Challenge {
  id: string;
  number: number;
  title: string;
  difficulty: Difficulty;
  skills: string[];
  /** Lesson id that must be completed to open the challenge. */
  unlockAfter?: string;
  scenario: string;
  questions: string[];
  hints: string[];
  solution: string;
}

export interface Resource {
  title: string;
  url: string;
  note: string;
  lang?: string;
}

export interface ResourceCategory {
  category: string;
  items: Resource[];
}

export interface CommandRef {
  name: string;
  category: string;
  purpose: string;
  syntax: string;
  examples: { cmd: string; note: string }[];
  security: string;
  lessons: string[];
}

export interface ToolRef {
  name: string;
  category: string;
  purpose: string;
  phase: string;
  usage: string;
  safeLab: string;
  example: string;
  output: string;
  lessons: string[];
  modules: number[];
}

export interface Course {
  title: string;
  subtitle: string;
  phases: Phase[];
  modules: CourseModule[];
  lessons: Lesson[];
  quizzes: Quiz[];
  skills: Skill[];
  projects: Project[];
  labs: Lab[];
  challenges: Challenge[];
  resources: ResourceCategory[];
  commands: CommandRef[];
  tools: ToolRef[];
}
