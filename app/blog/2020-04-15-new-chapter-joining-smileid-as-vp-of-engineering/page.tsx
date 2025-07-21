import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">New Chapter: Joining SmileID as VP of Engineering</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="2020-04-15">April 14, 2020</time>
              <span>•</span>
              <span>5 min read</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">smileid</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">career</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">africa</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">identity-verification</span>
            </div>
          </header>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>After three and a half years building Arthena into the leading quantitative art investment platform, I'm starting a new adventure. Today, I'm joining SmileID as VP of Engineering to help build identity verification infrastructure for Africa.</p>
            <h2>Why Leave Arthena?</h2>
            <p>Arthena is in great shape:</p>
            <ul>
              <li>$50M+ in art assets under management</li>
            </ul>
            <p>            - Consistent returns beating art market indices</p>
            <p>            - Amazing team in place</p>
            <p>            - Clear path to profitability</p>
            <p>            But I've learned something about myself: I'm a builder, not an operator. The challenges that excite me - technical scaling, team building, solving novel problems - are less frequent when a company matures.</p>
            <h2>Why SmileID?</h2>
            <h3>The Problem Space</h3>
            <p>Identity verification in Africa is a massive unsolved problem:</p>
            <ul>
              <li>500M+ people lack formal ID documents</li>
            </ul>
            <p>            - Traditional KYC methods don't work</p>
            <p>            - Financial inclusion depends on identity</p>
            <p>            - Fraud rates are high without proper verification</p>
            <p>            SmileID is solving this with:</p>
            <ul>
              <li>Biometric verification (facial recognition)</li>
            </ul>
            <p>            - Document verification across 50+ African countries  </p>
            <p>            - ML models trained on African faces (crucial - most models have bias)</p>
            <p>            - API-first approach for developers</p>
            <p>            ### The Technical Challenge</p>
            <p>This role combines everything I love:</p>
            <ul>
              <li>**Scale**: Millions of verifications across unreliable networks</li>
            </ul>
            <p>            - <strong>ML Engineering</strong>: Novel problems in biometrics and fraud detection</p>
            <p>            - <strong>Distributed Systems</strong>: Services across multiple African countries</p>
            <p>            - <strong>Team Building</strong>: Growing from 6 to 50+ engineers</p>
            <p>            ### The Mission</p>
            <p>Financial inclusion isn't just a buzzword. Without identity verification:</p>
            <ul>
              <li>Can\'t open bank accounts</li>
            </ul>
            <p>            - Can't get loans</p>
            <p>            - Can't participate in digital economy</p>
            <p>            - Can't build credit history</p>
            <p>            We're building infrastructure that could improve hundreds of millions of lives.</p>
            <h2>Why Africa?</h2>
            <p>Friends ask: "Why focus on Africa from San Francisco?"</p>
            <p>My thoughts:</p>
            <ul>
              <li>**Massive opportunity**: 1.3B people, fastest-growing tech adoption</li>
            </ul>
            <ul>
              <li>**Leapfrogging**: Like mobile payments, Africa can skip legacy systems</li>
            </ul>
            <ul>
              <li>**Real impact**: Infrastructure built today shapes the continent\'s future</li>
            </ul>
            <ul>
              <li>**Technical challenges**: Constraints (bandwidth, devices) force innovation</li>
            </ul>
            <h2>What I Learned from Arthena</h2>
            <p>Running Arthena taught me invaluable lessons I'll apply at SmileID:</p>
            <h3>1. Domain Expertise Matters</h3>
            <p>At Arthena, understanding art markets was as important as building algorithms. At SmileID, understanding African regulatory environments, cultural nuances, and infrastructure challenges is crucial.</p>
            <h3>2. B2B Sales Cycles</h3>
            <p>Enterprise sales in traditional industries prepared me for fintech sales. Both require:</p>
            <ul>
              <li>Long relationship building</li>
            </ul>
            <p>            - Regulatory compliance</p>
            <p>            - Trust establishment</p>
            <p>            - Patient capital</p>
            <p>            ### 3. Algorithm Transparency</p>
            <p>Explaining art price predictions to collectors taught me to make ML interpretable. For identity verification, explaining why someone was flagged is even more critical.</p>
            <h3>4. Team Composition</h3>
            <p>Best teams combine domain experts with technical experts. Looking forward to working with people who deeply understand African markets.</p>
            <h2>Technical Priorities at SmileID</h2>
            <p>Based on initial conversations, my focus areas:</p>
            <h3>1. ML Infrastructure</h3>
            <ul>
              <li>Improve model training pipeline</li>
            </ul>
            <p>            - A/B testing framework for algorithms</p>
            <p>            - Bias detection and mitigation</p>
            <p>            - Active learning for edge cases</p>
            <p>            ### 2. Engineering Scale</p>
            <ul>
              <li>Grow team from 6 to 25+ this year</li>
            </ul>
            <p>            - Establish engineering culture</p>
            <p>            - Implement best practices</p>
            <p>            - Build for 100x growth</p>
            <p>            ### 3. Product Velocity</p>
            <ul>
              <li>Reduce deployment time</li>
            </ul>
            <p>            - Improve developer experience</p>
            <p>            - Better monitoring and observability</p>
            <p>            - API versioning strategy</p>
            <p>            ### 4. Reliability</p>
            <ul>
              <li>99.9%+ uptime across regions</li>
            </ul>
            <p>            - Graceful degradation</p>
            <p>            - Offline-first capabilities</p>
            <p>            - Edge computing where needed</p>
            <p>            ## The Transition</p>
            <p>Leaving something you built is hard. But I'm proud of what we accomplished at Arthena:</p>
            <ul>
              <li>Proved quantitative art investment works</li>
            </ul>
            <p>            - Generated consistent returns for investors</p>
            <p>            - Built amazing team and culture</p>
            <p>            - Opened art investment to new audiences</p>
            <p>            The company is in capable hands with my co-founders.</p>
            <h2>Remote Work in COVID Era</h2>
            <p>Starting a new role during COVID is strange:</p>
            <ul>
              <li>Haven\'t met team in person</li>
            </ul>
            <p>            - Onboarding via Zoom</p>
            <p>            - Building culture remotely</p>
            <p>            - Time zones across 3 continents</p>
            <p>            But it's also exciting - proves remote work can succeed, which is crucial for accessing African talent.</p>
            <h2>Personal Reflections</h2>
            <p>My career path:</p>
            <ul>
              <li>Hardware (satellites) → Software (Facebook) → ML (Stanford) → </li>
            </ul>
            <p>            - Startups (Matroid) → Art Tech (Arthena) → Fintech (SmileID)</p>
            <p>            Seems random but there's a thread: using technology to solve problems in traditional industries.</p>
            <h2>What Excites Me Most</h2>
            <ul>
              <li>**Impact at Scale**: Every improvement affects millions</li>
            </ul>
            <ul>
              <li>**Technical Challenges**: Biometrics + distributed systems + ML</li>
            </ul>
            <ul>
              <li>**Team Building**: Shaping engineering culture from early stage</li>
            </ul>
            <ul>
              <li>**Market Timing**: African tech is at inflection point</li>
            </ul>
            <ul>
              <li>**Learning Opportunity**: New domain, new challenges</li>
            </ul>
            <h2>Advice for Career Transitions</h2>
            <p>Having made several major transitions:</p>
            <ul>
              <li>**Optimize for learning**: Choose roles that stretch you</li>
            </ul>
            <ul>
              <li>**Trust your instincts**: If excited about problem space, go for it</li>
            </ul>
            <ul>
              <li>**References matter**: Past colleagues\' opinions are invaluable</li>
            </ul>
            <ul>
              <li>**Do diligence**: Understand the business, not just tech</li>
            </ul>
            <ul>
              <li>**Embrace uncertainty**: Growth happens outside comfort zone</li>
            </ul>
            <h2>To the Arthena Team</h2>
            <p>Thank you for an incredible journey. We proved skeptics wrong and built something special. Keep pushing the boundaries of what's possible in art investment.</p>
            <h2>To the SmileID Team</h2>
            <p>Excited to join you in building critical infrastructure for Africa. The problems we're solving matter. Let's build something transformative.</p>
            <h2>Looking Forward</h2>
            <p>In five years, I hope SmileID is the identity layer for African internet - enabling everything from banking to healthcare to commerce. The technical challenges are immense, but so is the opportunity.</p>
            <p>Here's to new beginnings, meaningful problems, and building infrastructure that matters.</p>
            <p>*Asante sana! (Thank you in Swahili - time to start learning!)*</p>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
