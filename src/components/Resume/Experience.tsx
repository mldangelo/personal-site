import type React from 'react';
import type { IWorkExperience } from '../../data/resume/work';
import Job from './Experience/Job';

export interface IExperience {
  data: IWorkExperience[];
}

const Experience: React.FC<IExperience> = ({ data }) => (
  <section id="experience">
    <h2 className="mb-6 text-[length:var(--text-section)] font-semibold">
      Experience
    </h2>
    <div className="flex flex-col gap-8">
      {data.map((job) => (
        <Job data={job} key={`${job.name}-${job.position}`} />
      ))}
    </div>
  </section>
);

export default Experience;
