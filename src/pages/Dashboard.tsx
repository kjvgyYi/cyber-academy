import { Link } from 'react-router-dom';
import { ArrowRight, BookOpenCheck, Bookmark, Flame, FolderGit2, GraduationCap, ListChecks, Timer } from 'lucide-react';
import { course, orderedLessons, lessonById } from '@/content';
import { useProgress } from '@/lib/progress';
import { courseCompletion, formatDuration, nextLesson, quizAverage } from '@/lib/selectors';
import { computeStreak } from '@/lib/progress';
import { Badge, Button, LevelMeter, Panel, ProgressBar, cx } from '@/components/ui';

function StatCard({ icon: Icon, value, label }: { icon: typeof Timer; value: string | number; label: string }) {
  return (
    <Panel className="p-4">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-raised text-amber">
          <Icon size={18} />
        </span>
        <div>
          <p className="text-xl font-semibold leading-none text-fg">{value}</p>
          <p className="mt-1 text-xs text-muted">{label}</p>
        </div>
      </div>
    </Panel>
  );
}

export function Dashboard() {
  const { state } = useProgress();
  const overall = courseCompletion(state, course);
  const cont = nextLesson(state, orderedLessons);
  const contModule = cont ? course.modules.find((m) => m.number === cont.module) : undefined;

  const completedLessons = Object.values(state.lessons).filter((s) => s === 'completed').length;
  const completedLabs = Object.values(state.labs).filter((s) => s === 'completed').length;
  const completedProjects = Object.values(state.projects).filter((s) => s === 'completed').length;
  const streak = computeStreak(state.activityDays);
  const qAvg = quizAverage(state);

  const bookmarks = state.bookmarks.map((id) => lessonById.get(id)).filter(Boolean).slice(0, 4);

  return (
    <div>
      <header className="mb-8">
        <p className="text-sm text-amber">{course.subtitle}</p>
        <h1 className="mt-1 text-[2rem] font-semibold tracking-tight text-[#f2f5f9]">{course.title}</h1>
      </header>

      {/* Continue learning hero */}
      <Panel className="mb-6 overflow-hidden">
        <div className="grid gap-6 p-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <div className="mb-3 flex items-center justify-between gap-4">
              <span className="text-sm text-muted">Общий прогресс курса</span>
              <span className="font-mono text-sm text-amber">{overall.pct}%</span>
            </div>
            <ProgressBar value={overall.pct} label="Общий прогресс" />
            <p className="mt-2 text-xs text-faint">
              {overall.done} из {overall.total} уроков · {course.modules.filter((m) => m.available).length} модулей открыто
            </p>
          </div>
          <div className="md:text-right">
            {cont ? (
              <>
                <p className="text-xs uppercase tracking-wider text-faint">Продолжить</p>
                <p className="mt-1 font-medium text-fg">
                  {contModule && <span className="text-faint">M{contModule.number} · </span>}
                  {cont.title}
                </p>
                <Link to={`/lessons/${cont.id}`} className="mt-3 inline-block">
                  <Button variant="primary">
                    {state.lessons[cont.id] ? 'Продолжить' : 'Начать'} <ArrowRight size={16} />
                  </Button>
                </Link>
              </>
            ) : (
              <p className="text-muted">Все доступные уроки пройдены. 🎯</p>
            )}
          </div>
        </div>
      </Panel>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard icon={BookOpenCheck} value={completedLessons} label="Уроков пройдено" />
        <StatCard icon={FolderGit2} value={`${completedProjects}/${course.projects.length}`} label="Проектов" />
        <StatCard icon={Flame} value={streak} label={streak === 1 ? 'день подряд' : 'дней подряд'} />
        <StatCard icon={Timer} value={formatDuration(state.timeSpentSec)} label="Время обучения" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Skills */}
        <Panel className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-[#eef2f7]">Навыки</h2>
            <Link to="/skills" className="text-sm text-sky hover:underline">
              Подробнее
            </Link>
          </div>
          <ul className="space-y-3">
            {course.skills.slice(0, 6).map((s) => {
              const level = state.skills[s.id] ?? 0;
              return (
                <li key={s.id} className="flex items-center justify-between gap-4">
                  <span className="text-sm text-fg">{s.name}</span>
                  <div className="flex items-center gap-3">
                    <LevelMeter value={level} target={s.target} />
                    <span className="w-8 text-right font-mono text-xs text-muted">
                      {level}/{s.target}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </Panel>

        {/* Secondary stats + bookmarks */}
        <div className="space-y-6">
          <Panel className="p-5">
            <h2 className="mb-4 font-semibold text-[#eef2f7]">Статистика</h2>
            <dl className="grid grid-cols-2 gap-y-3 text-sm">
              <dt className="text-muted">Завершено лабораторий</dt>
              <dd className="text-right font-mono text-fg">{completedLabs}</dd>
              <dt className="text-muted">Средний балл квизов</dt>
              <dd className="text-right font-mono text-fg">{qAvg === null ? '—' : `${qAvg}%`}</dd>
              <dt className="text-muted">Пройдено квизов</dt>
              <dd className="text-right font-mono text-fg">{Object.keys(state.quizzes).length}</dd>
              <dt className="text-muted">Закладок</dt>
              <dd className="text-right font-mono text-fg">{state.bookmarks.length}</dd>
            </dl>
          </Panel>

          <Panel className="p-5">
            <h2 className="mb-3 flex items-center gap-2 font-semibold text-[#eef2f7]">
              <Bookmark size={16} className="text-amber" /> Закладки
            </h2>
            {bookmarks.length ? (
              <ul className="space-y-1.5">
                {bookmarks.map(
                  (l) =>
                    l && (
                      <li key={l.id}>
                        <Link
                          to={`/lessons/${l.id}`}
                          className="flex items-center gap-2 rounded-md px-2 py-1 text-sm text-muted hover:bg-raised hover:text-fg"
                        >
                          <span className="font-mono text-xs text-faint">{l.id}</span>
                          <span className="truncate">{l.title}</span>
                        </Link>
                      </li>
                    ),
                )}
              </ul>
            ) : (
              <p className="text-sm text-muted">Пока нет. Отмечайте уроки закладкой, чтобы вернуться позже.</p>
            )}
          </Panel>
        </div>
      </div>

      {/* Quick links */}
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { to: '/course', label: 'Все модули', icon: GraduationCap },
          { to: '/labs', label: 'Лаборатории', icon: ListChecks },
          { to: '/reference/tools', label: 'Security Tools', icon: FolderGit2 },
          { to: '/resources', label: 'Ресурсы', icon: BookOpenCheck },
        ].map((q) => (
          <Link
            key={q.to}
            to={q.to}
            className={cx(
              'flex items-center gap-2 rounded-xl border border-line bg-panel px-4 py-3 text-sm text-muted transition-colors',
              'hover:border-line-strong hover:text-fg',
            )}
          >
            <q.icon size={16} className="text-amber" /> {q.label}
          </Link>
        ))}
      </div>

      <p className="mt-8 text-center">
        <Badge tone="amber">Beta v0.1</Badge>
      </p>
    </div>
  );
}
