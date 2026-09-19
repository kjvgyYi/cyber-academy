import { Link, useParams } from 'react-router-dom';
import { course, projectById, skillById } from '@/content';
import { useProgress } from '@/lib/progress';
import { projectStatus } from '@/lib/selectors';
import { Markdown } from '@/components/Markdown';
import { TaskCard } from '@/components/TaskCard';
import {
  Badge,
  Breadcrumbs,
  Button,
  EmptyState,
  PageHeader,
  Panel,
  StatusBadge,
  StatusIcon,
  cx,
} from '@/components/ui';

export function ProjectsPage() {
  const { state } = useProgress();
  if (!course.projects.length) return <EmptyState title="Проекты появятся с первыми модулями" />;

  return (
    <div>
      <PageHeader
        title="Проекты"
        lead="Практические проекты собирают навыки модуля в один инструмент. Каждый — маленький репозиторий с README, который можно показать."
      />
      <div className="space-y-2.5">
        {course.projects.map((p) => {
          const status = projectStatus(state, course, p);
          return (
            <Link key={p.id} to={`/projects/${p.id}`} className="block">
              <Panel className={cx('p-4 transition-colors hover:border-line-strong', status === 'locked' && 'opacity-70')}>
                <div className="flex items-start gap-3">
                  <StatusIcon status={status} size={18} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-fg">{p.title}</h3>
                      <span className="font-mono text-xs text-faint">M{p.module}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted">{p.summary}</p>
                  </div>
                  <StatusBadge status={status} />
                </div>
              </Panel>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function ProjectPage() {
  const { id } = useParams();
  const { state, setProjectStatus } = useProgress();
  const p = id ? projectById.get(id) : undefined;
  if (!p) return <EmptyState title="Проект не найден" />;

  const status = projectStatus(state, course, p);
  const stored = state.projects[p.id];

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Проекты', to: '/projects' }, { label: p.title }]} />
      <PageHeader title={p.title} lead={p.summary}>
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={status} />
          <span className="font-mono text-xs text-muted">Module {p.module}</span>
        </div>
      </PageHeader>

      <Panel className="mb-6 p-5">
        <Markdown content={p.description} />
      </Panel>

      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <Panel className="p-4">
          <h3 className="mb-2 text-sm font-semibold text-[#eef2f7]">Требования</h3>
          <ul className="space-y-1 text-sm text-muted">
            {p.requirements.map((r, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-amber">·</span> {r}
              </li>
            ))}
          </ul>
        </Panel>
        <div className="space-y-4">
          {p.skills.length > 0 && (
            <Panel className="p-4">
              <h3 className="mb-2 text-sm font-semibold text-[#eef2f7]">Навыки</h3>
              <div className="flex flex-wrap gap-1.5">
                {p.skills.map((s) => (
                  <Badge key={s} tone="sky">
                    {skillById.get(s)?.name ?? s}
                  </Badge>
                ))}
              </div>
            </Panel>
          )}
          {p.prerequisites.length > 0 && (
            <Panel className="p-4">
              <h3 className="mb-2 text-sm font-semibold text-[#eef2f7]">Prerequisites</h3>
              <ul className="space-y-1 text-sm text-muted">
                {p.prerequisites.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </Panel>
          )}
        </div>
      </div>

      {p.tasks.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-2 text-lg font-semibold text-[#eef2f7]">Задачи</h2>
          {p.tasks.map((t, i) => (
            <TaskCard key={t.id} task={t} index={i + 1} />
          ))}
        </section>
      )}

      {p.expectedResult && (
        <Panel className="mb-6 p-5">
          <h3 className="mb-2 text-sm font-semibold text-[#eef2f7]">Ожидаемый результат</h3>
          <Markdown content={p.expectedResult} compact />
        </Panel>
      )}

      {p.checklist.length > 0 && (
        <Panel className="mb-6 p-5">
          <h3 className="mb-3 text-sm font-semibold text-[#eef2f7]">Чек-лист оценки</h3>
          <ul className="space-y-2 text-sm">
            {p.checklist.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-muted">
                <span className="mt-0.5 h-4 w-4 shrink-0 rounded border border-line-strong" /> {c}
              </li>
            ))}
          </ul>
        </Panel>
      )}

      {p.readmeTemplate && (
        <section className="mb-6">
          <h3 className="mb-2 text-sm font-semibold text-[#eef2f7]">Шаблон README</h3>
          <Markdown content={'```markdown\n' + p.readmeTemplate + '\n```'} />
        </section>
      )}

      <div className="flex flex-wrap gap-3">
        <Button
          variant={stored === 'completed' ? 'secondary' : 'primary'}
          onClick={() => setProjectStatus(p.id, stored === 'completed' ? null : 'completed')}
        >
          {stored === 'completed' ? 'Снять отметку' : 'Отметить завершённым'}
        </Button>
        {stored !== 'in_progress' && stored !== 'completed' && (
          <Button variant="secondary" onClick={() => setProjectStatus(p.id, 'in_progress')}>
            Взять в работу
          </Button>
        )}
      </div>
    </div>
  );
}
