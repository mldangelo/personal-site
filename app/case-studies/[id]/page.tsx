import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Main from '@/layouts/Main';

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
  details?: {
    background: string;
    approach: string[];
    technicalDetails: string;
    lessonsLearned: string[];
  };
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
    details: {
      background: 'The startup was experiencing rapid growth and their ML infrastructure couldn't keep up. Models that took days to train were blocking product iterations, and manual deployment processes were error-prone and time-consuming.',
      approach: [
        'Conducted infrastructure audit and identified bottlenecks',
        'Designed distributed training architecture using Horovod',
        'Implemented GitOps-based deployment pipelines',
        'Created comprehensive monitoring and alerting system',
        'Built automated testing framework for models',
      ],
      technicalDetails: 'The platform utilized Kubernetes for orchestration, with custom operators for ML workloads. Distributed training was achieved using Horovod with NCCL backend for GPU communication. Model artifacts were stored in S3 with metadata in PostgreSQL. Real-time inference was served through TorchServe with automatic scaling based on request latency.',
      lessonsLearned: [
        'Start with simple solutions and iterate based on actual bottlenecks',
        'Invest heavily in monitoring from day one',
        'Abstract infrastructure complexity from data scientists',
        'Automate everything that can be automated',
      ],
    },
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
    details: {
      background: 'The e-commerce platform was losing money due to delayed insights. By the time they identified conversion issues or successful campaigns, it was too late to capitalize on opportunities or mitigate problems.',
      approach: [
        'Migrated from batch to stream processing architecture',
        'Implemented event sourcing for reliable data capture',
        'Built custom aggregation engine for complex metrics',
        'Created responsive dashboard with real-time updates',
        'Established data quality monitoring',
      ],
      technicalDetails: 'Events were ingested through Kafka with schema validation using Avro. ClickHouse materialized views provided sub-second query performance for aggregations. The frontend used React with Redux for state management and Chart.js for visualizations. WebSocket connections ensured live updates without polling.',
      lessonsLearned: [
        'Schema evolution strategy is critical for streaming systems',
        'Pre-aggregation is key for real-time analytics performance',
        'Graceful degradation improves system reliability',
        'User feedback loops accelerate dashboard adoption',
      ],
    },
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
    details: {
      background: 'Planet Labs was rapidly scaling their satellite constellation and needed software that could handle the complexity of managing hundreds of satellites with minimal human intervention.',
      approach: [
        'Designed fault-tolerant distributed architecture',
        'Implemented comprehensive telemetry processing',
        'Built automated anomaly detection system',
        'Created simulation environment for testing',
        'Established 24/7 monitoring and alerting',
      ],
      technicalDetails: 'The system used C++ for performance-critical components with Python for orchestration. gRPC provided efficient inter-service communication. Redis cached satellite state for quick access. Time-series data was stored in InfluxDB with PostgreSQL for configuration and historical data.',
      lessonsLearned: [
        'Simulation and testing are crucial for space systems',
        'Automation reduces human error in critical operations',
        'Observability is essential for distributed systems',
        'Design for failure from the beginning',
      ],
    },
  },
];

export default function CaseStudyPage({ params }: { params: { id: string } }) {
  const study = caseStudies.find(s => s.id === params.id);
  
  if (!study) {
    notFound();
  }

  return (
    <Main>
      <article className="prose prose-gray dark:prose-invert max-w-none">
        <Link
          href="/case-studies"
          className="text-blue-600 dark:text-blue-400 hover:underline mb-6 inline-block"
        >
          ← Back to Case Studies
        </Link>

        <header className="mb-12">
          <div className="mb-4">
            <span className="text-gray-500 dark:text-gray-400">{study.client}</span>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-gray-500 dark:text-gray-400">{study.duration}</span>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-gray-500 dark:text-gray-400">{study.role}</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">{study.title}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">{study.summary}</p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">The Challenge</h2>
          <p className="text-gray-600 dark:text-gray-400">{study.challenge}</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">The Solution</h2>
          <p className="text-gray-600 dark:text-gray-400">{study.solution}</p>
        </section>

        {study.details && (
          <>
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Background</h2>
              <p className="text-gray-600 dark:text-gray-400">{study.details.background}</p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Approach</h2>
              <ol className="list-decimal list-inside space-y-2">
                {study.details.approach.map((step, index) => (
                  <li key={index} className="text-gray-600 dark:text-gray-400">
                    {step}
                  </li>
                ))}
              </ol>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Technical Details</h2>
              <p className="text-gray-600 dark:text-gray-400">{study.details.technicalDetails}</p>
            </section>
          </>
        )}

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Results</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {study.results.map((result, index) => (
              <div key={index} className="flex items-start p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <span className="text-green-600 dark:text-green-400 mr-3 text-xl">✓</span>
                <span className="text-gray-700 dark:text-gray-300">{result}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Technologies Used</h2>
          <div className="flex flex-wrap gap-2">
            {study.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {study.details && (
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Lessons Learned</h2>
            <ul className="space-y-2">
              {study.details.lessonsLearned.map((lesson, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-3">•</span>
                  <span className="text-gray-600 dark:text-gray-400">{lesson}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-16 p-8 bg-gray-50 dark:bg-gray-900 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Let's Work Together</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Have a similar challenge? I'd love to discuss how I can help.
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