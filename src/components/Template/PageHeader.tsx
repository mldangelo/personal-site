import type { ReactNode } from 'react';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
}

const PageHeader = ({ eyebrow, title, children }: PageHeaderProps) => (
  <header className="pt-10 pb-12">
    {eyebrow && <p className="label mb-4 text-faint">{eyebrow}</p>}
    <h1 className="text-display leading-[1.08] font-serif">{title}</h1>
    {children && (
      <div className="mt-5 max-w-2xl leading-relaxed text-muted">
        {children}
      </div>
    )}
  </header>
);

export default PageHeader;
