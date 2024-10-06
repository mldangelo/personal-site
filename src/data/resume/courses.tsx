import { University } from '../../constants/University';

export interface CourseInfo {
  title: string;
  number: string;
  link: string;
  university: University;
}

const courses: CourseInfo[] = [];

export default courses;
