export interface Skill {
  title: string;
  competency: number;
  category: string[];
}

export interface Category {
  name: string;
  color: string;
  /** Pre-computed text color for contrast - 'dark' for light backgrounds, 'light' for dark */
  textColor: 'dark' | 'light';
}

const skills: Skill[] = [
  // Languages
  {
    title: 'Python',
    competency: 5,
    category: ['Languages', 'ML Engineering'],
  },
  {
    title: 'TypeScript',
    competency: 5,
    category: ['Languages', 'Web Development'],
  },
  {
    title: 'SQL',
    competency: 4,
    category: ['Languages', 'Databases'],
  },
  // AI & LLM
  {
    title: 'AI Agents',
    competency: 5,
    category: ['ML Engineering'],
  },
  {
    title: 'LLM Evaluation',
    competency: 5,
    category: ['ML Engineering'],
  },
  {
    title: 'AI Red-teaming',
    competency: 5,
    category: ['ML Engineering'],
  },
  {
    title: 'LLM APIs',
    competency: 5,
    category: ['ML Engineering'],
  },
  {
    title: 'RAG',
    competency: 4,
    category: ['ML Engineering'],
  },
  {
    title: 'Prompt Engineering',
    competency: 4,
    category: ['ML Engineering'],
  },
  {
    title: 'Vector Databases',
    competency: 4,
    category: ['ML Engineering', 'Databases'],
  },
  {
    title: 'PyTorch',
    competency: 4,
    category: ['ML Engineering'],
  },
  {
    title: 'Pandas',
    competency: 5,
    category: ['ML Engineering', 'Data Engineering'],
  },
  // Web Development
  {
    title: 'Node.js',
    competency: 5,
    category: ['Web Development'],
  },
  {
    title: 'FastAPI',
    competency: 4,
    category: ['Web Development'],
  },
  {
    title: 'Next.js',
    competency: 3,
    category: ['Web Development'],
  },
  // Databases
  {
    title: 'PostgreSQL',
    competency: 4,
    category: ['Databases'],
  },
  {
    title: 'Redis',
    competency: 3,
    category: ['Databases'],
  },
  // Infrastructure
  {
    title: 'AWS',
    competency: 4,
    category: ['Infrastructure'],
  },
  {
    title: 'Docker',
    competency: 4,
    category: ['Infrastructure'],
  },
  {
    title: 'Kubernetes',
    competency: 3,
    category: ['Infrastructure'],
  },
  {
    title: 'Observability',
    competency: 4,
    category: ['Infrastructure', 'ML Engineering'],
  },
].map((skill) => ({ ...skill, category: skill.category.sort() }));

/**
 * Build categories from skills, all using the accent color token.
 */
function buildCategories(skillsList: Skill[]): Category[] {
  const uniqueCategories = Array.from(
    new Set(skillsList.flatMap(({ category }) => category)),
  ).sort();

  return uniqueCategories.map((category) => ({
    name: category,
    color: 'var(--color-accent)',
    textColor: 'dark' as const,
  }));
}

const categories: Category[] = buildCategories(skills);

export { categories, skills };
