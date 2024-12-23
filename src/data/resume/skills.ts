import type { Skill } from '../../types';

export const categories = [
  'Machine Learning',
  'Languages',
  'Infrastructure',
  'Leadership',
  'Data',
] as const;

export const skills: Skill[] = [
  // Machine Learning
  {
    title: 'LLM Development & Evaluation',
    competency: 5,
    category: ['Machine Learning'],
  },
  {
    title: 'NLP & Transformers',
    competency: 5,
    category: ['Machine Learning'],
  },
  {
    title: 'ML System Design',
    competency: 5,
    category: ['Machine Learning', 'Infrastructure'],
  },
  {
    title: 'PyTorch & Deep Learning',
    competency: 4,
    category: ['Machine Learning'],
  },
  {
    title: 'ML Research & Papers',
    competency: 4,
    category: ['Machine Learning'],
  },

  // Leadership
  {
    title: 'ML Team Leadership',
    competency: 5,
    category: ['Leadership', 'Machine Learning'],
  },
  {
    title: 'Technical Strategy',
    competency: 5,
    category: ['Leadership'],
  },
  {
    title: 'Product Development',
    competency: 4,
    category: ['Leadership'],
  },

  // Infrastructure
  {
    title: 'MLOps & Model Serving',
    competency: 4,
    category: ['Infrastructure', 'Machine Learning'],
  },
  {
    title: 'Distributed Systems',
    competency: 4,
    category: ['Infrastructure'],
  },
  {
    title: 'AWS & Cloud',
    competency: 4,
    category: ['Infrastructure'],
  },

  // Data
  {
    title: 'ML Data Pipeline Design',
    competency: 5,
    category: ['Data', 'Machine Learning'],
  },
  {
    title: 'Data Engineering',
    competency: 4,
    category: ['Data'],
  },
  {
    title: 'SQL & NoSQL',
    competency: 4,
    category: ['Data'],
  },
  {
    title: 'Metrics & Analytics',
    competency: 5,
    category: ['Data', 'Machine Learning'],
  },

  // Languages & Tools
  {
    title: 'Python & Scientific Stack',
    competency: 5,
    category: ['Languages', 'Machine Learning'],
  },
  {
    title: 'JavaScript/TypeScript',
    competency: 4,
    category: ['Languages'],
  },
];
