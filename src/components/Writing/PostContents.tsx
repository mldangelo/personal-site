import { planMarkdownHeadingAnchors } from '@/lib/anchors';
import { smartQuotes } from '@/lib/typography';

/** Native disclosure and fragment links keep the outline usable without JS. */
export default function PostContents({ content }: { content: string }) {
  const { sections } = planMarkdownHeadingAnchors(content);

  if (sections.length < 2) return null;

  return (
    <nav className="post-contents" aria-label="On this page">
      <details>
        <summary>
          On this page
          <span className="post-contents-count">
            {sections.length} sections
          </span>
        </summary>
        <ol>
          {sections.map(({ id, title }) => (
            <li key={id}>
              <a href={`#${id}`}>{smartQuotes(title)}</a>
            </li>
          ))}
        </ol>
      </details>
    </nav>
  );
}
