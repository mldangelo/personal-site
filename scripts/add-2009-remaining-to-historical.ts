import fs from 'fs';
import path from 'path';

// Remaining 2009 posts to add
const posts2009Remaining = [
  {
    title: 'Countdown to College: Last Week Before UB',
    date: '2009-09-03',
    description: 'Final preparations, packing electronics gear, and anticipation for starting engineering school.',
    tags: ['personal', 'university', 'engineering', 'beginnings'],
    readTime: '4 min',
  },
  {
    title: 'First Lab Experience: Digital Logic Gates',
    date: '2009-09-19',
    description: 'My first hands-on experience in the UB electronics lab - building basic logic gates and understanding truth tables.',
    tags: ['electronics', 'lab', 'digital-logic', 'university'],
    readTime: '6 min',
  },
  {
    title: 'The Magic of Kirchhoff\'s Laws',
    date: '2009-09-26',
    description: 'Finally understanding how current and voltage really work in circuits - those "aha!" moments in Circuit Analysis class.',
    tags: ['electronics', 'education', 'circuit-analysis', 'tutorial'],
    readTime: '7 min',
  },
  {
    title: 'Building a Digital Clock: My First Real Project',
    date: '2009-10-04',
    description: 'Designing and building a digital clock from scratch using 74-series logic chips - 40 hours of work for 4 seven-segment displays.',
    tags: ['electronics', 'projects', 'digital-logic', 'hardware'],
    readTime: '9 min',
  },
  {
    title: 'Discovering the UB IEEE Student Chapter',
    date: '2009-10-10',
    description: 'Finding my tribe - joining the IEEE student chapter and discovering a whole community of hardware nerds.',
    tags: ['ieee', 'community', 'university', 'networking'],
    readTime: '8 min',
  },
  {
    title: 'Op-Amps: The Swiss Army Knife of Electronics',
    date: '2009-10-18',
    description: 'Deep dive into operational amplifiers - understanding ideal vs real op-amps and building practical circuits.',
    tags: ['electronics', 'op-amps', 'tutorial', 'analog'],
    readTime: '10 min',
  },
  {
    title: 'Surviving Midterms: An EE Student\'s Guide',
    date: '2009-10-24',
    description: 'Midterm week is here - sharing my study strategies and survival tips for fellow engineering students.',
    tags: ['university', 'studying', 'tips', 'personal'],
    readTime: '8 min',
  },
  {
    title: 'The Art of Breadboarding: Tips from Trial and Error',
    date: '2009-10-28',
    description: 'Everything I\'ve learned about breadboarding through countless hours of debugging - the tips that textbooks don\'t teach you.',
    tags: ['electronics', 'tutorial', 'breadboarding', 'tips'],
    readTime: '10 min',
  },
  {
    title: 'Building My First Power Supply',
    date: '2009-11-01',
    description: 'Designing and building a variable bench power supply from scratch - transformer, rectification, regulation, and lots of learning.',
    tags: ['electronics', 'power-supply', 'projects', 'diy'],
    readTime: '12 min',
  },
  {
    title: 'The Beauty of Fourier Analysis',
    date: '2009-11-07',
    description: 'That moment when Fourier transforms finally clicked - seeing signals in the frequency domain changes everything.',
    tags: ['mathematics', 'signals', 'dsp', 'education'],
    readTime: '10 min',
  },
  {
    title: 'PIC vs AVR vs Arduino: A Beginner\'s Comparison',
    date: '2009-11-12',
    description: 'Diving into the microcontroller wars - comparing popular platforms from a student perspective.',
    tags: ['microcontrollers', 'comparison', 'embedded', 'programming'],
    readTime: '12 min',
  },
  {
    title: 'First Robotics Competition: Lessons in Teamwork',
    date: '2009-11-21',
    description: 'Our IEEE team entered a line-following robot competition. We didn\'t win, but learned invaluable lessons about engineering and teamwork.',
    tags: ['robotics', 'competition', 'teamwork', 'ieee'],
    readTime: '11 min',
  },
  {
    title: 'Thanksgiving Reflections: Three Months In',
    date: '2009-11-26',
    description: 'Taking a break from circuits to reflect on my first semester of engineering school - the good, the bad, and the sleepless.',
    tags: ['personal', 'reflection', 'university', 'thanksgiving'],
    readTime: '9 min',
  },
  {
    title: 'Building a Temperature Data Logger',
    date: '2009-12-03',
    description: 'Creating a standalone temperature logger with ATmega328, SD card storage, and real-time clock - my most complex project yet.',
    tags: ['projects', 'microcontroller', 'data-logging', 'temperature'],
    readTime: '12 min',
  },
  {
    title: 'Finals Week: Surviving the Engineering Gauntlet',
    date: '2009-12-11',
    description: 'It\'s finals week at UB. Five exams, three all-nighters, and enough coffee to fill Lake Erie. This is my survival log.',
    tags: ['university', 'finals', 'study-tips', 'personal'],
    readTime: '11 min',
  },
  {
    title: 'Home for the Holidays: Explaining Engineering to Family',
    date: '2009-12-16',
    description: 'Back home for winter break, trying to explain what I\'ve been doing at college. "So you\'re learning to fix computers?"',
    tags: ['personal', 'family', 'holidays', 'communication'],
    readTime: '9 min',
  },
  {
    title: 'Restoring Grandpa\'s Vintage Oscilloscope',
    date: '2009-12-19',
    description: 'Found a 1960s Tektronix scope in Grandpa\'s basement. Time to bring this beautiful piece of engineering history back to life.',
    tags: ['electronics', 'restoration', 'vintage', 'family'],
    readTime: '12 min',
  },
  {
    title: 'LED Christmas Tree: Holiday Hacking',
    date: '2009-12-24',
    description: 'Nothing says "Merry Christmas from an EE student" like a custom-built LED Christmas tree with programmable patterns. Build log inside!',
    tags: ['projects', 'led', 'christmas', 'microcontroller'],
    readTime: '11 min',
  },
  {
    title: 'Year One Progress: From Zero to Breadboard Hero',
    date: '2009-12-27',
    description: 'Looking back at four months of electrical engineering education - what I\'ve learned, what I\'ve built, and what\'s next.',
    tags: ['reflection', 'personal', 'year-review', 'progress'],
    readTime: '12 min',
  },
];

