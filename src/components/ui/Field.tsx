'use client';
import { InputHTMLAttributes, ReactNode } from 'react';

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: string;
  suffix?: ReactNode;
}

export function NumberField({ label, hint, suffix, id, ...rest }: FieldProps) {
  const inputId = id ?? label.replace(/\s+/g, '-').toLowerCase();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-ink-700 dark:text-ink-300">
        {label}
      </label>
      <div className="relative">
        <input
          id={inputId}
          type="number"
          inputMode="decimal"
          className="numeric-input w-full rounded-xl border border-ink-200/70 bg-surface px-4 py-3 text-ink-900 shadow-sm outline-none transition-all duration-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/30 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50 dark:focus:border-primary-500 dark:focus:ring-primary-500/30"
          {...rest}
        />
        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-ink-500 dark:text-ink-400">
            {suffix}
          </span>
        )}
      </div>
      {hint && <p className="text-xs text-ink-500 dark:text-ink-400">{hint}</p>}
    </div>
  );
}

export function TextField({ label, hint, id, ...rest }: FieldProps) {
  const inputId = id ?? label.replace(/\s+/g, '-').toLowerCase();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-ink-700 dark:text-ink-300">
        {label}
      </label>
      <input
        id={inputId}
        type="text"
        className="w-full rounded-xl border border-ink-200/70 bg-surface px-4 py-3 text-ink-900 shadow-sm outline-none transition-all duration-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/30 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50 dark:focus:border-primary-500 dark:focus:ring-primary-500/30"
        {...rest}
      />
      {hint && <p className="text-xs text-ink-500 dark:text-ink-400">{hint}</p>}
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  id?: string;
}

export function SelectField({ label, value, onChange, options, id }: SelectFieldProps) {
  const inputId = id ?? label.replace(/\s+/g, '-').toLowerCase();
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-ink-700 dark:text-ink-300">
        {label}
      </label>
      <select
        id={inputId}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-ink-200/70 bg-surface px-4 py-3 text-ink-900 shadow-sm outline-none transition-all duration-200 focus:border-primary-400 focus:ring-2 focus:ring-primary-400/30 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-50 dark:focus:border-primary-500 dark:focus:ring-primary-500/30"
      >
        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            className="bg-surface text-ink-900 dark:bg-ink-900 dark:text-ink-50"
          >
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}