import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">Reflecting on First Semester: What I Learned</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="2009-12-20">December 19, 2009</time>
              <span>•</span>
              <span>6 min read</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">reflection</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">personal</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">university</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">lessons</span>
            </div>
          </header>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>Finals are over. Grades are in. I survived my first semester of engineering school. Sitting in my empty dorm room (Mike left yesterday), it\'s time to process what just happened.</p>
            <h2>The Numbers</h2>
            <p>Final grades:</p>
            <ul>
              <li>Calculus I: B+ (87%)</li>
              <li>Physics I: B (83%)</li>
              <li>Chemistry: C+ (79%)</li>
              <li>Digital Logic: A- (91%)</li>
              <li>Engineering Computing: A (94%)</li>
              <li><strong>GPA: 3.33</strong></li>
            </ul>
            <p>Not the 4.0 I had in high school. But I learned more in 4 months than in 4 years of high school.</p>
            <h2>Academic Lessons</h2>
            <h3>What Worked</h3>
            <p><strong>Study groups</strong>: Explaining concepts to others revealed what I didn\'t understand. Teaching is the best learning.</p>
            <p><strong>Office hours</strong>: Professors actually want to help. Who knew? Started going week 10. Should have started week 1.</p>
            <p><strong>Practice problems</strong>: Reading textbook < solving problems. Every time.</p>
            <p><strong>Building projects</strong>: Abstract concepts become concrete when you build something. My Arduino projects taught me more about programming than the computing class.</p>
            <h3>What Didn\'t Work</h3>
            <p><strong>Procrastination</strong>: \"I\'ll start tomorrow\" nearly killed me during midterms. </p>
            <p><strong>Solo studying chemistry</strong>: Chemistry requires discussion. My worst grade = subject I studied alone.</p>
            <p><strong>All-nighters</strong>: Useless. Brain stops working after 2 AM. Better to sleep 4 hours than study 4 more hours.</p>
            <p><strong>Perfectionism</strong>: Spent too much time on homework worth 2% instead of studying for exams worth 30%.</p>
            <h2>Technical Skills Gained</h2>
            <h3>Electronics</h3>
            <ul>
              <li>Can design and build basic circuits</li>
              <li>Understand what\'s inside the devices I use</li>
              <li>Read datasheets (mostly)</li>
              <li>Debug systematically (sometimes)</li>
              <li>Appreciate how much I don\'t know</li>
            </ul>
            <h3>Programming</h3>
            <ul>
              <li>C feels natural now</li>
              <li>Understand memory management</li>
              <li>Can write functioning code at 3 AM</li>
              <li>Version control saves lives</li>
              <li>Comments are for future me</li>
            </ul>
            <h3>General Engineering</h3>
            <ul>
              <li>Problem decomposition</li>
              <li>Order of magnitude estimation  </li>
              <li>Unit analysis prevents disasters</li>
              <li>Documentation habits</li>
              <li>Everything is trade-offs</li>
            </ul>
            <h2>Personal Growth</h2>
            <h3>Independence</h3>
            <p>Living away from home forces growth:</p>
            <ul>
              <li>Laundry doesn\'t do itself</li>
              <li>Ramen isn\'t a food group</li>
              <li>Sleep schedule matters</li>
              <li>Money runs out fast</li>
              <li>Calling home helps</li>
            </ul>
            <h3>Time Management</h3>
            <p>Learned the hard way:</p>
            <ul>
              <li>Calendar everything</li>
              <li>Say no sometimes</li>
              <li>Breaks prevent breakdowns</li>
              <li>Exercise isn\'t optional</li>
              <li>Fun isn\'t forbidden</li>
            </ul>
            <h3>Social Skills</h3>
            <p>Engineers aren\'t antisocial by nature, just busy:</p>
            <ul>
              <li>Found my people</li>
              <li>Study groups become friend groups</li>
              <li>Explaining tech to non-tech people is hard</li>
              <li>Networking starts now</li>
              <li>Balance is possible</li>
            </ul>
            <h2>The Unexpected Discoveries</h2>
            <h3>Buffalo</h3>
            <p>Came for school, discovering a city:</p>
            <ul>
              <li>Tech scene exists</li>
              <li>Wings really are better here</li>
              <li>Lake effect snow is real</li>
              <li>Rust belt charm grows on you</li>
              <li>Considering staying summers</li>
            </ul>
            <h3>Interests</h3>
            <p>Discovered new passions:</p>
            <ul>
              <li>Astrophotography (combining hobbies)</li>
              <li>Hardware hacking</li>
              <li>Teaching others</li>
              <li>Writing about tech</li>
              <li>Building community</li>
            </ul>
            <h3>Career Thoughts</h3>
            <p>Four months changed my perspective:</p>
            <ul>
              <li>Pure hardware might be limiting</li>
              <li>Software + hardware = powerful</li>
              <li>Startups look interesting</li>
              <li>Research could be fun</li>
              <li>Options are expanding</li>
            </ul>
            <h2>Mistakes Made (Learning Opportunities)</h2>
            <h3>Academic</h3>
            <ul>
              <li>Didn\'t read syllabus carefully (missed easy points)</li>
              <li>Bought every \"required\" textbook (half unopened)</li>
              <li>Skipped classes that recorded lectures (bad idea)</li>
              <li>Didn\'t backup code (lost 2 days work)</li>
              <li>Underestimated chemistry (needs more respect)</li>
            </ul>
            <h3>Personal  </h3>
            <ul>
              <li>Ate too much pizza (freshman 15 is real)</li>
              <li>Didn\'t exercise enough (brain needs it)</li>
              <li>Stayed up gaming too often</li>
              <li>Didn\'t explore city enough</li>
              <li>Called home too little</li>
            </ul>
            <h3>Technical</h3>
            <ul>
              <li>Fried an Arduino (reverse polarity)</li>
              <li>Burned through LEDs (resistors matter)</li>
              <li>Bought cheap tools (buy once, cry once)</li>
              <li>Didn\'t document early projects</li>
              <li>Hoarded components I\'ll never use</li>
            </ul>
            <h2>The People Who Mattered</h2>
            <h3>Mike (Roommate)</h3>
            <p>Business major who tolerated my 2 AM soldering. Taught me work-life balance. Still friends despite the burnt flux smell.</p>
            <h3>Study Group</h3>
            <p>Sarah (ChemE), Kevin (CompE), Lisa (EE). We suffered together. Group texts at 3 AM about integration by parts. Real friends.</p>
            <h3>Professor Chen</h3>
            <p>Digital Logic instructor who stayed after class to explain concepts. Wrote recommendation for summer internship. Mentorship matters.</p>
            <h3>Online Communities</h3>
            <p>Arduino forums, /r/ECE, Stack Overflow. Strangers who answered dumb questions. Internet can be beautiful.</p>
            <h2>Looking Forward</h2>
            <h3>Spring Semester Goals</h3>
            <p><strong>Academic</strong>:</p>
            <ul>
              <li>Start assignments when assigned</li>
              <li>Form study groups week 1</li>
              <li>Use office hours regularly</li>
              <li>Keep GPA above 3.5</li>
              <li>Don\'t fear chemistry</li>
            </ul>
            <p><strong>Technical</strong>:</p>
            <ul>
              <li>Complete one major project</li>
              <li>Contribute to open source</li>
              <li>Learn PCB design</li>
              <li>Start internship applications</li>
              <li>Document everything</li>
            </ul>
            <p><strong>Personal</strong>:</p>
            <ul>
              <li>Exercise 3x per week</li>
              <li>Explore Buffalo more</li>
              <li>Call home weekly</li>
              <li>Make non-engineering friends</li>
              <li>Sleep 6+ hours average</li>
            </ul>
            <h3>Summer Plans</h3>
            <p>Applied for internships. Backup: stay in Buffalo, take summer classes, work on projects. Either way, keep building.</p>
            <h3>Long-Term Thinking</h3>
            <p>One semester showed me possibilities. Considering:</p>
            <ul>
              <li>Embedded systems focus</li>
              <li>Maybe CS double major?</li>
              <li>Definitely study abroad</li>
              <li>Graduate school someday</li>
              <li>Building things forever</li>
            </ul>
            <h2>The Mindset Shift</h2>
            <h3>High School Me</h3>
            <ul>
              <li>Grades define worth</li>
              <li>Competition with classmates</li>
              <li>Learning for tests</li>
              <li>Future was abstract</li>
              <li>Success = following rules</li>
            </ul>
            <h3>Current Me</h3>
            <ul>
              <li>Learning defines growth</li>
              <li>Collaboration over competition</li>
              <li>Learning for building</li>
              <li>Future being built now</li>
              <li>Success = solving problems</li>
            </ul>
            <h2>Advice for Future Freshmen</h2>
            <ul>
              <li><strong>Start everything early</strong> - Seriously</li>
              <li><strong>Find your people</strong> - They exist</li>
              <li><strong>Build things</strong> - Theory + practice</li>
              <li><strong>Ask questions</strong> - No one knows everything</li>
              <li><strong>Take breaks</strong> - Burnout is real</li>
              <li><strong>Document journey</strong> - You\'ll forget</li>
              <li><strong>Embrace struggle</strong> - It\'s supposed to be hard</li>
              <li><strong>Stay curious</strong> - It\'s why we\'re here</li>
              <li><strong>Help others</strong> - Teaching reinforces learning</li>
              <li><strong>Enjoy it</strong> - These years are special</li>
            </ul>
            <h2>Gratitude</h2>
            <p>Thankful for:</p>
            <ul>
              <li>Parents who support this expensive journey</li>
              <li>Professors who care about teaching</li>
              <li>Classmates who share knowledge</li>
              <li>Buffalo for being home</li>
              <li>Coffee for existing</li>
              <li>Internet for infinite learning</li>
              <li>Opportunity to be here</li>
            </ul>
            <h2>The Verdict</h2>
            <p>Was it everything I expected? No.</p>
            <p>Was it harder? Yes.</p>
            <p>Was it worth it? Absolutely.</p>
            <p>Would I do it again? Already am.</p>
            <p>First semester: Survived and thrived.</p>
            <p>Seven more to go.</p>
            <p>Bring it on.</p>
            <p><em>Packing up the dorm room. Arduino in one box, dreams in another. See you next semester, Buffalo.</em></p>
            <h2>Final Stats</h2>
            <ul>
              <li>Coffee consumed: ~200 cups</li>
              <li>All-nighters: 4 (too many)</li>
              <li>Components burned: 12</li>
              <li>Friends made: Countless</li>
              <li>Things learned: Infinite</li>
              <li>Regrets: Minimal</li>
            </ul>
            <p>Here\'s to freshman year. The foundation is laid. Time to build something amazing on it.</p>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
