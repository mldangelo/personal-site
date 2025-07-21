import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="2010-11-15"
      title="Research Project: Acoustic Localization System"
      summary="First real research project - building an acoustic localization system for the hearing aid lab. Finding sound sources with millisecond precision."
      content={`Started my first real research project in the DSP lab. Goal: build a system that can locate sound sources in 3D space using microphone arrays. Applications include hearing aids and surveillance systems.

## The Problem

Humans locate sounds using:
- Time difference between ears (ITD)
- Volume difference (ILD)
- Spectral cues from ear shape

Can we replicate this with microphones and DSP?

## System Architecture

### Hardware
- 8 MEMS microphones in 3D array
- Simultaneous sampling at 48kHz
- FPGA for data acquisition
- DSP for processing

### Microphone Array Geometry
Tried several configurations:
- Linear (simple but 1D only)
- Planar (2D localization)
- Spherical (3D but complex math)

Settled on cubic array - good 3D coverage and simple coordinates.

## Signal Processing Pipeline

### 1. Time Delay Estimation
Using Generalized Cross-Correlation (GCC-PHAT):
\`\`\`python
def gcc_phat(sig1, sig2):
    # FFT of both signals
    X1 = fft(sig1)
    X2 = fft(sig2)
    
    # Cross-power spectral density
    R = X1 * conj(X2)
    
    # PHAT weighting
    R = R / abs(R)
    
    # Inverse FFT gives correlation
    cc = real(ifft(R))
    
    # Peak location = time delay
    return argmax(cc)
\`\`\`

### 2. Multilateration
With time delays from multiple mic pairs:
- Set up hyperbolic equations
- Solve system (least squares)
- Get 3D position

Math gets ugly fast!

### 3. Beamforming
Once we know direction, enhance signal:
- Delay-and-sum beamforming
- Adaptive filters for noise suppression
- Up to 20dB improvement!

## Challenges Encountered

### Multipath Reflections
Sound bounces off walls, creating ghost sources. Solutions:
- First-arrival detection
- Statistical clustering
- Adaptive threshold

### Synchronization
Microsecond timing errors = meters of position error. Fixed with:
- Common clock to all ADCs
- Cable length calibration
- Temperature compensation

### Real-Time Processing
48kHz × 8 channels = 384k samples/second. Optimization required:
- FFT on FPGA
- Parallel correlation
- Efficient matrix operations

## Results

Current performance:
- Angular accuracy: ±5 degrees
- Distance accuracy: ±10% (1-5 meters)
- Update rate: 50 Hz
- Latency: <20ms

## Cool Discoveries

1. **You can "see" with sound** - Display shows sound sources like radar
2. **Materials matter** - Different surfaces create distinct reflection patterns
3. **Frequency matters** - High frequencies localize better but attenuate faster

## Applications Tested

- **Speaker tracking** - Follow person speaking in room
- **Noise source identification** - Find that annoying buzz
- **Acoustic camera** - Visualize sound field

## Professor's Feedback

"Good progress, but need more rigorous testing. Set up controlled experiments with known positions."

He's right - my testing was pretty ad-hoc.

## Next Steps

1. Improve multipath handling
2. Add machine learning for source classification
3. Miniaturize for hearing aid integration
4. Write paper for conference submission

This research stuff is addictive. Solving problems nobody has solved before!`}
      tags={["research","dsp","acoustics","localization"]}
      readTime="16 min"
    />
  );
}

export function generateMetadata() {
  return {
    title: "Research Project: Acoustic Localization System - Michael D'Angelo",
    description: "First real research project - building an acoustic localization system for the hearing aid lab. Finding sound sources with millisecond precision.",
  };
}