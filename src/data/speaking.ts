/**
 * Public appearances: panels, talks, and demos with an organiser's listing.
 *
 * The record is credible only if a reader can check it, so every entry links
 * the organiser's own page, and that page must name Michael — a listing that
 * names only the other panelists is not evidence of anything. Closed-door
 * sessions, run on behalf of OpenAI, are mentioned on the page but never
 * listed here.
 */

/**
 * The format as the organiser billed it. An Arsenal Lab is a hands-on tool
 * demonstration, not a talk; extend this union rather than stretch a label.
 */
export type AppearanceFormat = 'Panel' | 'Arsenal Lab';

export interface Appearance {
  /**
   * The session's own title, or the event's name when the session was a demo
   * of a tool rather than a titled talk.
   */
  title: string;
  format: AppearanceFormat;
  /** First day of the appearance, `YYYY-MM-DD`. */
  date: string;
  /** City, as a reader would place the event. */
  place: string;
  /** What the title and format leave out: the host, the event, who else. */
  desc: string;
  /** The organiser's listing for the session, naming Michael. */
  link: string;
}

const appearances: Appearance[] = [
  {
    title: 'The AI Security Panel: Unfiltered',
    format: 'Panel',
    date: '2026-10-14',
    place: 'San Francisco',
    desc: 'Hosted by Snyk the day before the AI Security Summit.',
    link: 'https://luma.com/snyk-y9pl',
  },
  {
    title: 'The Compounding Intelligence Race',
    format: 'Panel',
    date: '2026-10-06',
    place: 'New York',
    desc: "At ScaleUp:AI, Insight Partners' AI conference.",
    link: 'https://events.bizzabo.com/815197/agenda/session/1966885',
  },
  // SecTor ran two Arsenal Lab slots and two Arsenal station demos; this links
  // the first. Black Hat's presenter-page anchors resolve only through
  // JavaScript, so the schedule entry is the link that shows the name.
  {
    title: 'SecTor',
    format: 'Arsenal Lab',
    date: '2025-10-01',
    place: 'Toronto',
    desc: "Live demos of Promptfoo's open-source AI red teaming, with the Promptfoo team.",
    link: 'https://blackhat.com/archive/sector/2025/arsenal/schedule/index.html#promptfoo-47729',
  },
  {
    title: 'Black Hat USA',
    format: 'Arsenal Lab',
    date: '2025-08-06',
    place: 'Las Vegas',
    desc: "Live demos of Promptfoo's open-source AI red teaming, with the Promptfoo team.",
    link: 'https://blackhat.com/archive/usa/2025/arsenal/schedule/index.html#promptfoo-44648',
  },
];

/**
 * Newest first. Derived rather than relying on source order, the way the
 * résumé orders roles; ISO dates compare correctly as strings.
 */
export function getAppearances(): Appearance[] {
  return [...appearances].sort((a, b) => b.date.localeCompare(a.date));
}
