import renderer from 'react-test-renderer';

import React from 'react';

import About from '../pages/About';
import Contact from '../pages/Contact';
import Index from '../pages/Index';
import NotFound from '../pages/NotFound';
import Projects from '../pages/Projects';
import Resume from '../pages/Resume';
import Stats from '../pages/Stats';

const pages = [
  {
    route: '/',
    heading: 'About this site',
    component: Index,
  },
  {
    route: '/about',
    heading: 'About Me',
    component: About,
  },
  {
    route: '/projects',
    heading: 'Projects',
    component: Projects,
  },
  {
    route: '/stats',
    heading: 'Stats',
    component: Stats,
  },
  {
    route: '/contact',
    heading: 'Contact',
    component: Contact,
  },
  {
    route: '/resume',
    heading: 'Resume',
    component: Resume,
  },
];

describe('App', () => {
  pages.forEach((page) => {
    it(`Renders ${page.route} Component`, () => {
      const tree = renderer.create(<page.component />).toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
