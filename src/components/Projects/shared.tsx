/**
 * How a register row announces an outbound destination.
 */

/** Spoken as part of the link name, since the ↗ glyph is decorative. */
export const NEW_TAB_SUFFIX = '(opens in a new tab)';

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
