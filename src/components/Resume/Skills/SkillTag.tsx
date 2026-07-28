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
 * actually has: a tier, not a plotted value with an axis. The tier is rendered
 * as real text rather than encoded in the tag's colour, which is what the tag
 * used to do — a colour-only cue fails WCAG 1.4.1, and the `aria-label` it was
 * paired with sat on a bare `<span>`, whose role is `generic`, so browsers
 * discarded the name and screen readers announced nothing at all.
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
      <span className="skill-tag-tier">
        <span className="sr-only">proficiency: </span>
        {tier}
      </span>
    </span>
  );
}
