// TODO: Add Athletic Skills, Office Skills,
// Data Engineering, Data Science, ML Engineering, ... ?

const skills = [
  {
    title: "HTML/CSS/SCSS",
    competency: 95,
    category: ["Frontend"],
  },
  {
    title: "ReactJS",
    competency: 90,
    category: ["Frontend"],
  },
  {
    title: "NextJS",
    competency: 90,
    category: ["Frontend"],
  },
  {
    title: "GatsbyJS",
    competency: 90,
    category: ["Frontend"],
  },
  {
    title: "Angular",
    competency: 80,
    category: ["Frontend"],
  },
  {
    title: "JavaScript",
    competency: 70,
    category: ["Frontend"],
  },
  {
    title: "TypeScript",
    competency: 30,
    category: ["Frontend"],
  },
  {
    title: "HighchartsJS",
    competency: 80,
    category: ["Frontend"],
  },
  {
    title: "D3JS",
    competency: 30,
    category: ["Frontend"],
  },
  {
    title: "NodeJS",
    competency: 94,
    category: ["Backend"],
  },
  {
    title: "WordPress/Woocommerce",
    competency: 94,
    category: ["Backend"],
  },
  {
    title: "PHP",
    competency: 60,
    category: ["Backend"],
  },
  {
    title: "Djaongo/Python",
    competency: 20,
    category: ["Backend"],
  },
  {
    title: "MySQL",
    competency: 70,
    category: ["Databases"],
  },
  {
    title: "MongoDB",
    competency: 70,
    category: ["Databases"],
  },
  {
    title: "Git & Github",
    competency: 80,
    category: ["Tools"],
  },
  {
    title: "AWS",
    competency: 40,
    category: ["Tools"],
  },
  {
    title: "Heroku",
    competency: 80,
    category: ["Tools"],
  },
  {
    title: "Docker & Kubernetes",
    competency: 30,
    category: ["Tools"],
  },
  {
    title: "Vercel",
    competency: 80,
    category: ["Tools"],
  },
  {
    title: "Netlify",
    competency: 80,
    category: ["Tools"],
  },
].map((skill) => ({ ...skill, category: skill.category.sort() }));

// this is a list of colors that I like. The length should be == to the
// number of categories. Re-arrange this list until you find a pattern you like.
const colors = [
  "#6968b3",
  "#37b1f5",
  "#40494e",
  "#515dd4",
  "#e47272",
  "#cc7b94",
  "#3896e2",
  "#c3423f",
  "#d75858",
  "#747fff",
  "#64cb7b",
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
