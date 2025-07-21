import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">Building a DIY Star Tracker with Arduino</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="2009-11-28">November 27, 2009</time>
              <span>•</span>
              <span>8 min read</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">photography</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">astrophotography</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">arduino</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">diy</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">hardware</span>
            </div>
          </header>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>Following up on my last post, I actually built that barn door tracker! Turns out combining Arduino skills from class with astrophotography needs produces something actually useful.</p>
            <h2>The Problem</h2>
            <p>Earth rotates. Stars move (apparently). Cameras don't. Result: star trails after 20-30 seconds. Solution: make camera move with stars.</p>
            <h2>The Barn Door Tracker Design</h2>
            <p>Based on a centuries-old design, modernized with Arduino:</p>
            <h3>Materials ($40 total):</h3>
            <ul>
              <li>2 pieces of wood (1x6", hardware store scraps)</li>
              <li>Piano hinge</li>
              <li>1/4"-20 threaded rod</li>
              <li>Arduino Uno (already had from class)</li>
              <li>28BYJ-48 stepper motor + ULN2003 driver ($6)</li>
              <li>9V battery pack</li>
              <li>Misc: nuts, bolts, hot glue</li>
            </ul>
            <h2>The Math</h2>
            <p>The key is rotating at exactly the right speed:</p>
            <ul>
              <li>Earth rotates 360° in 23h 56m 4s (sidereal day)</li>
              <li>That's 15.041 degrees per hour</li>
              <li>Or 0.2507 degrees per minute</li>
            </ul>
            <p>For my 11.43cm (4.5") hinge-to-rod distance:</p>
            <ul>
              <li>Need to advance rod 0.0317mm per second</li>
              <li>With 1/4"-20 thread (1.27mm pitch)</li>
              <li>Motor needs 1 revolution per 40 seconds</li>
            </ul>
            <h2>The Code</h2>
            <pre className="language-cpp"><code>{`#include <Stepper.h>\\n\\nconst int stepsPerRevolution = 2048;  // 28BYJ-48 specs\\nconst float rpmNeeded = 1.5;  // 1 rev per 40 sec\\n\\nStepper myStepper(stepsPerRevolution, 8, 10, 9, 11);\\n\\nvoid setup() {\\n  myStepper.setSpeed(rpmNeeded);\\n  pinMode(13, OUTPUT);  // LED indicator\\n}\\n\\nvoid loop() {\\n  digitalWrite(13, HIGH);\\n  myStepper.step(stepsPerRevolution);\\n  digitalWrite(13, LOW);\\n  delay(100);  // Brief pause between revolutions\\n}`}</code></pre>
            <h2>Construction Night</h2>
            <p>Built this in the dorm common room. Highlights:</p>
            <ul>
              <li>Roommate thought I was building a torture device</li>
              <li>Hot glue everywhere</li>
              <li>Discovered wood glue takes 24 hours to dry at 11 PM</li>
              <li>Tested by tracking a poster on the wall</li>
            </ul>
            <h2>Field Testing</h2>
            <p>First clear night after building: November 26th, 2 AM, Chestnut Ridge Park.</p>
            <h3>The Good:</h3>
            <ul>
              <li>It actually works!</li>
              <li>Tracked Orion for 5 minutes perfectly</li>
              <li>Got pinpoint stars at 55mm focal length</li>
              <li>Battery lasted 3 hours in 25°F weather</li>
            </ul>
            <h3>The Bad:</h3>
            <ul>
              <li>Alignment is critical (used phone compass)</li>
              <li>Wooden base warped slightly in cold</li>
              <li>Forgot camera mounting screw (duct tape saves the day)</li>
              <li>Stepper motor is louder than expected</li>
            </ul>
            <h2>Results</h2>
            <p>The difference is dramatic:</p>
            <ul>
              <li><strong>Without tracker</strong>: 30 second limit before trailing</li>
              <li><strong>With tracker</strong>: Clean 5-minute exposures!</li>
              <li>Can now see Orion Nebula structure</li>
              <li>Andromeda shows actual spiral hints</li>
            </ul>
            <h2>Cost Breakdown</h2>
            <ul>
              <li>Wood: Free (scrap)</li>
              <li>Hinge: $3</li>
              <li>Threaded rod + nuts: $5</li>
              <li>Stepper motor + driver: $6</li>
              <li>Battery pack: $8</li>
              <li>Arduino: Already owned</li>
              <li>Pride in DIY solution: Priceless</li>
            </ul>
            <p>Total: ~$22 (had some parts)</p>
            <h2>Improvements for Version 2</h2>
            <ul>
              <li><strong>Better polar alignment</strong> - Add alignment scope</li>
              <li><strong>Variable speed</strong> - Compensate for mechanical imperfections</li>
              <li><strong>Weatherproofing</strong> - Electronics don't like Buffalo winters</li>
              <li><strong>Remote control</strong> - Bluetooth module for start/stop</li>
              <li><strong>Auto-rewind</strong> - Currently manual reset every hour</li>
            </ul>
            <h2>Why This Matters</h2>
            <p>Sure, I could save up $300 for a commercial tracker. But building your own:</p>
            <ul>
              <li>Teaches the mechanics of Earth's rotation</li>
              <li>Applies classroom embedded systems knowledge</li>
              <li>Costs 1/10th of commercial option</li>
              <li>Actually works!</li>
              <li>Serious bragging rights in photo club</li>
            </ul>
            <h2>Code and Plans</h2>
            <p>I've uploaded the Arduino sketch and basic plans to GitHub. Feel free to build your own and improve the design. The astronomy club is interested in building several for club use.</p>
            <h2>Next Project</h2>
            <p>Temperature-controlled DSLR cooling box. CCDs perform better cold, and Buffalo winters are perfect for this. Peltier cooler + Arduino + temperature sensor = less noise in long exposures.</p>
            <p>The intersection of hardware hacking and astrophotography is surprisingly fertile ground. Every problem has a DIY solution if you're willing to get creative with hot glue and code.</p>
            <p>Clear skies!</p>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
