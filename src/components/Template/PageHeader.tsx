import type { ReactNode } from 'react';

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
}

const PageHeader = ({ eyebrow, title, children }: PageHeaderProps) => (
  <header className="mb-10">
    {eyebrow && (
      <p className="mb-2 font-mono text-xs tracking-widest text-accent uppercase">
        {eyebrow}
      </p>
    )}
    <h1 className="text-4xl font-semibold sm:text-5xl">{title}</h1>
    {children && <div className="mt-3 max-w-2xl text-muted">{children}</div>}
  </header>
);

export default PageHeader;
