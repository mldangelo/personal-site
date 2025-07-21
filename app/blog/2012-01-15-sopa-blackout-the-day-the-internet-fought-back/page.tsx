import BlogPost from '@/components/Blog/BlogPost';

export const metadata = {
  title: 'SOPA Blackout: The Day the Internet Fought Back',
  description: 'Wikipedia, Reddit, and thousands of sites went dark to protest SOPA/PIPA. Participating in digital activism from Stanford.',
  keywords: ['sopa', 'activism', 'internet-freedom', 'blackout'],
  openGraph: {
    title: 'SOPA Blackout: The Day the Internet Fought Back',
    description: 'Wikipedia, Reddit, and thousands of sites went dark to protest SOPA/PIPA. Participating in digital activism from Stanford.',
    type: 'article',
    publishedTime: '2012-01-15',
    authors: ['Michael D'Angelo'],
  },
};

const post = {
  date: '2012-01-15',
  title: 'SOPA Blackout: The Day the Internet Fought Back',
  content: `Today, the internet went dark. Major sites are protesting SOPA (Stop Online Piracy Act) and PIPA (PROTECT IP Act), and I'm joining the fight.

## What's at Stake

These bills threaten the open internet:
- DNS blocking requirements
- Site takedowns without due process
- Criminalizing linking
- Stifling innovation

## The Blackout

Major participants:
- **Wikipedia**: Completely dark for 24 hours
- **Reddit**: Full blackout
- **Google**: Censored logo
- **Mozilla**: Redirecting to action page
- **Craigslist**: Redirected to petition

## Our Campus Response

Stanford students mobilizing:
- Blackout our project sites
- Contact representatives
- Educate about DNS/technical issues
- Alternative proposals

## Technical Problems with SOPA

As an engineer, these aspects terrify me:

\`\`\`python
# SOPA's DNS blocking approach
def block_site(domain):
    # Breaks DNSSEC
    # Encourages workarounds
    # Fragments the internet
    # Doesn't actually stop piracy
\`\`\`

## My Contribution

Blacked out my personal projects:
- Added JavaScript overlay
- Redirect to EFF information
- Contact congress tool
- Technical explanation

\`\`\`javascript
// Simple SOPA blackout code
if (new Date() < new Date('2012-01-19')) {
  document.body.innerHTML = '<div class="blackout">' +
    '<h1>This site is blacked out to protest SOPA/PIPA</h1>' +
    '<p>These bills would destroy the free and open internet.</p>' +
    '<a href="https://eff.org/fights/sopa">Learn more</a>' +
  '</div>';
}
\`\`\`

## The Power of Collective Action

Watching real-time impact:
- Congress phones ringing off hook
- Senators withdrawing support
- Media coverage everywhere
- Public learning about DNS

## Lessons in Digital Activism

Technology + activism = powerful force:
- Code as protest
- Networks amplify voices
- Technical expertise matters
- Users have power

The internet is fighting for its life, and we're winning.`,
  tags: ['sopa', 'activism', 'internet-freedom', 'blackout'],
  readTime: '14 min',
};

export default function SOPABlackoutTheDaytheInternetFoughtBackPage() {
  return <BlogPost post={post} />;
}
