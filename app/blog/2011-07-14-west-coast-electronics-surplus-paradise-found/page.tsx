import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="2011-07-15"
      title="West Coast Electronics Surplus: Paradise Found"
      summary="Discovered Silicon Valley's electronic surplus stores. Halted Electronics, Weird Stuff Warehouse, and others. It's like Disneyland for hardware hackers."
      content={`Coming from Buffalo where RadioShack was our only option, discovering Silicon Valley's electronic surplus stores blew my mind. Warehouses full of components, test equipment, and weird tech from defunct startups. I may have a problem.

## The Pilgrimage Begins

Lab mate mentioned Halted Electronics (HSC).
"It's dangerous. Bring cash. Leave credit cards."
"How dangerous?"
"I went for resistors. Spent $300."

Challenge accepted.

## Halted Electronics (Santa Clara)

### First Impressions
Walking in: Sensory overload.
- Bins of components everywhere
- That distinctive electronics smell
- Oscilloscopes stacked high
- Engineers wandering in daze

### The Treasures Found
My first haul:
- HP 1740A oscilloscope ($50!)
- 500 servo motors ($0.50 each)
- Box of 7400 series logic
- Nixie tubes (!!!)
- Mystery box labeled "RF stuff"

Total damage: $147
Total value: Priceless

### The Experience
Overheard conversations:
"Is this from the Apollo program?"
"I haven't seen these since the 70s!"
"My startup used these..."
"One man's trash..."

## Weird Stuff Warehouse (Sunnyvale)

### The Mecca
If Halted is church, Weird Stuff is the Vatican.
- 30,000 square feet
- Silicon Valley history museum
- Dot-com boom remnants
- "As-is" section (dangerous)

### Notable Finds
- Sun SparcStation ($20)
- SGI Indigo ($40)
- Cray CPU module (display piece)
- 1000 Ethernet cables ($10)
- Vintage HP calculators

### The Stories
Each item has history:
- "From Netscape's office"
- "Google's first servers"
- "Failed startup #4,827"

Silicon Valley archaeology.

## Anchor Electronics (Santa Clara)

### The Organized One
Unlike others, actually organized:
- Components in labeled drawers
- Prices clearly marked
- Staff knows location of everything
- Still has through-hole parts!

### Best For
- When you need specific part
- Quality components
- Helpful staff
- Not cheapest but reliable

## Action Electronics (Santa Clara)

### The Hidden Gem
Smaller but curated:
- High-end test equipment
- Military surplus
- Rare semiconductors
- Reasonable prices

Scored Tektronix 2465B scope for $200!

## The Surplus Culture

### Types of Shoppers

**The Regular**
Knows every employee.
"Steve, got any 2N3904s today?"
First name basis.

**The Tourist** (Me)
Wide-eyed wonder.
Buying everything.
Taking photos.

**The Specific Seeker**
"I need a left-handed framistan."
Actually finds it.

**The Recycler**
Selling old equipment.
Circle of life.

## Survival Strategies

### Set a Budget
- Bring cash only
- Leave when depleted
- ATM is the enemy

### Make Lists
- What you need
- What you want
- What you'll impulse buy anyway

### Time Management
- Allocate 3 hours minimum
- You will lose track
- Set phone alarms

## Epic Finds

### The Motherload
One Saturday, found:
- HP 8566B spectrum analyzer ($300)
- Working electron microscope ($500)
- Box of 1000 LEDs ($5)
- Vintage Altair 8800 (priceless)

Rented truck to haul home.

## The Dark Side

### Storage Crisis
Apartment becoming warehouse:
- "I'll use this someday"
- Boxes stacked to ceiling
- Roommate concerned
- Intervention threatened

### Project Queue
- 47 project ideas
- 3 actually started
- 0 completed
- ∞ more planned

## Community Aspect

### Knowledge Exchange
Random conversations invaluable:
"What's this do?"
"Oh, that's from missile guidance system."
"Want to grab coffee and discuss?"

New friendship formed.

### The Regulars
Characters you meet:
- Retired HP engineer (fountain of knowledge)
- Artist using electronics
- Startup founders scrapping
- Students like me (poor but enthusiastic)

## Online Extension

When stores closed:
- eBay (dangerous at 2 AM)
- Craigslist (adventure time)
- University surplus auctions
- Government auctions

Addiction has many forms.

## Impact on Projects

Surplus shopping enables:
- Projects impossible otherwise
- Experimentation freedom
- Learning through exploration
- "What if I..." moments

## The Economics

Rough calculations:
- Spent: $2,000 (year one)
- Retail value: $20,000+
- Projects enabled: Countless
- Education value: Immeasurable
- Storage unit: Now required

## Tips for Newbies

1. **Start small** - One store per trip
2. **Research prices** - Know good deals
3. **Test equipment** - Bring multimeter
4. **Ask questions** - People love sharing
5. **Check return policy** - Usually none

## Cultural Significance

These stores are:
- Silicon Valley museums
- Startup graveyards
- Engineer social clubs
- Inspiration sources
- Addiction enablers

## The Philosophy

Surplus shopping embodies:
- Recycling/sustainability
- Knowledge preservation
- Community building
- Affordable innovation
- Hacker culture

## Future Concerns

Worried trends:
- Stores closing (high rent)
- Moving online only
- Less interesting stock
- Corporate recyclers winning
- Culture dying

Must preserve these treasures!

## The Perfect Saturday

My routine:
1. Coffee and list-making
2. Halted Electronics (components)
3. Weird Stuff (exploration)
4. Lunch with findings
5. Anchor (specific needs)
6. Home to sort treasures
7. Dream of projects

## Final Thoughts

Silicon Valley surplus stores aren't just shops - they're churches of the hardware hacking religion. Where else can you buy parts from the Space Shuttle, chat with the engineer who designed them, and walk out with inspiration for ten new projects?

My name is Mike, and I'm a surplus addict.

The first step is admitting you have a problem.
The second step is driving to Halted.

See you in the aisles! 🛒🔧✨`}
      tags={["surplus","silicon-valley","shopping","hardware"]}
      readTime="13 min"
    />
  );
}

export function generateMetadata() {
  return {
    title: "West Coast Electronics Surplus: Paradise Found - Michael D'Angelo",
    description: "Discovered Silicon Valley's electronic surplus stores. Halted Electronics, Weird Stuff Warehouse, and others. It's like Disneyland for hardware hackers.",
  };
}