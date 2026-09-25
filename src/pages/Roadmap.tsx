import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, Clock, Lock, Map } from 'lucide-react';
import { course } from '@/content';
import { useProgress } from '@/lib/progress';
import { moduleStatus } from '@/lib/selectors';
import { cx } from '@/components/ui';

const phaseColors: Record<number, { bg: string; border: string; text: string; dot: string }> = {
  1: { bg: 'bg-blue-500/10', border: 'border-blue-500/30', text: 'text-blue-400', dot: 'bg-blue-500' },
  2: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', dot: 'bg-orange-500' },
  3: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', dot: 'bg-emerald-500' },
  4: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', dot: 'bg-purple-500' },
  5: { bg: 'bg-amber/10', border: 'border-amber/30', text: 'text-amber', dot: 'bg-amber' },
};

function StatusDot({ status }: { status: string }) {
  if (status === 'completed') return <CheckCircle2 size={14} className="shrink-0 text-green-400" />;
  if (status === 'in_progress') return <Clock size={14} className="shrink-0 text-amber" />;
  if (status === 'locked') return <Lock size={14} className="shrink-0 text-faint" />;
  return <Circle size={14} className="shrink-0 text-faint" />;
}

export function RoadmapPage() {
  const { state } = useProgress();

  return (
    <div>
      <header className="mb-8">
        <div className="flex items-center gap-2 text-amber">
          <Map size={18} />
          <span className="text-sm font-medium">Карта курса</span>
        </div>
        <h1 className="mt-1 text-[2rem] font-semibold tracking-tight text-[#f2f5f9]">Роадмап «Карманный Хакер»</h1>
        <p className="mt-2 text-sm text-muted">
          22 модуля · 5 этапов · 18 месяцев · от нуля до практикующего специалиста
        </p>
      </header>

      <div className="space-y-10">
        {course.phases.map((phase) => {
          const phaseMods = course.modules.filter((m) => m.phase === phase.number);
          const colors = phaseColors[phase.number] ?? phaseColors[1];
          const completedCount = phaseMods.filter((m) => {
            const s = moduleStatus(state, course, m);
            return s === 'completed';
          }).length;

          return (
            <section key={phase.number}>
              {/* Phase header */}
              <div className={cx('mb-4 flex items-center gap-3 rounded-xl border px-5 py-4', colors.bg, colors.border)}>
                <div className={cx('h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-sm font-bold text-bg', colors.dot)}>
                  {phase.number}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <h2 className={cx('text-lg font-semibold', colors.text)}>{phase.title}</h2>
                    {phase.months && (
                      <span className="text-xs text-muted">мес. {phase.months}</span>
                    )}
                  </div>
                </div>
                <span className="shrink-0 text-xs text-muted">
                  {completedCount}/{phaseMods.length} модулей
                </span>
              </div>

              {/* Module cards grid */}
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {phaseMods.map((m) => {
                  const status = moduleStatus(state, course, m);
                  const firstLesson = m.lessons[0];
                  const completedLessons = m.lessons.filter(
                    (l) => state.lessons[l.id] === 'completed',
                  ).length;
                  const pct = m.lessons.length > 0
                    ? Math.round((completedLessons / m.lessons.length) * 100)
                    : 0;

                  return (
                    <div
                      key={m.number}
                      className={cx(
                        'group rounded-xl border p-4 transition-colors',
                        status === 'locked'
                          ? 'border-line bg-panel/40 opacity-60'
                          : 'border-line bg-panel hover:border-line-strong',
                      )}
                    >
                      <div className="mb-2 flex items-start gap-2">
                        <StatusDot status={status} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-baseline gap-1.5 flex-wrap">
                            <span className="shrink-0 font-mono text-xs text-faint">M{m.number}</span>
                            <span className="text-sm font-medium text-fg leading-snug">{m.title}</span>
                          </div>
                        </div>
                      </div>

                      <p className="mb-3 text-xs text-muted leading-relaxed line-clamp-2">
                        {m.summary}
                      </p>

                      {/* Progress bar */}
                      {m.available && (
                        <div className="mb-3">
                          <div className="h-1 w-full rounded-full bg-raised overflow-hidden">
                            <div
                              className={cx('h-full rounded-full transition-all', colors.dot)}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <p className="mt-1 text-[0.65rem] text-faint">
                            {completedLessons}/{m.lessons.length} уроков
                          </p>
                        </div>
                      )}

                      {/* Action */}
                      {m.available && firstLesson ? (
                        <Link
                          to={`/lessons/${firstLesson.id}`}
                          className={cx(
                            'inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                            status === 'completed'
                              ? 'bg-raised text-muted hover:text-fg'
                              : `${colors.bg} ${colors.text} hover:opacity-80`,
                          )}
                        >
                          {status === 'completed' ? 'Повторить' : status === 'in_progress' ? 'Продолжить' : 'Начать'}
                        </Link>
                      ) : m.available ? (
                        <Link
                          to={`/modules/${m.number}`}
                          className={cx(
                            'inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                            `${colors.bg} ${colors.text} hover:opacity-80`,
                          )}
                        >
                          Открыть
                        </Link>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-raised px-3 py-1.5 text-xs text-faint">
                          Скоро
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      <p className="mt-10 text-center text-xs text-faint">
        Времены этапов ориентировочные и зависят от темпа обучения. Практика важнее скорости.
      </p>
    </div>
  );
}
