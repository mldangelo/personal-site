import { create } from 'zustand';
import { type PersistStorage, persist } from 'zustand/middleware';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'theme-store';

interface ThemeStore {
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
}

const zustandStorage: PersistStorage<ThemeStore> = {
  getItem: (name: string) => {
    const storedValue = localStorage.getItem(name);
    if (storedValue) {
      return JSON.parse(storedValue);
    }
    return null;
  },
  setItem: (name: string, value: unknown) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  }
};

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
      storage: zustandStorage,
      skipHydration: true
    }
  )
);

export default useThemeStore;
