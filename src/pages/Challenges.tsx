import { useState } from 'react';
import { CheckCircle2, ChevronDown, Eye, Lightbulb, Lock } from 'lucide-react';
import { course, lessonById } from '@/content';
import { useProgress } from '@/lib/progress';
import { challengeStatus } from '@/lib/selectors';
import { Markdown } from '@/components/Markdown';
import { Button, DifficultyBadge, EmptyState, PageHeader, Panel, StatusBadge, cx } from '@/components/ui';
import type { Challenge } from '@/content/types';

function ChallengeItem({ c }: { c: Challenge }) {
  const { state, toggleChallenge } = useProgress();
  const status = challengeStatus(state, c);
  const locked = status === 'locked';
  const done = status === 'completed';
  const [open, setOpen] = useState(false);
  const [hints, setHints] = useState(0);
  const [solution, setSolution] = useState(false);

  return (
    <Panel id={c.id} className={cx('scroll-mt-24', locked && 'opacity-70')}>
      <button
        type="button"
        onClick={() => !locked && setOpen((o) => !o)}
        disabled={locked}
        aria-expanded={open}
        className="flex w-full items-center gap-3 p-4 text-left disabled:cursor-not-allowed"
      >
        {locked ? (
          <Lock size={17} className="shrink-0 text-faint" />
        ) : (
          <ChevronDown size={16} className={cx('shrink-0 text-faint transition-transform', open && 'rotate-180')} />
        )}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-faint">#{String(c.number).padStart(2, '0')}</span>
            <h3 className="font-medium text-fg">{c.title}</h3>
          </div>
          {locked && c.unlockAfter && (
            <p className="mt-0.5 text-xs text-faint">
              Откроется после урока {c.unlockAfter} — {lessonById.get(c.unlockAfter)?.title}
            </p>
          )}
        </div>
        <DifficultyBadge value={c.difficulty} />
        <StatusBadge status={status} />
      </button>

      {open && !locked && (
        <div className="space-y-4 border-t border-line px-4 py-4">
          <Markdown content={c.scenario} compact />

          {c.questions.length > 0 && (
            <div>
              <p className="mb-1.5 text-sm font-semibold text-[#eef2f7]">Вопросы</p>
              <ol className="list-decimal space-y-1 pl-5 text-sm text-muted">
                {c.questions.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ol>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {c.hints.map((_, i) =>
              i === hints ? (
                <Button key={i} variant="ghost" size="sm" onClick={() => setHints(i + 1)}>
                  <Lightbulb size={14} /> Подсказка {i + 1}
                </Button>
              ) : null,
            )}
            {c.solution && !solution && (
              <Button variant="ghost" size="sm" onClick={() => setSolution(true)}>
                <Eye size={14} /> Разбор
              </Button>
            )}
          </div>

          {c.hints.slice(0, hints).map((h, i) => (
            <div key={i} className="rounded-lg border border-line bg-raised px-3 py-2 text-sm">
              <span className="font-semibold text-amber">Подсказка {i + 1}. </span>
              <Markdown content={h} compact inline />
            </div>
          ))}

          {solution && c.solution && (
            <div className="rounded-lg border border-mint/20 bg-mint/5 px-3 py-2">
              <Markdown content={c.solution} compact />
            </div>
          )}

          <Button
            variant={done ? 'secondary' : 'primary'}
            size="sm"
            onClick={() => toggleChallenge(c.id)}
          >
            <CheckCircle2 size={15} /> {done ? 'Снять отметку' : 'Отметить решённым'}
          </Button>
        </div>
      )}
    </Panel>
  );
}

export function ChallengesPage() {
  return (
    <div>
      <PageHeader
        title="Security Challenges"
        lead="Небольшие задачи на применение навыков. Открываются по мере прохождения уроков."
      />
      {course.challenges.length ? (
        <div className="space-y-2.5">
          {course.challenges
            .slice()
            .sort((a, b) => a.number - b.number)
            .map((c) => (
              <ChallengeItem key={c.id} c={c} />
            ))}
        </div>
      ) : (
        <EmptyState title="Challenges появятся по мере прохождения курса" />
      )}
    </div>
  );
}
