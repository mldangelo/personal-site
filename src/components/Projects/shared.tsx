/**
 * The two things a register row and an archive card have to agree on: how an
 * outbound destination is announced, and how an entry with no destination is
 * marked.
 */

/** Spoken as part of the link name, since the ↗ glyph is decorative. */
export const NEW_TAB_SUFFIX = '(opens in a new tab)';

/** What a card says when there is nothing to click. */
export const NO_LINK_LABEL = 'No live link';

/**
 * Every project destination is off-site, so each opens in a new tab and says
 * so in its accessible name.
 */
export function externalLinkProps(href: string, title: string) {
  return {
    href,
    target: '_blank',
    rel: 'noopener noreferrer',
    'aria-label': `${title} ${NEW_TAB_SUFFIX}`,
  } as const;
}

/**
 * An entry with no destination is labelled rather than left looking like a
 * card whose click does nothing.
 */
export function NoLinkNote() {
  return <span className="project-note">{NO_LINK_LABEL}</span>;
}
