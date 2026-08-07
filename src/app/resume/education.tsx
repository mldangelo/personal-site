import Entry from '@/components/ui/entry';
import Section from '@/components/ui/section';
import degrees from '@/data/resume/degrees';

const Education = () => (
  <Section id="education" title="Education">
    {degrees.map(({ school, degree, link, year }) => (
      <Entry key={school} period={year}>
        <h3 className="font-serif text-[1.2rem]">{degree}</h3>
        <a
          href={link}
          className="mt-1.5 block font-mono text-[0.8rem] text-accent hover:underline"
        >
          {school}
        </a>
      </Entry>
    ))}
  </Section>
);

export default Education;
