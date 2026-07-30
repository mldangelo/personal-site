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
    title: 'C',
    competency: 5,
    category: ['Languages', 'Embedded Systems'],
  },
  {
    title: 'C++',
    competency: 5,
    category: ['Languages', 'Embedded Systems'],
  },
  {
    title: 'Python',
    competency: 5,
    category: ['Languages', 'Data & Analytics'],
  },
  {
    title: 'MicroPython',
    competency: 4,
    category: ['Languages', 'Embedded Systems'],
  },
  {
    title: 'Verilog',
    competency: 4,
    category: ['Languages', 'Hardware Design'],
  },
  {
    title: 'MATLAB',
    competency: 4,
    category: ['Languages', 'Data & Analytics'],
  },
  {
    title: 'Java',
    competency: 3,
    category: ['Languages'],
  },
  // Hardware Design
  {
    title: 'PCB Design',
    competency: 5,
    category: ['Hardware Design'],
  },
  {
    title: 'Altium Designer',
    competency: 5,
    category: ['Hardware Design', 'Tools'],
  },
  {
    title: 'Signal Integrity',
    competency: 4,
    category: ['Hardware Design'],
  },
  {
    title: 'Analog Circuit Design',
    competency: 4,
    category: ['Hardware Design'],
  },
  {
    title: 'SPICE Simulation (SIMetrix, LTSpice)',
    competency: 5,
    category: ['Hardware Design', 'Circuit Simulation & Analysis'],
  },
  {
    title: 'Oscilloscopes',
    competency: 5,
    category: ['Hardware Design'],
  },
  {
    title: 'Soldering & Prototyping',
    competency: 5,
    category: ['Hardware Design'],
  },
  {
    title: '3D Printing',
    competency: 4,
    category: ['Hardware Design'],
  },
  {
    title: 'CAD (Onshape)',
    competency: 3,
    category: ['Hardware Design', 'Tools'],
  },
  // Embedded Systems
  {
    title: 'Embedded Systems',
    competency: 5,
    category: ['Embedded Systems'],
  },
  {
    title: 'STM32',
    competency: 4,
    category: ['Embedded Systems'],
  },
  {
    title: 'I2C / Communication Protocols',
    competency: 4,
    category: ['Embedded Systems'],
  },
  {
    title: 'Closed-Loop Control Systems',
    competency: 4,
    category: ['Embedded Systems'],
  },
  {
    title: 'RF / IR Wireless Control',
    competency: 3,
    category: ['Embedded Systems'],
  },
  // Data & Analytics
  {
    title: 'Data Structures & Algorithms',
    competency: 4,
    category: ['Data & Analytics'],
  },
  {
    title: 'Power BI',
    competency: 4,
    category: ['Data & Analytics'],
  },
  {
    title: 'Linux',
    competency: 4,
    category: ['Data & Analytics', 'Tools'],
  },
  // Tools
  {
    title: 'Git (GitHub, GitLab)',
    competency: 5,
    category: ['Tools'],
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
