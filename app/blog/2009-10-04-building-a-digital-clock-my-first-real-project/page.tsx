import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Building a Digital Clock: My First Real Project - Michael D'Angelo",
  description: "Designing and building a digital clock from scratch using 74-series logic chips - 40 hours of work for 4 seven-segment displays.",
};

export default function BlogPost() {
  return (
    <>
      <article className="post" id="2009-10-04-building-a-digital-clock-my-first-real-project">
        <header>
          <h1 className="text-4xl font-bold mb-4">Building a Digital Clock: My First Real Project</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{new Date('2009-10-04').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • 9 min</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {['electronics', 'projects', 'digital-logic', 'hardware'].map((tag) => (
              <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">{tag}</span>
            ))}
          </div>
        </header>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>I just spent the entire weekend building a digital clock using only basic logic chips. No microcontroller, no Arduino - just pure digital logic. Here's the journey of blood (literally - those chip legs are sharp), sweat, and LEDs.</p>
          <h2>The Challenge</h2>
          <p>Build a 24-hour digital clock using:</p>
          <ul>
            <li>555 timer for the time base</li>
            <li>74-series counter chips</li>
            <li>Seven-segment displays</li>
            <li>Basic logic gates</li>
            <li>A massive breadboard (or three)</li>
          </ul>
          <h2>Starting with the Heartbeat</h2>
          <p>Every clock needs a time base. Enter the 555 timer in astable mode:</p>
          <ul>
            <li>Target: 1Hz (one pulse per second)</li>
            <li>Reality: 0.97Hz (close enough?)</li>
            <li>Components: 1μF capacitor, 470kΩ and 68kΩ resistors</li>
          </ul>
          <p>Watching that LED blink exactly once per second was oddly satisfying.</p>
          <h2>Counting Seconds (0-59)</h2>
          <p>This required two counter stages:</p>
          <ul>
            <li>Units (0-9): Single 74LS90 decade counter</li>
            <li>Tens (0-5): Another 74LS90 with reset logic</li>
          </ul>
          <p>The trick: Reset the tens counter when it hits 6 (binary 0110). A simple AND gate watching bits 1 and 2 did the job.</p>
          <h2>The Display Drama</h2>
          <p>Seven-segment displays are hungry beasts:</p>
          <ul>
            <li>Each segment needs ~20mA</li>
            <li>4 digits × 7 segments = potential disaster</li>
            <li>Solution: 74LS47 BCD to seven-segment decoders</li>
          </ul>
          <p>These magical chips convert binary to the right segment patterns. Pure digital sorcery.</p>
          <h2>Hours: The Final Boss</h2>
          <p>Hours are weird. They count 0-23, but reset at 24. This meant:</p>
          <ul>
            <li>Units counter (0-9) with special reset logic</li>
            <li>Tens counter (0-2) that knows when units hit certain values</li>
            <li>Complex reset when reaching 24 (not 29 like normal counters)</li>
          </ul>
          <p>My solution involved three AND gates and a lot of head-scratching.</p>
          <h2>The Breadboard Jungle</h2>
          <p>By the end, my desk looked like this:</p>
          <ul>
            <li>3 full-size breadboards</li>
            <li>~200 jumper wires (I counted)</li>
            <li>15 integrated circuits</li>
            <li>4 seven-segment displays</li>
            <li>1 very tired engineering student</li>
          </ul>
          <h2>Bugs and Debugging</h2>
          <p>Oh, the bugs: 1. <strong>Ghost counts</strong>: Noise causing random increments (solution: bypass capacitors everywhere) 2. <strong>Dim displays</strong>: Insufficient current (solution: transistor drivers) 3. <strong>The 23:59 to 00:00 transition</strong>: Took 3 hours to debug a single logic gate</p>
          <h2>Lessons Learned</h2>
          <p>1. <strong>Plan your layout first</strong>: I rebuilt this three times due to poor planning 2. <strong>Color-code religiously</strong>: Red=power, black=ground, yellow=clocks, blue=data 3. <strong>Test incrementally</strong>: Don't wire everything then hope it works 4. <strong>Datasheets are your bible</strong>: Read them. Then read them again.</p>
          <h2>The Magic Moment</h2>
          <p>3 AM, Sunday morning. I plug it in one final time. The displays show 00:00. Then 00:01. Then 00:02. IT WORKS!</p>
          <p>My roommate (woken by my celebration) was less impressed.</p>
          <h2>Code vs. Chips</h2>
          <p>Sure, I could build this with 10 lines of Arduino code. But there's something special about building it from raw logic:</p>
          <ul>
            <li>You understand EXACTLY how it works</li>
            <li>No abstraction layers</li>
            <li>If it breaks, you can fix it with an oscilloscope</li>
          </ul>
          <h2>What\'s Next?</h2>
          <p>Adding features:</p>
          <ul>
            <li>Alarm functionality</li>
            <li>12/24 hour mode switch</li>
            <li>Maybe even minutes display (I'm out of breadboard space though)</li>
          </ul>
          <h2>The Real Victory</h2>
          <p>It's not about building a clock - I can buy one for $5. It's about understanding how digital systems work at the fundamental level. Every microprocessor has circuits like these inside.</p>
          <p>To future EE students: Build something with pure logic at least once. It's frustrating, time-consuming, and absolutely worth it.</p>
          <p>Time invested: 40 hours Knowledge gained: Priceless Breadboard wires used: Too many</p>
          <p>Now if you'll excuse me, I need to clean up this wire jungle before my roommate stages an intervention.</p>
        </div>
      </article>
    </>
  );
}