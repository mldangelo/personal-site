export interface Course {
  title: string;
  number: string;
  link: string;
  university: string;
}

const courses: Course[] = [
  {
    title: 'Fullstack Software Development',
    number: 'Bootcamp',
    link: 'https://www.betrybe.com/',
    university: 'Trybe',
  },
];

export default courses;
