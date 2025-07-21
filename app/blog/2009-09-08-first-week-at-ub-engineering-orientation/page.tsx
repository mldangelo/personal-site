import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">First Week at UB: Engineering Orientation</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="2009-09-08">September 7, 2009</time>
              <span>•</span>
              <span>3 min read</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">university</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">personal</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">engineering</span>
            </div>
          </header>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>Engineering orientation at UB is intense. Five days of placement tests, lab tours, and reality checks about what the next four years will look like.</p>
            <h2>The Numbers Game</h2>
            <p>They started orientation with statistics meant to scare us:</p>
            <ul>
              <li>40% of engineering students switch majors</li>
              <li>Average GPA: 2.8 (goodbye high school 4.0)</li>
              <li>Expected study time: 3 hours outside class for every hour in class</li>
              <li>First year \"weed out\" courses: Calculus, Physics, Chemistry</li>
            </ul>
            <p>The dean wasn\'t sugarcoating it: \"Look to your left, look to your right. One of you won\'t be here in two years.\"</p>
            <h2>Placement Tests</h2>
            <p>Three placement exams determined our starting point:</p>
            <ul>
              <li><strong>Math</strong>: Placed into Calculus I (dodged pre-calc, thankfully)</li>
              <li><strong>Chemistry</strong>: Straight to General Chemistry</li>
              <li><strong>Writing</strong>: Exempt from freshman composition (more time for engineering!)</li>
            </ul>
            <h2>Meeting My Cohort</h2>
            <p>The EE orientation group is about 60 students. Quick observations:</p>
            <ul>
              <li>90% male (disappointing but not surprising)</li>
              <li>Half seem to already know everything about circuits</li>
              <li>Other half (like me) wondering if we made the right choice</li>
              <li>Everyone comparing AP credits and SAT scores</li>
            </ul>
            <h2>Lab Tours</h2>
            <p>Got to see the senior design labs. Mind = blown. Students building:</p>
            <ul>
              <li>Autonomous robots</li>
              <li>Satellite communication systems</li>
              <li>Electric vehicle controllers</li>
              <li>Things I can\'t even identify yet</li>
            </ul>
            <p>Four years feels both too long and not nearly long enough to learn all this.</p>
            <h2>First Reality Check</h2>
            <p>During the \"Math Readiness\" session, the professor solved a differential equation on the board like it was basic arithmetic. When someone asked when we\'d learn that, he casually said \"sophomore year, if you make it.\" </p>
            <p>If you make it. Those three words are apparently the unofficial motto here.</p>
            <h2>Living Situation</h2>
            <p>Ellicott Complex, Spaulding Quad, 7th floor. Roommate is a business major who thinks I\'m crazy for choosing engineering. He\'s probably right. Already turned half our room into an electronics workbench. He\'s tolerating it... for now.</p>
            <h2>Academic Schedule Set</h2>
            <p>First semester locked in:</p>
            <ul>
              <li>EAS 140: Engineering Principles</li>
              <li>MTH 141: Calculus I  </li>
              <li>CHE 107: General Chemistry</li>
              <li>PHY 107: Physics I</li>
              <li>ENG 101: Engineering Computing</li>
            </ul>
            <p>17 credit hours. The advisors said this is \"normal.\" I\'m starting to realize engineering school has a different definition of normal.</p>
            <h2>Supply Run</h2>
            <p>First trip to the bookstore was painful:</p>
            <ul>
              <li>Textbooks: $800+ (and they say I\'ll need them all)</li>
              <li>TI-89 Calculator: $150 (required for exams)</li>
              <li>Lab notebook, safety glasses, other supplies: $100</li>
            </ul>
            <p>Starting to understand why engineers make good money - we spend it all on school first.</p>
            <h2>Initial Impressions</h2>
            <p>Buffalo is... different from home. The campus is huge, the wind is already cold in September, and everyone walks fast. The engineering building feels like home already though - full of people as obsessed with how things work as I am.</p>
            <p>Tomorrow: first actual classes. Tonight: reading the first chapters of five different textbooks and wondering if it\'s too late to switch to business.</p>
            <p>(It\'s not too late. But I won\'t. This is what I came here to do.)</p>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
