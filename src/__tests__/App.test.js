/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import '@testing-library/react';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import App from '../App';

const jsonMock = jest.fn(() => Promise.resolve({}));

beforeAll(() => {
  // Mock scrollTo
  window.scrollTo = jest.fn();
  // Mock fetch
  global.fetch = jest.fn(() => Promise.resolve({
    json: jsonMock,
  }));
});

describe('renders the app', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('should render the app', async () => {
    expect.assertions(2);
    expect(document.getElementById('root')).toBeInTheDocument();
    expect(document.title).toContain('Marius Mercier');
  });

  it('should render the title', async () => {
    expect.assertions(1);
    expect(document.title).toContain('Marius Mercier');
  });

  it('can navigate to /about', async () => {
    expect.assertions(4);
    const aboutLink = document.querySelector('#header > nav > ul > li:nth-child(1) > a');
    expect(aboutLink).toBeInTheDocument();
    await act(async () => {
      await aboutLink.click();
    });
    expect(document.title).toContain('Marius Mercier');
    expect(window.location.pathname).toBe('/');
    expect(window.scrollTo).toHaveBeenNthCalledWith(1, 0, 0);
  });

  it('can navigate to /resume', async () => {
    expect.assertions(3);
    const resumeLink = document.querySelector('#header > nav > ul > li:nth-child(2) > a');
    expect(resumeLink).toBeInTheDocument();
    await act(async () => {
      await resumeLink.click();
    });
    expect(document.title).toContain('Resume |');
    expect(window.location.pathname).toBe('/resume');
  });

  it('can navigate to /publications', async () => {
    expect.assertions(3);
    const publicationsLink = document.querySelector('#header > nav > ul > li:nth-child(3) > a');
    expect(publicationsLink).toBeInTheDocument();
    await act(async () => {
      await publicationsLink.click();
    });
    expect(document.title).toContain('Publications |');
    expect(window.location.pathname).toBe('/publications');
  });

  it('can navigate to /stats', async () => {
    expect.assertions(5);
    const statsLink = document.querySelector('#header > nav > ul > li:nth-child(5) > a');
    expect(statsLink).toBeInTheDocument();
    await act(async () => {
      await statsLink.click();
    });
    expect(document.title).toContain('Stats |');
    expect(window.location.pathname).toBe('/stats');
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(jsonMock).toHaveBeenCalledTimes(1);
  });

  it('can navigate to /contact', async () => {
    expect.assertions(3);
    const contactLink = document.querySelector('#header > nav > ul > li:nth-child(6) > a');
    expect(contactLink).toBeInTheDocument();
    await act(async () => {
      await contactLink.click();
    });
    expect(document.title).toContain('Contact |');
    expect(window.location.pathname).toBe('/contact');
  });
});
