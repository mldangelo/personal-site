'use client';

import Markdown from 'markdown-to-jsx';
import Image from 'next/image';
import type { ReactNode } from 'react';
import {
  Children,
  type CSSProperties,
  isValidElement,
  useEffect,
  useRef,
} from 'react';

import { planMarkdownHeadingAnchors } from '@/lib/anchors';
import { PROSE_LINK_OVERRIDES } from '@/lib/markdownLinks';

interface ImageSize {
  width: number;
  height: number;
}

interface PostContentProps {
  content: string;
  /**
   * Intrinsic dimensions per image src, measured at build time by the page.
   * Every image previously declared 1200x630 regardless of its real shape, so
   * each one reserved the wrong ratio and shifted the page as it loaded.
   */
  imageSizes?: Record<string, ImageSize>;
}

/** Remote/data images cannot be inspected from the repository at build time. */
const FALLBACK_SIZE: ImageSize = { width: 1200, height: 675 };

const LANGUAGE_PREFIX = 'language-';

const HEADING_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;

/**
 * Heading overrides that keep renamed, already-published ids resolving.
 *
 * The canonical id remains on the heading. The old id rides an empty,
 * out-of-flow marker at the same position, so existing deep links keep working
 * without adding duplicate heading semantics or another tab stop.
 */
function headingOverrides(aliases: ReadonlyMap<string, string>) {
  const entries = HEADING_TAGS.map(
    (Tag) =>
      [
        Tag,
        {
          component: ({
            id,
            children,
          }: {
            id?: string;
            children?: ReactNode;
          }) => {
            const legacyId = id ? aliases.get(id) : undefined;

            return (
              <Tag id={id}>
                {legacyId ? (
                  <span
                    className="prose-anchor-alias"
                    id={legacyId}
                    // It names nothing and is not content; it exists so a link
                    // shared before the rename still has somewhere to land.
                    aria-hidden="true"
                  />
                ) : null}
                {children}
              </Tag>
            );
          },
        },
      ] as const,
  );

  return Object.fromEntries(entries);
}

function isRootLocalImage(src: string): boolean {
  return src.startsWith('/') && !src.startsWith('//');
}

/**
 * The image a block-level paragraph exists only to carry, if it carries one.
 *
 * This site treats a standalone Markdown image's optional title —
 * `![alt](src "title")` — as visible caption copy while preserving the title
 * on the image itself. Turning that local authoring convention into a real
 * `<figure>`/`<figcaption>` has to happen here rather than in the `img`
 * override: markdown-to-jsx wraps a standalone image in a `<p>`, and a
 * `<figure>` inside a `<p>` is invalid, so the browser would hoist it out and
 * break hydration.
 */
function figureImage(
  node: ReactNode,
  depth = 0,
): { src: string; caption?: string } | null {
  if (!isValidElement(node) || depth > 1) {
    return null;
  }

  const props = node.props as {
    src?: unknown;
    title?: unknown;
    children?: ReactNode;
  };

  if (typeof props.src === 'string') {
    return {
      src: props.src,
      caption:
        typeof props.title === 'string' && props.title
          ? props.title
          : undefined,
    };
  }

  // A linked figure — `[![alt](src "title")](href)` — is still a figure.
  const children = Children.toArray(props.children);
  return children.length === 1 ? figureImage(children[0], depth + 1) : null;
}

/**
 * The fence's language, which markdown-to-jsx already puts in the DOM as
 * `language-bash` on the inner `<code>` and which nothing was reading.
 */
function fenceLanguage(children: ReactNode): string | undefined {
  const [code] = Children.toArray(children);
  if (!isValidElement(code)) {
    return undefined;
  }

  const { className } = code.props as { className?: unknown };
  if (typeof className !== 'string') {
    return undefined;
  }

  return className
    .split(/\s+/)
    .find((token) => token.startsWith(LANGUAGE_PREFIX))
    ?.slice(LANGUAGE_PREFIX.length);
}

