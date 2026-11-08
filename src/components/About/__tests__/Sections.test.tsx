import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { aboutMarkdown } from '@/data/about';
import { createHeadingId } from '@/lib/anchors';
import AboutContent from '../Sections';

const titles = Array.from(
  aboutMarkdown.matchAll(/^# (.+)$/gm),
  (match) => match[1],
).filter((title) => title !== 'Intro');

const MARKDOWN = `# Intro

Hello from the intro.

# Some history

- We subscribed to AOL in 1995.
- At 7, I discovered the mini-games.
- I have a list of ideas.

# I like

- Running

# Websites from people I admire

- [Example](https://example.com)`;

function sectionNav() {
  return screen.getByRole('navigation', { name: 'About sections' });
}

describe('AboutContent', () => {
  it('renders the intro unheaded and gives each section its variant', () => {
    const { container } = render(<AboutContent markdown={MARKDOWN} />);

    expect(screen.getByText('Hello from the intro.')).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Intro' }),
    ).not.toBeInTheDocument();

    const sections = container.querySelectorAll('.about-section');

    expect(sections[0]).toHaveClass('about-section--log');
    expect(sections[1]).toHaveClass('about-section--compact');
    expect(sections[2]).toHaveClass('about-section--links');
  });

  it('pairs each real section with a nav link and marks the first current', () => {
    render(<AboutContent markdown={aboutMarkdown} />);

    const links = within(sectionNav()).getAllByRole('link');

    expect(links.map((link) => link.textContent)).toEqual(titles);
    expect(links.map((link) => link.getAttribute('href'))).toEqual(
      titles.map((title) => `#${createHeadingId(title)}`),
    );
    expect(links.map((link) => link.getAttribute('aria-current'))).toEqual(
      titles.map((_, index) => (index === 0 ? 'location' : null)),
    );
  });

  it('reads markers into the gutter of log entries', () => {
    const { container } = render(<AboutContent markdown={MARKDOWN} />);
    const [embedded, leading, undated] = Array.from(
      container.querySelectorAll('.log-entry'),
      (entry) => ({
        marker: entry.querySelector('.log-entry-marker'),
        body: entry.querySelector('.log-entry-body')?.textContent,
      }),
    );

    // An embedded marker repeats the prose, so it is hidden from a screen
    // reader, which reads the full fact from the body.
    expect(embedded.marker).toHaveTextContent('1995');
    expect(embedded.marker).toHaveAttribute('aria-hidden', 'true');
    expect(embedded.body).toBe('We subscribed to AOL in 1995.');

    // A leading marker is lifted out, so it stays exposed.
    expect(leading.marker).toHaveTextContent('Age 7');
    expect(leading.marker).not.toHaveAttribute('aria-hidden');
    expect(leading.body).toBe('I discovered the mini-games.');

    expect(undated.marker).toBeEmptyDOMElement();
  });

  // A heading renamed in the data without its `sectionVariants` key raises
  // nothing and quietly renders as a plain list.
  it('matches every real section to a layout, by its title as authored', () => {
    const { container } = render(<AboutContent markdown={aboutMarkdown} />);
    const sections = container.querySelectorAll('.about-section');

    expect(sections).toHaveLength(titles.length);
    for (const section of sections) {
      expect(section.className).toMatch(/about-section--/);
    }
  });

  it('sets typographic quotes in the real prose', () => {
    const { container } = render(<AboutContent markdown={aboutMarkdown} />);

    expect(container.textContent).not.toMatch(/['"]/);
  });

  it('leaves code as it was typed', () => {
    const { container } = render(
      <AboutContent
        markdown={[
          '# Intro',
          '',
          "It's `don't` here.",
          '',
          '```',
          "const quote = 'x';",
          '```',
        ].join('\n')}
      />,
    );

    expect(container.querySelector('p')).toHaveTextContent("It’s don't here.");
    expect(container.querySelector('pre')).toHaveTextContent(
      "const quote = 'x';",
    );
  });

  it('reads a marker from an entry whose words carry an apostrophe', () => {
    const { container } = render(
      <AboutContent
        markdown={`# Intro

Lead paragraph.

# Some history

- When I was 12, I didn't sleep.
- We didn't have a computer in 1993.`}
      />,
    );

    // The gutter reads typeset text, and the remainder keeps its apostrophe.
    expect(
      Array.from(container.querySelectorAll('.log-entry'), (entry) => [
        entry.querySelector('.log-entry-marker')?.textContent,
        entry.querySelector('.log-entry-body')?.textContent,
      ]),
    ).toEqual([
      ['Age 12', 'I didn’t sleep.'],
      ['1993', 'We didn’t have a computer in 1993.'],
    ]);
  });

  it('prints a title the same way in the nav and above its section', () => {
    render(
      <AboutContent
        markdown={`# Intro

Lead paragraph.

# Michael's notes

- A note.`}
      />,
    );

    const name = 'Michael’s notes';

    // Typeset once for both, while the id is read from the title as typed.
    expect(screen.getByRole('heading', { name })).toHaveAttribute(
      'id',
      'michaels-notes',
    );
    expect(within(sectionNav()).getByRole('link', { name })).toHaveAttribute(
      'href',
      '#michaels-notes',
    );
  });

  // A heading's own link is for copying its address, so only the nav asks for
  // the animated jump.
  it('scrolls smoothly from the nav, and not from a heading link', () => {
    const SMOOTH = 'data-smooth-scroll';

    window.history.replaceState({}, '', '/about/');
    window.dispatchEvent(new Event('scrollend'));

    render(<AboutContent markdown={aboutMarkdown} />);

    within(screen.getByRole('heading', { name: titles[1] }))
      .getByRole('link')
      .click();
    expect(document.documentElement).not.toHaveAttribute(SMOOTH);

    within(sectionNav()).getByRole('link', { name: titles[1] }).click();
    expect(document.documentElement).toHaveAttribute(SMOOTH);

    window.dispatchEvent(new Event('scrollend'));
    expect(document.documentElement).not.toHaveAttribute(SMOOTH);
  });
});
