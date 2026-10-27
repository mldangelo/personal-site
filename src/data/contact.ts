import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faAngellist } from '@fortawesome/free-brands-svg-icons/faAngellist';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons/faFacebookF';
import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub';
import { faInstagram } from '@fortawesome/free-brands-svg-icons/faInstagram';
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons/faLinkedinIn';
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons/faEnvelope';

import profile from './profile.json';

export interface ContactItem {
  link: string;
  label: string;
  icon: IconDefinition;
}

const data: ContactItem[] = [
  {
    link: 'https://www.linkedin.com/in/saransh-vaidya-448789290/',
    label: 'LinkedIn',
    icon: faLinkedinIn,
  },
  {
    link: 'https://github.com/saranshvaidya0',
    label: 'GitHub',
    icon: faGithub,
  },
  {
    link: 'https://x.com/premvaidya750',
    label: 'X',
    icon: faTwitter,
  },
  {
    link: 'https://wellfound.com/u/saransh-vaidya',
    label: 'Angel List',
    icon: faAngellist,
  },
  {
    link: 'https://www.instagram.com/saranshvaidya_prem/',
    label: 'Instagram',
    icon: faInstagram,
  },
  {
    link: 'https://www.facebook.com/prem.vaidya.311',
    label: 'Facebook',
    icon: faFacebookF,
  },
  {
    // One public address, shared with the contact CTA and JSON-LD.
    link: `mailto:${profile.email}`,
    label: 'Email',
    icon: faEnvelope,
  },
];

export default data;
