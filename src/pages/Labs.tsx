import { Link, useParams } from 'react-router-dom';
import { Beaker } from 'lucide-react';
import { course, labById } from '@/content';
import { useProgress } from '@/lib/progress';
import { Markdown } from '@/components/Markdown';
import { TaskCard } from '@/components/TaskCard';
import { Callout } from '@/components/Callout';
import { Badge, Breadcrumbs, Button, EmptyState, PageHeader, Panel, StatusBadge } from '@/components/ui';

export function LabsPage() {
  const { state } = useProgress();
  if (!course.labs.length)
    return (
      <div>
        <PageHeader title="Лаборатории" lead="Практика в изолированной среде: своя VM, localhost, Docker или CTF." />
        <EmptyState title="Лаборатории появятся с первыми модулями" />
      </div>
    );

  const byCategory = new Map<string, typeof course.labs>();
  for (const lab of course.labs) {
    const arr = byCategory.get(lab.category) ?? [];
    arr.push(lab);
    byCategory.set(lab.category, arr);
  }

  return (
    <div>
      <PageHeader
        title="Лаборатории"
        lead="Практика только в изолированной среде: собственная VM, localhost, Docker или учебная платформа."
      />
      {[...byCategory.entries()].map(([cat, labs]) => (
        <section key={cat} className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-faint">{cat}</h2>
          <div className="space-y-2.5">
            {labs.map((lab) => {
              const status = state.labs[lab.id] === 'completed' ? 'completed' : state.labs[lab.id] ? 'in_progress' : 'not_started';
              return (
                <Link key={lab.id} to={`/labs/${lab.id}`} className="block">
                  <Panel className="flex items-start gap-3 p-4 transition-colors hover:border-line-strong">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-raised text-amber">
                      <Beaker size={17} />
                    </span>
                    <div className="flex-1">
                      <h3 className="font-medium text-fg">{lab.title}</h3>
                      <p className="mt-0.5 text-sm text-muted">{lab.objective}</p>
                    </div>
                    <StatusBadge status={status} />
                  </Panel>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

export function LabPage() {
  const { id } = useParams();
  const { state, setLabStatus } = useProgress();
  const lab = id ? labById.get(id) : undefined;
  if (!lab) return <EmptyState title="Лаборатория не найдена" />;

  const stored = state.labs[lab.id];
  const status = stored === 'completed' ? 'completed' : stored ? 'in_progress' : 'not_started';

  return (
    <div>
      <Breadcrumbs items={[{ label: 'Лаборатории', to: '/labs' }, { label: lab.title }]} />
      <PageHeader title={lab.title} lead={lab.objective}>
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge status={status} />
          <Badge tone="sky">{lab.category}</Badge>
          <span className="font-mono text-xs text-muted">Module {lab.module}</span>
        </div>
      </PageHeader>

      {lab.safety.length > 0 && (
        <Callout kind="safety" title="Правила безопасности">
          <ul className="list-disc pl-5">
            {lab.safety.map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </Callout>
      )}

      <div className="my-6 grid gap-4 md:grid-cols-2">
        <Panel className="p-4">
          <h3 className="mb-2 text-sm font-semibold text-[#eef2f7]">Окружение</h3>
          <ul className="space-y-1 text-sm text-muted">
            {lab.environment.map((e, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-amber">·</span> {e}
              </li>
            ))}
          </ul>
        </Panel>
        {lab.prerequisites.length > 0 && (
          <Panel className="p-4">
            <h3 className="mb-2 text-sm font-semibold text-[#eef2f7]">Prerequisites</h3>
            <ul className="space-y-1 text-sm text-muted">
              {lab.prerequisites.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </Panel>
        )}
      </div>

      {lab.tasks.length > 0 && (
        <section className="mb-6">
          <h2 className="mb-2 text-lg font-semibold text-[#eef2f7]">Задания</h2>
          {lab.tasks.map((t, i) => (
            <TaskCard key={t.id} task={t} index={i + 1} />
          ))}
        </section>
      )}

      {lab.expectedOutput && (
        <Panel className="mb-6 p-5">
          <h3 className="mb-2 text-sm font-semibold text-[#eef2f7]">Ожидаемый результат</h3>
          <Markdown content={lab.expectedOutput} compact />
        </Panel>
      )}

      <Button
        variant={stored === 'completed' ? 'secondary' : 'primary'}
        onClick={() => setLabStatus(lab.id, stored === 'completed' ? null : 'completed')}
      >
        {stored === 'completed' ? 'Снять отметку' : 'Отметить выполненной'}
      </Button>
    </div>
  );
}
