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
    title: 'C++',
    competency: 5,
    category: ['Languages', 'Systems'],
  },
  {
    title: 'C',
    competency: 4,
    category: ['Languages', 'Systems'],
  },
  {
    title: 'Go',
    competency: 4,
    category: ['Languages', 'Systems'],
  },
  {
    title: 'Python',
    competency: 4,
    category: ['Languages'],
  },
  {
    title: 'Java',
    competency: 3,
    category: ['Languages'],
  },
  {
    title: 'SQL',
    competency: 3,
    category: ['Languages', 'Databases'],
  },
  // Systems
  {
    title: 'Distributed Systems',
    competency: 5,
    category: ['Systems'],
  },
  {
    title: 'Storage Internals',
    competency: 5,
    category: ['Systems'],
  },
  {
    title: 'OS Internals',
    competency: 4,
    category: ['Systems'],
  },
  {
    title: 'Concurrency & Multithreading',
    competency: 5,
    category: ['Systems'],
  },
  {
    title: 'Networking (TCP/IP)',
    competency: 4,
    category: ['Systems'],
  },
  {
    title: 'gRPC',
    competency: 5,
    category: ['Systems'],
  },
  {
    title: 'REST APIs',
    competency: 4,
    category: ['Systems'],
  },
  {
    title: 'Microservices',
    competency: 4,
    category: ['Systems'],
  },
  // Cloud & Infra
  {
    title: 'AWS',
    competency: 4,
    category: ['Infrastructure'],
  },
  {
    title: 'Kubernetes',
    competency: 4,
    category: ['Infrastructure'],
  },
  {
    title: 'Docker',
    competency: 4,
    category: ['Infrastructure'],
  },
  {
    title: 'Grafana',
    competency: 3,
    category: ['Infrastructure'],
  },
  {
    title: 'Elasticsearch',
    competency: 3,
    category: ['Infrastructure', 'Databases'],
  },
  // Databases
  {
    title: 'MongoDB',
    competency: 3,
    category: ['Databases'],
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
