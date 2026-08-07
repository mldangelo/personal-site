import type React from 'react';
import type { IWorkExperience } from '../../data/resume/work';
import Section from '../Template/Section';
import Job from './Experience/Job';

export interface IExperience {
  data: IWorkExperience[];
}

const Experience: React.FC<IExperience> = ({ data }) => (
  <Section id="experience" title="Experience">
    {data.map((job) => (
      <Job data={job} key={`${job.name}-${job.position}`} />
    ))}
  </Section>
);

export default Experience;
