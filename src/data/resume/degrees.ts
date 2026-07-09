export interface Degree {
  school: string;
  degree: string;
  link: string;
  year: number;
}

const degrees: Degree[] = [
  {
    school: 'Universidade Cruzeiro do Sul',
    degree: 'B.S. Computer Software Engineering (Expected 2027)',
    link: 'https://www.cruzeirodosul.edu.br/',
    year: 2027,
  },
];

export default degrees;
