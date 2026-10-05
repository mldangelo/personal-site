export interface Course {
  title: string;
  number: string;
  link: string;
  /**
   * Must match a `Degree.school` in `src/data/resume/degrees.ts` exactly.
   * `src/lib/resumeJson.ts` files coursework under the education entry with
   * this name, and it compares the two strings whole — a shortened form here
   * would silently drop the courses from `/resume.json`.
   */
  university: string;
}

const courses: Course[] = [
  {
    title: 'Convex Optimization',
    number: 'EE 364a',
    link: 'http://stanford.edu/class/ee364a/',
    university: 'Stanford University',
  },
  {
    title: 'Machine Learning',
    number: 'CS 229',
    link: 'http://cs229.stanford.edu/',
    university: 'Stanford University',
  },
  {
    title: 'Convolutional Neural Networks for Visual Recognition',
    number: 'CS 231n',
    link: 'http://cs231n.stanford.edu/',
    university: 'Stanford University',
  },
  {
    title: 'Numerical Linear Algebra',
    number: 'CME 302',
    // CME 302 has no standing class site (web.stanford.edu/class/cme302/ is a
    // 404), so this points at the course's Stanford Bulletin record. The
    // previous SCPD URL embedded an obsolete `jsessionid` and now redirects to
    // cgoe.stanford.edu before answering 403.
    link: 'https://bulletin.stanford.edu/courses/1057521',
    university: 'Stanford University',
  },
  {
    title: 'Numerical Optimization',
    number: 'CME 304',
    link: 'http://web.stanford.edu/class/cme304/',
    university: 'Stanford University',
  },
  {
    title: 'Discrete Mathematics and Algorithms',
    number: 'CME 305',
    link: 'http://stanford.edu/~rezab/discrete/',
    university: 'Stanford University',
  },
  {
    // Both fields come from the Bulletin record. The old class site
    // (web.stanford.edu/class/cme306/) is a Spring 2009 archive still titled
    // "Mathematical Methods for Fluids, Solids and Interfaces", and
    // cme306.stanford.edu redirects back to it over cleartext.
    title: 'Computational Methods of Applied Mathematics',
    number: 'CME 306',
    link: 'https://bulletin.stanford.edu/courses/1174062',
    university: 'Stanford University',
  },
  {
    title: 'Optimization',
    number: 'CME 307',
    link: 'http://stanford.edu/class/cme307/',
    university: 'Stanford University',
  },
  {
    title: 'Stochastic Methods in Engineering',
    number: 'CME 308',
    link: 'https://web.stanford.edu/class/cme308/',
    university: 'Stanford University',
  },
  {
    title: 'Randomized Algorithms and Probabilistic Analysis',
    number: 'CS 265',
    link: 'https://web.stanford.edu/class/cs265/',
    university: 'Stanford University',
  },
  {
    title: 'Deep Learning for Natural Language Processing',
    number: 'CS 224d',
    link: 'http://cs224d.stanford.edu',
    university: 'Stanford University',
  },
  {
    title: 'Mining Massive Data Sets',
    number: 'CS 246',
    link: 'http://web.stanford.edu/class/cs246/',
    university: 'Stanford University',
  },
  {
    title: 'Computer Vision: Foundations and Applications',
    number: 'CS 131',
    link: 'http://vision.stanford.edu/teaching/cs131_fall1415/index.html',
    university: 'Stanford University',
  },
];

export default courses;
