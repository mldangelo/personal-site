import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { RESUME_JSON_PATH } from '@/lib/resumeJson';
import { THEME_CHOICE_ATTRIBUTE } from '@/lib/theme';
import ResumePage from '../resume/page';

/** The stylesheet that lays out and gates the header controls, from source. */
const RESUME_CSS = readFileSync(
  join(process.cwd(), 'app/styles/pages/resume.css'),
  'utf8',
);

/**
 * The machine-readable résumé is only useful if the page it describes points at
 * it, the way `/writing` points at the RSS feed.
 */
describe('resume JSON affordance', () => {
  it('links the machine-readable résumé from the title row', () => {
    const { container } = render(<ResumePage />);
    const link = screen.getByRole('link', { name: 'JSON Resume' });

    const href = link.getAttribute('href');

    expect(href).toBe(`..${RESUME_JSON_PATH}`);
    expect(link).toHaveTextContent('JSON');
    // File-like route: no trailing slash, even under `trailingSlash: true`.
    expect(href).not.toMatch(/\/$/);
    // Exercise the href rendered by ResumePage, rather than a verifier fixture:
    // it must stay within a repository base path as well as work at the root.
    expect(new URL(href!, 'https://example.com/resume/').pathname).toBe(
      '/resume.json',
    );
    expect(
      new URL(href!, 'https://example.com/personal-site/resume/').pathname,
    ).toBe('/personal-site/resume.json');

    const row = container.querySelector('.resume-header-row');
    expect(row).not.toBeNull();
    expect(row?.querySelector('h1')).toHaveTextContent('Resume');
    expect(row?.contains(link)).toBe(true);
  });
});

/**
 * A print stylesheet nobody can find is not much of a feature: the page has to
 * say that it prints, in the same place it offers the JSON.
 */
describe('resume print control', () => {
  const root = document.documentElement;

  afterEach(() => {
    root.removeAttribute(THEME_CHOICE_ATTRIBUTE);
    vi.restoreAllMocks();
  });

  /** Applies the real stylesheet for one test; returns its teardown. */
  function withResumeStyles(): () => void {
    const style = document.createElement('style');
    style.textContent = RESUME_CSS;
    document.head.appendChild(style);

    return () => style.remove();
  }

  // Role queries skip what a stylesheet hides, so these find a control only
  // while a reader, sighted or not, is actually offered it.
  const printButton = () =>
    screen.queryByRole('button', { name: 'Print / PDF' });
  const jsonLink = () => screen.queryByRole('link', { name: 'JSON Resume' });

  it('sits beside the JSON link, ahead of it', () => {
    const { container } = render(<ResumePage />);
    const print = printButton();
    const json = jsonLink();
    const row = container.querySelector('.resume-header-row');

    if (!print || !json) throw new Error('header controls not rendered');

    // One group, so the two wrap under the title together instead of the
    // narrower one being stranded beside it.
    expect(print.parentElement).toBe(json.parentElement);
    expect(row?.contains(print)).toBe(true);
    // What most readers came for is reached first, by eye and by Tab.
    expect(
      print.compareDocumentPosition(json) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it('opens the print dialog from the page', () => {
    const print = vi.spyOn(window, 'print').mockImplementation(() => {});
    render(<ResumePage />);

    const button = printButton();
    if (!button) throw new Error('no print control rendered');
    fireEvent.click(button);

    expect(print).toHaveBeenCalledTimes(1);
  });

  it('is offered only once the pre-paint bootstrap proves scripts ran', () => {
    // Without JavaScript the button is inert, so it must not be shown. The JSON
    // link beside it is a plain anchor and has to survive either way.
    const removeStyles = withResumeStyles();

    try {
      render(<ResumePage />);

      expect(printButton()).toBeNull();
      expect(jsonLink()).toBeVisible();

      root.setAttribute(THEME_CHOICE_ATTRIBUTE, 'system');

      expect(printButton()).toBeVisible();
      expect(jsonLink()).toBeVisible();
    } finally {
      removeStyles();
    }
  });

  it('gives both controls a 44px target in sentence case', () => {
    // The JSON chip was 35px of uppercase tracked mono. jsdom lays nothing
    // out, so the floor the stylesheet declares is what there is to hold.
    const removeStyles = withResumeStyles();
    root.setAttribute(THEME_CHOICE_ATTRIBUTE, 'system');

    try {
      render(<ResumePage />);

      for (const control of [printButton(), jsonLink()]) {
        if (!control) throw new Error('header control not offered');
        const { minHeight, textTransform } = window.getComputedStyle(control);

        // jsdom resolves `rem` against a 16px root today; take either form
        // rather than pin which one an upgrade happens to report.
        expect(minHeight).toMatch(/^[\d.]+(?:px|rem)$/);
        expect(
          Number.parseFloat(minHeight) * (minHeight.endsWith('rem') ? 16 : 1),
        ).toBeGreaterThanOrEqual(44);
        expect(textTransform).not.toBe('uppercase');
      }
    } finally {
      removeStyles();
    }
  });
});
