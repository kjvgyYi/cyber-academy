import { Fragment, type ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import YAML from 'yaml';
import type { Task } from '@/content/types';
import { slugify } from '@/content/parse';
import { quizById } from '@/content';
import { CodeBlock, Terminal } from './CodeBlock';
import { Callout, type CalloutKind } from './Callout';
import { TaskCard } from './TaskCard';
import { QuizCard } from './QuizCard';

/*
 * Custom fenced blocks are handled here, because react-markdown alone cannot
 * turn a ```task block into an interactive React component. We split the raw
 * text on those fences, render the special ones as components, and hand the
 * plain Markdown between them to react-markdown.
 */

interface ResourceItem {
  title?: string;
  name?: string;
  author?: string;
  url?: string;
  note?: string;
}

interface ResourceBlockData {
  books?: ResourceItem[];
  platforms?: ResourceItem[];
  tools?: ResourceItem[];
  videos?: ResourceItem[];
}

type Segment =
  | { type: 'md'; text: string }
  | { type: 'terminal'; text: string }
  | { type: 'task'; task: Task }
  | { type: 'quiz'; id: string }
  | { type: 'callout'; kind: CalloutKind; title?: string; body: string }
  | { type: 'resources'; data: ResourceBlockData };

const SPECIAL = /^```(terminal|task|quiz|info|warning|safety|tip|resources)([^\n]*)\n([\s\S]*?)^```[ \t]*$/gm;

function parseSegments(md: string): Segment[] {
  const segments: Segment[] = [];
  let last = 0;
  for (const m of md.matchAll(SPECIAL)) {
    const [full, kind, meta, inner] = m;
    const start = m.index ?? 0;
    if (start > last) segments.push({ type: 'md', text: md.slice(last, start) });
    last = start + full.length;

    if (kind === 'terminal') {
      segments.push({ type: 'terminal', text: inner });
    } else if (kind === 'task') {
      try {
        const task = YAML.parse(inner) as Task;
        if (task?.id) segments.push({ type: 'task', task });
      } catch {
        segments.push({ type: 'md', text: '```\n' + inner + '```' });
      }
    } else if (kind === 'quiz') {
      segments.push({ type: 'quiz', id: inner.trim() });
    } else if (kind === 'resources') {
      try {
        const data = YAML.parse(inner) as ResourceBlockData;
        segments.push({ type: 'resources', data: data ?? {} });
      } catch {
        segments.push({ type: 'md', text: '```\n' + inner + '```' });
      }
    } else {
      segments.push({
        type: 'callout',
        kind: kind as CalloutKind,
        title: meta.trim() || undefined,
        body: inner,
      });
    }
  }
  if (last < md.length) segments.push({ type: 'md', text: md.slice(last) });
  return segments;
}

function extractText(node: ReactNode): string {
  if (node == null || node === false) return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (typeof node === 'object' && 'props' in (node as { props?: { children?: ReactNode } })) {
    return extractText((node as { props: { children?: ReactNode } }).props.children);
  }
  return '';
}

function ResourceBlock({ data }: { data: ResourceBlockData }) {
  const sections: Array<{ key: keyof ResourceBlockData; icon: string; label: string }> = [
    { key: 'books', icon: '📚', label: 'Книги' },
    { key: 'platforms', icon: '🖥️', label: 'Платформы' },
    { key: 'tools', icon: '🔧', label: 'Инструменты' },
    { key: 'videos', icon: '🎬', label: 'Видео и курсы' },
  ];

  const nonEmpty = sections.filter(({ key }) => (data[key]?.length ?? 0) > 0);
  if (nonEmpty.length === 0) return null;

  return (
    <div className="my-6 rounded-xl border border-line bg-raised/20 p-5">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-faint">Ресурсы</h3>
      <div className="grid gap-5 sm:grid-cols-2">
        {nonEmpty.map(({ key, icon, label }) => {
          const items = data[key]!;
          return (
            <div key={key}>
              <h4 className="mb-2.5 flex items-center gap-1.5 text-sm font-semibold text-fg">
                <span aria-hidden="true">{icon}</span> {label}
              </h4>
              <ul className="space-y-2">
                {items.map((item, i) => {
                  const displayName = item.title ?? item.name ?? '';
                  return (
                    <li key={i} className="text-sm leading-snug">
                      {item.url ? (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-sky hover:underline"
                        >
                          {displayName}
                        </a>
                      ) : (
                        <span className="font-medium text-fg">{displayName}</span>
                      )}
                      {item.author && (
                        <span className="text-muted"> · {item.author}</span>
                      )}
                      {item.note && (
                        <span className="block text-xs text-faint">{item.note}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface BaseMd {
  content: string;
  /** No section spacing; used inside task/hint cards. */
  compact?: boolean;
  /** Strip the outer <p> for one-line rendering. */
  inline?: boolean;
}

/** Plain Markdown segment (no custom blocks). */
function PlainMarkdown({ content, inline }: { content: string; inline?: boolean }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[[rehypeHighlight, { detect: true, ignoreMissing: true }]]}
      components={{
        h2: ({ children }) => {
          const id = slugify(extractText(children));
          return (
            <h2 id={id} className="scroll-mt-24 border-b border-line pb-1 text-xl font-semibold text-[#f2f5f9]">
              {children}
            </h2>
          );
        },
        pre: ({ children }) => <>{children}</>,
        code: ({ className, children }) => {
          const text = extractText(children).replace(/\n$/, '');
          const isBlock = (className ?? '').includes('language-') || text.includes('\n');
          if (!isBlock) {
            return <code className={className}>{children}</code>;
          }
          return (
            <CodeBlock code={text} className={className}>
              {children}
            </CodeBlock>
          );
        },
        table: ({ children }) => (
          <div className="my-4 overflow-x-auto rounded-lg border border-line">
            <table>{children}</table>
          </div>
        ),
        a: ({ href, children }) => {
          const external = href?.startsWith('http');
          return (
            <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>
              {children}
            </a>
          );
        },
      }}
    >
      {inline ? content.replace(/^\s*\n/, '') : content}
    </ReactMarkdown>
  );
}

export function Markdown({ content, compact, inline }: BaseMd) {
  const segments = parseSegments(content);
  let taskCounter = 0;
  const wrapClass = inline ? 'md-inline' : compact ? 'md md-compact' : 'md';

  return (
    <div className={wrapClass}>
      {segments.map((seg, i) => {
        switch (seg.type) {
          case 'md':
            return seg.text.trim() ? <PlainMarkdown key={i} content={seg.text} inline={inline} /> : <Fragment key={i} />;
          case 'terminal':
            return <Terminal key={i} raw={seg.text} />;
          case 'task':
            taskCounter += 1;
            return <TaskCard key={i} task={seg.task} index={taskCounter} />;
          case 'quiz': {
            const quiz = quizById.get(seg.id);
            return quiz ? (
              <QuizCard key={i} quiz={quiz} />
            ) : (
              <Callout key={i} kind="warning" title="Квиз не найден">
                id: <code>{seg.id}</code>
              </Callout>
            );
          }
          case 'callout':
            return (
              <Callout key={i} kind={seg.kind} title={seg.title}>
                <PlainMarkdown content={seg.body} />
              </Callout>
            );
          case 'resources':
            return <ResourceBlock key={i} data={seg.data} />;
        }
      })}
    </div>
  );
}
