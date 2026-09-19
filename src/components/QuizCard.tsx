import { useMemo, useState } from 'react';
import { Check, RotateCcw, X } from 'lucide-react';
import type { Quiz } from '@/content/types';
import { useProgress } from '@/lib/progress';
import { Button, cx } from './ui';
import { Markdown } from './Markdown';

export function QuizCard({ quiz }: { quiz: Quiz }) {
  const { state, recordQuiz } = useProgress();
  const prior = state.quizzes[quiz.id];
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(
    () => quiz.questions.reduce((acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0), 0),
    [answers, quiz.questions],
  );
  const total = quiz.questions.length;
  const allAnswered = Object.keys(answers).length === total;

  const submit = () => {
    setSubmitted(true);
    recordQuiz(quiz.id, score, total);
  };
  const retry = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <div className="my-6 rounded-xl border border-line bg-panel">
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <h3 className="font-semibold text-[#eef2f7]">{quiz.title}</h3>
        {prior && !submitted && (
          <span className="text-xs text-muted">
            Лучший результат: {prior.best}/{prior.total}
          </span>
        )}
      </div>

      <ol className="divide-y divide-line">
        {quiz.questions.map((q, qi) => {
          const chosen = answers[qi];
          return (
            <li key={qi} className="px-4 py-4">
              <p className="mb-3 text-sm font-medium text-fg">
                <span className="mr-2 text-faint">{qi + 1}.</span>
                {q.q}
              </p>
              <div className="space-y-2">
                {q.options.map((opt, oi) => {
                  const isChosen = chosen === oi;
                  const isCorrect = oi === q.answer;
                  const showState = submitted && (isChosen || isCorrect);
                  return (
                    <label
                      key={oi}
                      className={cx(
                        'flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2 text-sm transition-colors',
                        !submitted && isChosen && 'border-amber bg-amber/10',
                        !submitted && !isChosen && 'border-line hover:border-line-strong',
                        showState && isCorrect && 'border-mint/50 bg-mint/10',
                        showState && isChosen && !isCorrect && 'border-rose/50 bg-rose/10',
                        submitted && !showState && 'border-line opacity-60',
                      )}
                    >
                      <input
                        type="radio"
                        name={`${quiz.id}-${qi}`}
                        checked={isChosen}
                        disabled={submitted}
                        onChange={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                        className="h-4 w-4 accent-[#e8b04b]"
                      />
                      <span className="flex-1">{opt}</span>
                      {showState && isCorrect && <Check size={15} className="text-mint" />}
                      {showState && isChosen && !isCorrect && <X size={15} className="text-rose" />}
                    </label>
                  );
                })}
              </div>
              {submitted && (
                <div className="mt-2 rounded-lg border border-line bg-raised px-3 py-2 text-sm text-muted">
                  <span className={cx('font-semibold', chosen === q.answer ? 'text-mint' : 'text-rose')}>
                    {chosen === q.answer ? 'Верно. ' : 'Разбор. '}
                  </span>
                  <Markdown content={q.explanation} compact inline />
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <div className="flex items-center justify-between gap-3 border-t border-line px-4 py-3">
        {submitted ? (
          <>
            <p className="text-sm">
              Результат:{' '}
              <span className={cx('font-semibold', score === total ? 'text-mint' : score >= total * 0.6 ? 'text-amber' : 'text-rose')}>
                {score}/{total}
              </span>
            </p>
            <Button variant="secondary" size="sm" onClick={retry}>
              <RotateCcw size={14} /> Пройти заново
            </Button>
          </>
        ) : (
          <>
            <p className="text-xs text-muted">
              Отвечено {Object.keys(answers).length}/{total}
            </p>
            <Button variant="primary" size="sm" onClick={submit} disabled={!allAnswered}>
              Проверить ответы
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
