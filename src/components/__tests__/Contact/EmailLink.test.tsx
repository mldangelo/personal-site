import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CONTACT_EMAIL } from '@/lib/utils';

import EmailLink from '../../Contact/EmailLink';

describe('EmailLink', () => {
  it('renders the full email address', () => {
    render(<EmailLink />);

    expect(
      screen.getByRole('link', { name: new RegExp(CONTACT_EMAIL) }),
    ).toBeInTheDocument();
  });

  it('renders as a link element', () => {
    render(<EmailLink />);

    const link = screen.getByRole('link');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', `mailto:${CONTACT_EMAIL}`);
  });
});
