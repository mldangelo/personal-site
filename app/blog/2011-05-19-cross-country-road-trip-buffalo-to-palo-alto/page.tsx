import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="2011-05-20"
      title="Cross-Country Road Trip: Buffalo to Palo Alto"
      summary="Driving 3,000 miles with everything I own. A road trip filled with electronics stores, national parks, and the excitement of starting fresh."
      content={`Just completed a 3,000-mile solo drive from Buffalo to Palo Alto. My 2003 Honda Civic packed with oscilloscopes, development boards, and dreams. Here's the journey to my new life in Silicon Valley.

## The Packing Tetris

Fitting my life into a Civic:
- Oscilloscope (passenger seat - safest spot)
- Box of dev boards (worth more than car)
- Soldering station (carefully wrapped)
- Monitors x2 (praying they survive)
- Clothes (whatever space left)
- Coffee maker (essential equipment)

Left behind: Furniture, but kept all electronics.

## Day 1: Buffalo to Chicago (540 miles)

### 6:00 AM - Departure
Parents wave goodbye. Mom cries. Dad slips $100 in my pocket "for emergencies."

### 10:00 AM - Cleveland
Rock and Roll Hall of Fame. Realize electronic music exhibits are just synthesizers I could build.

### 3:00 PM - Indiana
Flat. So flat. Podcast about quantum computing makes it bearable.

### 8:00 PM - Chicago
Deep dish pizza obligatory. Meet up with college friend. His startup stories fuel my excitement.

## Day 2: Chicago to Denver (1,000 miles)

### 5:00 AM - Early Start
Longest day ahead. Loaded with energy drinks and podcasts.

### Iowa
Corn. More corn. Wind turbines! Count them for entertainment. Wonder about their control systems.

### Nebraska
Stop at every rest area to check oscilloscope didn't shift. Paranoid about equipment.

### 10:00 PM - Denver
Altitude hits hard. Mountains visible. First time seeing them. Speechless.

## Day 3: Denver to Vegas (750 miles)

### Morning - Microcenter Denver
Couldn't resist. Bought ESP8266 modules (just released!). $5 WiFi modules!

### Utah
Absolutely stunning. Stop every 50 miles for photos. Consider how to build weather station for this terrain.

### Nevada
Desert is alien landscape. Car thermometer reads 117°F. Electronics definitely suffering.

### 8:00 PM - Vegas
Bright lights are just LEDs and control systems. Engineer brain can't turn off.

## Day 4: Vegas to Palo Alto (570 miles)

### 6:00 AM - Final Push
Last day. Excitement building.

### Death Valley
Brief detour. Hottest place on Earth. Phone overheats and shuts down. Good thermal design test.

### Noon - California Border
Take obligatory photo. California! Still doesn't feel real.

### 4:00 PM - Silicon Valley
Pass Facebook headquarters. Google campus. Apple. This is real. This is happening.

### 6:00 PM - Stanford
Drive down Palm Drive. Radio plays "California Love." Too perfect. Park at graduate housing.

I made it.

## Reflections from the Road

### Technology Thoughts
3,000 miles of thinking time:
- Every intersection could be smarter
- Road infrastructure needs IoT
- Autonomous vehicles will change everything
- Rest areas need better WiFi
- Electric charging stations sparse

### America is Huge
- Different climates = different engineering challenges
- Infrastructure varies wildly state to state
- Tech adoption differs by region
- Cellular coverage still spotty
- FM radio dominated by country music

### Solo Travel Insights
- Podcasts are lifesavers
- Audiobooks about tech history perfect
- Voice notes for project ideas
- Silence sometimes valuable
- Singing to nobody liberating

## Equipment Survival Report

Post-trip inspection:
- Oscilloscope: Perfect condition ✓
- Dev boards: All accounted for ✓
- Monitors: One dead pixel :(
- Soldering iron: Tip oxidized (desert air?)
- Laptop: Overheated once but recovered

## Budget Breakdown

- Gas: $340 (Civic FTW)
- Hotels: $200 (Motel 6 luxury)
- Food: $150 (lots of truck stop coffee)
- Microcenter: $80 (couldn't resist)
- Repairs: $0 (Honda reliability)
- Total: $770

## First Impressions of Silicon Valley

### The Good
- Perfect weather (72°F in May!)
- Tech everywhere
- Mountains and ocean nearby
- Diverse food options
- Innovation in the air

### The Shocking  
- Gas is $4.50/gallon!
- Apartment costs insane
- Traffic worse than expected
- Everything expensive
- Homeless situation

## Meeting the Roommates

Stanford grad student housing:
- Roommate 1: CS PhD working on databases
- Roommate 2: MechE designing prosthetics
- Roommate 3: Biology postdoc

First night conversation about interdisciplinary projects. I'm home.

## Setting Up the Lab

First priority: workspace
- Bedroom corner becomes lab
- ESD mat on desk
- Scope positioned perfectly
- Component organizers mounted
- Good lighting installed

Roommates concerned about fire hazard. Valid.

## Stanford First Steps

### Campus Tour
Self-guided wander:
- Engineering quad stunning
- Libraries numerous
- Bike required
- Everything spread out
- History palpable

### Meeting Advisor
Brief introduction:
"Welcome! Hope you're ready to work hard."
I am.

### Department Orientation
Next week. 40 new PhD students. Imposter syndrome setting in.

## Culture Shock

### From Buffalo
- No snow (weird)
- Shorts in "winter"
- Outdoor everything
- Health obsession
- Tech casual dress

### Food Differences
- Avocado on everything
- $15 sandwiches
- Boba tea shops everywhere
- Mexican food actually good
- Missing: Good pizza and wings

## The Plan

### Summer Before Start
- Settle in properly
- Learn bus system
- Find maker spaces
- Network locally
- Prepare for classes

### Research Goals
- Read advisor's papers
- Set up development environment
- Start literature review
- Identify research gaps
- Dream big

## Emotions

Mix of everything:
- Excitement (dominant)
- Terror (close second)
- Homesickness (already?)
- Determination (strongest)
- Gratitude (overwhelming)

## Letter to Past Self

"Hey 2007 Mike,
You just got to Buffalo, terrified of college. In 4 years, you'll drive across the country to Stanford for a PhD. You'll build satellites, publish papers, and create things you can't imagine yet. 

The all-nighters are worth it. The failed projects teach you most. That Arduino you just bought starts everything.

Trust the process.
-2011 Mike

P.S. Buy Bitcoin when it comes out."

## Next Steps

Tomorrow:
- DMV (California plates)
- Bank account
- Bike shopping
- Grocery run
- Start unpacking

This Week:
- Find good coffee
- Locate electronics stores
- Join maker space
- Exercise routine
- Explore campus

## Conclusion

3,000 miles driven. One chapter closed. Another beginning.

Buffalo gave me engineering foundations. Stanford will build the towers. Silicon Valley is the playground.

The kid who couldn't solve circuits is now in the world's tech capital, ready to invent the future.

California, let's do this! ☀️🚗💻`}
      tags={["road-trip","moving","stanford","personal"]}
      readTime="14 min"
    />
  );
}

export function generateMetadata() {
  return {
    title: "Cross-Country Road Trip: Buffalo to Palo Alto - Michael D'Angelo",
    description: "Driving 3,000 miles with everything I own. A road trip filled with electronics stores, national parks, and the excitement of starting fresh.",
  };
}