import BlogPost from '@/components/Blog/BlogPost';

export const metadata = {
  title: 'Year in Review: 2012 - The Platform Wars',
  description: 'Reflecting on 2012: Windows 8\'s identity crisis, mobile platform battles, and the rise of maker culture.',
  keywords: ['year-review', '2012', 'reflection', 'predictions'],
  openGraph: {
    title: 'Year in Review: 2012 - The Platform Wars',
    description: 'Reflecting on 2012: Windows 8\'s identity crisis, mobile platform battles, and the rise of maker culture.',
    type: 'article',
    publishedTime: '2012-12-20',
    authors: ['Michael D'Angelo'],
  },
};

const post = {
  date: '2012-12-20',
  title: 'Year in Review: 2012 - The Platform Wars',
  content: `As 2012 ends, looking back at a year of platform battles, failed maps, successful rockets, and the democratization of hardware.

## The Platform Wars Intensified

2012 was the year everyone picked sides:
- iOS vs Android reached fever pitch
- Windows 8 tried to be everything
- BlackBerry became irrelevant
- Web apps started winning

## Mobile Dominance

The post-PC era arrived:
- Tablets outsold laptops
- Mobile web traffic exploded
- Apps became businesses
- Desktop felt old suddenly

## The Year of Kickstarter

Crowdfunding changed everything:
- Pebble: $10M for a smartwatch
- Oculus Rift: VR is back
- Ouya: Android gaming console
- 3D printers everywhere

## Big Tech's Hits and Misses

**Hits:**
- Retina MacBook Pro
- Google Glass demo
- SpaceX Dragon
- Raspberry Pi

**Misses:**
- Apple Maps disaster
- Facebook IPO fumble
- Windows 8 confusion
- Google+ ghost town

## Personal Coding Stats

My 2012 development breakdown:
- JavaScript: 40% (Node.js explosion)
- Python: 25% (Research work)
- C++: 20% (Hardware projects)
- Java: 15% (Android apps)

## Open Source Contributions

Kept my resolution:
- 52 weeks, 54 contributions
- 12 projects helped
- 3 projects adopted my code
- 1 project made me maintainer

## Technical Skills Learned

New tools mastered:
- Node.js and real-time web
- WebGL for 3D graphics
- Hadoop for big data
- 3D printing and CAD
- Chrome extension development

## Side Projects Completed

Built and shipped:
1. Pomodoro Chrome extension (500+ users)
2. Gesture control system
3. Collaborative editor prototype
4. Weather monitoring station
5. 3D printed robot gripper

## Research Progress

PhD milestones:
- Passed qualifying exams
- Published first conference paper
- Built 50-node Hadoop cluster
- Started dissertation research

## Community Involvement

Stanford tech scene:
- Attended 20+ tech talks
- Mentored 5 undergrads
- Won hackathon award
- Started hardware meetup

## Blog Growth

Writing consistency paid off:
- 52 posts published
- 10,000+ unique visitors
- Top post: "Deep Learning Breakthrough"
- Engagement up 300%

## Predictions That Came True

From last year:
- ✓ Tablets would explode
- ✓ JavaScript everywhere
- ✓ Hardware renaissance
- ✓ Space commercialization

## Predictions That Didn't

Got these wrong:
- ✗ Google+ challenging Facebook
- ✗ Windows 8 tablet success
- ✗ NFC payments mainstream
- ✗ Desktop Linux year (again)

## Lessons Learned

Key takeaways from 2012:
1. **Simplicity wins**: Instagram's focused approach
2. **Platforms matter**: Ecosystems beat features
3. **Hardware is back**: Makers changing everything
4. **Mobile first**: Desktop is legacy
5. **Open wins**: Closed platforms struggling

## Looking Ahead to 2013

What I'm excited about:
- Wearable computing (Glass, watches)
- Bitcoin breaking out
- 3D printing going mainstream
- Web technologies maturing
- PhD research accelerating

## 2013 Predictions

My bets for next year:
1. Smartwatches will arrive (Pebble leads)
2. Bitcoin will hit $100
3. 3D printing in every school
4. JavaScript frameworks war
5. Google Glass changes everything

## Personal Goals for 2013

Setting the bar higher:
- Ship a real product
- Publish 2 research papers
- Contribute to major open source project
- Learn functional programming
- Build something that matters

2012 was about learning and exploring. 2013 will be about building and shipping. Bring it on!`,
  tags: ['year-review', '2012', 'reflection', 'predictions'],
  readTime: '15 min',
};

export default function YearinReview2012ThePlatformWarsPage() {
  return <BlogPost post={post} />;
}
