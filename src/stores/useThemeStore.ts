import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { theme as antTheme } from 'antd';
import type { ThemeConfig } from 'antd';

const { defaultAlgorithm, darkAlgorithm } = antTheme;

// Base theme configuration
const baseTokens = {
  colorPrimary: '#0088CC',
  fontFamily: "'Source Sans Pro', system-ui, sans-serif",
  borderRadius: 6,
} as const;

// Theme configurations
const createThemeConfig = (isDark: boolean): ThemeConfig => ({
  token: {
    ...baseTokens,
    colorBgContainer: isDark ? '#141414' : '#ffffff',
    colorBgElevated: isDark ? '#1f1f1f' : '#ffffff',
    colorBgLayout: isDark ? '#000000' : '#f0f2f5',
    colorText: isDark ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)',
    colorTextSecondary: isDark ? 'rgba(255, 255, 255, 0.65)' : 'rgba(0, 0, 0, 0.65)',
    boxShadow: `0 2px 8px rgba(0, 0, 0, ${isDark ? '0.35' : '0.15'})`,
    boxShadowSecondary: `0 4px 12px rgba(0, 0, 0, ${isDark ? '0.35' : '0.15'})`,
  },
  components: {
    Button: {
      algorithm: true,
      borderRadius: 6,
      controlHeight: 36,
      controlHeightLG: 40,
      controlHeightSM: 28,
      paddingContentHorizontal: 16,
    },
    Layout: {
      bodyBg: isDark ? '#000000' : '#f0f2f5',
      headerBg: isDark ? '#141414' : '#ffffff',
      siderBg: isDark ? '#141414' : '#ffffff',
      lightSiderBg: '#ffffff',
      darkSiderBg: '#141414',
    },
    Menu: {
      darkItemBg: '#141414',
      darkItemHoverBg: '#1f1f1f',
      darkItemSelectedBg: '#1f1f1f',
      darkSubMenuItemBg: '#141414',
    },
  },
  algorithm: isDark ? darkAlgorithm : defaultAlgorithm,
});

interface ThemeState {
  isDarkMode: boolean;
  theme: ThemeConfig;
  systemPreference: boolean;
}

interface ThemeActions {
  toggleTheme: () => void;
  setSystemPreference: (useSystem: boolean) => void;
}

// Helper to safely check system preference
const getSystemPreference = (): boolean => {
  try {
    return window?.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  } catch {
    return false;
  }
};

// Create the store with middleware
export const useThemeStore = create<ThemeState & ThemeActions>()(
  persist(
    (set) => {
      // Initialize system preference listener
      const initializeSystemPreference = () => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
          set((state) =>
            state.systemPreference
              ? {
                  isDarkMode: e.matches,
                  theme: createThemeConfig(e.matches),
                }
              : state
          );
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
      };

      // Try to initialize system preference listener
      if (typeof window !== 'undefined') {
        initializeSystemPreference();
      }

      const initialSystemPreference = getSystemPreference();

      return {
        isDarkMode: initialSystemPreference,
        theme: createThemeConfig(initialSystemPreference),
        systemPreference: true,

        toggleTheme: () =>
          set((state) => ({
            isDarkMode: !state.isDarkMode,
            theme: createThemeConfig(!state.isDarkMode),
            systemPreference: false,
          })),

        setSystemPreference: (useSystem: boolean) =>
          set(() => {
            if (useSystem) {
              const systemIsDark = getSystemPreference();
              return {
                isDarkMode: systemIsDark,
                theme: createThemeConfig(systemIsDark),
                systemPreference: true,
              };
            }
            return { systemPreference: false };
          }),
      };
    },
    {
      name: 'theme-storage',
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        systemPreference: state.systemPreference,
      }),
    }
  )
);
