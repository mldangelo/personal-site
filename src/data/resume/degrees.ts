export interface Degree {
  school: string;
  degree: string;
  link: string;
  year: number;
}

const degrees: Degree[] = [
  {
    school: 'Wainganga College of Engineering and Management, Nagpur',
    degree: 'B.E Artificial Intelligence, Data Science',
    link: 'https://wcem.co',
    year: 2027,
  },
  {
    school: 'Z P Highschool Jr College lakhandur',
    degree: '12th Science, PCBM',
    link: 'https://z.p.com',
    year: 2023,
  },
  {
    school: 'Z. P. Asgaon High School, Pauni',
    degree: '10th, Science',
    link: 'https://z.p.com',
    year: 2021,
  },
];

export default degrees;
