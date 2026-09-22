import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Beaker,
  BookOpen,
  ChevronRight,
  FileCode2,
  FlagTriangleRight,
  FolderGit2,
  Gauge,
  GraduationCap,
  LayoutDashboard,
  Library,
  ListChecks,
  Search,
  ShieldHalf,
  Wrench,
} from 'lucide-react';
import { course } from '@/content';
import { useProgress } from '@/lib/progress';
import { moduleStatus } from '@/lib/selectors';
import { StatusIcon, cx } from './ui';

const primaryLinks = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/skills', label: 'Skills Matrix', icon: Gauge },
];

const libraryLinks = [
  { to: '/labs', label: 'Лаборатории', icon: Beaker },
  { to: '/projects', label: 'Проекты', icon: FolderGit2 },
  { to: '/challenges', label: 'Challenges', icon: FlagTriangleRight },
  { to: '/quizzes', label: 'Квизы', icon: ListChecks },
];

const referenceLinks = [
  { to: '/reference/commands', label: 'Команды', icon: FileCode2 },
  { to: '/reference/tools', label: 'Security Tools', icon: Wrench },
  { to: '/resources', label: 'Ресурсы', icon: Library },
];

function SectionHeading({ children }: { children: string }) {
  return <p className="px-3 pb-1 pt-4 text-[0.68rem] font-semibold uppercase tracking-wider text-faint">{children}</p>;
}

function itemClass(active: boolean) {
  return cx(
    'flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm transition-colors',
    active ? 'bg-raised text-fg' : 'text-muted hover:bg-raised/60 hover:text-fg',
  );
}

function ModuleTree() {
  const { state } = useProgress();
  const location = useLocation();
  const activeModule = /\/(?:modules\/(\d+)|lessons\/(\d+))/.exec(location.pathname);
  const activeNum = activeModule ? Number(activeModule[1] ?? activeModule[2]) : null;
  const [open, setOpen] = useState<Set<number>>(new Set(activeNum !== null ? [activeNum] : [0]));

  const toggle = (n: number) =>
    setOpen((s) => {
      const next = new Set(s);
      next.has(n) ? next.delete(n) : next.add(n);
      return next;
    });

  return (
    <div className="space-y-0.5">
      {course.modules.map((m) => {
        const status = moduleStatus(state, course, m);
        const isOpen = open.has(m.number);
        const hasLessons = m.lessons.length > 0;
        return (
          <div key={m.number}>
            <button
              type="button"
              onClick={(e) => { if (hasLessons) { e.stopPropagation(); toggle(m.number); } }}
              aria-expanded={hasLessons ? isOpen : undefined}
              className={cx(
                'group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 text-left text-sm transition-colors',
                activeNum === m.number ? 'text-fg' : 'text-muted hover:text-fg',
                hasLessons ? 'hover:bg-raised/60' : 'cursor-default opacity-70',
              )}
            >
              <ChevronRight
                size={14}
                aria-hidden
                className={cx(
                  'shrink-0 text-faint transition-transform',
                  isOpen && 'rotate-90',
                  !hasLessons && 'invisible',
                )}
              />
              <StatusIcon status={status} size={14} />
              <span className="flex-1 truncate">
                <span className="text-faint">M{m.number}</span> {m.title}
              </span>
              {!hasLessons && (
                <span className="shrink-0 rounded px-1 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide bg-raised text-faint">
                  Скоро
                </span>
              )}
            </button>
            {isOpen && hasLessons && (
              <ul className="ml-[1.35rem] border-l border-line pl-1">
                {m.lessons.map((l) => (
                  <li key={l.id}>
                    <NavLink
                      to={`/lessons/${l.id}`}
                      className={({ isActive }) =>
                        cx(
                          'flex items-center gap-2 rounded-md px-2.5 py-1 text-[0.82rem] transition-colors',
                          isActive ? 'bg-raised text-fg' : 'text-muted hover:bg-raised/50 hover:text-fg',
                        )
                      }
                    >
                      <StatusIcon
                        status={
                          state.lessons[l.id] === 'completed'
                            ? 'completed'
                            : state.lessons[l.id]
                              ? 'in_progress'
                              : 'not_started'
                        }
                        size={12}
                      />
                      <span className="truncate">
                        {l.kind === 'checkpoint' ? 'Checkpoint' : l.kind === 'lab' ? `${l.id} · Lab` : l.id} {l.kind === 'lesson' && l.title}
                        {l.kind !== 'lesson' && l.kind !== 'checkpoint' ? ` · ${l.title}` : ''}
                      </span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function Sidebar({ onSearch, onNavigate }: { onSearch: () => void; onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col" onClick={onNavigate}>
      <div className="flex items-center gap-2.5 px-4 py-4">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-amber/15 text-amber">
          <ShieldHalf size={20} />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-fg">Cybersecurity</p>
          <p className="text-xs text-muted">Academy</p>
        </div>
      </div>

      <div className="px-3">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSearch();
          }}
          className="flex w-full items-center gap-2 rounded-lg border border-line bg-raised/60 px-3 py-1.5 text-sm text-muted transition-colors hover:border-line-strong hover:text-fg"
        >
          <Search size={15} />
          <span className="flex-1 text-left">Поиск…</span>
          <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[0.65rem] text-faint">Ctrl K</kbd>
        </button>
      </div>

      <nav className="mt-2 flex-1 overflow-y-auto px-3 pb-6">
        {primaryLinks.map((l) => (
          <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => itemClass(isActive)}>
            <l.icon size={16} /> {l.label}
          </NavLink>
        ))}

        <SectionHeading>Курс</SectionHeading>
        <NavLink to="/course" className={({ isActive }) => itemClass(isActive)}>
          <BookOpen size={16} /> Все модули
        </NavLink>
        <div className="mt-1">
          <ModuleTree />
        </div>

        <SectionHeading>Практика</SectionHeading>
        {libraryLinks.map((l) => (
          <NavLink key={l.to} to={l.to} className={({ isActive }) => itemClass(isActive)}>
            <l.icon size={16} /> {l.label}
          </NavLink>
        ))}

        <SectionHeading>Справочник</SectionHeading>
        {referenceLinks.map((l) => (
          <NavLink key={l.to} to={l.to} className={({ isActive }) => itemClass(isActive)}>
            <l.icon size={16} /> {l.label}
          </NavLink>
        ))}

        <SectionHeading>Прочее</SectionHeading>
        <NavLink to="/settings" className={({ isActive }) => itemClass(isActive)}>
          <GraduationCap size={16} /> Прогресс и настройки
        </NavLink>
      </nav>
    </div>
  );
}
