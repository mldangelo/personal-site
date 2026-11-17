'use client';

import { decodeEntity } from 'markdown-to-jsx/entities';
import Markdown, { RuleType } from 'markdown-to-jsx/react';
import Image from 'next/image';
import type {
  ComponentProps,
  ElementType,
  HTMLAttributes,
  KeyboardEvent as ReactKeyboardEvent,
  ReactNode,
} from 'react';
import {
  Children,
  type CSSProperties,
  createContext,
  isValidElement,
  useContext,
  useEffect,
  useRef,
} from 'react';
import { preload } from 'react-dom';

import { planMarkdownHeadingAnchors } from '@/lib/anchors';
import type { ImageSize } from '@/lib/imageSize';
import {
  createElementWithBasePath,
  isRootLocalImage,
  smartQuotesRule,
} from '@/lib/markdown';
import { withBasePath } from '@/lib/utils';

interface PostContentProps {
  content: string;
  /**
   * Intrinsic dimensions per image src, measured at build time by the page, so
   * each image reserves its real ratio and the page does not shift as it loads.
   */
  imageSizes?: Record<string, ImageSize>;
  /** The image near the top of the post, preloaded on wide screens. */
  leadImage?: string;
  /**
   * Draft previews may point at intentionally unpublished local images. The
   * production path remains strict and refuses invented dimensions.
   */
  allowMissingLocalImages?: boolean;
}

/** The width at which the header shows its desktop links (`header.css`). */
const WIDE_SCREEN_QUERY = '(min-width: 736px)';

/** Remote/data images cannot be inspected from the repository at build time. */
const FALLBACK_SIZE: ImageSize = { width: 1200, height: 675 };

const LANGUAGE_PREFIX = 'language-';
const CODE_SCROLL_STEP = 40;

const HEADING_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const;

/**
 * True for an image whose Markdown title is already showing as a caption.
 *
 * The caption copy is the image's own title, so leaving that title on the
 * `<img>` repeats the same sentence as a native tooltip and as the image's
 * accessible description, directly above the caption a reader can already see.
 * A context rather than a cloned prop because the image can sit one level down,
 * inside the `<a>` of a linked figure.
 */
