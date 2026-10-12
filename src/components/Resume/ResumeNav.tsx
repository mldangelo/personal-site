'use client';

import useActiveSection from '@/hooks/useActiveSection';

const sections = [
  { name: 'Experience', id: 'experience' },
  { name: 'Education', id: 'education' },
  { name: 'Skills', id: 'skills' },
  { name: 'Courses', id: 'courses' },
  { name: 'References', id: 'references' },
] as const;

type SectionId = (typeof sections)[number]['id'];

const sectionIds: readonly SectionId[] = sections.map((section) => section.id);

export default function ResumeNav() {
  const { activeId, navRef, onLinkClick } = useActiveSection(sectionIds);

  return (
    <nav ref={navRef} className="resume-nav" aria-label="Resume sections">
      {/* The bar stays opaque while this row scrolls and fades inside it. */}
      <div className="resume-nav-row">
        {sections.map((section) => {
          const current = activeId === section.id;

          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              className={current ? 'resume-nav-link active' : 'resume-nav-link'}
              aria-current={current ? 'location' : undefined}
              onClick={onLinkClick}
            >
              {section.name}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
