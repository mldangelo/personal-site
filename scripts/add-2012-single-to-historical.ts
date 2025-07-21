import fs from 'fs';
import path from 'path';

// 2012 single post to add
const post2012 = {
  title: 'Building a Quadcopter Flight Controller from Scratch',
  date: '2012-09-15',
  description: 'Commercial flight controllers are expensive. Built my own using Arduino, accelerometer, gyroscope, and lots of PID tuning.',
  tags: ['quadcopter', 'arduino', 'pid-control', 'flight-controller'],
  readTime: '20 min',
};

// Read current file
const filePath = path.join(process.cwd(), 'src/data/historicalPosts.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Find where to insert - after the last 2012 post but before year review
const yearReviewPattern = /date: '2012-12-20'[^}]+\},/;
const yearReviewMatch = content.match(yearReviewPattern);

if (yearReviewMatch) {
  // Find the post right before the year review
  const beforeYearReview = content.lastIndexOf('},', yearReviewMatch.index);
  const insertPosition = beforeYearReview + 2; // After the },
  
  // Build the new post string
  const link = `/blog/${post2012.date}-${post2012.title.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')}`;
  
  const newPost = `
  {
    title: '${post2012.title.replace(/'/g, "\\'")}',
    date: '${post2012.date}',
    description: '${post2012.description.replace(/'/g, "\\'")}',
    link: '${link}',
    tags: [${post2012.tags.map(tag => `'${tag}'`).join(', ')}],
    readTime: '${post2012.readTime}',
  },`;
  
  // Insert the new post
  content = content.slice(0, insertPosition) + newPost + content.slice(insertPosition);
  
  // Write updated content
  fs.writeFileSync(filePath, content);
  console.log(`✅ Added "${post2012.title}" to historicalPosts.ts`);
} else {
  console.error('❌ Could not find insertion point in historicalPosts.ts');
}