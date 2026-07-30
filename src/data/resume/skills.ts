/**
 * The four groups, in the order they are shown. Current work leads.
 */
const categoryNames = [
  'Agent Systems',
  'AI Security & Evals',
  'ML Systems',
  'Software & Infrastructure',
] as const;

export type SkillCategory = (typeof categoryNames)[number];

export interface Skill {
  title: string;
  category: SkillCategory;
}

export interface Category {
  name: SkillCategory;
}

/**
 * Skills and categories are intentionally ordered, and order is the only
 * hierarchy here.
 *
 * Two earlier hierarchies are deliberately gone. A public 1–5 `competency`
 * self-score was published as tag size, then as a `core`/`working`/`familiar`
 * tier — a self-assessment reported to a precision it never had. And every
 * category once carried a `color` that `buildCategories` set to the same
 * `var(--color-accent)`, so the per-tag tick it painted distinguished nothing
 * while being the only cue for competency, which colour cannot legibly carry
 * anyway (WCAG 1.4.1).
 *
 * A `featured` flag replacing them would be the same self-rating with two
 * levels instead of five, and it landed on 16 of 27 entries, which identifies
 * nothing. The lead entry in each group is the signature one; the section
 * carries that the way the rest of the site does, with order and hairlines.
 *
 * Each skill has exactly one display category, so the All view and the printed
 * page never repeat a tag.
 */
const skills: Skill[] = [
  // Agent Systems
  { title: 'Coding Agents', category: 'Agent Systems' },
  { title: 'Agent Orchestration', category: 'Agent Systems' },
  { title: 'Tool Use & MCP', category: 'Agent Systems' },
  { title: 'Context Engineering', category: 'Agent Systems' },
  { title: 'Agent Telemetry & Observability', category: 'Agent Systems' },
  { title: 'Multi-Agent Workflows', category: 'Agent Systems' },

  // AI Security & Evals
  { title: 'AI for Software Security', category: 'AI Security & Evals' },
  { title: 'LLM & Agent Evals', category: 'AI Security & Evals' },
  {
    title: 'Evaluation Infrastructure & Graders',
    category: 'AI Security & Evals',
  },
  { title: 'AI Red Teaming', category: 'AI Security & Evals' },
  { title: 'Threat Modeling', category: 'AI Security & Evals' },
  { title: 'Vulnerability Validation', category: 'AI Security & Evals' },
  { title: 'Static Analysis', category: 'AI Security & Evals' },
  { title: 'Prompt Injection Defense', category: 'AI Security & Evals' },
  { title: 'Sandboxed Execution', category: 'AI Security & Evals' },
  { title: 'Human-in-the-Loop Controls', category: 'AI Security & Evals' },

  // ML Systems
  { title: 'Production ML Systems', category: 'ML Systems' },
  { title: 'Computer Vision', category: 'ML Systems' },
  { title: 'Embeddings & Vector Search', category: 'ML Systems' },
  { title: 'Probabilistic Modeling', category: 'ML Systems' },
  { title: 'Online Learning', category: 'ML Systems' },

  // Software & Infrastructure
  { title: 'Python', category: 'Software & Infrastructure' },
  { title: 'TypeScript', category: 'Software & Infrastructure' },
  { title: 'Distributed Systems', category: 'Software & Infrastructure' },
  { title: 'AWS', category: 'Software & Infrastructure' },
  { title: 'Docker', category: 'Software & Infrastructure' },
  { title: 'PostgreSQL & SQL', category: 'Software & Infrastructure' },
];

/**
 * The filter row and the group order both come from `categoryNames`, not from
 * a sort over the skill list — sorting is what alphabetized the section and
 * buried the current work under `AWS`.
 */
const categories: Category[] = categoryNames.map((name) => ({ name }));

export { categories, skills };
