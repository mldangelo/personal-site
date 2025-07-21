import fs from 'fs';
import path from 'path';

// Final 2010 posts to add
const posts2010Final = [
  {
    title: 'Understanding Smith Charts: RF Impedance Matching',
    date: '2010-04-03',
    description: 'Finally making sense of those mysterious circular charts. Turns out they\'re incredibly useful for RF design once you understand the magic.',
    tags: ['rf', 'smith-chart', 'impedance-matching', 'tutorial'],
    readTime: '12 min',
  },
  {
    title: 'Eagle CAD Tips: PCB Design Productivity Hacks',
    date: '2010-04-12',
    description: 'Collection of Eagle CAD tricks learned through dozens of PCB designs. These shortcuts will save hours of tedious work.',
    tags: ['eagle-cad', 'pcb-design', 'productivity', 'tips'],
    readTime: '13 min',
  },
  {
    title: 'The Magic of Phase-Locked Loops',
    date: '2010-05-08',
    description: 'Building a PLL from scratch to truly understand frequency synthesis. These clever circuits are everywhere once you start looking.',
    tags: ['pll', 'frequency-synthesis', 'control-systems', 'rf'],
    readTime: '14 min',
  },
  {
    title: 'Hacker News Hardware: What EEs Are Building',
    date: '2010-05-20',
    description: 'Surveying the hardware projects trending on Hacker News in 2010. From Arduino explosions to the dawn of Raspberry Pi rumors.',
    tags: ['hacker-news', 'maker-movement', 'trends', 'community'],
    readTime: '12 min',
  },
  {
    title: 'Space Dreams: Working Toward the Stars',
    date: '2010-06-05',
    description: 'Reflecting on my fascination with space and how it drives my engineering education. From model rockets to CubeSats, the journey skyward.',
    tags: ['space', 'personal', 'cubesat', 'inspiration'],
    readTime: '13 min',
  },
  {
    title: 'Mastering the Volatile Keyword in C',
    date: '2010-07-30',
    description: 'After a week debugging interrupt handlers, finally understanding when and why to use volatile. This keyword will save your embedded projects.',
    tags: ['c-programming', 'embedded', 'volatile', 'optimization'],
    readTime: '15 min',
  },
  {
    title: 'Building a Photoplethysmography Heart Rate Monitor',
    date: '2010-08-30',
    description: 'Creating a pulse oximeter from scratch using LEDs and photodiodes. Seeing your heartbeat in real-time is surprisingly emotional.',
    tags: ['biomedical', 'sensors', 'signal-processing', 'health'],
    readTime: '16 min',
  },
  {
    title: 'The Great LED Cube: 8x8x8 RGB Challenge',
    date: '2010-09-30',
    description: 'Building a 512 RGB LED cube. Because apparently I hate free time and love tedious soldering. But the results are mesmerizing!',
    tags: ['led-cube', 'fpga', 'multiplexing', 'projects'],
    readTime: '17 min',
  },
  {
    title: 'Halloween Hack: Motion-Activated Scare Machine',
    date: '2010-10-31',
    description: 'Built an over-engineered Halloween prop that terrorizes trick-or-treaters. PIR sensors, servo motors, and psychological timing create maximum scares.',
    tags: ['halloween', 'sensors', 'automation', 'projects'],
    readTime: '14 min',
  },
  {
    title: 'New Year\'s Resolution: The Autonomous Decade',
    date: '2010-12-31',
    description: 'As 2010 ends, reflecting on how embedded systems and robotics will shape the next decade. My predictions and goals for 2011 and beyond.',
    tags: ['new-year', 'predictions', 'reflection', 'future'],
    readTime: '13 min',
  },
];

// Read current file
const filePath = path.join(process.cwd(), 'src/data/historicalPosts.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Find the 2010 section - we'll add after the existing 2010 posts
const yearPattern = /\/\/ 2010[\s\S]*?(?=\/\/ 2011|];)/;
const yearMatch = content.match(yearPattern);

if (yearMatch) {
  const yearSection = yearMatch[0];
  const lines = yearSection.split('\n');
  
  // Find the last post in 2010
  let insertIndex = -1;
  for (let i = lines.length - 1; i >= 0; i--) {
    if (lines[i].includes('},')) {
      insertIndex = i;
      break;
    }
  }
  
  if (insertIndex !== -1) {
    // Build the new posts string
    const newPosts = posts2010Final.map(post => {
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
    console.log(`✅ Added ${posts2010Final.length} posts from 2010 to historicalPosts.ts`);
  }
} else {
  console.error('❌ Could not find 2010 section in historicalPosts.ts');
}