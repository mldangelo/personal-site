const randomString = (length) => {
  const x = 36 ** (length + 1);
  const y = 36 ** length;
  return Math.round(x - (Math.random() * y)).toString(36).slice(1);
};

const pages = [
  {
    route: '/',
    title: 'Casillas Law Group',
    heading: 'ABOUT THIS SITE',
  },
  {
    route: '/about',
    title: 'About | Casillas Law Group',
    heading: 'ABOUT ME',
  },
  {
    route: '/projects',
    title: 'Projects | Casillas Law Group',
    heading: 'PROJECTS',
  },
  {
    route: '/stats',
    title: 'Stats | Casillas Law Group',
    heading: 'STATS',
  },
  {
    route: '/contact',
    title: 'Contact | Casillas Law Group',
    heading: 'CONTACT',
  },
];

export { pages, randomString };
