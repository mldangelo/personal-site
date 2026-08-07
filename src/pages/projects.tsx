import Link from 'next/link';
import Cell from '../components/Projects/Cell';
import data from '../data/projects';
import Main from '../layouts/Main';

const Projects = () => (
  <Main title="Projects" description="Learn about Austin Dase's projects.">
    <article className="post" id="projects">
      <header>
        <div className="title">
          <h2>
            <Link href="/projects" passHref>
              Projects
            </Link>
          </h2>
        </div>
      </header>
      {data.map((project) => (
        <Cell data={project} key={project.title} id={project.title} />
      ))}
    </article>
  </Main>
);

export default Projects;
