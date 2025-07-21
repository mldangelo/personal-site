import fs from 'fs';
import path from 'path';

// 2011 posts to add
const posts2011 = [
  {
    title: 'Senior Year Begins: The Final Push',
    date: '2011-01-05',
    description: 'Starting the last semester at UB with senior design, grad school applications, and the CubeSat launch approaching. The pressure is real.',
    tags: ['university', 'senior-year', 'cubesat', 'grad-school'],
    readTime: '12 min',
  },
  {
    title: 'Building a Software Defined Radio from Scratch',
    date: '2011-01-15',
    description: 'Creating a complete SDR system with an FPGA and high-speed ADC. DC to daylight, here we come!',
    tags: ['sdr', 'fpga', 'rf', 'gnu-radio'],
    readTime: '16 min',
  },
  {
    title: 'Senior Design: Autonomous Search and Rescue Quadcopter',
    date: '2011-01-28',
    description: 'Building a drone that can find lost hikers autonomously. Computer vision, GPS navigation, and lots of crashes.',
    tags: ['senior-design', 'quadcopter', 'autonomous', 'computer-vision'],
    readTime: '15 min',
  },
  {
    title: 'GPU Computing with CUDA: Parallel Processing Power',
    date: '2011-02-10',
    description: 'Discovering the massive parallel processing power of GPUs. From bitcoin mining to neural networks, CUDA changes everything.',
    tags: ['cuda', 'gpu', 'parallel-computing', 'optimization'],
    readTime: '14 min',
  },
  {
    title: 'Grad School Acceptance: Stanford Bound!',
    date: '2011-02-22',
    description: 'The envelope arrived. Starting PhD at Stanford in the fall. Excited, terrified, and ready for the next chapter.',
    tags: ['grad-school', 'stanford', 'personal', 'milestone'],
    readTime: '11 min',
  },
  {
    title: 'Presenting at ICASSP: First Conference Experience',
    date: '2011-03-05',
    description: 'Presenting my acoustic localization research at ICASSP in Prague. First international conference, first time in Europe, lots of firsts.',
    tags: ['conference', 'research', 'travel', 'acoustic-localization'],
    readTime: '13 min',
  },
  {
    title: 'The IoT Revolution Begins: Connecting Everything',
    date: '2011-03-20',
    description: 'Building internet-connected devices before "IoT" was cool. WiFi modules are finally cheap enough for hobby projects!',
    tags: ['iot', 'wifi', 'projects', 'embedded'],
    readTime: '15 min',
  },
  {
    title: 'April Fools Hack: The Oscilloscope Music Player',
    date: '2011-04-02',
    description: 'Turned the lab oscilloscope into a music visualizer for April Fools. Professor was not amused. Students were delighted.',
    tags: ['april-fools', 'oscilloscope', 'prank', 'audio-visual'],
    readTime: '14 min',
  },
  {
    title: 'Time-Lapse Photography: Capturing Our CubeSat Assembly',
    date: '2011-04-18',
    description: 'Documenting 6 months of satellite construction in 3 minutes. Technical challenges of long-term time-lapse and the art of showing progress.',
    tags: ['photography', 'cubesat', 'time-lapse', 'documentation'],
    readTime: '13 min',
  },
  {
    title: 'Graduation Day: From Buffalo to Silicon Valley',
    date: '2011-05-07',
    description: 'Four years of engineering education complete. Diploma in hand, California bound. Reflecting on the journey and looking ahead.',
    tags: ['graduation', 'university', 'personal', 'milestone'],
    readTime: '12 min',
  },
  {
    title: 'Cross-Country Road Trip: Buffalo to Palo Alto',
    date: '2011-05-20',
    description: 'Driving 3,000 miles with everything I own. A road trip filled with electronics stores, national parks, and the excitement of starting fresh.',
    tags: ['road-trip', 'moving', 'stanford', 'personal'],
    readTime: '14 min',
  },
];

// Read current file
const filePath = path.join(process.cwd(), 'src/data/historicalPosts.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Find where to insert 2011 posts
const yearPattern = /\/\/ 2011/;
const yearMatch = content.match(yearPattern);

if (yearMatch) {
  // Find the position after the // 2011 comment
  const insertPosition = content.indexOf('// 2011') + '// 2011'.length;
  
  // Build the new posts string
  const newPosts = posts2011.map(post => {
    const link = `/blog/${post.date}-${post.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')}`;
    
    return `
  {
    title: '${post.title.replace(/'/g, "\\'")}',
    date: '${post.date}',
    description: '${post.description.replace(/'/g, "\\'")}',
    link: '${link}',
    tags: [${post.tags.map(tag => `'${tag}'`).join(', ')}],
    readTime: '${post.readTime}',
  },`;
  }).join('');
  
  // Insert the new posts
  content = content.slice(0, insertPosition) + newPosts + content.slice(insertPosition);
  
  // Write updated content
  fs.writeFileSync(filePath, content);
  console.log(`✅ Added ${posts2011.length} posts from 2011 to historicalPosts.ts`);
} else {
  console.error('❌ Could not find 2011 section in historicalPosts.ts');
}