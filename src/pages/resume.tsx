import Education from '../components/Resume/Education';
import Experience from '../components/Resume/Experience';
import Skills from '../components/Resume/Skills';
import PageHeader from '../components/Template/PageHeader';
import degrees from '../data/resume/degrees';
import { categories, skills } from '../data/resume/skills';
import work from '../data/resume/work';
import Main from '../layouts/Main';

// NOTE: sections are displayed in order defined.
const sections = {
  Experience: () => <Experience data={work} />,
  Education: () => <Education data={degrees} />,
  Skills: () => <Skills skills={skills} categories={categories} />
};

const Resume = () => (
  <Main title="Resume" description="Austin Dase's Resume.">
    <PageHeader eyebrow="Resume" title="Resume">
      <nav aria-label="Resume sections" className="flex flex-wrap gap-2">
        {Object.keys(sections).map((sec) => (
          <a
            key={sec}
            href={`#${sec.toLowerCase()}`}
            className="border border-rule px-3 py-1.5 font-mono text-[0.72rem] tracking-nav uppercase transition-colors hover:border-accent hover:text-fg"
          >
            {sec}
          </a>
        ))}
      </nav>
    </PageHeader>

    {Object.entries(sections).map(([name, Section]) => (
      <Section key={name} />
    ))}
  </Main>
);

export default Resume;