const CaptionedFigure = createContext(false);

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
            ...props
          }: HTMLAttributes<HTMLHeadingElement>) => {
            const legacyId = id ? aliases.get(id) : undefined;

            return (
              <Tag {...props} id={id}>
                {legacyId ? (
                  <span
                    className="prose-anchor-alias"
                    id={legacyId}
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

/**
 * The image a block-level paragraph exists only to carry, if it carries one.
 *
 * This site treats a standalone Markdown image's optional title —
 * `![alt](src "title")` — as visible caption copy. Once it is promoted to a
 * `<figcaption>` the `title` is dropped from the image, so the same sentence
 * is not also emitted as a hover tooltip and as the image's accessible
 * description; an inline image keeps its title. Turning that local
 * authoring convention into a real
 * `<figure>`/`<figcaption>` has to happen here rather than in the `img`
 * override: markdown-to-jsx wraps a standalone image in a `<p>`, and a
 * `<figure>` inside a `<p>` is invalid, so the browser would hoist it out and
 * break hydration.
 *
 * The match is on the rendered image component, not on the presence of a `src`
 * prop: a post may embed raw HTML that also carries `src` — `<video>`,
 * `<audio>`, `<iframe>` — and those are neither figures nor measurable. Only
 * Markdown image syntax is measured at build time, so routing a `<video src>`
 * through the sizer would fail the production export.
 */
function figureImage(
  node: ReactNode,
  imageComponent: ElementType,
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

  if (node.type === imageComponent && typeof props.src === 'string') {
    const caption =
      typeof props.title === 'string' ? props.title.trim() : undefined;

    return {
      src: props.src,
      caption: caption || undefined,
    };
  }

  // A linked figure — `[![alt](src "title")](href)` — is still a figure. The
  // `<a>` wrapper renders as the plain string tag, so it falls through to here.
  const children = Children.toArray(props.children);
  return children.length === 1
    ? figureImage(children[0], imageComponent, depth + 1)
    : null;
}

/**
 * The fence's language, which markdown-to-jsx puts in the DOM as `language-bash`
 * on the inner `<code>`.
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
 * Steps an overflowing fence sideways while it holds focus.
 *
 * Shift is guarded alongside the other modifiers: Shift+Arrow extends a
 * selection, so cancelling it would take away a gesture the browser supplies
 * inside a scroll container rather than adding one.
 */
function scrollCodeFence(event: ReactKeyboardEvent<HTMLPreElement>) {
  if (
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey ||
    (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight')
  ) {
    return;
  }

  const pre = event.currentTarget;
  if (pre.scrollWidth <= pre.clientWidth) {
    return;
  }

  pre.scrollLeft +=
    event.key === 'ArrowRight' ? CODE_SCROLL_STEP : -CODE_SCROLL_STEP;
  event.preventDefault();
}

/**
 * Makes a code fence keyboard-reachable only while it actually overflows.
 *
 * A short fence needs no extra tab stop. A wide one does, because horizontal
 * keyboard scrolling starts only after the scroll container receives focus.
 * There is no landmark role: the preformatted content already supplies the
 * useful semantics, and repeated code-block regions would just add noise.
 */
/**
 * A raw `<pre>`'s body as the text it shows: tags dropped, entities decoded.
 * The parser keeps that body as opaque text, so as HTML it could carry markup
 * the Markdown checks never read: a `style` URL, an image, a script link.
 */
function rawPreText(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&(#x[\da-f]+|#\d+|[a-z][\da-z]*);/gi, (entity, name: string) => {
      if (name[0] !== '#') return decodeEntity(name) ?? entity;
      const code =
        name[1] === 'x' || name[1] === 'X'
          ? Number.parseInt(name.slice(2), 16)
          : Number.parseInt(name.slice(1), 10);
      return code > 0 && code <= 0x10ffff && (code < 0xd800 || code > 0xdfff)
        ? String.fromCodePoint(code)
        : '\uFFFD';
    });
}

function CodeFence({
  children,
  dangerouslySetInnerHTML: raw,
}: {
  children?: ReactNode;
  /** A raw `<pre>` arrives as its own inner HTML, not as children. */
  dangerouslySetInnerHTML?: { __html: string };
}) {
  const preRef = useRef<HTMLPreElement>(null);
  const language =
    fenceLanguage(children) ??
    raw?.__html.match(/^<code\b[^>]*\bclass="[^"]*\blanguage-([\w-]+)/)?.[1];
  const body = raw ? (
    <code
      className={language ? `language-${language} lang-${language}` : undefined}
    >
      {rawPreText(raw.__html)}
    </code>
  ) : (
    children
  );

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
    let disposed = false;

    // A fallback face and the final mono face can wrap the same line
    // differently. Recheck once fonts settle because ResizeObserver watches
    // the fence's box, not changes to its scrollable content width.
    void document.fonts?.ready.then(() => {
      if (!disposed) {
        syncTabStop();
      }
    });

    const observer =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(syncTabStop);
    observer?.observe(pre);

    return () => {
      disposed = true;
      window.removeEventListener('resize', syncTabStop);
      observer?.disconnect();
    };
  }, [children, raw]);

  return (
    <div className="prose-fence">
      {language ? (
        <>
          <span className="prose-fence-lang" aria-hidden="true">
            {language}
          </span>
          <span className="sr-only">{language} code block</span>
        </>
      ) : null}
      <pre ref={preRef} onKeyDown={scrollCodeFence}>
        {body}
      </pre>
    </div>
  );
}

export default function PostContent({
  allowMissingLocalImages = false,
  content,
  imageSizes = {},
  leadImage,
}: PostContentProps) {
  function sizeFor(src: string): ImageSize {
    const measuredSize = imageSizes[src];
    if (isRootLocalImage(src) && !measuredSize && !allowMissingLocalImages) {
      throw new Error(
        `Missing measured dimensions for local article image: ${src}`,
      );
    }

    return measuredSize ?? FALLBACK_SIZE;
  }

  // Declared here rather than at module scope because it reads the measured
  // sizes this render was given. `figureImage` matches on this identity, so the
  // figure path recognises an image without guessing from its props.
  function ProseImage({
    alt,
    src,
    title,
  }: {
    alt?: string;
    src?: string;
    title?: string;
  }) {
    const captioned = useContext(CaptionedFigure);

    if (!src) {
      return null;
    }

    const { width, height } = sizeFor(src);

    // On a wide screen the lead image is in the first viewport and usually the
    // largest paint, so the head fetches it at high priority. On a phone it is
    // below the fold, where fetching it early takes bandwidth from the opening
    // text, so there it stays lazy like every other image.
    if (src === leadImage) {
      preload(withBasePath(src), {
        as: 'image',
        fetchPriority: 'high',
        media: WIDE_SCREEN_QUERY,
      });
    }

    return (
      <Image
        src={withBasePath(src)}
        alt={alt || ''}
        width={width}
        height={height}
        loading="lazy"
        title={captioned ? undefined : title}
      />
    );
  }

  /** A local figure that is not already a link links to its own file. */
  function opensFullSize(node: ReactNode, src: string): boolean {
    return (
      isValidElement(node) && node.type === ProseImage && isRootLocalImage(src)
    );
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
        // inside it.
        wrapper: null,
        // One unique slug scheme for the whole site, plus safe aliases for the
        // published ids that differ from it.
        slugify: headingPlan.slugify,
        // Typographic quotes in text a reader sees; code is a different node.
        // The library links a footnote marker by its own slug of the label,
        // which is empty for a label in another script and shared by two
        // that differ only in punctuation; the plan's id is the note's.
        renderRule: (next, node, renderChildren, state) => {
          if (node.type === RuleType.footnoteReference) {
            const id = headingPlan.footnoteId(node.text);
            if (id) {
              return (
                <a key={state.key} href={`#${id}`}>
                  <sup>{node.text}</sup>
                </a>
              );
            }
          }
          return smartQuotesRule(next, node, renderChildren, state);
        },
        createElement: createElementWithBasePath,
        overrides: {
          ...headingOverrides(headingPlan.aliases),
          p: {
            component: ({ children, ...attributes }: ComponentProps<'p'>) => {
              const items = Children.toArray(children);
              const image =
                items.length === 1 ? figureImage(items[0], ProseImage) : null;

              // A raw paragraph keeps what its author wrote on it: `hidden`,
              // an `id` a link targets, `lang`, `dir`.
              if (!image) {
                return <p {...attributes}>{children}</p>;
              }

              return (
                <figure
                  className="prose-figure"
                  // Local images are measured at build time, so a wide local
                  // figure can exceed the reading measure without being
                  // upscaled past its own pixels. Remote images retain the
                  // documented fallback because their bytes are unavailable.
                  style={
                    {
                      '--figure-width': `${sizeFor(image.src).width}px`,
                    } as CSSProperties
                  }
                >
                  <CaptionedFigure value={image.caption !== undefined}>
                    {opensFullSize(items[0], image.src) ? (
                      // A figure is drawn no wider than the column, so on a
                      // phone a screenshot's text is often too small to read.
                      // Its file opens at full size, to zoom into.
                      <a
                        href={withBasePath(image.src)}
                        className="prose-figure-full"
                      >
                        {items[0]}
                        <span className="sr-only"> (full size)</span>
                      </a>
                    ) : (
                      items[0]
                    )}
                  </CaptionedFigure>
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
            component: ProseImage,
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
