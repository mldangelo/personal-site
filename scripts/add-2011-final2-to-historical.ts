import fs from 'fs';
import path from 'path';

// 2011 final posts batch 2 to add
const posts2011Final2 = [
  {
    title: 'Getting Started with Node.js: Server-Side JavaScript',
    date: '2011-01-30',
    description: 'Node.js is gaining traction. Building my first server-side JavaScript application. Event-driven, non-blocking I/O feels revolutionary.',
    tags: ['nodejs', 'javascript', 'server', 'real-time'],
    readTime: '15 min',
  },
  {
    title: 'WebGL Launch: 3D Graphics in the Browser',
    date: '2011-03-30',
    description: 'WebGL 1.0 just launched! No more plugins for 3D graphics. Building my first shader-based visualization in the browser.',
    tags: ['webgl', '3d-graphics', 'browser', 'visualization'],
    readTime: '16 min',
  },
  {
    title: 'Google+ Launch: Can It Challenge Facebook?',
    date: '2011-08-20',
    description: 'Got my Google+ invite! Exploring Google\'s take on social networking. Circles are clever, but will anyone switch from Facebook?',
    tags: ['google-plus', 'social-media', 'technology', 'review'],
    readTime: '14 min',
  },
  {
    title: 'Building with Bootstrap: Twitter\'s Gift to Web Developers',
    date: '2011-11-05',
    description: 'Twitter just open-sourced Bootstrap. This CSS framework might finally make me a competent front-end developer.',
    tags: ['bootstrap', 'css', 'web-development', 'design'],
    readTime: '13 min',
  },
];

// Read current file
const filePath = path.join(process.cwd(), 'src/data/historicalPosts.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Find the last 2011 post
const lastPost2011Pattern = /date: '2011-12-28'[^}]+\},/;
const lastPost2011Match = content.match(lastPost2011Pattern);

if (lastPost2011Match) {
  const insertPosition = lastPost2011Match.index! + lastPost2011Match[0].length;
  
  // Build the new posts string
  const newPosts = posts2011Final2.map(post => {
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
  console.log(`✅ Added ${posts2011Final2.length} posts from 2011 final batch 2 to historicalPosts.ts`);
} else {
  console.error('❌ Could not find insertion point in historicalPosts.ts');
}