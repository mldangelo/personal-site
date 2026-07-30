'use client';

import Markdown from 'markdown-to-jsx';
import Image from 'next/image';
import type { ReactNode } from 'react';
import { Children, type CSSProperties, isValidElement } from 'react';

import { createHeadingId, planHeadingAliases } from '@/lib/anchors';
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
 * Heading overrides that keep a renamed heading's previous id resolving.
 *
 * The canonical id stays on the heading itself; the old one rides an empty
 * marker as the heading's first child. Inside rather than beside, because an
 * out-of-flow element takes its static position from where it would have been —
 * the top of the heading's content box — so `#old-slug` lands exactly where
 * `#new-slug` lands rather than a heading margin above it.
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
 * A Markdown image's CommonMark title — `![alt](src "title")` — is its caption,
 * and it was being destructured away, so every caption an author wrote was
 * dropped on the floor. Turning that into a real `<figure>`/`<figcaption>` has
 * to happen here rather than in the `img` override: markdown-to-jsx wraps a
 * standalone image in a `<p>`, and a `<figure>` inside a `<p>` is invalid, so
 * the browser would hoist it out and break hydration.
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

  const aliases = planHeadingAliases(content);

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
        // One slug scheme for the whole site. The default slugifier keeps every
        // separator it deletes, so `--dangerously-skip-permissions` became
        // `on-using---dangerously-skip-permissions` while every other page on
        // the site derived `on-using-dangerously-skip-permissions`.
        slugify: createHeadingId,
        overrides: {
          // A post that links to another post is an internal navigation like
          // any other, so it goes through the router rather than reloading the
          // document.
          ...PROSE_LINK_OVERRIDES,
          // Unifying the scheme renamed ids that were already published, so
          // each heading also carries whatever id it used to have.
          ...headingOverrides(aliases),
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
            component: ({ alt, src }: { alt?: string; src?: string }) => {
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
                />
              );
            },
          },
          pre: {
            component: ({ children }: { children?: ReactNode }) => {
              const language = fenceLanguage(children);

              return (
                <div className="prose-fence">
                  {language ? (
                    // The name is already on the region below, so the plate is
                    // annotation only and must not be announced twice.
                    <span className="prose-fence-lang" aria-hidden="true">
                      {language}
                    </span>
                  ) : null}
                  {/* The fence has always scrolled horizontally, but only for a
                      mouse. A named, focusable region gives the keyboard the
                      same reach. */}
                  <pre
                    tabIndex={0}
                    role="region"
                    aria-label={
                      language ? `${language} code block` : 'Code block'
                    }
                  >
                    {children}
                  </pre>
                </div>
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
