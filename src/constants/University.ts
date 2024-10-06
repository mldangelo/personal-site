export interface WebLink {
  urlString: string;
}

export interface University extends WebLink {
  name: string;
  detailedName: string;
  school: School;
}

export interface School extends WebLink {
  name: string;
  department: Department;
}

export interface Department extends WebLink {
  name: string;
}

const smithSchool = 'https://www.rhsmith.umd.edu';
const umd = 'https://umd.edu';
const smithInfoSystems =
  'https://www.rhsmith.umd.edu/programs/undergraduate/academics/academic-majors#information-systems';

export const UniversityOfMaryland: University = {
  name: 'University of Maryland',
  detailedName: 'University of Maryland, College Park',
  urlString: umd,
  school: {
    name: 'Robert H. Smith School of Business',
    urlString: smithSchool,
    department: {
      name: 'Information Systems',
      urlString: smithInfoSystems,
    },
  },
};

const towson = 'https://www.towson.edu';
const fisherSchool = 'https://www.towson.edu/fcsm/';
const towsonCompSci =
  'https://www.towson.edu/fcsm/departments/computerinfosci/';

export const TowsonUniversity: University = {
  name: 'Towson University',
  detailedName: 'Towson University',
  urlString: towson,
  school: {
    name: 'Jess & Mildred Fisher College of Science & Mathematics',
    urlString: fisherSchool,
    department: {
      name: '',
      urlString: towsonCompSci,
    },
  },
};
