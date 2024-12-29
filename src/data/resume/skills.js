const skills = [
  {
    title: 'PostgreSQL/SQL',
    competency: 4,
    category: ['Databases', 'Languages', 'Data Science'],
  },
  {
    title: 'Web Scraping',
    competency: 4,
    category: ['Data Science', 'Python', 'R'],
  },
  {
    title: 'FastAPI',
    competency: 4,
    category: ['Data Science', 'Python'],
  },
  {
    title: 'Git',
    competency: 4,
    category: ['Tools'],
  },
  {
    title: 'Docker',
    competency: 1,
    category: ['Tools', 'Data Science'],
  },
  {
    title: 'Numpy',
    competency: 5,
    category: ['Data Science', 'Python'],
  },
  {
    title: 'Deep Learning with Tensorflow + Keras',
    competency: 5,
    category: ['Data Science', 'Machine Learning', 'Python'],
  },
  {
    title: 'Deep Learning with PyTorch',
    competency: 5,
    category: ['Data Science', 'Machine Learning', 'Python'],
  },
  {
    title: 'Python',
    competency: 5,
    category: ['Languages', 'Python', 'Data Science'],
  },
  {
    title: 'R',
    competency: 5,
    category: ['Languages', 'R'],
  },
  {
    title: 'Data Visualization',
    competency: 4,
    category: ['Data Science', 'Python'],
  },
  {
    title: 'Pandas',
    competency: 5,
    category: ['Data Science', 'Python'],
  },
  {
    title: 'Matplotlib',
    competency: 3,
    category: ['Data Science', 'Python'],
  },
  {
    title: 'Scikit-Learn',
    competency: 4,
    category: ['Data Science', 'Machine Learning', 'Python'],
  },
  {
    title: 'Spark',
    competency: 3,
    category: ['Data Science', 'Machine Learning'],
  },
  {
    title: 'Django',
    competency: 4,
    category: ['Data Science', 'Python'],
  },
  {
    title: 'Factor Analysis: CFA and EFA',
    competency: 4,
    category: ['Statistics', 'R'],
  },
  {
    title: 'Natural Language Processing (NLP)',
    competency: 4,
    category: ['Data Science', 'R', 'Python'],
  },
  {
    title: 'Statistics',
    competency: 5,
    category: ['Statistics', 'Data Science', 'R', 'Python'],
  },
  {
    title: 'Large Language Model (LLM)',
    competency: 4,
    category: ['Data Science', 'Python'],
  },
].map((skill) => ({ ...skill, category: skill.category.sort() }));

// this is a list of colors that I like. The length should be === to the
// number of categories. Re-arrange this list until you find a pattern you like.
const colors = [
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

const categories = [...new Set(skills.flatMap(({ category }) => category))]
  .sort()
  .map((category, index) => ({
    name: category,
    color: colors[index],
  }));

export { categories, skills };
