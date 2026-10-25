import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons/faFacebookF';
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub';
import { faInstagram } from '@fortawesome/free-brands-svg-icons/faInstagram';
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons/faLinkedinIn';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons/faXTwitter';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons/faEnvelope';

import profile from './profile.json';

export type ContactId =
  | 'github'
  | 'linkedin'
  | 'x'
  | 'email'
  | 'wellfound'
  | 'instagram'
  | 'facebook';

export interface ContactItem {
  id: ContactId;
  link: string;
  /**
   * What the destination calls itself today. The footer prints it as the link
   * text; the icons on `/contact` speak it.
   */
  label: string;
  /**
   * The destination's own mark, for the icons on `/contact`. Leave it out when
   * the icon set has none: the entry is then listed by name in the footer and
   * left out of the icons. A stand-in is worse than a gap — X wore the Twitter
   * bird here, and Wellfound the AngelList hand, long after each was renamed.
   */
  icon?: IconDefinition;
}

/**
 * Where to find the author, in the order every consumer lists them: the four
 * destinations people actually use, then the rest. The footer renders all of
 * them as text links; `/contact` draws the ones that have a mark, bar the
 * address it prints itself; and `/resume.json` and the JSON-LD `sameAs` take
 * every link but the `mailto:`.
 */
const data: ContactItem[] = [
  {
    id: 'github',
    link: 'https://github.com/mldangelo',
    label: 'GitHub',
    icon: faGithub,
  },
  {
    id: 'linkedin',
    link: 'https://www.linkedin.com/in/michaelldangelo',
    label: 'LinkedIn',
    icon: faLinkedinIn,
  },
  {
    id: 'x',
    link: 'https://x.com/dangelosaurus',
    label: 'X',
    icon: faXTwitter,
  },
  {
    id: 'email',
    // One public address, shared with the contact CTA and JSON-LD.
    link: `mailto:${profile.email}`,
    label: 'Email',
    icon: faEnvelope,
  },
  {
    id: 'wellfound',
    // Was "Angel List" at angel.co/michael-d-angelo, which now redirects here.
    // Font Awesome has the AngelList hand but no Wellfound mark, so no icon.
    link: 'https://wellfound.com/p/michael-d-angelo',
    label: 'Wellfound',
  },
  {
    id: 'instagram',
    link: 'https://www.instagram.com/dangelosaurus/',
    label: 'Instagram',
    icon: faInstagram,
  },
  {
    id: 'facebook',
    link: 'https://facebook.com/d',
    label: 'Facebook',
    icon: faFacebookF,
  },
];

export default data;
