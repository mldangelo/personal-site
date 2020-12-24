import { MemoryRouter } from 'react-router-dom'
import { render, screen } from '@testing-library/react';
import Index from './Index';

// See https://github.com/mswjs/msw

test('Renders index page', () => {
  render(<Index />, { wrapper: MemoryRouter });
  const linkElement = screen.getByText(/About this site/i);
  expect(linkElement).toBeInTheDocument();
});
