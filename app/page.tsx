import type { Metadata } from 'next';
import React from 'react';

import Hero from '@/components/Template/Hero';

import PageWrapper from './components/PageWrapper';

export const metadata: Metadata = {
  description:
    'Co-founder & CTO at Promptfoo building LLM security tools. Previously VP Engineering at Smile ID. YC alum, Stanford ICME.',
};

export default function HomePage() {
  return (
    <PageWrapper>
      <Hero />
    </PageWrapper>
  );
}
