import { Link } from 'react-router-dom';
import { ListChecks } from 'lucide-react';
import { course, lessonById } from '@/content';
import { useProgress } from '@/lib/progress';
import { Badge, EmptyState, PageHeader, Panel } from '@/components/ui';

export function QuizzesPage() {
  const { state } = useProgress();
  if (!course.quizzes.length)
    return (
      <div>
        <PageHeader title="Квизы" lead="Короткие проверки после ключевых уроков." />
        <EmptyState title="Квизы появятся вместе с уроками" />
      </div>
    );

  return (
    <div>
      <PageHeader title="Квизы" lead="Короткие проверки понимания. Проходятся внутри уроков; здесь — сводка результатов." />
      <div className="space-y-2.5">
        {course.quizzes.map((q) => {
          const result = state.quizzes[q.id];
          const lesson = q.lesson ? lessonById.get(q.lesson) : undefined;
          return (
            <Panel key={q.id} className="flex items-center gap-3 p-4">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-raised text-amber">
                <ListChecks size={17} />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-medium text-fg">{q.title}</h3>
                <p className="text-sm text-muted">
                  {q.questions.length} вопросов
                  {lesson && (
                    <>
                      {' · '}
                      <Link to={`/lessons/${lesson.id}`} className="text-sky hover:underline">
                        {lesson.title}
                      </Link>
                    </>
                  )}
                </p>
              </div>
              {result ? (
                <Badge tone={result.best === result.total ? 'mint' : 'amber'}>
                  {result.best}/{result.total}
                </Badge>
              ) : (
                <Badge>Не пройден</Badge>
              )}
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
