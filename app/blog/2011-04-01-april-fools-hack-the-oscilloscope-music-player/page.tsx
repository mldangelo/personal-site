import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="2011-04-02"
      title="April Fools Hack: The Oscilloscope Music Player"
      summary="Turned the lab oscilloscope into a music visualizer for April Fools. Professor was not amused. Students were delighted."
      content={`For April Fools, I decided to "fix" all the oscilloscopes in the EE lab. When turned on, instead of boring waveforms, they now play music with perfectly synchronized X-Y mode visualizations. The prank that became a viral hit!

## The Inspiration

Saw a video of oscilloscope music - audio that creates pictures when viewed on a scope in X-Y mode. Thought: "What if every scope in the lab did this automatically?"

## The Plan

Requirements:
1. Non-destructive (don't get expelled)
2. Easy to remove (see above)
3. Impressive effect
4. Educational value (my excuse)

## The Hardware

Built tiny devices that intercept probe connections:
- ATtiny85 microcontroller
- Dual DAC for X-Y output
- Probe passthrough
- Battery powered
- Magnetically attached

Total cost per unit: $8

## Creating Oscilloscope Music

The math behind X-Y patterns:

\`\`\`c
// Lissajous patterns
void generatePattern(uint16_t t) {
    float x = sin(2 * PI * freq_x * t / SAMPLE_RATE);
    float y = sin(2 * PI * freq_y * t / SAMPLE_RATE + phase);
    
    // Add some harmonics for complex shapes
    x += 0.3 * sin(6 * PI * freq_x * t / SAMPLE_RATE);
    y += 0.3 * sin(6 * PI * freq_y * t / SAMPLE_RATE);
    
    outputDAC(x, y);
}
\`\`\`

## The Audio Challenge

Making it musical AND visual:
1. Left channel = X deflection
2. Right channel = Y deflection  
3. Frequency ratios create patterns
4. Amplitude creates size
5. Phase creates rotation

Spent weeks crafting 30-second loops that looked amazing.

## The Deployment

### 11:30 PM - April 1st
Snuck into lab (had legitimate access, just weird timing).

### 11:45 PM
Installed devices on all 12 oscilloscopes. Magnetic attachment = quick installation.

### 12:15 AM
Tested each scope. Perfect synchronization!

### 12:30 AM
Left note: "Scopes upgraded with music mode. Press AUTO to activate. -Anonymous"

## April 2nd - The Reactions

### 8:00 AM - First Discovery
EE 201 student: "Uh, professor? The scope is playing music?"

### 8:15 AM - Crowd Forms
Word spreads. Lab fills with students.

### 8:30 AM - Professor Arrives
Initial anger turns to curiosity. "How does this work?"

### 9:00 AM - Teaching Moment
Professor uses it to explain Lissajous patterns!

### 10:00 AM - Social Media
Videos everywhere. #OscilloscopeMusic trending on campus.

## The Technical Breakdown

### Pattern Library
Created different visualizations:
1. **Spinning circles** - Classic Lissajous
2. **Bouncing ball** - Physics simulation
3. **3D cube** - Perspective projection
4. **Mushroom** - Complex harmonics
5. **UFO** - Phase modulation
6. **Heart** - Parametric equations
7. **Text** - "APRIL FOOLS" scrolling

### Audio Synchronization
Each pattern had matching music:
- Spinning circles = Ambient tones
- Bouncing ball = Percussive beats
- 3D cube = Techno
- Heart = Love song (cheesy but effective)

### Code Optimization
Fitting everything in ATtiny85's 8KB:
\`\`\`c
// Lookup tables save space
const int8_t sineTable[256] PROGMEM = { /* precalculated */ };

// Fixed-point math
int16_t sin_lookup(uint8_t angle) {
    return pgm_read_byte(&sineTable[angle]);
}

// Compact pattern generation
void pattern_heart(uint16_t t) {
    uint8_t angle = t >> 2;
    int16_t r = 128 - (sin_lookup(angle) >> 2);
    int16_t x = (r * sin_lookup(angle)) >> 7;
    int16_t y = (r * sin_lookup(angle + 64)) >> 7;  // cos
    outputXY(x + 128, y + 128);
}
\`\`\`

## The Reveal

### 2:00 PM - Coming Clean
Posted detailed build instructions online:
- Full schematic
- Source code
- Pattern creation guide
- Mathematical explanations

### 3:00 PM - Professor's Response
"Most elaborate April Fools prank in department history. A+ for creativity. Don't do it again."

## Unexpected Outcomes

### Educational Impact
- Students actually learned Lissajous patterns
- Several asked to keep the devices
- Professor incorporated into curriculum
- Inspired final projects

### Viral Spread
- Reddit front page
- Hackaday feature
- 100K YouTube views
- News coverage

### Copycats
Other universities replicated:
- MIT version with Tetris
- Caltech with Star Wars
- Georgia Tech with school fight song

## Lessons Learned

### Technical
1. **ATtiny85 surprisingly capable** - 8MHz plenty for audio
2. **Battery life critical** - Coin cell lasted 72 hours
3. **DAC quality matters** - 8-bit looked jaggy
4. **Timing is everything** - Phase lock to avoid drift

### Social
1. **Harmless pranks build community**
2. **Educational angle prevents trouble**
3. **Documentation deflects anger**
4. **Creativity gets recognized**

## The Aftermath

### Short Term
- Became known as "oscilloscope guy"
- Asked to demo at department open house
- Several job offers mentioning the prank
- Inspired others to creative pranks

### Long Term
- Added to portfolio for grad school
- Stanford interviewer loved the story
- Still get emails about it
- Professors reference it years later

## Version 2.0 Ideas

What I'd do differently:
1. Wireless synchronization between scopes
2. Interactive mode (knobs control pattern)
3. Network connectivity for updates
4. Spectrum analyzer mode
5. Actual oscilloscope functionality retained

## Open Source Impact

GitHub repository stats:
- 2,847 stars
- 423 forks
- 89 pull requests
- Translations to 12 languages
- Educational use in 50+ schools

## Best Comments

From Reddit:
- "This is why I'm studying EE"
- "Chaotic good engineering"
- "My professor would have failed me... then hired me"

From YouTube:
- "Instructions unclear, oscilloscope achieved sentience"
- "This is art"
- "But can it run Doom?"

## Conclusion

Best April Fools prank ever? Maybe not. Most educational? Possibly. Most fun to build? Definitely.

Sometimes the best pranks are the ones that teach something. And sometimes, you just want to see an oscilloscope draw a dancing mushroom.

To future pranksters: Keep it harmless, make it clever, document everything, and be prepared to explain the math.

Happy April Fools! 🎵📊`}
      tags={["april-fools","oscilloscope","prank","audio-visual"]}
      readTime="14 min"
    />
  );
}

export function generateMetadata() {
  return {
    title: "April Fools Hack: The Oscilloscope Music Player - Michael D'Angelo",
    description: "Turned the lab oscilloscope into a music visualizer for April Fools. Professor was not amused. Students were delighted.",
  };
}