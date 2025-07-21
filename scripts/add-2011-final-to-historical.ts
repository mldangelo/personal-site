import fs from 'fs';
import path from 'path';

// 2011 final posts to add
const posts2011Final = [
  {
    title: 'Building a Laser Projector: Vector Graphics in the Air',
    date: '2011-01-20',
    description: 'Created a laser projector using galvanometers and an Arduino for displaying vector graphics. The future of displays might not need screens.',
    tags: ['laser', 'projector', 'optics', 'vector-graphics'],
    readTime: '14 min',
  },
  {
    title: 'Android Development: Building My First App',
    date: '2011-02-12',
    description: 'Diving into Android development. Building a sensor data logger app. Java feels verbose after C++, but the platform possibilities are endless.',
    tags: ['android', 'mobile', 'java', 'sensors'],
    readTime: '13 min',
  },
  {
    title: 'FPGA Bitcoin Mining: Racing Against ASICs',
    date: '2011-03-20',
    description: 'Implementing SHA-256 on an FPGA for Bitcoin mining. Getting 100 MH/s, but ASICs are coming. The mining arms race is real.',
    tags: ['fpga', 'bitcoin', 'cryptocurrency', 'hardware'],
    readTime: '15 min',
  },
  {
    title: 'Teaching Arduino Workshop: Spreading the Hardware Love',
    date: '2011-04-05',
    description: 'Taught my first Arduino workshop to fellow students. Seeing people\'s eyes light up when their LED blinks for the first time never gets old.',
    tags: ['arduino', 'teaching', 'workshop', 'education'],
    readTime: '12 min',
  },
  {
    title: 'Senior Design Demo Day: The Final Presentation',
    date: '2011-05-30',
    description: 'Final presentation of our autonomous drone project. Live demos are terrifying but it worked! Four years of engineering education culminating in 15 minutes.',
    tags: ['senior-design', 'presentation', 'drone', 'milestone'],
    readTime: '14 min',
  },
  {
    title: 'West Coast Electronics Surplus: Paradise Found',
    date: '2011-07-30',
    description: 'Discovered the electronics surplus stores of Silicon Valley. Weird Stuff Warehouse, Halted, and more. Where old tech goes to find new life.',
    tags: ['surplus', 'electronics', 'silicon-valley', 'makers'],
    readTime: '13 min',
  },
  {
    title: 'Publishing First IEEE Paper: From Research to Publication',
    date: '2011-09-30',
    description: 'First academic paper accepted to IEEE conference! The peer review process is brutal but seeing your work in print is worth it.',
    tags: ['research', 'ieee', 'publication', 'academic'],
    readTime: '15 min',
  },
  {
    title: 'The Great California Earthquake: First Major Quake Experience',
    date: '2011-10-20',
    description: 'Experienced my first real California earthquake. 5.2 magnitude. The ground literally waves. East Coast weather seems tame now.',
    tags: ['earthquake', 'california', 'experience', 'natural-disaster'],
    readTime: '12 min',
  },
  {
    title: 'Black Friday Electronics Shopping: Silicon Valley Edition',
    date: '2011-11-26',
    description: 'Black Friday at Fry\'s Electronics in Silicon Valley. Engineers camping out for component deals. Only here would oscilloscopes be door busters.',
    tags: ['black-friday', 'electronics', 'shopping', 'silicon-valley'],
    readTime: '11 min',
  },
  {
    title: 'End of First PhD Year: Lessons in Humility and Growth',
    date: '2011-12-10',
    description: 'Wrapping up first year as Stanford PhD student. Learned more about what I don\'t know than what I do. The journey is just beginning.',
    tags: ['phd', 'stanford', 'reflection', 'growth'],
    readTime: '14 min',
  },
  {
    title: 'Building a Digital Oscilloscope UI: When Hardware Meets Software',
    date: '2011-12-28',
    description: 'Creating a modern UI for a DIY digital oscilloscope. Real-time waveform rendering, FFT displays, and measurement tools. Hardware is only half the battle.',
    tags: ['oscilloscope', 'ui', 'hardware', 'software'],
    readTime: '15 min',
  },
];

// Read current file
const filePath = path.join(process.cwd(), 'src/data/historicalPosts.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Find the last 2011 post - New Year's Eve from batch 3
const lastPost2011Pattern = /date: '2011-12-31'[^}]+\},/;
const lastPost2011Match = content.match(lastPost2011Pattern);

if (lastPost2011Match) {
  const insertPosition = lastPost2011Match.index! + lastPost2011Match[0].length;
  
  // Build the new posts string
  const newPosts = posts2011Final.map(post => {
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
  console.log(`✅ Added ${posts2011Final.length} posts from 2011 final batch to historicalPosts.ts`);
} else {
  console.error('❌ Could not find insertion point in historicalPosts.ts');
}