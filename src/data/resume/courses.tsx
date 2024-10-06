import {
  TowsonUniversity,
  University,
  UniversityOfMaryland,
} from '../../constants/University';

export interface CourseInfo {
  title: string;
  number: string;
  link: string;
  university: University;
}

const courses: CourseInfo[] = [
  {
    title: 'Convex Optimization',
    number: 'EE 364a',
    link: 'http://stanford.edu/class/ee364a/',
    university: UniversityOfMaryland,
  },
  {
    title: 'Machine Learning',
    number: 'CS 229',
    link: 'http://cs229.stanford.edu/',
    university: TowsonUniversity,
  },
];

export default courses;
