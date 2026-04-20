'use client';

import Markdown from 'markdown-to-jsx';
import Image from 'next/image';

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
