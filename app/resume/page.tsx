import type { Metadata } from 'next';

import Courses from '@/components/Resume/Courses';
import Education from '@/components/Resume/Education';
import Experience from '@/components/Resume/Experience';
import References from '@/components/Resume/References';
import ResumeNav from '@/components/Resume/ResumeNav';
import Skills from '@/components/Resume/Skills';
import PageWrapper from '@/components/Template/PageWrapper';
import profile from '@/data/profile.json';
import courses from '@/data/resume/courses';
import degrees from '@/data/resume/degrees';
import { categories, skills } from '@/data/resume/skills';
import work from '@/data/resume/work';
import { createPageMetadata } from '@/lib/metadata';
import { AUTHOR_NAME, SITE_URL } from '@/lib/utils';

export const metadata: Metadata = createPageMetadata({
  title: 'Resume',
  description: `${AUTHOR_NAME}'s resume: Electrical Engineering student focused on embedded systems, PCB design, and software.`,
  path: '/resume/',
});

export default function ResumePage() {
  return (
    <PageWrapper>
      <section className="resume-page">
        <header className="resume-header">
          <h1 className="resume-title">Resume</h1>
          <p className="resume-summary">
            Electrical Engineering student at the University of Colorado Boulder
            (GPA 3.98/4.00), with minors in Computer Science and Applied
            Mathematics. Experience spanning embedded systems, PCB design,
            analog circuits, and technical software.
          </p>
          {/* Print-only, but real markup rather than CSS `content`, so it is
              selectable, linkable, and reads from the shared profile. The
              screen layout carries these in the footer, which print hides. */}
          <address className="resume-print-contact">
            <a href={`${SITE_URL}/`}>{SITE_URL.replace(/^https?:\/\//, '')}</a>
            <span aria-hidden="true"> · </span>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <span aria-hidden="true"> · </span>
            <a href="https://github.com/henrymatar">github.com/henrymatar</a>
          </address>
        </header>

        <ResumeNav />

        <div className="resume-content">
          <section id="experience" className="resume-section">
            <Experience data={work} />
          </section>

          <section id="education" className="resume-section">
            <Education data={degrees} />
          </section>

          <section id="skills" className="resume-section">
            <Skills skills={skills} categories={categories} />
          </section>

          <section id="courses" className="resume-section">
            <Courses data={courses} />
          </section>

          <section id="references" className="resume-section">
            <References />
          </section>
        </div>
      </section>
    </PageWrapper>
  );
}
