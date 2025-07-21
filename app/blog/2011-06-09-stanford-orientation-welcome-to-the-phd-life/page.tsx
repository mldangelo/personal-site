import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="2011-06-10"
      title="Stanford Orientation: Welcome to the PhD Life"
      summary="First week as a Stanford PhD student. Imposter syndrome, world-class facilities, and finding my place in Silicon Valley academia."
      content={`Orientation week at Stanford just ended. After driving 3,000 miles and settling into Escondido Village, I'm officially a Stanford PhD student. The reality is both exciting and terrifying.

## The First Day

### 8:00 AM - Registration
Gates Building. So this is where computer science happens. Check in, get ID, try not to look lost.

Stanford ID in hand. "Michael D'Angelo - Electrical Engineering PhD Student." Still surreal.

### 9:00 AM - Welcome Address
"You're here because you're exceptional."
*Looks around at other students*
Everyone built something incredible. One guy designed chips at Intel. Another published 5 papers. What am I doing here?

### Department Overview
- 200 faculty members
- 40 new PhD admits
- Average time to degree: 5.5 years
- Funding guaranteed (phew!)

## Meeting the Cohort

My fellow first-years:
- MIT undergrad working on quantum computing
- Berkeley student with 3 patents
- International student who built his country's first satellite
- Former SpaceX engineer
- Me: Made LEDs blink really well

Imposter syndrome: ACTIVATED.

## Lab Tours

### Stanford Nanofabrication Facility
Clean room larger than my hometown. Equipment worth more than I'll make in a lifetime.
- E-beam lithography
- Molecular beam epitaxy
- Deep reactive ion etching
Tour guide casually mentions making 7nm features. My jaw drops.

### Embedded Systems Lab
My future home! 
- FPGA farm for acceleration research
- Every oscilloscope imaginable
- 3D printers, laser cutters, CNC
- Unlimited components budget
"Order whatever you need," says lab manager. Christmas morning feeling.

### AI Lab
Everyone's talking about "deep learning." Seems like neural networks are getting deeper. Interesting for embedded acceleration?

## Meeting My Advisor

Dr. Chen specializes in ultra-low power embedded systems. First meeting:

"Tell me about your interests."
*Rambles about CubeSat, SDR, IoT projects*

"Good. Here's what we're working on:"
- Energy harvesting sensors
- Sub-threshold computing
- Approximate computing
- Neural network accelerators

"Pick a direction by end of quarter."
No pressure.

## Silicon Valley Culture Shock

### The Good
- Everyone's building something
- "Failure" means learning
- Resources everywhere
- Weather still perfect
- Innovation is expected

### The Different
- Everything is "disruptive"
- Networking > everything
- Startups in garages (literally)
- Wealth disparity visible
- Competition intense

## First Research Group Meeting

15 people around table:
- 3 postdocs
- 8 senior PhD students
- 4 first-years (including me)

Senior student presents tape-out results. 65nm chip. 100x power improvement. Published in top conference.

Note to self: Learn faster.

## Classes Registration

First quarter load:
- **EE 271**: VLSI Systems Design
- **CS 229**: Machine Learning (everyone says take this)
- **EE 384X**: Packet Switch Architectures

RIP free time.

## Housing Situation

Escondido Village grad housing:
- Studio apartment
- $1,200/month (subsidized!)
- Shared kitchen per floor
- International community
- Bike required

Setup my workspace immediately. Oscilloscope on desk. Priorities.

## Stanford Quirks Discovered

- Everyone bikes. EVERYONE.
- Fountain hopping is real
- "Stanford time" = 10 minutes late
- Palm trees have WiFi (not really, but almost)
- Entrepreneurship is contagious

## The Valley Ecosystem

Already getting recruited:
- Google info session (free food!)
- Facebook "PhD coffee chat"
- Apple mysterious invitation
- Multiple startup founders emailing

"Focus on research," advisor warns. Trying.

## Financial Reality

PhD stipend: $38,000/year
Looks good until:
- Rent: $14,400
- Food: $6,000 (Bay Area prices)
- Transport: $1,200
- Remaining: Ramen budget

Time to perfect the free food event circuit.

## Research Exploration

Spent week reading papers:
- Energy harvesting hitting theoretical limits
- Approximate computing promising
- ML acceleration everyone's doing
- Sub-threshold circuits fascinating

Beginning to see potential directions.

## First California Earthquake

3.2 magnitude at 2 AM.
Thought someone was shaking my bed.
Californians: "That's nothing."
Me: Reconsidering life choices.

## Weekend Adventures

Explored Bay Area:
- San Francisco (so many hills)
- Ocean Beach (cold!)
- Muir Woods (breathtaking)
- Berkeley (rival campus visit)
- Silicon Valley companies (pilgrimages)

## The Pressure

Everyone asks: "What's your research?"
Current answer: "Exploring options."
Real answer: "Trying not to drown."

Competition is collegial but real. Everyone's brilliant. Everyone's working hard. Need to find my niche.

## Making Friends

Bond over shared struggles:
- Quals preparation already starting
- Free food location mapping
- Complaining about rent
- Debugging at 3 AM
- Imposter syndrome support group

## One Week Reflection

Thoughts after first week:
1. I belong here (maybe)
2. So much to learn
3. Resources are incredible
4. Pressure is intense
5. Opportunity is unlimited

## Email from Home

Mom: "How's California?"
Me: "Good! Learning lots."
Mom: "Eating enough?"
Me: "Yes." (Lies)
Mom: "Made friends?"
Me: "Yes!" (Truth)

She doesn't need to know about the stress.

## Goals for First Quarter

1. Survive classes
2. Read 50 papers
3. Choose research direction
4. Make advisor proud
5. Don't burn out

The marathon begins.

## Late Night Thoughts

Sitting in lab at midnight. Campus quiet. City lights twinkling below. Oscilloscope humming beside me.

Four years ago: Struggling with basic circuits in Buffalo.
Now: At Stanford, surrounded by brilliance, building the future.

The imposter syndrome is real. But so is the excitement. Time to prove I belong here.

Stanford, let's see what you've got. 🌲📚💻`}
      tags={["stanford","phd","orientation","silicon-valley"]}
      readTime="13 min"
    />
  );
}

export function generateMetadata() {
  return {
    title: "Stanford Orientation: Welcome to the PhD Life - Michael D'Angelo",
    description: "First week as a Stanford PhD student. Imposter syndrome, world-class facilities, and finding my place in Silicon Valley academia.",
  };
}