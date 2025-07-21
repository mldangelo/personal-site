import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "First Robotics Competition: Lessons in Teamwork - Michael D'Angelo",
  description: "Our IEEE team entered a line-following robot competition. We didn't win, but learned invaluable lessons about engineering and teamwork.",
};

export default function BlogPost() {
  return (
    <>
      <article className="post" id="2009-11-21-first-robotics-competition-lessons-in-teamwork">
        <header>
          <h1 className="text-4xl font-bold mb-4">First Robotics Competition: Lessons in Teamwork</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{new Date('2009-11-21').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • 11 min</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {['robotics', 'competition', 'teamwork', 'ieee'].map((tag) => (
              <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">{tag}</span>
            ))}
          </div>
        </header>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>Just got back from the Western NY Robotics Competition. Our line-following robot, dubbed "Sparky," came in 5th out of 12 teams. Not bad for first-timers! Here's what happened and what we learned.</p>
          <h2>The Challenge</h2>
          <p>Build a robot that:</p>
          <ul>
            <li>Follows a black line on white surface</li>
            <li>Navigates through intersections correctly</li>
            <li>Completes course in minimum time</li>
            <li>Handles 90-degree turns and gaps</li>
            <li>Costs under $100</li>
          </ul>
          <p>Sounds simple. It wasn't.</p>
          <h2>Our Team</h2>
          <p>Four IEEE members with complementary skills:</p>
          <ul>
            <li>Me: Circuit design and sensors</li>
            <li>Dave: Mechanical design and construction</li>
            <li>Sarah: Programming and algorithms</li>
            <li>Mike: Power systems and motors</li>
          </ul>
          <h2>Week 1-2: Design Phase</h2>
          <h3>Initial Brainstorming</h3>
          <p>Spent hours debating:</p>
          <ul>
            <li>How many sensors? (Settled on 5 IR pairs)</li>
            <li>Which microcontroller? (ATmega328)</li>
            <li>Motor type? (DC with H-bridge)</li>
            <li>Chassis material? (Acrylic from scraps)</li>
          </ul>
          <h3>The Sensor Array</h3>
          <p>Built custom IR sensor board:</p>
          <ul>
            <li>5 TCRT5000 sensors in a line</li>
            <li>15mm spacing</li>
            <li>Adjustable height</li>
            <li>Calibration pots for each sensor</li>
          </ul>
          <p>First lesson: More sensors = better line tracking BUT harder calibration.</p>
          <h2>Week 3-4: Building</h2>
          <h3>Mechanical Challenges</h3>
          <p>Dave's first chassis was too heavy. Version 2 used thinner acrylic and hollow wheels. Weight dropped from 800g to 400g.</p>
          <h3>Electronic Gremlins</h3>
          <ul>
            <li>First H-bridge circuit fried immediately (forgot flyback diodes)</li>
            <li>IR sensors picked up ambient light (added shields)</li>
            <li>Battery voltage drop affected sensor readings (added voltage regulator)</li>
          </ul>
          <h3>The Algorithm Evolution</h3>
          <p>Started simple:</p>
          <pre className="language-c"><code>{`if (center_sensor == BLACK) {
    go_straight();
} else if (left_sensor == BLACK) {
    turn_left();
} else if (right_sensor == BLACK) {
    turn_right();
}`}</code></pre>
          <p>Too jerky. Sarah implemented PID control:</p>
          <pre className="language-c"><code>{`error = getLinePosition();
correction = Kp*error + Ki*integral + Kd*derivative;
setMotorSpeeds(baseSpeed - correction, baseSpeed + correction);`}</code></pre>
          <p>Much smoother!</p>
          <h2>Week 5: Integration Hell</h2>
          <p>Everything worked separately. Together? Disaster.</p>
          <ul>
            <li>Motors created EMI that scrambled sensor readings</li>
            <li>PID oscillated wildly</li>
            <li>Battery life: 10 minutes max</li>
          </ul>
          <p>Late nights in the lab. So much coffee. So many burned components.</p>
          <h2>Week 6: Testing and Tuning</h2>
          <p>Built a practice track in the IEEE lab:</p>
          <ul>
            <li>Electrical tape on whiteboard sheets</li>
            <li>Portable and reconfigurable</li>
            <li>Tested every possible track configuration</li>
          </ul>
          <h3>PID Tuning Marathon</h3>
          <p>Spent 12 hours straight tuning PID values:</p>
          <ul>
            <li>Too low: Lazy tracking, missed turns</li>
            <li>Too high: Oscillation city</li>
            <li>Just right: Smooth curves, crisp turns</li>
          </ul>
          <p>Final values: Kp=12, Ki=0.1, Kd=8</p>
          <h2>Competition Day</h2>
          <h3>The Venue</h3>
          <p>UB's field house. 12 teams from across NY state. Real judges. Pressure on.</p>
          <h3>Round 1: Disaster</h3>
          <p>Sparky immediately veered off course. Panic mode. Found the problem: Gym lights were 10x brighter than our lab. Sensors saturated.</p>
          <p>Emergency fix: Taped paper over sensors to reduce sensitivity.</p>
          <h3>Round 2: Redemption</h3>
          <p>Completed the course! Time: 34 seconds. Not winning speed, but respectable.</p>
          <h3>Round 3: Consistency</h3>
          <p>Another completion at 35 seconds. Reliability matters more than raw speed.</p>
          <h2>What Other Teams Did Better</h2>
          <h3>1st Place Team</h3>
          <ul>
            <li>Used camera instead of IR sensors</li>
            <li>OpenCV line detection</li>
            <li>Could "see" upcoming turns</li>
            <li>Completed course in 19 seconds</li>
          </ul>
          <p>Lesson: Sometimes better sensors trump better algorithms.</p>
          <h3>2nd Place Team  </h3>
          <ul>
            <li>Simple 3-sensor design</li>
            <li>Incredibly lightweight (200g)</li>
            <li>Blazing fast motors</li>
            <li>Sometimes simple wins</li>
          </ul>
          <h2>Lessons Learned</h2>
          <h3>Technical Lessons</h3>
          <p>1. <strong>Test in competition conditions</strong>: Our lab was too dark 2. <strong>EMI is real</strong>: Keep power and signal wires separated 3. <strong>Simpler can be better</strong>: Our 5-sensor array was overkill 4. <strong>Battery voltage matters</strong>: Performance degraded as battery drained</p>
          <h3>Teamwork Lessons</h3>
          <p>1. <strong>Assign clear roles</strong>: Overlapping responsibilities caused friction 2. <strong>Document everything</strong>: We lost time recreating forgotten solutions 3. <strong>Test early and often</strong>: Integration always takes longer 4. <strong>Celebrate small wins</strong>: Keeps morale up during setbacks</p>
          <h3>Personal Growth</h3>
          <ul>
            <li>Learned to accept "good enough" (perfectionism kills deadlines)</li>
            <li>Discovered I actually enjoy the pressure</li>
            <li>Made connections with students from other schools</li>
            <li>Realized I want to do more robotics</li>
          </ul>
          <h2>Budget Breakdown</h2>
          <ul>
            <li>Microcontroller: $8</li>
            <li>Motors & wheels: $25</li>
            <li>Sensors: $15</li>
            <li>H-bridge IC: $5</li>
            <li>Battery: $12</li>
            <li>Chassis material: Free (scrap)</li>
            <li>Miscellaneous: $20</li>
            <li>Coffee: $15 (essential component)</li>
          </ul>
          <p>Total: $100 exactly!</p>
          <h2>What\'s Next</h2>
          <p>Already planning for next year:</p>
          <ul>
            <li>Start earlier (6 months vs 6 weeks)</li>
            <li>Try computer vision approach</li>
            <li>Custom PCB instead of breadboard</li>
            <li>Maybe venture into maze-solving</li>
          </ul>
          <h2>For Future Competitors</h2>
          <p>1. <strong>Start simple</strong>: Get basic line following working first 2. <strong>Build modular</strong>: Easy to swap components 3. <strong>Keep a lab notebook</strong>: You'll forget what worked 4. <strong>Test weird conditions</strong>: Bright lights, rough surfaces, etc. 5. <strong>Have fun</strong>: It's about learning, not just winning</p>
          <h2>The Real Victory</h2>
          <p>We didn't win the competition, but we:</p>
          <ul>
            <li>Built something that actually worked</li>
            <li>Learned more in 6 weeks than in whole semester</li>
            <li>Bonded as a team through shared suffering</li>
            <li>Have war stories for future interviews</li>
          </ul>
          <h2>Final Thoughts</h2>
          <p>3 AM in the lab, covered in solder burns, debugging sensor noise while running on caffeine and determination - this is engineering school at its finest.</p>
          <p>To Sparky: You may not have been the fastest, but you were ours. And you finished the race.</p>
          <p>To my teammates: Same time next year?</p>
          <p><em>P.S. - Videos of Sparky in action posted on the IEEE website. Check out the spectacular Round 1 failure - it's educational, I swear!</em></p>
        </div>
      </article>
    </>
  );
}