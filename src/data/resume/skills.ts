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
    title: 'TypeScript',
    competency: 5,
    category: ['Languages', 'Web Development'],
  },
  {
    title: 'JavaScript',
    competency: 5,
    category: ['Languages', 'Web Development'],
  },
  {
    title: 'Python',
    competency: 3,
    category: ['Languages'],
  },
  {
    title: 'Java',
    competency: 3,
    category: ['Languages'],
  },
  {
    title: 'Kotlin',
    competency: 3,
    category: ['Languages'],
  },
  // Web Development
  {
    title: 'Node.js',
    competency: 5,
    category: ['Web Development'],
  },
  {
    title: 'Express',
    competency: 4,
    category: ['Web Development'],
  },
  {
    title: 'React',
    competency: 4,
    category: ['Web Development'],
  },
  {
    title: 'Next.js',
    competency: 3,
    category: ['Web Development'],
  },
  {
    title: 'Angular',
    competency: 2,
    category: ['Web Development'],
  },
  // Mobile
  {
    title: 'React Native',
    competency: 3,
    category: ['Mobile', 'Web Development'],
  },
  // Databases
  {
    title: 'MongoDB',
    competency: 3,
    category: ['Databases'],
  },
  {
    title: 'SQL Server',
    competency: 3,
    category: ['Databases'],
  },
  // Infrastructure
  {
    title: 'AWS',
    competency: 3,
    category: ['Infrastructure'],
  },
  {
    title: 'Heroku',
    competency: 3,
    category: ['Infrastructure'],
  },
  // Methodologies
  {
    title: 'Scrum',
    competency: 4,
    category: ['Methodologies'],
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
  }));
}

const categories: Category[] = buildCategories(skills);

export { categories, skills };
