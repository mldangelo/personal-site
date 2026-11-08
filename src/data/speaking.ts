/**
 * Public appearances: panels, talks, and demos with an organiser's own record.
 *
 * The record is credible only if a reader can check it, so every entry links
 * the organiser's own page or post for the session, and it should name
 * Michael. Where an organiser's published lineup is stale, the entry says so
 * in a comment rather than linking something unofficial. Closed-door
 * sessions, run on behalf of OpenAI, are mentioned on the page but never
 * listed here.
 */

/**
 * The format as the organiser billed it. An Arsenal Lab is a hands-on tool
 * demonstration, not a talk; extend this union rather than stretch a label.
 */
export type AppearanceFormat = 'Panel' | 'Arsenal Lab' | 'Tech session';

export interface Appearance {
  /**
   * The session's own title, or the event's name when the session was a demo
   * of a tool or its host published no title.
   */
  title: string;
  format: AppearanceFormat;
  /** First day of the appearance, or of its event when no day is published. */
  date: string;
  /** City, as a reader would place the event. */
  place: string;
  /** What the title and format leave out: the host, the event, who else. */
  desc: string;
  /** The organiser's own record of the session, naming Michael. */
  link: string;
}

const appearances: Appearance[] = [
  // The EY host's post about Codex Day names Michael's tech session but gives
  // no title or day, so the entry takes the event's name and first day.
  {
    title: 'EY × OpenAI Codex Day 2026',
    format: 'Tech session',
    date: '2026-10-26',
    place: 'Bengaluru',
    desc: 'At EY’s two-day Codex event, held in person and online.',
    link: 'https://www.linkedin.com/posts/lince_incredible-momentum-at-ey-x-openai-codex-ugcPost-7521395817572638720-0Ycx/',
  },
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
  // Black Hat's listing still shows the lineup it published before the panel
  // and omits Michael, who was on it. It is the only official record of the
  // session, so it is linked anyway; the OWASP project page does not mention
  // the panel at all.
  {
    title:
      'Skill Issue: An Opening Panel for the OWASP Top 10 for Agentic Skills Initiative',
    format: 'Panel',
    date: '2026-08-05',
    place: 'Las Vegas',
    desc: 'The public launch of the OWASP Agentic Skills Top 10, during Black Hat USA.',
    link: 'https://blackhat.com/us-26/sponsored-sessions/schedule/index.html#skill-issue-an-opening-panel-for-the-owasp-top-10-for-agentic-skills-initiative-56078',
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