// Read current file
const filePath = path.join(process.cwd(), 'src/data/historicalPosts.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Find the 2009 section - we'll add after the existing 2009 posts
const yearPattern = /\/\/ 2009[\s\S]*?(?=\/\/ 2010|];)/;
const yearMatch = content.match(yearPattern);

if (yearMatch) {
  const yearSection = yearMatch[0];
  const lines = yearSection.split('\n');
  
  // Find the last post in 2009
  let insertIndex = -1;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].includes('},')) {
      insertIndex = i;
      break;
    }
  }
  
  if (insertIndex !== -1) {
    // Build the new posts string
    const newPosts = posts2009Remaining.map(post => {
      const link = `/blog/${post.date}-${post.title.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')}`;
      
      return `  {
    title: '${post.title.replace(/'/g, "\\'")}',
    date: '${post.date}',
    description: '${post.description.replace(/'/g, "\\'")}',
    link: '${link}',
    tags: [${post.tags.map(tag => `'${tag}'`).join(', ')}],
    readTime: '${post.readTime}',
  },`;
    }).join('\n');
    
    // Insert after the last post
    lines.splice(insertIndex + 1, 0, newPosts);
    const updatedSection = lines.join('\n');
    content = content.replace(yearSection, updatedSection);
    
    // Write updated content
    fs.writeFileSync(filePath, content);
    console.log(`✅ Added ${posts2009Remaining.length} posts from 2009 to historicalPosts.ts`);
  }
} else {
  console.error('❌ Could not find 2009 section in historicalPosts.ts');
}