export interface ISkill {
  title: string;
  competency: number;
  category: string[];
}

/**
 * Five categories, each bound to a palette token so the bars stay inside the
 * design system and flip with the theme. Adding a category means adding a
 * --color-cat-* token in theme.css alongside it.
 */
const CATEGORY_COLORS: Record<string, string> = {
  'AI & ML': 'var(--color-cat-ai)',
  Languages: 'var(--color-cat-lang)',
  Web: 'var(--color-cat-web)',
  Data: 'var(--color-cat-data)',
  Platform: 'var(--color-cat-platform)'
};

const skills: ISkill[] = [
  { title: 'Java', competency: 5, category: ['Languages'] },
  { title: 'Python', competency: 5, category: ['Languages', 'AI & ML'] },
  { title: 'TypeScript', competency: 4, category: ['Languages', 'Web'] },
  { title: 'SQL', competency: 4, category: ['Languages', 'Data'] },
  { title: 'Anthropic / Claude API', competency: 5, category: ['AI & ML'] },
  { title: 'OpenAI API', competency: 4, category: ['AI & ML'] },
  { title: 'AWS Bedrock', competency: 4, category: ['AI & ML', 'Platform'] },
  { title: 'RAG & evals', competency: 4, category: ['AI & ML'] },
  { title: 'Machine learning', competency: 4, category: ['AI & ML'] },
  { title: 'React', competency: 4, category: ['Web'] },
  { title: 'Next.js', competency: 4, category: ['Web'] },
  { title: 'Spring Boot', competency: 5, category: ['Web'] },
  { title: 'Vue', competency: 4, category: ['Web'] },
  { title: 'GraphQL', competency: 3, category: ['Web'] },
  { title: 'Postgres', competency: 5, category: ['Data'] },
  { title: 'AWS', competency: 5, category: ['Platform'] },
  { title: 'Vercel', competency: 5, category: ['Platform'] },
  { title: 'Stripe', competency: 4, category: ['Platform'] },
  { title: 'Auth0 / Okta', competency: 4, category: ['Platform'] }
].map((skill) => ({ ...skill, category: skill.category.sort() }));

export interface ICategory {
  name: string;
  color: string;
}

/**
 * Deduplicate the names before building objects — a Set of freshly created
 * objects never collapses duplicates, which previously produced one entry per
 * occurrence and left most of them without a color.
 */
const categories: ICategory[] = [
  ...new Set(skills.flatMap((skill) => skill.category))
]
  .sort()
  .map((name) => ({
    name,
    color: CATEGORY_COLORS[name] ?? 'var(--color-accent)'
  }));

/**
 * Ordering for the skills grid: strongest first, then by primary category, then
 * alphabetically. Lives with the data rather than in the filter component —
 * it describes the collection, not the view.
 */
export const byCompetency = (a: ISkill, b: ISkill): number =>
  b.competency - a.competency ||
  b.category[0].localeCompare(a.category[0]) ||
  a.title.localeCompare(b.title);

/** The homepage's quiet slash-separated row: headline skills, no numbers. */
export const headlineSkills: string[] = [
  'Java',
  'TypeScript',
  'Python',
  'AWS',
  'Vercel',
  'Postgres',
  'Machine learning',
  'Spring Boot',
  'React / Next.js'
];

export { categories, skills };
