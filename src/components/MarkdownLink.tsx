import type { AnchorHTMLAttributes } from 'react';

import { newTabProps } from '@/lib/links';

export default function MarkdownLink({
  href,
  children,
  ...rest
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a href={href} {...rest} {...newTabProps(href)}>
      {children}
    </a>
  );
}
