'use client';

import Markdown from 'markdown-to-jsx';

import type { AboutSection } from './types';

interface AboutSectionsProps {
  sections: AboutSection[];
}

export default function AboutSections({ sections }: AboutSectionsProps) {
  return (
    <article className="about-content">
      {sections.map((section, index) => (
        <section
          id={section.slug}
          key={section.slug}
          className={`about-section about-section--${section.slug}`}
        >
          <div className="about-section-head">
            <span className="about-section-index" aria-hidden="true">
              {String(index + 1).padStart(2, '0')}
            </span>
            <h2 className="about-section-title">{section.title}</h2>
          </div>
          <div className="about-section-body">
            <Markdown>{section.body}</Markdown>
          </div>
        </section>
      ))}
    </article>
  );
}
