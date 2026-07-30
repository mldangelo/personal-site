export interface Degree {
  school: string;
  degree: string;
  link: string;
  year: number;
}

const degrees: Degree[] = [
  {
    school: 'University of Colorado Boulder',
    degree:
      'B.S. Electrical Engineering, Minors in Computer Science & Applied Mathematics',
    link: 'https://www.colorado.edu',
    year: 2027,
  },
];

export default degrees;
