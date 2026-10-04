import type { Metadata } from 'next';

import AboutSection from '@/components/About/AboutSection';
import ContactSection from '@/components/Contact/ContactSection';
import ProjectsSection from '@/components/Projects/ProjectsSection';
import ResumeSection from '@/components/Resume/ResumeSection';
import { PersonSchema } from '@/components/Schema';
import Hero from '@/components/Template/Hero';
import PageWrapper from '@/components/Template/PageWrapper';

export const metadata: Metadata = {
  description:
    'Member of the Technical Staff at OpenAI, working on Promptfoo and agent security. Previously co-founded Promptfoo, Arthena, and Matroid, and led engineering at Smile ID.',
};

export default function HomePage() {
  return (
    <PageWrapper mainClassName="home-page">
      <PersonSchema />
      <Hero />
      {/* Section ids must match `sectionId` in src/data/routes.ts */}
      <div className="onepage-sections">
        <div id="about" className="onepage-section">
          <AboutSection headingLevel="h2" />
        </div>
        <div id="resume" className="onepage-section">
          <ResumeSection headingLevel="h2" />
        </div>
        <div id="projects" className="onepage-section onepage-section--full">
          <ProjectsSection headingLevel="h2" />
        </div>
        <div id="contact" className="onepage-section">
          <ContactSection headingLevel="h2" />
        </div>
      </div>
    </PageWrapper>
  );
}
