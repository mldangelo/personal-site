import fs from 'fs';
import path from 'path';

// 2012 batch 2 posts to add
const posts2012Batch2 = [
  {
    title: 'Google I/O 2012: Glass, Nexus 7, and the Future',
    date: '2012-06-30',
    description: 'Just watched skydivers livestream from Google Glass while jumping onto the I/O venue. The future is here, and it\'s wearing computers.',
    tags: ['google-io', 'glass', 'android', 'nexus'],
    readTime: '14 min',
  },
  {
    title: 'Building a Gesture Recognition System with Kinect',
    date: '2012-07-15',
    description: 'Using the Kinect SDK to build a gesture-controlled presentation system. No more clicking through slides!',
    tags: ['kinect', 'gesture-recognition', 'computer-vision', 'nui'],
    readTime: '16 min',
  },
  {
    title: 'London Olympics Opening Ceremony: A Celebration of the Web',
    date: '2012-07-25',
    description: 'Watching Tim Berners-Lee tweet "This is for everyone" during the Olympics opening ceremony. The web\'s inventor gets his moment.',
    tags: ['olympics', 'tim-berners-lee', 'web', 'london-2012'],
    readTime: '12 min',
  },
  {
    title: 'Curiosity Lands on Mars: Seven Minutes of Terror',
    date: '2012-08-10',
    description: 'Stayed up all night to watch Curiosity land on Mars. The engineering behind the sky crane is absolutely insane.',
    tags: ['mars', 'curiosity', 'nasa', 'space-exploration'],
    readTime: '15 min',
  },
  {
    title: 'Patent Wars: Apple vs Samsung Verdict',
    date: '2012-08-25',
    description: 'Apple just won $1 billion from Samsung in patent lawsuit. As an engineer, these patent wars are stifling innovation.',
    tags: ['patents', 'apple', 'samsung', 'innovation'],
    readTime: '14 min',
  },
  {
    title: 'Building a Real-Time Collaborative Editor',
    date: '2012-09-10',
    description: 'Inspired by Google Docs, building a real-time collaborative text editor using WebSockets and operational transformation.',
    tags: ['collaborative-editing', 'websockets', 'operational-transformation', 'real-time'],
    readTime: '18 min',
  },
  {
    title: 'iPhone 5 Launch: The Maps Disaster',
    date: '2012-09-20',
    description: 'Got the iPhone 5 today. The hardware is amazing, but Apple Maps is a disaster. Building a maps comparison tool to document the failures.',
    tags: ['iphone', 'apple-maps', 'ios', 'mobile'],
    readTime: '16 min',
  },
  {
    title: 'Building Voice Recognition with the Web Speech API',
    date: '2012-10-05',
    description: 'Chrome just added the Web Speech API. Building a voice-controlled todo app - the future of web interfaces is here!',
    tags: ['web-speech-api', 'voice-recognition', 'javascript', 'chrome'],
    readTime: '17 min',
  },
  {
    title: 'Hadoop at Stanford: Processing Big Data on a Budget',
    date: '2012-10-20',
    description: 'Set up a 50-node Hadoop cluster using old lab computers. Processing terabytes of data for research - on a shoestring budget.',
    tags: ['hadoop', 'big-data', 'distributed-computing', 'mapreduce'],
    readTime: '18 min',
  },
  {
    title: 'Windows 8 Launch: A Tale of Two Interfaces',
    date: '2012-11-10',
    description: 'Installed Windows 8 today. The schizophrenic mix of Metro and Desktop is fascinating from a UI/UX perspective.',
    tags: ['windows-8', 'metro-ui', 'user-interface', 'microsoft'],
    readTime: '15 min',
  },
  {
    title: 'Building Hardware Prototypes with 3D Printing',
    date: '2012-11-25',
    description: 'Got access to Stanford\'s new MakerBot Replicator. 3D printing is revolutionizing how we prototype hardware.',
    tags: ['3d-printing', 'makerbot', 'prototyping', 'hardware'],
    readTime: '16 min',
  },
  {
    title: 'Year in Review: 2012 - The Platform Wars',
    date: '2012-12-20',
    description: 'Reflecting on 2012: Windows 8\'s identity crisis, mobile platform battles, and the rise of maker culture.',
    tags: ['year-review', '2012', 'reflection', 'predictions'],
    readTime: '15 min',
  },
];

// Read current file
const filePath = path.join(process.cwd(), 'src/data/historicalPosts.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Find the last 2012 post from batch 1
const lastPost2012Pattern = /date: '2012-06-15'[^}]+\},/;
const lastPost2012Match = content.match(lastPost2012Pattern);

if (lastPost2012Match) {
  const insertPosition = lastPost2012Match.index! + lastPost2012Match[0].length;
  
  // Build the new posts string
  const newPosts = posts2012Batch2.map(post => {
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
  console.log(`✅ Added ${posts2012Batch2.length} posts from 2012 batch 2 to historicalPosts.ts`);
} else {
  console.error('❌ Could not find insertion point in historicalPosts.ts');
}