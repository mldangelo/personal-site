import React from 'react';

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: "Michael D'Angelo",
  url: 'https://mldangelo.com',
  image: 'https://mldangelo.com/images/me.jpg',
  sameAs: [
    'https://github.com/mldangelo',
    'https://www.linkedin.com/in/michaelldangelo',
    'https://twitter.com/dangelosaurus',
  ],
  jobTitle: 'Data Scientist & Machine Learning Engineer',
  worksFor: {
    '@type': 'Organization',
    name: 'Promptfoo',
    url: 'https://promptfoo.dev',
  },
  alumniOf: [
    {
      '@type': 'CollegeOrUniversity',
      name: 'Stanford University',
    },
    {
      '@type': 'CollegeOrUniversity',
      name: 'University at Buffalo',
    },
  ],
  knowsAbout: [
    'Machine Learning',
    'Data Science',
    'Full-Stack Development',
    'LLM Security',
    'Computer Vision',
  ],
};

export default function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
