import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="2010-10-15"
      title="DSP Project: Real-Time Audio Effects Processor"
      summary="Building a real-time audio effects processor for my DSP class. Reverb, echo, and distortion at 48kHz on a measly DSP chip."
      content={`For our DSP class project, I'm building a real-time audio effects processor. The challenge: implement multiple effects on a fixed-point DSP with limited memory.

## Hardware Platform

Using the TI TMS320C5515 DSP:
- 120 MHz clock
- 320KB RAM
- Fixed-point only
- Stereo audio codec included

Not exactly a powerhouse, but that's the point!

## Implemented Effects

### 1. Digital Reverb
Using Schroeder reverberators:
- 4 comb filters in parallel
- 2 allpass filters in series
- Tuned for "concert hall" sound

Memory usage is the killer - need several seconds of delay lines.

### 2. Echo/Delay
Circular buffer implementation:
- Variable delay (10ms - 1s)
- Feedback control
- Wet/dry mix

Simple but sounds great!

### 3. Dynamic Range Compression
- RMS envelope detection
- Soft-knee compression curve
- Make-up gain
- Attack/release timing

Useful for evening out volume levels.

### 4. Distortion/Overdrive
Multiple algorithms:
- Hard clipping
- Soft clipping (tanh approximation)
- Tube emulation (even harmonics)
- Bit crushing

My favorite - makes everything sound like a garage band!

## Implementation Challenges

### Fixed-Point Math
Everything needs careful scaling:
\`\`\`c
// Q15 multiplication with saturation
int16_t q15_mul(int16_t a, int16_t b) {
    int32_t result = ((int32_t)a * b) >> 15;
    if (result > 32767) return 32767;
    if (result < -32768) return -32768;
    return (int16_t)result;
}
\`\`\`

### Memory Management
With only 320KB RAM and 48kHz stereo:
- Max delay: ~3.3 seconds
- Had to share buffers between effects
- Lots of circular buffer tricks

### Real-Time Constraints
At 48kHz, have 20.8μs per sample. With 120MHz clock, that's 2500 cycles. Sounds like a lot until you try to compute a reverb!

## Optimization Techniques

1. **Lookup tables** - Pre-compute trig functions
2. **Block processing** - Process 256 samples at once
3. **Ping-pong buffers** - DMA runs while processing
4. **Assembly optimization** - Critical inner loops

## User Interface

Simple but functional:
- 16x2 LCD display
- Rotary encoder for navigation
- 4 pots for parameter control
- Bypass switch for A/B comparison

## Results

It works! Can process stereo 48kHz audio with <5ms latency. Effects sound reasonably good (for a student project).

Professor's feedback: "Nice work, but your reverb sounds like a bathroom." Fair point - need better delay line tuning.

## What I Learned

1. **Real-time is hard** - Every cycle counts
2. **Fixed-point forces creativity** - Can't just throw floats at problems
3. **Psychoacoustics matter** - Small parameter changes have big perceptual effects
4. **DSP theory != implementation** - Textbook algorithms need major optimization

Next step: port this to the FPGA for parallel processing. Should be able to run 10x more effects!`}
      tags={["dsp","audio","real-time","embedded"]}
      readTime="14 min"
    />
  );
}

export function generateMetadata() {
  return {
    title: "DSP Project: Real-Time Audio Effects Processor - Michael D'Angelo",
    description: "Building a real-time audio effects processor for my DSP class. Reverb, echo, and distortion at 48kHz on a measly DSP chip.",
  };
}