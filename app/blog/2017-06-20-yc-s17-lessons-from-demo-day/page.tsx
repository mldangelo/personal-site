import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">YC S17: Lessons from Demo Day</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="2017-06-20">June 19, 2017</time>
              <span>•</span>
              <span>5 min read</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">yc</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">arthena</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">fundraising</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">startups</span>
            </div>
          </header>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>We just presented Arthena at Y Combinator Demo Day. Three months ago, I wrote about leaving Matroid to start an art investment platform. Now, after the legendary YC bootcamp, we've refined our vision, found product-market fit, and raised our seed round. Here's what we learned.</p>
            <h2>The YC Experience</h2>
            <p>Y Combinator is intense. The schedule:</p>
            <ul>
              <li>Tuesday dinners: Learn from successful founders</li>
            </ul>
            <p>            - Office hours: Get grilled by partners</p>
            <p>            - Group sessions: Present progress, get feedback</p>
            <p>            - Demo Day prep: Perfect your pitch</p>
            <p>            But the real value? Being surrounded by 130+ companies all pushing at maximum velocity.</p>
            <h2>How We Evolved</h2>
            <h3>Day 1 Pitch:</h3>
            <p>"We're building quantitative models for art investment."</p>
            <h3>Demo Day Pitch:</h3>
            <p>"Arthena is the first quantitative investment fund for art. We've built algorithms that identify undervalued artworks, and we've generated 24% returns in our pilot fund."</p>
            <p>The difference? Specificity, traction, and proof.</p>
            <h2>Key Lessons from YC</h2>
            <h3>1. Talk to Users (Even in Art)</h3>
            <p>PG's famous advice applies even to art investment. We interviewed 200+ potential investors and learned:</p>
            <ul>
              <li>They want exposure to art but lack expertise</li>
            </ul>
            <p>            - Minimum investments at traditional funds are too high ($1M+)</p>
            <p>            - They care more about returns than specific artists</p>
            <p>            - Transparency is desperately wanted</p>
            <p>            This shaped our entire product.</p>
            <h3>2. Revenue Solves Everything</h3>
            <p>Week 3: "How will you make money?"</p>
            <p>Week 6: "We have $500K in soft commits."</p>
            <p>Week 12: "We've closed $2M for our first fund."</p>
            <p>Having revenue changes every conversation.</p>
            <h3>3. Metrics Matter (Even for Art)</h3>
            <p>We track everything:</p>
            <ul>
              <li>Model accuracy on price predictions</li>
            </ul>
            <p>            - Portfolio performance vs. art indices</p>
            <p>            - Customer acquisition cost</p>
            <p>            - Investor NPS scores</p>
            <p>            Art world meets data science.</p>
            <h3>4. The Forcing Function</h3>
            <p>YC's greatest gift? Urgency. The program ends. Demo Day arrives. You can't delay.</p>
            <p>We launched our fund in week 4 because we had to show progress. Without that pressure, we'd still be perfecting models.</p>
            <h2>Technical Achievements</h2>
            <h3>The Algorithm</h3>
            <p>Our core innovation - using ML to predict art prices:</p>
            <ul>
              <li>Ingested 2M+ auction records</li>
            </ul>
            <p>            - Feature engineering on artist careers, market trends, historical patterns</p>
            <p>            - Ensemble model combining gradient boosting, neural nets, and traditional econometrics</p>
            <p>            - Backtested returns: 24% annually vs. 7% for art market</p>
            <p>            ### The Platform</p>
            <p>Built entire investment platform in 12 weeks:</p>
            <ul>
              <li>Investor portal for fund subscription</li>
            </ul>
            <p>            - Artwork analysis dashboard</p>
            <p>            - Portfolio optimization tools</p>
            <p>            - Automated document generation</p>
            <p>            - SEC-compliant fund structure</p>
            <p>            ### Data Moat</p>
            <p>Secured exclusive data partnerships:</p>
            <ul>
              <li>Major auction houses (can\'t name due to NDAs)</li>
            </ul>
            <p>            - Gallery sales data</p>
            <p>            - Private transaction records</p>
            <p>            Data is our competitive advantage.</p>
            <h2>Demo Day Results</h2>
            <p>Two-minute pitch to 600+ investors resulted in:</p>
            <ul>
              <li>50+ investor meetings scheduled</li>
            </ul>
            <p>            - Multiple term sheets</p>
            <p>            - Seed round oversubscribed</p>
            <p>            - Press coverage in TechCrunch, Forbes, WSJ</p>
            <p>            The validation was overwhelming.</p>
            <h2>Surprises Along the Way</h2>
            <h3>Art World Acceptance</h3>
            <p>Expected: Resistance from traditional art world</p>
            <p>Reality: Younger galleries and dealers excited about data-driven approach</p>
            <h3>Investor Demographics</h3>
            <p>Expected: Tech people wanting alternative investments</p>
            <p>Reality: 60% traditional art collectors wanting better returns</p>
            <h3>Regulatory Complexity</h3>
            <p>Expected: Some legal complexity</p>
            <p>Reality: Months of legal work for fund structure</p>
            <p>But we navigated it all.</p>
            <h2>Mistakes We Made</h2>
            <h3>1. Initial Positioning</h3>
            <p>First month: "We democratize art investment"</p>
            <p>Problem: Too vague, not differentiated</p>
            <p>Fixed: "Quantitative hedge fund for art"</p>
            <h3>2. Underestimating Operations</h3>
            <p>Thought: Algorithm is the hard part</p>
            <p>Reality: Operations (storage, insurance, authentication) equally complex</p>
            <h3>3. Fundraising Timeline</h3>
            <p>Assumed: Raise after demo day</p>
            <p>Reality: Should have started earlier</p>
            <h2>The Other YC Companies</h2>
            <p>Being part of S17 batch was inspiring:</p>
            <ul>
              <li>Companies tackling cancer diagnosis</li>
            </ul>
            <p>            - Satellites for IoT</p>
            <p>            - Next-gen databases</p>
            <p>            - Revolutionary fintech</p>
            <p>            The energy was infectious. When everyone around you is building the impossible, your own impossible seems achievable.</p>
            <h2>Advice for Future YC Founders</h2>
            <ul>
              <li>**Apply with traction** - We had pilot fund results</li>
            </ul>
            <ul>
              <li>**Move to Bay Area** - Remote participation is suboptimal</li>
            </ul>
            <ul>
              <li>**Clear your calendar** - YC becomes your life</li>
            </ul>
            <ul>
              <li>**Ship weekly** - Momentum matters more than perfection</li>
            </ul>
            <ul>
              <li>**Use the network** - Other founders are incredibly helpful</li>
            </ul>
            <ul>
              <li>**Prepare for intensity** - It\'s a sprint, not a marathon</li>
            </ul>
            <ul>
              <li>**Trust the process** - Even when advice seems wrong</li>
            </ul>
            <h2>What\'s Next for Arthena</h2>
            <p>Post-YC goals:</p>
            <ul>
              <li>Close $10M for Fund II</li>
            </ul>
            <p>            - Expand algorithm to contemporary art</p>
            <p>            - Build mobile app for investors</p>
            <p>            - Hire ML engineers and art experts</p>
            <p>            - Consider Series A in 12 months</p>
            <p>            ## Reflections</p>
            <p>Three months ago, Arthena was an idea. Now it's a funded company with real customers and proven returns. YC didn't create that success, but it compressed what might have taken years into months.</p>
            <p>The biggest lesson? In PG's words: "Make something people want." Even in the art world, that fundamental truth applies.</p>
            <h2>To Future Applicants</h2>
            <p>If you're considering YC, know this:</p>
            <ul>
              <li>It\'s harder than you expect</li>
            </ul>
            <p>            - It's more valuable than advertised</p>
            <p>            - You'll make lifelong friends</p>
            <p>            - You'll work harder than ever before</p>
            <p>            - You'll emerge transformed</p>
            <p>            The question isn't whether you'll succeed - it's whether you're ready for the intensity required to find out.</p>
            <p>*Thanks to our YC partners, batchmates, and investors who believed in bringing algorithms to art. The journey is just beginning.*</p>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
