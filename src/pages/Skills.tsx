import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { course } from '@/content';
import { useProgress } from '@/lib/progress';
import { Button, LevelMeter, PageHeader, Panel, cx } from '@/components/ui';

export function SkillsPage() {
  const { state, setSkillLevel } = useProgress();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div>
      <PageHeader
        title="Skills Matrix"
        lead="Каждый навык растёт от 0 до целевого уровня. Уровень поднимается вручную, когда ты подтвердил его чекпоинтом или проектом — это честная самооценка, а не автосчётчик."
      />

      <div className="space-y-3">
        {course.skills.map((s) => {
          const level = state.skills[s.id] ?? 0;
          const isOpen = open === s.id;
          const usedIn = course.modules.filter((m) => m.skills.includes(s.id));
          const projects = course.projects.filter((p) => p.skills.includes(s.id));
          return (
            <Panel key={s.id}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : s.id)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-4 p-4 text-left"
              >
                <ChevronDown
                  size={16}
                  className={cx('shrink-0 text-faint transition-transform', isOpen && 'rotate-180')}
                />
                <span className="flex-1 font-medium text-fg">{s.name}</span>
                <LevelMeter value={level} target={s.target} />
                <span className="w-10 text-right font-mono text-sm text-muted">
                  {level}/{s.target}
                </span>
              </button>

              {isOpen && (
                <div className="space-y-4 border-t border-line px-4 py-4 text-sm">
                  <p className="text-muted">{s.description}</p>

                  <div>
                    <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-faint">Что означают уровни</p>
                    <ul className="space-y-1">
                      {s.levels.map((lvl, i) => (
                        <li key={i} className={cx('flex gap-2', i + 1 <= level ? 'text-fg' : 'text-muted')}>
                          <span className="font-mono text-faint">L{i + 1}</span>
                          {lvl}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {s.evidence.length > 0 && (
                    <div>
                      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-faint">
                        Чем подтверждается
                      </p>
                      <ul className="space-y-1 text-muted">
                        {s.evidence.map((e, i) => (
                          <li key={i} className="flex gap-2">
                            <span className="text-amber">·</span> {e}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(usedIn.length > 0 || projects.length > 0) && (
                    <div className="flex flex-wrap gap-4">
                      {usedIn.length > 0 && (
                        <div>
                          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-faint">Модули</p>
                          <div className="flex flex-wrap gap-1.5">
                            {usedIn.map((m) => (
                              <Link
                                key={m.number}
                                to={`/modules/${m.number}`}
                                className="rounded-md border border-line px-2 py-0.5 text-xs text-muted hover:border-line-strong hover:text-fg"
                              >
                                M{m.number}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                      {projects.length > 0 && (
                        <div>
                          <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-faint">Проекты</p>
                          <div className="flex flex-wrap gap-1.5">
                            {projects.map((p) => (
                              <Link
                                key={p.id}
                                to={`/projects/${p.id}`}
                                className="rounded-md border border-line px-2 py-0.5 text-xs text-muted hover:border-line-strong hover:text-fg"
                              >
                                {p.title}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs text-faint">Отметить уровень:</span>
                    {Array.from({ length: s.target + 1 }, (_, i) => (
                      <Button
                        key={i}
                        variant={level === i ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => setSkillLevel(s.id, i)}
                      >
                        {i}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
