import fs from 'fs';
import path from 'path';

// 2011 batch 3 posts to add
const posts2011Batch3 = [
  {
    title: 'Building a Bitcoin Mining Rig: Early Days of Crypto',
    date: '2011-02-05',
    description: 'Bitcoin is at $1. Building a GPU mining rig in my dorm room. This internet money thing might be interesting.',
    tags: ['bitcoin', 'cryptocurrency', 'mining', 'gpu'],
    readTime: '15 min',
  },
  {
    title: 'Winning the Embedded Systems Design Contest',
    date: '2011-02-18',
    description: 'Our team\'s adaptive bike light system won first place at the regional embedded design contest. Smart lighting based on ambient conditions and speed.',
    tags: ['competition', 'embedded-systems', 'teamwork', 'innovation'],
    readTime: '14 min',
  },
  {
    title: 'Deep Learning is Coming: Early Experiments with Neural Networks',
    date: '2011-03-15',
    description: 'Everyone\'s talking about "deep learning" suddenly. Training neural networks on my GPU, seeing hints of what\'s to come. The future is deeper.',
    tags: ['deep-learning', 'neural-networks', 'gpu', 'machine-learning'],
    readTime: '16 min',
  },
  {
    title: 'Hacking the Kinect: 3D Sensing for Robotics',
    date: '2011-04-25',
    description: 'Microsoft\'s Kinect has been reverse engineered. $150 depth sensing is a game changer for robotics. Building 3D SLAM with consumer hardware.',
    tags: ['kinect', 'robotics', '3d-sensing', 'computer-vision'],
    readTime: '15 min',
  },
  {
    title: 'Final Buffalo Hackathon: 24 Hours of Pure Building',
    date: '2011-05-25',
    description: 'Last hackathon before graduation. Built a mesh network emergency communication system. Won "Most Impactful". Perfect send-off from UB.',
    tags: ['hackathon', 'mesh-networking', 'emergency-tech', 'teamwork'],
    readTime: '14 min',
  },
  {
    title: 'Stanford Research: Energy Harvesting Breakthrough',
    date: '2011-06-25',
    description: 'First research success at Stanford! Combined multiple energy sources to finally reach milliwatt harvesting. Advisor impressed. Maybe I belong here.',
    tags: ['research', 'energy-harvesting', 'stanford', 'breakthrough'],
    readTime: '15 min',
  },
  {
    title: 'Building a RepRap 3D Printer: Self-Replicating Machines',
    date: '2011-08-05',
    description: 'Spent a week building a RepRap Prusa Mendel 3D printer. The idea of machines that can print their own parts is mind-blowing. The future of manufacturing is here.',
    tags: ['3d-printing', 'reprap', 'maker', 'manufacturing'],
    readTime: '16 min',
  },
  {
    title: 'Qualifying Exams: The PhD Crucible',
    date: '2011-09-20',
    description: 'Survived the electrical engineering PhD qualifying exams at Stanford. Two days of pure academic trial by fire. Still shaking, but I passed.',
    tags: ['phd', 'quals', 'exams', 'stanford'],
    readTime: '15 min',
  },
  {
    title: 'Silicon Valley Halloween: Tech Costumes Gone Wild',
    date: '2011-10-30',
    description: 'First Silicon Valley Halloween. Engineers take costumes seriously here. Went as a walking breadboard. Lost costume contest to functioning Iron Man suit.',
    tags: ['halloween', 'silicon-valley', 'maker', 'costumes'],
    readTime: '13 min',
  },
  {
    title: 'Thanksgiving Reflections: Grateful for the Journey',
    date: '2011-11-25',
    description: 'First Thanksgiving away from family. Reflecting on the year\'s incredible journey. From Buffalo to Stanford, from student to researcher. Much to be thankful for.',
    tags: ['thanksgiving', 'personal', 'reflection', 'gratitude'],
    readTime: '12 min',
  },
  {
    title: 'New Year\'s Eve: Reflecting on a Transformative 2011',
    date: '2011-12-31',
    description: 'Last hours of 2011. From launching satellites to starting PhD, from East Coast to West. Looking back at the year that changed everything, and forward to what comes next.',
    tags: ['new-year', 'reflection', '2011-review', 'personal'],
    readTime: '13 min',
  },
];

// Read current file
const filePath = path.join(process.cwd(), 'src/data/historicalPosts.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Find the last 2011 post - Year in Review from batch 2
const lastPost2011Pattern = /date: '2011-12-20'[^}]+\},/;
const lastPost2011Match = content.match(lastPost2011Pattern);

if (lastPost2011Match) {
  const insertPosition = lastPost2011Match.index! + lastPost2011Match[0].length;
  
  // Build the new posts string
  const newPosts = posts2011Batch3.map(post => {
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
  console.log(`✅ Added ${posts2011Batch3.length} posts from 2011 to historicalPosts.ts`);
} else {
  console.error('❌ Could not find insertion point in historicalPosts.ts');
}