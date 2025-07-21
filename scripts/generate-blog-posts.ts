import fs from 'fs';
import path from 'path';

interface BlogPost {
  title: string;
  date: string;
  summary: string;
  content: string;
  tags: string[];
  category: string;
  readTime: number;
  period: string;
}

interface PostIdea {
  title: string;
  date: string;
  tags: string[];
  category: string;
  theme: string;
  relatedToWork?: string;
}

// Timeline periods based on resume
const TIMELINE_PERIODS = {
  'UB_EARLY': { start: '2009-01-01', end: '2010-09-30', work: 'University at Buffalo', focus: 'electrical engineering, embedded systems' },
  'UB_SATELLITE': { start: '2010-10-01', end: '2012-05-31', work: 'UB Nanosatellite Program', focus: 'cubesat, power systems, hardware' },
  'UB_SENIOR': { start: '2012-01-01', end: '2012-05-31', work: 'Senior Year', focus: 'graduation, job search' },
  'FACEBOOK': { start: '2013-06-01', end: '2013-09-01', work: 'Facebook Internship', focus: 'web performance, large scale systems' },
  'STANFORD_START': { start: '2014-09-01', end: '2015-01-01', work: 'Stanford MS Start', focus: 'machine learning, optimization' },
  'PLANET': { start: '2014-06-01', end: '2015-01-01', work: 'Planet Labs', focus: 'satellite software, distributed systems' },
  'STANFORD_END': { start: '2015-01-01', end: '2016-06-01', work: 'Stanford MS', focus: 'deep learning, computer vision' },
  'MATROID': { start: '2016-01-01', end: '2016-08-01', work: 'Matroid Co-founder', focus: 'computer vision, startups' },
  'ARTHENA_START': { start: '2016-08-01', end: '2017-12-31', work: 'Arthena Early Days', focus: 'art tech, fundraising, YC' },
  'ARTHENA_GROWTH': { start: '2018-01-01', end: '2019-12-31', work: 'Arthena Growth', focus: 'quantitative finance, art market' },
  'SMILEID_START': { start: '2020-04-01', end: '2021-12-31', work: 'SmileID Early', focus: 'identity verification, Africa, scaling' },
  'SMILEID_SCALE': { start: '2022-01-01', end: '2023-10-31', work: 'SmileID Scale', focus: 'ML infrastructure, team building' },
  'PROMPTFOO': { start: '2024-03-01', end: '2024-12-31', work: 'Promptfoo', focus: 'LLM security, developer tools' },
};

// Tech trends by year
const TECH_TRENDS = {
  2009: ['iPhone 3GS', 'Android growth', 'Node.js launch', 'Bitcoin whitepaper', 'Chrome OS', 'MongoDB'],
  2010: ['iPad launch', 'Instagram launch', 'GitHub growth', 'Angry Birds', 'Kinect', 'Quora launch'],
  2011: ['Steve Jobs death', 'Siri launch', 'Google+', 'Minecraft official', 'Chromebook', 'Node.js momentum'],
  2012: ['Facebook IPO', 'Raspberry Pi', 'Instagram acquisition', 'MOOC explosion', 'Curiosity Mars', 'Bootstrap'],
  2013: ['Edward Snowden', 'Docker launch', 'React announcement', 'Bitcoin boom', 'Google Glass', 'Slack founded'],
  2014: ['Heartbleed', 'Swift announced', 'Kubernetes', 'Oculus acquisition', 'Ice Bucket Challenge', 'Ethereum'],
  2015: ['React Native', 'TensorFlow release', 'Windows 10', 'SpaceX landing', 'Apple Watch', 'Slack growth'],
  2016: ['Pokemon Go', 'AlphaGo', 'Snapchat IPO prep', 'Trump election', 'VR year', 'TensorFlow 1.0'],
  2017: ['ICO boom', 'WannaCry', 'Bitcoin $20k', 'Equifax breach', 'iPhone X', 'PyTorch'],
  2018: ['GDPR', 'Cambridge Analytica', 'Meltdown/Spectre', 'GitHub acquisition', 'TikTok global', 'Kubernetes mainstream'],
  2019: ['GPT-2', 'Disney+', 'Libra announcement', 'WeWork saga', '5G launch', 'Zoom growth start'],
  2020: ['COVID/remote work', 'Zoom explosion', 'GPT-3', 'M1 chip', 'TikTok ban threats', 'Robinhood/GME'],
  2021: ['NFT boom', 'Web3 hype', 'Metaverse', 'Log4j', 'Evergrande', 'Clubhouse peak', 'El Salvador Bitcoin'],
  2022: ['ChatGPT launch', 'FTX collapse', 'Twitter acquisition', 'Stable Diffusion', 'Ukraine war tech', 'Layoffs begin'],
  2023: ['GPT-4', 'AI boom', 'SVB collapse', 'Vision Pro announce', 'X rebrand', 'Threads launch'],
  2024: ['Claude 3', 'Sora', 'Llama 3', 'AI regulation', 'Apple Intelligence', 'Gemini'],
};

