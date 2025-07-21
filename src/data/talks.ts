export interface Talk {
  title: string;
  event: string;
  date: string;
  location: string;
  description: string;
  slides?: string;
  video?: string;
  attendees?: number;
  type: 'keynote' | 'workshop' | 'panel' | 'podcast';
}

export const talks: Talk[] = [
  {
    title: 'Breaking LLMs: A Red Team Approach',
    event: 'DEF CON 31',
    date: '2023-08-12',
    location: 'Las Vegas, NV',
    description: 'Demonstrated novel prompt injection techniques and defense strategies for production LLM systems.',
    slides: 'https://speakerdeck.com/mldangelo/breaking-llms',
    video: 'https://youtube.com/watch?v=example',
    attendees: 500,
    type: 'keynote',
  },
  {
    title: 'Scaling Identity Verification to 170M Users',
    event: 'QCon San Francisco',
    date: '2023-10-02',
    location: 'San Francisco, CA',
    description: 'Lessons learned building biometric systems across Africa: architecture, edge cases, and human impact.',
    slides: 'https://speakerdeck.com/mldangelo/scaling-identity',
    attendees: 300,
    type: 'keynote',
  },
  {
    title: 'Open Source Security by Default',
    event: 'Open Source Summit North America',
    date: '2023-05-10',
    location: 'Vancouver, BC',
    description: 'Why security tools must be accessible by default and how we approach it at Promptfoo.',
    video: 'https://youtube.com/watch?v=example2',
    attendees: 400,
    type: 'keynote',
  },
  {
    title: 'The Future of AI Safety',
    event: 'The AI Podcast with Lex Fridman',
    date: '2024-01-05',
    location: 'Remote',
    description: 'Two-hour discussion on red-teaming LLMs, AI alignment, and building safety tools.',
    video: 'https://lexfridman.com/michael-dangelo',
    type: 'podcast',
  },
  {
    title: 'Building ML Systems That Last',
    event: 'MLOps World',
    date: '2023-06-15',
    location: 'Toronto, ON',
    description: 'Workshop on building production ML systems with proper testing, monitoring, and security.',
    attendees: 120,
    type: 'workshop',
  },
  {
    title: 'Startup Lessons from 3 Exits',
    event: 'Startup Grind Global',
    date: '2023-02-20',
    location: 'Redwood City, CA',
    description: 'Panel discussion on technical co-founder challenges, fundraising, and scaling teams.',
    attendees: 200,
    type: 'panel',
  },
  {
    title: 'Computer Vision at Scale',
    event: 'CVPR 2022',
    date: '2022-06-20',
    location: 'New Orleans, LA',
    description: 'Technical deep-dive into building computer vision systems for identity verification.',
    slides: 'https://speakerdeck.com/mldangelo/cv-at-scale',
    attendees: 250,
    type: 'keynote',
  },
  {
    title: 'From Satellites to Software',
    event: 'Strange Loop',
    date: '2021-09-30',
    location: 'St. Louis, MO',
    description: 'How building satellites taught me about fault tolerance and system design.',
    video: 'https://youtube.com/watch?v=example3',
    attendees: 350,
    type: 'keynote',
  },
];

export const speakingTopics = [
  'LLM Security and Red-Teaming',
  'Building Developer Tools',
  'Scaling ML Systems',
  'Open Source Business Models',
  'Technical Leadership',
  'AI Safety and Alignment',
];

export const upcomingTalks = [
  {
    event: 'RSA Conference 2024',
    date: 'May 6-9, 2024',
    topic: 'Securing LLMs in Production',
  },
  {
    event: 'GitHub Universe 2024',
    date: 'October 29-30, 2024',
    topic: 'Open Source Security Tools',
  },
];