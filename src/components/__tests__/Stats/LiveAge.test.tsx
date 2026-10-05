import { act, render, screen } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AGE_PRECISION_FULL, agePlaceholder } from '@/lib/telemetry';

import LiveAge from '../../Stats/LiveAge';

const INITIAL = '36.42';
const NOTE = 'as of 2026-07-31';

function subject() {
  return (
    <LiveAge initial={INITIAL} note={NOTE} precision={AGE_PRECISION_FULL} />
  );
}

function setReducedMotion(matches: boolean) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
  });
}

describe('LiveAge', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    setReducedMotion(false);
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      value: false,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders a real dated age with no JavaScript', () => {
    const html = renderToStaticMarkup(subject());

    expect(html).toContain(`>${INITIAL}<`);
    expect(html).toContain(NOTE);
    expect(html).not.toContain('--.');
    expect(html).toContain('data-live="false"');
  });

  it('upgrades to full precision and gives a non-color live cue', () => {
    render(subject());

    act(() => {
      vi.advanceTimersByTime(50);
    });

    const value = document.querySelector('.stat-readout-value');
    expect(value?.textContent).toMatch(
      new RegExp(`^\\d+\\.\\d{${AGE_PRECISION_FULL}}$`),
    );
    expect(value).toHaveAttribute('data-live', 'true');
    expect(screen.getByText('Live')).toHaveClass('stat-readout-note');
  });

  it('keeps the note line mounted across the client upgrade', () => {
    const { container } = render(subject());

    expect(container.querySelectorAll('.stat-readout-note')).toHaveLength(1);
    expect(screen.getByText('Live')).toBeInTheDocument();
  });

  it('keeps the snapshot and date under reduced motion', () => {
    setReducedMotion(true);
    render(subject());

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(document.querySelector('.stat-readout-value')).toHaveTextContent(
      INITIAL,
    );
    expect(document.querySelector('.stat-readout-value')).toHaveAttribute(
      'data-live',
      'false',
    );
    expect(screen.getByText(NOTE)).toBeInTheDocument();
    expect(screen.queryByText('Live')).not.toBeInTheDocument();
  });

  it('reserves the full-precision width', () => {
    render(subject());

    const value = document.querySelector('.stat-readout-value');
    const width = agePlaceholder(AGE_PRECISION_FULL).length;

    expect(value?.getAttribute('style')).toContain(
      `--readout-width: ${width}ch`,
    );
    expect(width).toBeGreaterThan(INITIAL.length);
  });
});
