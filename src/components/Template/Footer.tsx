import React from 'react';

import Link from 'next/link';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Main',
      links: [
        { href: '/about', label: 'About' },
        { href: '/resume', label: 'Resume' },
        { href: '/projects', label: 'Projects' },
        { href: '/contact', label: 'Contact' },
      ],
    },
    {
      title: 'Content',
      links: [
        { href: '/writing', label: 'Writing' },
        { href: '/talks', label: 'Speaking' },
        { href: '/photography', label: 'Photography' },
        { href: '/press', label: 'Press Kit' },
      ],
    },
    {
      title: 'More',
      links: [
        { href: '/now', label: 'Now' },
        { href: '/uses', label: 'Uses' },
        { href: '/portfolio', label: 'Portfolio' },
        { href: '/stats', label: 'Stats' },
      ],
    },
    {
      title: 'Interactive',
      links: [
        { href: '/tools', label: 'Tools' },
        { href: '/terminal', label: 'Terminal' },
        { href: '/quest', label: 'Quest' },
        { href: 'https://github.com/mldangelo/personal-site', label: 'Source Code' },
      ],
    },
  ];

  const socialLinks = [
    { href: 'https://github.com/mldangelo', label: 'GitHub' },
    { href: 'https://linkedin.com/in/michaelldangelo', label: 'LinkedIn' },
    { href: 'https://twitter.com/dangelosaurus', label: 'Twitter' },
    { href: 'mailto:michael@mldangelo.com', label: 'Email' },
  ];

  return (
    <footer className="mt-auto border-t border-gray-200 dark:border-gray-800 px-6 py-12 sm:px-12 lg:px-16 no-print">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    {link.href.startsWith('http') ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                      >
                        {link.label} ↗
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-6">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                >
                  {link.label}
                </a>
              ))}
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400 text-center md:text-right">
              <p>© {currentYear} Michael D'Angelo</p>
              <p className="mt-1">
                Built with{' '}
                <a
                  href="https://nextjs.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Next.js
                </a>
                {' • '}
                <a
                  href="https://github.com/mldangelo/personal-site"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Fork this site
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;