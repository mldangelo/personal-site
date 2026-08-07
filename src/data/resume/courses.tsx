import type { University } from '../../constants/University';

export interface ICourseInfo {
  title: string;
  number: string;
  link: string;
  university: University;
}

const courses: ICourseInfo[] = [];

export default courses;
