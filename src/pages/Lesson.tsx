import { useEffect, useMemo, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Bookmark, BookmarkCheck, CheckCircle2, Clock, Signal } from 'lucide-react';
import { course, orderedLessons, lessonById } from '@/content';
import { splitSections, slugify } from '@/content/parse';
import { useProgress } from '@/lib/progress';
import { Markdown } from '@/components/Markdown';
import {
  Badge,
  Breadcrumbs,
  Button,
  DifficultyBadge,
  EmptyState,
  Panel,
  cx,
} from '@/components/ui';

const kindLabel = { lesson: 'Урок', lab: 'Лаборатория', checkpoint: 'Checkpoint' };

/** Tracks active time on the lesson and flushes it to progress every 15s. */
function useTimeTracking(lessonId: string) {
  const { addTime } = useProgress();
  const acc = useRef(0);
  const visible = useRef(true);

  useEffect(() => {
    acc.current = 0;
    const onVis = () => (visible.current = document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onVis);

    const tick = setInterval(() => {
      if (visible.current) acc.current += 5;
    }, 5000);

    const flush = setInterval(() => {
      if (acc.current > 0) {
        addTime(lessonId, acc.current);
        acc.current = 0;
      }
    }, 15000);

    return () => {
      document.removeEventListener('visibilitychange', onVis);
      clearInterval(tick);
      clearInterval(flush);
      if (acc.current > 0) addTime(lessonId, acc.current);
    };
  }, [lessonId, addTime]);
}

export function LessonPage() {
  const { id } = useParams();
  const { state, startLesson, setLessonStatus, toggleBookmark } = useProgress();
  const lesson = id ? lessonById.get(id) : undefined;

  useEffect(() => {
    if (lesson) startLesson(lesson.id);
  }, [lesson, startLesson]);

  useTimeTracking(lesson?.id ?? '');

  const sections = useMemo(() => (lesson ? splitSections(lesson.body).filter((s) => s.title) : []), [lesson]);

  if (!lesson) return <EmptyState title="Урок не найден" />;

  const module = course.modules.find((m) => m.number === lesson.module);
  const idx = orderedLessons.findIndex((l) => l.id === lesson.id);
  const prev = idx > 0 ? orderedLessons[idx - 1] : undefined;
  const next = idx < orderedLessons.length - 1 ? orderedLessons[idx + 1] : undefined;
  const completed = state.lessons[lesson.id] === 'completed';
  const bookmarked = state.bookmarks.includes(lesson.id);

  return (
    <div className="lg:grid lg:grid-cols-[1fr_15rem] lg:gap-8">
      <article className="min-w-0">
        <Breadcrumbs
          items={[
            { label: 'Курс', to: '/course' },
            { label: `M${lesson.module}`, to: `/modules/${lesson.module}` },
            { label: lesson.id },
          ]}
        />

        <header className="mb-6">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <Badge tone={lesson.kind === 'checkpoint' ? 'amber' : lesson.kind === 'lab' ? 'sky' : 'default'}>
              {kindLabel[lesson.kind]} {lesson.id}
            </Badge>
            <DifficultyBadge value={lesson.difficulty} />
            {completed && <Badge tone="mint">Завершено</Badge>}
          </div>
          <h1 className="text-[1.8rem] font-semibold leading-tight tracking-tight text-[#f2f5f9]">{lesson.title}</h1>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted">
            <span className="inline-flex items-center gap-1.5">
              <Clock size={14} /> ~{lesson.estimatedTime} мин
            </span>
            {module && (
              <span className="inline-flex items-center gap-1.5">
                <Signal size={14} /> {module.title}
              </span>
            )}
            <button
              type="button"
              onClick={() => toggleBookmark(lesson.id)}
              className={cx('inline-flex items-center gap-1.5 hover:text-fg', bookmarked && 'text-amber')}
            >
              {bookmarked ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
              {bookmarked ? 'В закладках' : 'В закладки'}
            </button>
          </div>
        </header>

        <Markdown content={lesson.body} />

        {/* Complete + navigation */}
        <div className="mt-10 border-t border-line pt-6">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <Button
              variant={completed ? 'secondary' : 'primary'}
              onClick={() => setLessonStatus(lesson.id, completed ? null : 'completed')}
            >
              <CheckCircle2 size={16} />
              {completed ? 'Отметить как незавершённый' : 'Отметить урок пройденным'}
            </Button>
            {completed && next && (
              <Link to={`/lessons/${next.id}`}>
                <Button variant="primary">
                  Следующий урок <ArrowRight size={16} />
                </Button>
              </Link>
            )}
          </div>

          <div className="flex items-stretch justify-between gap-3">
            {prev ? (
              <Link to={`/lessons/${prev.id}`} className="flex-1">
                <Panel className="flex h-full items-center gap-2 p-3 text-sm transition-colors hover:border-line-strong">
                  <ArrowLeft size={16} className="text-faint" />
                  <span className="min-w-0">
                    <span className="block text-xs text-faint">Назад</span>
                    <span className="block truncate text-fg">{prev.title}</span>
                  </span>
                </Panel>
              </Link>
            ) : (
              <span className="flex-1" />
            )}
            {next ? (
              <Link to={`/lessons/${next.id}`} className="flex-1">
                <Panel className="flex h-full items-center justify-end gap-2 p-3 text-right text-sm transition-colors hover:border-line-strong">
                  <span className="min-w-0">
                    <span className="block text-xs text-faint">Дальше</span>
                    <span className="block truncate text-fg">{next.title}</span>
                  </span>
                  <ArrowRight size={16} className="text-faint" />
                </Panel>
              </Link>
            ) : (
              <span className="flex-1" />
            )}
          </div>
        </div>
      </article>

      {/* Table of contents */}
      {sections.length > 2 && (
        <aside className="hidden lg:block">
          <div className="sticky top-10">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-faint">На этой странице</p>
            <nav>
              <ul className="space-y-1 border-l border-line">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${slugify(s.title)}`}
                      className="-ml-px block border-l-2 border-transparent px-3 py-0.5 text-sm text-muted hover:border-amber hover:text-fg"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </aside>
      )}
    </div>
  );
}
