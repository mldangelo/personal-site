import React from 'react';
import Link from 'next/link';
import Main from '@/layouts/Main';
import Image from 'next/image';

interface CaseStudy {
  id: string;
  title: string;
  client: string;
  duration: string;
  role: string;
  summary: string;
  challenge: string;
  solution: string;
  results: string[];
  technologies: string[];
  image?: string;
  link?: string;
}

const caseStudies: CaseStudy[] = [
  {
    id: 'scalable-ml-platform',
    title: 'Building a Scalable ML Platform',
    client: 'Tech Startup',
    duration: '6 months',
    role: 'ML Infrastructure Lead',
    summary: 'Designed and implemented a distributed machine learning platform that reduced model training time by 80% and deployment time by 90%.',
    challenge: 'The company was struggling with long model training times, manual deployment processes, and inconsistent model performance across different environments. Data scientists were spending more time on infrastructure than on actual model development.',
    solution: 'Built a Kubernetes-based ML platform with automated model training pipelines, A/B testing infrastructure, and real-time model monitoring. Implemented distributed training using Horovod and created a model registry with versioning.',
    results: [
      '80% reduction in model training time',
      '90% reduction in deployment time',
      '3x increase in experiment velocity',
      'Automated rollback capabilities reduced incidents by 60%',
    ],
    technologies: ['Kubernetes', 'Python', 'PyTorch', 'MLflow', 'Airflow', 'Redis', 'PostgreSQL'],
  },
  {
    id: 'real-time-analytics',
    title: 'Real-Time Analytics Dashboard',
    client: 'E-commerce Platform',
    duration: '4 months',
    role: 'Full-Stack Engineer',
    summary: 'Developed a real-time analytics dashboard processing 100M+ events daily, providing instant insights into user behavior and sales metrics.',
    challenge: 'The existing batch processing system had a 24-hour lag, making it impossible to react quickly to trends or issues. The business needed real-time visibility into key metrics to make data-driven decisions.',
    solution: 'Implemented a streaming analytics pipeline using Apache Kafka and ClickHouse. Built a React-based dashboard with WebSocket connections for live updates. Created custom visualizations for complex metrics.',
    results: [
      'Reduced data latency from 24 hours to <1 minute',
      'Processed 100M+ events daily with 99.9% uptime',
      'Enabled real-time decision making for marketing campaigns',
      'Saved $200K/year by identifying and fixing conversion issues quickly',
    ],
    technologies: ['Apache Kafka', 'ClickHouse', 'React', 'TypeScript', 'WebSockets', 'Docker', 'Node.js'],
  },
  {
    id: 'satellite-software',
    title: 'Satellite Control Software',
    client: 'Planet Labs',
    duration: '2 years',
    role: 'Software Engineer',
    summary: 'Led development of mission-critical satellite control software managing 170+ satellites, ensuring reliable command and data handling.',
    challenge: 'Managing a constellation of 170+ satellites required highly reliable, fault-tolerant software. Any downtime could result in missed imaging opportunities or loss of satellite control.',
    solution: 'Developed a distributed system with automatic failover, comprehensive monitoring, and predictive maintenance capabilities. Implemented rigorous testing including hardware-in-the-loop simulations.',
    results: [
      '99.95% system uptime over 2 years',
      'Zero critical failures in production',
      'Reduced operator workload by 70% through automation',
      'Successfully scaled from 20 to 170+ satellites',
    ],
    technologies: ['C++', 'Python', 'gRPC', 'PostgreSQL', 'Redis', 'Prometheus', 'Grafana'],
  },
];

const CaseStudyCard = ({ study }: { study: CaseStudy }) => (
  <Link
    href={`/case-studies/${study.id}`}
    className="group block border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden hover:shadow-lg transition-all"
  >
    <div className="p-8">
      <div className="mb-4">
        <span className="text-sm text-gray-500 dark:text-gray-400">{study.client}</span>
        <span className="mx-2 text-gray-400">•</span>
        <span className="text-sm text-gray-500 dark:text-gray-400">{study.duration}</span>
      </div>
      
      <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {study.title}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {study.summary}
      </p>
      
      <div className="mb-6">
        <h4 className="font-semibold text-sm mb-2">Key Results:</h4>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          {study.results.slice(0, 2).map((result, index) => (
            <li key={index} className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              {result}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {study.technologies.slice(0, 4).map((tech) => (
          <span
            key={tech}
            className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded"
          >
            {tech}
          </span>
        ))}
        {study.technologies.length > 4 && (
          <span className="text-xs px-2 py-1 text-gray-500 dark:text-gray-400">
            +{study.technologies.length - 4} more
          </span>
        )}
      </div>
    </div>
  </Link>
);

export default function CaseStudiesPage() {
  return (
    <Main>
      <article className="prose prose-gray dark:prose-invert max-w-none">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Case Studies</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Deep dives into complex technical challenges and their solutions.
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
          {caseStudies.map((study) => (
            <CaseStudyCard key={study.id} study={study} />
          ))}
        </div>

        <section className="mt-16 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Work With Me</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Have a challenging technical problem? I love working on complex systems, 
            ML infrastructure, and scalability challenges.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get in touch →
          </Link>
        </section>
      </article>
    </Main>
  );
}