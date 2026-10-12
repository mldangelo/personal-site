'use client';

import Markdown, { type MarkdownToJSX, RuleType } from 'markdown-to-jsx';
import Image from 'next/image';
import type {
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

import { planMarkdownHeadingAnchors } from '@/lib/anchors';
import { smartQuotes } from '@/lib/typography';

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
  /**
   * Draft previews may point at intentionally unpublished local images. The
   * production path remains strict and refuses invented dimensions.
   */
  allowMissingLocalImages?: boolean;
}

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

function isRootLocalImage(src: string): boolean {
  return src.startsWith('/') && !src.startsWith('//');
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
 * through the sizer failed the production export outright.
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
  }, [children]);

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
        {children}
      </pre>
    </div>
  );
}

/**
 * Raw HTML whose text is code, keyboard input, or program output.
 *
 * Backtick spans and fences are node types of their own and never reach the
 * text rule below. An author's `<kbd>'</kbd>` does: markdown-to-jsx parses the
 * inside of raw HTML as Markdown, so its text arrives as ordinary text nodes.
 */
const VERBATIM_TAGS = new Set(['code', 'kbd', 'pre', 'samp', 'var']);

/** True where a node's text is something to be typed, not something to read. */
function isVerbatim(node: MarkdownToJSX.ASTNode): boolean {
  if (node.type === RuleType.htmlBlock) {
    return VERBATIM_TAGS.has(node.tag.toLowerCase());
  }

  // A bare or angle-bracketed URL, and an address written the same way: the
  // link text is the destination itself, and a curled apostrophe in it is a
  // different address for anyone who copies what they see.
  if (node.type === RuleType.link && node.children.length === 1) {
    const [label] = node.children;

    return (
      label.type === RuleType.text &&
      (label.text === node.target || `mailto:${label.text}` === node.target)
    );
  }

  return false;
}

const OPENING_QUOTE: Record<string, string | undefined> = {
  '"': '\u201C',
  "'": '\u2018',
};

/**
 * Typographic quotes for the prose of a post, and for nothing else in it.
 *
 * Only text nodes are converted. Code spans, fences, and every attribute — a
 * link's href and title, an image's alt — are other parts of the tree, so they
 * keep the characters that were typed. A fresh rule per render, because it
 * counts its way in and out of the verbatim elements above.
 */
function typographicQuotes(): NonNullable<MarkdownToJSX.Options['renderRule']> {
  // `next()` renders a node's children before it returns, so this is back to
  // zero by the time the element's next sibling is visited.
  let verbatimDepth = 0;

  return (next, node, _renderChildren, state) => {
    if (node.type === RuleType.text) {
      if (verbatimDepth > 0) {
        return next();
      }

      // `smartQuotes` sees one node at a time, and reads a quote with nothing
      // after it as closing one opened in an earlier node. When the quote is
      // its parent's first child there is no earlier node: `"[Title](url)"`
      // and `"*emphasis*"` open with it.
      const opening = state.key === 0 ? OPENING_QUOTE[node.text] : undefined;

      return opening ?? smartQuotes(node.text);
    }

    if (!isVerbatim(node)) {
      return next();
    }

    verbatimDepth += 1;
    try {
      return next();
    } finally {
      verbatimDepth -= 1;
    }
  };
}

/**
 * The longest code span that fits on one line wherever prose puts it. A nested
 * list item on a 320px phone holds 21 characters of it, measured, and no line
 * of an article is narrower. Anything longer has to stay free to wrap, or it
 * would push the page sideways.
 */
const UNBROKEN_CODE_LENGTH = 20;

/** The dashes that open a flag, with the word they introduce. */
const FLAG_HEAD = /^-{1,2}[^-]+/;

/** The part of a word that must not be parted from its leading dashes. */
function flagHead(word: string): string | undefined {
  const head = FLAG_HEAD.exec(word)?.[0];

  return head && head.length <= UNBROKEN_CODE_LENGTH ? head : undefined;
}

/**
 * A code span set so that a flag is never parted from its dashes.
 *
 * A hyphen is a place a line may break, so `--chrome` near the end of a line
 * was set as `--` on one line and `chrome` on the next. Short code is kept
 * whole. Longer code still has to wrap on a phone, so there only the dashes
 * of each flag are tied to the word after them. The text itself is never
 * changed: a reader who copies the code gets the characters that were typed.
 *
 * Returns nothing where the library's own `<code>` is already right.
 */
function codeSpan(text: string, key?: string | number): ReactNode {
  if (text.length <= UNBROKEN_CODE_LENGTH) {
    return (
      <code className="prose-code-nowrap" key={key}>
        {text}
      </code>
    );
  }

  // Words and the whitespace between them, in order.
  const pieces = text.split(/(\s+)/);
  if (!pieces.some(flagHead)) {
    return undefined;
  }

  const children: ReactNode[] = [];
  let plain = '';
  for (const [index, piece] of pieces.entries()) {
    const head = flagHead(piece);
    if (!head) {
      plain += piece;
      continue;
    }

    if (plain) {
      children.push(plain);
    }
    children.push(
      <span className="prose-code-nowrap" key={index}>
        {head}
      </span>,
    );
    plain = piece.slice(head.length);
  }
  if (plain) {
    children.push(plain);
  }

  return <code key={key}>{children}</code>;
}

/**
 * What a post's Markdown needs beyond the library's defaults: typographic
 * quotes in the prose, and code spans that keep a flag in one piece.
 */
function proseRules(): NonNullable<MarkdownToJSX.Options['renderRule']> {
  const quotes = typographicQuotes();

  return (next, node, renderChildren, state) => {
    if (node.type === RuleType.codeInline) {
      return codeSpan(node.text, state.key) ?? next();
    }

    return quotes(next, node, renderChildren, state);
  };
}

export default function PostContent({
  allowMissingLocalImages = false,
  content,
  imageSizes = {},
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

    return (
      <Image
        src={src}
        alt={alt || ''}
        width={width}
        height={height}
        loading="lazy"
        title={captioned ? undefined : title}
      />
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
        // inside it — which is exactly what stopped a wide figure widening.
        wrapper: null,
        // One unique slug scheme for the whole site. The precomputed plan also
        // leaves safe aliases for ids that were published under the library's
        // old default scheme.
        slugify: headingPlan.slugify,
        // Heading ids are planned from the source above, before this runs, so
        // curling a heading's apostrophe cannot move its anchor.
        renderRule: proseRules(),
        overrides: {
          ...headingOverrides(headingPlan.aliases),
          p: {
            component: ({ children }: { children?: ReactNode }) => {
              const items = Children.toArray(children);
              const image =
                items.length === 1 ? figureImage(items[0], ProseImage) : null;

              if (!image) {
                return <p>{children}</p>;
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
                    {items[0]}
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
