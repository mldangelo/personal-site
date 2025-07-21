export interface Post {
  title: string;
  date: string;
  description: string;
  link?: string;
  tags: string[];
  readTime?: string;
  featured?: boolean;
  views?: number;
}

export const posts: Post[] = [
  {
    title: 'Breaking GPT-4: A Systematic Approach to LLM Security',
    date: '2024-01-15',
    description: 'How we discovered critical vulnerabilities in GPT-4 and built open-source tools to help others do the same. A deep dive into prompt injection, data exfiltration, and defense strategies.',
    link: '/blog/breaking-gpt4-security',
    tags: ['Security', 'AI', 'LLM'],
    readTime: '12 min',
    featured: true,
    views: 45000,
  },
  {
    title: 'Scaling Biometric Systems to 170 Million Users',
    date: '2023-11-28',
    description: 'Lessons learned building identity verification infrastructure across Africa. From 10 QPS to 10,000 QPS: architecture decisions, edge computing, and offline-first design.',
    link: '/blog/scaling-to-170m-users',
    tags: ['Scale', 'Architecture', 'Biometrics'],
    readTime: '18 min',
    featured: true,
    views: 32000,
  },
  {
    title: 'The Complete Guide to LLM Red Teaming',
    date: '2023-09-20',
    description: 'A comprehensive playbook for security teams. Covers automated testing, manual techniques, and how to build a red team program for AI systems.',
    link: '/blog/llm-red-teaming-guide',
    tags: ['Security', 'AI', 'Guide'],
    readTime: '25 min',
    featured: true,
    views: 52000,
  },
  {
    title: 'The Open Source Business Model That Actually Works',
    date: '2023-10-12',
    description: 'How we grew Promptfoo to 125k developers while keeping it 100% open source. Revenue strategies, community building, and why open core isn\'t always the answer.',
    link: '/blog/open-source-business-model',
    tags: ['Startup', 'Open Source', 'Business'],
    readTime: '10 min',
    views: 28000,
  },
  {
    title: 'Why We Rewrote Our ML Pipeline in Rust',
    date: '2023-08-15',
    description: '10x performance improvement and 90% cost reduction. A case study in migrating Python ML infrastructure to Rust, including benchmarks and lessons learned.',
    link: '/blog/rust-for-ml-infrastructure',
    tags: ['Rust', 'ML', 'Performance'],
    readTime: '15 min',
    views: 41000,
  },
  {
    title: 'What Building Satellites Taught Me About Software',
    date: '2023-07-03',
    description: 'Fault tolerance isn\'t optional when you can\'t push a hotfix to space. Engineering principles from aerospace that made me a better software developer.',
    link: '/blog/satellite-software-lessons',
    tags: ['Engineering', 'Aerospace', 'Reliability'],
    readTime: '8 min',
    views: 25000,
  },
  {
    title: 'A Taxonomy of Prompt Injection Attacks',
    date: '2023-05-22',
    description: 'Categorizing 500+ real-world prompt injections: direct vs indirect, single vs multi-stage, and emerging attack patterns in production systems.',
    link: '/blog/prompt-injection-taxonomy',
    tags: ['Security', 'AI', 'Research'],
    readTime: '20 min',
    views: 38000,
  },
  {
    title: '10 Mistakes I Made as a First-Time CTO',
    date: '2023-04-10',
    description: 'Hard-won lessons from the trenches. What I wish I knew about hiring, architecture decisions, and managing technical debt at a hypergrowth startup.',
    link: '/blog/startup-cto-mistakes',
    tags: ['Startup', 'Leadership', 'Engineering'],
    readTime: '12 min',
    views: 35000,
  },
  {
    title: 'Edge Computing in Emerging Markets: A Reality Check',
    date: '2023-02-28',
    description: 'Building for users with 2G connections and $20 phones. How we architected SmileID to work in rural Africa with 200ms latency tolerance.',
    link: '/blog/edge-computing-africa',
    tags: ['Architecture', 'Edge', 'Emerging Markets'],
    readTime: '14 min',
    views: 22000,
  },
  {
    title: 'Teaching Neural Networks with Tesla Coils',
    date: '2023-01-15',
    description: 'An unconventional approach to understanding transformers. Building a physical neural network with high voltage and real sparks.',
    link: '/blog/tesla-coil-neural-networks',
    tags: ['Hardware', 'ML', 'Education'],
    readTime: '16 min',
    views: 18000,
  },
  {
    title: 'Benchmarking LLM Security: A Data-Driven Approach',
    date: '2022-12-01',
    description: 'We tested 50+ LLMs against 10,000 attacks. Here\'s what we found about model vulnerabilities, defense effectiveness, and the security-capability tradeoff.',
    link: 'https://arxiv.org/abs/2212.00000',
    tags: ['Security', 'AI', 'Research'],
    readTime: '22 min',
  },
  {
    title: 'Go Microservices at Scale: SmileID Case Study',
    date: '2022-10-20',
    description: 'How we handle 10k QPS with 99.99% uptime using Go. Service mesh, distributed tracing, and lessons from 3 years in production.',
    link: '/blog/golang-at-scale',
    tags: ['Golang', 'Microservices', 'Scale'],
    readTime: '18 min',
    views: 30000,
  },
  {
    title: 'The Art of Fine Art: Building ML for $1.5B Valuations',
    date: '2022-08-10',
    description: 'Computer vision meets market analysis. How we built quantitative models to value fine art at Arthena, handling sparse data and subjective assessments.',
    link: '/blog/art-valuation-ml',
    tags: ['Machine Learning', 'Computer Vision', 'Finance'],
    readTime: '14 min',
    views: 19000,
  },
  {
    title: 'Distributed Tracing for ML Pipelines',
    date: '2022-06-15',
    description: 'Debugging ML systems at scale with OpenTelemetry. From data ingestion to model serving, how we trace requests across 100+ microservices.',
    link: '/blog/ml-distributed-tracing',
    tags: ['ML', 'Observability', 'Infrastructure'],
    readTime: '16 min',
    views: 15000,
  },
  {
    title: 'Building an Audio-Modulated Tesla Coil',
    date: '2022-03-20',
    description: 'From concept to 1 million volt musical lightning. A detailed build guide for one of the first audio-modulated Tesla coils, with schematics and safety protocols.',
    link: '/blog/audio-tesla-coil',
    tags: ['Hardware', 'Electronics', 'DIY'],
    readTime: '20 min',
    views: 12000,
  },
];

// Import historical posts
import { historicalPosts } from './historicalPosts';

// Combine current and historical posts, sorted by date
export const allPosts: Post[] = [...posts, ...historicalPosts].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);