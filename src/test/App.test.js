// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';

import React from 'react';
import { BrowserRouter } from 'react-router-dom';

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

// Adds router to Page context and allows us to navigate to the
// correct page. See:
// https://testing-library.com/docs/example-react-router/#reducing-boilerplate
const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(ui, { wrapper: BrowserRouter });
};

test('Renders 404 Page Component', () => {
  renderWithRouter(<NotFound />);
  const linkElement = screen.getByText(/Page Not Found/i);
  expect(linkElement).toBeInTheDocument();
});

const checkPageComponent = async (page) => {
  test(`Renders ${page.route} Component`, () => {
    window.scrollTo = () => {}; // TODO mock this later
    renderWithRouter(<page.component />, { route: page.route });
    const linkElement = screen.getByTestId('heading');
    expect(linkElement).toHaveTextContent(page.heading);
  });
};

pages.forEach((page) => checkPageComponent(page));
