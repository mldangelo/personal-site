export interface Route {
  label: string;
  path: string;
  index?: boolean;
  /** Id of the home page section this route jumps to */
  sectionId?: string;
}

const routes: Route[] = [
  {
    index: true,
    label: 'Hang Hang',
    path: '/',
  },
  {
    label: 'About',
    path: '/#about',
    sectionId: 'about',
  },
  {
    label: 'Resume',
    path: '/#resume',
    sectionId: 'resume',
  },
  {
    label: 'Projects',
    path: '/#projects',
    sectionId: 'projects',
  },
  {
    label: 'Contact',
    path: '/#contact',
    sectionId: 'contact',
  },
];

export default routes;
