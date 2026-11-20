import { AUTHOR_NAME } from '@/lib/utils';

interface Route {
  label: string;
  path: string;
  index?: boolean;
  primary?: boolean;
}

const routes: Route[] = [
  {
    index: true,
    label: AUTHOR_NAME,
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
    label: 'Projects',
    path: '/projects',
  },
  {
    label: 'Writing',
    path: '/writing',
  },
  {
    label: 'Speaking',
    path: '/speaking',
  },
  {
    label: 'Stats',
    path: '/stats',
    primary: false,
  },
  {
    label: 'Contact',
    path: '/contact',
  },
];

export default routes;
