import { AUTHOR_NAME } from '@/lib/utils';

export interface Route {
  label: string;
  path: string;
  index?: boolean;
  primary?: boolean;
  external?: boolean;
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
    label: 'Photography',
    path: 'https://vsco.co/kalyan-devv/gallery',
    external: true,
    primary: false,
  },
  {
    label: 'Contact',
    path: '/contact',
  },
  {
    label: 'Archive',
    path: '/projects',
    primary: false,
  },
];

export default routes;
