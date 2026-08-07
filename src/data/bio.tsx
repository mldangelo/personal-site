import type { ReactNode } from 'react';

export const name = 'Austin Dase';
export const email = 'hi@dase.dev';
export const role = 'Director of Engineering at Fundrise';
export const location = 'Washington, DC';

export const bio: ReactNode = (
  <>
    Hi, I&apos;m Austin. I&apos;m Director of Engineering at{' '}
    <a href="https://fundrise.com">Fundrise</a>, a graduate of{' '}
    <a href="https://www.rhsmith.umd.edu">The University of Maryland</a> and{' '}
    <a href="https://www.towson.edu/fcsm/departments/computerinfosci/grad/computersci/">
      Towson University
    </a>
    . Before Fundrise, I sharpened my skills at{' '}
    <a href="https://www.travelers.com">Travelers</a>.
  </>
);
