import fs from 'fs';
import path from 'path';

// Photography posts to add
const photographyPosts = [
  {
    title: 'Getting Started with Astrophotography on a Student Budget',
    date: '2009-10-05',
    description: 'How to capture the night sky with just a DSLR and tripod - my first attempts at photographing stars.',
    tags: ['photography', 'astrophotography', 'tutorial', 'space'],
    readTime: '6 min',
  },
  {
    title: 'Building a DIY Star Tracker with Arduino',
    date: '2009-11-28',
    description: 'Combining my embedded systems knowledge with photography - building a barn door tracker for $40.',
    tags: ['photography', 'astrophotography', 'arduino', 'diy', 'hardware'],
    readTime: '8 min',
  },
  {
    title: 'ISS Transit Photography: Precision Timing and Preparation',
    date: '2010-03-20',
    description: 'Successfully captured the International Space Station transiting the Moon - a lesson in planning and persistence.',
    tags: ['photography', 'astrophotography', 'space', 'iss'],
    readTime: '7 min',
  },
  {
    title: 'Time-Lapse Photography: Capturing Our CubeSat Assembly',
    date: '2011-04-15',
    description: 'Documenting 6 months of satellite construction in 3 minutes - technical and artistic challenges.',
    tags: ['photography', 'cubesat', 'time-lapse', 'space'],
    readTime: '6 min',
  },
  {
    title: 'HDR Astrophotography: Capturing the Full Dynamic Range of the Night Sky',
    date: '2012-02-20',
    description: 'Experimenting with High Dynamic Range techniques for astrophotography - bringing out details from shadows to stars.',
    tags: ['photography', 'astrophotography', 'hdr', 'computational-photography'],
    readTime: '7 min',
  },
  {
    title: 'Silicon Valley Skies: Astrophotography in Light-Polluted Paradise',
    date: '2013-07-22',
    description: 'Adapting astrophotography techniques for the bright skies of the Bay Area during my Facebook internship.',
    tags: ['photography', 'astrophotography', 'bay-area', 'light-pollution'],
    readTime: '6 min',
  },
  {
    title: 'Iceland Aurora Photography: When Nature Provides the Light Show',
    date: '2015-08-15',
    description: 'Photographing the Northern Lights in Iceland - technical challenges and ethereal rewards.',
    tags: ['photography', 'aurora', 'iceland', 'travel', 'astrophotography'],
    readTime: '8 min',
  },
];

// Read current file
const filePath = path.join(process.cwd(), 'src/data/historicalPosts.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Add photography posts to appropriate years
photographyPosts.forEach(post => {
  const year = parseInt(post.date.substring(0, 4));
  const month = parseInt(post.date.substring(5, 7));
  const link = `/blog/${post.date}-${post.title.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')}`;
  
  const newPost = `  {
    title: '${post.title.replace(/'/g, "\\'")}',
    date: '${post.date}',
    description: '${post.description.replace(/'/g, "\\'")}',
    link: '${link}',
    tags: [${post.tags.map(tag => `'${tag}'`).join(', ')}],
    readTime: '${post.readTime}',
  },`;

  // Find position to insert based on date
  const yearPattern = new RegExp(`// ${year}[\\s\\S]*?(?=// ${year + 1}|];)`);
  const yearMatch = content.match(yearPattern);
  
  if (yearMatch) {
    const yearSection = yearMatch[0];
    const lines = yearSection.split('\n');
    
    // Find the right position within the year based on date
    let insertIndex = -1;
    for (let i = lines.length - 1; i >= 0; i--) {
      if (lines[i].includes(`date: '${year}-`)) {
        const dateMatch = lines[i].match(/date: '(\d{4}-\d{2}-\d{2})'/);
        if (dateMatch) {
          const lineDate = dateMatch[1];
          if (lineDate < post.date) {
            insertIndex = i;
            break;
          }
        }
      }
    }
    
    if (insertIndex !== -1) {
      // Find the closing bracket of the post object
      while (insertIndex < lines.length && !lines[insertIndex].includes('},')) {
        insertIndex++;
      }
      
      // Insert after the closing bracket
      lines.splice(insertIndex + 1, 0, newPost);
      const updatedSection = lines.join('\n');
      content = content.replace(yearSection, updatedSection);
      console.log(`✅ Added: ${post.title} (${post.date})`);
    } else {
      console.log(`❌ Could not find position for: ${post.title}`);
    }
  } else {
    console.log(`❌ Could not find year ${year} section for: ${post.title}`);
  }
});

// Write updated content
fs.writeFileSync(filePath, content);
console.log('\n✅ Photography posts added to historicalPosts.ts');