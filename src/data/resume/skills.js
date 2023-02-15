// TODO: Add Athletic Skills, Office Skills,
// Data Engineering, Data Science, ML Engineering, ... ?

const skills = [
  {
    title: 'Javascript',
    competency: 3,
    category: ['Web Development', 'Languages', 'Javascript'],
  },
  {
    title: 'Node.JS',
    competency: 3,
    category: ['Web Development', 'Javascript'],
  },
  {
    title: 'React',
    competency: 2,
    category: ['Web Development', 'Javascript'],
  },
  {
    title: 'Bash',
    competency: 4,
    category: ['Tools', 'Languages'],
  },
  {
    title: 'Amazon Web Services',
    competency: 4,
    category: ['Web Development', 'Tools'],
  },
  {
    title: 'DynamodDB',
    competency: 4,
    category: ['Web Development', 'Databases'],
  },
  {
    title: 'ElasticSearch',
    competency: 3,
    category: ['Web Development', 'Databases'],
  },
  {
    title: 'PostgreSQL/SQLite3/SQL',
    competency: 3,
    category: ['Web Development', 'Databases', 'Languages'],
  },
  {
    title: 'Data Mining',
    competency: 3,
    category: ['Data Science'],
  },
  {
    title: 'Git',
    competency: 4,
    category: ['Tools'],
  },
  {
    title: 'Kubernetes',
    competency: 2,
    category: ['Tools', 'Data Engineering'],
  },
  {
    title: 'Firebase',
    competency: 2,
    category: ['Tools', 'Web Development'],
  },
  {
    title: 'Numpy',
    competency: 5,
    category: ['Data Science', 'Data Engineering', 'Python'],
  },
  {
    title: 'Tensorflow + Keras',
    competency: 5,
    category: ['Data Science', 'Python'],
  },
  {
    title: 'Jupyter',
    competency: 5,
    category: ['Data Science', 'Python'],
  },
  {
    title: 'HTML + SASS/SCSS/CSS',
    competency: 3,
    category: ['Web Development', 'Languages'],
  },
  {
    title: 'Python',
    competency: 5,
    category: ['Languages', 'Python'],
  },
  {
    title: 'C++',
    competency: 4,
    category: ['Languages'],
  },
  {
    title: 'MATLAB',
    competency: 2,
    category: ['Languages'],
  },
  {
    title: 'R (Not a fan)',
    competency: 1,
    category: ['Languages'],
  },
  {
    title: 'Data Visualization',
    competency: 5,
    category: ['Data Science', 'Python'],
  },
  {
    title: 'GraphQL',
    competency: 4,
    category: ['Web Development', 'Databases'],
  },
  {
    title: 'Pandas',
    competency: 3,
    category: ['Data Engineering', 'Data Science', 'Python'],
  },
  {
    title: 'Matplotlib',
    competency: 5,
    category: ['Data Engineering', 'Data Science', 'Python'],
  },
  {
    title: 'Scikit-Learn',
    competency: 5,
    category: ['Data Engineering', 'Data Science', 'Python'],
  },
  {
    title: 'Spark',
    competency: 2,
    category: ['Data Engineering', 'Data Science'],
  },
  {
    title: 'PyTorch',
    competency: 4,
    category: ['Data Engineering', 'Data Science', 'Python'],
  },
  {
    title: 'Java',
    competency: 5,
    category: ['Languages'],
  },
  {
    title: 'Android (Java + Kotlin)',
    competency: 5,
    category: ['Languages'],
  },
  {
    title: 'Swift',
    competency: 5,
    category: ['Languages'],
  },
  {
    title: 'Swift UI',
    competency: 5,
    category: ['Tools', 'Languages'],
  },
  {
    title: 'UI Kit',
    competency: 3,
    category: ['Tools', 'Languages'],
  },
  {
    title: 'Sketch',
    competency: 2,
    category: ['Tools'],
  },
  {
    title: 'Figma',
    competency: 2,
    category: ['Tools'],
  },
  {
    title: 'Serverless',
    competency: 4,
    category: ['Tools', 'Web Development'],
  },
  {
    title: 'Lua',
    competency: 3,
    category: ['Languages'],
  },
  {
    title: 'C',
    competency: 4,
    category: ['Languages'],
  },
  {
    title: 'Computer Vision',
    competency: 5,
    category: ['Concepts'],
  },
  {
    title: 'Deep Learning',
    competency: 4,
    category: ['Concepts'],
  },
  {
    title: 'Reinforcement Learning',
    competency: 4,
    category: ['Concepts'],
  },
  {
    title: 'High-performance Computing (MPI, OMP, SIMD, SSE, AVX, etc.)',
    competency: 5,
    category: ['Concepts'],
  },
  {
    title: 'SLAM',
    competency: 4,
    category: ['Concepts'],
  },
  {
    title: 'PyDrake',
    competency: 3,
    category: ['Tools'],
  },
  {
    title: 'ROS',
    competency: 3,
    category: ['Tools'],
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
