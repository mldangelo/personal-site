import { fireEvent, render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import PrintButton from '../../Template/PrintButton';

describe('PrintButton', () => {
  const print = vi.fn();

  beforeEach(() => {
    // jsdom's own `window.print` only reports that it is not implemented.
    vi.spyOn(window, 'print').mockImplementation(print);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    print.mockReset();
  });

  it('opens the print dialog when pressed, and not before', () => {
    render(<PrintButton>Print / PDF</PrintButton>);

    expect(print).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Print / PDF' }));

    expect(print).toHaveBeenCalledTimes(1);
  });

  it('is a real button named by the label a reader sees', () => {
    render(<PrintButton>Print / PDF</PrintButton>);

    const button = screen.getByRole('button');

    expect(button.tagName).toBe('BUTTON');
    // Never a submit control, wherever it is placed.
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAccessibleName('Print / PDF');
    expect(button).toHaveTextContent('Print / PDF');
    expect(button).toBeEnabled();
  });

  it('ships in the server markup instead of appearing on hydration', () => {
    // A control that waits for mount leaves a hole in the static HTML and
    // shifts the row it lands in. The no-JavaScript case is the stylesheet's
    // job, not a reason to render nothing.
    const html = renderToStaticMarkup(
      <PrintButton className="resume-print-button">Print / PDF</PrintButton>,
    );

    expect(html).toBe(
      '<button type="button" class="resume-print-button">Print / PDF</button>',
    );
  });
});
