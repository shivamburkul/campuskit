import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function Button({ variant = 'primary', className = '', ...rest }: ButtonProps) {
  const base =
    'inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2';
  const variants: Record<string, string> = {
    primary:
      'bg-gradient-to-r from-primary-600 to-violet-600 text-white shadow-md shadow-primary-500/20 hover:shadow-lg hover:shadow-primary-500/30 hover:scale-[1.02] active:scale-[0.98]',
    secondary:
      'bg-ink-100/80 text-ink-900 hover:bg-ink-200/80 dark:bg-ink-700/60 dark:text-ink-100 dark:hover:bg-ink-600/80',
    ghost:
      'text-ink-700 hover:bg-ink-100/60 dark:text-ink-300 dark:hover:bg-ink-700/40',
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...rest} />;
}