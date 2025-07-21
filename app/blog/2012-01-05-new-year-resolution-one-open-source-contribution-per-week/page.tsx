import BlogPost from '@/components/Blog/BlogPost';

export const metadata = {
  title: 'New Year Resolution: One Open Source Contribution Per Week',
  description: 'Starting 2012 with a commitment to give back to the open source community. 52 weeks, 52 contributions.',
  keywords: ['open-source', 'resolution', 'community', 'github'],
  openGraph: {
    title: 'New Year Resolution: One Open Source Contribution Per Week',
    description: 'Starting 2012 with a commitment to give back to the open source community. 52 weeks, 52 contributions.',
    type: 'article',
    publishedTime: '2012-01-05',
    authors: ['Michael D'Angelo'],
  },
};

const post = {
  date: '2012-01-05',
  title: 'New Year Resolution: One Open Source Contribution Per Week',
  content: `New year, new commitment. After years of benefiting from open source, it's time to give back systematically.

## The Challenge

One meaningful open source contribution every week for 2012:
- Bug fixes
- Documentation improvements
- New features
- Code reviews
- Answer Stack Overflow questions

## Week 1: Fixed a Bug in Three.js

Started with the WebGL library I use most:

\`\`\`javascript
// Before: Memory leak in geometry disposal
geometry.dispose = function() {
  // Vertices were not being freed
}

// After: Proper cleanup
geometry.dispose = function() {
  this.vertices = null;
  this.faces = null;
  renderer.deallocateGeometry(this);
}
\`\`\`

Pull request merged!

## Why This Matters

Open source has given me:
- Free tools and libraries
- Learning opportunities
- Community support
- Career advancement

Time to pay it forward.

## Tracking Progress

Created a GitHub repo to track contributions:
- Weekly log
- Projects helped
- Skills learned
- Community interactions

## Early Observations

Contributing is addictive:
- Seeing your code in popular projects
- Getting thank you messages
- Learning from code reviews
- Building reputation

## The Ripple Effect

One fix can help thousands:
- My Three.js fix affects 10k+ developers
- Documentation improvements help beginners
- Bug reports save others debugging time

Let's see if I can keep this up for 52 weeks!`,
  tags: ['open-source', 'resolution', 'community', 'github'],
  readTime: '10 min',
};

export default function NewYearResolutionOneOpenSourceContributionPerWeekPage() {
  return <BlogPost post={post} />;
}
