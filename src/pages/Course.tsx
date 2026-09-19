import { Link, useParams } from 'react-router-dom';
import { ArrowRight, FolderGit2 } from 'lucide-react';
import { course, projectById } from '@/content';
import { useProgress } from '@/lib/progress';
import { moduleCompletion, moduleStatus } from '@/lib/selectors';
import { Markdown } from '@/components/Markdown';
import {
  Badge,
  Breadcrumbs,
  Button,
  EmptyState,
  PageHeader,
  Panel,
  ProgressBar,
  StatusBadge,
  StatusIcon,
  cx,
} from '@/components/ui';

export function CourseOverview() {
  const { state } = useProgress();
  return (
    <div>
      <PageHeader title="Программа курса" lead={course.subtitle} />
      {course.phases.map((phase) => {
        const mods = course.modules.filter((m) => m.phase === phase.number);
        if (!mods.length) return null;
        return (
          <section key={phase.number} className="mb-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-faint">
              Фаза {phase.number} — {phase.title}
            </h2>
            <div className="space-y-2.5">
              {mods.map((m) => {
                const status = moduleStatus(state, course, m);
                const { pct } = moduleCompletion(state, m);
                return (
                  <Link key={m.number} to={`/modules/${m.number}`} className="block">
                    <Panel
                      className={cx(
                        'p-4 transition-colors hover:border-line-strong',
                        status === 'locked' && 'opacity-70',
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5">
                          <StatusIcon status={status} size={18} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs text-faint">M{m.number}</span>
                            <h3 className="font-medium text-fg">{m.title}</h3>
                            {!m.available && <Badge>Скоро</Badge>}
                          </div>
                          <p className="mt-1 text-sm text-muted">{m.summary}</p>
                          {m.available && (
                            <div className="mt-3 flex items-center gap-3">
                              <ProgressBar value={pct} size="sm" />
                              <span className="shrink-0 font-mono text-xs text-muted">
                                {m.lessons.length} ур.
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Panel>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export function ModulePage() {
  const { num } = useParams();
  const { state } = useProgress();
  const m = course.modules.find((x) => x.number === Number(num));

  if (!m) return <EmptyState title="Модуль не найден" />;

  const status = moduleStatus(state, course, m);
  const { done, total, pct } = moduleCompletion(state, m);
  const project = m.project ? projectById.get(m.project) : undefined;
  const firstUnfinished = m.lessons.find((l) => state.lessons[l.id] !== 'completed') ?? m.lessons[0];

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Курс', to: '/course' }, { label: `Module ${m.number}` }]} />
      <PageHeader
        title={
          <span>
            <span className="text-faint">Module {m.number}</span>
            <br />
            {m.title}
          </span>
        }
        lead={m.summary}
      >
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={status} />
          {m.available && (
            <span className="font-mono text-xs text-muted">
              {done}/{total} уроков · {pct}%
            </span>
          )}
        </div>
      </PageHeader>

      {!m.available ? (
        <EmptyState title="Этот модуль ещё в разработке">
          Содержание появится позже. Модули добавляются по мере прохождения курса — структура уже готова.
        </EmptyState>
      ) : (
        <>
          {m.available && <ProgressBar value={pct} />}

          {(m.objectives.length > 0 || m.prerequisites.length > 0) && (
            <div className="my-6 grid gap-4 md:grid-cols-2">
              {m.objectives.length > 0 && (
                <Panel className="p-4">
                  <h3 className="mb-2 text-sm font-semibold text-[#eef2f7]">Что вы освоите</h3>
                  <ul className="space-y-1 text-sm text-muted">
                    {m.objectives.map((o, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-amber">·</span> {o}
                      </li>
                    ))}
                  </ul>
                </Panel>
              )}
              {m.prerequisites.length > 0 && (
                <Panel className="p-4">
                  <h3 className="mb-2 text-sm font-semibold text-[#eef2f7]">Prerequisites</h3>
                  <ul className="space-y-1 text-sm text-muted">
                    {m.prerequisites.map((p, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-faint">·</span> {p}
                      </li>
                    ))}
                  </ul>
                </Panel>
              )}
            </div>
          )}

          {m.body.trim() && (
            <Panel className="my-6 p-5">
              <Markdown content={m.body} />
            </Panel>
          )}

          <h3 className="mb-3 mt-8 text-sm font-semibold uppercase tracking-wider text-faint">Уроки</h3>
          <ol className="space-y-2">
            {m.lessons.map((l) => {
              const s = state.lessons[l.id];
              const st = s === 'completed' ? 'completed' : s ? 'in_progress' : 'not_started';
              return (
                <li key={l.id}>
                  <Link to={`/lessons/${l.id}`}>
                    <Panel className="flex items-center gap-3 p-3.5 transition-colors hover:border-line-strong">
                      <StatusIcon status={st} size={17} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-fg">
                          <span className="font-mono text-xs text-faint">{l.id}</span> {l.title}
                        </p>
                      </div>
                      {l.kind !== 'lesson' && (
                        <Badge tone={l.kind === 'checkpoint' ? 'amber' : 'sky'}>
                          {l.kind === 'checkpoint' ? 'Checkpoint' : 'Lab'}
                        </Badge>
                      )}
                      <span className="shrink-0 font-mono text-xs text-faint">{l.estimatedTime}м</span>
                    </Panel>
                  </Link>
                </li>
              );
            })}
          </ol>

          {firstUnfinished && (
            <div className="mt-6">
              <Link to={`/lessons/${firstUnfinished.id}`}>
                <Button variant="primary">
                  {status === 'not_started' ? 'Начать модуль' : 'Продолжить'} <ArrowRight size={16} />
                </Button>
              </Link>
            </div>
          )}

          {project && (
            <Panel className="mt-8 p-5">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-raised text-amber">
                  <FolderGit2 size={20} />
                </span>
                <div className="flex-1">
                  <p className="text-xs uppercase tracking-wider text-faint">Проект модуля</p>
                  <h3 className="mt-0.5 font-semibold text-fg">{project.title}</h3>
                  <p className="mt-1 text-sm text-muted">{project.summary}</p>
                  <Link to={`/projects/${project.id}`} className="mt-3 inline-block">
                    <Button size="sm">Открыть проект</Button>
                  </Link>
                </div>
              </div>
            </Panel>
          )}
        </>
      )}
    </div>
  );
}
