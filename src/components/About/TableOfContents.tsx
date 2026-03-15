import type { AboutSection } from './types';

interface AboutTableOfContentsProps {
  sections: AboutSection[];
}

export default function AboutTableOfContents({
  sections,
}: AboutTableOfContentsProps) {
  return (
    <nav className="about-toc" aria-labelledby="about-toc-title">
      <p id="about-toc-title" className="about-toc-title">
        Sections
      </p>
      <ol className="about-toc-list">
        {sections.map((section) => (
          <li key={section.slug}>
            <a className="about-toc-link" href={`#${section.slug}`}>
              {section.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
