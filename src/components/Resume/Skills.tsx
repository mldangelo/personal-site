import type { Category, Skill } from '@/data/resume/skills';

import SkillTag, { knowledgeTier } from './Skills/SkillTag';

interface SkillsProps {
  skills: Skill[];
  categories: Category[];
}

/**
 * Every skill under the category it belongs to, deepest first — the order
 * `/resume.json` publishes the same list in.
 *
 * This used to open with a row of filter buttons, one per category, above
 * tags already grouped under those same category names. The control was the
 * heaviest thing in the section and repeated its headings, so it is gone, and
 * with it the state: nothing here can be hidden, so nothing can be missing
 * from the page when it is printed.
 */
export default function Skills({ skills, categories }: SkillsProps) {
  const groups = categories
    .map((category) => ({
      name: category.name,
      skills: skills
        .filter((skill) => skill.category.includes(category.name))
        .sort(
          (a, b) =>
            b.competency - a.competency || a.title.localeCompare(b.title, 'en'),
        ),
    }))
    .filter((group) => group.skills.length > 0);

  // The fainter tone is only worth explaining where something is set in it.
  const hasFamiliar = skills.some(
    (skill) => knowledgeTier(skill.competency) === 'familiar',
  );

  return (
    <div className="skills">
      <div className="section-header">
        <h2 className="section-heading">Skills</h2>
      </div>
      <p className="resume-note skill-tier-legend">
        Strongest first.
        {hasFamiliar ? (
          // Says what a tone means, which is no use to anyone who cannot see
          // it; each tag already carries its tier as text for a screen reader.
          <span className="skill-tier-legend-tone" aria-hidden="true">
            {' '}
            Fainter tags mark familiarity, not working knowledge.
          </span>
        ) : null}
      </p>
      <div className="skill-groups">
        {groups.map((group) => (
          <div key={group.name} className="skill-group">
            <h3 className="skill-group-title">{group.name}</h3>
            <ul className="skill-tags">
              {group.skills.map((skill) => (
                <SkillTag key={skill.title} data={skill} />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
