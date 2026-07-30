import type { Skill } from '@/data/resume/skills';

interface SkillTagProps {
  data: Skill;
}

/**
 * A tag is its name and nothing else.
 *
 * The old tag encoded a 1–5 self-score in its size plus a `title` and an
 * `aria-label`. That label sat on a bare `<span>`, which maps to role `generic`,
 * so the name was discarded and screen readers announced nothing at all. A
 * `core`/`working`/`familiar` tier later replaced the score with a coarser one.
 * Both rating systems are gone; hierarchy is the authored order of
 * `src/data/resume/skills.ts`.
 *
 * Separately, an inline `--tag-color` painted the same decorative category tick
 * on every tag; it never encoded competency. Anything added back here needs a
 * useful visible purpose and, if it carries text, a role that accepts a name.
 */
export default function SkillTag({ data }: SkillTagProps) {
  return <span className="skill-tag">{data.title}</span>;
}
