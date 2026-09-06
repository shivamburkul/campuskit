import { ReactNode } from 'react';

export function ResultPanel({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-ink-200/50 bg-ink-100/40 p-5 shadow-sm dark:border-ink-700 dark:bg-ink-900/40">
      {children}
    </div>
  );
}

export function ResultStat({ label, value, emphasis }: { label: string; value: ReactNode; emphasis?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1.5">
      <span className="text-sm text-ink-700 dark:text-ink-400">{label}</span>
      <span
        className={
          emphasis
            ? 'text-xl font-semibold text-ink-950 numeric-input dark:text-ink-50'
            : 'text-sm font-medium text-ink-900 numeric-input dark:text-ink-200'
        }
      >
        {value}
      </span>
    </div>
  );
}

export function InlineNote({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'warning' }) {
  const toneClass =
    tone === 'warning'
      ? 'border-amber-500/40 bg-amber-100/60 text-amber-700 dark:border-amber-700/40 dark:bg-amber-900/20 dark:text-amber-300'
      : 'border-ink-200/60 bg-ink-100/60 text-ink-700 dark:border-ink-700 dark:bg-ink-900/40 dark:text-ink-300';
  return <div className={`rounded-xl border px-4 py-3 text-sm ${toneClass}`}>{children}</div>;
}