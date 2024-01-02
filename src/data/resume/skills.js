const skills = [
  {
    title: 'Python',
    competency: 5,
    category: ['Languages'],
  },
  {
    title: 'C/C++',
    competency: 4,
    category: ['Languages'],
  },
  {
    title: 'Rust',
    competency: 2,
    category: ['Languages'],
  },
  {
    title: 'C#',
    competency: 2,
    category: ['Languages'],
  },
  {
    title: 'Java',
    competency: 3,
    category: ['Languages'],
  },
  {
    title: 'Javascript',
    competency: 2,
    category: ['Languages'],
  },
  {
    title: 'HTML + CSS',
    competency: 2,
    category: ['Languages'],
  },
  {
    title: 'SQL',
    competency: 3,
    category: ['Languages'],
  },
  {
    title: 'Git',
    competency: 3,
    category: ['Tools'],
  },
  {
    title: 'Bash',
    competency: 2,
    category: ['Tools'],
  },
  {
    title: 'NumPy',
    competency: 5,
    category: ['Python'],
  },
  {
    title: 'Pandas',
    competency: 4,
    category: ['Python'],
  },
  {
    title: 'Matplotlib',
    competency: 4,
    category: ['Python'],
  },
  {
    title: 'Numba',
    competency: 3,
    category: ['Python'],
  },
  {
    title: 'Gym',
    competency: 4,
    category: ['Python'],
  },
  {
    title: 'Pytorch',
    competency: 3,
    category: ['Python'],
  },
].map((skill) => ({ ...skill, category: skill.category.sort() }));

// this is a list of colors that I like. The length should be === to the
// number of categories. Re-arrange this list until you find a pattern you like.
const colors = [
  '#e47272',
  '#6968b3',
  '#37b1f5',
  '#40494e',
  '#515dd4',
  '#cc7b94',
  '#3896e2',
  '#c3423f',
  '#d75858',
  '#747fff',
  '#64cb7b',
];

const categories = [
  ...new Set(skills.flatMap(({ category }) => category)),
].sort().map((category, index) => ({
  name: category,
  color: colors[index],
}));

export { categories, skills };
