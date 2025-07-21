'use client';

import React from 'react';
import { useGlobalKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import EasterEgg from '@/components/EasterEgg/EasterEgg';
import ServiceWorkerRegistration from '@/components/ServiceWorkerRegistration';

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  useGlobalKeyboardShortcuts();
  
  return (
    <>
      {children}
      <EasterEgg />
      <ServiceWorkerRegistration />
    </>
  );
}