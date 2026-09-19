import type { ReactNode } from 'react';
import { AlertTriangle, Info, Lightbulb, ShieldCheck } from 'lucide-react';
import { cx } from './ui';

export type CalloutKind = 'info' | 'warning' | 'safety' | 'tip';

const config: Record<CalloutKind, { icon: typeof Info; label: string; cls: string; iconCls: string }> = {
  info: { icon: Info, label: 'Заметка', cls: 'border-sky/30 bg-sky/8', iconCls: 'text-sky' },
  warning: { icon: AlertTriangle, label: 'Внимание', cls: 'border-rose/30 bg-rose/8', iconCls: 'text-rose' },
  safety: { icon: ShieldCheck, label: 'Правило безопасности', cls: 'border-amber/30 bg-amber/8', iconCls: 'text-amber' },
  tip: { icon: Lightbulb, label: 'Совет', cls: 'border-mint/30 bg-mint/8', iconCls: 'text-mint' },
};

export function Callout({ kind, title, children }: { kind: CalloutKind; title?: string; children: ReactNode }) {
  const c = config[kind];
  const Icon = c.icon;
  return (
    <div className={cx('my-4 rounded-lg border px-4 py-3', c.cls)}>
      <div className={cx('mb-1 flex items-center gap-2 text-sm font-semibold', c.iconCls)}>
        <Icon size={16} aria-hidden />
        {title ?? c.label}
      </div>
      <div className="text-[0.95rem] leading-relaxed text-fg [&>*+*]:mt-2 [&_a]:text-sky [&_a]:underline">
        {children}
      </div>
    </div>
  );
}
