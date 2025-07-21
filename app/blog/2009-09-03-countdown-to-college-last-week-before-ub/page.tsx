import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Countdown to College: Last Week Before UB - Michael D'Angelo",
  description: "Final preparations, packing electronics gear, and anticipation for starting engineering school.",
};

export default function BlogPost() {
  return (
    <>
      <article className="post" id="2009-09-03-countdown-to-college-last-week-before-ub">
        <header>
          <h1 className="text-4xl font-bold mb-4">Countdown to College: Last Week Before UB</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{new Date('2009-09-03').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} • 4 min</p>
          <div className="flex flex-wrap gap-2 mb-6">
            {['personal', 'university', 'engineering', 'beginnings'].map((tag) => (
              <span key={tag} className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">{tag}</span>
            ))}
          </div>
        </header>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>Next week I start my journey at University at Buffalo as an Electrical Engineering major. The past few days have been a whirlwind of preparation, and I wanted to document this moment before everything changes.</p>
          <h2>Packing the Essentials</h2>
          <p>Beyond the usual dorm stuff, I've carefully selected my electronics toolkit:</p>
          <ul>
            <li>Multimeter (a decent Fluke I saved up for)</li>
            <li>Basic soldering iron and supplies</li>
            <li>Arduino Uno I got for my birthday</li>
            <li>Breadboards and component kit</li>
            <li>That old oscilloscope I found at a garage sale (hoping it still works!)</li>
          </ul>
          <p>My mom thinks I'm crazy for bringing all this "junk" to college. She doesn't understand that this IS college for an EE major.</p>
          <h2>Why Electrical Engineering?</h2>
          <p>Everyone keeps asking why I'm not doing Computer Science. "That's where the jobs are," they say. Here's the thing: software is amazing, but someone needs to build the hardware it runs on. Plus, there's something magical about building something physical that actually does something in the real world.</p>
          <h2>Goals for Freshman Year</h2>
          <p>1. <strong>Ace the fundamentals</strong> - I know the math and physics will be brutal 2. <strong>Join engineering clubs</strong> - I've heard about the robotics team and amateur radio club 3. <strong>Build cool projects</strong> - Not just for class, but for fun 4. <strong>Document everything</strong> - Hence this blog!</p>
          <h2>Nervous? Absolutely.</h2>
          <p>I'll be honest - I'm terrified. What if I'm not smart enough? What if everyone else already knows how to design circuits? What if I picked the wrong major?</p>
          <p>But I'm also excited. In a week, I'll be surrounded by people who think building circuits is fun. I'll have access to real labs with equipment I've only dreamed about.</p>
          <h2>The Journey Begins</h2>
          <p>This blog will be my record of the journey. The successes, the failures (probably lots of those), the late nights in the lab, the "aha!" moments, and everything in between.</p>
          <p>If you're reading this and thinking about engineering - jump in. The water's fine. Well, actually, water and electronics don't mix, but you get the idea.</p>
          <p>Next post will be from my dorm room at UB. Here we go!</p>
        </div>
      </article>
    </>
  );
}