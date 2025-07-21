import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">Choosing Components: A Beginner's Guide</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="2009-12-10">December 9, 2009</time>
              <span>•</span>
              <span>6 min read</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">electronics</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">components</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">guide</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">learning</span>
            </div>
          </header>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>Just placed my third Digi-Key order this semester. First order: $100 of random parts I thought looked cool. Most still unused. This order: $30 of exactly what I need. Here\'s what changed.</p>
            <h2>The Fundamental Question</h2>
            <p>Before choosing any component, ask:</p>
            <ul>
              <li>What does it need to do?</li>
              <li>What are the constraints?</li>
              <li>What will kill it?</li>
              <li>What\'s the real cost?</li>
            </ul>
            <p>Sounds obvious. Took me three months to internalize.</p>
            <h2>Resistors: More Than Just Ohms</h2>
            <h3>The Specs That Matter</h3>
            <ul>
              <li><strong>Resistance</strong>: Obviously (Ω, kΩ, MΩ)</li>
              <li><strong>Tolerance</strong>: 5% is fine for most, 1% for precision</li>
              <li><strong>Power rating</strong>: P = I²R (don\'t forget!)</li>
              <li><strong>Package</strong>: Through-hole vs SMD</li>
              <li><strong>Temperature coefficient</strong>: Matters for precision</li>
            </ul>
            <h3>My Resistor Strategy</h3>
            <p>Standard values to stock:</p>
            <ul>
              <li>100Ω, 220Ω, 330Ω, 470Ω (LED current limiting)</li>
              <li>1kΩ, 2.2kΩ, 4.7kΩ, 10kΩ (general purpose)</li>
              <li>100kΩ, 1MΩ (pull-ups, high impedance)</li>
            </ul>
            <p>1/4W for most circuits, 1/2W for power stuff.</p>
            <h3>The LED Current Limiting Lesson</h3>
            <p>Burned out so many LEDs. Now:</p>
            <p>R = (Vsupply - Vf) / If</p>
            <p>Example: 5V supply, red LED (Vf=2V, If=20mA)</p>
            <p>R = (5-2)/0.02 = 150Ω</p>
            <p>Use 220Ω for safety margin.</p>
            <h2>Capacitors: The Confusing Ones</h2>
            <h3>Types and When to Use</h3>
            <p><strong>Ceramic</strong>: </p>
            <ul>
              <li>Fast, cheap, non-polarized</li>
              <li>Values: pF to µF</li>
              <li>Use for: Bypass, coupling, timing</li>
            </ul>
            <p><strong>Electrolytic</strong>:</p>
            <ul>
              <li>Large values, polarized</li>
              <li>Values: 1µF to thousands</li>
              <li>Use for: Power supply filtering</li>
              <li>Warning: Explode if backwards!</li>
            </ul>
            <p><strong>Film</strong>:</p>
            <ul>
              <li>Stable, precise, bulky</li>
              <li>Values: nF to µF</li>
              <li>Use for: Audio, precision timing</li>
            </ul>
            <h3>My Capacitor Collection</h3>
            <ul>
              <li>0.1µF ceramic (bypass caps for everything)</li>
              <li>10µF, 100µF electrolytic (power filtering)</li>
              <li>22pF, 33pF ceramic (crystal oscillators)</li>
              <li>Assorted nF film (timing circuits)</li>
            </ul>
            <h3>The Bypass Capacitor Religion</h3>
            <p>Every IC gets 0.1µF ceramic across power pins. No exceptions. Learned after weeks of weird behavior.</p>
            <h2>LEDs: Not All Blinky Lights Equal</h2>
            <h3>Key Parameters</h3>
            <ul>
              <li><strong>Forward voltage (Vf)</strong>: Red~2V, Green~2.2V, Blue~3.3V</li>
              <li><strong>Forward current (If)</strong>: Usually 20mA max</li>
              <li><strong>Brightness</strong>: millicandela (mcd)</li>
              <li><strong>Viewing angle</strong>: Narrow = bright spot, Wide = even glow</li>
            </ul>
            <h3>Lessons Learned</h3>
            <ul>
              <li>Diffused look better than water-clear for indicators</li>
              <li>High-brightness aren\'t always better (blinding)</li>
              <li>RGB LEDs: Common anode vs common cathode matters</li>
              <li>White/Blue LEDs need 3.3V minimum</li>
            </ul>
            <h2>Transistors: The Switches</h2>
            <h3>Bipolar (BJT)</h3>
            <p><strong>2N3904</strong>: NPN general purpose</p>
            <ul>
              <li>Ic max: 200mA</li>
              <li>Vceo: 40V</li>
              <li>Cheap, everywhere</li>
            </ul>
            <p><strong>2N3906</strong>: PNP complement</p>
            <ul>
              <li>Same specs, opposite polarity</li>
            </ul>
            <p><strong>2N2222</strong>: When need more current (800mA)</p>
            <h3>MOSFET</h3>
            <p><strong>2N7000</strong>: Logic-level N-channel</p>
            <ul>
              <li>Vgs(th): 2V (works with 5V logic)</li>
              <li>Id: 200mA</li>
              <li>Good for LED/relay switching</li>
            </ul>
            <h3>Selection Rules</h3>
            <ul>
              <li>Check max current (with safety margin)</li>
              <li>Check voltage ratings</li>
              <li>For switching: Saturate fully</li>
              <li>For linear: Stay in active region</li>
              <li>Heat sinking if P > 0.5W</li>
            </ul>
            <h2>ICs: The Expensive Mistakes</h2>
            <h3>Before Ordering Any IC</h3>
            <ul>
              <li><strong>Read the entire datasheet</strong> (not just first page)</li>
              <li><strong>Check supply voltage</strong> (3.3V vs 5V matters)</li>
              <li><strong>Verify package</strong> (DIP for breadboard)</li>
              <li><strong>Find application notes</strong> (examples!)</li>
              <li><strong>Order spares</strong> (you will kill one)</li>
            </ul>
            <h3>Essential ICs to Have</h3>
            <ul>
              <li><strong>555</strong>: Timer for everything</li>
              <li><strong>LM358</strong>: Dual op-amp, single supply</li>
              <li><strong>74HC595</strong>: Shift register (LED expansion)</li>
              <li><strong>ATmega328</strong>: Arduino brain</li>
              <li><strong>7805</strong>: 5V regulator</li>
            </ul>
            <h3>The Package Trap</h3>
            <p>Ordered ATtiny85. Arrived in SOIC package. Can\'t breadboard. Now own SOIC-to-DIP adapters.</p>
            <h2>Connectors: The Unsung Heroes</h2>
            <h3>Headers and Jumpers</h3>
            <ul>
              <li>0.1\" (2.54mm) pitch standard</li>
              <li>Male headers: Break to length</li>
              <li>Female headers: More expensive but useful</li>
              <li>Right-angle vs straight</li>
            </ul>
            <h3>Power Connectors</h3>
            <ul>
              <li>Barrel jack: 2.1mm standard</li>
              <li>Terminal blocks: Screw or spring</li>
              <li>USB: Micro-B becoming standard</li>
              <li>Battery holders: Get quality ones</li>
            </ul>
            <h2>Wire: More Complex Than Expected</h2>
            <h3>Types</h3>
            <p><strong>Solid Core</strong>:</p>
            <ul>
              <li>Breadboard friendly</li>
              <li>Stays shaped</li>
              <li>Breaks with flexing</li>
            </ul>
            <p><strong>Stranded</strong>:</p>
            <ul>
              <li>Flexible</li>
              <li>Needs ferrules/tinning for breadboard</li>
              <li>Better for moving connections</li>
            </ul>
            <h3>AWG Sizes</h3>
            <ul>
              <li>22 AWG: Standard breadboard wire</li>
              <li>18 AWG: Power connections</li>
              <li>26 AWG: Tight spaces</li>
              <li>30 AWG: Wire wrap (special tool)</li>
            </ul>
            <h2>Mechanical Parts</h2>
            <h3>Switches</h3>
            <ul>
              <li>Momentary vs latching</li>
              <li>SPST, SPDT, DPDT (poles and throws)</li>
              <li>Current rating important</li>
              <li>Tactile buttons: Get assortment</li>
            </ul>
            <h3>Enclosures</h3>
            <ul>
              <li>Start with plastic project boxes</li>
              <li>Altoids tins: Classic but conduct</li>
              <li>3D printing: Future option</li>
              <li>Standoffs and screws: M3 standard</li>
            </ul>
            <h2>Tools Are Components Too</h2>
            <h3>Worth Investing In</h3>
            <ul>
              <li>Good multimeter (Fluke if possible)</li>
              <li>Temperature-controlled soldering iron</li>
              <li>Flush cutters (Hakko)</li>
              <li>Wire strippers (multiple sizes)</li>
              <li>Tweezers (several types)</li>
            </ul>
            <h3>Can Cheap Out On</h3>
            <ul>
              <li>Breadboards (but buy several)</li>
              <li>Jumper wires (make your own)</li>
              <li>Component boxes (fishing tackle)</li>
              <li>Third hand (useful but optional)</li>
            </ul>
            <h2>Sourcing Strategy</h2>
            <h3>Where to Buy</h3>
            <p><strong>Digi-Key/Mouser</strong>: </p>
            <ul>
              <li>Huge selection</li>
              <li>Fast shipping</li>
              <li>Overwhelming for beginners</li>
            </ul>
            <p><strong>SparkFun/Adafruit</strong>:</p>
            <ul>
              <li>Beginner friendly</li>
              <li>Tutorials included</li>
              <li>Higher prices</li>
            </ul>
            <p><strong>eBay</strong>:</p>
            <ul>
              <li>Cheap Chinese parts</li>
              <li>Long shipping</li>
              <li>Quality varies</li>
            </ul>
            <p><strong>Local</strong>: </p>
            <ul>
              <li>RadioShack (still exists!)</li>
              <li>Component pulls from junk</li>
            </ul>
            <h3>Minimum Orders</h3>
            <p>Group buys with classmates. $7 shipping on $5 part hurts.</p>
            <h2>The Shopping List Evolution</h2>
            <h3>Month 1 Order</h3>
            <p>\"Ooh, 50 different values of resistors!\"</p>
            <p>\"RGB LEDs look cool!\"</p>
            <p>\"What\'s this IC do? Order it!\"</p>
            <p>Total: $100+, used 20%</p>
            <h3>Month 4 Order</h3>
            <p>Specific parts for specific project</p>
            <p>Exact values needed</p>
            <p>Spares of consumables</p>
            <p>Total: $30, used 90%</p>
            <h2>Budget Management</h2>
            <h3>Fixed Costs (One Time)</h3>
            <ul>
              <li>Basic tools: $100-200</li>
              <li>Component assortment: $50</li>
              <li>Storage: $20</li>
            </ul>
            <h3>Recurring Costs</h3>
            <ul>
              <li>Project parts: $10-30/project</li>
              <li>Replacement consumables: $10/month</li>
              <li>PCBs: $20/batch</li>
            </ul>
            <h3>Money-Saving Tips</h3>
            <ul>
              <li>Salvage before buying</li>
              <li>Buy common values in bulk</li>
              <li>Share shipping costs</li>
              <li>Check free samples (seriously!)</li>
            </ul>
            <h2>Common Beginner Mistakes</h2>
            <ul>
              <li><strong>Buying SMD for breadboard</strong> (need DIP)</li>
              <li><strong>Wrong voltage ratings</strong> (5V part, 12V circuit)</li>
              <li><strong>Ignoring power ratings</strong> (smoking resistors)</li>
              <li><strong>One of everything</strong> (better: 10 of common)</li>
              <li><strong>Cheapest always</strong> (some things need quality)</li>
            </ul>
            <h2>My Current Inventory System</h2>
            <h3>Organization</h3>
            <ul>
              <li>Resistors: Sorted by value in binder</li>
              <li>Capacitors: Boxes by type then value</li>
              <li>ICs: Anti-static box with labels</li>
              <li>Hardware: Fishing tackle box</li>
              <li>Wire: Spool holder on wall</li>
            </ul>
            <h3>Documentation</h3>
            <p>Spreadsheet with:</p>
            <ul>
              <li>Part number</li>
              <li>Quantity</li>
              <li>Location</li>
              <li>Project used in</li>
              <li>Reorder trigger</li>
            </ul>
            <h2>The Philosophy</h2>
            <p>Components are tools. Like any craft:</p>
            <ul>
              <li>Quality basics beat exotic pieces</li>
              <li>Organization saves time</li>
              <li>Understanding beats memorization</li>
              <li>Experience beats theory</li>
            </ul>
            <h2>Future Plans</h2>
            <p>Building proper component library:</p>
            <ul>
              <li>Standard \"jellybean\" parts</li>
              <li>Project-specific sections</li>
              <li>Sample storage</li>
              <li>Quick reference cards</li>
            </ul>
            <h2>Final Advice</h2>
            <p>Start small. Build projects. Learn what you actually use. Then stock those parts.</p>
            <p>The goal isn\'t to own every component. It\'s to have what you need when inspiration strikes at 2 AM.</p>
            <p><em>Currently organizing: 500 resistors by value. Zen meditation or obsessive behavior? Both.</em></p>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
