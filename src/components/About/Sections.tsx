'use client';

import Markdown from 'markdown-to-jsx';
import { Children, type ReactNode } from 'react';

interface AboutContentProps {
  markdown: string;
}

function AboutSectionHeading({ children }: { children?: ReactNode }) {
  const text = Children.toArray(children).join('').trim();

  if (text === 'Intro') {
    return null;
  }

  return <h2>{children}</h2>;
}

export default function AboutContent({ markdown }: AboutContentProps) {
  return (
    <article className="about-content">
      <Markdown
        options={{
          overrides: {
            h1: {
              component: AboutSectionHeading,
            },
          },
        }}
      >
        {markdown}
      </Markdown>
    </article>
  );
}
