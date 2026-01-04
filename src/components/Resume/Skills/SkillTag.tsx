import type { CSSProperties } from 'react';

import type { Category, Skill } from '@/data/resume/skills';
import { MAX_COMPETENCY } from '@/lib/utils';

interface SkillTagProps {
  data: Skill;
  categories: Category[];
}

export default function SkillTag({ data, categories }: SkillTagProps) {
  const { category, competency, title } = data;

  // Get the primary category color
  const categoryColor = categories.find((cat) =>
    category.includes(cat.name),
  )?.color;

  // Size based on competency (5 = large, 4 = medium, 3 = small)
  const sizeClass =
    competency >= 5
      ? 'skill-tag--lg'
      : competency >= 4
        ? 'skill-tag--md'
        : 'skill-tag--sm';

  return (
    <span
      className={`skill-tag ${sizeClass}`}
      style={
        {
          '--tag-color': categoryColor,
        } as CSSProperties
      }
      title={`${title}: ${competency} out of ${MAX_COMPETENCY}`}
      aria-label={`${title}: proficiency ${competency} out of ${MAX_COMPETENCY}`}
    >
      <span className="skill-tag-name">{title}</span>
    </span>
  );
}
