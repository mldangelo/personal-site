// TODO: Add Athletic Skills, Office Skills,
// Data Engineering, Data Science, ML Engineering, ... ?

const skills = [
  {
    title: 'Python',
    competency: 5,
    category: ['Languages', 'Python'],
  },
  {
    title: 'Pandas',
    competency: 3,
    category: ['Data Science', 'Python', 'Artificial Intelligence'],
  },
  {
    title: 'Tensorflow + Keras',
    competency: 3,
    category: ['Data Science', 'Python', 'Artificial Intelligence'],
  },
  {
    title: 'Flask',
    competency: 2,
    category: ['Web Development', 'Python'],
  },
  {
    title: 'Blockchain',
    competency: 5,
    category: ['Blockchain'],
  },
  {
    title: 'Solidity + Ethereum',
    competency: 4,
    category: ['Blockchain', 'Languages'],
  },
  {
    title: 'Hyperledger Fabric',
    competency: 4,
    category: ['Blockchain'],
  },
  {
    title: 'Truffle + Ganache',
    competency: 4,
    category: ['Blockchain'],
  },
  {
    title: 'GO',
    competency: 3,
    category: ['Blockchain', 'Languages'],
  },
  {
    title: 'Heroku + Netify',
    competency: 3,
    category: ['Web Development', 'Tools'],
  },
  {
    title: 'MongoDB',
    competency: 3,
    category: ['Web Development', 'Databases'],
  },
  {
    title: 'HTML + SASS/SCSS/CSS',
    competency: 3,
    category: ['Web Development', 'Languages'],
  },
  {
    title: 'Express.JS',
    competency: 2,
    category: ['Web Development', 'Javascript'],
  },
  {
    title: 'Node.JS',
    competency: 3,
    category: ['Web Development', 'Javascript'],
  },
  {
    title: 'React',
    competency: 3,
    category: ['Web Development', 'Javascript'],
  },
  {
    title: 'Amazon Web Services',
    competency: 4,
    category: ['Web Development', 'Tools', 'DevOps'],
  },
  {
    title: 'Docker',
    competency: 3,
    category: ['Tools', 'DevOps'],
  },
  {
    title: 'Kubernetes',
    competency: 2,
    category: ['Tools', 'DevOps'],
  },
  {
    title: 'Google Cloud Compute',
    competency: 2,
    category: ['Tools', 'Web Development', 'DevOps'],
  },
  {
    title: 'Jenkins',
    competency: 3,
    category: ['Tools', 'DevOps'],
  },
  {
    title: 'Vagrant',
    competency: 3,
    category: ['Tools', 'DevOps'],
  },
  {
    title: 'Data Visualization',
    competency: 3,
    category: ['Data Science', 'Javascript'],
  },
  {
    title: 'Bash',
    competency: 4,
    category: ['Tools', 'Languages'],
  },
  {
    title: 'Git',
    competency: 4,
    category: ['Tools'],
  },
  {
    title: 'Pytorch',
    competency: 4,
    category: ['Python', 'Artificial Intelligence'],
  },
  {
    title: 'Tflearn',
    competency: 3,
    category: ['Python', 'Artificial Intelligence'],
  },
].map((skill) => ({ ...skill, category: skill.category.sort() }));

// this is a list of colors that I like. The length should be == to the
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

const categories = [
  ...new Set(skills.reduce((acc, { category }) => acc.concat(category), [])),
]
  .sort()
  .map((category, index) => ({
    name: category,
    color: colors[index],
  }));

export { categories, skills };
