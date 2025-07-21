import React from 'react';

import type { Metadata } from 'next';

import ContactIcons from '@/components/Contact/ContactIcons';
import EmailLink from '@/components/Contact/EmailLink';

export const metadata: Metadata = {
  title: 'Contact',
  description: "Contact Michael D'Angelo via email @ michael@mldangelo.com",
};

export default function ContactPage() {
  return (
    <main className="px-6 py-16 sm:px-12 lg:px-16">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold mb-8">Contact</h1>

        <div className="space-y-8">
          <div>
            <p className="mb-4">Feel free to reach out via email:</p>
            <EmailLink />
          </div>

          <div>
            <p className="mb-4">You can also find me on:</p>
            <ContactIcons />
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400">
            I typically respond within 24-48 hours.
          </p>
        </div>
      </div>
    </main>
  );
}
