import type { Skill } from '@/data/resume/skills';

interface SkillTagProps {
  data: Skill;
}

/**
 * A tag is its name and nothing else.
 *
 * Three things used to hang off it, and all three were removed rather than
 * restyled. A `title` and an `aria-label` reported a 1–5 self-score — and the
 * `aria-label` sat on a bare `<span>`, which maps to role `generic`, so the
 * name was discarded and screen readers announced nothing at all. An inline
 * `--tag-color` painted a category tick that came out identical on every tag.
 * A `core`/`working`/`familiar` tier replaced the score with a coarser one,
 * and there is no score left to coarsen: hierarchy is the authored order of
 * `src/data/resume/skills.ts` now.
 *
 * So there is no accessible name to get wrong and no state to encode in
 * colour. Anything added back here needs to survive greyscale and print, and
 * needs a role that accepts a name.
 */
export default function SkillTag({ data }: SkillTagProps) {
  return <span className="skill-tag">{data.title}</span>;
}
