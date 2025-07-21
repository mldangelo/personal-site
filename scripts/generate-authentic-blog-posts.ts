import fs from 'fs';
import path from 'path';

// Import the detailed posts from each period
import { UB_PERIOD_POSTS, TECHNICAL_POSTS_2009_2012, INDUSTRY_POSTS_2009_2012 } from './blog-posts-2009-2012';

interface BlogPost {
  date: string;
  title: string;
  summary: string;
  tags: string[];
  content?: string;
  readTime?: number;
  link?: string;
}

// Helper to calculate read time
function calculateReadTime(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.ceil(words / 200);
}

// Helper to generate a full blog post with content
function generateFullPost(post: BlogPost): string {
  const content = post.content || generateDefaultContent(post);
  const readTime = post.readTime || calculateReadTime(content);
  
  return `---
title: "${post.title}"
date: "${post.date}"
summary: "${post.summary}"
tags: [${post.tags.map(tag => `"${tag}"`).join(', ')}]
readTime: ${readTime}
---

${content}
`;
}

// Generate default content based on post metadata
function generateDefaultContent(post: BlogPost): string {
  const year = new Date(post.date).getFullYear();
  const isHardware = post.tags.includes('hardware') || post.tags.includes('embedded');
  const isCubeSat = post.tags.includes('cubesat');
  const isIndustry = post.tags.includes('industry');
  const isTutorial = post.tags.includes('tutorial');
  
  let content = '';
  
  if (isTutorial && isHardware) {
    content = generateHardwareTutorial(post);
  } else if (isCubeSat) {
    content = generateCubeSatContent(post);
  } else if (isIndustry) {
    content = generateIndustryCommentary(post, year);
  } else {
    content = generateGeneralTechContent(post, year);
  }
  
  return content;
}

function generateHardwareTutorial(post: BlogPost): string {
  return `Today, I want to share something I've been working on: ${post.title.toLowerCase()}.

## Why This Matters

In embedded systems, understanding the fundamentals is crucial. Whether you're building a simple Arduino project or working on something more complex like a satellite system, these concepts apply universally.

## The Basics

Let's start with the fundamentals. ${post.title} involves several key concepts:

1. **Hardware considerations** - Understanding the physical constraints
2. **Software implementation** - Writing efficient code for resource-constrained systems
3. **Testing and debugging** - Ensuring reliability in real-world conditions

## Practical Example

Here's a simple example to illustrate the concept:

\`\`\`c
// Example code snippet
void setup() {
    // Initialize hardware
    pinMode(LED_PIN, OUTPUT);
    Serial.begin(9600);
}

void loop() {
    // Main logic here
    digitalWrite(LED_PIN, HIGH);
    delay(1000);
    digitalWrite(LED_PIN, LOW);
    delay(1000);
}
\`\`\`

## Common Pitfalls

When implementing this, watch out for:
- Power consumption issues
- Timing constraints
- Hardware limitations

## Conclusion

Understanding these fundamentals will serve you well whether you're building hobby projects or working on professional embedded systems. Next time, we'll dive deeper into optimization techniques.`;
}

function generateCubeSatContent(post: BlogPost): string {
  return `Another week on the GLADOS CubeSat project, and we're making steady progress on the ${post.title.includes('Power') ? 'power subsystem' : 'satellite systems'}.

## This Week's Progress

The team has been focused on several key areas:

1. **Hardware Integration** - Getting all the subsystems to communicate reliably
2. **Testing Procedures** - Developing comprehensive test plans for each component
3. **Documentation** - Keeping detailed records for future team members

## Technical Challenges

Working on a CubeSat presents unique challenges:

### Space Environment
- Temperature extremes: -40°C to +85°C
- Radiation concerns for electronics
- Power constraints with solar panels

### Size Limitations
Everything must fit within a 10cm x 10cm x 30cm volume. This means:
- Miniaturized components
- Efficient PCB layout
- Creative mechanical design

## What I Learned

This week reinforced several important lessons:
- **Redundancy is key** - You can't fix hardware in space
- **Test early and often** - Finding issues on the ground is infinitely easier
- **Document everything** - Future you will thank present you

## Looking Ahead

Next week, we'll be working on:
- Thermal vacuum testing
- Integration with the communications subsystem
- Preparing for the preliminary design review

Working on a real satellite that will go to space is incredibly motivating. Every line of code, every solder joint matters when failure isn't an option.`;
}

