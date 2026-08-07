'use client';

import { useEffect } from 'react';
import useThemeStore, { applyTheme } from '@/store/theme-store';

/**
 * Rehydrates the persisted theme preference after mount (the store uses
 * skipHydration so the pre-paint script in layout.tsx stays authoritative),
 * then tracks OS changes for as long as the preference is 'system'.
 *
 * Renders nothing — it exists only to own these two effects, keeping the root
 * layout a Server Component.
 */
const ThemeSync = () => {
  useEffect(() => {
    useThemeStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      if (useThemeStore.getState().preference === 'system') {
        applyTheme('system');
      }
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  return null;
};

export default ThemeSync;
