export interface Course {
  title: string;
  number: string;
  link: string;
  university: string;
}

const courses: Course[] = [
  {
    title: 'Convex Optimization',
    number: 'EE 364a',
    link: 'http://stanford.edu/class/ee364a/',
    university: 'Stanford',
  },
  {
    title: 'Machine Learning',
    number: 'CS 229',
    link: 'http://cs229.stanford.edu/',
    university: 'Stanford',
  },
  {
    title: 'Convolutional Neural Networks for Visual Recognition',
    number: 'CS 231n',
    link: 'http://cs231n.stanford.edu/',
    university: 'Stanford',
  },
  {
    title: 'Numerical Linear Algebra',
    number: 'CME 302',
    link: 'http://scpd.stanford.edu/search/publicCourseSearchDetails.do;jsessionid=561188A06434D7D97953C4706DE12831?method=load&courseId=11685',
    university: 'Stanford',
  },
  {
    title: 'Numerical Optimization',
    number: 'CME 304',
    link: 'http://web.stanford.edu/class/cme304/',
    university: 'Stanford',
  },
  {
    title: 'Discrete Mathematics and Algorithms',
    number: 'CME 305',
    link: 'http://stanford.edu/~rezab/discrete/',
    university: 'Stanford',
  },
  {
    title: 'Stochastic Methods in Engineering',
    number: 'CME 306',
    link: 'http://web.stanford.edu/class/cme306/',
    university: 'Stanford',
  },
  {
    title: 'Optimization',
    number: 'CME 307',
    link: 'http://stanford.edu/class/cme307/',
    university: 'Stanford',
  },
  {
    title: 'Stochastic Processes',
    number: 'CME 308',
    link: 'http://web.stanford.edu/class/cme308/',
    university: 'Stanford',
  },
  {
    title: 'Randomized Algorithms and Probabilistic Analysis',
    number: 'CS 365',
    link: 'http://web.stanford.edu/class/cs365/',
    university: 'Stanford',
  },
  {
    title: 'Deep Learning for Natural Language Processing',
    number: 'CS 224d',
    link: 'http://cs224d.stanford.edu',
    university: 'Stanford',
  },
  {
    title: 'Mining Massive Data Sets',
    number: 'CS 246',
    link: 'http://web.stanford.edu/class/cs246/',
    university: 'Stanford',
  },
  {
    title: 'Computer Vision: Foundations and Applications',
    number: 'CS 131',
    link: 'http://vision.stanford.edu/teaching/cs131_fall1415/index.html',
    university: 'Stanford',
  },
];

export default courses;
