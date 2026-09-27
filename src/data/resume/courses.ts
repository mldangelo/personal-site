export interface Course {
  title: string;
  number: string;
  link: string;
  university: string;
}

// Transcript courses are omitted until a verified list is available.
const courses: Course[] = [];

export default courses;
