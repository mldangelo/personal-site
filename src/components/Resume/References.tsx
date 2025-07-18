import React from 'react';

import Link from 'next/link';

const References: React.FC = () => (
  <div className="mb-8">
    <div className="link-to" id="references" />
    <div className="text-center py-8 px-6 bg-background-alt dark:bg-gray-800/50 rounded-lg border border-border">
      <Link href="/contact" className="inline-block group">
        <h3 className="text-2xl font-heading font-heading-bold uppercase tracking-heading text-foreground-bold group-hover:text-accent transition-colors">
          References are available upon request
        </h3>
      </Link>
    </div>
  </div>
);

export default References;
