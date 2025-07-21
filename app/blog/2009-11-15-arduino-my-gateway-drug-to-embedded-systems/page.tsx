import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">Arduino: My Gateway Drug to Embedded Systems</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="2009-11-15">November 14, 2009</time>
              <span>•</span>
              <span>4 min read</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">arduino</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">embedded</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">programming</span>
            </div>
          </header>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>I finally got my hands on an Arduino Duemilanove (the 2009 model with the ATmega328). At $30, it's an incredible deal for what you get - a complete microcontroller development platform that just works. After weeks of discrete circuits and 555 timers, having a programmable chip feels like cheating.</p>
            <h2>What Makes Arduino Special</h2>
            <p>Before Arduino, getting started with microcontrollers meant:</p>
            <ul>
              <li>Buying a programmer (often $50+)</li>
            </ul>
            <p>            - Installing complex toolchains</p>
            <p>            - Writing in assembly or low-level C</p>
            <p>            - Reading 300+ page datasheets</p>
            <p>            - Dealing with fuse bits and configuration registers</p>
            <p>            Arduino abstracts away most of this complexity. You plug it in via USB, write code in a simplified C++ dialect, and click upload. That's it.</p>
            <h2>My First Real Project: Temperature Logger</h2>
            <p>After the obligatory LED blinking, I built a temperature logger using a TMP36 sensor:</p>
            <pre className="language-text"><code>{`const int tempPin = A0;\nconst int ledPin = 13;\nfloat tempThreshold = 25.0; // Celsius\n\nvoid setup() {\n  Serial.begin(9600);\n  pinMode(ledPin, OUTPUT);\n}\n\nvoid loop() {\n  int sensorVal = analogRead(tempPin);\n  float voltage = sensorVal * (5.0 / 1024.0);\n  float tempC = (voltage - 0.5) * 100.0;\n\nSerial.print(\"Temperature: \");\n  Serial.print(tempC);\n  Serial.println(\" C\");\n\nif (tempC > tempThreshold) {\n    digitalWrite(ledPin, HIGH);\n  } else {\n    digitalWrite(ledPin, LOW);\n  }\n\ndelay(1000);\n}`}</code></pre>
            <p>            Simple, but it demonstrates the power of Arduino. In about 20 lines of code, I have a functioning temperature monitor with visual alerts.</p>
            <h2>The Hardware Side</h2>
            <p>What's brilliant about Arduino is that it doesn't hide the hardware - it just makes it accessible. You still need to understand:</p>
            <ul>
              <li>Pull-up resistors for inputs</li>
            </ul>
            <p>            - Current limiting for LEDs</p>
            <p>            - Voltage dividers for analog sensors</p>
            <p>            - PWM for motor control</p>
            <p>            But you can learn these concepts incrementally instead of all at once.</p>
            <h2>Limitations and Learning</h2>
            <p>Arduino isn't perfect. The abstraction that makes it easy also hides important details:</p>
            <ul>
              <li>No real-time guarantees (delay() blocks everything)</li>
            </ul>
            <p>            - Limited memory (2KB RAM on the ATmega328)</p>
            <p>            - Slower than raw C (though usually fast enough)</p>
            <p>            - Can't do true parallel processing</p>
            <p>            But these limitations are educational. When you hit them, you're forced to learn about:</p>
            <ul>
              <li>Interrupts and timers</li>
            </ul>
            <p>            - Memory management</p>
            <p>            - Optimization techniques</p>
            <p>            - Direct port manipulation</p>
            <p>            ## The Community Factor</p>
            <p>What really sets Arduino apart is the community. The forums are incredibly active, and there's a library for almost everything. Need to control a servo? There's a library. Want to read GPS data? Library. LCD display? Multiple libraries to choose from.</p>
            <p>This weekend I found a library for the Nokia 5110 LCD (the one from old Nokia phones). In 30 minutes, I had a working display showing temperature graphs. Try doing that with raw AVR programming!</p>
            <h2>Beyond Arduino</h2>
            <p>I'm already looking at what comes next:</p>
            <ul>
              <li>Raw AVR programming for better performance</li>
            </ul>
            <p>            - ARM Cortex-M microcontrollers (more power, similar price)</p>
            <p>            - FPGAs for true parallel processing</p>
            <p>            - Real-time operating systems (FreeRTOS looks interesting)</p>
            <p>            But Arduino will always have a special place. It's the gateway drug that makes embedded systems approachable. Once you see an LED blink because of code you wrote, you're hooked.</p>
            <h2>Practical Tips for Beginners</h2>
            <ul>
              <li>**Buy genuine or quality clones** - The $5 clones work, but I\'ve had issues with cheap USB chips</li>
            </ul>
            <ul>
              <li>**Get a starter kit** - Individual components add up quickly</li>
            </ul>
            <ul>
              <li>**Learn basic electronics first** - Arduino won\'t save you from letting the magic smoke out</li>
            </ul>
            <ul>
              <li>**Read other people\'s code** - The examples included with Arduino IDE are gold</li>
            </ul>
            <ul>
              <li>**Start simple** - Resist the urge to build a quadcopter on day one</li>
            </ul>
            <p>The beauty of Arduino is that it meets you where you are. Complete beginner? Blink an LED. Have some experience? Build a data logger. Expert? Use it for rapid prototyping before moving to production hardware.</p>
            <p>Next project: I'm thinking about building a mini weather station. Temperature, humidity, pressure, and maybe even wind speed. The sensors are cheap, and Arduino makes it actually achievable for a college freshman with more ambition than experience.</p>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
