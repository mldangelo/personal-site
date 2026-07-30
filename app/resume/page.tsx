import type { Metadata } from 'next';

import Courses from '@/components/Resume/Courses';
import Education from '@/components/Resume/Education';
import Experience from '@/components/Resume/Experience';
import References from '@/components/Resume/References';
import ResumeNav from '@/components/Resume/ResumeNav';
import Skills from '@/components/Resume/Skills';
import PageWrapper from '@/components/Template/PageWrapper';
import contact from '@/data/contact';
import profile from '@/data/profile.json';
import courses from '@/data/resume/courses';
import degrees from '@/data/resume/degrees';
import { categories, skills } from '@/data/resume/skills';
import work from '@/data/resume/work';
import { careerSpanYears } from '@/lib/career';
import { createPageMetadata } from '@/lib/metadata';
import { RESUME_JSON_PATH } from '@/lib/resumeJson';
import { AUTHOR_NAME, SITE_URL } from '@/lib/utils';

export const metadata: Metadata = createPageMetadata({
  title: 'Resume',
  description: `${AUTHOR_NAME}'s Resume. OpenAI, Promptfoo, Smile ID, Arthena, Matroid, Stanford ICME, YC alum.`,
  path: '/resume/',
});

/**
 * Separator between entries in the printed contact line. The space before the
 * dot is non-breaking and the one after it is not, so five entries that no
 * longer fit one line wrap to a line that opens with an address rather than
 * with a stray dot.
 */
const PRINT_CONTACT_SEPARATOR = '\u00a0· ';

/** A URL as it should read on paper: no protocol, no `www.`, no trailing slash. */
function displayUrl(url: string): string {
  return url.replace(/^https?:\/\/(?:www\.)?/, '').replace(/\/$/, '');
}

/**
 * Looks a destination up in the shared contact data rather than retyping it
 * here, so the printed header cannot drift from the links in the footer.
 * Throws rather than falling back, because a silently empty `href` on a
 * printed resume is worse than a failed build.
 */
function contactLink(label: string): string {
  const item = contact.find((entry) => entry.label === label);
  if (!item) {
    throw new Error(`No "${label}" entry in src/data/contact.ts`);
  }
  return item.link;
}

export default function ResumePage() {
  // One clock read for the whole page, so the headline span and every tenure
  // on the spine are measured against the same instant. This is a server
  // component, so the value is baked at build time — the same contract as the
  // line count on /stats.
  const now = Date.now();
  const careerSpan = careerSpanYears(work, now);
  const github = contactLink('GitHub');
  const linkedin = contactLink('LinkedIn');

  return (
    <PageWrapper>
      <section className="resume-page">
        <header className="resume-header">
          <div className="resume-header-row">
            <h1 className="resume-title">Resume</h1>
            {/* The same affordance as the RSS chip on /writing. The href is
                document-relative on purpose: /resume/ may live below a
                repository base path, while a root-relative href would escape
                it. ../resume.json resolves correctly in both deployments. */}
            <a
              href={`..${RESUME_JSON_PATH}`}
              className="resume-json-link"
              title="JSON Resume"
              aria-label="JSON Resume"
            >
              JSON
            </a>
          </div>
          {/* This is elapsed span from the earliest role, not summed active
              tenure — see `careerSpanYears`. */}
          <p className="resume-summary">
            Engineering leader with a career spanning {careerSpan}+ years across
            AI, security, and infrastructure. I&apos;m currently a Member of the
            Technical Staff at OpenAI, working on Promptfoo and Codex Security.
            I help secure AI systems and use AI to find software
            vulnerabilities. I co-founded Promptfoo before it joined OpenAI in
            2026. Stanford MS, YC alum, previously VP Engineering.
          </p>
          {/* Print-only, but real markup rather than CSS `content`, so it is
              selectable, linkable, and reads from the shared profile. The
              screen layout carries these in the footer, which print hides.
              Location and LinkedIn belong on a paper resume as much as the
              email does; both were already in the repo and only this block
              was missing them. */}
          <address className="resume-print-contact">
            <span>{profile.currentCity}</span>
            <span aria-hidden="true">{PRINT_CONTACT_SEPARATOR}</span>
            <a href={`${SITE_URL}/`}>{displayUrl(SITE_URL)}</a>
            <span aria-hidden="true">{PRINT_CONTACT_SEPARATOR}</span>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <span aria-hidden="true">{PRINT_CONTACT_SEPARATOR}</span>
            <a href={github}>{displayUrl(github)}</a>
            <span aria-hidden="true">{PRINT_CONTACT_SEPARATOR}</span>
            <a href={linkedin}>{displayUrl(linkedin)}</a>
          </address>
        </header>

        <ResumeNav />

        <div className="resume-content">
          <section id="experience" className="resume-section">
            <Experience data={work} now={now} />
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
