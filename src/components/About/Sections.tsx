'use client';

import Markdown from 'markdown-to-jsx';

interface AboutContentProps {
  markdown: string;
}

export default function AboutContent({ markdown }: AboutContentProps) {
  return (
    <article className="about-content">
      <Markdown>{markdown}</Markdown>
    </article>
  );
}
