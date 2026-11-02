import { render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';

import { AGE_PRECISION_FULL, ageAt } from '@/lib/telemetry';

import LiveAge from '../../Stats/LiveAge';

const INITIAL = '36.42';
const NOTE = 'as of 2026-07-31';

const subject = () => (
  <LiveAge initial={INITIAL} note={NOTE} precision={AGE_PRECISION_FULL} />
);

function setReducedMotion(matches: boolean) {
  window.matchMedia = (() => ({ matches })) as unknown as typeof matchMedia;
}

// The timer itself is `useLiveAge`'s and is tested there. These cover the note
// line and reserved width around it, and that reduced motion reaches the hook.
describe('LiveAge', () => {
  it('renders a real dated age with no JavaScript, reserving the final width', () => {
    const html = renderToStaticMarkup(subject());
    const width = ageAt(Date.now(), AGE_PRECISION_FULL).length;

    expect(html).toContain(`>${INITIAL}<`);
    expect(html).toContain(NOTE);
    expect(html).toContain('data-live="false"');
    expect(html).toContain(`--readout-width:${width}ch`);
  });

  it('swaps the note for a non-colour live cue, in the same mounted line', () => {
    setReducedMotion(false);

    const { container } = render(subject());

    expect(screen.getByText('Live')).toBeInTheDocument();
    expect(container.children).toHaveLength(2);
  });

  it('keeps the snapshot and its date under reduced motion', () => {
    setReducedMotion(true);

    const { container } = render(subject());

    expect(container).toHaveTextContent(`${INITIAL}${NOTE}`);
  });
});
