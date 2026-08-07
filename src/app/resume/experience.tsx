import dayjs from 'dayjs';
import Markdown from 'markdown-to-jsx';
import Entry from '@/components/ui/entry';
import Section from '@/components/ui/section';
import work from '@/data/resume/work';

const prose =
  'text-[0.92rem] leading-[1.65] text-muted [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2';

const Experience = () => (
  <Section id="experience" title="Experience">
    {work.map(
      ({ name, position, url, startDate, endDate, summary, highlights }) => (
        <Entry
          key={`${name}-${position}`}
          period={`${dayjs(startDate).format('MMM YYYY')} — ${
            endDate ? dayjs(endDate).format('MMM YYYY') : 'Present'
          }`}
        >
          <h3 className="font-serif text-[1.2rem]">{position}</h3>
          <a
            href={url}
            className="mt-1.5 mb-2.5 block font-mono text-[0.8rem] text-accent hover:underline"
          >
            {name}
          </a>

          {summary && (
            <div className={prose}>
              <Markdown>{summary}</Markdown>
            </div>
          )}

          {highlights && (
            <ul
              className={`mt-3 flex list-disc flex-col gap-1.5 pl-5 marker:text-accent-soft ${prose}`}
            >
              {highlights.map((highlight) => (
                <li key={highlight}>
                  <Markdown options={{ forceInline: true }}>
                    {highlight}
                  </Markdown>
                </li>
              ))}
            </ul>
          )}
        </Entry>
      )
    )}
  </Section>
);

export default Experience;
