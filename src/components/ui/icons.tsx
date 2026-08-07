import { SiGithub, SiX } from '@icons-pack/react-simple-icons';
import type { SVGProps } from 'react';

/**
 * Brand marks. GitHub and X come from Simple Icons; LinkedIn was removed from
 * that set following a trademark request, so its mark is drawn here. All three
 * inherit `currentColor` so the surrounding link styling drives the colour.
 */

export type BrandIconProps = SVGProps<SVGSVGElement> & { size?: number };

export const GithubIcon = (props: BrandIconProps) => (
  <SiGithub color="currentColor" {...props} />
);

export const XIcon = (props: BrandIconProps) => (
  <SiX color="currentColor" {...props} />
);

// Decorative by default: every caller wraps it in a link that carries the
// accessible name, so the mark itself is hidden from the tree.
export const LinkedinIcon = ({ size = 24, ...props }: BrandIconProps) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
  </svg>
);
