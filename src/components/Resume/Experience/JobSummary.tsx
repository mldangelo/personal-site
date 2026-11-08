'use client';

import Markdown from 'markdown-to-jsx';
import type { ReactNode } from 'react';

import { smartQuotesRule } from '@/lib/markdown';

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
        // A summary written on one line parses as inline content, which comes
        // back with no paragraph around it and so outside every `.summary` rule.
        forceBlock: true,
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
        renderRule: smartQuotesRule,
      }}
    >
      {summary}
    </Markdown>
  );
}
