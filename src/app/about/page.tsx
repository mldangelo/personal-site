import fs from 'node:fs/promises';
import path from 'node:path';
import Markdown from 'markdown-to-jsx';
import type { Metadata } from 'next';
import ProfileCard from '@/components/layout/profile-card';
import PageHeader from '@/components/ui/page-header';
import { pageMetadata } from '@/lib/metadata';

export const metadata: Metadata = pageMetadata({
  title: 'About',
  description: 'Learn about Austin Dase',
  path: '/about',
  imageAlt: 'Portrait of Austin Dase'
});

// Read during the build so the copy is in the static HTML: no empty flash on
// load, and crawlers see it. A Server Component can do this directly — the
// getStaticProps round-trip this replaced is gone.
const readAbout = async () => {
  const markdown = await fs.readFile(
    path.join(process.cwd(), 'public/data/about.md'),
    'utf8'
  );

  const wordCount = markdown
    .split(/\s+/)
    .map((s) => s.replace(/\W/g, ''))
    .filter((s) => s.length).length;

  return { markdown, wordCount };
};

const About = async () => {
  const { markdown, wordCount } = await readAbout();

  return (
    <>
      <PageHeader title="About me">
        <p className="label text-faint">in about {wordCount} words</p>
      </PageHeader>

      <div className="prose max-w-none border-t border-rule">
        <Markdown>{markdown}</Markdown>
      </div>

      <div className="mt-14">
        <ProfileCard />
      </div>
    </>
  );
};

export default About;
