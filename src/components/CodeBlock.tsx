import { useState, type ReactNode } from 'react';
import { Check, Copy, TerminalSquare } from 'lucide-react';
import { cx } from './ui';

function useCopy() {
  const [copied, setCopied] = useState(false);
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for environments without clipboard permission.
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
      } catch {
        /* ignore */
      }
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  return { copied, copy };
}

function CopyButton({ text }: { text: string }) {
  const { copied, copy } = useCopy();
  return (
    <button
      type="button"
      onClick={() => copy(text)}
      className="inline-flex items-center gap-1.5 rounded-md border border-line px-2 py-1 text-xs text-muted transition-colors hover:border-faint hover:text-fg"
      aria-label={copied ? 'Скопировано' : 'Скопировать'}
    >
      {copied ? <Check size={13} className="text-mint" /> : <Copy size={13} />}
      {copied ? 'Готово' : 'Copy'}
    </button>
  );
}

export function CodeBlock({ code, className, children }: { code: string; className?: string; children: ReactNode }) {
  const lang = /language-(\w+)/.exec(className ?? '')?.[1];
  return (
    <div className="group relative my-4 overflow-hidden rounded-lg border border-line bg-term">
      <div className="flex items-center justify-between border-b border-line/70 bg-black/20 px-3 py-1.5">
        <span className="font-mono text-[0.7rem] uppercase tracking-wider text-faint">{lang ?? 'code'}</span>
        <CopyButton text={code} />
      </div>
      <pre className="overflow-x-auto p-4 text-[0.86rem] leading-relaxed">
        <code className={cx('font-mono', className)}>{children}</code>
      </pre>
    </div>
  );
}

/**
 * Fake-terminal display for example command sessions. Lines prefixed with "$ "
 * are treated as the command (kali prompt); everything else is output.
 * It never executes anything — it is a visual example only.
 */
export function Terminal({ raw }: { raw: string }) {
  const lines = raw.replace(/\n$/, '').split('\n');
  const commandText = lines
    .filter((l) => l.startsWith('$ '))
    .map((l) => l.slice(2))
    .join('\n');
  return (
    <div className="my-4 overflow-hidden rounded-lg border border-line-strong bg-term">
      <div className="flex items-center justify-between border-b border-line/60 px-3 py-1.5">
        <span className="inline-flex items-center gap-1.5 font-mono text-[0.7rem] uppercase tracking-wider text-faint">
          <TerminalSquare size={13} /> Пример вывода
        </span>
        {commandText && <CopyButton text={commandText} />}
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[0.84rem] leading-relaxed">
        {lines.map((line, i) => {
          if (line.startsWith('$ ')) {
            return (
              <div key={i}>
                <span className="select-none text-mint">┌──(</span>
                <span className="select-none text-sky">kali㉿student</span>
                <span className="select-none text-mint">)-[~]</span>
                {'\n'}
                <span className="select-none text-mint">└─$ </span>
                <span className="text-fg">{line.slice(2)}</span>
              </div>
            );
          }
          return (
            <div key={i} className="text-[#a9b4c4]">
              {line || '\u00a0'}
            </div>
          );
        })}
      </pre>
    </div>
  );
}
