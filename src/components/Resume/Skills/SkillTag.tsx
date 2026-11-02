import type { Skill } from '@/data/resume/skills';
import { MAX_COMPETENCY } from '@/lib/utils';

interface SkillTagProps {
  data: Skill;
}

export type SkillTier = 'deep' | 'working' | 'familiar';

const TIER_DESCRIPTION: Record<SkillTier, string> = {
  deep: 'deep knowledge',
  working: 'working knowledge',
  familiar: 'familiarity',
};

/**
 * The 1–5 score is a self-assessment, so it is reported at the precision it
 * has: a coarse tier, not a plotted value with an axis.
 */
export function knowledgeTier(competency: number): SkillTier {
  if (competency >= MAX_COMPETENCY) return 'deep';
  if (competency >= 4) return 'working';
  return 'familiar';
}

/**
 * One entry in a group's list. All three tiers are stated as text for a
 * screen reader; a sighted reader gets the order the group is listed in, and
 * one fainter tone for the last tier.
 */
export default function SkillTag({ data }: SkillTagProps) {
  const { competency, title } = data;
  const tier = knowledgeTier(competency);

  return (
    <li className={`skill-tag skill-tag--${tier}`}>
      {title}
      <span className="sr-only">{`, ${TIER_DESCRIPTION[tier]}`}</span>
    </li>
  );
}
