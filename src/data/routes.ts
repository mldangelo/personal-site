import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {
  faChartBar,
  faEnvelope,
  faFileAlt,
  faProjectDiagram,
  faUser,
} from '@fortawesome/free-solid-svg-icons';

export interface Route {
  label: string;
  path: string;
  index?: boolean;
  icon?: IconDefinition;
}

const routes: Route[] = [
  {
    index: true,
    label: "Michael D'Angelo",
    path: '/',
  },
  {
    label: 'About',
    path: '/about',
    icon: faUser,
  },
  {
    label: 'Resume',
    path: '/resume',
    icon: faFileAlt,
  },
  {
    label: 'Projects',
    path: '/projects',
    icon: faProjectDiagram,
  },
  {
    label: 'Stats',
    path: '/stats',
    icon: faChartBar,
  },
  {
    label: 'Contact',
    path: '/contact',
    icon: faEnvelope,
  },
];

export default routes;
