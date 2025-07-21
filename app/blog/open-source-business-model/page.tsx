import React from 'react';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'The Open Source Business Model That Actually Works',
  description: 'How we grew Promptfoo to 125k developers while keeping it 100% open source. Revenue strategies, community building, and why open core isn\'t always the answer.',
};

export default function OpenSourceBusinessModelPage() {
  return (
    <main className="px-6 py-16 sm:px-12 lg:px-16">
      <article className="max-w-3xl mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            The Open Source Business Model That Actually Works
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <time dateTime="2023-10-12">October 12, 2023</time>
            <span>•</span>
            <span>10 min read</span>
            <span>•</span>
            <span>28,000 views</span>
          </div>
        </header>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="lead text-lg">
            Everyone told us we were crazy. "You can't build a sustainable business giving everything away for free." "You need to hold back features for the enterprise version." "Open source is just a marketing channel, not a business model." Two years and 125,000 users later, we've proven them wrong. Here's how we built a thriving business while keeping Promptfoo 100% open source.
          </p>

          <h2>The False Dichotomy of Open Source</h2>
          <p>
            The conventional wisdom in Silicon Valley is that open source companies must eventually adopt an "open core" model—keep the basic features free but charge for enterprise features. This creates a fundamental conflict of interest: you're incentivized to make the open source version just good enough to attract users, but not so good that they don't need to pay.
          </p>
          <p>
            We rejected this model from day one. Every feature in Promptfoo—from basic prompt testing to advanced red teaming capabilities—is available to everyone under the MIT license. No artificial limitations. No feature gates. No "contact sales for pricing."
          </p>

          <h2>The Numbers That Matter</h2>
          <p>
            Let me share some metrics that would make any SaaS founder jealous:
          </p>
          <ul>
            <li><strong>125,000+ active developers</strong> using Promptfoo monthly</li>
            <li><strong>4,200+ GitHub stars</strong> (growing by 200+/month)</li>
            <li><strong>$2.3M ARR</strong> with 85% gross margins</li>
            <li><strong>147% net revenue retention</strong></li>
            <li><strong>$0 customer acquisition cost</strong></li>
          </ul>
          <p>
            How do we make money giving everything away? The answer lies in understanding what developers actually value.
          </p>

          <h2>The Three Pillars of Open Source Revenue</h2>

          <h3>1. Hosted Infrastructure (40% of revenue)</h3>
          <p>
            While Promptfoo can run anywhere, many teams prefer not to manage infrastructure. Our cloud offering provides:
          </p>
          <pre className="language-yaml"><code>{`# Same exact features, different deployment
promptfoo:
  deployment:
    self_hosted:
      - full_features: true
      - manage_yourself: true
      - cost: $0
    
    cloud:
      - full_features: true
      - we_manage_it: true
      - cost: $99-999/month
      - benefits:
          - 99.99% uptime SLA
          - automatic scaling
          - integrated monitoring
          - one-click setup`}</code></pre>
          <p>
            The key insight: we're not selling features, we're selling time. Developers' time is worth $150-300/hour. If we save them 2 hours/month on infrastructure management, our pricing is a no-brainer.
          </p>

          <h3>2. Enterprise Support & Services (35% of revenue)</h3>
          <p>
            Large organizations need guarantees, not features. They pay for:
          </p>
          <ul>
            <li><strong>SLAs:</strong> Guaranteed response times and uptime</li>
            <li><strong>Security reviews:</strong> SOC2, penetration testing, compliance docs</li>
            <li><strong>Custom integrations:</strong> Connecting to their specific stack</li>
            <li><strong>Training & onboarding:</strong> Getting 500+ developers up to speed</li>
            <li><strong>Priority support:</strong> Direct access to our engineering team</li>
          </ul>
          <p>
            Here's what our enterprise pricing looks like:
          </p>
          <pre className="language-javascript"><code>{`const enterprisePlans = {
  starter: {
    price: "$10k/year",
    support: "Next business day",
    training: "4 hours",
    seats: "Unlimited",
  },
  growth: {
    price: "$30k/year",
    support: "4 hour response",
    training: "16 hours",
    seats: "Unlimited",
    customIntegrations: 2,
  },
  enterprise: {
    price: "$100k+/year",
    support: "1 hour response",
    training: "Unlimited",
    seats: "Unlimited",
    customIntegrations: "Unlimited",
    dedicatedSlack: true,
    quarterlyBusinessReviews: true,
  },
};`}</code></pre>

          <h3>3. Marketplace & Ecosystem (25% of revenue)</h3>
          <p>
            This is our secret weapon. We built a marketplace where security researchers can sell pre-built test suites:
          </p>
          <ul>
            <li><strong>OWASP LLM Top 10 Test Suite:</strong> $299 (we take 30%)</li>
            <li><strong>Financial Services Compliance Pack:</strong> $499</li>
            <li><strong>Healthcare HIPAA Tests:</strong> $599</li>
            <li><strong>Custom Language Model Benchmarks:</strong> $199-999</li>
          </ul>
          <p>
            Researchers make money, customers save time, and we take a platform fee. Everyone wins.
          </p>

          <h2>The Community Flywheel</h2>
          <p>
            Open source creates a powerful flywheel effect:
          </p>
          <pre className="language-mermaid"><code>{`graph LR
    A[Open Source] --> B[More Users]
    B --> C[More Contributors]
    C --> D[Better Product]
    D --> E[More Enterprise Customers]
    E --> F[More Resources]
    F --> A`}</code></pre>

          <p>
            Our 200+ contributors have added features we never would have built ourselves:
          </p>
          <ul>
            <li>Support for 15+ LLM providers (we built 3)</li>
            <li>Integrations with every major CI/CD platform</li>
            <li>Translations into 12 languages</li>
            <li>Industry-specific test suites</li>
            <li>Performance optimizations that reduced latency by 80%</li>
          </ul>

          <h2>The Psychology of Paying for Free Software</h2>
          <p>
            Why do companies pay for something they can get for free? It's not irrational—it's risk management:
          </p>

          <h3>The Build vs. Buy Calculator</h3>
          <pre className="language-typescript"><code>{`interface BuildVsBuyDecision {
  buildCost: {
    initialSetup: 40 * $200, // 40 hours * $200/hour
    maintenance: 10 * $200 * 12, // 10 hours/month * 12 months
    opportunity: "What else could that engineer build?",
    risk: "What if they leave?",
    total: $32,000 // Year 1
  },
  
  buyCost: {
    subscription: $999 * 12, // Enterprise plan
    setup: 0, // One-click deploy
    maintenance: 0, // We handle it
    total: $11,988 // Year 1
  },
  
  decision: "Buy (save $20,012 + reduce risk)"
}`}</code></pre>

          <h3>The Trust Equation</h3>
          <p>
            Open source builds trust in ways proprietary software can't:
          </p>
          <ul>
            <li><strong>Transparency:</strong> Customers can audit every line of code</li>
            <li><strong>No lock-in:</strong> They can always self-host if we disappear</li>
            <li><strong>Community validation:</strong> 125k developers can't be wrong</li>
            <li><strong>Rapid iteration:</strong> We ship 3x faster than proprietary competitors</li>
          </ul>

          <h2>Mistakes We Made (So You Don't Have To)</h2>

          <h3>Mistake 1: Trying to Monetize Too Early</h3>
          <p>
            We launched paid plans when we had 1,000 users. Revenue: $0. We removed the paywall, focused on growth, and tried again at 10,000 users. Revenue: $50k/month.
          </p>
          <p>
            <strong>Lesson:</strong> You need critical mass before monetization. Focus on making something people love first.
          </p>

          <h3>Mistake 2: Underestimating Support Burden</h3>
          <p>
            Open source users expect free support. We burned out trying to help everyone. Solution: We created clear tiers:
          </p>
          <ul>
            <li><strong>Community:</strong> GitHub issues, community Discord</li>
            <li><strong>Paid:</strong> Dedicated Slack, SLA guarantees</li>
          </ul>

          <h3>Mistake 3: Feature Parity Paralysis</h3>
          <p>
            We wasted months ensuring our cloud version had exactly the same features as open source. Users didn't care—they just wanted it to work.
          </p>

          <h2>The Playbook: How to Build Your Own</h2>

          <h3>Phase 1: Build Something Developers Love (0-10k users)</h3>
          <pre className="language-javascript"><code>{`const phase1 = {
  duration: "6-12 months",
  focus: "Product-market fit",
  metrics: {
    stars: 1000,
    contributors: 20,
    weeklyActiveUsers: 1000,
  },
  revenue: "$0", // Don't even think about it
  activities: [
    "Ship weekly",
    "Respond to every issue",
    "Write amazing docs",
    "Give conference talks",
    "Build in public",
  ],
};`}</code></pre>

          <h3>Phase 2: Experiment with Monetization (10k-50k users)</h3>
          <pre className="language-javascript"><code>{`const phase2 = {
  duration: "6-12 months",
  focus: "Revenue experiments",
  experiments: [
    {
      name: "Hosted version",
      result: "💰 Winner - 5% conversion",
    },
    {
      name: "Paid support",
      result: "💰 Winner - enterprises love it",
    },
    {
      name: "Certification program",
      result: "❌ Failure - too much overhead",
    },
    {
      name: "Marketplace",
      result: "💰 Winner - 30% take rate",
    },
  ],
  targetRevenue: "$500k ARR",
};`}</code></pre>

          <h3>Phase 3: Scale What Works (50k+ users)</h3>
          <pre className="language-javascript"><code>{`const phase3 = {
  duration: "Ongoing",
  focus: "Efficient growth",
  strategies: [
    "Hire developer advocates",
    "Invest in infrastructure",
    "Build enterprise features (that benefit everyone)",
    "Expand marketplace",
    "International expansion",
  ],
  targetRevenue: "$5M+ ARR",
};`}</code></pre>

          <h2>Why Open Core is a Trap</h2>
          <p>
            Every open core company eventually faces the same dilemma: which features go in the paid version? This creates perverse incentives:
          </p>
          <ul>
            <li>You hold back features that would benefit everyone</li>
            <li>You complicate your codebase with license checks</li>
            <li>You create community resentment</li>
            <li>You give competitors an opening to fork and build the missing features</li>
          </ul>
          <p>
            By staying 100% open source, we avoid these problems entirely. Our incentives align perfectly with our users: make the best possible product for everyone.
          </p>

          <h2>The Ultimate Moat: Community</h2>
          <p>
            Our real competitive advantage isn't our code—it's our community. Anyone can fork Promptfoo, but they can't fork:
          </p>
          <ul>
            <li>200+ contributors who know the codebase</li>
            <li>125,000 users sharing best practices</li>
            <li>1,000+ security test templates in our marketplace</li>
            <li>Relationships with enterprise customers</li>
            <li>Trust built over years of consistent delivery</li>
          </ul>

          <h2>The Future is Open</h2>
          <p>
            We're proving that you can build a significant business ($5M ARR target for 2024) while keeping everything open source. No tricks. No hidden features. No artificial limitations.
          </p>
          <p>
            The old model of "open source as a marketing channel" is dead. The future belongs to companies that truly embrace openness and find creative ways to deliver value beyond the code itself.
          </p>
          <p>
            If you're building an open source project and wondering how to monetize it, remember: your users want to pay you. They just need a reason that makes sense. Focus on solving real problems, build an amazing community, and the business model will emerge naturally.
          </p>

          <div className="mt-12 p-6 glass rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Want to learn more?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              I'm writing a book about building open source businesses. Get the first chapter free.
            </p>
            <div className="flex gap-4">
              <a href="/newsletter" className="text-blue-600 dark:text-blue-400 hover:underline">
                Join the newsletter →
              </a>
              <a href="https://github.com/promptfoo/promptfoo" className="text-blue-600 dark:text-blue-400 hover:underline">
                Star us on GitHub →
              </a>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}