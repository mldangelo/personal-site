import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "First Lab Experience: Digital Logic Gates - Michael D'Angelo",
  description: "My first hands-on experience in the UB electronics lab - building basic logic gates and understanding truth tables.",
};

export default function BlogPost() {
  return (
    <>
      <article className="post" id="2009-09-19-first-lab-experience-digital-logic-gates">
        <header>
          <h1 className="text-4xl font-bold mb-4">First Lab Experience: Digital Logic Gates</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{new Date('2009-09-19').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • 6 min</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {['electronics', 'lab', 'digital-logic', 'university'].map((tag) => (
              <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">{tag}</span>
            ))}
          </div>
        </header>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>Just finished my first real lab session, and my mind is blown. We built actual logic gates using transistors! Here's what I learned and why it matters.</p>
          <h2>The Lab Setup</h2>
          <p>Walking into the lab for the first time was intimidating. Rows of workbenches, each with:</p>
          <ul>
            <li>Dual-channel oscilloscopes (way nicer than my garage sale find)</li>
            <li>Function generators</li>
            <li>Power supplies with multiple outputs</li>
            <li>More breadboards than I've ever seen</li>
          </ul>
          <p>And the smell - that distinctive electronics lab smell of solder flux and ozone.</p>
          <h2>Today\'s Mission: NAND Gate from Scratch</h2>
          <p>The TA handed us a bag of components:</p>
          <ul>
            <li>2N3904 NPN transistors</li>
            <li>Various resistors</li>
            <li>LEDs for output indication</li>
            <li>Wire. So much wire.</li>
          </ul>
          <p>The goal: build a NAND gate using only discrete components.</p>
          <h2>The Theory</h2>
          <p>A NAND gate outputs LOW only when both inputs are HIGH. In boolean algebra: Y = NOT(A AND B)</p>
          <p>Truth table: | A | B | Y | |---|---|---| | 0 | 0 | 1 | | 0 | 1 | 1 | | 1 | 0 | 1 | | 1 | 1 | 0 |</p>
          <h2>The Build</h2>
          <p>Here's the circuit we constructed: 1. Two transistors in series 2. Pull-up resistor to Vcc 3. Base resistors for current limiting 4. LED with current limiting resistor for output</p>
          <p>The magic moment: applying different input combinations and watching the LED respond correctly. It actually worked!</p>
          <h2>Debugging Adventures</h2>
          <p>Of course, it didn't work the first time:</p>
          <ul>
            <li>First attempt: LED always on (forgot to connect one transistor's emitter to ground)</li>
            <li>Second attempt: LED very dim (wrong resistor value - grabbed 10k instead of 1k)</li>
            <li>Third attempt: Success!</li>
          </ul>
          <h2>Why This Matters</h2>
          <p>This simple circuit is the building block of ALL digital electronics. Every computer, every smartphone, every digital device ultimately comes down to billions of these basic gates. Mind = blown.</p>
          <h2>Lab Partner Wisdom</h2>
          <p>My lab partner (shoutout to Dave) had this insight: "We just built the atom of the digital universe." He's not wrong.</p>
          <h2>Next Week</h2>
          <p>We're going to combine multiple gates to build more complex logic. Can't wait to see how these simple building blocks create complex systems.</p>
          <h2>Pro Tips for Future EE Students</h2>
          <p>1. <strong>Color code your wires</strong> - Seriously, use red for power, black for ground, other colors for signals 2. <strong>Check your connections twice</strong> - Most problems are just loose wires 3. <strong>Start simple</strong> - Test each component before combining them 4. <strong>Document everything</strong> - Lab notebooks aren't just for grades</p>
          <p>The journey from theory to working circuit is magical. One lab down, hundreds to go!</p>
        </div>
      </article>
    </>
  );
}