import { useState } from 'react';
import { Check, ChevronDown, Eye, Lightbulb } from 'lucide-react';
import type { Task } from '@/content/types';
import { normalizeAnswer } from '@/content/parse';
import { useProgress } from '@/lib/progress';
import { Button, cx } from './ui';
import { Markdown } from './Markdown';

type Verdict = 'idle' | 'correct' | 'incorrect';

function checkAnswer(task: Task, value: string): boolean {
  const v = normalizeAnswer(value);
  if (!v) return false;
  if (task.answerPattern) {
    try {
      if (new RegExp(task.answerPattern, 'i').test(value.trim())) return true;
    } catch {
      /* invalid pattern in content: fall through to literal answers */
    }
  }
  return (task.answers ?? []).some((a) => normalizeAnswer(a) === v);
}

export function TaskCard({ task, index }: { task: Task; index?: number }) {
  const { state, toggleTask } = useProgress();
  const done = Boolean(state.tasks[task.id]);
  const [value, setValue] = useState('');
  const [verdict, setVerdict] = useState<Verdict>('idle');
  const [hintsShown, setHintsShown] = useState(0);
  const [solutionShown, setSolutionShown] = useState(false);

  const hints = task.hints ?? [];
  const checkable = task.input && ((task.answers?.length ?? 0) > 0 || Boolean(task.answerPattern));

  const submit = () => {
    if (!checkable) return;
    const ok = checkAnswer(task, value);
    setVerdict(ok ? 'correct' : 'incorrect');
    if (ok) toggleTask(task.id, true);
  };

  return (
    <div className="my-5 rounded-xl border border-line-strong bg-raised/60">
      <div className="flex items-start justify-between gap-3 border-b border-line px-4 py-2.5">
        <div className="flex items-center gap-2 text-sm font-semibold text-amber">
          <span className="rounded bg-amber/15 px-1.5 py-0.5 font-mono text-xs">TASK{index ? ` ${index}` : ''}</span>
          {task.title && <span className="text-fg">{task.title}</span>}
        </div>
        <label className="flex shrink-0 cursor-pointer items-center gap-2 text-xs text-muted">
          <input
            type="checkbox"
            checked={done}
            onChange={(e) => toggleTask(task.id, e.target.checked)}
            className="h-4 w-4 accent-[#e8b04b]"
          />
          Выполнено
        </label>
      </div>

      <div className="px-4 py-3">
        <Markdown content={task.prompt} compact />

        {task.input && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <input
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setVerdict('idle');
              }}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              placeholder="Введите команду или ответ…"
              spellCheck={false}
              className="min-w-[16rem] flex-1 rounded-lg border border-line bg-term px-3 py-2 font-mono text-sm text-fg placeholder:text-faint focus:border-amber"
            />
            {checkable && (
              <Button variant="primary" size="sm" onClick={submit}>
                Проверить
              </Button>
            )}
          </div>
        )}

        {verdict === 'correct' && (
          <p className="mt-2 flex items-center gap-1.5 text-sm text-mint">
            <Check size={15} /> Верно.
          </p>
        )}
        {verdict === 'incorrect' && (
          <p className="mt-2 text-sm text-rose">Пока не то. Попробуй ещё или открой подсказку.</p>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          {hints.map((_, i) =>
            i === hintsShown ? (
              <Button key={i} variant="ghost" size="sm" onClick={() => setHintsShown(i + 1)}>
                <Lightbulb size={14} /> Подсказка {i + 1}
              </Button>
            ) : null,
          )}
          {task.solution && !solutionShown && (
            <Button variant="ghost" size="sm" onClick={() => setSolutionShown(true)}>
              <Eye size={14} /> Решение
            </Button>
          )}
          {!task.input && !done && (
            <Button variant="secondary" size="sm" onClick={() => toggleTask(task.id, true)}>
              Отметить выполненным
            </Button>
          )}
        </div>

        {hints.slice(0, hintsShown).map((hint, i) => (
          <div key={i} className="mt-2 rounded-lg border border-line bg-panel px-3 py-2 text-sm">
            <span className="font-semibold text-amber">Подсказка {i + 1}. </span>
            <Markdown content={hint} compact inline />
          </div>
        ))}

        {solutionShown && task.solution && (
          <details open className="mt-2">
            <summary className="flex cursor-pointer items-center gap-1 text-sm font-semibold text-mint">
              <ChevronDown size={14} /> Решение
            </summary>
            <div className={cx('mt-2 rounded-lg border border-mint/20 bg-mint/5 px-3 py-2')}>
              <Markdown content={task.solution} compact />
            </div>
          </details>
        )}
      </div>
    </div>
  );
}
