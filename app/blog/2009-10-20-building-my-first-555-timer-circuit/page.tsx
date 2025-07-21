import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">Building My First 555 Timer Circuit</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="2009-10-20">October 19, 2009</time>
              <span>•</span>
              <span>3 min read</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">hardware</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">electronics</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">tutorial</span>
            </div>
          </header>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>Today I built my first "real" circuit - an LED blinker using the classic 555 timer IC. If you're from a software background, think of this as the hardware equivalent of "Hello World." Except instead of print statements, we're dealing with resistors, capacitors, and the magical 555 chip.</p>
            <h2>The 555 Timer: A Brief Introduction</h2>
            <p>The 555 timer is probably the most popular IC in the world. Designed in 1971, it's still widely used today. Why? Because it's incredibly versatile, cheap (less than a dollar), and nearly indestructible. You can use it to generate precise time delays, oscillation, and pulse-width modulation.</p>
            <h2>The Circuit</h2>
            <p>Here's what I built - an astable multivibrator (fancy term for an oscillator):</p>
            <pre className="language-text"><code>{`VCC (9V) ----+----+\n             |    |\n             R1   |\n             |    |\n        +----+----+----+\n        |    |    |    |\n        | 8  7  6 |  4 |\n        |  555 Timer   |\n        | 1  2  3 |  5 |\n        +----+----+----+\n        |    |    |    |\n        |    C1   |    C2\n        |    |    |    |\nGND ----+----+----+----+\n             |\n            LED\n             |\n             R3\n             |\n            GND`}</code></pre>
            <p>            Components:</p>
            <ul>
              <li>R1: 1kΩ resistor</li>
            </ul>
            <p>            - R2: 10kΩ resistor  </p>
            <p>            - R3: 330Ω resistor (current limiting for LED)</p>
            <p>            - C1: 10µF capacitor</p>
            <p>            - C2: 0.01µF capacitor (for noise reduction)</p>
            <p>            - One red LED</p>
            <p>            - 555 timer IC</p>
            <p>            - 9V battery</p>
            <p>            ## How It Works</p>
            <p>The 555 in astable mode works by charging and discharging the capacitor C1 through resistors R1 and R2. When the capacitor voltage reaches 2/3 of VCC, the 555 discharges it through R2. When it drops to 1/3 of VCC, it starts charging again. This creates a square wave output that drives the LED.</p>
            <p>The frequency is determined by:</p>
            <p>f = 1.44 / ((R1 + 2*R2) * C1)</p>
            <p>With my values, that's about 6.5 Hz - fast enough to see clear blinking.</p>
            <h2>Software vs Hardware</h2>
            <p>Coming from some Arduino tinkering in high school, this feels fundamentally different. With Arduino, making an LED blink is trivial:</p>
            <pre className="language-text"><code>{`void loop() {\n  digitalWrite(LED_PIN, HIGH);\n  delay(500);\n  digitalWrite(LED_PIN, LOW);\n  delay(500);\n}`}</code></pre>
            <p>            But with the 555 circuit, the "program" is the circuit itself. The timing comes from the physical properties of the components. There's no code to debug, but there are plenty of ways to wire things wrong!</p>
            <h2>Lessons Learned</h2>
            <ul>
              <li>**Double-check your connections** - I spent 20 minutes debugging why my LED wouldn\'t light, only to realize I had it backwards. LEDs are diodes - current only flows one way.</li>
            </ul>
            <ul>
              <li>**Capacitor orientation matters** - Electrolytic capacitors (the cylindrical ones) have polarity. Reverse them and they might explode. (Mine didn\'t, but I\'ve seen the aftermath in lab.)</li>
            </ul>
            <ul>
              <li>**Use a breadboard** - Seriously, don\'t try to hold components together with your hands while testing. Breadboards exist for a reason.</li>
            </ul>
            <ul>
              <li>**The 555 is forgiving** - I accidentally used a 100kΩ resistor instead of 10kΩ at first. The LED still blinked, just much slower.</li>
            </ul>
            <h2>What\'s Next?</h2>
            <p>Now that I have the basic oscillator working, I want to:</p>
            <ul>
              <li>Add a potentiometer to make the frequency adjustable</li>
            </ul>
            <p>            - Use the 555 in monostable mode (one-shot timer)</p>
            <p>            - Build a tone generator for a simple electronic instrument</p>
            <p>            - Eventually work up to more complex timing circuits</p>
            <p>            The 555 timer might be old technology, but it's a fantastic learning tool. It bridges the gap between basic passive components and modern microcontrollers. Plus, there's something satisfying about making an LED blink with no code whatsoever - just electrons doing their thing through carefully arranged components.</p>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
