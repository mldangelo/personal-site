import Cell from '@/components/Projects/Cell';
import data from '@/data/projects';

interface ProjectsSectionProps {
  headingLevel?: 'h1' | 'h2';
}

export default function ProjectsSection({
  headingLevel: Heading = 'h1',
}: ProjectsSectionProps) {
  return (
    <section className="projects-page">
      <header className="projects-header">
        <Heading className="page-title">Projects</Heading>
        <p className="page-subtitle">
          Some of the projects and experiments from my student years
        </p>
      </header>

      <div className="win-panel">
        <div className="win-panel-titlebar">PROJECTS.EXE</div>
        <div className="win-panel-body">
          <div className="projects-grid">
            {data.map((project) => (
              <Cell data={project} key={project.title} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
