import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub';
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons/faLinkedinIn';
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons/faEnvelope';
// See https://fontawesome.com/icons?d=gallery&s=brands,regular&m=free
// to add other icons.

const data = [
  {
    link: 'https://github.com/clairefram',
    label: 'Github',
    icon: faGithub,
  },
  {
    link: 'https://www.linkedin.com/in/clairefram/',
    label: 'LinkedIn',
    icon: faLinkedinIn,
  },
  {
    link: 'https://x.com/claire_fram',
    label: 'Twitter',
    icon: faTwitter,
  },
  {
    link: 'mailto:claire@diagonal.works',
    label: 'Email',
    icon: faEnvelope,
  },
];

export default data;
