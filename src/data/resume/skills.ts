export interface Skill {
  title: string;
  competency: number;
  category: string[];
}

export interface Category {
  name: string;
  color: string;
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

// this is a list of colors that I like. The length should be === to the
// number of categories. Re-arrange this list until you find a pattern you like.
const colors: string[] = [
  '#6968b3',
  '#37b1f5',
  '#40494e',
  '#515dd4',
  '#e47272',
  '#cc7b94',
  '#3896e2',
  '#c3423f',
  '#d75858',
  '#747fff',
  '#64cb7b',
];

const categories: Category[] = Array.from(
  new Set(skills.flatMap(({ category }) => category)),
)
  .sort()
  .map((category, index) => ({
    name: category,
    color: colors[index],
  }));

export { categories, skills };
