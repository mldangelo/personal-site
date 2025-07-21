import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="2010-08-30"
      title="Building a Photoplethysmography Heart Rate Monitor"
      summary="Creating a pulse oximeter from scratch using LEDs and photodiodes. Seeing your heartbeat in real-time is surprisingly emotional."
      content={`After learning about photoplethysmography (PPG) in bioinstrumentation class, I had to build my own heart rate monitor. The fact that you can see blood flow with light is amazing!

## The Science

PPG works on a simple principle:
- Blood absorbs light
- More blood = more absorption
- Heart pumps blood in pulses
- Measure light changes = see heartbeat

## Hardware Design

### Sensor Construction
Built a finger clip sensor:
- Red LED (660nm) - good for AC signal
- IR LED (940nm) - good for SpO2 (oxygen saturation)
- Photodiode with transimpedance amplifier
- 3D printed finger clip housing

### Analog Frontend
This was the tricky part:

1. **Transimpedance Amplifier**
   - Converts photodiode current to voltage
   - Used OPA2333 for low noise
   - Gain: 1MΩ (1µA = 1V)

2. **High-Pass Filter**
   - Remove DC component (ambient light)
   - Cutoff: 0.5 Hz
   - Let's through heartbeat frequencies

3. **Amplification Stage**
   - Gain of 100
   - Brings signal to ADC-friendly levels

4. **Low-Pass Filter**
   - Remove high-frequency noise
   - Cutoff: 5 Hz
   - Heartbeat is 1-3 Hz typically

### Microcontroller Processing
Using STM32F103:
- 12-bit ADC sampling at 100 Hz
- Digital filtering in firmware
- Peak detection algorithm
- OLED display output

## Signal Processing

### Raw Signal Challenges
The raw PPG signal is messy:
- Motion artifacts
- Ambient light changes
- 60 Hz power line noise
- Breathing artifacts

### Digital Filtering
Implemented in fixed-point:
\`\`\`c
// Simple moving average for smoothing
int16_t moving_average(int16_t new_sample) {
    static int16_t buffer[8];
    static uint8_t index = 0;
    static int32_t sum = 0;
    
    sum -= buffer[index];
    buffer[index] = new_sample;
    sum += new_sample;
    index = (index + 1) & 7;
    
    return sum >> 3;  // Divide by 8
}
\`\`\`

### Peak Detection
Finding heartbeats in the signal:
\`\`\`c
typedef enum {
    SEEKING_PEAK,
    SEEKING_VALLEY
} peak_state_t;

// Simplified peak detection
if (state == SEEKING_PEAK && signal > threshold) {
    if (signal < last_signal) {
        // Found peak!
        peak_time = current_time;
        heart_rate = 60000 / (peak_time - last_peak_time);
        state = SEEKING_VALLEY;
    }
}
\`\`\`

## Interesting Discoveries

### 1. You Can See More Than Heartbeat
The PPG signal contains:
- Heart rate (obviously)
- Heart rate variability
- Breathing rate (subtle modulation)
- Vascular compliance

### 2. Skin Color Matters
Different wavelengths work better for different skin tones:
- Red light: Better for lighter skin
- IR light: Better for darker skin
- Green light: Works for everyone (like Apple Watch)

### 3. Motion Is The Enemy
Tiny movements create huge artifacts:
- Finger movement changes optical path
- Pressure changes affect blood flow
- Cable movement induces noise

## Adding SpO2 Measurement

With red and IR LEDs, can calculate oxygen saturation:
\`\`\`
R = (AC_red / DC_red) / (AC_ir / DC_ir)
SpO2 = 110 - 25 * R
\`\`\`

Very simplified, but gives reasonable results!

## Display and User Interface

Created a simple OLED display showing:
- Heart rate: Large numbers
- Waveform: Scrolling PPG trace
- SpO2: Percentage (when stable)
- Signal quality indicator

## Comparison with Commercial Device

Tested against a real pulse oximeter:
- Heart rate: ±2 BPM accuracy
- SpO2: ±3% accuracy
- Response time: Similar
- Cost: $15 vs $50

Not medical grade, but pretty good!

## Challenges and Solutions

1. **Ambient light interference**
   - Solution: Modulate LEDs, synchronous detection

2. **Power consumption**
   - Solution: Duty cycle LEDs, sleep between samples

3. **Different finger sizes**
   - Solution: Adjustable spring tension

4. **Temperature drift**
   - Solution: Software calibration routine

## Code Optimization

For real-time processing on microcontroller:
- Fixed-point math only
- Lookup tables for division
- Circular buffers
- Minimal branching

## Future Improvements

1. Bluetooth connectivity
2. Accelerometer for motion cancellation
3. Multiple wavelengths for better SpO2
4. Heart rate variability analysis
5. Workout tracking features

## What I Learned

- Analog design is crucial for biosignals
- Mechanical design matters (finger pressure)
- Simple algorithms can work well
- Biological signals are surprisingly strong

Building this gave me huge respect for medical device engineers. Making something that works reliably on everyone is hard!

The moment I first saw my heartbeat on the screen was magical. This blinking LED can see inside my body. Sometimes engineering feels like magic.`}
      tags={["biomedical","sensors","signal-processing","health"]}
      readTime="16 min"
    />
  );
}

export function generateMetadata() {
  return {
    title: "Building a Photoplethysmography Heart Rate Monitor - Michael D'Angelo",
    description: "Creating a pulse oximeter from scratch using LEDs and photodiodes. Seeing your heartbeat in real-time is surprisingly emotional.",
  };
}