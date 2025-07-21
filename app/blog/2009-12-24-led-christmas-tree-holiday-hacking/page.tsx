import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "LED Christmas Tree: Holiday Hacking - Michael D'Angelo",
  description: "Nothing says \"Merry Christmas from an EE student\" like a custom-built LED Christmas tree with programmable patterns. Build log inside!",
};

export default function BlogPost() {
  return (
    <>
      <article className="post" id="2009-12-24-led-christmas-tree-holiday-hacking">
        <header>
          <h1 className="text-4xl font-bold mb-4">LED Christmas Tree: Holiday Hacking</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{new Date('2009-12-24').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • 11 min</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {['projects', 'led', 'christmas', 'microcontroller'].map((tag) => (
              <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">{tag}</span>
            ))}
          </div>
        </header>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>It's Christmas Eve, and instead of last-minute shopping, I'm in the garage building an LED Christmas tree. Because nothing says "holiday spirit" quite like programmable blinking lights and the smell of solder flux.</p>
          <h2>The Inspiration</h2>
          <p>Mom: "We need a small tree for the entrance table." Me: "I could build one out of LEDs..." Mom: "That's not what I—" Me: Already sketching circuits</p>
          <p>And thus, a project was born.</p>
          <h2>Design Constraints</h2>
          <ul>
            <li>Must be completed by Christmas morning (36 hours)</li>
            <li>Use only parts I have on hand</li>
            <li>Battery powered (no outlet nearby)</li>
            <li>Look somewhat tree-like</li>
            <li>Don't burn the house down</li>
          </ul>
          <h2>The Build Plan</h2>
          <h3>Structure</h3>
          <p>Create a cone-shaped wire frame, cover with green LEDs for the "tree," add colored LEDs for ornaments, yellow LED star on top.</p>
          <h3>Control</h3>
          <p>ATtiny85 microcontroller (overkill? probably. Fun? definitely.)</p>
          <ul>
            <li>8 pins total</li>
            <li>5 I/O pins available</li>
            <li>Just enough for charlieplexing</li>
          </ul>
          <h3>Power</h3>
          <p>4 AA batteries = 6V Linear regulator to 5V (inefficient but simple)</p>
          <h2>Day 1: Construction</h2>
          <h3>10 AM - Wire Frame</h3>
          <p>Used coat hanger wire to create cone structure:</p>
          <ul>
            <li>Base diameter: 8 inches</li>
            <li>Height: 12 inches</li>
            <li>Spiral wire pattern for LED mounting</li>
          </ul>
          <p>Pro tip: Wear gloves. Coat hangers fight back.</p>
          <h3>2 PM - LED Placement</h3>
          <p>The tedious part:</p>
          <ul>
            <li>50 green LEDs for tree body</li>
            <li>20 multicolor LEDs for ornaments</li>
            <li>1 bright yellow for the star</li>
          </ul>
          <p>Decided on common cathode wiring for easier control.</p>
          <h3>6 PM - The Wiring Nightmare</h3>
          <p>Running individual wires to 70 LEDs... what was I thinking?</p>
          <ul>
            <li>Used thin magnet wire (salvaged from old transformer)</li>
            <li>Color coded with markers (ran out of colored wire)</li>
            <li>Tested each connection as I went</li>
          </ul>
          <h3>11 PM - First Light</h3>
          <p>Connected all common cathodes to ground, touched 5V to various anodes. IT LOOKS LIKE A TREE! (If you squint)</p>
          <p>Mom's reaction: "Oh, that's actually pretty!"</p>
          <h2>Day 2: Making It Smart</h2>
          <h3>8 AM - Microcontroller Circuit</h3>
          <p>Built the control circuit on perfboard:</p>
          <ul>
            <li>ATtiny85 in socket (learned that lesson)</li>
            <li>ULN2003 driver chip (because 70 LEDs = lots of current)</li>
            <li>Pull-down resistors on all inputs</li>
            <li>Big capacitor for power smoothing</li>
          </ul>
          <h3>12 PM - Programming Patterns</h3>
          <p>Started simple:</p>
          <pre className="language-c"><code>{`// Pattern 1: All on
void allOn() {
    PORTB = 0xFF;
}

// Pattern 2: Twinkle
void twinkle() {
    PORTB = random(0xFF);
    delay(100);
}`}</code></pre>
          <h3>3 PM - Getting Fancy</h3>
          <p>Implemented more complex patterns: 1. <strong>Spiral chase</strong>: Lights spiral up the tree 2. <strong>Fade in/out</strong>: PWM on all LEDs 3. <strong>Color wave</strong>: Ornaments change color in sequence 4. <strong>Sparkle</strong>: Random LEDs flash briefly 5. <strong>Growth</strong>: Tree "grows" from bottom to top</p>
          <h3>6 PM - The Power Problem</h3>
          <p>Current draw with all LEDs on: 850mA Battery life: About 2 hours</p>
          <p>Solution: Never turn on all LEDs at once. Patterns look better anyway!</p>
          <h3>9 PM - Final Assembly</h3>
          <p>Hot glued everything in place (engineering at its finest):</p>
          <ul>
            <li>Controller board hidden in base</li>
            <li>Battery pack underneath</li>
            <li>Small button for pattern switching</li>
            <li>Power switch accessible</li>
          </ul>
          <h2>The Technical Details</h2>
          <h3>Charlieplexing Magic</h3>
          <p>With 5 I/O pins, I can theoretically control 20 LEDs individually. But I needed 70 LEDs...</p>
          <p>Solution: Grouped LEDs by levels</p>
          <ul>
            <li>Level 1 (bottom): 20 LEDs</li>
            <li>Level 2: 15 LEDs</li>
            <li>Level 3: 15 LEDs</li>
            <li>Level 4: 15 LEDs</li>
            <li>Level 5 (top): 5 LEDs</li>
          </ul>
          <p>Each level shares common control, individual LEDs can't be addressed. Good enough for patterns!</p>
          <h3>Current Limiting</h3>
          <p>Each LED needs ~20mA. 70 LEDs = 1.4A theoretical max. Reality: Only ~30% on at any time = 450mA average.</p>
          <p>Used 150Ω resistors for green LEDs, 100Ω for red (lower forward voltage).</p>
          <h3>Pattern Storage</h3>
          <p>Stored patterns in PROGMEM to save RAM:</p>
          <pre className="language-c"><code>{`const uint8_t pattern1[] PROGMEM = {
    0b00001, 0b00010, 0b00100, 0b01000, 0b10000
};`}</code></pre>
          <p>ATtiny85 only has 512 bytes RAM, every byte counts!</p>
          <h2>The Reveal</h2>
          <h3>Christmas Morning</h3>
          <p>Placed the LED tree on the entrance table, turned it on.</p>
          <p>Family reactions:</p>
          <ul>
            <li>Dad: "You built this? Yesterday?"</li>
            <li>Sister: "Can you make me one?"</li>
            <li>Grandma: "It's very... bright"</li>
            <li>Uncle (also engineer): "Is that charlieplexed?"</li>
          </ul>
          <p>Success!</p>
          <h3>Pattern Showcase</h3>
          <p>Cycled through all patterns. Favorites:</p>
          <ul>
            <li>Mom loved the gentle fade</li>
            <li>Kids loved the fast sparkle</li>
            <li>I love the spiral chase (most complex to program)</li>
          </ul>
          <h2>Lessons Learned</h2>
          <p>1. <strong>Simple can be impressive</strong>: Blinking LEDs still wow non-engineers 2. <strong>Time constraints force creativity</strong>: No time for perfection 3. <strong>Hot glue is engineering</strong>: When you have 36 hours... 4. <strong>Battery life matters</strong>: Should have used sleep modes 5. <strong>Documentation during build</strong>: Writing this from memory is hard</p>
          <h2>What I\'d Do Differently</h2>
          <ul>
            <li>Use WS2812 addressable LEDs (didn't exist yet)</li>
            <li>PCB instead of point-to-point wiring</li>
            <li>Rechargeable battery with USB</li>
            <li>Add sound reactive mode</li>
            <li>Make it collapsible for storage</li>
          </ul>
          <h2>The Best Part</h2>
          <p>Sister (age 10): "Can you teach me to make one?"</p>
          <p>Spent rest of Christmas day teaching her basic electronics. She made an LED blink with a 555 timer. Her excitement reminded me why I love this field.</p>
          <h2>Code Repository</h2>
          <p>Posted full code on the IEEE website. Highlights:</p>
          <ul>
            <li>Pattern engine with smooth transitions</li>
            <li>Low power sleep between updates</li>
            <li>Button debouncing routine</li>
            <li>Scalable for different LED counts</li>
          </ul>
          <h2>Future Versions</h2>
          <p>Already planning v2 for next year:</p>
          <ul>
            <li>RGB LEDs for full color control</li>
            <li>WiFi enabled (tweet to change patterns)</li>
            <li>Music synchronized</li>
            <li>Bigger (much bigger)</li>
            <li>Solar powered?</li>
          </ul>
          <h2>The Family Tech Support Trade-off</h2>
          <p>Building this earned me immunity from fixing computers for one day. Worth it.</p>
          <h2>Final Thoughts</h2>
          <p>This project embodies engineering spirit:</p>
          <ul>
            <li>Solving problems nobody asked you to solve</li>
            <li>Making simple things complicated (then elegant)</li>
            <li>Learning through building</li>
            <li>Sharing the joy of creation</li>
          </ul>
          <p>Is it practical? No. Is it efficient? Definitely not. Is it cool? Absolutely.</p>
          <h2>Merry Christmas!</h2>
          <p>To all my fellow engineering students spending holidays with a soldering iron: You're not alone. We're all a little crazy. And that's what makes us engineers.</p>
          <p>May your solder joints be strong, your code compile first try, and your projects blink exactly as intended.</p>
          <p>Now if you'll excuse me, I need to add more patterns. Just thought of a cool matrix effect...</p>
          <p><em>Update: Mom wants me to build another one for her office. I've created a monster. A blinking, beautiful monster.</em></p>
        </div>
      </article>
    </>
  );
}