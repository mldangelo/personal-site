import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">Building a USB Charger from Scratch</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="2009-12-15">December 14, 2009</time>
              <span>•</span>
              <span>5 min read</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">power-supply</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">usb</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">project</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">practical</span>
            </div>
          </header>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>My phone charger broke. RadioShack wants $25 for a replacement. I have a box of components. Time to build my own USB charger and actually understand how power supplies work.</p>
            <h2>USB Power Specifications</h2>
            <p>First, what does USB actually need?</p>
            <ul>
              <li>Voltage: 5V ± 0.25V (4.75V - 5.25V)</li>
              <li>Current: 500mA standard (up to 1A for charging)</li>
              <li>Connectors: Type-A (the flat one)</li>
              <li>Data lines: D+ and D- (we\'ll get to this...)</li>
            </ul>
            <p>Seems simple. It\'s not.</p>
            <h2>Design Choices</h2>
            <h3>Linear vs Switching</h3>
            <p><strong>Linear regulator</strong>:</p>
            <ul>
              <li>Simple</li>
              <li>Cheap</li>
              <li>Inefficient (wastes power as heat)</li>
              <li>Clean output</li>
            </ul>
            <p><strong>Switching regulator</strong>:</p>
            <ul>
              <li>Complex</li>
              <li>Efficient</li>
              <li>Noisy output</li>
              <li>Expensive</li>
            </ul>
            <p>For first attempt: Linear. Learn to walk before running.</p>
            <h2>The Circuit Design</h2>
            <h3>Basic Linear Regulator</h3>
            <p>Using the classic LM7805:</p>
            <pre className="language-text"><code>{`9-12V DC → 7805 → 5V USB\\n         ↓     ↓\\n        GND   GND\\n\\nPlus capacitors for stability`}</code></pre>
            <h3>Component Selection</h3>
            <ul>
              <li><strong>LM7805</strong>: 5V linear regulator (TO-220 package)</li>
              <li><strong>Input cap</strong>: 330µF electrolytic (smoothing)</li>
              <li><strong>Output cap</strong>: 100µF electrolytic (stability)</li>
              <li><strong>Ceramic caps</strong>: 0.1µF on input and output (high frequency)</li>
              <li><strong>LED + resistor</strong>: Power indicator</li>
              <li><strong>USB Type-A female connector</strong>: Salvaged from old motherboard</li>
            </ul>
            <h3>Input Power</h3>
            <p>Wall wart from junk box:</p>
            <ul>
              <li>9V DC, 1A rated</li>
              <li>Actual no-load: 9.6V</li>
              <li>Perfect for 7805 (needs 2V headroom)</li>
            </ul>
            <h2>Building It</h2>
            <h3>The Schematic</h3>
            <pre className="language-text"><code>{`9V in → 330µF → 7805 → 100µF → USB 5V\\n              ↓  |||  ↓       ↓\\n             0.1µF||| 0.1µF   GND\\n                  |||\\n                  GND\\n\\nLED circuit:\\n5V → 220Ω → LED → GND`}</code></pre>
            <h3>Physical Construction</h3>
            <p>Built on perfboard:</p>
            <ul>
              <li>Place 7805 in center (it gets hot)</li>
              <li>Capacitors close to regulator</li>
              <li>Short, thick traces for power</li>
              <li>USB connector at edge</li>
              <li>Power LED visible</li>
            </ul>
            <h3>Heat Considerations</h3>
            <p>7805 dissipates: P = (Vin - Vout) × I</p>
            <p>At 500mA: P = (9V - 5V) × 0.5A = 2W</p>
            <p>That\'s HOT. Added small heatsink.</p>
            <h2>The USB Data Line Problem</h2>
            <p>Plugged in phone. Charges at 100mA. Why not 500mA?</p>
            <p>Research reveals: USB charging detection!</p>
            <ul>
              <li>Phones check data lines</li>
              <li>Different resistors = different charge rates</li>
              <li>No connection = slow charge only</li>
            </ul>
            <h3>USB Charging Standards</h3>
            <p><strong>USB 2.0</strong>: D+ and D- floating = 100mA max</p>
            <p><strong>Apple</strong>: Specific voltages on D+ and D-</p>
            <p><strong>Android/BC1.2</strong>: D+ and D- shorted = dedicated charger</p>
            <h3>The Fix</h3>
            <p>Shorted D+ to D- on connector. Phone now pulls 500mA. Success!</p>
            <h2>Testing</h2>
            <h3>Voltage Regulation</h3>
            <p>Load testing with resistors:</p>
            <ul>
              <li>No load: 5.02V ✓</li>
              <li>100mA (50Ω): 5.01V ✓</li>
              <li>500mA (10Ω): 4.98V ✓</li>
              <li>1A (5Ω): 4.89V (borderline)</li>
            </ul>
            <p>Good enough for most devices.</p>
            <h3>Ripple Measurement</h3>
            <p>Using oscilloscope (borrowed):</p>
            <ul>
              <li>AC ripple: ~10mV p-p</li>
              <li>High frequency noise: Minimal</li>
              <li>Clean enough for charging</li>
            </ul>
            <h3>Temperature Testing</h3>
            <p>After 30 minutes at 500mA:</p>
            <ul>
              <li>Heatsink: 65°C (hot but safe)</li>
              <li>Board: Warm</li>
              <li>Capacitors: Cool</li>
            </ul>
            <p>Needs better heatsink for continuous use.</p>
            <h2>Real-World Performance</h2>
            <h3>Devices Tested</h3>
            <ul>
              <li>Android phone: Charges perfectly</li>
              <li>iPhone (friend\'s): Needed different D+/D- values</li>
              <li>Bluetooth headphones: Work great</li>
              <li>Arduino: Powers without issues</li>
              <li>GPS unit: Happy</li>
            </ul>
            <h3>Charge Time Comparison</h3>
            <p>My charger vs official:</p>
            <ul>
              <li>0-50%: 45 min vs 40 min</li>
              <li>0-100%: 110 min vs 100 min</li>
            </ul>
            <p>10% slower. Acceptable for free.</p>
            <h2>Improvements Made</h2>
            <h3>Version 1.1</h3>
            <p>Added switch for Apple/Android mode:</p>
            <ul>
              <li>Android: D+ shorted to D-</li>
              <li>Apple: Voltage dividers for 2V/2.7V</li>
            </ul>
            <h3>Version 1.2</h3>
            <ul>
              <li>Larger heatsink</li>
              <li>Fuse on input (safety first)</li>
              <li>Second USB port</li>
              <li>Nice enclosure (still ugly)</li>
            </ul>
            <h2>Cost Analysis</h2>
            <p>My build:</p>
            <ul>
              <li>LM7805: $0.50</li>
              <li>Capacitors: $1.00</li>
              <li>USB connector: Free (salvaged)</li>
              <li>Perfboard: $1.00</li>
              <li>Heatsink: $1.50</li>
              <li>Wall wart: Free (junk box)</li>
              <li><strong>Total: ~$4</strong></li>
            </ul>
            <p>Store bought: $25</p>
            <p>Savings: $21</p>
            <p>Education: Priceless</p>
            <h2>What I Learned</h2>
            <h3>Power Supply Design</h3>
            <ul>
              <li>Headroom matters (Vin > Vout + dropout)</li>
              <li>Capacitors aren\'t optional</li>
              <li>Heat management is crucial</li>
              <li>Efficiency matters for battery operation</li>
            </ul>
            <h3>USB Complexity</h3>
            <ul>
              <li>\"5V and ground\" is oversimplified</li>
              <li>Charging negotiation exists</li>
              <li>Standards are more like guidelines</li>
              <li>Every manufacturer is different</li>
            </ul>
            <h3>Practical Engineering</h3>
            <ul>
              <li>Overkill is better than magic smoke</li>
              <li>Test with dummy loads first</li>
              <li>Monitor temperatures</li>
              <li>Add protection (fuses)</li>
            </ul>
            <h2>Future Upgrades</h2>
            <h3>Version 2.0 Plans</h3>
            <p>Switch to switching regulator:</p>
            <ul>
              <li>LM2596 module</li>
              <li>85% efficiency vs 55%</li>
              <li>Less heat</li>
              <li>Wider input range</li>
            </ul>
            <h3>Feature Additions</h3>
            <ul>
              <li>Current monitoring</li>
              <li>Multiple voltage outputs</li>
              <li>Battery backup</li>
              <li>Solar input?</li>
            </ul>
            <h2>Common Problems Encountered</h2>
            <ul>
              <li><strong>Oscillation</strong>: Fixed with proper capacitors</li>
              <li><strong>Overheating</strong>: Needed heatsink</li>
              <li><strong>Poor connections</strong>: Switched to thicker wire</li>
              <li><strong>Phone not charging</strong>: D+/D- issue</li>
              <li><strong>Voltage drop</strong>: Better solder joints</li>
            </ul>
            <h2>Safety Considerations</h2>
            <p>Things that could go wrong:</p>
            <ul>
              <li>Short circuit (add fuse)</li>
              <li>Overheating (heatsink + ventilation)</li>
              <li>Reverse polarity (add diode)</li>
              <li>Over voltage (7805 fails short)</li>
            </ul>
            <p>Built in protections:</p>
            <ul>
              <li>7805 has thermal shutdown</li>
              <li>Current limiting at ~1.5A</li>
              <li>Fuse on input</li>
              <li>Insulated enclosure</li>
            </ul>
            <h2>Resources Used</h2>
            <ul>
              <li><a href=\"http://usb.org\">USB.org</a> - Official spec (dense)</li>
              <li>LM7805 datasheet - Critical reading</li>
              <li>Various forums - Charging detection info</li>
              <li>YouTube - Visual learning helps</li>
            </ul>
            <h2>The Philosophical Win</h2>
            <p>Could have bought a charger. Instead:</p>
            <ul>
              <li>Learned power supply design</li>
              <li>Understood USB specifications</li>
              <li>Practiced construction techniques</li>
              <li>Have unique charger</li>
              <li>Can repair when it breaks</li>
            </ul>
            <h2>Final Thoughts</h2>
            <p>Building basic infrastructure (like chargers) teaches fundamentals. It\'s not about saving money - it\'s about understanding the technology we use daily.</p>
            <p>Plus, the look on people\'s faces when you say \"I built it\" is worth the burned fingers.</p>
            <p>Next project: Multi-port charging station. Because one USB port is never enough.</p>
            <p><em>Currently charging: Phone at 5.01V, 487mA. Room smells slightly of flux. Engineering success.</em></p>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
