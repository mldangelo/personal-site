export interface Route {
  label: string;
  path: string;
  index?: boolean;
}

const routes: Route[] = [
  {
    index: true,
    label: 'Gabriel Dias',
    path: '/',
  },
  {
    label: 'About',
    path: '/about',
  },
  {
    label: 'Resume',
    path: '/resume',
  },
  {
    label: 'Contact',
    path: '/contact',
  },
  {
    label: 'Projects',
    path: '/projects',
  },
];

export default routes;
