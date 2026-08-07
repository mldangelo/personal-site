import type { ReactNode } from 'react';

interface SectionProps {
  /** Serif heading in the section's head bar. Omit for an unlabelled section. */
  title?: string;
  /** Optional trailing content in the head bar, right-aligned against the title. */
  aside?: ReactNode;
  id?: string;
  children: ReactNode;
}

/**
 * A ruled section: hairline on top, generous vertical padding, and a quiet
 * serif heading. The rule — never a card — is what separates content here.
 */
const Section = ({ title, aside, id, children }: SectionProps) => (
  <section id={id} className="border-t border-rule py-13">
    {(title || aside) && (
      <div className="mb-8 flex items-baseline justify-between gap-4">
        {title && <h2 className="text-section font-serif text-fg">{title}</h2>}
        {aside}
      </div>
    )}
    {children}
  </section>
);

export default Section;
