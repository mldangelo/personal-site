import fs from 'fs';
import path from 'path';

// 2009 posts to add
const posts2009 = [
  {
    title: 'First Week at UB: Engineering Orientation',
    date: '2009-09-08',
    description: 'Starting my engineering journey at University at Buffalo - orientation week, choosing between EE and CS, and first impressions.',
    tags: ['university', 'personal', 'buffalo', 'engineering'],
    readTime: '5 min',
  },
  {
    title: 'Dorm Room Electronics Lab Setup',
    date: '2009-09-15',
    description: 'Converting half my dorm room into a makeshift electronics lab - what equipment to buy on a freshman budget.',
    tags: ['electronics', 'hardware', 'diy', 'university'],
    readTime: '6 min',
  },
  {
    title: 'Why Hardware Still Matters in a Software World',
    date: '2009-09-22',
    description: 'My case for studying Electrical Engineering when everyone else is rushing to Computer Science.',
    tags: ['hardware', 'career', 'engineering', 'opinion'],
    readTime: '4 min',
  },
  {
    title: 'Understanding Ohm\'s Law: More Than V=IR',
    date: '2009-09-28',
    description: 'Breaking down the most fundamental equation in electronics and why it\'s more profound than it seems.',
    tags: ['electronics', 'tutorial', 'engineering', 'education'],
    readTime: '7 min',
  },
  {
    title: 'Buffalo\'s Tech Scene: First Impressions',
    date: '2009-10-02',
    description: 'Exploring the local tech community as a freshman - hackerspaces, meetups, and opportunities.',
    tags: ['buffalo', 'tech', 'community', 'networking'],
    readTime: '5 min',
  },
  {
    title: 'Debugging My First Circuit: Lessons in Patience',
    date: '2009-10-08',
    description: 'Three hours tracking down a backwards LED taught me more about engineering than any textbook.',
    tags: ['electronics', 'debugging', 'learning', 'hardware'],
    readTime: '4 min',
  },
  {
    title: 'Linux vs Windows for Engineering Students',
    date: '2009-10-12',
    description: 'Why I switched to Ubuntu for my engineering coursework and never looked back.',
    tags: ['linux', 'tools', 'productivity', 'engineering'],
    readTime: '6 min',
  },
  {
    title: 'Halloween LED Project: Spooky Eyes',
    date: '2009-10-25',
    description: 'Building motion-activated glowing eyes for our dorm floor\'s haunted house.',
    tags: ['electronics', 'arduino', 'projects', 'halloween'],
    readTime: '8 min',
  },
  {
    title: 'Midterm Survival Guide for EE Students',
    date: '2009-11-02',
    description: 'Study strategies that helped me ace my first round of engineering exams.',
    tags: ['university', 'studying', 'tips', 'engineering'],
    readTime: '5 min',
  },
  {
    title: 'Building a Weather Station with Arduino',
    date: '2009-11-09',
    description: 'My first real Arduino project - monitoring Buffalo\'s unpredictable weather from my dorm room.',
    tags: ['arduino', 'projects', 'weather', 'programming'],
    readTime: '9 min',
  },
  {
    title: 'Breadboard Best Practices I Wish I Knew Earlier',
    date: '2009-11-16',
    description: 'Simple tips that would have saved me hours of debugging time in the lab.',
    tags: ['electronics', 'tutorial', 'tips', 'hardware'],
    readTime: '6 min',
  },
  {
    title: 'Thanksgiving Break Project: FM Radio from Scratch',
    date: '2009-11-25',
    description: 'Building an FM radio receiver with basic components - understanding RF the hard way.',
    tags: ['electronics', 'radio', 'projects', 'rf'],
    readTime: '10 min',
  },
  {
    title: 'Finals Prep: Circuit Analysis Study Guide',
    date: '2009-12-07',
    description: 'Comprehensive notes on nodal analysis, mesh analysis, and Thevenin equivalents.',
    tags: ['electronics', 'studying', 'tutorial', 'university'],
    readTime: '12 min',
  },
  {
    title: 'Winter Photography: Capturing Buffalo Snow',
    date: '2009-12-14',
    description: 'First attempts at winter photography - technical challenges and frozen fingers.',
    tags: ['photography', 'buffalo', 'winter', 'hobby'],
    readTime: '5 min',
  },
  {
    title: 'Choosing Components: A Beginner\'s Guide',
    date: '2009-12-18',
    description: 'How to read datasheets, pick the right resistor tolerance, and not blow up your projects.',
    tags: ['electronics', 'tutorial', 'components', 'guide'],
    readTime: '7 min',
  },
  {
    title: 'Building a USB Charger from Scratch',
    date: '2009-12-22',
    description: 'Understanding voltage regulation by building a 5V USB charger circuit.',
    tags: ['electronics', 'projects', 'power', 'diy'],
    readTime: '6 min',
  },
  {
    title: 'Reflecting on First Semester: What I Learned',
    date: '2009-12-28',
    description: 'Looking back on my first semester of engineering - successes, failures, and surprises.',
    tags: ['personal', 'university', 'reflection', 'engineering'],
    readTime: '5 min',
  },
  {
    title: 'Holiday Hacking: LED Christmas Ornaments',
    date: '2009-12-30',
    description: 'Last-minute Christmas gift idea: programmable LED ornaments with ATtiny chips.',
    tags: ['electronics', 'arduino', 'christmas', 'projects'],
    readTime: '7 min',
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
    const newPosts = posts2009.map(post => {
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
    console.log('✅ Added 18 posts from 2009 to historicalPosts.ts');
  }
} else {
  console.error('❌ Could not find 2009 section in historicalPosts.ts');
}