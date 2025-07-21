import React from 'react';

import Link from 'next/link';

const References: React.FC = () => (
  <div>
    <p className="text-sm text-gray-600 dark:text-gray-400">
      References are available upon{' '}
      <Link href="/contact" className="hover:underline">
        request
      </Link>
      .
    </p>
  </div>
);

export default References;
