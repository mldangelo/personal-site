import React from 'react';
import Degree from './Education/Degree';
import { Degree as DegreeType } from '../../data/resume/degrees';

interface EducationProps {
  data?: DegreeType[];
}

const Education: React.FC<EducationProps> = ({ data = [] }) => (
  <div className="education">
    <div className="link-to" id="education" />
    <div className="title">
      <h3>Education</h3>
    </div>
    {data.map((degree) => (
      <Degree data={degree} key={degree.school} />
    ))}
  </div>
);

export default Education;