import type { IDegree } from '../../data/resume/degrees';
import Section from '../Template/Section';
import Degree from './Education/Degree';

export interface IEducation {
  data: IDegree[];
}

const Education = ({ data }: IEducation) => (
  <Section id="education" title="Education">
    {data.map((d) => (
      <Degree data={d} key={d.school} />
    ))}
  </Section>
);

export default Education;
