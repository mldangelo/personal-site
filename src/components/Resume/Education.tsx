import type { IDegree } from '../../data/resume/degrees';
import Degree from './Education/Degree';

export interface IEducation {
  data: IDegree[];
}

const Education = (data: IEducation) => (
  <section id="education">
    <h2 className="mb-6 text-[length:var(--text-section)] font-semibold">
      Education
    </h2>
    <div className="flex flex-col gap-6">
      {data.data.map((d) => (
        <Degree data={d} key={d.school} />
      ))}
    </div>
  </section>
);

export default Education;
