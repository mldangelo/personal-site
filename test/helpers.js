const randomString = (length) => {
  const x = 36 ** (length + 1);
  const y = 36 ** length;
  return Math.round(x - (Math.random() * y)).toString(36).slice(1);
};

const pages = [
  {
    route: '/',
    title: 'Joe Shakely',
    heading: 'ABOUT THIS SITE',
  },
  {
    route: '/about',
    title: 'About | Joe Shakely',
    heading: 'ABOUT ME',
  },
  {
    route: '/projects',
    title: 'Projects | Joe Shakely',
    heading: 'PROJECTS',
  },
  {
    route: '/stats',
    title: 'Stats | Joe Shakely',
    heading: 'STATS',
  },
  {
    route: '/contact',
    title: 'Contact | Joe Shakely',
    heading: 'CONTACT',
  },
];

export { pages, randomString };
