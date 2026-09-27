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
import { newTabProps } from '@/lib/links';
import { createPageMetadata } from '@/lib/metadata';
import {
  AUTHOR_NAME,
  GITHUB_PROFILE_URL,
  GITHUB_USER,
  SITE_URL,
} from '@/lib/utils';

export const metadata: Metadata = createPageMetadata({
  title: 'Resume',
  description: `${AUTHOR_NAME}'s Resume. Nutanix Core Data Path, Amazon, Sprinklr, UC Irvine, IIT Hyderabad.`,
  path: '/resume/',
});

export default function ResumePage() {
  return (
    <PageWrapper>
      <section className="resume-page">
        <header className="resume-header">
          <h1 className="resume-title">Resume</h1>
          <p className="resume-summary">
            Software engineer with 5 years of experience architecting
            petabyte-scale storage control planes and data-path infrastructure.
            I&apos;m currently a Member of Technical Staff at Nutanix, working
            on Core Data Path. Deep expertise in C++, gRPC, OS internals, and
            high-concurrency systems. UC Irvine MCS, IIT Hyderabad B.Tech.
          </p>
          {/* Print-only, but real markup rather than CSS `content`, so it is
              selectable, linkable, and reads from the shared profile. The
              screen layout carries these in the footer, which print hides. */}
          <address className="resume-print-contact">
            <a href={`${SITE_URL}/`}>{SITE_URL.replace(/^https?:\/\//, '')}</a>
            <span aria-hidden="true"> · </span>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <span aria-hidden="true"> · </span>
            <a href={GITHUB_PROFILE_URL} {...newTabProps(GITHUB_PROFILE_URL)}>
              github.com/{GITHUB_USER}
            </a>
          </address>
        </header>

        <ResumeNav includeCourses={courses.length > 0} />

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

          {courses.length > 0 ? (
            <section id="courses" className="resume-section">
              <Courses data={courses} />
            </section>
          ) : null}

          <section id="references" className="resume-section">
            <References />
          </section>
        </div>
      </section>
    </PageWrapper>
  );
}
