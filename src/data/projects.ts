export interface Project {
  title: string;
  subtitle?: string;
  link?: string;
  image: string;
  date: string;
  desc: string;
  tech?: string[];
  featured?: boolean;
}

const data: Project[] = [
  {
    title: 'Central de Ativos App',
    subtitle: 'Field companion app · Saraf',
    image: '/images/projects/central-ativos-app.jpg',
    date: '2026-03-01',
    desc: 'An offline-first companion app for field asset collection, built to integrate with the Central de Ativos web platform. Combines encrypted local storage with camera, geolocation, and barcode scanning for on-site audits, syncing seamlessly once back online.',
    tech: ['React Native', 'Expo', 'TypeScript', 'SQLite', 'TanStack Query'],
    featured: true,
  },
  {
    title: 'Central de Ativos',
    subtitle: 'Enterprise asset management platform · Saraf',
    image: '/images/projects/central-ativos.jpg',
    date: '2026-02-01',
    desc: 'A full rewrite of a legacy .NET asset-management system into a modern platform on Azure, achieving complete feature parity while modernizing performance, usability, and delivery. Backed by a Node.js/TypeScript REST API and a React 19 SPA with a custom design system.',
    tech: [
      'React 19',
      'TypeScript',
      'Vite',
      'Node.js',
      'Express',
      'Prisma',
      'Azure',
    ],
    featured: true,
  },
  {
    title: 'DrakkarOS Live Events Suite',
    subtitle: 'Tour operations SaaS · A Comic Soul',
    image: '/images/projects/drakkaros.jpg',
    date: '2026-01-01',
    desc: 'A multi-tenant SaaS unifying marketing, production, and planning data for European music and comedy tours into a single real-time system. Features a live dashboard, a drag-and-drop CMS, 16-language support, and a secure API integrating Google, Spotify, and WordPress.',
    tech: [
      'Vue 3',
      'TypeScript',
      'Node.js',
      'Express',
      'MySQL',
      'MongoDB',
      'Socket.IO',
    ],
    featured: true,
  },
];

export default data;
