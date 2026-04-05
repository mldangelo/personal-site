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
    title: 'This site',
    subtitle: 'Portfolio',
    link: 'https://github.com/eliachrist/personal-site',
    image: '/images/me.jpg',
    date: '2026-04-01',
    desc: 'Personal site and resume, built with Next.js and exported as static HTML.',
    tech: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
    featured: true,
  },
];

export default data;
