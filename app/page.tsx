import type { Metadata } from 'next';

import { PersonSchema } from '@/components/Schema';
import Hero from '@/components/Template/Hero';
import PageWrapper from '@/components/Template/PageWrapper';

export const metadata: Metadata = {
  description:
    'Member of the Technical Staff at OpenAI working on promptfoo and securing agents. Previously co-founded Promptfoo and led engineering at Smile ID. YC alum, Stanford ICME.',
};

export default function HomePage() {
  return (
    <PageWrapper>
      <PersonSchema />
      <Hero />
    </PageWrapper>
  );
}
