import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { theme as antTheme } from 'antd';
import type { ThemeConfig } from 'antd';

const { defaultAlgorithm, darkAlgorithm } = antTheme;

// Theme tokens with strict typing
const baseTokens = {
  colorPrimary: '#0088CC',
  fontFamily: "'Source Sans Pro', system-ui, sans-serif",
  borderRadius: 6,
} as const satisfies Partial<ThemeConfig['token']>;

// Theme configurations with better type safety
const createThemeConfig = (isDark: boolean): ThemeConfig => ({
  token: {
    ...baseTokens,
    colorBgContainer: isDark ? '#141414' : '#ffffff',
    colorBgElevated: isDark ? '#1f1f1f' : '#ffffff',
    boxShadow: `0 2px 8px rgba(0, 0, 0, ${isDark ? '0.35' : '0.15'})`,
    boxShadowSecondary: `0 4px 12px rgba(0, 0, 0, ${isDark ? '0.35' : '0.15'})`,
  },
  components: {
    Button: {
      algorithm: true,
      borderRadius: 6,
    },
    Layout: {
      bodyBg: isDark ? '#000000' : '#f0f2f5',
      headerBg: isDark ? '#141414' : '#ffffff',
      siderBg: isDark ? '#141414' : '#ffffff',
    },
  },
  algorithm: [isDark ? darkAlgorithm : defaultAlgorithm],
});

interface ThemeState {
  isDarkMode: boolean;
  theme: ThemeConfig;
  systemPreference: boolean;
  error: Error | null;
}

interface ThemeActions {
  toggleTheme: () => void;
  setSystemPreference: (useSystem: boolean) => void;
  setError: (error: Error | null) => void;
}

// Helper to safely check system preference
const getSystemPreference = (): boolean => {
  try {
    return window?.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  } catch (error) {
    console.warn(`Failed to detect system theme preference:${error}`);
    return false;
  }
};

// Create the store with middleware
export const useThemeStore = create<ThemeState & ThemeActions>()(
  devtools(
    persist(
      (set, get) => ({
        isDarkMode: getSystemPreference(),
        theme: createThemeConfig(getSystemPreference()),
        systemPreference: true,
        error: null,

        toggleTheme: () => {
          try {
            const newIsDarkMode = !get().isDarkMode;
            set({
              isDarkMode: newIsDarkMode,
              theme: createThemeConfig(newIsDarkMode),
              systemPreference: false,
              error: null,
            });
          } catch (error) {
            const typedError = error instanceof Error ? error : new Error(String(error));
            console.error('Failed to toggle theme:', typedError);
            set({ error: typedError });
          }
        },

        setSystemPreference: (useSystem: boolean) => {
          try {
            if (useSystem) {
              const systemIsDark = getSystemPreference();
              set({
                isDarkMode: systemIsDark,
                theme: createThemeConfig(systemIsDark),
                systemPreference: true,
                error: null,
              });

              // Listen for system theme changes
              const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
              const handleChange = (e: MediaQueryListEvent) => {
                set({
                  isDarkMode: e.matches,
                  theme: createThemeConfig(e.matches),
                });
              };
              mediaQuery.addEventListener('change', handleChange);
              return () => mediaQuery.removeEventListener('change', handleChange);
            }
          } catch (error) {
            const typedError = error instanceof Error ? error : new Error(String(error));
            console.error('Failed to set system preference:', typedError);
            set({ error: typedError });
          }
        },

        setError: (error: Error | null) => set({ error }),
      }),
      {
        name: 'theme-storage',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
          isDarkMode: state.isDarkMode,
          systemPreference: state.systemPreference,
        }),
      }
    ),
    { name: 'Theme Store' }
  )
);
