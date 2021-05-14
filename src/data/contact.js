import { faGithub } from '@fortawesome/free-brands-svg-icons/faGithub';
// import { faFacebookF } from '@fortawesome/free-brands-svg-icons/faFacebookF';
// import { faInstagram } from '@fortawesome/free-brands-svg-icons/faInstagram';
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons/faLinkedinIn';
// import { faAngellist } from '@fortawesome/free-brands-svg-icons/faAngellist';
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons/faEnvelope';
import { faGoogle } from '@fortawesome/free-brands-svg-icons/faGoogle';
import { faResearchgate } from '@fortawesome/free-brands-svg-icons/faResearchgate';
import { faQuora, faTelegram } from '@fortawesome/free-brands-svg-icons';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';

// See https://fontawesome.com/icons?d=gallery&s=brands,regular&m=free
// to add other icons.

const data = [
  {
    link: 'https://github.com/DhruvDoshi',
    label: 'Github',
    icon: faGithub,
  },
  // {
  //   link: 'https://facebook.com/md',
  //   label: 'Facebook',
  //   icon: faFacebookF,
  // },
  // {
  //   link: 'https://www.instagram.com/dangelosaurus/',
  //   label: 'Instagram',
  //   icon: faInstagram,
  // },
  {
    link: 'https://www.linkedin.com/in/dhruvdoshi25071999',
    label: 'LinkedIn',
    icon: faLinkedinIn,
  },
  // {
  //   link: 'https://angel.co/michael-d-angelo',
  //   label: 'Angel List',
  //   icon: faAngellist,
  // },
  {
    link: 'https://twitter.com/dhruv25071999',
    label: 'Twitter',
    icon: faTwitter,
  },
  {
    link: 'https://www.quora.com/profile/Dhruv-Doshi-18',
    label: 'Quora',
    icon: faQuora,
  },
  {
    link: 'https://scholar.google.com/citations?user=Ri3ZDcIAAAAJ&hl=en',
    label: 'Google Scholar',
    icon: faGoogle,
  },
  {
    link: 'https://www.researchgate.net/profile/Dhruv-Doshi-4',
    label: 'Research Gate',
    icon: faResearchgate,
  },
  {
    link: 'https://calendly.com/dhruvdoshi25071999/15min',
    label: 'Calendar',
    icon: faCalendar,
  },
  {
    link: 'https://telegram.me/DoshiDhruv',
    label: '',
    icon: faTelegram,
  },
  {
    link: 'mailto:dhruvdoshi25071999@gmail.com',
    label: 'Email',
    icon: faEnvelope,
  },
];

export default data;
