import { smartQuotes } from '@/lib/typography';
import { AUTHOR_NAME } from '@/lib/utils';

import SiteHeader from './SiteHeader';

/**
 * The site header, with the one string it needs prepared ahead of time.
 *
 * This is a server component so that `smartQuotes` runs at build and reaches
 * the browser as text. Called from the client header instead, it took
 * `typography.ts` into the root layout's bundle, where the three `\p{L}`
 * classes it matches letters with are rewritten as literal Unicode ranges for
 * the oldest browser the production targets still name: 41 kB of JavaScript
 * on every page, to set one apostrophe.
 */
export default function Navigation() {
  return <SiteHeader name={smartQuotes(AUTHOR_NAME)} />;
}
