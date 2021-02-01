import Link from 'next/link';
import { NextSeo } from 'next-seo';

import Cell from '../components/Projects/Cell';
import data from '../data/projects';

const Projects = () => (
  <>
    <NextSeo
      title="Projects | Michael D'Angelo"
      description="Learn about Michael D'Angelo's projects."
    />
    <article className="post" id="projects">
      <header>
        <div className="title">
          <h2>
            <Link href="/projects">
              <a>Projects</a>
            </Link>
          </h2>
          <p>A selection of projects that I&apos;m not too ashamed of</p>
        </div>
      </header>
      {data.map((project) => (
        <Cell data={project} key={project.title} />
      ))}
    </article>
  </>
);

export default Projects;