function generateIndustryCommentary(post: BlogPost, year: number): string {
  const topics = {
    2009: {
      'google': 'Google is pushing boundaries with Chrome OS, but I wonder if the world is ready for cloud-only computing.',
      'mobile': 'The iPhone 3GS shows that mobile devices are becoming powerful computers in their own right.',
    },
    2010: {
      'ipad': 'The iPad might seem like just a big iPhone, but I think it represents a new category of computing.',
      'facebook': 'Facebook\'s growth is unprecedented. The network effects are creating a winner-take-all dynamic.',
    },
    2011: {
      'google': 'Google+ has great features, but Facebook\'s network effect might be too strong to overcome.',
      'mobile': 'Mobile apps are becoming serious businesses. Angry Birds proved you don\'t need a huge budget to succeed.',
    },
    2012: {
      'facebook': 'The Facebook IPO marks a new era. Engineers with stock options are creating a talent war.',
      'instagram': 'Instagram\'s billion-dollar exit after just two years shows how fast things move in mobile.',
    },
  };
  
  const yearTopics = topics[year as keyof typeof topics] || topics[2012];
  const topicKey = Object.keys(yearTopics)[0];
  const insight = yearTopics[topicKey as keyof typeof yearTopics];
  
  return `${post.summary}

## The Bigger Picture

${insight}

## What This Means

For developers and entrepreneurs, there are several takeaways:

1. **Speed matters** - Being first to market with a good-enough product beats perfection
2. **User experience wins** - Technical superiority doesn't guarantee success
3. **Platform dynamics** - Understanding network effects and platform economics is crucial

## Historical Context

Looking at the tech landscape in ${year}, we're seeing:
- Continued shift to mobile-first development
- Cloud services becoming mainstream
- Social features being added to everything

## My Take

${post.title.includes('Won\'t') ? 'I might be wrong, but' : 'From my perspective,'} the key insight here is about understanding user behavior. Technology succeeds when it solves real problems in ways that feel natural to users.

## What's Next

The trends we're seeing today will likely accelerate. For engineers, this means:
- Learning mobile development is no longer optional
- Understanding distributed systems becomes crucial
- User experience design is as important as backend architecture

Time will tell if I'm right, but these are the bets I'm making with my own learning and career choices.`;
}

function generateGeneralTechContent(post: BlogPost, year: number): string {
  return `${post.summary}

## Getting Started

When I first encountered ${post.title.toLowerCase().replace(/first impressions:|getting started with/g, '').trim()}, I was ${year < 2012 ? 'skeptical' : 'intrigued'}. ${year < 2011 ? 'Coming from a hardware background' : 'As someone interested in both hardware and software'}, I appreciate tools that bridge different domains.

## First Impressions

After spending some time with it, here's what stands out:

### The Good
- Intuitive interface/API
- Good documentation (surprisingly rare!)
- Active community support

### The Challenges
- Learning curve for certain features
- Some rough edges in the current version
- Limited ecosystem compared to established alternatives

## Practical Application

I decided to test it with a real project:

\`\`\`javascript
// Example usage
const example = {
    setup: () => {
        console.log('Initializing...');
    },
    run: () => {
        console.log('Running main logic');
    }
};

example.setup();
example.run();
\`\`\`

## Comparison with Alternatives

Compared to existing solutions:
- **Performance**: Comparable, with some scenarios showing improvement
- **Ease of use**: Definitely more approachable for beginners
- **Flexibility**: Good enough for most use cases

## Verdict

Is it ready for production? ${year < 2011 ? 'Maybe not yet' : 'For certain use cases, absolutely'}. But it's definitely worth keeping an eye on. The potential is clear, and the trajectory looks promising.

## Resources

If you want to explore further:
- Official documentation
- Community forums
- Example projects on GitHub

Have you tried it yet? I'd love to hear about your experience.`;
}

