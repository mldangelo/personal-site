import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="2010-07-20"
      title="RF Black Magic: Building My First Radio"
      summary="Attempting to build an FM transmitter and discovering why RF engineering is considered dark arts. So many ways for signals to escape!"
      content={`After avoiding RF projects for two years, I finally decided to build an FM transmitter. How hard could it be? Turns out, RF really is black magic.

## The "Simple" Design

Started with a basic design:
- Colpitts oscillator (88-108 MHz)
- Varactor diode for FM modulation
- Buffer amplifier
- Output filter

Should have worked first try, right?

## Reality Check

### Attempt 1: The Frequency Drifter
Built the circuit on breadboard (mistake #1). It transmitted... somewhere between 80-120 MHz depending on:
- Temperature
- Nearby objects
- Phase of the moon
- Whether I was looking at it

### Attempt 2: Manhattan Style
Rebuilt on copper clad using "Manhattan style" construction. Better, but still drifted 5 MHz when I walked past.

### Attempt 3: Proper PCB
Designed a PCB with:
- Ground plane
- Shielded oscillator section
- SMA connectors
- Proper impedance matching

Finally stable! Frequency drift < 100 kHz.

## Lessons in RF Weirdness

1. **Everything is an antenna** - That "short" wire? It's a quarter wavelength at 100 MHz
2. **Parasitic capacitance matters** - Even 1 pF shifts frequency by MHz
3. **Ground isn't ground** - At RF, "ground" has impedance
4. **Shielding is essential** - My oscillator was picking up cell phone signals

## Debugging Tools

Borrowed some proper RF equipment:
- Spectrum analyzer (game changer!)
- Return loss bridge
- Frequency counter
- Near field probes

Seeing the actual spectrum revealed spurious emissions everywhere. No wonder it sounded terrible!

## Legal Note

Kept power under 100mW and added a low-pass filter to kill harmonics. Still probably violated several FCC regulations. For educational purposes only!

## Success... Sort Of

Final transmitter specs:
- Frequency stability: ±50 kHz
- Range: 100 feet
- Audio quality: "Recognizable"
- Spurious emissions: "Probably illegal"

Not exactly broadcast quality, but I can transmit music from my iPod to a radio across the room. That's pretty cool for a first attempt.

Next project: crystal-controlled transmitter. Stability through brute force!`}
      tags={["rf","radio","fm-transmitter","analog"]}
      readTime="11 min"
    />
  );
}

export function generateMetadata() {
  return {
    title: "RF Black Magic: Building My First Radio - Michael D'Angelo",
    description: "Attempting to build an FM transmitter and discovering why RF engineering is considered dark arts. So many ways for signals to escape!",
  };
}