import dayjs from 'dayjs';
import type { Metadata } from 'next';
import Link from 'next/link';
import Entry from '@/components/ui/entry';
import Section from '@/components/ui/section';
import { bio, earlier, email, meta, name, role } from '@/data/bio';
import { headlineSkills } from '@/data/resume/skills';
import work from '@/data/resume/work';
import { pageMetadata } from '@/lib/metadata';

const DESCRIPTION =
  "Austin Dase's personal website. DC based software engineer, " +
  'Director of Engineering at Fundrise.';

export const metadata: Metadata = pageMetadata({
  description: DESCRIPTION,
  path: '/',
  socialTitle: 'Austin Dase | Director of Engineering',
  imageAlt: 'Portrait of Austin Dase'
});

/** Only the current arc belongs on the cover; the resume carries the rest. */
const RECENT_COUNT = 4;

const period = (startDate: string, endDate?: string) => {
  const start = dayjs(startDate).format('YYYY');
  if (!endDate) return `${start}—`;
  const end = dayjs(endDate).format('YYYY');
  return start === end ? start : `${start}—${end}`;
};

const Home = () => (
  <>
    <div className="pt-14 pb-12">
      <p className="font-mono text-[0.82rem] text-faint">{role}</p>

      <h1 className="mt-5 text-hero leading-[1.05] font-serif">{name}</h1>

      <div className="mt-6 flex max-w-2xl flex-col gap-4">
        {bio.map((paragraph) => (
          <p key={paragraph.id} className="leading-[1.75] text-muted">
            {paragraph.body}
          </p>
        ))}
      </div>

      <div className="sep-dot mt-8 font-mono text-[0.78rem] text-faint">
        {meta.map((fact) => (
          <span key={fact.id}>{fact.body}</span>
        ))}
      </div>

      <div className="mt-9 flex flex-wrap gap-4">
        <Link href="/resume" className="btn btn-primary">
          View resume
        </Link>
        <a href={`mailto:${email}`} className="btn">
          Get in touch
        </a>
      </div>
    </div>

    <Section title="Recently">
      {work.slice(0, RECENT_COUNT).map((job) => (
        <Entry
          key={`${job.name}-${job.position}`}
          period={period(job.startDate, job.endDate)}
        >
          <h3 className="font-serif text-[1.2rem]">{job.position}</h3>
          <a
            href={job.url}
            className="mt-1.5 mb-2.5 block font-mono text-[0.8rem] text-accent hover:underline"
          >
            {job.name}
          </a>
          {job.blurb && (
            <p className="text-[0.92rem] leading-relaxed text-muted">
              {job.blurb}
            </p>
          )}
        </Entry>
      ))}

      <p className="mt-1 border-t border-dashed border-rule pt-5 font-mono text-[0.85rem] text-faint">
        {earlier}
      </p>
    </Section>

    <Section title="What I work with">
      <div className="sep-slash font-mono text-[0.9rem] text-muted">
        {headlineSkills.map((skill) => (
          <span key={skill}>{skill}</span>
        ))}
      </div>
    </Section>
  </>
);

export default Home;
