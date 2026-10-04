import type { Metadata } from 'next';

import ResumeSection from '@/components/Resume/ResumeSection';
import PageWrapper from '@/components/Template/PageWrapper';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Resume',
  description:
    'Resume of Hang Hang — Northeastern Khoury CS+Business student. TA, J&J MedTech intern, private-equity intern, technical projects in Python, Java, C, and RISC-V.',
  path: '/resume/',
});

export default function ResumePage() {
  return (
    <PageWrapper>
      <ResumeSection />
    </PageWrapper>
  );
}
