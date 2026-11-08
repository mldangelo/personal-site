/**
 * Selected appearances: panels, talks, and demos with a public record.
 *
 * The record is credible only if a reader can check it, so every entry links
 * the organiser's own account of the session, and that page should name
 * Michael. Exceptions and limitations are explained beside the entry.
 */

/**
 * The format as the organiser billed it. An Arsenal Lab is a hands-on tool
 * demonstration, not a talk; extend this union rather than stretch a label.
 */
export type AppearanceFormat = 'Panel' | 'Arsenal Lab' | 'Tech session';

export interface Appearance {
  /**
   * The session's own title, or the event's name when no title is available.
   */
  title: string;
  format: AppearanceFormat;
  /** First day of the appearance or its event, `YYYY-MM-DD`. */
  date: string;
  /** City, as a reader would place the event. */
  place: string;
  /** What the title and format leave out: the host, the event, who else. */
  desc: string;
  /** The organiser's public record, naming Michael. */
  link: string;
}

const appearances: Appearance[] = [
  // EY's post names Michael's tech session but not its title or day. The
  // date is the first day of the event; the location is the event's hub.
  // The post is on Lawrence's public profile rather than a session listing.
  {
    title: 'EY × OpenAI Codex Day 2026',
    format: 'Tech session',
    date: '2026-10-26',
    place: 'Bengaluru + online',
    desc: 'A technical session at EY’s two-day event on applied AI.',
    link: 'https://in.linkedin.com/in/lince',
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
