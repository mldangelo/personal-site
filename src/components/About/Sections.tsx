'use client';

import Markdown from 'markdown-to-jsx';

interface AboutContentProps {
  markdown: string;
}

function splitAboutMarkdown(markdown: string) {
  const trimmed = markdown.trim();
  const introHeading = '# Intro';

  if (!trimmed.startsWith(introHeading)) {
    return {
      intro: '',
      body: trimmed,
    };
  }

  const withoutIntroHeading = trimmed.slice(introHeading.length).trimStart();
  const nextHeadingIndex = withoutIntroHeading.search(/\n# /);

  if (nextHeadingIndex === -1) {
    return {
      intro: withoutIntroHeading.trim(),
      body: '',
    };
  }

  return {
    intro: withoutIntroHeading.slice(0, nextHeadingIndex).trim(),
    body: withoutIntroHeading.slice(nextHeadingIndex + 1).trim(),
  };
}

export default function AboutContent({ markdown }: AboutContentProps) {
  const { intro, body } = splitAboutMarkdown(markdown);

  return (
    <article className="about-content">
      {intro ? (
        <div className="about-intro">
          <Markdown>{intro}</Markdown>
        </div>
      ) : null}
      {body ? (
        <Markdown
          options={{
            overrides: {
              h1: {
                component: 'h2',
              },
            },
          }}
        >
          {body}
        </Markdown>
      ) : null}
    </article>
  );
}
