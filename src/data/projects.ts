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
    title: 'Nearest Dollar',
    subtitle: '2015 BVP Hackathon',
    image: '/images/projects/nearestdollar.jpg',
    date: '2015-11-20',
    desc:
      'Connected to bank accounts to round up purchases and donate spare change to charity.',
    tech: ['React', 'Node.js', 'Plaid API', 'MongoDB'],
    featured: true,
  },
  {
    title: 'Harvest',
    subtitle: '3rd place at Techcrunch Disrupt SF',
    link: 'https://devpost.com/software/harvest',
    image: '/images/projects/harvest.jpg',
    date: '2015-09-20',
    desc:
      'Low-cost crop monitoring to catch irrigation leaks and nutrient deficiencies.',
    tech: ['Python', 'Arduino', 'Computer Vision', 'AWS'],
    featured: true,
  },
  {
    title: 'Space Potato',
    subtitle: 'Kickstarter-funded weather balloon',
    link: 'http://www.spacepotato.org',
    image: '/images/projects/spacepotato.jpg',
    date: '2015-06-28',
    desc:
      'Potato-powered weather balloon with cameras. Photos published in a coffee table book.',
    tech: ['Hardware', 'GPS', 'Photography'],
  },
  {
    title: 'Cat Detector',
    subtitle: 'CNN for cat breed classification',
    image: '/images/projects/catdetector.jpg',
    date: '2015-05-15',
    desc:
      'Classified 60,000+ cats across 80 breeds before server costs shut it down.',
    tech: ['Python', 'TensorFlow', 'CNN', 'AWS'],
  },
];

export default data;
