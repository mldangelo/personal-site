import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { MAIN_CONTENT_ID } from '@/components/Template/PageWrapper';
import NotFound from '../not-found';

describe('not found page', () => {
  it('provides a focusable target for the global skip link', () => {
    render(<NotFound />);

    expect(screen.getByRole('main')).toHaveAttribute('id', MAIN_CONTENT_ID);
    expect(screen.getByRole('main')).toHaveAttribute('tabindex', '-1');
  });
});
