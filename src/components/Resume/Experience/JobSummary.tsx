'use client';

import Markdown from 'markdown-to-jsx';
import type { ReactNode } from 'react';

function MarkdownPassthrough({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}

interface JobSummaryProps {
  summary: string;
}

export default function JobSummary({ summary }: JobSummaryProps) {
  return (
    <Markdown
      options={{
        overrides: {
          p: {
            props: {
              className: 'summary',
            },
          },
          code: {
            component: MarkdownPassthrough,
          },
          pre: {
            component: MarkdownPassthrough,
          },
        },
      }}
    >
      {summary}
    </Markdown>
  );
}
