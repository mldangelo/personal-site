const labels = [
  {
    title: 'Game Theory',
    category: ['Research'],
  },
  {
    title: 'Control Theory',
    category: ['Research'],
  },
  {
    title: 'Energy Markets',
    category: ['Research', 'Applications'],
  },
  {
    title: 'Mechanism Design',
    category: ['Research'],
  },
  {
    title: 'Stochastic Optimization',
    category: ['Methods'],
  },
  {
    title: 'Karma Economies',
    category: ['Tools'],
  },
  {
    title: 'Social Choice Theory',
    category: ['Research'],
  },
].map((label) => ({ ...label, category: label.category.sort() }));

// this is a list of colors that I like. The length should be === to the
// number of categories. Re-arrange this list until you find a pattern you like.
const colors = [
  '#3896e2',
  '#e47272',
  '#6968b3',
  '#40494e',
  '#515dd4',
  '#cc7b94',
  '#c3423f',
  '#d75858',
  '#747fff',
  '#64cb7b',
  '#37b1f5',
];

const categories = [...new Set(labels.flatMap(({ category }) => category))]
  .sort()
  .map((category, index) => ({
    name: category,
    color: colors[index],
  }));

export { labels, categories };
