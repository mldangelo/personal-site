'use client';

import { useEffect, useMemo, useState } from 'react';

const ALL_SECTIONS = [
  { name: 'Experience', id: 'experience' },
  { name: 'Education', id: 'education' },
  { name: 'Skills', id: 'skills' },
  { name: 'Courses', id: 'courses' },
  { name: 'References', id: 'references' },
] as const;

type SectionId = (typeof ALL_SECTIONS)[number]['id'];

/** Offset from top of viewport for intersection detection (header height + nav) */
const INTERSECTION_MARGIN = '-20% 0px -75% 0px';

interface ResumeNavProps {
  includeCourses?: boolean;
}

export default function ResumeNav({ includeCourses = true }: ResumeNavProps) {
  const sections = useMemo(
    () =>
      includeCourses
        ? ALL_SECTIONS
        : ALL_SECTIONS.filter((section) => section.id !== 'courses'),
    [includeCourses],
  );
  const [activeSection, setActiveSection] = useState<SectionId>('experience');

  useEffect(() => {
    // Check if IntersectionObserver is available (not in test environment)
    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    // Create IntersectionObserver for efficient scroll tracking
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry that is most visible (highest intersection ratio)
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);

        let targetEntry: IntersectionObserverEntry | null = null;

        if (visibleEntries.length > 0) {
          // When there are visible entries, pick the one with the highest intersection ratio
          targetEntry = visibleEntries.reduce((prev, current) =>
            current.intersectionRatio > prev.intersectionRatio ? current : prev,
          );
        } else if (entries.length > 0) {
          // When no entries are intersecting, fall back to the entry closest to the viewport
          targetEntry = entries.reduce((prev, current) => {
            const prevDistance = Math.abs(prev.boundingClientRect.top);
            const currentDistance = Math.abs(current.boundingClientRect.top);
            return currentDistance < prevDistance ? current : prev;
          });
        }

        if (targetEntry) {
          const sectionId = sections.find(
            (s) => s.id === targetEntry.target.id,
          );
          if (sectionId) {
            setActiveSection(sectionId.id);
          }
        }
      },
      {
        rootMargin: INTERSECTION_MARGIN,
        threshold: [0, 0.25, 0.5, 0.75, 1],
      },
    );

    // Observe all sections
    sections.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [includeCourses, sections]);

  return (
    <nav className="resume-nav" aria-label="Resume sections">
      {sections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className={`resume-nav-link ${activeSection === section.id ? 'active' : ''}`}
          aria-current={activeSection === section.id ? 'location' : undefined}
        >
          {section.name}
        </a>
      ))}
    </nav>
  );
}
