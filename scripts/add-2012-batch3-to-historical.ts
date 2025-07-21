import fs from 'fs';
import path from 'path';

// 2012 batch 3 posts to add
const posts2012Batch3 = [
  {
    title: 'Building a Bitcoin Price Tracker',
    date: '2012-01-25',
    description: 'Bitcoin is at $5. Built a real-time price tracker with historical charts. This digital currency thing might actually work.',
    tags: ['bitcoin', 'cryptocurrency', 'websockets', 'd3js'],
    readTime: '16 min',
  },
  {
    title: 'WebRTC First Look: Peer-to-Peer Video in the Browser',
    date: '2012-02-25',
    description: 'Google released WebRTC in Chrome. Built a video chat app with no servers - the future of communication is peer-to-peer.',
    tags: ['webrtc', 'peer-to-peer', 'video-chat', 'real-time'],
    readTime: '17 min',
  },
  {
    title: 'Analyzing Twitter Sentiment with Natural Language Processing',
    date: '2012-03-15',
    description: 'Built a real-time sentiment analysis tool for Twitter. Tracking public opinion on tech topics using Python and NLTK.',
    tags: ['nlp', 'sentiment-analysis', 'twitter', 'python'],
    readTime: '18 min',
  },
  {
    title: 'Building an Arduino Weather Station',
    date: '2012-04-05',
    description: 'Created a solar-powered weather station with Arduino. Monitoring temperature, humidity, pressure, and uploading to the cloud.',
    tags: ['arduino', 'weather-station', 'iot', 'sensors'],
    readTime: '19 min',
  },
  {
    title: 'MongoDB vs PostgreSQL: Choosing the Right Database',
    date: '2012-05-05',
    description: 'Comparing MongoDB and PostgreSQL for our startup project. NoSQL flexibility vs SQL reliability - which wins?',
    tags: ['mongodb', 'postgresql', 'database', 'comparison'],
    readTime: '20 min',
  },
  {
    title: 'Building a Music Visualizer with Web Audio API',
    date: '2012-06-05',
    description: 'The Web Audio API just landed in Chrome. Creating stunning audio visualizations with JavaScript and Canvas.',
    tags: ['web-audio-api', 'visualization', 'canvas', 'javascript'],
    readTime: '18 min',
  },
  {
    title: 'Reverse Engineering the Leap Motion Controller',
    date: '2012-07-05',
    description: 'Got early access to Leap Motion. Reverse engineering the USB protocol to understand how this magic 3D hand tracking works.',
    tags: ['leap-motion', 'reverse-engineering', 'computer-vision', '3d-tracking'],
    readTime: '20 min',
  },
  {
    title: 'Building a DNS Server in Python',
    date: '2012-08-05',
    description: 'Ever wondered how DNS works? Built my own DNS server from scratch to really understand the protocol.',
    tags: ['dns', 'networking', 'python', 'protocols'],
    readTime: '22 min',
  },
];

// Read current file
const filePath = path.join(process.cwd(), 'src/data/historicalPosts.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Find the last 2012 post from batch 2
const lastPost2012Pattern = /date: '2012-12-20'[^}]+\},/;
const lastPost2012Match = content.match(lastPost2012Pattern);

if (lastPost2012Match) {
  const insertPosition = lastPost2012Match.index! + lastPost2012Match[0].length;
  
  // Build the new posts string - insert before the year review
  const newPosts = posts2012Batch3.map(post => {
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
  
  // Find position before year review by searching backwards from the match
  const beforeYearReview = content.lastIndexOf('},', lastPost2012Match.index);
  const insertAt = beforeYearReview + 2; // After the },
  
  // Insert the new posts
  content = content.slice(0, insertAt) + newPosts + content.slice(insertAt);
  
  // Write updated content
  fs.writeFileSync(filePath, content);
  console.log(`✅ Added ${posts2012Batch3.length} posts from 2012 batch 3 to historicalPosts.ts`);
} else {
  console.error('❌ Could not find insertion point in historicalPosts.ts');
}