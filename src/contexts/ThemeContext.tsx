import type React from 'react';
import { createContext, useContext, useCallback, useMemo, useRef, useEffect } from 'react';
import { ConfigProvider, theme as antTheme, message } from 'antd';
import type { ThemeConfig } from 'antd';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useMediaQuery } from '../hooks/useMediaQuery';

const { defaultAlgorithm, darkAlgorithm } = antTheme;

interface ThemeContextValue {
  isDarkMode: boolean;
  toggleTheme: () => void;
  theme: ThemeConfig;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Custom theme tokens with better type safety
const baseTokens = {
  colorPrimary: '#0088CC',
  fontFamily: "'Source Sans Pro', system-ui, sans-serif",
  borderRadius: 6,
} as const satisfies Partial<ThemeConfig['token']>;

// Separate light and dark theme configurations for better maintainability
const lightTheme: ThemeConfig = {
  token: {
    ...baseTokens,
    colorBgContainer: '#ffffff',
    colorBgElevated: '#ffffff',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
    boxShadowSecondary: '0 4px 12px rgba(0, 0, 0, 0.15)',
  },
  components: {
    Button: {
      algorithm: true,
      borderRadius: 6,
    },
    Layout: {
      bodyBg: '#f0f2f5',
      headerBg: '#ffffff',
      siderBg: '#ffffff',
    },
  },
  algorithm: [defaultAlgorithm],
};

const darkTheme: ThemeConfig = {
  token: {
    ...baseTokens,
    colorBgContainer: '#141414',
    colorBgElevated: '#1f1f1f',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.35)',
    boxShadowSecondary: '0 4px 12px rgba(0, 0, 0, 0.35)',
  },
  components: {
    Button: {
      algorithm: true,
      borderRadius: 6,
    },
    Layout: {
      bodyBg: '#000000',
      headerBg: '#141414',
      siderBg: '#141414',
    },
  },
  algorithm: [darkAlgorithm],
};

const getThemeConfig = (isDarkMode: boolean): ThemeConfig => (isDarkMode ? darkTheme : lightTheme);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultDark?: boolean;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children, defaultDark = false }) => {
  const isInitialized = useRef(false);
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const [isDarkMode, setIsDarkMode] = useLocalStorage<boolean>(
    'darkMode',
    defaultDark || prefersDarkMode
  );

  const [messageApi, contextHolder] = message.useMessage();

  // Handle theme change errors
  const handleThemeError = useCallback(
    (error: Error) => {
      console.error('Theme change error:', error);
      messageApi.error('Failed to change theme. Please try again.');
    },
    [messageApi]
  );

  // Memoize theme toggle callback with error handling
  const toggleTheme = useCallback(() => {
    try {
      setIsDarkMode((prev) => !prev);
    } catch (error) {
      handleThemeError(error as Error);
    }
  }, [setIsDarkMode, handleThemeError]);

  // Memoize theme configuration
  const theme = useMemo(() => getThemeConfig(isDarkMode), [isDarkMode]);

  // Track initialization state
  useEffect(() => {
    isInitialized.current = true;
  }, []);

  // Memoize context value
  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      isDarkMode,
      toggleTheme,
      theme,
      isLoading: !isInitialized.current,
    }),
    [isDarkMode, toggleTheme, theme]
  );

  // Add meta theme-color for mobile browsers
  useEffect(() => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content',
        isDarkMode ? darkTheme.token.colorBgContainer : lightTheme.token.colorBgContainer
      );
    }
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {contextHolder}
      <ConfigProvider theme={theme}>{children}</ConfigProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
