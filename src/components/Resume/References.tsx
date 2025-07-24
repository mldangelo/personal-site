import React from 'react';

import Link from 'next/link';

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
