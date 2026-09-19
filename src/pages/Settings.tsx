import { useRef, useState } from 'react';
import { Download, RotateCcw, Upload } from 'lucide-react';
import { contentErrors } from '@/content';
import { useProgress, sanitize } from '@/lib/progress';
import { Button, PageHeader, Panel } from '@/components/ui';
import { Callout } from '@/components/Callout';

export function SettingsPage() {
  const { state, replace, reset, setUnlockAll } = useProgress();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const exportData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cyber-academy-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = sanitize(JSON.parse(String(reader.result)));
        replace(parsed);
        setMsg('Прогресс импортирован.');
      } catch {
        setMsg('Не удалось прочитать файл: неверный формат.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <PageHeader title="Прогресс и настройки" lead="Прогресс хранится локально в браузере (localStorage). Здесь можно сделать резервную копию или сбросить его." />

      <Panel className="mb-6 p-5">
        <h2 className="mb-1 font-semibold text-[#eef2f7]">Резервная копия</h2>
        <p className="mb-4 text-sm text-muted">
          Экспортируй прогресс в файл, чтобы перенести его на другой браузер или сохранить перед сбросом.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button onClick={exportData}>
            <Download size={16} /> Экспорт JSON
          </Button>
          <Button variant="secondary" onClick={() => fileRef.current?.click()}>
            <Upload size={16} /> Импорт JSON
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) importData(f);
              e.target.value = '';
            }}
          />
        </div>
        {msg && <p className="mt-3 text-sm text-mint">{msg}</p>}
      </Panel>

      <Panel className="mb-6 p-5">
        <h2 className="mb-1 font-semibold text-[#eef2f7]">Доступ к модулям</h2>
        <label className="flex items-center gap-3 text-sm text-muted">
          <input
            type="checkbox"
            checked={state.unlockAll}
            onChange={(e) => setUnlockAll(e.target.checked)}
            className="h-4 w-4 accent-[#e8b04b]"
          />
          Открыть все модули сразу (игнорировать последовательную блокировку)
        </label>
      </Panel>

      <Panel className="mb-6 p-5">
        <h2 className="mb-1 font-semibold text-[#eef2f7]">Сброс</h2>
        <p className="mb-4 text-sm text-muted">Удаляет весь локальный прогресс: пройденные уроки, результаты квизов, закладки. Отменить нельзя.</p>
        {confirmReset ? (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-rose">Точно сбросить весь прогресс?</span>
            <Button
              variant="secondary"
              onClick={() => {
                reset();
                setConfirmReset(false);
                setMsg('Прогресс сброшен.');
              }}
            >
              Да, сбросить
            </Button>
            <Button variant="ghost" onClick={() => setConfirmReset(false)}>
              Отмена
            </Button>
          </div>
        ) : (
          <Button variant="secondary" onClick={() => setConfirmReset(true)}>
            <RotateCcw size={16} /> Сбросить прогресс
          </Button>
        )}
      </Panel>

      {contentErrors.length > 0 && (
        <Callout kind="warning" title="Проблемы в контенте (для автора)">
          <ul className="list-disc pl-5 font-mono text-xs">
            {contentErrors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </Callout>
      )}
    </div>
  );
}
