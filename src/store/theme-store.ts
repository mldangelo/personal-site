import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'theme-store';

interface ThemeStore {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
}

export const systemTheme = (): ResolvedTheme =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

export const resolveTheme = (preference: ThemePreference): ResolvedTheme =>
  preference === 'system' ? systemTheme() : preference;

export const applyTheme = (preference: ThemePreference) => {
  document.documentElement.setAttribute('data-theme', resolveTheme(preference));
};

const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      preference: 'system',
      setPreference: (preference: ThemePreference) => {
        applyTheme(preference);
        set({ preference });
      }
    }),
    {
      name: THEME_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      // The inline script in app/layout.tsx sets data-theme before paint, so
      // the store must not be read until after mount. See ThemeSync.
      skipHydration: true
    }
  )
);

export default useThemeStore;
