import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">Holiday Hacking: LED Christmas Ornaments</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="2009-12-26">December 25, 2009</time>
              <span>•</span>
              <span>6 min read</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">led</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">project</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">christmas</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">gift</span>
            </div>
          </header>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>Home for the holidays. Family expects stories about college life. Instead, I\'m in the basement building LED Christmas ornaments because nothing says \"I\'m an engineering student\" like giving homemade electronics as gifts.</p>
            <h2>The Inspiration</h2>
            <p>Mom: \"Did you buy Christmas gifts?\"</p>
            <p>Me: \"I\'m making them.\"</p>
            <p>Mom: \"...\"</p>
            <p>Me: \"They\'ll have lights!\"</p>
            <p>Five days until Christmas. Time to build.</p>
            <h2>The Design Concept</h2>
            <p>LED ornaments that:</p>
            <ul>
              <li>Look festive (not like science projects)</li>
              <li>Battery powered (no cords on tree)</li>
              <li>Multiple patterns (because static is boring)</li>
              <li>Last through the season</li>
              <li>Don\'t scream \"NERD GIFT\"</li>
            </ul>
            <p>Target audience: Family who thinks I\'m learning to fix TVs.</p>
            <h2>Circuit Design</h2>
            <h3>The Brain</h3>
            <p>ATtiny85 microcontroller:</p>
            <ul>
              <li>8 pins (perfect for small projects)</li>
              <li>Internal oscillator (no crystal needed)</li>
              <li>PWM outputs (for fading)</li>
              <li>Runs on 3V (two AA batteries)</li>
              <li>$1.50 each in bulk</li>
            </ul>
            <h3>The Lights</h3>
            <p>Charlieplexing for maximum LEDs:</p>
            <ul>
              <li>5 I/O pins = 20 LEDs possible</li>
              <li>Using 12 LEDs (reasonable brightness)</li>
              <li>Red and green (festive!)</li>
              <li>No resistors needed at 3V</li>
            </ul>
            <h3>Power Supply</h3>
            <ul>
              <li>2× AA batteries (3V)</li>
              <li>Slide switch for on/off</li>
              <li>Calculated battery life: ~50 hours</li>
              <li>Boost converter considered but overkill</li>
            </ul>
            <h2>The Build Process</h2>
            <h3>Day 1: Prototyping</h3>
            <p>Built one on breadboard:</p>
            <ul>
              <li>Got Charlieplexing working (tricky!)</li>
              <li>Wrote pattern code</li>
              <li>Current draw: 15mA average</li>
              <li>Brightness: Perfect</li>
            </ul>
            <h3>Day 2: PCB Design</h3>
            <p>No time for proper PCBs. Perfboard it is:</p>
            <ul>
              <li>Star shape cut from perfboard</li>
              <li>LEDs arranged in aesthetic pattern</li>
              <li>ATtiny in center (hidden by decoration)</li>
              <li>Battery pack on back</li>
            </ul>
            <p>Cutting perfboard with Dremel at midnight. Dad not happy about noise.</p>
            <h3>Day 3-4: Assembly Line</h3>
            <p>Five ornaments to build:</p>
            <ul>
              <li>Cut 5 star shapes</li>
              <li>Solder 60 LEDs total</li>
              <li>Program 5 ATtiny chips</li>
              <li>Test everything twice</li>
              <li>Hot glue for strain relief</li>
            </ul>
            <p>Kitchen table = assembly line. Mom less than thrilled.</p>
            <h2>The Code</h2>
            <p>Patterns programmed:</p>
            <ul>
              <li><strong>Twinkle</strong>: Random LEDs fade in/out</li>
              <li><strong>Chase</strong>: Lights race around star</li>
              <li><strong>Pulse</strong>: All fade together</li>
              <li><strong>Alternate</strong>: Red/green swap</li>
              <li><strong>Random</strong>: Chaos mode</li>
            </ul>
            <p>Button press cycles patterns.</p>
            <pre className="language-cpp"><code>{`// Simplified pattern code\\nvoid twinkle() {\\n  int led = random(12);\\n  for(int i = 0; i < 255; i++) {\\n    setPWM(led, i);\\n    delay(5);\\n  }\\n  for(int i = 255; i >= 0; i--) {\\n    setPWM(led, i);\\n    delay(5);\\n  }\\n}`}</code></pre>
            <h2>Charlieplexing Magic</h2>
            <p>The technique that makes it work:</p>
            <ul>
              <li>Set one pin HIGH</li>
              <li>Set one pin LOW  </li>
              <li>All others INPUT (high impedance)</li>
              <li>Current flows through exactly one LED</li>
            </ul>
            <pre className="language-cpp"><code>{`// LED array for charlieplexing\\nint charlie[12][2] = {\\n  {0,1}, {1,0}, {0,2}, {2,0},\\n  {1,2}, {2,1}, {0,3}, {3,0},\\n  {1,3}, {3,1}, {2,3}, {3,2}\\n};\\n\\nvoid lightLED(int led) {\\n  // All pins to input first\\n  for(int i = 0; i < 4; i++) {\\n    pinMode(pins[i], INPUT);\\n  }\\n  // Set specific pins for LED\\n  pinMode(pins[charlie[led][0]], OUTPUT);\\n  pinMode(pins[charlie[led][1]], OUTPUT);\\n  digitalWrite(pins[charlie[led][0]], HIGH);\\n  digitalWrite(pins[charlie[led][1]], LOW);\\n}`}</code></pre>
            <h2>Making It Pretty</h2>
            <p>The engineering works. Now for aesthetics:</p>
            <ul>
              <li>Clear nail polish over exposed connections</li>
              <li>Decorative wire spiral on front</li>
              <li>Glitter (Mom\'s contribution)</li>
              <li>Ribbon for hanging</li>
              <li>Small candy cane attached</li>
            </ul>
            <p>From circuit board to Christmas ornament.</p>
            <h2>Family Reactions</h2>
            <h3>Mom</h3>
            <p>\"Oh! They\'re actually pretty! Can you make more?\"</p>
            <p>Success = Mom wants more.</p>
            <h3>Dad</h3>
            <p>\"How long do batteries last? What\'s the power consumption?\"</p>
            <p>Engineer dad asking engineer questions.</p>
            <h3>Sister</h3>
            <p>\"Do they come in blue?\"</p>
            <p>Already taking custom orders.</p>
            <h3>Grandma</h3>
            <p>\"The lights dance! How do they know?\"</p>
            <p>Trying to explain microcontrollers to grandma...</p>
            <h3>Uncle (Also Engineer)</h3>
            <p>\"Is that Charlieplexing? Nice current limiting.\"</p>
            <p>Someone understands!</p>
            <h2>Cost Analysis</h2>
            <p>Per ornament:</p>
            <ul>
              <li>ATtiny85: $1.50</li>
              <li>LEDs: $0.50</li>
              <li>Battery holder: $0.50</li>
              <li>Batteries: $1.00</li>
              <li>Perfboard: $0.50</li>
              <li>Misc (wire, switch): $0.50</li>
              <li><strong>Total: ~$4.50</strong></li>
            </ul>
            <p>Store-bought LED ornament: $15-20</p>
            <p>Homemade with love: Priceless (and cheaper)</p>
            <h2>Lessons Learned</h2>
            <h3>Technical</h3>
            <ul>
              <li>Charlieplexing is powerful but tricky</li>
              <li>Battery life calculations usually optimistic</li>
              <li>Hot glue is structural engineering</li>
              <li>Program chips before soldering</li>
              <li>Test patterns on humans (not just scope)</li>
            </ul>
            <h3>Practical</h3>
            <ul>
              <li>Start earlier (5 days = stress)</li>
              <li>Make extras (someone will want one)</li>
              <li>Document build (Aunt wants tutorial)</li>
              <li>Consider shipping (hand delivery only)</li>
              <li>Have gift backup plan</li>
            </ul>
            <h3>Personal</h3>
            <ul>
              <li>Handmade gifts mean more</li>
              <li>Family appreciates effort</li>
              <li>Engineering can be artistic</li>
              <li>Deadlines drive creativity</li>
              <li>Mom\'s craft supplies are useful</li>
            </ul>
            <h2>Unexpected Outcomes</h2>
            <ul>
              <li>Cousin wants to learn soldering</li>
              <li>Neighbor commissioned 10 for next year</li>
              <li>Sister\'s boyfriend impressed (engineering cred)</li>
              <li>Mom bragging to friends</li>
              <li>Already planning Easter version</li>
            </ul>
            <h2>The Extended Family Demo</h2>
            <p>Christmas dinner became electronics show:</p>
            <ul>
              <li>Explained how LEDs work</li>
              <li>Demonstrated pattern programming</li>
              <li>Uncle and I debated power optimization</li>
              <li>Grandpa shared vacuum tube stories</li>
              <li>Kids mesmerized by lights</li>
            </ul>
            <h2>Version 2.0 Ideas</h2>
            <p>Already planning improvements:</p>
            <ul>
              <li>SMD components (smaller)</li>
              <li>Rechargeable battery</li>
              <li>Wireless sync between ornaments</li>
              <li>Sound reactive mode</li>
              <li>Smartphone control (because everything needs an app)</li>
            </ul>
            <h2>The Real Gift</h2>
            <p>Not the ornaments themselves, but:</p>
            <ul>
              <li>Sharing what I\'m learning</li>
              <li>Making something useful</li>
              <li>Family understanding my passion</li>
              <li>Creating new traditions</li>
              <li>Connecting through technology</li>
            </ul>
            <h2>Final Thoughts</h2>
            <p>Engineering school teaches theory. Building gifts teaches purpose. The joy on Mom\'s face when her ornament lit up? That\'s why I build things.</p>
            <p>Sure, I could have bought gifts. But where\'s the fun in that? Plus, now I\'m the family member who makes cool electronic things. That\'s a reputation worth building.</p>
            <h2>Project Stats</h2>
            <ul>
              <li>Total build time: 35 hours</li>
              <li>Ornaments completed: 5</li>
              <li>LEDs soldered: 60</li>
              <li>Patterns programmed: 5</li>
              <li>Family members impressed: All</li>
              <li>Engineering satisfaction: Maximum</li>
            </ul>
            <h2>Post-Christmas Update</h2>
            <p>Mom already planning next year:</p>
            <p>\"Can you make them spell words?\"</p>
            <p>\"Can they sync to music?\"</p>
            <p>\"What about a whole tree of them?\"</p>
            <p>I\'ve created a monster. A beautiful, blinky monster.</p>
            <p><em>Currently: Planning Easter egg with RGB LEDs. Because apparently, this is my thing now.</em></p>
            <p>Merry Christmas from the engineering basement!</p>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
