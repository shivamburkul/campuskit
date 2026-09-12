export type ThemePreference = 'system' | 'light' | 'dark';

export const THEME_STORAGE_KEY = 'campuskit-theme';

export function applyTheme(preference: ThemePreference) {
  if (typeof document === 'undefined') return;
  const systemPrefersDark = typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const shouldBeDark = preference === 'dark' || (preference === 'system' && systemPrefersDark);
  
  // CRITICAL: This is what adds/removes the 'dark' class
  if (shouldBeDark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

export function themeBootstrapScript(): string {
  return `
(function() {
  try {
    var pref = localStorage.getItem('${THEME_STORAGE_KEY}') || 'system';
    var isDark = pref === 'dark' || (pref === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {}
})();
`.trim();
}
