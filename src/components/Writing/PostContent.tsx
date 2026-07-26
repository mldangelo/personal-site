'use client';

import Markdown from 'markdown-to-jsx';
import Image from 'next/image';

interface PostContentProps {
  content: string;
  /**
   * Intrinsic dimensions per image src, measured at build time by the page.
   * Every image previously declared 1200x630 regardless of its real shape, so
   * each one reserved the wrong ratio and shifted the page as it loaded.
   */
  imageSizes?: Record<string, { width: number; height: number }>;
}

/** Remote/data images cannot be inspected from the repository at build time. */
const FALLBACK_SIZE = { width: 1200, height: 675 };

function isRootLocalImage(src: string): boolean {
  return src.startsWith('/') && !src.startsWith('//');
}

export default function PostContent({
  content,
  imageSizes = {},
}: PostContentProps) {
  return (
    <Markdown
      options={{
        overrides: {
          img: {
            component: ({ alt, src }: { alt?: string; src?: string }) => {
              if (!src) {
                return null;
              }

              const measuredSize = imageSizes[src];
              if (isRootLocalImage(src) && !measuredSize) {
                throw new Error(
                  `Missing measured dimensions for local article image: ${src}`,
                );
              }
              const { width, height } = measuredSize ?? FALLBACK_SIZE;

              return (
                <Image
                  src={src}
                  alt={alt || ''}
                  width={width}
                  height={height}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: 'auto',
                  }}
                />
              );
            },
          },
        },
      }}
    >
      {content}
    </Markdown>
  );
}
