import fs from 'fs';
import path from 'path';

// Additional 2010 posts to add
const posts2010Additional = [
  {
    title: 'My First PCB Etching: Adventures in Ferric Chloride',
    date: '2010-06-15',
    description: 'Transitioning from perfboard to custom PCBs using the toner transfer method. Spoiler: ventilation is important!',
    tags: ['pcb', 'etching', 'diy', 'electronics'],
    readTime: '12 min',
  },
  {
    title: 'Building a Spectrum Analyzer with FFT',
    date: '2010-06-25',
    description: 'Creating a real-time audio spectrum analyzer using an ATmega328 and some clever math. Who says 8-bit can\'t do DSP?',
    tags: ['dsp', 'fft', 'microcontroller', 'optimization'],
    readTime: '13 min',
  },
  {
    title: 'Internship Project: Industrial Motor Controller',
    date: '2010-07-05',
    description: 'My summer internship project - designing a three-phase motor controller for industrial automation. Real engineering with real consequences.',
    tags: ['internship', 'motor-control', 'power-electronics', 'industrial'],
    readTime: '14 min',
  },
  {
    title: 'RF Black Magic: Building My First Radio',
    date: '2010-07-20',
    description: 'Attempting to build an FM transmitter and discovering why RF engineering is considered dark arts. So many ways for signals to escape!',
    tags: ['rf', 'radio', 'fm-transmitter', 'analog'],
    readTime: '11 min',
  },
  {
    title: 'The Great Capacitor Plague: A Repair Adventure',
    date: '2010-08-10',
    description: 'Discovering the early 2000s capacitor plague firsthand while fixing old motherboards. Sometimes failure teaches more than success.',
    tags: ['repair', 'capacitors', 'hardware', 'troubleshooting'],
    readTime: '12 min',
  },
  {
    title: 'Building an FPGA Development Board',
    date: '2010-08-25',
    description: 'Designing my own FPGA development board because commercial ones are too expensive. Learning why they cost so much!',
    tags: ['fpga', 'pcb-design', 'hardware', 'high-speed'],
    readTime: '15 min',
  },
  {
    title: 'Junior Year Kickoff: Advanced Courses Begin',
    date: '2010-09-10',
    description: 'Starting junior year with a killer course load - Electromagnetics, DSP, and Computer Architecture. The real engineering begins now.',
    tags: ['university', 'courses', 'junior-year', 'education'],
    readTime: '11 min',
  },
  {
    title: 'The Art of Debugging: A Systematic Approach',
    date: '2010-09-25',
    description: 'After three years of random debugging, finally developing a systematic approach. These techniques just saved a week-long project.',
    tags: ['debugging', 'methodology', 'troubleshooting', 'engineering'],
    readTime: '13 min',
  },
  {
    title: 'DSP Project: Real-Time Audio Effects Processor',
    date: '2010-10-15',
    description: 'Building a real-time audio effects processor for my DSP class. Reverb, echo, and distortion at 48kHz on a measly DSP chip.',
    tags: ['dsp', 'audio', 'real-time', 'embedded'],
    readTime: '14 min',
  },
  {
    title: 'Building a CNC Machine: Sophomore\'s Ambition',
    date: '2010-11-01',
    description: 'Attempting to build a CNC router from scratch. Because manually routing PCBs is tedious and I clearly need more projects.',
    tags: ['cnc', 'mechanical', 'pcb-milling', 'projects'],
    readTime: '15 min',
  },
  {
    title: 'Research Project: Acoustic Localization System',
    date: '2010-11-15',
    description: 'First real research project - building an acoustic localization system for the hearing aid lab. Finding sound sources with millisecond precision.',
    tags: ['research', 'dsp', 'acoustics', 'localization'],
    readTime: '16 min',
  },
  {
    title: 'End of Semester Crunch: Juggling Five Projects',
    date: '2010-12-01',
    description: 'The last month of junior year fall - five major projects due, research deadlines, and trying to maintain sanity. This is engineering school.',
    tags: ['university', 'projects', 'time-management', 'engineering'],
    readTime: '13 min',
  },
  {
    title: 'Year in Review: From Novice to Engineer',
    date: '2010-12-20',
    description: 'Reflecting on 2010 - a year of growth from hobbyist to serious engineering student. Projects completed, lessons learned, and setting ambitious goals for 2011.',
    tags: ['year-review', 'reflection', 'goals', 'personal'],
    readTime: '15 min',
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
    const newPosts = posts2010Additional.map(post => {
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
    console.log(`✅ Added ${posts2010Additional.length} posts from 2010 to historicalPosts.ts`);
  }
} else {
  console.error('❌ Could not find 2010 section in historicalPosts.ts');
}