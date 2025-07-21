import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "PCB Design with Eagle: Moving Beyond Breadboards - Michael D'Angelo",
  description: "Finally learning PCB design! Here's my journey from breadboard chaos to professional printed circuit boards using Eagle CAD.",
};

export default function BlogPost() {
  return (
    <>
      <article className="post" id="2010-02-10-pcb-design-with-eagle-moving-beyond-breadboards">
        <header>
          <h1 className="text-4xl font-bold mb-4">PCB Design with Eagle: Moving Beyond Breadboards</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{new Date('2010-02-10').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • 12 min</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {['pcb', 'eagle', 'design', 'hardware'].map((tag) => (
              <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">{tag}</span>
            ))}
          </div>
        </header>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>After spending 20 minutes finding a loose wire in my breadboard rat's nest, I decided it's time to learn PCB design. Downloaded Eagle CAD (free version) and dove in. Here's what I've learned so far.</p>
          <h2>Why PCBs?</h2>
          <p>Breadboards are great for prototyping, but:</p>
          <ul>
            <li>Unreliable connections</li>
            <li>Parasitic capacitance (~2pF between rows)</li>
            <li>Can't handle high frequencies</li>
            <li>Look unprofessional</li>
            <li>Fall apart when moved</li>
          </ul>
          <p>PCBs solve all of these.</p>
          <h2>Getting Started with Eagle</h2>
          <h3>First Impressions</h3>
          <p>UI is... unique. Not intuitive at all. But it's free for small boards (80cm²) and industry standard, so I'm pushing through.</p>
          <p>Key concepts that confused me:</p>
          <ul>
            <li>Schematic ≠ Board layout</li>
            <li>Libraries contain parts</li>
            <li>Every part needs symbol AND footprint</li>
            <li>Layers matter (a lot)</li>
          </ul>
          <h3>The Workflow</h3>
          <p>1. Draw schematic (logical connections) 2. Add parts from libraries 3. Connect with nets (not wires!) 4. Switch to board layout 5. Place components 6. Route traces 7. Design rule check (DRC) 8. Generate Gerber files</p>
          <p>Seems simple. It's not.</p>
          <h2>My First PCB: LED Blinker</h2>
          <p>Started simple: 555 timer blinking an LED.</p>
          <h3>Schematic Capture</h3>
          <p>Found 555 timer in library. Placed it. Easy!</p>
          <p>Wait, why are there 3 different 555 symbols? Turns out:</p>
          <ul>
            <li>Different packages (DIP-8, SOIC-8, etc.)</li>
            <li>Different manufacturers</li>
            <li>Different pin arrangements</li>
          </ul>
          <p>Lesson: Check the datasheet AND footprint.</p>
          <h3>The Footprint Fiasco</h3>
          <p>Proudly finished schematic. Switched to board view. Parts everywhere with white lines (airwires) showing connections.</p>
          <p>Started placing components. Looked good!</p>
          <p>Then realized: I used 0805 footprint for resistors. I have 1/4W through-hole resistors.</p>
          <p>That's... not going to work.</p>
          <p>Lesson: Know your actual components BEFORE designing.</p>
          <h2>Second Attempt: Arduino Shield</h2>
          <p>Decided to make something useful: Arduino prototyping shield with:</p>
          <ul>
            <li>Breadboard area</li>
            <li>LED indicators</li>
            <li>Reset button</li>
            <li>Power filtering</li>
          </ul>
          <h3>Learning Proper Schematic Style</h3>
          <p>My first schematic: Spaghetti mess Proper schematic: Organized, labeled, logical flow</p>
          <p>Tips learned:</p>
          <ul>
            <li>Power connections at top</li>
            <li>Ground at bottom</li>
            <li>Signal flow left to right</li>
            <li>Use net names for clarity</li>
            <li>Add values to all components</li>
          </ul>
          <h3>Board Layout Enlightenment</h3>
          <p>This is where the magic happens. Converting schematic to physical reality.</p>
          <p>Key realizations: 1. <strong>Component placement is 90% of the work</strong> - Minimize crossing connections - Keep related parts together - Think about trace routing</p>
          <p>2. <strong>Trace width matters</strong> - Power traces: Wider (24 mil minimum) - Signals: 10-12 mil is fine - Use trace width calculator!</p>
          <p>3. <strong>Ground planes are amazing</strong> - Dedicate entire layer to ground - Reduces noise - Easier routing - Better for high frequency</p>
          <h3>Design Rules</h3>
          <p>Eagle's DRC (Design Rule Check) saved me from expensive mistakes:</p>
          <ul>
            <li>Traces too close (8 mil minimum for cheap fabs)</li>
            <li>Drill sizes wrong</li>
            <li>Silkscreen over pads</li>
            <li>Acute angles (acid traps)</li>
          </ul>
          <p>Run DRC obsessively!</p>
          <h2>Advanced Techniques I\'m Learning</h2>
          <h3>Multi-Layer Boards</h3>
          <p>2 layers: Good for simple designs 4 layers: Power/ground planes + 2 signal layers</p>
          <p>My shield is 2-layer:</p>
          <ul>
            <li>Top: Most traces and components</li>
            <li>Bottom: Ground plane and few traces</li>
          </ul>
          <h3>Vias</h3>
          <p>Connect between layers. Types:</p>
          <ul>
            <li>Through-hole (normal)</li>
            <li>Blind (one side only)</li>
            <li>Buried (internal layers)</li>
          </ul>
          <p>Using lots of vias to stitch ground planes together.</p>
          <h3>Copper Pours</h3>
          <p>Fill empty areas with copper (usually ground). Benefits:</p>
          <ul>
            <li>Less etching for fab</li>
            <li>Better current handling</li>
            <li>EMI shielding</li>
          </ul>
          <p>Looks professional too!</p>
          <h2>Getting It Made</h2>
          <h3>Generating Gerbers</h3>
          <p>Industry standard format. Separate file for each layer:</p>
          <ul>
            <li>Top copper (.GTL)</li>
            <li>Bottom copper (.GBL)</li>
            <li>Soldermask (.GTS/.GBS)</li>
            <li>Silkscreen (.GTO/.GBO)</li>
            <li>Drill file (.TXT)</li>
          </ul>
          <p>Eagle CAM processor automates this. Still confusing first time.</p>
          <h3>Choosing a Fab</h3>
          <p>For prototype quantities:</p>
          <ul>
            <li>OSH Park: $5/sq inch, purple boards, US-made</li>
            <li>JLCPCB: $2 for 10 boards(!), from China</li>
            <li>Advanced Circuits: $33 each, fast turnaround</li>
          </ul>
          <p>Went with JLCPCB. $2 + $15 shipping = $17 for 10 boards!</p>
          <h3>The Waiting Game</h3>
          <p>Ordered Sunday night. Boards manufactured Tuesday. Shipped Wednesday.</p>
          <p>Tracking obsessively.</p>
          <p>Modern manufacturing is incredible.</p>
          <h2>Common Beginner Mistakes (I Made Most of Them)</h2>
          <p>1. <strong>Wrong footprints</strong>: Measure your actual parts! 2. <strong>No mounting holes</strong>: Boards need mechanical support 3. <strong>Tiny text</strong>: Silkscreen has minimum size (0.8mm height) 4. <strong>Power traces too thin</strong>: Calculate current needs 5. <strong>No test points</strong>: Add them, future you will thank you 6. <strong>Components too close</strong>: Leave room for soldering iron 7. <strong>No polarity markings</strong>: Which way does LED go? 8. <strong>Forgetting paste layer</strong>: Important for stencils 9. <strong>Acute angles</strong>: Creates acid traps during etching 10. <strong>No ground plane</strong>: Just use one, trust me</p>
          <h2>Tips That Would\'ve Saved Me Hours</h2>
          <h3>Organization</h3>
          <ul>
            <li>Name nets descriptively (VCC_5V not N$1)</li>
            <li>Use consistent grid (0.1" for through-hole)</li>
            <li>Group related components</li>
            <li>Add notes on schematic</li>
          </ul>
          <h3>Libraries</h3>
          <ul>
            <li>Download proven libraries (Adafruit, SparkFun)</li>
            <li>Check footprints against datasheets</li>
            <li>Make your own for weird parts</li>
            <li>Save custom libraries separately</li>
          </ul>
          <h3>Routing</h3>
          <ul>
            <li>Route power first</li>
            <li>Then critical signals</li>
            <li>Use 45° angles, not 90°</li>
            <li>Keep analog and digital separate</li>
            <li>Minimize via count</li>
          </ul>
          <h3>Documentation</h3>
          <ul>
            <li>Add name, date, version to silkscreen</li>
            <li>Include test point labels</li>
            <li>Mark pin 1 on connectors</li>
            <li>Add voltage labels</li>
          </ul>
          <h2>The Learning Resources That Actually Helped</h2>
          <ul>
            <li>SparkFun Eagle tutorials (start here!)</li>
            <li>Contextual Electronics on YouTube</li>
            <li>/r/PrintedCircuitBoard subreddit</li>
            <li>Eagle forums (solutions to everything)</li>
          </ul>
          <h2>First Boards Arrived!</h2>
          <p>Two weeks later: Purple PCBs from OSH Park!</p>
          <p>The excitement of holding YOUR design, professionally made, is indescribable.</p>
          <p>Assembly results:</p>
          <ul>
            <li>Everything fit! (Mostly)</li>
            <li>Reset button footprint slightly off</li>
            <li>Forgot pullup resistor on one LED</li>
            <li>Otherwise perfect!</li>
          </ul>
          <p>Cost breakdown:</p>
          <ul>
            <li>PCB: $15 for 3</li>
            <li>Components: $10</li>
            <li>Satisfaction: Priceless</li>
          </ul>
          <h2>What\'s Next</h2>
          <p>Now that I can make PCBs:</p>
          <ul>
            <li>CubeSat power distribution board</li>
            <li>Better function generator (current one is breadboarded)</li>
            <li>Custom Arduino with only features I need</li>
            <li>SMD practice board</li>
          </ul>
          <h2>The Bigger Picture</h2>
          <p>PCB design is a superpower. You can:</p>
          <ul>
            <li>Make custom tools</li>
            <li>Miniaturize projects</li>
            <li>Look professional</li>
            <li>Actually sell products</li>
          </ul>
          <p>Worth learning? Absolutely.</p>
          <h2>Final Advice</h2>
          <p>To EE students on the fence: 1. Download Eagle today 2. Design something simple 3. Order boards (it's cheap!) 4. Be amazed at what you created</p>
          <p>The future is custom hardware. Time to start building it.</p>
          <p><em>Currently designing 4-layer board for CubeSat communication system. If freshman me could see this...</em></p>
        </div>
      </article>
    </>
  );
}