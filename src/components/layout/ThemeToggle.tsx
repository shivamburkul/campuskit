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
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Change theme"
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-ink-100 text-ink-700 transition-colors hover:border-moss-400 hover:text-moss-600 dark:border-ink-700 dark:text-ink-300 dark:hover:border-moss-600 dark:hover:text-moss-400"
      >
        <Current size={16} aria-hidden="true" />
      </button>
      {open && (
        <ul
          role="menu"
          className="absolute right-0 z-30 mt-1 w-36 overflow-hidden rounded-md border border-ink-100 bg-surface py-1 shadow-lg dark:border-ink-700 dark:bg-ink-900"
        >
          {OPTIONS.map(({ value, label, Icon }) => (
            <li key={value}>
              <button
                type="button"
                role="menuitemradio"
                aria-checked={preference === value}
                onClick={() => choose(value)}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-moss-100/50 dark:hover:bg-ink-700/50 ${
                  preference === value
                    ? 'font-medium text-moss-600 dark:text-moss-400'
                    : 'text-ink-800 dark:text-ink-200'
                }`}
              >
                <Icon size={14} aria-hidden="true" />
                {label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}