import { Mail } from 'lucide-react';
import type { ComponentType, SVGProps } from 'react';
import { GithubIcon, LinkedinIcon, XIcon } from '@/components/ui/icons';

export interface ContactLink {
  link: string;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
}

const data: ContactLink[] = [
  {
    link: 'https://github.com/adase11',
    label: 'Github',
    icon: GithubIcon
  },
  {
    link: 'https://www.linkedin.com/in/austin-dase-40188b63/',
    label: 'LinkedIn',
    icon: LinkedinIcon
  },
  {
    link: 'https://x.com/adase01',
    label: 'Twitter',
    icon: XIcon
  },
  {
    link: 'mailto:hi@dase.dev',
    label: 'Email',
    icon: Mail
  }
];

export default data;
