import type { Metadata } from 'next';

import Cell from '@/components/Projects/Cell';
import Entry from '@/components/Projects/Entry';
import { SchemaGraph } from '@/components/Schema';
import PageWrapper from '@/components/Template/PageWrapper';
import { archive, shipped } from '@/data/projects';
import { createPageMetadata } from '@/lib/metadata';
import {
  breadcrumbNode,
  collectionPageNode,
  HOME_URL,
  SITE_URL,
} from '@/lib/schema';
import { AUTHOR_NAME } from '@/lib/utils';

const PROJECTS_URL = `${SITE_URL}/projects/`;

const PAGE_TITLE = 'Projects';

/**
 * Built from the register itself, so the share text cannot claim a lineup the
 * page no longer has. Capped at three names to keep the description short
 * enough to survive a search result.
 */
const PROJECTS_DESCRIPTION = `Work ${AUTHOR_NAME} has shipped — ${shipped
  .slice(0, 3)
  .map((project) => project.title)
  .join(', ')} — plus an archive of student-era experiments.`;

export const metadata: Metadata = createPageMetadata({
  title: PAGE_TITLE,
  description: PROJECTS_DESCRIPTION,
  path: '/projects/',
});

export default function ProjectsPage() {
  return (
    <PageWrapper>
      <SchemaGraph
        nodes={[
          collectionPageNode({
            url: PROJECTS_URL,
            name: PAGE_TITLE,
            description: PROJECTS_DESCRIPTION,
            hasBreadcrumb: true,
          }),
          breadcrumbNode(PROJECTS_URL, [
            { name: 'Home', url: HOME_URL },
            { name: PAGE_TITLE, url: PROJECTS_URL },
          ]),
        ]}
      />
      <div className="projects-page">
        <header className="projects-header">
          <h1 className="page-title">{PAGE_TITLE}</h1>
          <p className="page-subtitle">
            Things I have built, and the student-era experiments that came
            first.
          </p>
        </header>

        <section className="projects-group" aria-labelledby="projects-shipped">
          <div className="projects-group-header">
            <h2 id="projects-shipped" className="projects-section-title">
              Shipped
            </h2>
            {/* Counted, never typed. */}
            <span className="projects-section-count">{shipped.length}</span>
          </div>
          <div className="projects-register">
            {shipped.map((project) => (
              <Entry data={project} key={project.title} />
            ))}
          </div>
        </section>

        <section className="projects-group" aria-labelledby="projects-archive">
          <div className="projects-group-header">
            <h2 id="projects-archive" className="projects-section-title">
              Archive
            </h2>
            <span className="projects-section-count">{archive.length}</span>
          </div>
          <p className="projects-group-note">
            Student-era hackathons and experiments, kept for the record rather
            than deleted.
          </p>
          <div className="projects-grid">
            {archive.map((project) => (
              <Cell data={project} key={project.title} />
            ))}
          </div>
        </section>
      </div>
    </PageWrapper>
  );
}
