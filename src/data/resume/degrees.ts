export interface Degree {
  school: string;
  degree: string;
  link: string;
  year: number;
}

const degrees: Degree[] = [
  {
    school: 'University of California, Irvine',
    degree: 'Master of Computer Science',
    link: 'https://www.uci.edu',
    year: 2022,
  },
  {
    school: 'IIT Hyderabad',
    degree: 'Bachelor of Technology in Computer Science, Minor in Design',
    link: 'https://www.iith.ac.in',
    year: 2020,
  },
];

export default degrees;
