import Link from 'next/link';
import React from 'react';

const References: React.FC = () => (
  <div className="references">
    <div className="link-to" id="references" />
    <div className="title">
      <Link href="/contact">
        <h3>References are available upon request</h3>
      </Link>
    </div>
  </div>
);

export default References;
