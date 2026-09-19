import { Link } from 'react-router-dom';
import { Button } from '@/components/ui';

export function NotFound() {
  return (
    <div className="py-20 text-center">
      <p className="font-mono text-5xl text-faint">404</p>
      <h1 className="mt-4 text-xl font-semibold text-fg">Страница не найдена</h1>
      <p className="mt-2 text-muted">Возможно, этот раздел ещё в разработке.</p>
      <Link to="/" className="mt-6 inline-block">
        <Button variant="primary">На главную</Button>
      </Link>
    </div>
  );
}
