import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">Leaving Matroid to Start Arthena: From Computer Vision to Art Tech</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="2016-08-15">August 14, 2016</time>
              <span>•</span>
              <span>5 min read</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">arthena</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">startups</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">career</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">entrepreneurship</span>
            </div>
          </header>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>Today marks a major transition: I'm leaving Matroid, the computer vision startup I co-founded eight months ago, to start something completely different - Arthena, a quantitative investment platform for art.</p>
            <p>Yes, you read that right. From AI to art. Let me explain.</p>
            <h2>The Matroid Journey</h2>
            <p>First, Matroid is in great hands. My co-founder Reza is brilliant, and the team we built is exceptional. The product - making computer vision accessible to non-technical users - has found product-market fit. They'll do great things.</p>
            <p>But over the past few months, I realized my passion lies elsewhere. The technology at Matroid is fascinating, but I kept being drawn to a different problem: the inefficiency of art markets.</p>
            <h2>Why Art? Why Now?</h2>
            <h3>The Problem Space</h3>
            <p>The art market is fascinatingly broken:</p>
            <ul>
              <li>$65 billion annual market</li>
            </ul>
            <p>            - Zero pricing transparency</p>
            <p>            - No quantitative analysis tools</p>
            <p>            - Massive information asymmetry</p>
            <p>            - Returns uncorrelated with traditional assets</p>
            <p>            Coming from tech, where everything is measured and optimized, art markets feel like stepping back in time.</p>
            <h3>The Personal Connection</h3>
            <p>My interest isn't random. Through Stanford connections, I met several art collectors and was shocked by how they made decisions:</p>
            <ul>
              <li>\"I like how it looks\"</li>
            </ul>
            <p>            - "My advisor recommended it"</p>
            <p>            - "The artist seems promising"</p>
            <p>            No data. No analysis. No portfolio theory. Just gut feelings and relationships.</p>
            <h3>The Opportunity</h3>
            <p>What if we could apply quantitative methods to art investment?</p>
            <ul>
              <li>Historical price analysis</li>
            </ul>
            <p>            - Market trend identification</p>
            <p>            - Portfolio optimization</p>
            <p>            - Risk assessment</p>
            <p>            - Liquidity analysis</p>
            <p>            Basically, bring art investing into the 21st century.</p>
            <h2>Why Leave Matroid?</h2>
            <p>Honestly? Founder-market fit.</p>
            <p>At Matroid, I was building cool technology, but I wasn't passionate about the use cases. Detecting objects in security cameras? Useful, but not inspiring to me.</p>
            <p>With Arthena, I see an opportunity to:</p>
            <ul>
              <li>Democratize art investment</li>
            </ul>
            <p>            - Apply data science to a traditional market</p>
            <p>            - Bridge technology and culture</p>
            <p>            - Build something truly unique</p>
            <p>            ## The Arthena Vision</p>
            <p>We're building the "Renaissance Technologies of art":</p>
            <ul>
              <li>Quantitative models for art valuation</li>
            </ul>
            <p>            - Algorithmic portfolio construction</p>
            <p>            - Data-driven acquisition strategies</p>
            <p>            - Technology platform for fractional ownership</p>
            <p>            Think of it as applying everything I learned in CME (optimization, ML, statistics) to a market that's never seen these tools.</p>
            <h2>Early Validation</h2>
            <p>We've already seen promising signals:</p>
            <ul>
              <li>Assembled dataset of 50,000+ auction results</li>
            </ul>
            <p>            - Built preliminary pricing models (65% accuracy on held-out data)</p>
            <p>            - Soft commitments from potential investors</p>
            <p>            - Advisors from both tech and art worlds</p>
            <p>            ## The Team</p>
            <p>Starting with two co-founders:</p>
            <ul>
              <li>Me: Technical/quantitative side</li>
            </ul>
            <p>            - [Co-founder]: Art market expertise + business development</p>
            <p>            Looking for:</p>
            <ul>
              <li>Data scientists passionate about art</li>
            </ul>
            <p>            - Engineers who appreciate culture</p>
            <p>            - Art experts open to quantitative methods</p>
            <p>            ## The Challenges</p>
            <p>I'm not naive. This will be hard:</p>
            <ul>
              <li>Art world is relationship-driven and traditional</li>
            </ul>
            <p>            - Data is fragmented and often private</p>
            <p>            - Regulatory complexity (art as investment)</p>
            <p>            - Skepticism from both tech and art communities</p>
            <p>            - Long sales cycles</p>
            <p>            But the best opportunities exist where industries resist change.</p>
            <h2>Why I\'m Excited</h2>
            <h3>Interdisciplinary Impact</h3>
            <p>This combines everything I've learned:</p>
            <ul>
              <li>Math/statistics from Stanford</li>
            </ul>
            <p>            - Engineering from undergrad</p>
            <p>            - Business from startup experience</p>
            <p>            - ML/data science from recent work</p>
            <p>            ### Market Timing</p>
            <ul>
              <li>Millennials want alternative investments</li>
            </ul>
            <p>            - Technology enabling fractional ownership</p>
            <p>            - Growing acceptance of "art as asset class"</p>
            <p>            - Regulatory clarity improving</p>
            <p>            ### Personal Growth</p>
            <p>Leading a company solo (initially) is terrifying but necessary for growth. At Matroid, I could hide behind technical work. Here, I have to do everything.</p>
            <h2>Lessons from Matroid</h2>
            <p>What I learned that applies to Arthena:</p>
            <ul>
              <li>**Team is everything** - Hire slowly, fire fast</li>
            </ul>
            <ul>
              <li>**Focus beats features** - Do one thing exceptionally well</li>
            </ul>
            <ul>
              <li>**Customer development** - Talk to users constantly</li>
            </ul>
            <ul>
              <li>**Move fast** - Perfect is the enemy of shipped</li>
            </ul>
            <ul>
              <li>**Fundraising is sales** - Tell a compelling story</li>
            </ul>
            <h2>The Path Forward</h2>
            <p>Next steps:</p>
            <ul>
              <li>Incorporate and establish legal structure</li>
            </ul>
            <ul>
              <li>Finish MVP of quantitative platform</li>
            </ul>
            <ul>
              <li>Secure initial art acquisition fund</li>
            </ul>
            <ul>
              <li>Apply to YC (why not?)</li>
            </ul>
            <ul>
              <li>Build out technical team</li>
            </ul>
            <h2>Reflections on Risk</h2>
            <p>Leaving a promising startup to start something in an industry I barely know? Sounds crazy. But:</p>
            <ul>
              <li>Downside is limited (can always get a job)</li>
            </ul>
            <p>            - Upside is massive (transforming a $65B market)</p>
            <p>            - Learning will be incredible regardless</p>
            <p>            - Regret minimization: I'd always wonder "what if?"</p>
            <p>            ## To My Matroid Team</p>
            <p>Thank you for an incredible journey. Building computer vision tools with you taught me so much. I'll be cheering from the sidelines and can't wait to see what you accomplish.</p>
            <h2>To Future Arthena Team</h2>
            <p>We're building something unprecedented. It will be hard, skeptics will be numerous, and we'll face resistance from traditionalists. But we have the opportunity to democratize access to one of humanity's greatest achievements - art.</p>
            <p>If you're interested in joining this journey, reach out.</p>
            <h2>Final Thoughts</h2>
            <p>Five years ago, I was building circuits in a university lab. Now I'm starting a company at the intersection of art and algorithms. The path has been anything but linear, and that's what makes it interesting.</p>
            <p>Here's to new beginnings, calculated risks, and bringing data to beautiful things.</p>
            <p>*Ars longa, vita brevis, data aeterna.*</p>
            <p>(Art is long, life is short, data is eternal.)</p>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
