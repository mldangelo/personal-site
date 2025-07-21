// Blog post ideas for UB period (2009-2012)
// Focus: Electrical Engineering, Embedded Systems, CubeSat Development

export const UB_PERIOD_POSTS = [
  // 2009 - Freshman/Sophomore Year
  {
    date: '2009-09-15',
    title: 'Starting My Journey in Electrical Engineering',
    summary: 'First impressions of university life and why I chose EE over CS.',
    tags: ['personal', 'university', 'electrical-engineering'],
    content: `Just started at University at Buffalo. Everyone keeps asking why I chose Electrical Engineering over Computer Science. For me, it's about understanding systems from the ground up - from electrons to algorithms.`
  },
  {
    date: '2009-10-02',
    title: 'My First Circuit: Blinking an LED with a 555 Timer',
    summary: 'Building the "Hello World" of hardware - and why it\'s harder than print().',
    tags: ['hardware', 'electronics', 'tutorial'],
    content: `Finally got my first 555 timer circuit working. It's amazing how much goes into making an LED blink compared to writing a for loop.`
  },
  {
    date: '2009-11-20',
    title: 'Why Google Wave Failed to Impress Me',
    summary: 'Thoughts on Google\'s ambitious collaboration tool and why simpler is often better.',
    tags: ['industry', 'google', 'product-analysis'],
    content: `Google Wave was supposed to revolutionize communication. After using it for a month, I think they overcomplicated something that didn't need fixing.`
  },
  {
    date: '2009-12-10',
    title: 'Building a Digital Clock from Scratch',
    summary: 'My first real hardware project using only logic gates and 7-segment displays.',
    tags: ['hardware', 'projects', 'digital-logic'],
  },

  // 2010 - Joining Nanosatellite Program
  {
    date: '2010-01-15',
    title: 'Node.js: First Impressions from a Hardware Guy',
    summary: 'JavaScript on the server? Here\'s why this might actually make sense.',
    tags: ['nodejs', 'javascript', 'web-development'],
    content: `Been playing with Node.js over winter break. Event-driven programming feels natural coming from embedded systems where everything is interrupt-driven.`
  },
  {
    date: '2010-02-28',
    title: 'P ≠ NP: What It Means and Why It Matters',
    summary: 'Breaking down the famous proof attempt and its implications.',
    tags: ['computer-science', 'theory', 'algorithms'],
  },
  {
    date: '2010-04-15',
    title: 'Getting Started with Arduino',
    summary: 'Why Arduino is revolutionizing hobbyist electronics.',
    tags: ['arduino', 'embedded', 'tutorial'],
  },
  {
    date: '2010-05-20',
    title: 'The iPad: A Hardware Engineer\'s Perspective',
    summary: 'Impressive engineering, but is it just a big iPhone?',
    tags: ['apple', 'hardware', 'review'],
  },
  {
    date: '2010-10-15',
    title: 'Joining the UB Nanosatellite Program',
    summary: 'Starting work on GLADOS - our 3U CubeSat project.',
    tags: ['cubesat', 'space', 'projects'],
    content: `Excited to announce I'm now the Hardware Lead for UB's Nanosatellite Program. We're building a 3U CubeSat called GLADOS. My focus will be on the power subsystem.`
  },
  {
    date: '2010-11-03',
    title: 'CubeSat Power Systems 101',
    summary: 'Designing power management for satellites - it\'s all about efficiency.',
    tags: ['cubesat', 'power-systems', 'hardware'],
  },
  {
    date: '2010-12-15',
    title: 'MongoDB vs PostgreSQL: A Beginner\'s Perspective',
    summary: 'Trying out NoSQL for our satellite telemetry storage.',
    tags: ['databases', 'mongodb', 'postgresql'],
  },

  // 2011 - Deep into CubeSat Development
  {
    date: '2011-01-20',
    title: 'Implementing I2C Communication for CubeSat Subsystems',
    summary: 'Getting multiple microcontrollers to talk reliably in space.',
    tags: ['embedded', 'i2c', 'cubesat'],
  },
  {
    date: '2011-02-14',
    title: 'Thermal Management in Small Satellites',
    summary: 'When your satellite goes from -40°C to +85°C every 90 minutes.',
    tags: ['cubesat', 'thermal', 'space'],
  },
  {
    date: '2011-03-25',
    title: 'First Look at Git and GitHub',
    summary: 'Moving our satellite code from SVN to Git - game changer.',
    tags: ['git', 'version-control', 'tools'],
  },
  {
    date: '2011-04-10',
    title: 'Building a Battery Management System',
    summary: 'Protecting lithium batteries in the harsh space environment.',
    tags: ['hardware', 'power-systems', 'cubesat'],
  },
  {
    date: '2011-05-15',
    title: 'WebSockets: Real-time Telemetry Display',
    summary: 'Building a web dashboard for satellite data visualization.',
    tags: ['websockets', 'javascript', 'real-time'],
  },
  {
    date: '2011-06-20',
    title: 'Lessons from Testing in a Vacuum Chamber',
    summary: 'What happens when you put your hardware in space-like conditions.',
    tags: ['testing', 'hardware', 'cubesat'],
  },
  {
    date: '2011-08-30',
    title: 'Steve Jobs Resigns: End of an Era',
    summary: 'Thoughts on Jobs\' impact on technology and design.',
    tags: ['apple', 'industry', 'leadership'],
  },
  {
    date: '2011-10-06',
    title: 'Remembering Steve Jobs',
    summary: 'How one person changed the way we think about technology.',
    tags: ['apple', 'steve-jobs', 'reflection'],
  },
  {
    date: '2011-11-15',
    title: 'Bootstrap: First Impressions',
    summary: 'Twitter\'s CSS framework might solve our dashboard UI problems.',
    tags: ['bootstrap', 'css', 'web-development'],
  },
  {
    date: '2011-12-20',
    title: 'Year in Review: From Circuits to Satellites',
    summary: 'Reflecting on a year of hardware development and space systems.',
    tags: ['personal', 'year-review', 'cubesat'],
  },

  // 2012 - Senior Year & Job Hunt
  {
    date: '2012-01-15',
    title: 'Raspberry Pi: A Game Changer for Embedded Linux',
    summary: 'Why the $35 computer matters for education and prototyping.',
    tags: ['raspberry-pi', 'embedded', 'linux'],
  },
  {
    date: '2012-02-10',
    title: 'Implementing Redundancy in Satellite Systems',
    summary: 'You can\'t fix hardware bugs in space - design for failure.',
    tags: ['reliability', 'cubesat', 'systems-design'],
  },
  {
    date: '2012-03-01',
    title: 'The Facebook IPO: What It Means for Engineers',
    summary: 'Thoughts on tech IPOs and the talent gold rush.',
    tags: ['facebook', 'ipo', 'industry'],
  },
  {
    date: '2012-03-20',
    title: 'From Hardware to Software: Preparing for Interviews',
    summary: 'Transitioning from embedded systems to web development for job hunting.',
    tags: ['career', 'interviews', 'personal'],
  },
  {
    date: '2012-04-15',
    title: 'GLADOS CubeSat: Final Integration',
    summary: 'Putting two years of work together - our satellite is almost ready.',
    tags: ['cubesat', 'projects', 'hardware'],
  },
  {
    date: '2012-05-10',
    title: 'Graduating Summa Cum Laude: What\'s Next?',
    summary: 'Reflecting on four years of engineering education and looking ahead.',
    tags: ['personal', 'graduation', 'career'],
  },
];

