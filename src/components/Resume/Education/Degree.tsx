import type { IDegree } from '../../../data/resume/degrees';
import Entry from '../../Template/Entry';

export interface IDegreeComponent {
  data: IDegree;
}

const Degree = ({ data }: IDegreeComponent) => (
  <Entry period={data.year}>
    <h3 className="font-serif text-[1.2rem]">{data.degree}</h3>
    <a
      href={data.link}
      className="mt-1.5 block font-mono text-[0.8rem] text-accent hover:underline"
    >
      {data.school}
    </a>
  </Entry>
);

export default Degree;
