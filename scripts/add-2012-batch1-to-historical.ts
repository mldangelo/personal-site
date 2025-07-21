import fs from 'fs';
import path from 'path';

// 2012 batch 1 posts to add
const posts2012Batch1 = [
  {
    title: 'New Year Resolution: One Open Source Contribution Per Week',
    date: '2012-01-05',
    description: 'Starting 2012 with a commitment to give back to the open source community. 52 weeks, 52 contributions.',
    tags: ['open-source', 'resolution', 'community', 'github'],
    readTime: '10 min',
  },
  {
    title: 'SOPA Blackout: The Day the Internet Fought Back',
    date: '2012-01-15',
    description: 'Wikipedia, Reddit, and thousands of sites went dark to protest SOPA/PIPA. Participating in digital activism from Stanford.',
    tags: ['sopa', 'activism', 'internet-freedom', 'blackout'],
    readTime: '14 min',
  },
  {
    title: 'Raspberry Pi Launch: The $35 Computer Revolution',
    date: '2012-02-10',
    description: 'After months of waiting, finally got my Raspberry Pi! This credit-card sized computer is going to change everything.',
    tags: ['raspberry-pi', 'hardware', 'maker', 'education'],
    readTime: '15 min',
  },
  {
    title: 'Graph Databases: Neo4j and the Future of Connected Data',
    date: '2012-02-20',
    description: 'Exploring graph databases for social network analysis. Neo4j\'s approach to connected data is fascinating.',
    tags: ['neo4j', 'graph-database', 'nosql', 'data-modeling'],
    readTime: '16 min',
  },
  {
    title: 'Building My First Chrome Extension: Productivity Timer',
    date: '2012-03-05',
    description: 'Created a Pomodoro timer Chrome extension. JavaScript in the browser toolbar - the future of productivity tools.',
    tags: ['chrome-extension', 'javascript', 'productivity', 'pomodoro'],
    readTime: '14 min',
  },
  {
    title: 'Instagram Acquired by Facebook for $1 Billion',
    date: '2012-03-20',
    description: 'Facebook just bought Instagram for $1B. A 13-person company with no revenue. Silicon Valley is going crazy.',
    tags: ['instagram', 'acquisition', 'facebook', 'silicon-valley'],
    readTime: '13 min',
  },
  {
    title: 'Deep Learning Breakthrough: Building My First Deep Neural Network',
    date: '2012-04-10',
    description: 'After reading about Hinton\'s work on deep learning, implemented my first deep neural network. The results are mind-blowing.',
    tags: ['deep-learning', 'neural-networks', 'machine-learning', 'cuda'],
    readTime: '17 min',
  },
  {
    title: 'Kickstarter Success: Pebble Smartwatch Raises $10 Million',
    date: '2012-04-25',
    description: 'The Pebble smartwatch just became the most funded Kickstarter ever. Backed it immediately - the future is on our wrists.',
    tags: ['pebble', 'kickstarter', 'smartwatch', 'crowdfunding'],
    readTime: '14 min',
  },
  {
    title: 'SpaceX Dragon: First Commercial Spacecraft to ISS',
    date: '2012-05-10',
    description: 'Watching SpaceX Dragon launch to the ISS. Private space flight is real, and it\'s spectacular.',
    tags: ['spacex', 'dragon', 'space', 'innovation'],
    readTime: '15 min',
  },
  {
    title: 'Diablo III Error 37: When Always-Online Goes Wrong',
    date: '2012-05-25',
    description: 'Diablo III launched with always-online DRM. Spent 4 hours staring at Error 37. Building my own game server to understand why.',
    tags: ['gaming', 'diablo', 'servers', 'drm'],
    readTime: '16 min',
  },
  {
    title: 'WWDC 2012: Retina MacBook Pro Changes Everything',
    date: '2012-06-15',
    description: 'Apple just announced the Retina MacBook Pro. As a developer, this 2880x1800 display is going to change how we build software.',
    tags: ['apple', 'retina', 'macbook', 'web-development'],
    readTime: '15 min',
  },
];

// Read current file
const filePath = path.join(process.cwd(), 'src/data/historicalPosts.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Find the position after 2011 posts
// Look for the last 2011 post to insert after it
const pattern = /date: '2011-11-05[^}]+\},/g;
let lastMatch;
let match;

while ((match = pattern.exec(content)) !== null) {
  lastMatch = match;
}

if (lastMatch) {
  const insertPosition = lastMatch.index! + lastMatch[0].length;
  
  // Build the new posts string
  const newPosts = posts2012Batch1.map(post => {
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
  console.log(`✅ Added ${posts2012Batch1.length} posts from 2012 batch 1 to historicalPosts.ts`);
} else {
  console.error('❌ Could not find insertion point in historicalPosts.ts');
}