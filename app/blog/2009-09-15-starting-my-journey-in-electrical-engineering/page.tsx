import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">Starting My Journey in Electrical Engineering</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="2009-09-15">September 14, 2009</time>
              <span>•</span>
              <span>2 min read</span>
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">personal</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">university</span>
              <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded">electrical-engineering</span>
            </div>
          </header>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>Just started my freshman year at University at Buffalo, and everyone keeps asking the same question: "Why Electrical Engineering instead of Computer Science?" It's a fair question, especially since most of my friends who are into tech went the CS route.</p>
            <p>For me, it's about understanding systems from the ground up. Sure, I could learn to code and build software, but I want to understand the physical layer too. How do transistors actually work? What happens when you apply voltage to a circuit? How do you go from electrons moving through silicon to a functioning computer?</p>
            <h2>The Appeal of Hardware</h2>
            <p>There's something deeply satisfying about building physical things. When your code has a bug, you debug it and move on. When your circuit has a problem, you might see smoke. The stakes feel more real, more tangible.</p>
            <p>My first week has been a mix of general education requirements and introductory engineering courses. Physics and calculus are what you'd expect, but the "Introduction to Engineering" course is where things get interesting. We're already talking about problem-solving methodologies and getting our hands dirty with basic circuits.</p>
            <h2>Looking Ahead</h2>
            <p>The curriculum looks intense. Over the next four years, I'll be diving into:</p>
            <ul>
              <li>Circuit analysis and design</li>
            </ul>
            <p>            - Digital logic and computer architecture  </p>
            <p>            - Signal processing</p>
            <p>            - Electromagnetics</p>
            <p>            - Control systems</p>
            <p>            - Power systems</p>
            <p>            But what excites me most are the project opportunities. UB has a nanosatellite program where undergrads can work on actual satellites. There's also a robotics club and various research labs. The hands-on experience will be invaluable.</p>
            <h2>Why Not Pure CS?</h2>
            <p>Don't get me wrong - I'll be doing plenty of programming. Embedded systems, FPGA programming, and microcontroller development are all part of the EE curriculum. But I'll also understand the hardware I'm programming. When I write code to control a motor or read a sensor, I'll understand the electrical principles making it work.</p>
            <p>In a world increasingly driven by software, I think having hardware knowledge will be a differentiator. The future isn't just about apps and websites - it's about the Internet of Things, robotics, autonomous vehicles, and other systems where hardware and software intersect.</p>
            <p>Here's to the next four years of learning, building, and probably burning out a few components along the way!</p>
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
