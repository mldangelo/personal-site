import fs from 'fs';
import path from 'path';

// 2011 batch 2 posts to add
const posts2011Batch2 = [
  {
    title: 'Stanford Orientation: Welcome to the PhD Life',
    date: '2011-06-10',
    description: 'First week as a Stanford PhD student. Imposter syndrome, world-class facilities, and finding my place in Silicon Valley academia.',
    tags: ['stanford', 'phd', 'orientation', 'silicon-valley'],
    readTime: '13 min',
  },
  {
    title: 'CubeSat Launch Day: Three Years of Work Reaches Space',
    date: '2011-07-04',
    description: 'Our satellite finally launches! Watching three years of work ride a rocket to orbit. The anxiety, excitement, and first contact from space.',
    tags: ['cubesat', 'space', 'launch', 'milestone'],
    readTime: '14 min',
  },
  {
    title: 'Silicon Valley Summer: Internships and Startups',
    date: '2011-07-20',
    description: 'First summer in Silicon Valley. Everyone\'s starting companies, including my roommate. The startup bug is contagious.',
    tags: ['silicon-valley', 'startups', 'summer', 'phd-life'],
    readTime: '13 min',
  },
  {
    title: 'Building a Quadcopter from Scratch: The PhD Version',
    date: '2011-08-15',
    description: 'Starting fresh at Stanford means building a better quadcopter. This time with custom flight controller, advanced sensors, and actual control theory.',
    tags: ['quadcopter', 'robotics', 'control-systems', 'computer-vision'],
    readTime: '16 min',
  },
  {
    title: 'First Quarter as PhD Student: Classes, Research, and Survival',
    date: '2011-09-05',
    description: 'The first quarter at Stanford begins. Graduate courses are different, research is hard, and everyone seems smarter. But slowly finding my rhythm.',
    tags: ['stanford', 'phd-life', 'courses', 'research'],
    readTime: '15 min',
  },
  {
    title: 'Steve Jobs Passes: Silicon Valley Mourns',
    date: '2011-10-10',
    description: 'Steve Jobs died today. Stanford and Silicon Valley mourn the loss of a visionary. Reflecting on his impact and the famous Stanford commencement speech.',
    tags: ['steve-jobs', 'silicon-valley', 'reflection', 'stanford'],
    readTime: '12 min',
  },
  {
    title: 'Halloween Hack 2.0: Distributed Scare Network',
    date: '2011-10-25',
    description: 'Upgrading last year\'s Halloween project with mesh networking, machine learning, and coordinated scares. Because PhD students need hobbies too.',
    tags: ['halloween', 'mesh-networking', 'machine-learning', 'iot'],
    readTime: '14 min',
  },
  {
    title: 'The Raspberry Pi Arrives: $35 Computer Changes Everything',
    date: '2011-11-15',
    description: 'Got my hands on one of the first Raspberry Pi boards. This $35 computer is going to democratize computing and launch a million projects.',
    tags: ['raspberry-pi', 'single-board-computer', 'education', 'makers'],
    readTime: '13 min',
  },
  {
    title: 'Year in Review: From CubeSat to Stanford PhD',
    date: '2011-12-20',
    description: 'Reflecting on 2011 - launched a satellite, graduated college, started PhD at Stanford, and discovered Silicon Valley. What a journey.',
    tags: ['year-review', 'reflection', 'stanford', 'personal'],
    readTime: '14 min',
  },
];

// Read current file
const filePath = path.join(process.cwd(), 'src/data/historicalPosts.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Find the last 2011 post
const lastPost2011Pattern = /link: '\/blog\/2011-05-20[^}]+\},/;
const lastPost2011Match = content.match(lastPost2011Pattern);

if (lastPost2011Match) {
  const insertPosition = lastPost2011Match.index! + lastPost2011Match[0].length;
  
  // Build the new posts string
  const newPosts = posts2011Batch2.map(post => {
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
  console.log(`✅ Added ${posts2011Batch2.length} posts from 2011 to historicalPosts.ts`);
} else {
  console.error('❌ Could not find insertion point in historicalPosts.ts');
}