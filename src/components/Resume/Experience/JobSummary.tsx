'use client';

import Markdown, { RuleType } from 'markdown-to-jsx';
import type { ReactNode } from 'react';

import { smartQuotes } from '@/lib/typography';

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
        // A summary written on one line parses as inline content, and inline
        // content comes back with no paragraph around it: one role's summary
        // was reaching the page as a bare text node, outside every `.summary`
        // rule, at the body size beside 14px bullets.
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
        // Quotes are set per text node, after parsing. Converting the source
        // string instead reaches inside the markup: the anchors in these
        // summaries quote their `href` with apostrophes, and a typographic
        // one there becomes part of the address. Code spans are a different
        // rule type, so they pass through as written.
        renderRule(next, node) {
          return node.type === RuleType.text ? smartQuotes(node.text) : next();
        },
      }}
    >
      {summary}
    </Markdown>
  );
}
