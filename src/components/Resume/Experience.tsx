import React from 'react';
import { IWorkExperience } from '../../data/resume/work';
import Job from './Experience/Job';

export interface IExperience {
  data: IWorkExperience[];
}

const Experience: React.FC<IExperience> = ({ data }) => (
  <div className="experience">
    <div className="link-to" id="experience" />
    <div className="title">
      <h3>Experience</h3>
    </div>
    {data.map((job) => (
      <Job data={job} key={`${job.name}-${job.position}`} />
    ))}
  </div>
);

export default Experience;
