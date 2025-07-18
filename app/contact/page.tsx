import React from 'react';

import type { Metadata } from 'next';

import ContactIcons from '@/components/Contact/ContactIcons';
import EmailLink from '@/components/Contact/EmailLink';

export const metadata: Metadata = {
  title: 'Contact',
  description: "Contact Michael D'Angelo via email @ hi@mldangelo.com",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen py-20 flex items-center">
      <div className="container max-w-4xl mx-auto">
        <div className="space-y-12">
          {/* Header */}
          <div className="text-center space-y-4 animate-fade-up">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black">Get In Touch</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              I&apos;d love to hear from you
            </p>
          </div>

          {/* Email Section */}
          <div className="text-center space-y-6 animate-fade-up animation-delay-200">
            <p className="text-lg text-gray-700 dark:text-gray-300">
              Feel free to reach out via email:
            </p>
            <EmailLink />
          </div>

          {/* Social Icons */}
          <div className="animate-fade-up animation-delay-300">
            <ContactIcons />
          </div>

          {/* Additional Info */}
          <div className="text-center space-y-4 animate-fade-up animation-delay-400">
            <div className="card max-w-md mx-auto">
              <h3 className="text-lg font-semibold mb-2">Response Time</h3>
              <p className="text-gray-600 dark:text-gray-400">
                I typically respond within 24-48 hours. Looking forward to connecting!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
