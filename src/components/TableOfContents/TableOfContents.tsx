'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface Heading {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const pathname = usePathname();

  useEffect(() => {
    const elements = document.querySelectorAll('h2, h3, h4');
    const headingElements: Heading[] = [];
    
    elements.forEach((element) => {
      const text = element.textContent || '';
      const id = text.toLowerCase().replace(/[^\w]+/g, '-');
      element.id = id;
      
      headingElements.push({
        id,
        text,
        level: parseInt(element.tagName.charAt(1)),
      });
    });
    
    setHeadings(headingElements);
  }, [pathname]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-100px 0px -66%',
        threshold: 1.0,
      }
    );

    const elements = document.querySelectorAll('h2, h3, h4');
    elements.forEach((element) => observer.observe(element));

    return () => {
      elements.forEach((element) => observer.unobserve(element));
    };
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <div className="hidden xl:block">
      <div className="sticky top-24 max-h-[calc(100vh-6rem)] overflow-auto">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-100 mb-4">
          On this page
        </h2>
        <nav>
          <ul className="space-y-2">
            {headings.map((heading) => (
              <li
                key={heading.id}
                style={{ paddingLeft: `${(heading.level - 2) * 1}rem` }}
              >
                <a
                  href={`#${heading.id}`}
                  className={`
                    block text-sm py-1 transition-colors duration-200
                    ${
                      activeId === heading.id
                        ? 'text-blue-600 dark:text-blue-400 font-medium'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                    }
                  `}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(heading.id)?.scrollIntoView({
                      behavior: 'smooth',
                    });
                  }}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}