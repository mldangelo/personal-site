'use client';

import Image from 'next/image';
import Markdown from 'markdown-to-jsx';

interface PostContentProps {
  content: string;
}

export default function PostContent({ content }: PostContentProps) {
  return (
    <Markdown
      options={{
        overrides: {
          img: {
            component: ({ alt, src }: { alt?: string; src?: string }) => (
              <Image
                src={src || ''}
                alt={alt || ''}
                width={1200}
                height={630}
                loading="lazy"
                style={{
                  width: '100%',
                  height: 'auto',
                }}
              />
            ),
          },
        },
      }}
    >
      {content}
    </Markdown>
  );
}
