import Courses from '@/components/Resume/Courses';
import Education from '@/components/Resume/Education';
import Experience from '@/components/Resume/Experience';
import ResumeNav from '@/components/Resume/ResumeNav';
import Skills from '@/components/Resume/Skills';
import courses from '@/data/resume/courses';
import degrees from '@/data/resume/degrees';
import { categories, skills } from '@/data/resume/skills';
import work from '@/data/resume/work';

interface ResumeSectionProps {
  headingLevel?: 'h1' | 'h2';
}

export default function ResumeSection({
  headingLevel: Heading = 'h1',
}: ResumeSectionProps) {
  return (
    <section className="resume-page">
      <header className="resume-header">
        <Heading className="resume-title">Resume</Heading>
      </header>

      <ResumeNav />

      <div className="resume-content">
        <section id="experience" className="resume-section">
          <div className="win-panel win-panel--amber">
            <div className="win-panel-titlebar">EXPERIENCE.LOG</div>
            <div className="win-panel-body">
              <Experience data={work} />
            </div>
          </div>
        </section>

        <section id="education" className="resume-section">
          <div className="win-panel win-panel--green">
            <div className="win-panel-titlebar">EDUCATION.DOC</div>
            <div className="win-panel-body">
              <Education data={degrees} />
            </div>
          </div>
        </section>

        <section id="skills" className="resume-section">
          <div className="win-panel win-panel--purple">
            <div className="win-panel-titlebar">SKILLS.DAT</div>
            <div className="win-panel-body">
              <Skills skills={skills} categories={categories} />
            </div>
          </div>
        </section>

        <section id="courses" className="resume-section">
          <div className="win-panel win-panel--teal">
            <div className="win-panel-titlebar">COURSES.LST</div>
            <div className="win-panel-body">
              <Courses data={courses} />
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
