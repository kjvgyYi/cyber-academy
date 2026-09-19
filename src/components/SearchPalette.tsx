import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { course } from '@/content';
import { buildSearchIndex, search, type SearchHit } from '@/lib/search';
import { cx } from './ui';

export function SearchPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const index = useMemo(() => buildSearchIndex(course), []);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const hits: SearchHit[] = useMemo(() => (query.trim() ? search(index, query) : []), [index, query]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
      // Focus after the dialog paints.
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => setActive(0), [query]);

  if (!open) return null;

  const go = (hit: SearchHit) => {
    onClose();
    navigate(hit.href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, hits.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter' && hits[active]) {
      e.preventDefault();
      go(hits[active]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 px-4 pt-[12vh]"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-xl border border-line-strong bg-panel shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Поиск по курсу"
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Search size={18} className="text-faint" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Найти урок, команду, инструмент, проект…"
            className="w-full bg-transparent py-3.5 text-fg placeholder:text-faint focus:outline-none"
          />
        </div>

        <div className="max-h-[55vh] overflow-y-auto">
          {query.trim() && hits.length === 0 && (
            <p className="px-4 py-8 text-center text-sm text-muted">Ничего не найдено по запросу «{query}».</p>
          )}
          {!query.trim() && (
            <p className="px-4 py-8 text-center text-sm text-muted">
              Введите запрос. Поиск идёт по модулям, урокам, командам, инструментам, проектам и ресурсам.
            </p>
          )}
          <ul>
            {hits.map((hit, i) => (
              <li key={hit.href + i}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(hit)}
                  className={cx(
                    'flex w-full items-start gap-3 border-b border-line/60 px-4 py-2.5 text-left',
                    i === active ? 'bg-raised' : 'hover:bg-raised/50',
                  )}
                >
                  <span className="mt-0.5 shrink-0 rounded border border-line px-1.5 py-0.5 text-[0.65rem] text-faint">
                    {hit.kind}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm text-fg">{hit.title}</span>
                    <span className="block truncate text-xs text-muted">{hit.snippet || hit.subtitle}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-4 border-t border-line px-4 py-2 text-[0.7rem] text-faint">
          <span>↑↓ выбрать</span>
          <span>↵ открыть</span>
          <span>esc закрыть</span>
        </div>
      </div>
    </div>
  );
}
