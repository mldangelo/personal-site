import type { Skill } from '@/data/resume/skills';
import { MAX_COMPETENCY } from '@/lib/utils';

interface SkillTagProps {
  data: Skill;
}

export type SkillTier = 'core' | 'working' | 'familiar';

/**
 * Three coarse tiers derived from the 1–5 self-score.
 *
 * The score is a self-assessment, so it is reported at the precision it
 * actually has: a tier, not a plotted value with an axis. The old tag varied
 * size and weight by score, but its numeric `aria-label` sat on a bare
 * `<span>`, whose `generic` role cannot take an accessible name. The visible
 * legend explains the three tiers once; each tag includes its own tier as
 * visually hidden text so non-visual readers receive the same information.
 */
export function tierFor(competency: number): SkillTier {
  if (competency >= MAX_COMPETENCY) return 'core';
  if (competency >= MAX_COMPETENCY - 1) return 'working';
  return 'familiar';
}

export default function SkillTag({ data }: SkillTagProps) {
  const { competency, title } = data;
  const tier = tierFor(competency);

  return (
    <span className={`skill-tag skill-tag--${tier}`}>
      <span className="skill-tag-name">{title}</span>
      <span className="sr-only">, proficiency: {tier}</span>
    </span>
  );
}
