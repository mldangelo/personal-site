import React from 'react';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '10 Mistakes I Made as a First-Time CTO',
  description: 'Hard-won lessons from the trenches. What I wish I knew about hiring, architecture decisions, and managing technical debt at a hypergrowth startup.',
};

export default function StartupCTOMistakesPage() {
  return (
    <main className="px-6 py-16 sm:px-12 lg:px-16">
      <article className="max-w-3xl mx-auto">
        <header className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            10 Mistakes I Made as a First-Time CTO
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <time dateTime="2023-04-10">April 10, 2023</time>
            <span>•</span>
            <span>12 min read</span>
            <span>•</span>
            <span>35,000 views</span>
          </div>
        </header>

        <div className="prose prose-gray dark:prose-invert max-w-none">
          <p className="lead text-lg">
            I became CTO of SmileID at 26. We grew from 3 engineers to 45, from 100 API calls/day to 10 million, from 1 market to 8 countries. Along the way, I made every mistake in the book. Here are the expensive lessons I learned so you don't have to.
          </p>

          <h2>Mistake #1: Hiring for Skills, Not Slope</h2>
          <p>
            Early on, I was dazzled by resumes. Ex-Google engineer? Hired. 10 years of experience? Perfect. What I didn't realize: startup engineering is fundamentally different from big tech engineering.
          </p>
          <pre className="language-javascript"><code>{`// What I looked for (wrong)
const wrongHiringCriteria = {
  yearsOfExperience: 10,
  previousCompanies: ['Google', 'Facebook', 'Amazon'],
  leetcodeScore: 'Can solve hard problems',
  systemDesign: 'Designs for 1B users',
};

// What actually mattered
const rightHiringCriteria = {
  learningVelocity: 'Picks up new domains in days',
  ownershipMentality: 'Fixes problems outside their job description',
  pragmatism: 'Ships good enough solutions fast',
  communication: 'Explains complex things simply',
  customerEmpathy: 'Talks to users directly',
};`}</code></pre>
          <p>
            Our best engineer was a biology PhD who taught herself to code. She had 2 years of experience but learned faster than anyone. She's now our Principal Engineer.
          </p>
          <p>
            <strong>Lesson:</strong> In startups, trajectory matters more than current position. Hire slope, not Y-intercept.
          </p>

          <h2>Mistake #2: Over-Engineering from Day One</h2>
          <p>
            "We need to build for scale!" I declared, architecting a microservices platform for our... 100 daily users.
          </p>
          <pre className="language-yaml"><code>{`# Our insane initial architecture (for 100 users/day)
services:
  api-gateway:
    replicas: 3
    tech: Kong
  
  user-service:
    replicas: 3
    tech: Node.js
    database: PostgreSQL (primary + 2 replicas)
  
  auth-service:
    replicas: 3
    tech: Go
    cache: Redis Cluster
  
  biometric-service:
    replicas: 5
    tech: Python
    queue: RabbitMQ (HA mode)
  
  notification-service:
    replicas: 3
    tech: Node.js
    
  monitoring:
    - Prometheus
    - Grafana  
    - ELK Stack
    - Jaeger

# What we actually needed
monolith:
  tech: Django
  database: PostgreSQL
  cache: Redis
  monitoring: Sentry
  
# Total time wasted: 3 months
# Total over-engineering cost: $200,000`}</code></pre>
          <p>
            <strong>Lesson:</strong> Start with a monolith. Extract services when you have actual bottlenecks, not imaginary ones.
          </p>

          <h2>Mistake #3: Technical Debt Paranoia</h2>
          <p>
            I treated technical debt like radioactive waste. Every shortcut horrified me. Every TODO comment kept me up at night.
          </p>
          <pre className="language-typescript"><code>{`// My paranoid early approach
class UserService {
  // ❌ Spent 2 weeks building the "perfect" abstraction
  async createUser(data: CreateUserDTO): Promise<User> {
    // Validate with 3 different validators
    await this.validator.validate(data);
    await this.businessRules.validate(data);
    await this.securityValidator.validate(data);
    
    // Use factory pattern for... reasons
    const factory = this.userFactoryFactory.createFactory();
    const builder = factory.getBuilder();
    
    // Event sourcing for a CRUD app
    const events = [
      new UserCreatedEvent(data),
      new UserValidatedEvent(data),
      new UserPersistedEvent(data),
    ];
    
    await this.eventStore.store(events);
    await this.projectionEngine.project(events);
    
    return this.readModel.getUser(data.id);
  }
}

// What actually shipped features and made money
async function createUser(data) {
  // TODO: Add better validation later
  if (!data.email || !data.name) {
    throw new Error('Email and name required');
  }
  
  const user = await db.users.create(data);
  await sendWelcomeEmail(user.email);
  
  return user;
}`}</code></pre>
          <p>
            <strong>Lesson:</strong> Technical debt is a tool. Use it wisely to validate ideas fast. Pay it down when you know what's worth keeping.
          </p>

          <h2>Mistake #4: Building Everything In-House</h2>
          <p>
            "We're a tech company! We should build our own everything!" Famous last words.
          </p>
          <pre className="language-javascript"><code>{`// Things we built that we shouldn't have
const wastedEffort = {
  customLogger: {
    timeToBuild: '2 months',
    betterAlternative: 'Winston / Bunyan',
    reasonBuilt: 'We need custom formatting!',
  },
  
  jobQueue: {
    timeToBuild: '3 months',  
    betterAlternative: 'Bull / Agenda',
    reasonBuilt: 'RabbitMQ is overkill!',
    bugs: 47,
  },
  
  ormWrapper: {
    timeToBuild: '4 months',
    betterAlternative: 'Prisma / TypeORM',
    reasonBuilt: 'ORMs are too magical!',
    maintainers: 0, // Everyone quit
  },
  
  deploymentSystem: {
    timeToBuild: '6 months',
    betterAlternative: 'GitHub Actions',
    reasonBuilt: 'Jenkins is too complex!',
    downtimeHours: 72,
  },
};

// Total time wasted: 15 months
// Opportunity cost: 3 major features`}</code></pre>
          <p>
            <strong>Lesson:</strong> Your competitive advantage is not in building a better logger. Use boring, proven tools for everything except your core differentiator.
          </p>

          <h2>Mistake #5: Ignoring Developer Experience</h2>
          <p>
            I optimized for everything except the people writing code. Local dev setup took 2 days. Tests took 45 minutes. Deploys were manual SQL migrations at 3 AM.
          </p>
          <pre className="language-bash"><code>{`# Our "setup guide" (20 pages long)
# Step 1: Install dependencies (good luck)
brew install postgresql@12 redis mongodb elasticsearch kibana
pip install -r requirements.txt  # 200+ packages
npm install  # 30 minute install

# Step 2: Configure 15 environment variables
export DATABASE_URL=...
export REDIS_URL=...
export ELASTIC_URL=...
# ... 12 more

# Step 3: Run migrations (hope they work)
python manage.py migrate
python manage.py load_fixtures
python manage.py rebuild_search_index

# Step 4: Start 8 services
./start-all-services.sh  # Crashes if ports taken

# What we should have had
docker-compose up  # Done`}</code></pre>
          <p>
            After fixing developer experience:
          </p>
          <ul>
            <li>Onboarding time: 2 days → 2 hours</li>
            <li>Test runtime: 45 min → 3 min</li>
            <li>Deploy frequency: Weekly → 50x/day</li>
            <li>Developer happiness: 4/10 → 9/10</li>
          </ul>
          <p>
            <strong>Lesson:</strong> Developer productivity compounds. Every minute saved in the dev loop saves thousands of hours annually.
          </p>

          <h2>Mistake #6: Not Talking to Customers</h2>
          <p>
            I hid behind my screen, building what I thought customers wanted. Spoiler: I was wrong.
          </p>
          <pre className="language-typescript"><code>{`// Features I built that nobody used
const wastedFeatures = [
  {
    feature: 'Advanced Analytics Dashboard',
    devTime: '3 months',
    activeUsers: 0,
    problem: 'Customers just wanted a CSV export',
  },
  {
    feature: 'Real-time Collaboration',
    devTime: '4 months',
    activeUsers: 2,
    problem: 'Our users work alone',
  },
  {
    feature: 'AI-Powered Insights',
    devTime: '6 months',
    activeUsers: 5,
    problem: 'Nobody trusted the AI',
  },
];

// What customers actually asked for (in support tickets)
const actualRequests = [
  'Can you make the API faster?',  // 47 requests
  'We need better error messages',  // 31 requests
  'Webhook failures are silent',     // 28 requests
  'Documentation is confusing',      // 25 requests
];`}</code></pre>
          <p>
            <strong>Lesson:</strong> Engineers should talk to customers weekly. Build what they ask for, not what you think they need.
          </p>

          <h2>Mistake #7: Wrong Metrics Focus</h2>
          <p>
            I measured everything except what mattered.
          </p>
          <pre className="language-javascript"><code>{`// Metrics I obsessed over (vanity)
const vanityMetrics = {
  linesOfCode: 500000,
  testCoverage: '98%',
  apiLatencyP50: '12ms',
  githubStars: 1337,
  perfectLighthouseScore: 100,
};

// Metrics that actually mattered
const businessMetrics = {
  weeklyActiveCustomers: 245,
  customerChurnRate: '8%',
  averageRevenuePerUser: 850,
  timeToFirstApiCall: '3 days',  // Too long!
  supportTicketsPerCustomer: 2.4,  // Too high!
};

// The metric that saved us
const northStar = {
  metric: 'Successful API calls per customer per week',
  why: 'Directly correlates with customer value and retention',
  improved: '10x in 6 months after focusing on it',
};`}</code></pre>
          <p>
            <strong>Lesson:</strong> Measure business impact, not engineering prowess. Your beautiful code means nothing if customers churn.
          </p>

          <h2>Mistake #8: Hero Culture</h2>
          <p>
            I rewarded firefighting instead of fire prevention. The engineers who worked weekends became heroes. Those who wrote stable code were invisible.
          </p>
          <pre className="language-python"><code>{`# Our toxic hero culture
class HeroEngineer:
    def __init__(self):
        self.coffee_consumed = float('inf')
        self.hours_worked = 80
        self.weekend_deploys = 12
        
    def save_the_day(self):
        # Fix production at 3 AM
        hotfix = "TODO: Properly fix this later"
        deploy_without_review(hotfix)
        send_slack_message("🔥 Fixed prod! 🦸‍♂️")
        receive_praise()

# What we should have celebrated
class SustainableEngineer:
    def __init__(self):
        self.automated_tests_written = 200
        self.monitoring_alerts_added = 15
        self.documentation_pages = 30
        
    def prevent_fires(self):
        # Boring work that prevents 3 AM calls
        add_circuit_breaker()
        implement_gradual_rollout()
        write_runbook()
        # No praise, but everyone sleeps well`}</code></pre>
          <p>
            <strong>Lesson:</strong> Celebrate prevention, not heroics. The best engineers make the system so stable it's boring.
          </p>

          <h2>Mistake #9: Underestimating Security</h2>
          <p>
            "We'll add security later," I said. Later cost us $50,000 and nearly lost us our biggest customer.
          </p>
          <pre className="language-javascript"><code>{`// Security "features" we shipped
const securityDebt = {
  authentication: 'MD5 hashed passwords',  // 🤦
  apiKeys: 'Stored in plaintext',
  logging: 'Logs contained full credit cards',
  s3Buckets: 'Public read access',
  secrets: 'Hardcoded in code',
  
  theIncident: {
    date: '2019-03-15',
    description: 'Customer API keys exposed via public S3 bucket',
    impact: '10,000 API keys leaked',
    cost: {
      forensics: 15000,
      legalFees: 20000,
      customerCredits: 15000,
      reputationDamage: 'Immeasurable',
    },
  },
};

// What we do now (from day 1)
const securityFirst = {
  secrets: 'AWS Secrets Manager / Vault',
  authentication: 'bcrypt + 2FA required',
  authorization: 'RBAC with principle of least privilege',
  encryption: 'At rest and in transit',
  logging: 'PII automatically redacted',
  scanning: 'SAST/DAST in CI/CD',
  training: 'Quarterly security training for all engineers',
};`}</code></pre>
          <p>
            <strong>Lesson:</strong> Security debt compounds faster than technical debt. Build security in from the start.
          </p>

          <h2>Mistake #10: Not Building a Culture</h2>
          <p>
            I focused on building products, not building a team. Culture happened by accident, and accidents are rarely good.
          </p>
          <pre className="language-typescript"><code>{`// The culture that emerged naturally (bad)
const accidentalCulture = {
  communication: 'Slack at all hours',
  workLife: 'First to arrive, last to leave wins',
  decisions: 'Whoever argues loudest',
  knowledge: 'Tribal, undocumented',
  failure: 'Blame and shame',
  success: 'Individual heroics',
};

// The culture we intentionally built (good)
const intentionalCulture = {
  values: [
    'Written communication by default',
    'Sustainable pace over heroics',
    'Data-driven decisions',
    'Document everything',
    'Blameless postmortems',
    'Team success over individual glory',
  ],
  
  rituals: [
    'Weekly 1:1s with every engineer',
    'Monthly team retrospectives',
    'Quarterly hackathons',
    'Annual workations',
  ],
  
  results: {
    turnover: '40% → 5%',
    eNPS: '10 → 70',
    shippingVelocity: '3x improvement',
  },
};`}</code></pre>
          <p>
            <strong>Lesson:</strong> Culture is your only sustainable competitive advantage. Everything else can be copied.
          </p>

          <h2>The Meta Lesson</h2>
          <p>
            Looking back, my biggest mistake was thinking I had to have all the answers. The best CTOs I know aren't the smartest engineers—they're the ones who:
          </p>
          <ul>
            <li>Admit what they don't know</li>
            <li>Learn from mistakes quickly</li>
            <li>Build teams smarter than themselves</li>
            <li>Focus on outcomes, not outputs</li>
            <li>Create environments where others thrive</li>
          </ul>
          <p>
            If you're a first-time CTO, you will make mistakes. That's not failure—that's learning. The only real failure is making the same mistake twice.
          </p>

          <div className="mt-12 p-6 glass rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Learn More</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Want to avoid these mistakes? Here are resources that helped me:
            </p>
            <ul className="space-y-2">
              <li>
                <a href="https://www.elidedbranches.com/" className="text-blue-600 dark:text-blue-400 hover:underline">
                  "An Elegant Puzzle" by Will Larson
                </a>
              </li>
              <li>
                <a href="https://staffeng.com/" className="text-blue-600 dark:text-blue-400 hover:underline">
                  StaffEng - Stories of technical leadership
                </a>
              </li>
              <li>
                <a href="/contact" className="text-blue-600 dark:text-blue-400 hover:underline">
                  Reach out - Happy to share more lessons →
                </a>
              </li>
            </ul>
          </div>
        </div>
      </article>
    </main>
  );
}