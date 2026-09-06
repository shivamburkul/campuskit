import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'rgb(var(--color-primary-50) / <alpha-value>)',
          100: 'rgb(var(--color-primary-100) / <alpha-value>)',
          200: 'rgb(var(--color-primary-200) / <alpha-value>)',
          300: 'rgb(var(--color-primary-300) / <alpha-value>)',
          400: 'rgb(var(--color-primary-400) / <alpha-value>)',
          500: 'rgb(var(--color-primary-500) / <alpha-value>)',
          600: 'rgb(var(--color-primary-600) / <alpha-value>)',
          700: 'rgb(var(--color-primary-700) / <alpha-value>)',
          800: 'rgb(var(--color-primary-800) / <alpha-value>)',
          900: 'rgb(var(--color-primary-900) / <alpha-value>)',
        },
        moss: {
          50: 'rgb(var(--color-accent-50) / <alpha-value>)',
          100: 'rgb(var(--color-accent-100) / <alpha-value>)',
          200: 'rgb(var(--color-accent-200) / <alpha-value>)',
          300: 'rgb(var(--color-accent-300) / <alpha-value>)',
          400: 'rgb(var(--color-accent-400) / <alpha-value>)',
          500: 'rgb(var(--color-accent-500) / <alpha-value>)',
          600: 'rgb(var(--color-accent-600) / <alpha-value>)',
          700: 'rgb(var(--color-accent-700) / <alpha-value>)',
          800: 'rgb(var(--color-accent-800) / <alpha-value>)',
          900: 'rgb(var(--color-accent-900) / <alpha-value>)',
        },
        coral: {
          700: 'rgb(var(--color-coral-700) / <alpha-value>)',
          500: 'rgb(var(--color-coral-500) / <alpha-value>)',
          400: 'rgb(var(--color-coral-400) / <alpha-value>)',
          200: 'rgb(var(--color-coral-200) / <alpha-value>)',
          100: 'rgb(var(--color-coral-100) / <alpha-value>)',
        },
        amber: {
          900: 'rgb(var(--color-amber-900) / <alpha-value>)',
          700: 'rgb(var(--color-amber-700) / <alpha-value>)',
          600: 'rgb(var(--color-amber-600) / <alpha-value>)',
          500: 'rgb(var(--color-amber-500) / <alpha-value>)',
          300: 'rgb(var(--color-amber-300) / <alpha-value>)',
          200: 'rgb(var(--color-amber-200) / <alpha-value>)',
          100: 'rgb(var(--color-amber-100) / <alpha-value>)',
        },
        teal: {
          500: 'rgb(var(--color-teal-500) / <alpha-value>)',
          100: 'rgb(var(--color-teal-100) / <alpha-value>)',
        },
        ink: {
          950: 'rgb(var(--color-ink-950) / <alpha-value>)',
          900: 'rgb(var(--color-ink-900) / <alpha-value>)',
          800: 'rgb(var(--color-ink-800) / <alpha-value>)',
          700: 'rgb(var(--color-ink-700) / <alpha-value>)',
          600: 'rgb(var(--color-ink-600) / <alpha-value>)',
          500: 'rgb(var(--color-ink-500) / <alpha-value>)',
          400: 'rgb(var(--color-ink-400) / <alpha-value>)',
          300: 'rgb(var(--color-ink-300) / <alpha-value>)',
          200: 'rgb(var(--color-ink-200) / <alpha-value>)',
          100: 'rgb(var(--color-ink-100) / <alpha-value>)',
          50: 'rgb(var(--color-ink-50) / <alpha-value>)',
        },
        paper: 'rgb(var(--color-paper) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'ui-serif', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      maxWidth: {
        prose: '68ch',
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '16px',
      },
      boxShadow: {
        card: '0 4px 20px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03)',
        'card-hover': '0 12px 40px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [],
};

export default config;