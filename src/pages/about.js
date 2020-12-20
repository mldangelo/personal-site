import fs from 'fs';
import path from 'path';

import Link from 'next/link';
import { NextSeo } from 'next-seo';
import ReactMarkdown from 'react-markdown';

// Make all hrefs react router links
const LinkRenderer = ({ ...children }) => <Link {...children} />;

const About = ({ count, markdown }) => (
  <>
    <NextSeo
      title="About | Michael D'Angelo"
      description="Learn all about Michael D'Angelo."
    />
    <article className="post" id="about">
      <header>
        <div className="title">
          <h2>
            <Link href="/about">About Me</Link>
          </h2>
          <p>(in about {count} words)</p>
        </div>
      </header>
      <ReactMarkdown
        source={markdown}
        renderers={{
          Link: LinkRenderer,
        }}
        escapeHtml={false}
      />
    </article>
  </>
);

// This also gets called at build time
export async function getStaticProps() {
  const markdown = fs.readFileSync(
    path.join(process.cwd(), 'src/data/about.md'),
    'utf8'
  );
  const count = markdown
    .split(/\s+/)
    .map((s) => s.replace(/\W/g, ''))
    .filter((s) => s.length).length;

  // Pass post data to the page via props
  return {
    props: { count, markdown },
    // Re-generate the post at most once per second
    // if a request comes in
    revalidate: 1,
  };
}

export default About;
