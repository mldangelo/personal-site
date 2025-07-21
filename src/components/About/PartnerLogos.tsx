'use client';

import React from 'react';

const partners = [
  { name: 'OpenAI', className: 'text-2xl font-semibold' },
  { name: 'Anthropic', className: 'text-2xl font-semibold' },
  { name: 'Google', className: 'text-2xl font-semibold' },
];

export default function PartnerLogos() {
  return (
    <div className="my-12">
      <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
        Trusted by leading AI companies
      </p>
      <div className="flex justify-center items-center gap-12 flex-wrap">
        {partners.map((partner) => (
          <div
            key={partner.name}
            className="text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
          >
            <span className={partner.className}>{partner.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
