'use client';
import { useEffect, useState, useRef } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { ThemePreference, THEME_STORAGE_KEY, applyTheme } from '@/lib/hooks/theme';

const OPTIONS: { value: ThemePreference; label: string; Icon: typeof Sun }[] = [
  { value: 'system', label: 'System', Icon: Monitor },
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark', label: 'Dark', Icon: Moon },
];

export function ThemeToggle() {
  const [preference, setPreference] = useState<ThemePreference>('system');
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = (localStorage.getItem(THEME_STORAGE_KEY) as ThemePreference | null) ?? 'system';
    setPreference(stored);
    applyTheme(stored);
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  function choose(next: ThemePreference) {
    setPreference(next);
    localStorage.setItem(THEME_STORAGE_KEY, next);
    applyTheme(next);
    setOpen(false);
  }

  const Current = OPTIONS.find((o) => o.value === preference)?.Icon ?? Monitor;

  return (
    <div ref={ref} className="relative overflow-visible">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Change theme"
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex h-8 w-8 items-center justify-center rounded-full border border-ink-200/50 bg-white/40 text-ink-700 transition-all duration-300 hover:bg-ink-100/70 hover:scale-110 active:scale-95 dark:border-ink-700/50 dark:bg-ink-800/40 dark:text-ink-200 dark:hover:bg-ink-700/60 sm:h-9 sm:w-9"
      >
        <Current size={15} className="transition-transform duration-300" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-36 overflow-hidden rounded-xl border border-ink-100/60 bg-white/90 py-1 shadow-lg backdrop-blur-xl dark:border-ink-700/60 dark:bg-ink-900/90"
        >
          {OPTIONS.map(({ value, label, Icon }) => (
            <button
              key={value}
              type="button"
              role="menuitem"
              onClick={() => choose(value)}
              className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors ${
                preference === value
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300'
                  : 'text-ink-700 hover:bg-ink-50 dark:text-ink-200 dark:hover:bg-ink-800/60'
              }`}
            >
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
