import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">Midterm Survival Guide for EE Students</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="2009-11-05">November 4, 2009</time>
              <span>•</span>
              <span>5 min read</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">study-tips</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">university</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">engineering</span>
            </div>
          </header>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>Just survived my first engineering midterm week. Five exams in four days. I\'m alive, mostly functional, and have opinions about everything.</p>
            <h2>The Schedule From Hell</h2>
            <ul>
              <li>Monday: Calculus I (8 AM, because professors are sadists)</li>
              <li>Tuesday: Physics I (2 PM)</li>
              <li>Wednesday: Chemistry (8 AM), Digital Logic (3 PM)</li>
              <li>Thursday: Engineering Computing (6 PM)</li>
            </ul>
            <p>Sleep total: ~15 hours across 4 days</p>
            <p>Coffee consumed: Unknowable</p>
            <p>Will to live: Fluctuating</p>
            <h2>What Actually Worked</h2>
            <h3>1. Study Groups (With Rules)</h3>
            <p>Formed study group with three other EE students. Rules we established:</p>
            <ul>
              <li>One person explains concept to others</li>
              <li>No phones except for calculator apps</li>
              <li>45 min focused work, 15 min break</li>
              <li>Snacks are mandatory</li>
            </ul>
            <p>Teaching others revealed gaps in my understanding. If you can\'t explain it, you don\'t know it.</p>
            <h3>2. Practice Problems > Reading</h3>
            <p>Textbooks are sleep-inducing lies. What actually helped:</p>
            <ul>
              <li>Old exams (found in IEEE student lounge)</li>
              <li>Problem sets from MIT OpenCourseWare</li>
              <li>YouTube (PatrickJMT is a calculus god)</li>
              <li>Working problems until patterns emerged</li>
            </ul>
            <p>Read concepts once, do problems 10x.</p>
            <h3>3. The Formula Sheet Strategy</h3>
            <p>Allowed one page of notes for Physics. Strategy:</p>
            <ul>
              <li>Write out all formulas (obviously)</li>
              <li>Include one worked example per concept</li>
              <li>Color code by topic</li>
              <li>Write UNITS in big letters (lost 5 points for missing units)</li>
            </ul>
            <p>Making the sheet was more valuable than having it.</p>
            <h3>4. Sleep Strategically</h3>
            <p>All-nighters are a lie. Tried it for Calculus. Brain turned to mush by problem 3. New strategy:</p>
            <ul>
              <li>Study until 1 AM max</li>
              <li>Sleep 5-6 hours minimum</li>
              <li>20-minute power nap between exams</li>
              <li>Coffee 30 min before exam, not during study</li>
            </ul>
            <h2>What Failed Spectacularly</h2>
            <h3>1. Reading Everything</h3>
            <p>Tried to read all assigned chapters. Impossible. New approach:</p>
            <ul>
              <li>Skim chapter headings</li>
              <li>Read example problems</li>
              <li>Deep dive only on confusing topics</li>
              <li>Wikipedia often clearer than textbook</li>
            </ul>
            <h3>2. Solo Study for Chemistry</h3>
            <p>Thought I could self-study chemistry. Wrong. Joined study group after bombing first quiz. Chemistry requires discussion to understand \"why.\"</p>
            <h3>3. Memorization Without Understanding</h3>
            <p>Memorized Digital Logic truth tables without understanding. Exam had \"design a circuit to do X.\" Died inside. Understanding > memorization always.</p>
            <h2>Exam Day Tactics</h2>
            <h3>Before the Exam</h3>
            <ul>
              <li>Arrive 15 minutes early (seat choice matters)</li>
              <li>Bathroom stop mandatory (90-minute exams)</li>
              <li>Banana + coffee 30 minutes prior</li>
              <li>Review formula sheet, don\'t learn new things</li>
            </ul>
            <h3>During the Exam</h3>
            <ul>
              <li><strong>Scan everything first</strong> (5 minutes)</li>
              <li><strong>Do easy problems first</strong> (confidence boost)</li>
              <li><strong>Show ALL work</strong> (partial credit is life)</li>
              <li><strong>Skip and return</strong> (stuck = move on)</li>
              <li><strong>Check units</strong> (seriously, check units)</li>
              <li><strong>Use all time</strong> (found error in last 2 minutes)</li>
            </ul>
            <h3>The Partial Credit Game</h3>
            <p>Engineering professors give partial credit. Abuse this:</p>
            <ul>
              <li>Write down relevant formulas</li>
              <li>Draw diagrams</li>
              <li>Explain your thinking</li>
              <li>If stuck, write what you would do</li>
            </ul>
            <p>Got 7/10 on a problem I couldn\'t finish just for showing logical approach.</p>
            <h2>Subject-Specific Strategies</h2>
            <h3>Calculus I</h3>
            <ul>
              <li>Derivatives are just patterns</li>
              <li>Practice chain rule until it\'s automatic</li>
              <li>Related rates = draw picture always</li>
              <li>Check answers by taking derivative backwards</li>
            </ul>
            <h3>Physics I</h3>
            <ul>
              <li>Free body diagrams for EVERYTHING</li>
              <li>Keep track of coordinate systems</li>
              <li>Energy methods often easier than forces</li>
              <li>Significant figures matter (learned hard way)</li>
            </ul>
            <h3>Chemistry</h3>
            <ul>
              <li>Dimensional analysis is your friend</li>
              <li>Memorize polyatomic ions (no way around it)</li>
              <li>Practice Lewis structures until dreams</li>
              <li>Sig figs really matter here</li>
            </ul>
            <h3>Digital Logic</h3>
            <ul>
              <li>K-maps are just pattern recognition</li>
              <li>Practice Boolean algebra like math</li>
              <li>Build circuits to verify your work</li>
              <li>Truth tables for everything</li>
            </ul>
            <h3>Engineering Computing</h3>
            <ul>
              <li>Comment your code during exam</li>
              <li>Test with edge cases</li>
              <li>Pseudocode first, code second</li>
              <li>Partial credit for logical approach</li>
            </ul>
            <h2>The Caffeine Protocol</h2>
            <p>Optimized caffeine intake through trial and error:</p>
            <ul>
              <li>Morning: Regular coffee (baseline)</li>
              <li>Pre-exam: Espresso shot (performance)</li>
              <li>Post-exam: Green tea (comedown)</li>
              <li>Evening study: Tea only (sleep matters)</li>
            </ul>
            <p>Red Bull is a scam. Coffee is cheaper and works better.</p>
            <h2>Tools That Saved Me</h2>
            <h3>Physical</h3>
            <ul>
              <li><strong>Good calculator</strong> (TI-89 is worth it)</li>
              <li><strong>Colored pens</strong> (organizing work)</li>
              <li><strong>Foam earplugs</strong> (dorm is loud)</li>
              <li><strong>Whiteboard</strong> (2\'x3\' for wall)</li>
            </ul>
            <h3>Digital</h3>
            <ul>
              <li><strong>Anki</strong> (flashcards for formulas)</li>
              <li><strong>Wolfram Alpha</strong> (checking work)</li>
              <li><strong>Khan Academy</strong> (concept review)</li>
              <li><strong>GitHub</strong> (code backup)</li>
            </ul>
            <h2>The Post-Mortem</h2>
            <p>Grades came back:</p>
            <ul>
              <li>Calculus: 87% (B+)</li>
              <li>Physics: 82% (B)</li>
              <li>Chemistry: 78% (C+, need to improve)</li>
              <li>Digital Logic: 91% (A-)</li>
              <li>Computing: 95% (A)</li>
            </ul>
            <p>Average: 86.6%. Not bad for first engineering midterms.</p>
            <h2>Lessons for Next Time</h2>
            <ul>
              <li><strong>Start earlier</strong> (obvious but true)</li>
              <li><strong>Form study groups week 1</strong> (not week 6)</li>
              <li><strong>Office hours are gold</strong> (professors want to help)</li>
              <li><strong>Practice exams > everything</strong></li>
              <li><strong>Sleep is not optional</strong></li>
            </ul>
            <h2>The Mental Game</h2>
            <p>Engineering exams test:</p>
            <ul>
              <li>Problem-solving under pressure</li>
              <li>Time management</li>
              <li>Attention to detail</li>
              <li>Persistence when stuck</li>
              <li>Ability to function on no sleep</li>
            </ul>
            <p>It\'s not about being smartest. It\'s about being most prepared and most persistent.</p>
            <h2>Final Thoughts</h2>
            <p>Survived first engineering midterms. Battle scars:</p>
            <ul>
              <li>Permanent caffeine tolerance</li>
              <li>Ability to calculate derivatives in sleep</li>
              <li>New respect for upperclassmen</li>
              <li>Realization this is just the beginning</li>
            </ul>
            <p>But also: Solved problems I couldn\'t imagine 8 weeks ago. That\'s the addiction - the moment when impossible becomes possible.</p>
            <p>Now to catch up on sleep before finals...</p>
            <p><em>To future me reading this before finals: You survived midterms. You\'ll survive finals. But maybe start studying earlier this time?</em></p>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