/**
 * Makes a code fence keyboard-reachable only while it actually overflows.
 *
 * A short fence needs no extra tab stop. A wide one does, because horizontal
 * keyboard scrolling starts only after the scroll container receives focus.
 * There is no landmark role: the preformatted content already supplies the
 * useful semantics, and repeated code-block regions would just add noise.
 */
function CodeFence({ children }: { children?: ReactNode }) {
  const preRef = useRef<HTMLPreElement>(null);
  const language = fenceLanguage(children);

  useEffect(() => {
    const pre = preRef.current;
    if (!pre) {
      return;
    }

    const syncTabStop = () => {
      if (pre.scrollWidth > pre.clientWidth) {
        pre.setAttribute('tabindex', '0');
      } else {
        pre.removeAttribute('tabindex');
      }
    };

    syncTabStop();
    window.addEventListener('resize', syncTabStop);

    const observer =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(syncTabStop);
    observer?.observe(pre);

    return () => {
      window.removeEventListener('resize', syncTabStop);
      observer?.disconnect();
    };
  }, []);

  return (
    <div className="prose-fence">
      {language ? (
        <span className="prose-fence-lang" aria-hidden="true">
          {language}
        </span>
      ) : null}
      <pre ref={preRef}>{children}</pre>
    </div>
  );
}

export default function PostContent({
  content,
  imageSizes = {},
}: PostContentProps) {
  function sizeFor(src: string): ImageSize {
    const measuredSize = imageSizes[src];
    if (isRootLocalImage(src) && !measuredSize) {
      throw new Error(
        `Missing measured dimensions for local article image: ${src}`,
      );
    }

    return measuredSize ?? FALLBACK_SIZE;
  }

  const headingPlan = planMarkdownHeadingAnchors(content);

  return (
    <Markdown
      options={{
        // Post bodies are always block documents. Without this a single-block
        // post renders inline, so a lone image would never reach the `p`
        // override that promotes it to a figure.
        forceBlock: true,
        // No wrapper element: the default `<div>` around a multi-block document
        // becomes the only child of `.prose`, so any per-block rule written as
        // `.prose > *` silently lands on the wrapper and constrains everything
        // inside it — which is exactly what stopped a wide figure widening.
        wrapper: null,
        // One unique slug scheme for the whole site. The precomputed plan also
        // leaves safe aliases for ids that were published under the library's
        // old default scheme.
        slugify: headingPlan.slugify,
        overrides: {
          // A post that links to another post is an internal navigation like
          // any other, so it goes through the router rather than reloading the
          // document.
          ...PROSE_LINK_OVERRIDES,
          // Unifying the scheme renamed ids that were already published, so
          // each heading also carries whatever id it used to have.
          ...headingOverrides(headingPlan.aliases),
          p: {
            component: ({ children }: { children?: ReactNode }) => {
              const items = Children.toArray(children);
              const image = items.length === 1 ? figureImage(items[0]) : null;

              if (!image) {
                return <p>{children}</p>;
              }

              return (
                <figure
                  className="prose-figure"
                  // Measured at build time, so a wide figure can be allowed to
                  // exceed the reading measure without ever being upscaled
                  // past its own pixels.
                  style={
                    {
                      '--figure-width': `${sizeFor(image.src).width}px`,
                    } as CSSProperties
                  }
                >
                  {items[0]}
                  {image.caption ? (
                    <figcaption className="prose-figcaption">
                      {image.caption}
                    </figcaption>
                  ) : null}
                </figure>
              );
            },
          },
          img: {
            component: ({
              alt,
              src,
              title,
            }: {
              alt?: string;
              src?: string;
              title?: string;
            }) => {
              if (!src) {
                return null;
              }

              const { width, height } = sizeFor(src);

              return (
                <Image
                  src={src}
                  alt={alt || ''}
                  width={width}
                  height={height}
                  loading="lazy"
                  title={title}
                />
              );
            },
          },
          pre: {
            component: CodeFence,
          },
        },
      }}
    >
      {content}
    </Markdown>
  );
}
