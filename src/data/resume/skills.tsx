export interface Skill {
  title: string;
  competency: number;
  category: string[];
}

const skills: Skill[] = [
  {
    title: 'Java',
    competency: 5,
    category: ['Web Development', 'Languages'],
  },
  {
    title: 'AWS',
    competency: 5,
    category: ['Web Development', 'Tools'],
  },
  {
    title: 'Spring',
    competency: 4,
    category: ['Web Development', 'Java'],
  },
  {
    title: 'Postgres',
    competency: 4,
    category: ['Web Development', 'Databases'],
  },
  {
    title: 'MySQL',
    competency: 4,
    category: ['Web Development', 'Databases'],
  },
  {
    title: 'TypeScript',
    competency: 3,
    category: ['Web Development', 'Languages'],
  },
  {
    title: 'Vue',
    competency: 3,
    category: ['Web Development', 'JavaScript'],
  },
  {
    title: 'Databricks',
    competency: 3,
    category: ['Data Engineering', 'ML Engineering'],
  },
  {
    title: 'Python',
    competency: 5,
    category: ['Languages', 'Python', 'ML Engineering'],
  },
  {
    title: 'Machine Learning',
    competency: 4,
    category: ['ML Engineering'],
  },
  {
    title: 'Stripe',
    competency: 3,
    category: ['Web Development', 'Tools'],
  },
  {
    title: 'Auth0/Okta',
    competency: 3,
    category: ['Web Development', 'Tools'],
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

export interface Category {
  name: string;
  color: string;
}

const categories: Category[] = [
  ...new Set(
    skills
      .flatMap((skill) => skill.category)
      .sort()
      .map((category, index) => ({
        name: category,
        color: colors[index],
      }))
  ),
];

export { categories, skills };
