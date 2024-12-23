import React, { useEffect } from 'react';
import { ConfigProvider, theme as antTheme } from 'antd';
import { useThemeStore } from '../stores/useThemeStore';

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { isDarkMode, systemPreference } = useThemeStore();

  // Listen for system theme changes
  useEffect(() => {
    if (!systemPreference) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      document.documentElement.classList.toggle('dark', e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [systemPreference]);

  // Apply theme class to root element
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  return (
    <ConfigProvider
      theme={{
        algorithm: isDarkMode ? antTheme.darkAlgorithm : antTheme.defaultAlgorithm,
        token: {
          colorPrimary: '#0088CC',
          borderRadius: 6,
          colorBgContainer: isDarkMode ? '#141414' : '#ffffff',
          colorBgElevated: isDarkMode ? '#1f1f1f' : '#ffffff',
          colorBgLayout: isDarkMode ? '#000000' : '#f0f2f5',
          colorText: isDarkMode ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)',
          colorTextSecondary: isDarkMode ? 'rgba(255, 255, 255, 0.45)' : 'rgba(0, 0, 0, 0.45)',
          boxShadow: `0 2px 8px rgba(0, 0, 0, ${isDarkMode ? '0.35' : '0.15'})`,
          boxShadowSecondary: `0 4px 12px rgba(0, 0, 0, ${isDarkMode ? '0.35' : '0.15'})`,
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
            bodyBg: isDarkMode ? '#000000' : '#f0f2f5',
            headerBg: isDarkMode ? '#141414' : '#ffffff',
            siderBg: isDarkMode ? '#141414' : '#ffffff',
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
      }}
    >
      {children}
    </ConfigProvider>
  );
};

export default ThemeProvider; 