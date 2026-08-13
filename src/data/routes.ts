import { AUTHOR_NAME } from '@/lib/utils';

export interface Route {
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
  // Was labelled "Archive" and kept out of the nav, which left the register of
  // shipped work reachable only through the footer — and `/contact` hides the
  // footer, so from there it was unreachable entirely.
  {
    label: 'Projects',
    path: '/projects',
  },
  {
    label: 'Writing',
    path: '/writing',
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
