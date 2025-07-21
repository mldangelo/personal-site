import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="2010-06-25"
      title="Building a Spectrum Analyzer with FFT"
      summary="Creating a real-time audio spectrum analyzer using an ATmega328 and some clever math. Who says 8-bit can't do DSP?"
      content={`Ever since learning about Fourier transforms, I've wanted to build a real-time spectrum analyzer. Turns out you can do surprisingly good FFT on an 8-bit microcontroller with some optimization tricks.

## The Challenge

The ATmega328 has:
- 16 MHz clock
- 2KB RAM
- No hardware multiply

Not exactly DSP material, but constraints breed creativity!

## Implementation

### Fixed-Point Math
Floating point is too slow, so everything uses fixed-point arithmetic. I'm using Q15 format (1 sign bit, 15 fractional bits).

### Optimized FFT
Started with a radix-2 FFT, then optimized:
- Precomputed twiddle factors in PROGMEM
- Bit-reversal lookup table
- Assembly language for critical loops

### Display Output
32-band spectrum on an LED matrix. Each column shows one frequency bin, height indicates magnitude.

## Performance

With a 256-point FFT:
- Sampling rate: 9.6 kHz
- Frequency resolution: 37.5 Hz
- Update rate: 30 fps

Not bad for an Arduino!

## Code Optimization Journey

Started at 2 seconds per FFT. Current time: 33ms. Key optimizations:
1. Removed all divisions (shift instead)
2. Inline butterfly operations
3. Use symmetry properties
4. Careful register allocation

## Applications

Now I can finally see:
- Audio frequency content
- Mechanical vibrations (with accelerometer input)
- RF signals (with appropriate frontend)

Next step: logarithmic frequency scale for better music visualization.

The code is messy but it works. Sometimes that's good enough for a learning project!`}
      tags={["dsp","fft","microcontroller","optimization"]}
      readTime="13 min"
    />
  );
}

export function generateMetadata() {
  return {
    title: "Building a Spectrum Analyzer with FFT - Michael D'Angelo",
    description: "Creating a real-time audio spectrum analyzer using an ATmega328 and some clever math. Who says 8-bit can't do DSP?",
  };
}