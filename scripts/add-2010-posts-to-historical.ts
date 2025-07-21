import fs from 'fs';
import path from 'path';

// 2010 posts to add
const posts2010 = [
  {
    title: 'New Year, New Projects: 2010 Technical Goals',
    date: '2010-01-10',
    description: 'Setting ambitious technical goals for sophomore year - from joining the CubeSat team to mastering PCB design.',
    tags: ['goals', 'personal', 'planning', 'new-year'],
    readTime: '8 min',
  },
  {
    title: 'Understanding Digital Logic: From Gates to Systems',
    date: '2010-01-15',
    description: 'Deep dive into digital design - moving beyond basic gates to understanding complex digital systems and state machines.',
    tags: ['digital-logic', 'education', 'fpga', 'verilog'],
    readTime: '10 min',
  },
  {
    title: 'Oscilloscope Deep Dive: Mastering Your Most Important Tool',
    date: '2010-01-20',
    description: 'Everything I\'ve learned about oscilloscopes - from basic operation to advanced triggering. Your scope is your eyes into the electronic world.',
    tags: ['test-equipment', 'oscilloscope', 'tutorial', 'measurement'],
    readTime: '12 min',
  },
  {
    title: 'Building a Function Generator for Under $50',
    date: '2010-01-25',
    description: 'Tired of borrowing the lab\'s function generator, I built my own. Here\'s how to build a versatile signal source on a student budget.',
    tags: ['test-equipment', 'function-generator', 'diy', 'analog'],
    readTime: '11 min',
  },
  {
    title: 'Power Supply Design: Linear vs Switching',
    date: '2010-02-01',
    description: 'Built both linear and switching regulators this week. Here\'s a practical comparison from someone who melted a heat sink learning the difference.',
    tags: ['power-supply', 'linear', 'switching', 'efficiency'],
    readTime: '12 min',
  },
  {
    title: 'Satellite Communications 101: Getting Signal from Space',
    date: '2010-02-05',
    description: 'Preparing for the CubeSat team interview by learning about satellite communications. How do you talk to something flying 400km overhead at 7.5km/s?',
    tags: ['satellite', 'communications', 'rf', 'cubesat'],
    readTime: '11 min',
  },
  {
    title: 'PCB Design with Eagle: Moving Beyond Breadboards',
    date: '2010-02-10',
    description: 'Finally learning PCB design! Here\'s my journey from breadboard chaos to professional printed circuit boards using Eagle CAD.',
    tags: ['pcb', 'eagle', 'design', 'hardware'],
    readTime: '12 min',
  },
  {
    title: 'Understanding Microcontroller Interrupts: From Polling to Elegance',
    date: '2010-02-20',
    description: 'Finally grasping interrupts after struggling with timing-critical code. Here\'s how interrupts changed everything about my embedded programming.',
    tags: ['microcontroller', 'interrupts', 'embedded', 'programming'],
    readTime: '13 min',
  },
  {
    title: 'Building a Logic Analyzer with Arduino',
    date: '2010-02-25',
    description: 'Commercial logic analyzers cost hundreds. Built my own 8-channel analyzer for $20. It\'s slow but educational!',
    tags: ['logic-analyzer', 'arduino', 'diy', 'test-equipment'],
    readTime: '14 min',
  },
  {
    title: 'CubeSat Power Budget: Every Milliwatt Counts',
    date: '2010-03-01',
    description: 'Calculating power generation and consumption for our CubeSat. When your solar panels generate 2 watts on a good day, efficiency becomes religion.',
    tags: ['cubesat', 'power', 'space', 'engineering'],
    readTime: '15 min',
  },
  {
    title: 'Thermal Management in Small Satellites',
    date: '2010-03-05',
    description: 'Space is hot AND cold. Learning to manage temperatures when your satellite swings from -40°C to +80°C every 45 minutes.',
    tags: ['cubesat', 'thermal', 'space', 'engineering'],
    readTime: '14 min',
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
    const newPosts = posts2010.map(post => {
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
    console.log(`✅ Added ${posts2010.length} posts from 2010 to historicalPosts.ts`);
  }
} else {
  console.error('❌ Could not find 2010 section in historicalPosts.ts');
}