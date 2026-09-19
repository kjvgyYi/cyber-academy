import { Link } from 'react-router-dom';
import type { ReactNode, ButtonHTMLAttributes } from 'react';
import { CheckCircle2, ChevronRight, Circle, CircleDashed, Lock } from 'lucide-react';
import type { Status } from '@/lib/selectors';
import type { Difficulty } from '@/content/types';

export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}

export const statusLabel: Record<Status, string> = {
  not_started: 'Не начато',
  in_progress: 'В процессе',
  completed: 'Завершено',
  locked: 'Закрыто',
};

export function StatusIcon({ status, size = 16 }: { status: Status; size?: number }) {
  const common = { size, 'aria-hidden': true } as const;
  switch (status) {
    case 'completed':
      return <CheckCircle2 {...common} className="shrink-0 text-mint" />;
    case 'in_progress':
      return <CircleDashed {...common} className="shrink-0 text-amber" />;
    case 'locked':
      return <Lock {...common} className="shrink-0 text-faint" />;
    default:
      return <Circle {...common} className="shrink-0 text-faint" />;
  }
}

export function StatusBadge({ status }: { status: Status }) {
  const tone = {
    completed: 'text-mint border-mint/30 bg-mint/10',
    in_progress: 'text-amber border-amber/30 bg-amber/10',
    locked: 'text-faint border-line bg-raised',
    not_started: 'text-muted border-line bg-raised',
  }[status];
  return (
    <span className={cx('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs', tone)}>
      <StatusIcon status={status} size={13} />
      {statusLabel[status]}
    </span>
  );
}

export function Badge({ children, tone = 'default' }: { children: ReactNode; tone?: 'default' | 'sky' | 'amber' | 'rose' | 'mint' }) {
  const tones = {
    default: 'border-line text-muted bg-raised',
    sky: 'border-sky/30 text-sky bg-sky/10',
    amber: 'border-amber/30 text-amber bg-amber/10',
    rose: 'border-rose/30 text-rose bg-rose/10',
    mint: 'border-mint/30 text-mint bg-mint/10',
  };
  return <span className={cx('inline-flex items-center rounded-md border px-2 py-0.5 text-xs', tones[tone])}>{children}</span>;
}

const difficultyLabel: Record<Difficulty, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

export function DifficultyBadge({ value }: { value: Difficulty }) {
  const tone = value === 'beginner' ? 'mint' : value === 'intermediate' ? 'amber' : 'rose';
  return <Badge tone={tone}>{difficultyLabel[value]}</Badge>;
}

export function ProgressBar({ value, label, size = 'md' }: { value: number; label?: string; size?: 'sm' | 'md' }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? 'Прогресс'}
      className={cx('w-full overflow-hidden rounded-full bg-raised', size === 'sm' ? 'h-1.5' : 'h-2.5')}
    >
      <div
        className="h-full rounded-full bg-amber transition-[width] duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/** Level meter: filled segments up to `value`, target marked. */
export function LevelMeter({ value, target, max = 4 }: { value: number; target: number; max?: number }) {
  return (
    <div className="flex gap-1" aria-label={`Уровень ${value} из ${target}`}>
      {Array.from({ length: max }, (_, i) => (
        <span
          key={i}
          className={cx(
            'h-2 w-6 rounded-sm',
            i < value ? 'bg-amber' : i < target ? 'bg-line-strong' : 'bg-raised',
          )}
        />
      ))}
    </div>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md';
};

export function Button({ variant = 'secondary', size = 'md', className, ...rest }: ButtonProps) {
  const variants = {
    primary: 'bg-amber text-ink hover:bg-[#f0c065] font-semibold',
    secondary: 'border border-line-strong bg-raised text-fg hover:border-faint hover:bg-[#283547]',
    ghost: 'text-muted hover:text-fg hover:bg-raised',
  };
  return (
    <button
      type="button"
      className={cx(
        'inline-flex items-center justify-center gap-2 rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        size === 'sm' ? 'px-2.5 py-1 text-sm' : 'px-4 py-2 text-sm',
        variants[variant],
        className,
      )}
      {...rest}
    />
  );
}

export function Panel({ children, className, as: As = 'section', id }: { children: ReactNode; className?: string; as?: 'section' | 'div' | 'article'; id?: string }) {
  return (
    <As id={id} className={cx('rounded-xl border border-line bg-panel', className)}>
      {children}
    </As>
  );
}

export interface Crumb {
  label: string;
  to?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Навигация по разделам" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted">
        {items.map((c, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight size={14} aria-hidden className="text-faint" />}
            {c.to ? (
              <Link to={c.to} className="hover:text-fg">
                {c.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-fg">
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHeader({ title, lead, children }: { title: ReactNode; lead?: ReactNode; children?: ReactNode }) {
  return (
    <header className="mb-8">
      <h1 className="text-[1.9rem] font-semibold leading-tight tracking-tight text-[#f2f5f9]">{title}</h1>
      {lead && <p className="mt-2 max-w-[70ch] text-muted">{lead}</p>}
      {children && <div className="mt-4">{children}</div>}
    </header>
  );
}

export function SectionTitle({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h2 id={id} className="mb-3 text-lg font-semibold text-[#eef2f7]">
      {children}
    </h2>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-line-strong p-8 text-center">
      <p className="font-medium">{title}</p>
      {children && <div className="mt-2 text-sm text-muted">{children}</div>}
    </div>
  );
}
