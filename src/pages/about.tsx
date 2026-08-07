import fs from 'node:fs/promises';
import path from 'node:path';
import Markdown from 'markdown-to-jsx';
import PageHeader from '../components/Template/PageHeader';
import Main from '../layouts/Main';

interface AboutProps {
  markdown: string;
  wordCount: number;
}

// Read at build time so the content is in the static HTML: no empty flash on
// load, and crawlers see the copy.
export const getStaticProps = async () => {
  const markdown = await fs.readFile(
    path.join(process.cwd(), 'public/data/about.md'),
    'utf8'
  );

  const wordCount = markdown
    .split(/\s+/)
    .map((s) => s.replace(/\W/g, ''))
    .filter((s) => s.length).length;

  return { props: { markdown, wordCount } };
};

const About = ({ markdown, wordCount }: AboutProps) => (
  <Main title="About" description="Learn about Austin Dase">
    <PageHeader eyebrow="About" title="About me">
      <p className="font-mono text-sm">in about {wordCount} words</p>
    </PageHeader>

    <div className="prose prose-neutral dark:prose-invert prose-headings:font-semibold prose-a:text-accent prose-a:underline-offset-2 max-w-none">
      <Markdown>{markdown}</Markdown>
    </div>
  </Main>
);

export default About;
