import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="2011-03-05"
      title="Presenting at ICASSP: First Conference Experience"
      summary="Presenting my acoustic localization research at ICASSP in Prague. First international conference, first time in Europe, lots of firsts."
      content={`Just returned from presenting at ICASSP 2011 in Prague. My first academic conference, first international travel, first time feeling like a "real" researcher. What an experience!

## The Paper

"Robust Acoustic Source Localization Using Distributed Microphone Arrays"
- 3D localization using time delays
- Novel approach to multipath mitigation
- Real-time implementation on DSP

Eight pages that took six months to write.

## Preparation Terror

### The Presentation
Created approximately 47 versions of my slides:
- Version 1-10: Too much math
- Version 11-20: Too little math
- Version 21-30: Bad flow
- Version 31-40: Ugly figures
- Version 41-46: Overthinking
- Version 47: Just right (maybe?)

### Practice Runs
Presented to:
- Empty room (many times)
- Lab mates (harsh but helpful)
- Advisor (terrifying)
- Mirror (desperate)
- Parents via Skype (confused but supportive)

Timed at exactly 19 minutes, 47 seconds. Perfect.

## The Journey

### Buffalo → Prague
- First transatlantic flight
- Watched three movies about public speaking
- Didn't sleep at all
- Revised slides on napkins

### Arrival
Prague is stunning! But no time for tourism. Conference starts in 6 hours. Find hotel, shower, more practice.

## Conference Day One

### Registration
"First time at ICASSP?"
"How could you tell?"
"The terror in your eyes."

Got my badge. "Michael D'Angelo - University at Buffalo" Never felt more official.

### Poster Session Exploration
Hundreds of research posters. Everyone seems to know everything about everything. Imposter syndrome intensifying.

Notable papers:
- Compressed sensing (everywhere!)
- Deep learning for speech (the future?)
- Array processing advances
- My exact topic done better (panic!)

### Evening Reception
Free food! Networking attempt:
"Hi, I'm Mike, I work on acoustic localization."
"Oh, like Brandstein's 1997 paper?"
"... yes, exactly like that."
*furiously googles Brandstein later*

## Presentation Day

### 7:00 AM - Wake Up
Already awake. Never slept.

### 8:00 AM - Conference Breakfast
Can't eat. Stomach full of butterflies.

### 9:00 AM - Session Starts
My session: "Array Processing II"
I'm third. Watch first two presenters. They're so confident. How?

### 9:40 AM - My Turn
Walk to podium. Legs surprisingly functional.

"Good morning. Today I'll present our work on robust acoustic source localization..."

The next 20 minutes blur by:
- Slide 3: Forget everything
- Slide 5: Remember everything
- Slide 8: Question from audience (handled!)
- Slide 12: Live demo works!
- Slide 15: Running out of time
- Slide 18: Perfect landing

"... and that concludes my presentation. Thank you."

Applause! Questions!

### The Questions

**Question 1**: "How does your method compare to MUSIC algorithm?"
*I actually know this!*

**Question 2**: "What about non-stationary sources?"
*Good question, future work*

**Question 3**: "Have you considered the Cramér-Rao bound?"
*Pretend to understand, nod thoughtfully*

Survived!

## Post-Presentation

### Immediate Aftermath
- Adrenaline crash
- Find bathroom
- Call parents
- Sleep for 3 hours

### Evening Session
Can finally enjoy other presentations:
- Speech recognition advances
- Musical instrument separation
- Beamforming innovations
- So much to learn!

## Networking Adventures

### Coffee Breaks
Learned the conference coffee break dance:
1. Approach interesting person
2. Read name tag discreetly
3. "Hi, I really enjoyed your paper on..."
4. Exchange business cards
5. Promise to read each other's work
6. Repeat

Collected 47 business cards.

### Conference Dinner
Seated with:
- Professor from Tokyo Tech
- PhD student from ETH Zurich
- Researcher from Samsung
- Me, trying not to say anything stupid

Conversation topics:
- Research (safe)
- Funding nightmares (universal)
- Favorite algorithms (nerdy)
- Beer quality (important)

## Tourist Finale

Last day, finally explored Prague:
- Charles Bridge at sunrise
- Prague Castle
- Old Town Square
- Astronomical Clock

Posted one tourist photo. Caption: "Presenting at conferences has perks."

## Lessons Learned

### Technical
1. My research holds up internationally
2. So much happening in signal processing
3. Deep learning is coming for everything
4. Need to read more papers (always)

### Professional
1. Conferences are about connections
2. Everyone's nervous presenting
3. Business cards still matter
4. Free conference t-shirts are terrible

### Personal
1. I can do this
2. Travel is exhausting but worth it
3. Czech beer is dangerous
4. Always pack presentation clothes in carry-on

## Impact

Post-conference:
- 6 researchers contacted me
- 2 collaboration offers
- 15 paper downloads
- 1 citation already!
- Advisor impressed
- Confidence boosted 1000%

## The Best Part

Random email two weeks later:
"Hi Michael, I saw your ICASSP presentation. I'm working on something similar. Want to collaborate?"

From a professor at EPFL. We're now writing a journal paper together.

## Would Do Again?

Absolutely. Already looking at next year's conference in Kyoto.

Budget required:
- Registration: $500
- Flight: $1,200
- Hotel: $600
- Food: $200
- Worth it: Priceless

Time to start writing the next paper!`}
      tags={["conference","research","travel","acoustic-localization"]}
      readTime="13 min"
    />
  );
}

export function generateMetadata() {
  return {
    title: "Presenting at ICASSP: First Conference Experience - Michael D'Angelo",
    description: "Presenting my acoustic localization research at ICASSP in Prague. First international conference, first time in Europe, lots of firsts.",
  };
}