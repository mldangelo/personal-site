import Cell from '../components/Projects/Cell';
import PageHeader from '../components/Template/PageHeader';
import data from '../data/projects';
import Main from '../layouts/Main';

const Projects = () => (
  <Main title="Projects" description="Learn about Austin Dase's projects.">
    <PageHeader eyebrow="Projects" title="Projects">
      <p>Talks and papers. Expand any card to read or watch it inline.</p>
    </PageHeader>

    <div className="border-t border-rule">
      {data.map((project) => (
        <Cell data={project} key={project.title} id={project.title} />
      ))}
    </div>
  </Main>
);

export default Projects;
