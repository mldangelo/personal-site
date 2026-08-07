import type { Metadata } from 'next';
import PageHeader from '@/components/ui/page-header';
import data from '@/data/projects';
import { pageMetadata } from '@/lib/metadata';
import ProjectCell from './project-cell';

export const metadata: Metadata = pageMetadata({
  title: 'Projects',
  description: "Learn about Austin Dase's projects.",
  path: '/projects',
  imageAlt: 'Preview card for Austin Dase projects and papers'
});

const Projects = () => (
  <>
    <PageHeader eyebrow="Projects" title="Projects">
      <p>Talks and papers. Expand any card to read or watch it inline.</p>
    </PageHeader>

    <div className="border-t border-rule">
      {data.map((project) => (
        <ProjectCell data={project} key={project.title} id={project.title} />
      ))}
    </div>
  </>
);

export default Projects;
