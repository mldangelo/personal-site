import type { Metadata } from 'next';
import PageHeader from '@/components/ui/page-header';
import { pageMetadata } from '@/lib/metadata';
import Education from './education';
import Experience from './experience';
import Skills from './skills';

export const metadata: Metadata = pageMetadata({
  title: 'Resume',
  description: "Austin Dase's Resume.",
  path: '/resume',
  imageAlt: 'Preview card for Austin Dase resume and experience'
});

const SECTIONS = ['Experience', 'Education', 'Skills'];

const Resume = () => (
  <>
    <PageHeader eyebrow="Resume" title="Resume">
      <nav aria-label="Resume sections" className="flex flex-wrap gap-2">
        {SECTIONS.map((section) => (
          <a
            key={section}
            href={`#${section.toLowerCase()}`}
            className="nav-link border border-rule px-3 py-1.5 text-muted hover:border-accent hover:text-fg"
          >
            {section}
          </a>
        ))}
      </nav>
    </PageHeader>

    <Experience />
    <Education />
    <Skills />
  </>
);

export default Resume;
