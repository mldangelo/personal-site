import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="2010-08-10"
      title="The Great Capacitor Plague: A Repair Adventure"
      summary="Discovering the early 2000s capacitor plague firsthand while fixing old motherboards. Sometimes failure teaches more than success."
      content={`Bought a lot of "broken" electronics on eBay for parts. Turns out most had the same problem: bulging capacitors. Welcome to my introduction to the capacitor plague!

## The Discovery

Opening the first motherboard, I saw them immediately:
- Bulging tops
- Brown crusty leakage
- That distinctive "bad cap" smell

Research revealed this was a widespread problem from bad electrolyte formulas in the early 2000s.

## The Repair Process

### Equipment Needed
- Temperature-controlled iron
- Desoldering pump
- Good quality capacitors (Japanese brands!)
- Patience

### Technique Matters
Learned the hard way:
1. Don't pull - you'll rip traces
2. Add fresh solder before desoldering
3. Clean pads thoroughly
4. Check for corroded vias

## The Motherboard Graveyard

Fixed (or attempted to fix):
- 5 motherboards (3 successful)
- 2 graphics cards (both successful)
- 3 LCD monitors (2 successful)
- 1 DVD player (successful)

Total cost: $40 in capacitors
Value of working hardware: ~$300

## Interesting Failures

Not all were straightforward:
- One motherboard had corroded traces under the sockets
- A monitor had cascading failures from voltage spikes
- One graphics card worked... for exactly 10 minutes

## Chemistry Lesson

Researched why capacitors fail:
- Incomplete electrolyte formula
- Hydrogen gas generation
- Pressure buildup
- Seal failure
- Electrolyte leakage → corrosion

It's a perfect example of how a small chemistry error can cause billions in damage.

## Skills Gained

This project taught me:
- SMD desoldering techniques
- Trace repair with wire wrapping
- Reading capacitor codes
- Understanding failure modes
- The value of quality components

## The Economics

Interesting observation: People throw away repairable electronics. A $200 monitor becomes e-waste over $2 in capacitors. There's a business opportunity here...

Currently running my main desktop on a motherboard I fixed. Every boot feels like a small victory against planned obsolescence!`}
      tags={["repair","capacitors","hardware","troubleshooting"]}
      readTime="12 min"
    />
  );
}

export function generateMetadata() {
  return {
    title: "The Great Capacitor Plague: A Repair Adventure - Michael D'Angelo",
    description: "Discovering the early 2000s capacitor plague firsthand while fixing old motherboards. Sometimes failure teaches more than success.",
  };
}