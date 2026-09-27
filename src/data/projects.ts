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
    title: 'Distributed MapReduce',
    subtitle: 'Fault-tolerant C++ library',
    link: 'https://github.com/vsricharan16/Distributed-MapReduce',
    image: '/images/projects/mapreduce.svg',
    date: '2023-01-02',
    desc: 'A C++ MapReduce library for distributed processing, with worker failure handling and load balancing.',
    tech: ['C++', 'Distributed Systems'],
    featured: true,
  },
  {
    title: 'Go Distributed Systems',
    subtitle: 'Algorithms and implementations',
    link: 'https://github.com/vsricharan16/Go-Distributed-Systems',
    image: '/images/projects/go-ds.svg',
    date: '2022-05-22',
    desc: 'Personal repository for learning Go and distributed-system principles and algorithms.',
    tech: ['Go', 'Distributed Systems'],
    featured: true,
  },
  {
    title: 'Linux Slab Allocator',
    subtitle: 'OS course project',
    link: 'https://github.com/vsricharan16/Linux-Slab-Allocator',
    image: '/images/projects/slab.svg',
    date: '2018-04-23',
    desc: 'A slab allocator implemented for an operating-systems course.',
    tech: ['C++', 'OS Internals'],
  },
  {
    title: 'N-Queens',
    subtitle: 'Constraint solving',
    link: 'https://github.com/vsricharan16/N-Queens',
    image: '/images/projects/nqueens.svg',
    date: '2018-04-23',
    desc: 'An N-Queens solver written in Prolog.',
    tech: ['Prolog'],
  },
];

export default data;
