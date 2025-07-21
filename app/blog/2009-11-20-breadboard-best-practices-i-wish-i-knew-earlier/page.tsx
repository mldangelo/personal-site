import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">Breadboard Best Practices I Wish I Knew Earlier</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="2009-11-20">November 19, 2009</time>
              <span>•</span>
              <span>6 min read</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">electronics</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">tips</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">breadboard</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">learning</span>
            </div>
          </header>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>Just spent an hour debugging a circuit. The problem? A breadboard jumper that looked fine but was actually broken internally. This is my breadboarding manifesto - everything I wish someone had told me on day one.</p>
            <h2>The Breadboard Basics Nobody Explains</h2>
            <h3>It\'s Not Just Plastic with Holes</h3>
            <p>Inside are metal clips that grip component legs. These clips:</p>
            <ul>
              <li>Wear out over time</li>
              <li>Can be too tight (bending leads) or too loose (intermittent connections)</li>
              <li>Are connected in specific patterns (rows of 5 typically)</li>
              <li>Have resistance (small, but it adds up)</li>
            </ul>
            <p>Took me embarrassingly long to realize the power rails don\'t connect across the center gap on some boards.</p>
            <h2>The Rules That Save Sanity</h2>
            <h3>Rule 1: Color Code Religiously</h3>
            <p>My system (now):</p>
            <ul>
              <li><strong>Red</strong>: Positive power (always)</li>
              <li><strong>Black</strong>: Ground (always)</li>
              <li><strong>Orange</strong>: 3.3V (when using both voltages)</li>
              <li><strong>Yellow</strong>: Signal wires</li>
              <li><strong>Blue</strong>: I2C/SPI data</li>
              <li><strong>Green</strong>: Analog signals</li>
              <li><strong>White</strong>: Clock/timing signals</li>
            </ul>
            <p>Random colors = random debugging time.</p>
            <h3>Rule 2: Power Rails First, Always</h3>
            <p>Before anything else:</p>
            <ul>
              <li>Connect power rails to each other (if desired)</li>
              <li>Add bypass capacitors (0.1µF) across power rails</li>
              <li>Check voltage with multimeter</li>
              <li>Then add components</li>
            </ul>
            <p>Learned this after frying a chip with reverse polarity.</p>
            <h3>Rule 3: The Sacred Ground</h3>
            <p>Every circuit needs solid ground reference:</p>
            <ul>
              <li>Use thick wire for ground connections</li>
              <li>Star ground pattern when possible</li>
              <li>Multiple ground connections for complex circuits</li>
              <li>Check ground continuity regularly</li>
            </ul>
            <p>Bad ground = weird problems everywhere.</p>
            <h3>Rule 4: Keep Wires Flat and Short</h3>
            <p>Long, arcing jumper wires are:</p>
            <ul>
              <li>Antennas for noise</li>
              <li>Mechanical stress points</li>
              <li>Impossible to trace</li>
              <li>Asking for shorts</li>
            </ul>
            <p>Cut custom lengths. Yes, it takes time. Yes, it\'s worth it.</p>
            <h2>Component Placement Strategy</h2>
            <h3>ICs Go First</h3>
            <ul>
              <li>Place ICs spanning the center channel</li>
              <li>Leave space between them (heat + access)</li>
              <li>Pin 1 always faces same direction</li>
              <li>Label with tape if multiple similar ICs</li>
            </ul>
            <h3>Support Components Stay Close</h3>
            <ul>
              <li>Bypass capacitors: As close to IC power pins as possible</li>
              <li>Pull-up resistors: Near the pins they\'re pulling</li>
              <li>Crystal oscillators: Minimal lead length</li>
              <li>Current limiting resistors: Near what they\'re protecting</li>
            </ul>
            <h3>Leave Debug Access</h3>
            <ul>
              <li>Test points at critical signals</li>
              <li>Access to IC pins for probing</li>
              <li>Room for scope probes</li>
              <li>Space to add components if needed</li>
            </ul>
            <p>Learned this after building too dense and couldn\'t probe anything.</p>
            <h2>My Breadboarding Toolkit</h2>
            <h3>Essential Tools</h3>
            <ul>
              <li><strong>Flush cutters</strong>: For perfect lead length</li>
              <li><strong>Needle-nose pliers</strong>: Bending leads precisely</li>
              <li><strong>Wire strippers</strong>: Multiple gauge settings</li>
              <li><strong>Multimeter</strong>: Continuity testing constantly</li>
              <li><strong>Component lead forming tool</strong>: Consistent bends</li>
            </ul>
            <h3>Wire Collection</h3>
            <ul>
              <li><strong>Solid core wire kit</strong>: Pre-cut and stripped</li>
              <li><strong>Custom lengths</strong>: 22 AWG solid core in colors</li>
              <li><strong>Flexible wire</strong>: For moving parts only</li>
              <li><strong>Bus wire</strong>: For power distribution</li>
            </ul>
            <h3>Organization</h3>
            <ul>
              <li><strong>Component boxes</strong>: Sorted by value/type</li>
              <li><strong>Label maker</strong>: Every box, every project</li>
              <li><strong>Anti-static mat</strong>: Breadboard lives here</li>
              <li><strong>Project boxes</strong>: Keep builds intact</li>
            </ul>
            <h2>Advanced Techniques</h2>
            <h3>Power Distribution</h3>
            <p>For complex circuits:</p>
            <pre className="language-text"><code>{`+5V Rail →→→→→→→→→→→→→→→→→→→→\\n         ↓    ↓    ↓    ↓\\n        IC1  IC2  IC3  IC4\\n         ↑    ↑    ↑    ↑\\nGND Rail →→→→→→→→→→→→→→→→→→→→`}</code></pre>
            <p>Each IC gets local bypass cap. Power enters at one end.</p>
            <h3>High-Speed Signals</h3>
            <p>When dealing with fast edges:</p>
            <ul>
              <li>Keep traces short as possible</li>
              <li>Use ground return path next to signal</li>
              <li>Add termination resistors if needed</li>
              <li>Consider Manhattan-style layout</li>
            </ul>
            <p>My 16MHz SPI started working when I shortened wires.</p>
            <h3>Analog Sections</h3>
            <ul>
              <li>Separate analog and digital grounds</li>
              <li>Connect at single point only</li>
              <li>Keep analog signals away from digital</li>
              <li>Use shielded wire for sensitive signals</li>
            </ul>
            <p>Learned when Arduino ADC readings went crazy near PWM signals.</p>
            <h2>Debugging Methodology</h2>
            <h3>Visual Inspection First</h3>
            <ul>
              <li>Check all power connections</li>
              <li>Verify IC orientations</li>
              <li>Look for shorted adjacent pins</li>
              <li>Confirm component values</li>
            </ul>
            <p>Found 90% of problems this way.</p>
            <h3>Systematic Verification</h3>
            <ul>
              <li>Power rails voltage correct?</li>
              <li>All grounds connected?</li>
              <li>Signal path continuous?</li>
              <li>No unexpected shorts?</li>
            </ul>
            <p>Use multimeter continuity. Beep = good or bad depending on context.</p>
            <h3>Signal Tracing</h3>
            <ul>
              <li>Start at source</li>
              <li>Verify at each connection point</li>
              <li>Check expected vs actual values</li>
              <li>Oscilloscope for dynamic signals</li>
            </ul>
            <h2>Common Breadboard Failures</h2>
            <h3>Intermittent Connections</h3>
            <ul>
              <li>Worn out clips (test with slightly thicker wire)</li>
              <li>Oxidized leads (clean with sandpaper)</li>
              <li>Loose jumper wires (replace)</li>
              <li>Temperature expansion (yes, really)</li>
            </ul>
            <h3>Power Problems</h3>
            <ul>
              <li>Voltage drop across rails (add more connections)</li>
              <li>Insufficient bypassing (capacitors everywhere)</li>
              <li>Ground loops (star ground)</li>
              <li>Reverse polarity (check thrice)</li>
            </ul>
            <h3>Signal Integrity</h3>
            <ul>
              <li>Crosstalk between adjacent signals</li>
              <li>Ringing on fast edges</li>
              <li>Noise pickup from environment</li>
              <li>Ground bounce on switching</li>
            </ul>
            <h2>The Clean Build Process</h2>
            <ul>
              <li><strong>Plan on paper first</strong> - Component placement sketch</li>
              <li><strong>Power infrastructure</strong> - Rails, bypassing, distribution</li>
              <li><strong>Place ICs</strong> - Orientation consistent</li>
              <li><strong>Add support components</strong> - Close to ICs</li>
              <li><strong>Signal routing</strong> - Shortest path, avoid crossing</li>
              <li><strong>Power check</strong> - Before applying power</li>
              <li><strong>Incremental testing</strong> - Build and test in sections</li>
            </ul>
            <h2>Breadboard Maintenance</h2>
            <h3>Keep Them Clean</h3>
            <ul>
              <li>Compressed air monthly</li>
              <li>Isopropyl alcohol for flux residue</li>
              <li>Replace worn sections</li>
              <li>Store covered (dust is enemy)</li>
            </ul>
            <h3>Test Regularly</h3>
            <p>Made a breadboard tester:</p>
            <ul>
              <li>Arduino checks all connections</li>
              <li>LEDs indicate bad sections</li>
              <li>Maps out dead zones</li>
              <li>Takes 30 seconds to run</li>
            </ul>
            <h2>When to Give Up on Breadboard</h2>
            <p>Move to PCB when:</p>
            <ul>
              <li>Circuit works but only sometimes</li>
              <li>High frequency (>10MHz)</li>
              <li>Needs to be permanent</li>
              <li>More than 5 ICs</li>
              <li>Analog precision required</li>
            </ul>
            <h2>My Breadboarding Evolution</h2>
            <p><strong>Month 1</strong>: Chaos. Wires everywhere. Nothing works.</p>
            <p><strong>Month 2</strong>: Learning organization. Still messy.</p>
            <p><strong>Month 3</strong>: Clean builds. Debugging faster.</p>
            <p><strong>Future</strong>: PCB design. But breadboard for prototypes always.</p>
            <h2>Final Wisdom</h2>
            <ul>
              <li>Breadboards lie. Trust but verify.</li>
              <li>Good layout prevents most problems</li>
              <li>Invest in quality breadboards</li>
              <li>Keep notes on what works</li>
              <li>Share knowledge with others</li>
            </ul>
            <p>The breadboard is where ideas become reality. Treat it with respect, and it\'ll serve you well.</p>
            <p><em>Currently breadboarding: ESP8266 WiFi weather station. Because apparently I hate having free time.</em></p>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