// Additional technical deep-dive posts for the period
export const TECHNICAL_POSTS_2009_2012 = [
  {
    date: '2010-03-15',
    title: 'Understanding PWM for Motor Control',
    summary: 'Pulse Width Modulation explained with practical examples.',
    tags: ['pwm', 'embedded', 'tutorial'],
  },
  {
    date: '2010-07-20',
    title: 'Building a PID Controller from Scratch',
    summary: 'Implementing proportional-integral-derivative control in C.',
    tags: ['control-systems', 'embedded', 'c'],
  },
  {
    date: '2011-09-10',
    title: 'Kalman Filters for Sensor Fusion',
    summary: 'Combining accelerometer and gyroscope data for attitude determination.',
    tags: ['algorithms', 'sensors', 'cubesat'],
  },
  {
    date: '2012-02-25',
    title: 'Real-Time Operating Systems: FreeRTOS on ARM',
    summary: 'Getting started with RTOS for embedded applications.',
    tags: ['rtos', 'embedded', 'arm'],
  },
];

// Industry commentary posts reflecting the times
export const INDUSTRY_POSTS_2009_2012 = [
  {
    date: '2010-06-15',
    title: 'Why Angry Birds Is More Than Just a Game',
    summary: 'The mobile app economy is creating new opportunities.',
    tags: ['mobile', 'startups', 'gaming'],
  },
  {
    date: '2011-07-10',
    title: 'Google+ Won\'t Beat Facebook',
    summary: 'Network effects are hard to overcome, even for Google.',
    tags: ['social-media', 'google', 'facebook'],
  },
  {
    date: '2012-04-05',
    title: 'Instagram\'s Billion Dollar Exit',
    summary: 'What Facebook\'s acquisition means for photo sharing apps.',
    tags: ['instagram', 'facebook', 'acquisitions'],
  },
];