import type { Metadata } from 'next';

import ProjectsSection from '@/components/Projects/ProjectsSection';
import PageWrapper from '@/components/Template/PageWrapper';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Projects',
  description:
    'Technical projects by Hang Hang — ML pipelines, Java OOD, C systems, and FPGA hardware design.',
  path: '/projects/',
});

export default function ProjectsPage() {
  return (
    <PageWrapper mainClassName="page-main--wide">
      <ProjectsSection />
    </PageWrapper>
  );
}
