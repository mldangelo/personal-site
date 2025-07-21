import BlogPost from '@/components/Blog/BlogPost';

export const metadata = {
  title: 'London Olympics Opening Ceremony: A Celebration of the Web',
  description: 'Watching Tim Berners-Lee tweet "This is for everyone" during the Olympics opening ceremony. The web\'s inventor gets his moment.',
  keywords: ['olympics', 'tim-berners-lee', 'web', 'london-2012'],
  openGraph: {
    title: 'London Olympics Opening Ceremony: A Celebration of the Web',
    description: 'Watching Tim Berners-Lee tweet "This is for everyone" during the Olympics opening ceremony. The web\'s inventor gets his moment.',
    type: 'article',
    publishedTime: '2012-07-25',
    authors: ['Michael D'Angelo'],
  },
};

const post = {
  date: '2012-07-25',
  title: 'London Olympics Opening Ceremony: A Celebration of the Web',
  content: `Just watched the London Olympics opening ceremony, and Tim Berners-Lee stole the show. The inventor of the World Wide Web appeared in the stadium, tweeting live!

## The Moment

During the ceremony:
- House rises in the center
- Tim Berners-Lee at a NeXT computer
- Types and tweets: "This is for everyone"
- Message appears on LED pixels around stadium
- 80,000 people cheering for the web!

## Why This Matters

The web is finally recognized as humanity's achievement:
- Not a company's product
- Not a government's tool
- But everyone's platform
- British invention, global impact

## The Tweet Heard Round the World

@timberners_lee: "This is for everyone #london2012 #oneweb #openingceremony"

Within minutes:
- 10,000+ retweets
- Trending worldwide
- Developers celebrating
- Open web advocates emotional

## My Reaction

As someone building for the web:
- Pride in our platform
- Reminder of web's values
- Inspiration to keep it open
- Gratitude for TBL's vision

## The Technical Marvel

The ceremony's tech was incredible:
- 70,500 LED pixels on audience seats
- Everyone became part of display
- Synchronized via wireless
- Largest LED screen ever

## The Message

"This is for everyone" embodies:
- Web accessibility
- Net neutrality
- Open standards
- Global connectivity
- Digital equality

## Personal Reflection

Watching from Stanford:
- Where so much web innovation happens
- Surrounded by future web builders
- Reminded why we do this
- The web connects us all

## The Irony

NBC's terrible coverage:
- Tape delayed in US
- Cut away from TBL moment
- Couldn't stream without cable
- Twitter had better coverage!

## Building on the Foundation

Inspired to contribute:
- Keep building open tools
- Fight for web standards
- Teach web literacy
- Preserve web's openness

This ceremony reminded the world that the greatest human invention of our time was given freely to all. Thank you, Sir Tim!`,
  tags: ['olympics', 'tim-berners-lee', 'web', 'london-2012'],
  readTime: '12 min',
};

export default function LondonOlympicsOpeningCeremonyACelebrationoftheWebPage() {
  return <BlogPost post={post} />;
}
