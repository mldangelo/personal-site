import {
  TowsonUniversity,
  University,
  UniversityOfMaryland,
} from '../../constants/University';

export interface Degree {
  school: string;
  degree: string;
  link: string;
  year: number;
}

function createDegree(
  university: University,
  degree: string,
  year: number
): Degree {
  return {
    school: university.detailedName,
    link: university.school.department.urlString,
    degree: degree,
    year: year,
  };
}

const degrees = [
  createDegree(TowsonUniversity, 'M.S. Computer Science', 2019),
  createDegree(UniversityOfMaryland, 'B.S. Information Systems', 2015),
];

export default degrees;
