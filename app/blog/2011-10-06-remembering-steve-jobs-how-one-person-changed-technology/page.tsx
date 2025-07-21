import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">Remembering Steve Jobs: How One Person Changed Technology</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="2011-10-06">October 5, 2011</time>
              <span>•</span>
              <span>4 min read</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">apple</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">steve-jobs</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">reflection</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">industry</span>
            </div>
          </header>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>Steve Jobs passed away yesterday at 56. As I write this, candles and flowers are appearing at Apple stores worldwide. For many in tech, we've lost more than a CEO - we've lost someone who showed us technology could be magical.</p>
            <h2>Why This Hits Different</h2>
            <p>Tech leaders come and go, but Jobs was different. He wasn't just building products; he was building a philosophy:</p>
            <ul>
              <li>Technology should be intuitive</li>
            </ul>
            <p>            - Design matters as much as specs</p>
            <p>            - The intersection of technology and liberal arts creates magic</p>
            <p>            - Perfect is possible if you're willing to fight for it</p>
            <p>            ## Personal Connection</p>
            <p>I'm writing this on a MacBook, with an iPhone in my pocket. But my connection to Jobs' work goes deeper than being a customer. His Stanford commencement speech in 2005 literally changed my perspective on education and career:</p>
            <p>*"Your time is limited, so don't waste it living someone else's life. Don't be trapped by dogma - which is living with the results of other people's thinking."*</p>
            <p>As an engineering student, I'd been following the traditional path: get good grades, get a good job, climb the ladder. Jobs made me question whether that was MY path or just the expected one.</p>
            <h2>The Engineer vs. The Artist</h2>
            <p>What fascinated me about Jobs was how he bridged the gap between engineering and art. In our CubeSat project, we focus on functionality - does it work? Jobs asked a different question - is it beautiful?</p>
            <p>This isn't frivolous. Beautiful design often leads to better functionality:</p>
            <ul>
              <li>The iPhone\'s touchscreen eliminated keyboard complexity</li>
            </ul>
            <p>            - The MacBook's unibody construction improved durability</p>
            <p>            - iOS's skeuomorphic design (love it or hate it) made computing approachable</p>
            <p>            ## Lessons for Engineers</p>
            <p>As someone building hardware, Jobs taught valuable lessons:</p>
            <h3>1. Integration Matters</h3>
            <p>Jobs obsessed over controlling the full stack - hardware, software, services. This went against industry wisdom (modularity, standards, openness), but it enabled experiences others couldn't match.</p>
            <h3>2. Say No</h3>
            <p>For every feature Apple shipped, they killed ten. In our satellite project, we constantly want to add "just one more sensor." Jobs showed that constraints force innovation.</p>
            <h3>3. Details Matter at Scale</h3>
            <p>Jobs famously obsessed over internal screws no user would see. Why? Because that attention to detail cascades. If you care about hidden screws, you'll definitely care about user-facing features.</p>
            <h3>4. Demo or Die</h3>
            <p>Jobs' keynotes were legendary because he showed, not told. Engineers often get lost in specs. Jobs reminded us that what matters is the experience.</p>
            <h2>The Dark Side</h2>
            <p>Let's be honest - Jobs wasn't a saint:</p>
            <ul>
              <li>Brutal to employees</li>
            </ul>
            <p>            - Binary worldview (brilliant or shit)</p>
            <p>            - Reality distortion field could cross into deception</p>
            <p>            - Took credit for others' work</p>
            <p>            But here's the thing: you can admire the work without idolizing the person. Learn from both his successes and failures.</p>
            <h2>What We\'ve Lost</h2>
            <p>Beyond products, Jobs represented something important:</p>
            <ul>
              <li>**Taste** - He had strong opinions about what was good</li>
            </ul>
            <p>            - <strong>Ambition</strong> - "Dent in the universe" level thinking</p>
            <p>            - <strong>Craftsmanship</strong> - Building things you're proud of</p>
            <p>            - <strong>Humanity</strong> - Technology should amplify human capabilities</p>
            <p>            ## The Future Without Jobs</p>
            <p>Apple will continue - they have brilliant people and a strong culture. But who picks up the philosophical torch? Who pushes the industry to think different?</p>
            <p>Maybe that's the real lesson. We shouldn't wait for the next Jobs. Each of us building technology should ask:</p>
            <ul>
              <li>Is this the best it can be?</li>
            </ul>
            <p>            - Does this respect the user?</p>
            <p>            - Am I proud to put my name on this?</p>
            <p>            - What would happen if I thought different?</p>
            <p>            ## Personal Reflection</p>
            <p>I never met Jobs, but he influenced my path. When I'm debugging satellite power systems at 3 AM, I remember that someone obsessed over every detail of the first iPhone until it was right. When I want to take shortcuts, I remember that the best products come from caring too much.</p>
            <h2>His Own Words</h2>
            <p>I'll end with my favorite Jobs quote, from that Stanford speech:</p>
            <p>*"Remembering that I'll be dead soon is the most important tool I've ever encountered to help me make the big choices in life. Because almost everything - all external expectations, all pride, all fear of embarrassment or failure - these things just fall away in the face of death, leaving only what is truly important."*</p>
            <p>Heavy words from someone who knew his time was limited. But also liberating.</p>
            <p>What are we building that truly matters? What dent are we making in the universe?</p>
            <p>Thank you, Steve, for showing us it was possible to think different. Now it's our turn to carry that forward.</p>
            <p>*Stay hungry. Stay foolish.*</p>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
