const skills = [
  {
    title: 'SATURN',
    competency: 3,
    category: ['Transport Modelling'],
  },
  {
    title: 'COBALT',
    competency: 2,
    category: ['Transport Modelling'],
  },
  {
    title: 'TUBA',
    competency: 2,
    category: ['Transport Modelling'],
  },
  {
    title: 'Python',
    competency: 4,
    category: ['Web Development', 'Data Science', 'Languages', 'Tools'],
  },
  {
    title: 'R',
    competency: 2,
    category: ['Data Science', 'Languages'],
  },
  {
    title: 'Core Java',
    competency: 3,
    category: ['Languages'],
  },
  {
    title: 'MATSim',
    competency: 4,
    category: ['Transport Modelling'],
  },
  {
    title: 'JavaScript',
    competency: 2,
    category: ['Web Development'],
  },
  {
    title: 'Bash',
    competency: 4,
    category: ['Tools', 'Languages'],
  },
  {
    title: 'CUBE',
    competency: 2,
    category: ['Transport Modelling'],
  },
  {
    title: 'VISSIM',
    competency: 2,
    category: ['Transport Modelling'],
  },
  {
    title: 'VISSUM',
    competency: 2,
    category: ['Transport Modelling'],
  },
  {
    title: 'SQL/SQLite3',
    competency: 2,
    category: ['Data Science', 'Languages'],
  },
  {
    title: 'Flask',
    competency: 2,
    category: ['Web Development'],
  },
  {
    title: 'Git',
    competency: 3,
    category: ['Tools'],
  },
  {
    title: 'Numpy',
    competency: 2,
    category: ['Data Science'],
  },
  {
    title: 'HTML + CSS',
    competency: 2,
    category: ['Web Development', 'Languages'],
  },
  {
    title: 'MATLAB',
    competency: 2,
    category: ['Languages'],
  },
  {
    title: 'GIS',
    competency: 4,
    category: ['Data Science'],
  },
  {
    title: 'Pandas',
    competency: 4,
    category: ['Data Science'],
  },
  {
    title: 'Matplotlib',
    competency: 3,
    category: ['Data Science'],
  },
  {
    title: 'Scikit-Learn',
    competency: 2,
    category: ['Data Science'],
  },
].map((skill) => ({ ...skill, category: skill.category.sort() }));

// this is a list of colors that I like. The length should be === to the
// number of categories. Re-arrange this list until you find a pattern you like.
const colors = [
  '#6968b3', // Purple
  '#3896e2', // Blue
  '#64cb7b', // Green
  '#f4a261', // Orange
  '#cc7b94', // Pink
  '#2a9d8f', // Teal
  '#e76f51', // Deep Orange
  '#f4a261', // Orange (Different Tone)
  '#747fff', // Light Blue
  '#ffb703', // Bright Yellow-Orange
];

const categories = [...new Set(skills.flatMap(({ category }) => category))]
  .sort()
  .map((category, index) => ({
    name: category,
    color: colors[index],
  }));

export { categories, skills };
