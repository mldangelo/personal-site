const skills = [
  {
    title: 'Python',
    competency: 4,
    category: ['Languages'],
  },
  {
    title: 'C++',
    competency: 5,
    category: ['Languages'],
  },
  {
    title: 'C',
    competency: 4,
    category: ['Languages'],
  },
  {
    title: 'Rust',
    competency: 1,
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
    competency: 3,
    category: ['Languages', 'Web Development'],
  },
  {
    title: 'Typescript',
    competency: 3,
    category: ['Languages', 'Web Development'],
  },
  {
    title: 'HTML',
    competency: 3,
    category: ['Languages', 'Web Development'],
  },
  {
    title: 'CSS',
    competency: 3,
    category: ['Languages', 'Web Development'],
  },
  {
    title: 'Angular',
    competency: 3,
    category: ['Web Development'],
  },
  {
    title: 'SQL',
    competency: 3,
    category: ['Languages'],
  },
  {
    title: 'Haskell',
    competency: 1,
    category: ['Languages'],
  },
  {
    title: 'Clojure',
    competency: 3,
    category: ['Languages'],
  },
  {
    title: 'LLM Prompting',
    competency: 3,
    category: ['Tools'],
  },
  {
    title: 'Git',
    competency: 4,
    category: ['Tools'],
  },
  {
    title: 'Bash',
    competency: 3,
    category: ['Tools'],
  },
  {
    title: 'NumPy',
    competency: 4,
    category: ['Python'],
  },
  {
    title: 'Pandas',
    competency: 3,
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
    title: 'OpenAI-Gym',
    competency: 3,
    category: ['Python'],
  },
  {
    title: 'Pytorch',
    competency: 2,
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

const categories = [...new Set(skills.flatMap(({ category }) => category))]
  .sort()
  .map((category, index) => ({
    name: category,
    color: colors[index],
  }));

export { categories, skills };
