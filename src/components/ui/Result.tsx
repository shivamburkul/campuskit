import { ReactNode } from 'react';

export function ResultPanel({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-white/30 bg-white/30 p-5 shadow-lg shadow-black/5 backdrop-blur-[24px] saturate-180 dark:border-white/10 dark:bg-ink-900/70 dark:shadow-black/30">
      {children}
    </div>
  );
}

export function ResultStat({ label, value, emphasis }: { label: string; value: ReactNode; emphasis?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-1.5">
      <span className="text-sm text-ink-600 dark:text-ink-300">{label}</span>
      <span
        className={
          emphasis
            ? 'text-xl font-semibold text-primary-600 numeric-input dark:text-primary-400'
            : 'text-sm font-semibold text-ink-900 numeric-input dark:text-ink-50'
        }
      >
        {value}
      </span>
    </div>
  );
}

export function InlineNote({ children, tone = 'neutral', className = '' }: { children: ReactNode; tone?: 'neutral' | 'warning'; className?: string }) {
  const toneClass =
    tone === 'warning'
      ? 'border-amber-500/40 bg-amber-100/60 text-amber-700 dark:border-amber-700/40 dark:bg-amber-900/20 dark:text-amber-300'
      : 'border-white/30 bg-white/30 text-ink-700 backdrop-blur-[24px] saturate-180 shadow-lg shadow-black/5 dark:border-white/10 dark:bg-ink-900/70 dark:text-ink-300 dark:shadow-black/30';
  return <div className={`rounded-xl border px-4 py-3 text-sm ${toneClass} ${className}`}>{children}</div>;
}
