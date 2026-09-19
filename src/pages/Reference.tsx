import { useMemo, useState } from 'react';
import { course } from '@/content';
import { slugify } from '@/content/parse';
import { Terminal } from '@/components/CodeBlock';
import { Badge, EmptyState, PageHeader, Panel, cx } from '@/components/ui';

export function CommandsPage() {
  const [q, setQ] = useState('');
  const categories = useMemo(() => {
    const map = new Map<string, typeof course.commands>();
    for (const c of course.commands) {
      if (q && !(`${c.name} ${c.purpose} ${c.category}`.toLowerCase().includes(q.toLowerCase()))) continue;
      const arr = map.get(c.category) ?? [];
      arr.push(c);
      map.set(c.category, arr);
    }
    return [...map.entries()];
  }, [q]);

  if (!course.commands.length)
    return (
      <div>
        <PageHeader title="Command Reference" lead="Справочник команд с назначением, синтаксисом и связью с безопасностью." />
        <EmptyState title="Команды добавляются вместе с уроками" />
      </div>
    );

  return (
    <div>
      <PageHeader title="Command Reference" lead="Справочник команд: назначение, синтаксис, примеры и связь с безопасностью." />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Фильтр по команде или категории…"
        className="mb-6 w-full rounded-lg border border-line bg-raised px-3 py-2 text-sm text-fg placeholder:text-faint focus:border-amber"
      />

      {categories.map(([cat, cmds]) => (
        <section key={cat} className="mb-8">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-faint">{cat}</h2>
          <div className="space-y-3">
            {cmds.map((c) => (
              <Panel key={c.name} id={`cmd-${slugify(c.name)}`} className="scroll-mt-24 p-4">
                <div className="flex items-center gap-2">
                  <code className="rounded bg-raised px-2 py-0.5 font-mono text-sm text-amber">{c.name}</code>
                  <span className="text-sm text-muted">{c.purpose}</span>
                </div>
                <div className="mt-3 grid gap-3 text-sm sm:grid-cols-[auto_1fr]">
                  <span className="text-faint">Синтаксис</span>
                  <code className="font-mono text-[0.82rem] text-fg">{c.syntax}</code>
                </div>
                {c.examples.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {c.examples.map((ex, i) => (
                      <div key={i}>
                        <code className="block rounded bg-term px-3 py-1.5 font-mono text-[0.82rem] text-fg">{ex.cmd}</code>
                        {ex.note && <p className="mt-1 text-xs text-muted">{ex.note}</p>}
                      </div>
                    ))}
                  </div>
                )}
                {c.security && (
                  <p className="mt-3 border-l-2 border-amber/40 pl-3 text-sm text-muted">
                    <span className="text-amber">Security: </span>
                    {c.security}
                  </p>
                )}
              </Panel>
            ))}
          </div>
        </section>
      ))}
      {categories.length === 0 && <EmptyState title={`Нет команд по запросу «${q}»`} />}
    </div>
  );
}

export function ToolsPage() {
  if (!course.tools.length)
    return (
      <div>
        <PageHeader title="Security Tools" lead="Справочник инструментов: назначение, безопасное применение, интерпретация вывода." />
        <EmptyState title="Инструменты добавляются вместе с модулями" />
      </div>
    );

  return (
    <div>
      <PageHeader
        title="Security Tools Reference"
        lead="Инструменты Kali и не только: для чего, на каком этапе, как безопасно применять и как читать вывод."
      />
      <div className="space-y-3">
        {course.tools.map((t) => (
          <Panel key={t.name} id={`tool-${slugify(t.name)}`} className="scroll-mt-24 p-5">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold text-fg">{t.name}</h3>
              <Badge tone="sky">{t.category}</Badge>
              <Badge>{t.phase}</Badge>
              {t.modules.length > 0 && (
                <span className="font-mono text-xs text-faint">
                  M{t.modules.join(', M')}
                </span>
              )}
            </div>
            <p className="text-sm text-muted">{t.purpose}</p>

            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-faint">Базовое применение</p>
                <code className="font-mono text-[0.82rem] text-fg">{t.usage}</code>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-faint">Безопасная лаборатория</p>
                <p className="text-sm text-muted">{t.safeLab}</p>
              </div>
            </div>

            {t.example && <Terminal raw={t.example} />}
            {t.output && (
              <p className={cx('mt-2 border-l-2 border-line-strong pl-3 text-sm text-muted')}>
                <span className="text-faint">Как читать вывод: </span>
                {t.output}
              </p>
            )}
          </Panel>
        ))}
      </div>
    </div>
  );
}
