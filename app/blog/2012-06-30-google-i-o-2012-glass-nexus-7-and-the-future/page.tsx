import BlogPost from '@/components/Blog/BlogPost';

export const metadata = {
  title: 'Google I/O 2012: Glass, Nexus 7, and the Future',
  description: 'Just watched skydivers livestream from Google Glass while jumping onto the I/O venue. The future is here, and it\'s wearing computers.',
  keywords: ['google-io', 'glass', 'android', 'nexus'],
  openGraph: {
    title: 'Google I/O 2012: Glass, Nexus 7, and the Future',
    description: 'Just watched skydivers livestream from Google Glass while jumping onto the I/O venue. The future is here, and it\'s wearing computers.',
    type: 'article',
    publishedTime: '2012-06-30',
    authors: ['Michael D'Angelo'],
  },
};

const post = {
  date: '2012-06-30',
  title: 'Google I/O 2012: Glass, Nexus 7, and the Future',
  content: `Google I/O 2012 just concluded, and my mind is blown. Between Google Glass, the Nexus 7 tablet, and Android Jelly Bean, Google is firing on all cylinders.

## The Glass Demo

The keynote opening was insane:
- Skydivers wearing Glass jumped from a blimp
- Live streamed their descent via Hangout
- Landed on the Moscone Center roof
- Biked into the building
- Delivered Glass to Sergey on stage

This is how you do a product demo!

## Google Glass Details

What we learned:
- $1500 for Explorer Edition
- Ships early 2013
- Built-in camera and display
- Voice commands ("OK Glass")
- Bone conduction audio

## My Application for Glass

Applied immediately for Explorer program:

"As a computer vision researcher at Stanford, I want to explore:
- Real-time object recognition
- Augmented reality interfaces
- Hands-free data collection
- Accessibility applications
- Future of human-computer interaction"

Fingers crossed!

## Nexus 7: The iPad Competitor

Google's first tablet is impressive:
- 7" display perfect for reading
- $199 price point
- Tegra 3 quad-core
- Pure Android experience
- Google Play content ecosystem

Ordered one immediately.

## Android 4.1 Jelly Bean

Project Butter makes Android smooth:
- 60 FPS everywhere
- Triple buffering
- Touch responsiveness improved
- Google Now is incredible

## Google Now: The Future Assistant

This is bigger than Siri:

\`\`\`
"Show me flights to Seattle"
- Knows I have a trip booked
- Shows boarding pass
- Traffic to airport
- Weather at destination
\`\`\`

It's predictive, not just reactive!

## Chrome Comes to iOS

Finally! Mobile Safari has competition:
- Tab sync with desktop
- Incognito mode
- Much faster JavaScript
- Google account integration

Downloaded immediately.

## The Nexus Q Confusion

The social streaming device:
- $299 for... a sphere?
- Requires Android phone
- Only plays Google content
- Made in USA
- Beautiful but limited

This one's puzzling.

## Developer Goodies

New APIs announced:
- Rich notifications
- Bluetooth Low Energy
- Media codecs
- Renderscript Compute

Time to update my apps!

## Personal Impact

As a PhD student, this changes my research:
- Glass for AR experiments
- Nexus 7 for mobile testing
- Android as research platform
- Google's vision aligning with my work

Google is building the future I want to help create!`,
  tags: ['google-io', 'glass', 'android', 'nexus'],
  readTime: '14 min',
};

export default function GoogleIO2012GlassNexus7andtheFuturePage() {
  return <BlogPost post={post} />;
}
