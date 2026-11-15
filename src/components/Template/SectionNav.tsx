'use client';

import useActiveSection from '@/hooks/useActiveSection';

interface SectionNavProps {
  /** The landmark's accessible name. */
  label: string;
  /** The page's own class beside `section-nav`. */
  className: string;
  /** In document order. */
  sections: readonly { id: string; title: string }[];
}

/**
 * A page's sticky row of section links, marking the section in view.
 *
 * The hook lives here rather than in the page, so a change of section
 * re-renders this row and nothing else.
 */
export default function SectionNav({
  label,
  className,
  sections,
}: SectionNavProps) {
  const { activeId, navRef, onLinkClick } = useActiveSection(
    sections.map((section) => section.id),
  );

  return (
    <nav ref={navRef} className={`section-nav ${className}`} aria-label={label}>
      {/* The bar stays opaque while this row scrolls and fades inside it. */}
      <div className="section-nav-row">
        {sections.map((section) => {
          const current = activeId === section.id;

          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={
                current ? 'section-nav-link active' : 'section-nav-link'
              }
              aria-current={current ? 'location' : undefined}
              onClick={onLinkClick}
            >
              {section.title}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
