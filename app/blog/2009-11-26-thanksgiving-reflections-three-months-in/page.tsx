import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Thanksgiving Reflections: Three Months In - Michael D'Angelo",
  description: "Taking a break from circuits to reflect on my first semester of engineering school - the good, the bad, and the sleepless.",
};

export default function BlogPost() {
  return (
    <>
      <article className="post" id="2009-11-26-thanksgiving-reflections-three-months-in">
        <header>
          <h1 className="text-4xl font-bold mb-4">Thanksgiving Reflections: Three Months In</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{new Date('2009-11-26').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • 9 min</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {['personal', 'reflection', 'university', 'thanksgiving'].map((tag) => (
              <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">{tag}</span>
            ))}
          </div>
        </header>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>Home for Thanksgiving break, and my family keeps asking "How's college?" Here's the real answer - the one that's too long for dinner conversation.</p>
          <h2>The Academic Reality Check</h2>
          <p>High school me: "I'm good at math and science!" College me: "I know nothing. NOTHING."</p>
          <p>The workload is insane. Currently taking:</p>
          <ul>
            <li>Calculus II (integrals are my nightmare)</li>
            <li>Physics II (E&M makes mechanics look easy)</li>
            <li>Circuit Analysis (at least this makes sense)</li>
            <li>Digital Logic (actually fun!)</li>
            <li>Chemistry (why do EE majors need this?)</li>
            <li>English 101 (yes, engineers need to write)</li>
          </ul>
          <p>Average sleep: 5 hours. Coffee consumed: Approaching infinity.</p>
          <h2>What I\'m Thankful For</h2>
          <h3>The People</h3>
          <p>Found my tribe. In high school, I was "that weird kid who builds stuff." Here, everyone builds stuff. Conversations include:</p>
          <ul>
            <li>"Hey, want to see my robot?"</li>
            <li>"Anyone have a spare 10k resistor?"</li>
            <li>"Who's up for an all-nighter before the circuits exam?"</li>
          </ul>
          <p>Normal here is different, and I love it.</p>
          <h3>The Resources</h3>
          <p>Our lab is open 24/7. Let that sink in. Whenever inspiration strikes (usually at 2 AM), I can go build. Equipment that costs thousands, free to use. Professors who actually want to help. This access is incredible.</p>
          <h3>The Challenge</h3>
          <p>Yes, I'm thankful for the difficulty. High school was too easy. Here, I'm pushed to my limits daily. When you finally understand something that's been kicking your ass for weeks - that feeling is addictive.</p>
          <h2>The Surprises</h2>
          <h3>Good Surprises</h3>
          <ul>
            <li><strong>Professors are human</strong>: Office hours are actually helpful</li>
            <li><strong>Collaboration is encouraged</strong>: Not cheating if you work together</li>
            <li><strong>Practical application</strong>: We build stuff, not just theory</li>
            <li><strong>Girls in engineering</strong>: More than expected (still not many though)</li>
          </ul>
          <h3>Not-So-Good Surprises</h3>
          <ul>
            <li><strong>The cost of textbooks</strong>: $200 for a book I'll use once?</li>
            <li><strong>Prerequisites matter</strong>: Calc I was important, who knew?</li>
            <li><strong>Time management is crucial</strong>: Can't procrastinate like high school</li>
            <li><strong>Imposter syndrome is real</strong>: Everyone seems smarter</li>
          </ul>
          <h2>What I\'ve Built So Far</h2>
          <p>Beyond class projects:</p>
          <ul>
            <li>Temperature logger (Arduino-based)</li>
            <li>LED cube (4×4×4, animated)</li>
            <li>Power supply (0-15V variable)</li>
            <li>Line-following robot (competition entry)</li>
            <li>Various circuits that released magic smoke</li>
          </ul>
          <p>Each failure taught me something. Each success motivated the next project.</p>
          <h2>The Social Life Question</h2>
          <p>"Do engineering students have fun?"</p>
          <p>Define fun. Is debugging a circuit at 3 AM with friends fun? Is the victory pizza after getting a project working fun? Is joining IEEE and competing in robotics fun?</p>
          <p>Yes. But it's not "normal" college fun.</p>
          <p>Parties? Occasionally. But more often it's:</p>
          <ul>
            <li>LAN parties in the dorm</li>
            <li>Building competitions</li>
            <li>Late night philosophical discussions about technology</li>
            <li>Group study sessions that turn into teaching sessions</li>
          </ul>
          <h2>What\'s Hard</h2>
          <h3>The Math Wall</h3>
          <p>Calculus II is brutal. Integration by parts, trig substitution, infinite series - it's abstract and difficult. But then you use Fourier analysis in signals class and suddenly the math has purpose. Still hard though.</p>
          <h3>The Imposter Syndrome</h3>
          <p>Surrounded by people who built computers at age 10, won science fairs, or already know three programming languages. Meanwhile, I'm googling "how to use oscilloscope."</p>
          <p>Reality: Everyone's googling something. Nobody knows everything.</p>
          <h3>The Time Crunch</h3>
          <p>There's always more to do:</p>
          <ul>
            <li>Problem sets due</li>
            <li>Labs to complete</li>
            <li>Projects to build</li>
            <li>Exams to study for</li>
            <li>Sleep to catch up on (hah!)</li>
          </ul>
          <p>Learning to prioritize is a survival skill.</p>
          <h2>What I\'ve Learned (Beyond Academics)</h2>
          <p>1. <strong>Ask for help</strong>: Professors, TAs, classmates - use them 2. <strong>Form study groups</strong>: Different perspectives help 3. <strong>Document everything</strong>: Lab notebooks save lives 4. <strong>Take breaks</strong>: Burnout is real and counterproductive 5. <strong>Find your balance</strong>: All work = madness</p>
          <h2>Looking Back, Looking Forward</h2>
          <p>Three months ago, I was nervous about being smart enough. Now I realize it's not about being smart - it's about being persistent. When a circuit doesn't work, you debug. When you fail an exam, you study harder. When code won't compile, you fix it.</p>
          <p>Engineering isn't about knowing everything. It's about figuring things out.</p>
          <h2>What I Tell High School Seniors</h2>
          <p>Considering engineering? Here's the truth:</p>
          <ul>
            <li>It's harder than you think</li>
            <li>It's more rewarding than you imagine</li>
            <li>You'll question your choice weekly</li>
            <li>You'll be glad you chose it eventually</li>
          </ul>
          <p>Come prepared to work. Come prepared to fail. Come prepared to learn.</p>
          <h2>The Thanksgiving Part</h2>
          <p>So what am I actually thankful for?</p>
          <ul>
            <li>Parents who support this expensive journey</li>
            <li>Professors who stay late to explain concepts</li>
            <li>Classmates who share their notes</li>
            <li>Coffee (seriously, thank you coffee)</li>
            <li>The opportunity to learn how things work</li>
            <li>Being challenged every single day</li>
          </ul>
          <h2>Back to Reality</h2>
          <p>Break's almost over. Problem sets await. Projects need debugging. Exams loom on the horizon.</p>
          <p>But I'm excited to go back. That probably makes me crazy. Or an engineer.</p>
          <p>Same thing, really.</p>
          <p>To my fellow freshmen: We're 25% done with year one. We've got this.</p>
          <p>Now, where did I put that circuits textbook...</p>
        </div>
      </article>
    </>
  );
}