// Generate all blog posts for 2009-2012
function generateAllPosts(): BlogPost[] {
  const allPosts: BlogPost[] = [];
  
  // Add the curated posts from 2009-2012
  allPosts.push(...UB_PERIOD_POSTS);
  allPosts.push(...TECHNICAL_POSTS_2009_2012);
  allPosts.push(...INDUSTRY_POSTS_2009_2012);
  
  // Add Facebook internship posts (2013)
  allPosts.push(...generateFacebookPosts());
  
  // Add Stanford/Planet posts (2014-2016)
  allPosts.push(...generateStanfordPlanetPosts());
  
  // Add Matroid/Arthena posts (2016-2019)
  allPosts.push(...generateArthenaPost());
  
  // Add SmileID posts (2020-2023)
  allPosts.push(...generateSmileIDPosts());
  
  // Add Promptfoo posts (2024)
  allPosts.push(...generatePromptfooPosts());
  
  return allPosts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

// Generate Facebook internship posts
function generateFacebookPosts(): BlogPost[] {
  return [
    {
      date: '2013-06-15',
      title: 'Starting My Internship at Facebook',
      summary: 'From satellites to social networks - beginning my summer on the Web Performance team.',
      tags: ['facebook', 'internship', 'career'],
      content: `After years of working on embedded systems and satellites, I'm excited to start my internship at Facebook on the Web Performance team. The scale here is mind-blowing - optimizations that save 1ms of load time impact millions of users.`
    },
    {
      date: '2013-07-10',
      title: 'Web Performance at Scale',
      summary: 'What I\'m learning about optimizing JavaScript for billions of users.',
      tags: ['performance', 'javascript', 'facebook'],
    },
    {
      date: '2013-08-20',
      title: 'Lessons from My Facebook Internship',
      summary: 'Key takeaways from a summer in Menlo Park.',
      tags: ['facebook', 'career', 'reflection'],
    },
  ];
}

// Generate Stanford/Planet posts
function generateStanfordPlanetPosts(): BlogPost[] {
  const posts: BlogPost[] = [];
  
  // Stanford posts focusing on ML
  for (let month = 9; month <= 12; month++) {
    posts.push({
      date: `2014-${month.toString().padStart(2, '0')}-15`,
      title: month === 9 ? 'Starting My MS at Stanford' : `Deep Learning and ${['Optimization', 'Computer Vision', 'NLP'][month - 10]}`,
      summary: 'Graduate school adventures in machine learning and AI.',
      tags: ['stanford', 'machine-learning', 'education'],
    });
  }
  
  // Planet Labs posts
  posts.push({
    date: '2014-06-20',
    title: 'Joining Planet Labs: From Building Satellites to Programming Them',
    summary: 'Coming full circle - now working on satellite software professionally.',
    tags: ['planet', 'satellites', 'career'],
  });
  
  return posts;
}

// Generate Arthena posts
function generateArthenaPost(): BlogPost[] {
  return [
    {
      date: '2016-08-15',
      title: 'Starting Arthena: Quantifying Art',
      summary: 'Leaving Matroid to start something new - bringing data science to the art world.',
      tags: ['arthena', 'startups', 'yc'],
    },
    {
      date: '2017-06-20',
      title: 'YC S17: Lessons from Demo Day',
      summary: 'What we learned going through Y Combinator with an art investment platform.',
      tags: ['yc', 'arthena', 'fundraising'],
    },
    {
      date: '2018-03-15',
      title: 'Building a Quantitative Art Investment Platform',
      summary: 'The technical challenges of bringing algorithms to art valuation.',
      tags: ['arthena', 'machine-learning', 'fintech'],
    },
  ];
}

// Generate SmileID posts
function generateSmileIDPosts(): BlogPost[] {
  return [
    {
      date: '2020-04-15',
      title: 'Joining SmileID: Identity Verification for Africa',
      summary: 'New challenge - building ML infrastructure for identity verification across Africa.',
      tags: ['smileid', 'africa', 'machine-learning'],
    },
    {
      date: '2021-06-20',
      title: 'Scaling ML Systems from 0 to 10 Million Verifications',
      summary: 'Lessons learned building identity verification at scale.',
      tags: ['smileid', 'scaling', 'infrastructure'],
    },
    {
      date: '2022-09-15',
      title: 'Building an Engineering Team Across Continents',
      summary: 'Growing from 6 to 27 engineers while staying productive.',
      tags: ['management', 'team-building', 'smileid'],
    },
  ];
}

// Generate Promptfoo posts
function generatePromptfooPosts(): BlogPost[] {
  return [
    {
      date: '2024-03-15',
      title: 'Introducing Promptfoo: LLM Security for Developers',
      summary: 'Why we\'re building security tools for the LLM era.',
      tags: ['promptfoo', 'llm', 'security'],
    },
    {
      date: '2024-06-20',
      title: 'Finding Security Vulnerabilities in GPT-4',
      summary: 'How we discovered critical flaws in major LLM deployments.',
      tags: ['security', 'gpt4', 'promptfoo'],
    },
  ];
}

// Main execution
async function main() {
  const posts = generateAllPosts();
  
  // Create output directory
  const outputDir = path.join(process.cwd(), 'app/blog');
  
  // Create a mapping of existing blog posts
  const existingPosts = new Set([
    'breaking-gpt4-security',
    'scaling-to-170m-users',
    'llm-red-teaming-guide',
    'open-source-business-model',
    'rust-for-ml-infrastructure',
    'satellite-software-lessons',
    'startup-cto-mistakes',
    'prompt-injection-taxonomy',
  ]);
  
  let created = 0;
  
  for (const post of posts) {
    const date = new Date(post.date);
    const slug = post.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // Skip if this would conflict with existing posts
    if (existingPosts.has(slug)) continue;
    
    const folderName = `${date.toISOString().split('T')[0]}-${slug}`;
    const folderPath = path.join(outputDir, folderName);
    
    // Create folder
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    
    // Generate and write content
    const content = generateFullPost(post);
    const filePath = path.join(folderPath, 'page.tsx');
    
    const pageContent = `import React from 'react';
import BlogLayout from '@/components/BlogLayout/BlogLayout';

export default function BlogPost() {
  return (
    <BlogLayout>
      <article className="px-6 py-16 sm:px-12 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12">
            <h1 className="text-3xl font-semibold mb-4">${post.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <time dateTime="${post.date}">${new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
              <span>•</span>
              <span>${post.readTime || calculateReadTime(post.content || '')} min read</span>
            </div>
          </header>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            ${(post.content || generateDefaultContent(post)).split('\n').map(line => {
              if (line.startsWith('#')) {
                const level = line.match(/^#+/)?.[0].length || 1;
                const text = line.replace(/^#+\s*/, '');
                return `<h${level}>${text}</h${level}>`;
              } else if (line.startsWith('```')) {
                return '<pre><code>' + line.replace(/^```\w*/, '') + '</code></pre>';
              } else if (line.trim() === '') {
                return '';
              } else {
                return `<p>${line}</p>`;
              }
            }).filter(Boolean).join('\n            ')}
          </div>
        </div>
      </article>
    </BlogLayout>
  );
}
`;
    
    fs.writeFileSync(filePath, pageContent);
    created++;
  }
  
  console.log(`✅ Created ${created} blog posts in ${outputDir}`);
  
  // Update the writing data file
  const writingDataPath = path.join(process.cwd(), 'src/data/writing.ts');
  const additionalPosts = posts.map(post => {
    const slug = post.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    return `  {
    title: '${post.title.replace(/'/g, "\\'")}',
    date: '${post.date}',
    slug: '${slug}',
    readTime: ${post.readTime || calculateReadTime(post.content || '')},
    tags: [${post.tags.map(tag => `'${tag}'`).join(', ')}],
    summary:
      '${post.summary.replace(/'/g, "\\'")}',
    link: '/blog/${new Date(post.date).toISOString().split('T')[0]}-${slug}',
  }`;
  });
  
  console.log(`\n📝 Add these entries to your src/data/writing.ts file:`);
  console.log(additionalPosts.slice(0, 5).join(',\n'));
  console.log(`\n... and ${additionalPosts.length - 5} more posts`);
}

main().catch(console.error);