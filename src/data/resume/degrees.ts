export interface Degree {
  school: string;
  degree: string;
  link: string;
  year: number;
}

const degrees: Degree[] = [
  {
    school: 'University of South Dakota',
    degree: 'Master of Science in Computer Science',
    link: 'https://www.usd.edu',
    year: 2024,
  },
];

export default degrees;
