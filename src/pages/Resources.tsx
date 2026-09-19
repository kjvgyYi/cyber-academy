import { ExternalLink } from 'lucide-react';
import { course } from '@/content';
import { slugify } from '@/content/parse';
import { Badge, EmptyState, PageHeader, Panel } from '@/components/ui';

export function ResourcesPage() {
  if (!course.resources.length)
    return (
      <div>
        <PageHeader title="Ресурсы" lead="Проверенные источники по темам курса." />
        <EmptyState title="Список ресурсов появится вместе с модулями" />
      </div>
    );

  return (
    <div>
      <PageHeader title="Ресурсы" lead="Проверенные источники: документация, тренировочные платформы, справочники." />
      <div className="space-y-6">
        {course.resources.map((cat) => (
          <Panel key={cat.category} id={`res-${slugify(cat.category)}`} className="scroll-mt-24 p-5">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-faint">{cat.category}</h2>
            <ul className="space-y-3">
              {cat.items.map((r) => (
                <li key={r.url}>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-start gap-2"
                  >
                    <ExternalLink size={15} className="mt-0.5 shrink-0 text-faint group-hover:text-sky" />
                    <span>
                      <span className="inline-flex items-center gap-2 text-sm font-medium text-fg group-hover:text-sky">
                        {r.title}
                        {r.lang && <Badge>{r.lang}</Badge>}
                      </span>
                      {r.note && <span className="mt-0.5 block text-sm text-muted">{r.note}</span>}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Panel>
        ))}
      </div>
    </div>
  );
}