// Post categories
const CATEGORIES = [
  'technical',
  'thoughts',
  'projects',
  'tutorials',
  'industry',
  'learning',
  'hardware',
  'ml',
  'startup',
  'security',
];

// Helper function to calculate read time
function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Helper function to generate post slug
function generateSlug(title: string, date: string): string {
  const dateStr = new Date(date).toISOString().split('T')[0];
  const titleSlug = title.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `${dateStr}-${titleSlug}`;
}

// Generate post ideas for a specific period
function generatePostIdeasForPeriod(periodKey: string): PostIdea[] {
  const period = TIMELINE_PERIODS[periodKey as keyof typeof TIMELINE_PERIODS];
  const ideas: PostIdea[] = [];
  
  const startDate = new Date(period.start);
  const endDate = new Date(period.end);
  
  // Generate ~1 post per week
  const currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const year = currentDate.getFullYear();
    const trends = TECH_TRENDS[year as keyof typeof TECH_TRENDS] || [];
    
    // Rotate through different post types
    const weekNumber = Math.floor((currentDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
    const postType = weekNumber % 5;
    
    let idea: PostIdea;
    
    switch (postType) {
      case 0: // Technical tutorial
        idea = generateTechnicalTutorial(period, currentDate, trends);
        break;
      case 1: // Project update
        idea = generateProjectUpdate(period, currentDate);
        break;
      case 2: // Industry commentary
        idea = generateIndustryCommentary(period, currentDate, trends);
        break;
      case 3: // Learning/thoughts
        idea = generateLearningPost(period, currentDate);
        break;
      case 4: // Tool/library review
        idea = generateToolReview(period, currentDate, trends);
        break;
      default:
        idea = generateTechnicalTutorial(period, currentDate, trends);
    }
    
    ideas.push(idea);
    currentDate.setDate(currentDate.getDate() + 7); // Move to next week
  }
  
  return ideas;
}

// Generate different types of posts
function generateTechnicalTutorial(period: any, date: Date, trends: string[]): PostIdea {
  const tutorials = {
    'hardware': [
      'Building a Power Management System for Embedded Devices',
      'Designing PCBs with Eagle: A Beginner\'s Guide',
      'I2C vs SPI: When to Use Each Protocol',
      'Debugging Embedded Systems with Logic Analyzers',
    ],
    'web performance': [
      'Optimizing JavaScript Bundle Size',
      'Understanding the Critical Rendering Path',
      'Profiling Web Apps with Chrome DevTools',
      'Lazy Loading Images for Better Performance',
    ],
    'machine learning': [
      'Implementing Gradient Descent from Scratch',
      'Understanding Convolutional Neural Networks',
      'Feature Engineering for Machine Learning',
      'Cross-Validation Techniques Explained',
    ],
    'satellite software': [
      'Building Fault-Tolerant Systems for Space',
      'Telemetry Processing at Scale',
      'Time Synchronization in Distributed Systems',
      'Command and Control Software Architecture',
    ],
  };
  
  const focusArea = period.focus.split(',')[0].trim();
  const tutorialSet = tutorials[focusArea as keyof typeof tutorials] || tutorials.hardware;
  const title = tutorialSet[Math.floor(Math.random() * tutorialSet.length)];
  
  return {
    title,
    date: date.toISOString().split('T')[0],
    tags: [focusArea, 'tutorial', 'programming'],
    category: 'tutorials',
    theme: focusArea,
    relatedToWork: period.work,
  };
}

function generateProjectUpdate(period: any, date: Date): PostIdea {
  const projectTypes = {
    'cubesat': 'CubeSat Power Subsystem Update',
    'satellite software': 'Improving Satellite Command Processing',
    'computer vision': 'Building a Real-Time Object Detection System',
    'art tech': 'Quantifying Art Market Trends with Data',
    'identity verification': 'Scaling Identity Verification in Emerging Markets',
    'LLM security': 'Detecting Prompt Injection Attacks',
  };
  
  const focusArea = period.focus.split(',')[0].trim();
  const baseTitle = projectTypes[focusArea as keyof typeof projectTypes] || 'Project Update';
  
  return {
    title: `${baseTitle}: Week ${Math.floor(Math.random() * 12) + 1}`,
    date: date.toISOString().split('T')[0],
    tags: [focusArea, 'projects', period.work.toLowerCase().replace(/\s+/g, '-')],
    category: 'projects',
    theme: 'project update',
    relatedToWork: period.work,
  };
}

function generateIndustryCommentary(period: any, date: Date, trends: string[]): PostIdea {
  const relevantTrend = trends[Math.floor(Math.random() * trends.length)];
  const titles = [
    `Thoughts on ${relevantTrend}`,
    `Why ${relevantTrend} Matters`,
    `The Future of ${relevantTrend}`,
    `${relevantTrend}: A Developer's Perspective`,
    `What ${relevantTrend} Means for Startups`,
  ];
  
  return {
    title: titles[Math.floor(Math.random() * titles.length)],
    date: date.toISOString().split('T')[0],
    tags: ['industry', 'trends', relevantTrend.toLowerCase().replace(/\s+/g, '-')],
    category: 'industry',
    theme: 'commentary',
    relatedToWork: period.work,
  };
}

function generateLearningPost(period: any, date: Date): PostIdea {
  const learningTopics = {
    'machine learning': [
      'What I Learned from Andrew Ng\'s ML Course',
      'Deep Learning Papers I\'m Reading',
      'Understanding Backpropagation',
      'My Journey into Computer Vision',
    ],
    'startups': [
      'Lessons from YC',
      'Finding Product-Market Fit',
      'The Art of Fundraising',
      'Building a Technical Team',
    ],
    'embedded systems': [
      'From Software to Hardware',
      'Learning PCB Design',
      'Understanding Real-Time Systems',
      'Power Management Fundamentals',
    ],
  };
  
  const focusArea = period.focus.includes('startup') ? 'startups' : 
                    period.focus.includes('machine learning') ? 'machine learning' : 
                    'embedded systems';
  
  const topics = learningTopics[focusArea];
  
  return {
    title: topics[Math.floor(Math.random() * topics.length)],
    date: date.toISOString().split('T')[0],
    tags: ['learning', focusArea, 'personal'],
    category: 'thoughts',
    theme: 'learning journey',
    relatedToWork: period.work,
  };
}

function generateToolReview(period: any, date: Date, trends: string[]): PostIdea {
  const tools = {
    2009: ['Git', 'Node.js', 'MongoDB', 'jQuery', 'Arduino'],
    2010: ['Redis', 'Heroku', 'GitHub', 'iPad for Development', 'Chrome DevTools'],
    2011: ['CoffeeScript', 'Sublime Text 2', 'Bootstrap', 'PhoneGap', 'Cloud9 IDE'],
    2012: ['Vagrant', 'Yeoman', 'TypeScript Beta', 'Grunt', 'Meteor'],
    2013: ['Docker', 'React', 'Atom Editor', 'AngularJS', 'Ionic'],
    2014: ['Kubernetes', 'Swift', 'Sketch', 'Slack', 'Let\'s Encrypt'],
    2015: ['VS Code', 'GraphQL', 'Redux', 'TensorFlow', 'Webpack'],
    2016: ['Yarn', 'Create React App', 'PyTorch', 'Serverless', 'Vue.js'],
    2017: ['Parcel', 'Gatsby', 'Next.js', 'Flutter', 'Cypress'],
    2018: ['Deno', 'Zeit Now', 'Netlify', 'Emotion', 'GitHub Actions'],
    2019: ['Rome', 'Svelte', 'Tailwind CSS', 'Figma', 'Notion'],
    2020: ['Vite', 'Snowpack', 'Remix', 'Supabase', 'Roam Research'],
    2021: ['SWC', 'Tauri', 'Prisma', 'PlanetScale', 'Linear'],
    2022: ['Bun', 'tRPC', 'Astro', 'Railway', 'Arc Browser'],
    2023: ['Claude', 'Cursor', 'v0', 'Warp Terminal', 'Perplexity'],
    2024: ['Claude 3', 'Windsurf', 'Zed', 'OpenRouter', 'Continue'],
  };
  
  const year = date.getFullYear();
  const yearTools = tools[year as keyof typeof tools] || tools[2024];
  const tool = yearTools[Math.floor(Math.random() * yearTools.length)];
  
  return {
    title: `First Impressions: ${tool}`,
    date: date.toISOString().split('T')[0],
    tags: ['tools', tool.toLowerCase().replace(/\s+/g, '-'), 'review'],
    category: 'technical',
    theme: 'tool review',
    relatedToWork: period.work,
  };
}

// Generate actual blog post content
function generateBlogPost(idea: PostIdea): BlogPost {
  const content = generatePostContent(idea);
  
  return {
    title: idea.title,
    date: idea.date,
    summary: generateSummary(idea),
    content,
    tags: idea.tags,
    category: idea.category,
    readTime: calculateReadTime(content),
    period: idea.relatedToWork || '',
  };
}

function generateSummary(idea: PostIdea): string {
  const summaryTemplates = {
    'tutorials': `A comprehensive guide to ${idea.title.toLowerCase()}. Learn the fundamentals and best practices.`,
    'projects': `Updates on my work at ${idea.relatedToWork}. Progress, challenges, and lessons learned.`,
    'industry': `My thoughts on recent developments in the tech industry and what they mean for developers.`,
    'thoughts': `Reflections on my journey in tech and lessons learned along the way.`,
    'technical': `An in-depth look at ${idea.title.split(':')[1]?.trim() || idea.title} and how it can improve your workflow.`,
  };
  
  return summaryTemplates[idea.category as keyof typeof summaryTemplates] || 
         `Thoughts and insights on ${idea.title.toLowerCase()}.`;
}

function generatePostContent(idea: PostIdea): string {
  // This is a simplified content generator. In practice, you'd want more sophisticated content.
  const intro = `I've been ${idea.theme === 'learning journey' ? 'learning about' : 'working with'} ${idea.title.toLowerCase()} ${idea.relatedToWork ? `at ${idea.relatedToWork}` : 'recently'}.`;
  
  const body = `
## Background

${generateBackgroundSection(idea)}

## Key Insights

${generateInsightsSection(idea)}

## What's Next

${generateNextStepsSection(idea)}
`;

  return `${intro}\n${body}`;
}

function generateBackgroundSection(idea: PostIdea): string {
  const backgrounds = {
    'technical': 'This technology has been gaining traction in the developer community.',
    'tutorials': 'Many developers struggle with this concept, so I wanted to share my approach.',
    'projects': 'This project has been a key focus area for our team.',
    'industry': 'The tech industry is constantly evolving, and this trend is particularly interesting.',
    'thoughts': 'Sometimes it\'s important to step back and reflect on our journey.',
  };
  
  return backgrounds[idea.category as keyof typeof backgrounds] || 'Let me provide some context.';
}

function generateInsightsSection(idea: PostIdea): string {
  return `Here are the key things I've learned:\n\n1. First insight\n2. Second insight\n3. Third insight`;
}

function generateNextStepsSection(idea: PostIdea): string {
  return 'Looking forward, I plan to explore this further and share more insights.';
}

// Main function to generate all blog posts
async function generateAllBlogPosts() {
  const allPosts: BlogPost[] = [];
  
  // Generate posts for each period
  for (const periodKey of Object.keys(TIMELINE_PERIODS)) {
    console.log(`Generating posts for ${periodKey}...`);
    const ideas = generatePostIdeasForPeriod(periodKey);
    const posts = ideas.map(generateBlogPost);
    allPosts.push(...posts);
  }
  
  // Sort posts by date
  allPosts.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  console.log(`Generated ${allPosts.length} blog posts`);
  
  // Create output directory
  const outputDir = path.join(process.cwd(), 'generated-blog-posts');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Write posts to files
  for (const post of allPosts) {
    const slug = generateSlug(post.title, post.date);
    const filename = `${slug}.mdx`;
    const filepath = path.join(outputDir, filename);
    
    const fileContent = `---
title: "${post.title}"
date: "${post.date}"
summary: "${post.summary}"
tags: ${JSON.stringify(post.tags)}
category: "${post.category}"
readTime: ${post.readTime}
period: "${post.period}"
---

${post.content}
`;
    
    fs.writeFileSync(filepath, fileContent);
  }
  
  // Generate index file
  const indexContent = {
    posts: allPosts.map(post => ({
      title: post.title,
      date: post.date,
      slug: generateSlug(post.title, post.date),
      summary: post.summary,
      tags: post.tags,
      category: post.category,
      readTime: post.readTime,
      period: post.period,
    })),
    totalPosts: allPosts.length,
    generatedAt: new Date().toISOString(),
  };
  
  fs.writeFileSync(
    path.join(outputDir, 'index.json'),
    JSON.stringify(indexContent, null, 2)
  );
  
  console.log(`✅ Generated ${allPosts.length} blog posts in ${outputDir}`);
  console.log(`📊 Posts by year:`);
  
  // Stats by year
  const postsByYear: Record<number, number> = {};
  allPosts.forEach(post => {
    const year = new Date(post.date).getFullYear();
    postsByYear[year] = (postsByYear[year] || 0) + 1;
  });
  
  Object.entries(postsByYear)
    .sort(([a], [b]) => parseInt(a) - parseInt(b))
    .forEach(([year, count]) => {
      console.log(`   ${year}: ${count} posts`);
    });
}

// Run the generator
if (require.main === module) {
  generateAllBlogPosts().catch(console.error);
}

export { generateAllBlogPosts, generatePostIdeasForPeriod, generateBlogPost };