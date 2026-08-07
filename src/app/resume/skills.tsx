import Section from '@/components/ui/section';
import { categories, skills } from '@/data/resume/skills';
import SkillFilter from './skill-filter';

/**
 * Server Component: the section chrome and copy are static, so only the filter
 * and the grid it drives cross into the client bundle.
 */
const Skills = () => (
  <Section id="skills" title="Skills">
    <p className="mb-6 max-w-2xl text-[0.92rem] leading-relaxed text-muted">
      Some of my primary professional skills. Filter by category.
    </p>
    <SkillFilter skills={skills} categories={categories} />
  </Section>
);

export default Skills;
