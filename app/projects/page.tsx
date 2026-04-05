import type { Metadata } from 'next';

import Cell from '@/components/Projects/Cell';
import PageWrapper from '@/components/Template/PageWrapper';
import data from '@/data/projects';
import { createPageMetadata } from '@/lib/metadata';

export const metadata: Metadata = createPageMetadata({
  title: 'Archive',
  description: 'Selected projects and experiments by Elia Christ.',
  path: '/projects/',
});

export default function ProjectsPage() {
  const featuredProjects = data.filter((p) => p.featured);
  const otherProjects = data.filter((p) => !p.featured);

  return (
    <PageWrapper>
      <section className="projects-page">
        <header className="projects-header">
          <h1 className="page-title">Archive</h1>
          <p className="page-subtitle">
            Things I have built or shipped—add more in src/data/projects.ts
          </p>
        </header>

        {featuredProjects.length > 0 && (
          <section className="projects-featured">
            <h2 className="projects-section-title">Hackathons &amp; Awards</h2>
            <div className="projects-grid projects-grid--featured">
              {featuredProjects.map((project) => (
                <Cell data={project} key={project.title} />
              ))}
            </div>
          </section>
        )}

        {otherProjects.length > 0 && (
          <section className="projects-other">
            <h2 className="projects-section-title">Side Projects</h2>
            <div className="projects-grid">
              {otherProjects.map((project) => (
                <Cell data={project} key={project.title} />
              ))}
            </div>
          </section>
        )}
      </section>
    </PageWrapper>
  );
}
