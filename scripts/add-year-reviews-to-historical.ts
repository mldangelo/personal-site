import fs from 'fs';
import path from 'path';

// Read the current historicalPosts.ts
const filePath = path.join(process.cwd(), 'src/data/historicalPosts.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Year in review entries
const yearReviews = [
  {
    year: 2010,
    afterTitle: 'Joining the UB Nanosatellite Program: Building Actual Spacecraft',
  },
  {
    year: 2011,
    afterTitle: 'Remembering Steve Jobs: How One Person Changed Technology',
  },
  {
    year: 2012,
    afterTitle: 'Graduating Summa Cum Laude: Lessons from Four Years of Engineering',
  },
  {
    year: 2013,
    afterTitle: 'First Week at Facebook: From 20 to 1 Billion Users',
  },
  {
    year: 2014,
    afterTitle: 'Joining Planet Labs: From Graduate Student to Building Earth Observation Systems',
  },
  {
    year: 2015,
    afterTitle: 'Graduating Stanford: What I Learned in the MS Program',
  },
  {
    year: 2016,
    afterTitle: 'Starting Arthena: Building Quantitative Investment for Art',
  },
  {
    year: 2017,
    afterTitle: 'Y Combinator Experience: Lessons from YC W17',
  },
  {
    year: 2018,
    afterTitle: 'Scaling Arthena: From Startup to Sustainable Business',
  },
  {
    year: 2019,
    afterTitle: 'Five Years in Art Tech: Reflections on Building Arthena',
  },
  {
    year: 2020,
    afterTitle: 'New Chapter: Joining SmileID as VP of Engineering',
  },
  {
    year: 2021,
    afterTitle: 'Building Identity Infrastructure for Africa at Scale',
  },
  {
    year: 2022,
    afterTitle: 'Leading 170M Identity Verifications: Engineering at Scale',
  },
  {
    year: 2023,
    afterTitle: 'From SmileID to Promptfoo: Why I\'m Starting Over',
  },
  {
    year: 2024,
    afterTitle: 'Introducing Promptfoo: Open Source LLM Security for Developers',
  },
];

// Add year in review entries
yearReviews.forEach(({ year, afterTitle }) => {
  const searchPattern = new RegExp(`(\\s*\\{[^}]*title: '${afterTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}'[^}]*\\},)`);
  const match = content.match(searchPattern);
  
  if (match) {
    const yearReviewEntry = `
  {
    title: '${year}: Year in Review',
    date: '${year}-12-31',
    description: 'Reflecting on ${year} - ${getYearDescription(year)}, predictions for ${year + 1}, and lessons learned along the way.',
    link: '/blog/${year}-12-31-year-in-review',
    tags: ['year-in-review', 'personal', 'reflection', 'predictions'],
    readTime: '8 min',
  },`;
    
    content = content.replace(match[0], match[0] + yearReviewEntry);
    console.log(`✅ Added ${year} Year in Review`);
  } else {
    console.log(`❌ Could not find anchor for ${year} (${afterTitle})`);
  }
});

function getYearDescription(year: number): string {
  const descriptions: Record<number, string> = {
    2010: 'Sophomore, joined CubeSat program',
    2011: 'Junior, CubeSat hardware lead',
    2012: 'Senior year, interviewing',
    2013: 'Facebook internship',
    2014: 'Started Stanford MS, Planet Labs',
    2015: 'Stanford MS second year',
    2016: 'Started Arthena',
    2017: 'Arthena growth, YC',
    2018: 'Arthena scaling',
    2019: 'Arthena established',
    2020: 'Joined SmileID, pandemic',
    2021: 'SmileID scaling',
    2022: 'SmileID VP Engineering',
    2023: 'SmileID to Promptfoo transition',
    2024: 'Promptfoo founder',
  };
  
  return descriptions[year] || 'a year of growth';
}

// Write the updated content
fs.writeFileSync(filePath, content);
console.log('\n✅ All year in review posts added to historicalPosts.ts');