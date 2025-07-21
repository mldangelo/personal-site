import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Surviving Midterms: An EE Student's Guide - Michael D'Angelo",
  description: "Midterm week is here - sharing my study strategies and survival tips for fellow engineering students.",
};

export default function BlogPost() {
  return (
    <>
      <article className="post" id="2009-10-24-surviving-midterms-an-ee-student-s-guide">
        <header>
          <h1 className="text-4xl font-bold mb-4">Surviving Midterms: An EE Student\'s Guide</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{new Date('2009-10-24').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • 8 min</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {['university', 'studying', 'tips', 'personal'].map((tag) => (
              <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">{tag}</span>
            ))}
          </div>
        </header>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>It's 2 AM, I'm surrounded by circuit analysis problems, and I just realized I've been calculating the same Thevenin equivalent for an hour. Welcome to midterm week in Electrical Engineering. Here's how I'm surviving (barely).</p>
          <h2>The Midterm Lineup</h2>
          <p>This week's torture schedule:</p>
          <ul>
            <li>Monday: Calculus II (integrals from hell)</li>
            <li>Tuesday: Physics II (electromagnetics)</li>
            <li>Thursday: Circuit Analysis (the big one)</li>
            <li>Friday: Digital Logic (truth tables and K-maps)</li>
          </ul>
          <h2>My Study Strategy (What\'s Working)</h2>
          <h3>1. The Problem Set Marathon</h3>
          <p>Textbook reading < Problem solving. I'm doing every problem at the end of each chapter. Yes, even the ones not assigned. Here's why:</p>
          <ul>
            <li>Professors love pulling exam questions from unassigned problems</li>
            <li>Repetition builds speed (crucial for timed exams)</li>
            <li>You start seeing patterns</li>
          </ul>
          <h3>2. Study Group Dynamics</h3>
          <p>Found three classmates who are at my level. Key word: "my level." We all struggle with similar concepts, so no one feels stupid asking questions.</p>
          <p>Our format:</p>
          <ul>
            <li>Meet daily at 7 PM in the engineering library</li>
            <li>Each person "teaches" one topic</li>
            <li>Work through practice problems together</li>
            <li>Quiz each other on formulas</li>
          </ul>
          <h3>3. The Formula Sheet Strategy</h3>
          <p>For classes that allow formula sheets, I'm not just listing formulas:</p>
          <ul>
            <li>Include example problems</li>
            <li>Add common mistakes warnings</li>
            <li>Color code by topic</li>
            <li>Write units for EVERYTHING</li>
          </ul>
          <h2>What\'s Not Working</h2>
          <h3>1. All-Nighters</h3>
          <p>Tried it for the first exam. Result: Fell asleep during the test. Never again.</p>
          <h3>2. Just Reading Notes</h3>
          <p>Passive reading feels productive but isn't. Active problem-solving is king.</p>
          <h3>3. Cramming New Material</h3>
          <p>If I don't understand it 24 hours before the exam, I'm accepting the loss and focusing on what I do know.</p>
          <h2>Subject-Specific Strategies</h2>
          <h3>Circuit Analysis</h3>
          <ul>
            <li>Redraw circuits neatly before solving</li>
            <li>Check solutions using different methods (Nodal vs Mesh)</li>
            <li>Units and significant figures matter!</li>
          </ul>
          <h3>Digital Logic</h3>
          <ul>
            <li>K-map practice until it's automatic</li>
            <li>Truth table → Boolean expression → Circuit diagram</li>
            <li>Check work by working backwards</li>
          </ul>
          <h3>Physics E&M</h3>
          <ul>
            <li>Draw EVERYTHING</li>
            <li>Free body diagrams save lives</li>
            <li>Maxwell's equations are your friends</li>
          </ul>
          <h3>Calculus II</h3>
          <ul>
            <li>Integration by parts: LIATE method</li>
            <li>Trig substitutions: Memorize the big three</li>
            <li>Check derivatives of your integrals</li>
          </ul>
          <h2>The Survival Kit</h2>
          <p>Physical needs matter:</p>
          <ul>
            <li>Coffee (but not too much - jittery hands + circuits = bad)</li>
            <li>Healthy snacks (brain food, not just chips)</li>
            <li>Water bottle (dehydration kills focus)</li>
            <li>Good lighting (eye strain is real)</li>
            <li>Comfortable chair (you'll be there a while)</li>
          </ul>
          <h2>Time Management</h2>
          <p>Using the Pomodoro Technique:</p>
          <ul>
            <li>25 minutes focused study</li>
            <li>5 minute break</li>
            <li>Every 4 cycles: 15 minute break</li>
          </ul>
          <p>During breaks: Walk, stretch, look away from books. Don't check social media (it's a time vortex).</p>
          <h2>Mental Health Matters</h2>
          <p>This stuff is hard. It's okay to:</p>
          <ul>
            <li>Feel overwhelmed</li>
            <li>Not understand everything</li>
            <li>Take breaks</li>
            <li>Ask for help</li>
          </ul>
          <p>What's keeping me sane:</p>
          <ul>
            <li>Daily gym session (even just 30 minutes)</li>
            <li>Calling home twice a week</li>
            <li>One "fun" hour daily (guitar practice)</li>
            <li>Sleep (minimum 6 hours, non-negotiable)</li>
          </ul>
          <h2>The Grade Perspective</h2>
          <p>My roommate (a senior) shared this wisdom: "Nobody asks your GPA after your first job. They ask what you can build."</p>
          <p>Still want good grades, but it helps with perspective.</p>
          <h2>Emergency Protocols</h2>
          <p>When panic sets in: 1. Breathe (seriously, deep breaths) 2. Pick ONE problem to solve 3. Solve it completely 4. Move to the next 5. Progress > Perfection</p>
          <h2>Post-Midterm Recovery Plan</h2>
          <p>After Friday's last exam:</p>
          <ul>
            <li>Sleep for 12 hours</li>
            <li>Actual meal (not ramen)</li>
            <li>Call friends who aren't engineers</li>
            <li>Maybe see sunlight?</li>
          </ul>
          <h2>Looking Ahead</h2>
          <p>Three more years of this. But also:</p>
          <ul>
            <li>Each semester gets easier (you learn how to learn)</li>
            <li>The material gets more interesting</li>
            <li>You build a support network</li>
            <li>You realize you're capable of more than you thought</li>
          </ul>
          <h2>To My Fellow Sufferers</h2>
          <p>We're all in this together. That guy who seems to understand everything? He's struggling too, just hiding it better.</p>
          <p>Remember:</p>
          <ul>
            <li>One bad exam won't end your career</li>
            <li>Partial credit is your friend</li>
            <li>Show your work (even if it's wrong)</li>
            <li>You're learning to think, not just memorize</li>
          </ul>
          <p>Now back to Thevenin equivalents. This time I'll get it right.</p>
          <p>Good luck, everyone. See you on the other side of midterm week.</p>
          <p><em>Update: Will post results next week. Fingers crossed!</em></p>
        </div>
      </article>
    </>
  );
}