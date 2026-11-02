import type { Metadata } from 'next';

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
const PROJECTS_DESCRIPTION = `Selected work from ${AUTHOR_NAME} — ${shipped
  .slice(0, 3)
  .map((project) => project.title)
  .join(', ')} — plus earlier projects and experiments.`;

function projectCountLabel(count: number): string {
  return `${count} ${count === 1 ? 'project' : 'projects'}`;
}

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
            Work I have built, led, and contributed to, plus earlier student
            projects.
          </p>
        </header>

        <section className="projects-group" aria-labelledby="projects-selected">
          <div className="section-header">
            <h2 id="projects-selected" className="section-heading">
              Selected work
            </h2>
            {/* Counted, never typed. */}
            <p className="section-header-meta">
              {projectCountLabel(shipped.length)}
            </p>
          </div>
          <ol className="projects-register">
            {shipped.map((project) => (
              <li key={project.title}>
                <Entry data={project} />
              </li>
            ))}
          </ol>
        </section>

        {/* The same list and the same row as the work above: the archive is
            a quieter part of one register, not a second kind of page. */}
        <section className="projects-group" aria-labelledby="projects-archive">
          <div className="section-header">
            <h2 id="projects-archive" className="section-heading">
              Archive
            </h2>
            <p className="section-header-meta">
              {projectCountLabel(archive.length)}
            </p>
          </div>
          <p className="projects-group-note">
            Student projects, hackathons, and experiments, kept for the record.
          </p>
          <ol className="projects-register">
            {archive.map((project) => (
              <li key={project.title}>
                <Entry data={project} />
              </li>
            ))}
          </ol>
        </section>
      </div>
    </PageWrapper>
  );
}
