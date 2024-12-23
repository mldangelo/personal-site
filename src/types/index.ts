import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface Route {
  index?: boolean;
  label: string;
  path: string;
}

export interface ContactItem {
  link: string;
  label: string;
  icon: IconDefinition;
}

export interface Project {
  title: string;
  subtitle?: string;
  link?: string;
  image: string;
  date: string;
  desc: string;
}

export interface Degree {
  school: string;
  degree: string;
  link: string;
  year: number;
}

export interface Position {
  name: string;
  position: string;
  url: string;
  startDate: string;
  endDate?: string;
  summary?: string;
  highlights: string[];
}

export interface Skill {
  title: string;
  competency: number;
  category: string[];
}

export interface Course {
  title: string;
  number: string;
  link: string;
  university: string;
}

export interface Category {
  name: string;
  color: string;
}

export interface CategoryButtonProps {
  label: string;
  handleClick: (label: string) => void;
  active: Record<string, boolean>;
}

export interface SkillBarProps {
  data: Skill;
  categories: Category[];
}

export interface TableData {
  key: string;
  label: string;
  value: string | number;
  link?: string;
  format?: (value: string | number) => JSX.Element | number | string;
}
