'use client';

import { useEffect, useState } from 'react';

import type { AboutSection } from './types';

const INTERSECTION_MARGIN = '-18% 0px -72% 0px';

interface AboutTableOfContentsProps {
  sections: AboutSection[];
}

export default function AboutTableOfContents({
  sections,
}: AboutTableOfContentsProps) {
  const [activeSection, setActiveSection] = useState<string>(
    sections[0]?.slug ?? '',
  );

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined' || sections.length === 0) {
      return;
    }

    const initialHash = window.location.hash.slice(1);
    if (initialHash) {
      setActiveSection(initialHash);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);

        let targetEntry: IntersectionObserverEntry | null = null;

        if (visibleEntries.length > 0) {
          targetEntry = visibleEntries.reduce((prev, current) =>
            current.intersectionRatio > prev.intersectionRatio ? current : prev,
          );
        } else if (entries.length > 0) {
          targetEntry = entries.reduce((prev, current) => {
            const prevDistance = Math.abs(prev.boundingClientRect.top);
            const currentDistance = Math.abs(current.boundingClientRect.top);
            return currentDistance < prevDistance ? current : prev;
          });
        }

        if (targetEntry) {
          setActiveSection(targetEntry.target.id);
        }
      },
      {
        rootMargin: INTERSECTION_MARGIN,
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    sections.forEach(({ slug }) => {
      const element = document.getElementById(slug);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [sections]);

  return (
    <nav className="about-toc" aria-labelledby="about-toc-title">
      <p id="about-toc-title" className="about-toc-title">
        On This Page
      </p>
      <ol className="about-toc-list">
        {sections.map((section, index) => (
          <li key={section.slug}>
            <a
              className="about-toc-link"
              href={`#${section.slug}`}
              aria-current={
                activeSection === section.slug ? 'location' : undefined
              }
            >
              <span className="about-toc-index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span>{section.title}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
