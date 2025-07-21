import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">Halloween LED Project: Spooky Eyes</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="2009-10-30">October 29, 2009</time>
              <span>•</span>
              <span>4 min read</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">arduino</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">project</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">led</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">halloween</span>
            </div>
          </header>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>Halloween is tomorrow, and while others are buying decorations, I\'m building them. Motion-activated LED eyes that follow trick-or-treaters? Let\'s do this.</p>
            <h2>The Concept</h2>
            <p>Hidden pairs of red LEDs that:</p>
            <ul>
              <li>Turn on when someone approaches</li>
              <li>Fade in/out randomly</li>
              <li>Multiple pairs for extra creepiness</li>
              <li>Battery powered for placement anywhere</li>
            </ul>
            <p>Total build time: 4 hours (including debugging)</p>
            <p>Total cost: ~$15 (had most parts already)</p>
            <h2>Parts List</h2>
            <p>From my growing component collection:</p>
            <ul>
              <li>Arduino Uno (overkill but what I have)</li>
              <li>PIR motion sensor (HC-SR501) - $3</li>
              <li>Red LEDs (10mm diffused) - 6 pairs</li>
              <li>220Ω resistors</li>
              <li>9V battery + holder</li>
              <li>Jumper wires</li>
              <li>Black project box</li>
              <li>Hot glue (lots)</li>
            </ul>
            <h2>The Circuit</h2>
            <p>Simple but effective:</p>
            <pre className="language-text"><code>{`PIR Sensor:\\n- VCC → Arduino 5V\\n- GND → Arduino GND  \\n- OUT → Arduino Pin 2\\n\\nLED Pairs (6 sets):\\n- Pin 3,5,6,9,10,11 → 220Ω → LED+ → LED- → GND\\n- Using PWM pins for brightness control`}</code></pre>
            <h2>The Code</h2>
            <pre className="language-cpp"><code>{`const int pirPin = 2;\\nconst int ledPins[] = {3, 5, 6, 9, 10, 11};\\nconst int numPairs = 6;\\n\\nint fadeSpeed = 5;\\nboolean motionDetected = false;\\n\\nvoid setup() {\\n  pinMode(pirPin, INPUT);\\n  for(int i = 0; i < numPairs; i++) {\\n    pinMode(ledPins[i], OUTPUT);\\n  }\\n  \\n  // PIR sensor needs 30 seconds to calibrate\\n  delay(30000);\\n}\\n\\nvoid loop() {\\n  motionDetected = digitalRead(pirPin);\\n  \\n  if(motionDetected) {\\n    spookyEyes();\\n  } else {\\n    allOff();\\n  }\\n}\\n\\nvoid spookyEyes() {\\n  // Random pair selection\\n  int activePair = random(numPairs);\\n  \\n  // Fade in\\n  for(int brightness = 0; brightness < 255; brightness += fadeSpeed) {\\n    analogWrite(ledPins[activePair], brightness);\\n    delay(10);\\n  }\\n  \\n  // Hold\\n  delay(random(500, 2000));\\n  \\n  // Fade out\\n  for(int brightness = 255; brightness >= 0; brightness -= fadeSpeed) {\\n    analogWrite(ledPins[activePair], brightness);\\n    delay(10);\\n  }\\n  \\n  // Random pause between blinks\\n  delay(random(100, 1000));\\n}\\n\\nvoid allOff() {\\n  for(int i = 0; i < numPairs; i++) {\\n    digitalWrite(ledPins[i], LOW);\\n  }\\n}`}</code></pre>
            <h2>Mechanical Build</h2>
            <h3>The Enclosure</h3>
            <p>Black project box with holes drilled for:</p>
            <ul>
              <li>LED pairs (spaced like eyes)</li>
              <li>PIR sensor dome</li>
              <li>Power switch</li>
            </ul>
            <p>Hot glue holds everything. Not pretty inside, but it\'s dark anyway.</p>
            <h3>LED Positioning</h3>
            <p>Each \"eye pair\" spaced 2 inches apart. Diffused LEDs give better effect than clear ones - learned this the hard way.</p>
            <h3>Weatherproofing</h3>
            <p>Clear packing tape over LED holes. Not elegant but it\'s for one night. PIR sensor covered with plastic from a bottle - still detects through it!</p>
            <h2>Field Testing</h2>
            <h3>In the Dorm</h3>
            <p>Set it up in the hallway. Results:</p>
            <ul>
              <li>PIR sensor range: ~15 feet</li>
              <li>Detection angle: ~120 degrees</li>
              <li>Battery life: ~5 hours continuous</li>
            </ul>
            <p>Scared three people already. Success!</p>
            <h3>Adjustments Made</h3>
            <ul>
              <li><strong>Sensitivity</strong>: PIR sensor was triggering constantly. Adjusted pot on sensor board.</li>
              <li><strong>Timing</strong>: Initial fade was too fast. Slower = creepier.</li>
              <li><strong>Randomization</strong>: Added more random delays. Predictable = not scary.</li>
            </ul>
            <h2>Installation Plan</h2>
            <p>Tomorrow night:</p>
            <ul>
              <li>Hide in bush by walkway</li>
              <li>Run on battery power</li>
              <li>Backup 9V battery ready</li>
              <li>Camera to catch reactions?</li>
            </ul>
            <h2>Lessons Learned</h2>
            <h3>What Worked</h3>
            <ul>
              <li>PIR sensors are amazing for $3</li>
              <li>Diffused LEDs > clear for effects</li>
              <li>Random timing is key to creepiness</li>
              <li>Hot glue fixes everything</li>
            </ul>
            <h3>What Didn\'t</h3>
            <ul>
              <li>First tried photoresistor - too unreliable</li>
              <li>Clear LEDs looked fake</li>
              <li>AA batteries died too fast - 9V better</li>
            </ul>
            <h3>Future Improvements</h3>
            <ul>
              <li>Multiple PIR sensors for direction detection</li>
              <li>Sound module for growling?</li>
              <li>Servo to make eyes \"track\" movement</li>
              <li>Smaller microcontroller (ATtiny85?)</li>
            </ul>
            <h2>Cost Breakdown</h2>
            <ul>
              <li>Already had: Arduino, LEDs, resistors (~$30 value)</li>
              <li>Purchased: PIR sensor ($3), project box ($5), 9V battery ($3)</li>
              <li>Total new cost: $11</li>
            </ul>
            <p>Compare to store-bought animated decoration: $40+</p>
            <h2>The Engineering Win</h2>
            <p>It\'s not about saving money (spent 4 hours = negative ROI). It\'s about:</p>
            <ul>
              <li>Building something unique</li>
              <li>Learning PIR sensors</li>
              <li>Practicing Arduino programming</li>
              <li>Having the best decorated dorm room</li>
            </ul>
            <h2>Neighbor Reactions</h2>
            <p>Mike (roommate): \"That\'s actually terrifying\"</p>
            <p>Sarah (across hall): \"Can you make me one?\"</p>
            <p>RA: \"Is that... safe?\" (Yes, it\'s 9V)</p>
            <h2>Code Repository</h2>
            <p>Posted on GitHub: github.com/[username]/spooky-eyes</p>
            <p>Already got two forks. Open source Halloween!</p>
            <h2>Final Thoughts</h2>
            <p>While others are carving pumpkins (analog, single-use, biodegradable), I built something:</p>
            <ul>
              <li>Reusable</li>
              <li>Programmable</li>
              <li>Battery powered</li>
              <li>Actually scary</li>
            </ul>
            <p>Engineering: Making Halloween nerdier since 2009.</p>
            <p><em>Update tomorrow with reaction videos if I capture any good scares!</em></p>
            <p>Happy Halloween from the electronics lab (aka my dorm room)!</p>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
