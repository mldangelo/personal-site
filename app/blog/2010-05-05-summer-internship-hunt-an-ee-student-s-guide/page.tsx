import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Summer Internship Hunt: An EE Student's Guide - Michael D'Angelo",
  description: "Applied to 50 internships, got 3 interviews, landed 1 offer. Here's my experience navigating the internship hunt as a sophomore EE.",
};

export default function BlogPost() {
  return (
    <>
      <article className="post" id="2010-05-05-summer-internship-hunt-an-ee-student-s-guide">
        <header>
          <h1 className="text-4xl font-bold mb-4">Summer Internship Hunt: An EE Student\'s Guide</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{new Date('2010-05-05').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • 12 min</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {['internship', 'career', 'job-search', 'interview'].map((tag) => (
              <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">{tag}</span>
            ))}
          </div>
        </header>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>Just accepted my first real engineering internship! After months of applications, rejections, and stress, I'll be working at a local aerospace company this summer. Here's the real story of finding an EE internship as a sophomore.</p>
          <h2>The Reality Check</h2>
          <p>Starting stats:</p>
          <ul>
            <li>Applications sent: 52</li>
            <li>Responses received: 8</li>
            <li>Phone interviews: 5</li>
            <li>In-person interviews: 3</li>
            <li>Offers: 1</li>
          </ul>
          <p>Success rate: 1.9%</p>
          <p>Brutal but typical for sophomores.</p>
          <h2>Timeline</h2>
          <p><strong>January</strong>: Started looking (too late!) <strong>February</strong>: Panic applied everywhere <strong>March</strong>: Interview marathon <strong>April</strong>: Waiting agony <strong>May</strong>: Finally, an offer!</p>
          <p>Lesson: Start in September for summer positions.</p>
          <h2>The Application Process</h2>
          <h3>Resume Reality</h3>
          <p>First version: 2 pages of high school fluff Final version: 1 page of relevant content</p>
          <p>What actually mattered:</p>
          <ul>
            <li>GPA (3.6)</li>
            <li>Relevant coursework</li>
            <li>Personal projects (CubeSat, Arduino stuff)</li>
            <li>Technical skills</li>
            <li>IEEE involvement</li>
          </ul>
          <p>What didn't:</p>
          <ul>
            <li>High school anything</li>
            <li>"Objective" statement</li>
            <li>Soft skills list</li>
            <li>References upon request</li>
          </ul>
          <h3>Cover Letter Evolution</h3>
          <p>First attempt: Generic 500-word essay Final approach: 3 paragraphs 1. Why this company specifically 2. What I bring (with examples) 3. Enthusiasm + contact info</p>
          <p>Customized first paragraph for EVERY company.</p>
          <h2>Where I Applied</h2>
          <h3>Big Companies (0/15 success)</h3>
          <ul>
            <li>Intel: Auto-rejected</li>
            <li>Texas Instruments: No response</li>
            <li>Lockheed Martin: "Need security clearance"</li>
            <li>Boeing: "Juniors and up only"</li>
            <li>NASA: LOL no</li>
          </ul>
          <p>Lesson: Big companies want juniors/seniors.</p>
          <h3>Medium Companies (1/20 success)</h3>
          <p>Regional aerospace and defense contractors. More willing to train sophomores. My success came here!</p>
          <h3>Small Companies (0/10 success)</h3>
          <p>Startups want immediate contributors. Can't afford training time. "Come back when you graduate"</p>
          <h3>University Research (0/7 success)</h3>
          <p>Super competitive. Professors want grad students. "Take my class first"</p>
          <h2>The Interview Experiences</h2>
          <h3>Phone Screen #1: Disaster</h3>
          <p>Company: Defense contractor Duration: 15 minutes (scheduled 30)</p>
          <p>Bombed technical questions: Q: "Explain Kirchhoff's laws" Me: <em>blanks completely</em></p>
          <p>Lesson: Review basics before EVERY interview.</p>
          <h3>Phone Screen #2: Better</h3>
          <p>Company: Test equipment manufacturer Duration: 45 minutes</p>
          <p>Prepared this time:</p>
          <ul>
            <li>Reviewed circuits, signals, programming</li>
            <li>Had projects ready to discuss</li>
            <li>Asked smart questions</li>
          </ul>
          <p>Made it to next round!</p>
          <h3>In-Person #1: The Stress Test</h3>
          <p>Company: Automotive electronics Format: 4 hours, 5 interviewers</p>
          <p>Technical portion:</p>
          <ul>
            <li>Design amplifier on whiteboard</li>
            <li>Debug circuit schematic</li>
            <li>Write code to read ADC</li>
            <li>Explain personal projects</li>
          </ul>
          <p>Behavioral portion:</p>
          <ul>
            <li>"Tell me about a time..." × 20</li>
            <li>Team conflict scenarios</li>
            <li>Why EE, why automotive</li>
          </ul>
          <p>Result: Rejected (wanted more experience)</p>
          <h3>In-Person #2: The Winner</h3>
          <p>Company: Aerospace contractor Format: 2 hours, panel interview</p>
          <p>Technical questions:</p>
          <ul>
            <li>Basic circuits (nailed it)</li>
            <li>Programming experience</li>
            <li>CubeSat involvement (huge plus!)</li>
            <li>Problem-solving scenarios</li>
          </ul>
          <p>Why it worked:</p>
          <ul>
            <li>They valued space interest</li>
            <li>CubeSat showed real experience</li>
            <li>Panel included recent grads (understood sophomore life)</li>
            <li>Company culture fit</li>
          </ul>
          <h2>What They Actually Asked</h2>
          <h3>Technical Questions</h3>
          <p>1. "Draw an op-amp inverting amplifier" 2. "What's the difference between C and C++?" 3. "How do you size a pull-up resistor?" 4. "Explain aliasing in sampling" 5. "Debug this circuit diagram"</p>
          <h3>Behavioral Questions</h3>
          <p>1. "Describe a challenging project" 2. "How do you handle deadlines?" 3. "Team conflict resolution?" 4. "Biggest failure and lessons?" 5. "Where do you see yourself in 5 years?"</p>
          <h3>Questions That Surprised Me</h3>
          <ul>
            <li>"What's your favorite equation?" (Said F=ma, explained why)</li>
            <li>"Design something right now" (Sketched temperature logger)</li>
            <li>"What do you do for fun?" (Mentioned personal projects)</li>
          </ul>
          <h2>Mistakes I Made</h2>
          <h3>Application Mistakes</h3>
          <ul>
            <li>Starting late (January vs September)</li>
            <li>Generic cover letters initially</li>
            <li>Typos in company names (instant reject)</li>
            <li>Not following up after applying</li>
          </ul>
          <h3>Interview Mistakes</h3>
          <ul>
            <li>Wearing full suit to casual company</li>
            <li>Not bringing copies of resume</li>
            <li>Forgetting interviewer names immediately</li>
            <li>Talking too much about coursework, not projects</li>
          </ul>
          <h3>Technical Prep Mistakes</h3>
          <ul>
            <li>Focusing on advanced topics, forgetting basics</li>
            <li>Not practicing coding on paper</li>
            <li>Memorizing without understanding</li>
            <li>Not asking clarifying questions</li>
          </ul>
          <h2>What Actually Helped</h2>
          <h3>Personal Projects</h3>
          <p>CubeSat involvement = 80% of interview discussions Shows:</p>
          <ul>
            <li>Real engineering experience</li>
            <li>Team collaboration</li>
            <li>Long-term commitment</li>
            <li>Technical depth</li>
          </ul>
          <p>Other projects mentioned:</p>
          <ul>
            <li>Arduino GPS logger</li>
            <li>Function generator build</li>
            <li>Logic analyzer project</li>
          </ul>
          <h3>IEEE Involvement</h3>
          <p>Officer position showed leadership. Competition participation showed initiative. Network led to one interview!</p>
          <h3>Professor Recommendation</h3>
          <p>Circuits professor connected me with alumnus. Led directly to interview. Relationships matter!</p>
          <h3>Interview Prep Resources</h3>
          <ul>
            <li>"Cracking the Coding Interview" (overkill but helpful)</li>
            <li>MIT OpenCourseWare for review</li>
            <li>YouTube electronics interviews</li>
            <li>Mock interviews with career center</li>
          </ul>
          <h2>The Negotiation (Ha!)</h2>
          <p>Offer: $18/hour, 40 hours/week, 12 weeks My negotiation: "Thank you, I accept!"</p>
          <p>As sophomore, zero leverage. Take what you can get.</p>
          <h2>Internship Details</h2>
          <p>Position: Electrical Engineering Intern Company: Regional aerospace contractor Team: Avionics testing</p>
          <p>Responsibilities:</p>
          <ul>
            <li>Test procedure development</li>
            <li>Data acquisition systems</li>
            <li>PCB layout assistance</li>
            <li>Documentation (lots of this)</li>
          </ul>
          <p>What I'm excited about:</p>
          <ul>
            <li>Real hardware testing</li>
            <li>Industry tools/processes</li>
            <li>Mentorship program</li>
            <li>Possible return offer</li>
          </ul>
          <h2>Advice for Other Sophomores</h2>
          <h3>Start Early</h3>
          <p>September for next summer. Not kidding.</p>
          <h3>Lower Expectations</h3>
          <p>You're competing with juniors/seniors. Any experience > no experience.</p>
          <h3>Leverage What You Have</h3>
          <ul>
            <li>Personal projects</li>
            <li>Relevant coursework</li>
            <li>Student org involvement</li>
            <li>Professors who like you</li>
          </ul>
          <h3>Apply Strategically</h3>
          <ul>
            <li>Medium-sized companies</li>
            <li>Companies near school</li>
            <li>Alumni connections</li>
            <li>Industry you're passionate about</li>
          </ul>
          <h3>Interview Prep</h3>
          <ul>
            <li>Review ALL basics</li>
            <li>Practice explaining projects</li>
            <li>Prepare questions to ask</li>
            <li>Mock interview multiple times</li>
          </ul>
          <h3>Stay Positive</h3>
          <p>50+ rejections is normal. You only need one yes. Each interview is practice.</p>
          <h2>For Freshmen</h2>
          <p>Start NOW:</p>
          <ul>
            <li>Join IEEE or similar</li>
            <li>Start personal projects</li>
            <li>Get to know professors</li>
            <li>Build skills outside class</li>
          </ul>
          <p>Sophomore year is late to start.</p>
          <h2>The Emotional Roller Coaster</h2>
          <p>January: "I'll have multiple offers!" February: "Why is no one responding?" March: "I'm unhireable garbage" April: "Retail job it is..." May: "HOLY CRAP I GOT ONE!"</p>
          <p>It's normal. Everyone goes through it.</p>
          <h2>What I Learned</h2>
          <p>1. <strong>Internships are competitive</strong>: But not impossible 2. <strong>Projects > GPA</strong>: Both matter, but projects more 3. <strong>Network works</strong>: That IEEE membership paid off 4. <strong>Persistence required</strong>: #52 was the winner 5. <strong>Any experience valuable</strong>: Even "boring" internships</p>
          <h2>Looking Forward</h2>
          <p>Goals for internship:</p>
          <ul>
            <li>Learn industry practices</li>
            <li>Build network</li>
            <li>Confirm EE is right path</li>
            <li>Get return offer</li>
            <li>Have fun!</li>
          </ul>
          <p>Will blog about experience this summer.</p>
          <h2>The Bottom Line</h2>
          <p>Finding internship as sophomore EE is hard. Most companies want juniors+. But it IS possible with:</p>
          <ul>
            <li>Early start</li>
            <li>Many applications</li>
            <li>Good projects</li>
            <li>Interview practice</li>
            <li>Persistence</li>
          </ul>
          <p>To fellow sophomores hunting: Keep going. Your yes is out there.</p>
          <p><em>T-minus 3 weeks until internship starts. Currently reading "The Art of Electronics" to prepare. Also practicing not being awkward in professional settings. Wish me luck!</em></p>
        </div>
      </article>
    </>
  );
}