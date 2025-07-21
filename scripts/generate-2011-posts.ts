#!/usr/bin/env tsx
import { promises as fs } from 'fs';
import path from 'path';

interface BlogPost {
  date: string;
  title: string;
  summary: string;
  content: string;
  tags: string[];
  readTime: string;
}

const posts2011: BlogPost[] = [
  {
    date: '2011-01-05',
    title: 'Senior Year Begins: The Final Push',
    summary: 'Starting the last semester at UB with senior design, grad school applications, and the CubeSat launch approaching. The pressure is real.',
    content: `Senior spring semester started today. The hallways feel different when you know it's your last time walking them as an undergrad. Between senior design, the CubeSat launch window, and grad school decisions, this is going to be intense.

## The Course Load

### EE 494: Senior Design Project
Our capstone project: An autonomous quadcopter for search and rescue. Team of four EE/CS students. We have one semester to go from concept to working prototype.

Requirements:
- Autonomous navigation
- Object detection (find red objects = victims)
- 20-minute flight time
- Return to home on low battery
- Total budget: $1,500

Already ordered parts. The living room looks like a drone factory exploded.

### EE 478: Advanced Digital Design
FPGA-based computer vision. Perfect timing with the quadcopter project. Topics include:
- High-speed image processing
- Hardware acceleration
- Pipeline optimization
- Real-time constraints

Professor is letting us use the new Virtex-6 boards. These things cost more than my car.

### EE 483: Integrated Circuit Design
Actually designing chips! Using Cadence tools to design a simple CMOS processor.
- Schematic capture
- Layout (so tedious)
- DRC/LVS checking
- SPICE simulation

Tapeout through MOSIS if our design passes review. Actual silicon!

### CSE 421: Operating Systems
Finally understanding what happens below main():
- Kernel development
- Device drivers
- Memory management
- Real-time scheduling

Building a basic RTOS for ARM. Relevant for everything embedded.

## CubeSat Update

Launch window confirmed: July 2011! After three years of work, our satellite will actually go to space. Current status:
- Flight hardware: 90% complete
- Software: Endless testing
- Documentation: NASA wants EVERYTHING documented
- Team morale: Cautiously optimistic

## Grad School Applications

Submitted applications to:
1. **MIT** - Media Lab, working on space systems
2. **Stanford** - EE department, focus on embedded systems
3. **Carnegie Mellon** - Robotics Institute
4. **Berkeley** - EECS, wireless systems
5. **Michigan** - Aerospace Engineering

GRE scores came back: 800Q/680V. Good enough? We'll see.

## Research Progress

Acoustic localization paper accepted to ICASSP 2011! First real publication. Professor wants me to present it in Prague. First conference, first international travel. Nervous but excited.

## Side Projects

Can't stop building:
1. **Software Defined Radio** - Finally got GNU Radio working with USRP
2. **Kinect Hacking** - Depth sensing for robot navigation
3. **Bitcoin Mining** - FPGA implementation getting 100 MH/s
4. **3D Printer Upgrades** - Dual extruder for dissolvable support

## Industry Interviews

Starting to interview for backup plans:
- SpaceX (systems engineering)
- Intel (CPU design)
- Qualcomm (wireless systems)
- Local defense contractors

The SpaceX interview was intense. Eight hours of technical questions. They really want people who can work 80-hour weeks.

## Time Management

Daily schedule is brutal:
- 6 AM: Gym (staying sane)
- 7-12: Classes
- 12-1: CubeSat team meeting
- 1-5: Senior design work
- 5-6: Dinner
- 6-10: Research/homework
- 10-12: Side projects

Weekends don't exist anymore.

## Reflection

Four years ago, I could barely solder. Now I'm designing satellites and teaching others. The imposter syndrome is real, but so is the progress.

This semester will determine the next phase of life. Grad school or industry? Academia or startups? Space or terrestrial? 

Whatever happens, I'm going to make these last months count. Time to push harder than ever.

The countdown begins: 4 months to graduation, 6 months to launch. Let's do this.`,
    tags: ['university', 'senior-year', 'cubesat', 'grad-school'],
    readTime: '12 min',
  },
  {
    date: '2011-01-15',
    title: 'Building a Software Defined Radio from Scratch',
    summary: 'Creating a complete SDR system with an FPGA and high-speed ADC. DC to daylight, here we come!',
    content: `After playing with RTL-SDR dongles and USRP boards, I decided to build my own software defined radio from scratch. Goal: understand every component from antenna to bits.

## System Architecture

The signal chain:
1. **Antenna** → Wideband discone (25 MHz - 1.3 GHz)
2. **Frontend** → Switchable filters and LNA
3. **Mixer** → Quadrature downconversion
4. **ADC** → 14-bit, 125 MSPS
5. **FPGA** → Digital downconversion and decimation
6. **USB 3.0** → Stream to computer
7. **Software** → GNU Radio for demodulation

## RF Frontend Design

### Input Protection
Learned the hard way: RF inputs need protection.
- Gas discharge tube for lightning
- PIN diode limiter for overload
- Never exceed ADC max input!

### Low Noise Amplifier
Used the MGA-82563 MMIC:
- 0.5 dB noise figure
- 20 dB gain
- 0.1-6 GHz bandwidth
- Bias tee for single supply

### Filter Bank
Switchable bandpass filters:
- HF: 0-30 MHz
- VHF: 30-300 MHz  
- UHF: 300-1000 MHz
- L-band: 1-2 GHz

PIN diode switches for selection. Software controlled.

## Quadrature Downconversion

The key to SDR: I/Q demodulation.

### Local Oscillator
Si5351 clock generator:
- 8 kHz to 160 MHz output
- Two outputs, 90° phase shift
- I²C controlled
- 0.5 ppm stability with TCXO

### Mixer
Using the LT5560 for downconversion:
- DC to 4 GHz RF input
- Excellent linearity
- Integrated baluns
- Differential I/Q outputs

## High-Speed ADC

The heart of the system: LTC2145-14
- 14-bit resolution
- 125 MSPS sampling rate
- LVDS outputs
- 73 dB SNR

PCB layout was critical:
- Differential pairs length matched
- Solid ground plane
- Separate analog/digital supplies
- Clock jitter < 1 ps RMS

## FPGA Processing

Using Spartan-6 LX45:

### Digital Downconverter
Implemented in Verilog:
\`\`\`verilog
// NCO for fine frequency tuning
always @(posedge clk) begin
    phase_acc <= phase_acc + freq_word;
end

// CORDIC for sine/cosine generation
assign sin_out = cordic_sin(phase_acc[31:16]);
assign cos_out = cordic_cos(phase_acc[31:16]);

// Complex multiplication
assign i_mixed = (adc_i * cos_out) - (adc_q * sin_out);
assign q_mixed = (adc_i * sin_out) + (adc_q * cos_out);
\`\`\`

### CIC Decimator
Reduces data rate for USB:
- Programmable decimation: 4 to 4096
- Three stages
- Bit growth handled carefully
- Compensation filter for droop

### USB 3.0 Interface

Using FT601 for streaming:
- Up to 400 MB/s throughput
- 32-bit FIFO interface
- Flow control for reliability

## Software Stack

### Device Driver
Linux kernel module for low latency:
- DMA transfers
- Ring buffer management
- Zero-copy to userspace

### GNU Radio Integration
Created custom blocks:
- Source block for IQ streaming
- Control block for frequency/gain
- Calibration utilities

### Applications Built

1. **FM Broadcast Receiver**
   - Stereo decoding works!
   - RDS data extraction
   - Better than my car radio

2. **Aircraft Tracker (ADS-B)**
   - Decode 1090 MHz transmissions
   - Plot aircraft on map
   - See planes 200 miles away

3. **Weather Satellite Receiver**
   - NOAA APT signals
   - Live weather images
   - Automated pass predictions

4. **Amateur Radio**
   - All-mode receiver
   - PSK31, RTTY, packet
   - Contact the ISS!

## Performance Achieved

Specifications:
- Frequency range: 0-60 MHz (direct sampling)
- Bandwidth: Up to 56 MHz
- Sensitivity: -130 dBm (narrowband)
- Dynamic range: 85 dB
- Phase noise: -100 dBc/Hz @ 10 kHz

## Challenges Overcome

### Clock Distribution
Getting clean clocks everywhere:
- Star distribution topology
- Matched trace lengths
- Proper termination
- Lots of bypassing

### Thermal Management
FPGA gets hot at full bandwidth:
- Heatsink with fan
- Thermal vias under FPGA
- Temperature monitoring

### EMI/RFI
SDR in a computer = noise city:
- Shielded enclosure mandatory
- Filtered power entry
- Common mode chokes on USB
- Gaskets on all seams

## Total Cost

- PCB fabrication: $100 (4-layer)
- Components: $250
- Enclosure: $50
- Mistakes: $200 (blown parts)
- **Total: $600**

Compared to $3,000 for equivalent commercial unit!

## Lessons Learned

1. **RF is unforgiving** - Every detail matters
2. **Layout is critical** - Bad layout = bad performance
3. **Calibration required** - IQ imbalance is real
4. **Processing power** - Never enough FPGA resources
5. **Documentation sparse** - Most SDR stuff is tribal knowledge

## Future Improvements

- Transmit capability (carefully!)
- Higher sampling rate ADC
- Larger FPGA
- Multiple coherent channels
- GPS disciplined oscillator

## Conclusion

Building an SDR from scratch taught me more about radio than any textbook. It's one thing to read about quadrature demodulation, another to debug I/Q imbalance at 3 AM.

Now I can literally see the radio spectrum. It's like having RF vision. The invisible world of signals is invisible no more!`,
    tags: ['sdr', 'fpga', 'rf', 'gnu-radio'],
    readTime: '16 min',
  },
  {
    date: '2011-01-28',
    title: 'Senior Design: Autonomous Search and Rescue Quadcopter',
    summary: 'Building a drone that can find lost hikers autonomously. Computer vision, GPS navigation, and lots of crashes.',
    content: `Our senior design project is ambitious: build a quadcopter that can autonomously search for and locate missing persons. Four months to go from concept to demo. No pressure.

## Team Dynamics

Our team of four:
- Me: Flight controller and sensors
- Jake: Computer vision and AI
- Sarah: Mechanical design and power
- Ahmed: Communications and ground station

Weekly advisor meetings keep us honest.

## System Requirements

Defined after meeting with local search and rescue:
1. **Flight time**: 20+ minutes
2. **Range**: 2 km radius
3. **Payload**: Camera + compute
4. **Detection**: Find red objects (emergency blankets)
5. **Autonomous**: GPS waypoint navigation
6. **Return**: Auto-land when battery low
7. **Cost**: Under $1,500

## Mechanical Design

### Frame Selection
After much debate, went with:
- DJI F450 frame
- Simple, proven design
- Replacement parts available
- 450mm motor-to-motor
- Plenty of mounting space

### Propulsion
- Motors: T-Motor MN2214 920KV
- ESCs: 30A with SimonK firmware
- Props: 10x4.5 carbon fiber
- 3S 5000mAh LiPo battery

Calculated thrust: 2:1 ratio fully loaded.

## Flight Controller

Building our own (because senior design):

### Hardware
- STM32F405 microcontroller
- MPU9250 9-axis IMU
- MS5611 barometer
- Ublox NEO-M8N GPS
- 2.4 GHz radio for manual override

### Sensor Fusion
Implementing extended Kalman filter:
\`\`\`c
// Simplified EKF update
void ekf_update(float dt) {
    // Prediction step
    predict_state(dt);
    predict_covariance(dt);
    
    // Update with accelerometer
    if (new_accel_data) {
        update_with_accel();
    }
    
    // Update with GPS
    if (new_gps_data) {
        update_with_gps();
    }
    
    // Extract Euler angles
    extract_attitude();
}
\`\`\`

### Control Loops
Cascaded PID controllers:
- Inner loop: Angular rate (400 Hz)
- Middle loop: Angle (100 Hz)  
- Outer loop: Position (50 Hz)

Tuning these is an art form.

## Computer Vision System

### Hardware
- Raspberry Pi 3 (just released!)
- Pi Camera v2
- 3-axis gimbal for stabilization

### Detection Algorithm
Finding red objects in wilderness:
1. Convert RGB to HSV
2. Threshold for red hues
3. Morphological operations
4. Contour detection
5. Size/shape filtering

### Performance Optimization
Getting 10 FPS on Pi:
- Reduce resolution to 640x480
- Skip frames when processing
- Use NEON instructions
- Optimize with Cython

## Autonomous Navigation

### Mission Planning
Simple grid search pattern:
\`\`\`python
def generate_search_pattern(center, radius, spacing):
    waypoints = []
    for x in range(-radius, radius, spacing):
        for y in range(-radius, radius, spacing):
            lat = center.lat + (x / 111111.0)
            lon = center.lon + (y / 111111.0)
            waypoints.append((lat, lon, altitude))
    return waypoints
\`\`\`

### Obstacle Avoidance
Basic implementation:
- Ultrasonic sensors (4x HC-SR04)
- Simple reactive behavior
- Increase altitude if obstacle detected

Not perfect but prevents most crashes.

## Communication System

### Telemetry Link
- 433 MHz LoRa modules
- 2 km range achieved
- MAVLink protocol
- 56 kbps effective throughput

### Video Downlink
- 5.8 GHz analog transmitter
- Real-time pilot view
- Records onboard for analysis

## Ground Station Software

Built with Python + Qt:
- Real-time telemetry display
- Map with GPS position
- Video feed with object detection overlay
- Mission upload/download
- Emergency stop button (important!)

## Testing Chronicles

### First Flight Attempt
Result: Immediate flip and crash
Problem: Motor order wrong
Damage: Two props
Lesson: Check everything twice

### Second Flight  
Result: Unstable oscillations
Problem: PID gains too high
Damage: None (landed quickly)
Lesson: Start with low gains

### Third Flight
Result: Stable hover!
Problem: Drifts significantly
Solution: Compass calibration

### Autonomous Test #1
Result: Flew into tree
Problem: GPS accuracy ±5 meters
Solution: Increase altitude margins

### Vision Test
Found test target successfully!
Range: 50 meters
False positives: Red leaves...

## Current Status

With two months left:
- ✓ Stable manual flight
- ✓ GPS hold working
- ✓ Waypoint navigation (mostly)
- ✓ Object detection (needs work)
- ⚠️ Battery life: 18 minutes (close)
- ⚠️ Range: 1.5 km (working on it)
- ❌ Reliability: 60% success rate

## Budget Breakdown

- Frame and motors: $300
- Flight controller components: $150
- Raspberry Pi + camera: $100
- GPS and sensors: $100
- Batteries and charger: $200
- Radio equipment: $150
- Miscellaneous/repairs: $500
- **Total: $1,500** (exactly on budget!)

## Lessons Learned

1. **Start simple** - Basic hover before autonomy
2. **Test incrementally** - Each subsystem separately
3. **Have spare parts** - Crashes will happen
4. **Document everything** - For the final report
5. **Team communication** - Daily standups help

## Demo Day Preparation

Three demos planned:
1. Manual flight showing stability
2. Autonomous grid search
3. Target detection and location

Hoping the demo gods are merciful.

## Future Work

If we had more time:
- Better obstacle avoidance (lidar?)
- Thermal camera for night search
- Longer flight time (bigger battery)
- AI for better object recognition
- Multiple drone coordination

This project combined everything from four years of engineering education. Control theory, embedded systems, computer vision, communications - it's all here.

Win or lose on demo day, we built something that flies. That's pretty cool.`,
    tags: ['senior-design', 'quadcopter', 'autonomous', 'computer-vision'],
    readTime: '15 min',
  },
  {
    date: '2011-02-10',
    title: 'GPU Computing with CUDA: Parallel Processing Power',
    summary: 'Discovering the massive parallel processing power of GPUs. From bitcoin mining to neural networks, CUDA changes everything.',
    content: `Just installed my first real GPU - an NVIDIA GTX 460 - and discovered CUDA programming. The parallel processing power is mind-blowing. Suddenly, computations that took hours run in seconds.

## Why GPU Computing?

CPUs are optimized for sequential tasks:
- Few cores (2-4 typical)
- Complex control logic
- Large caches
- Branch prediction

GPUs are optimized for parallel tasks:
- Hundreds of cores (336 on GTX 460!)
- Simple control logic
- Small caches
- Same operation on many data points

Perfect for embarrassingly parallel problems.

## Getting Started with CUDA

### Hello World
\`\`\`cuda
__global__ void hello_kernel() {
    printf("Hello from thread %d\\n", threadIdx.x);
}

int main() {
    hello_kernel<<<1, 10>>>();
    cudaDeviceSynchronize();
    return 0;
}
\`\`\`

That <<<1, 10>>> syntax? That's launching 10 parallel threads!

### Understanding the Hierarchy
- **Thread**: Single execution unit
- **Block**: Group of threads (up to 1024)
- **Grid**: Group of blocks
- **Warp**: 32 threads executing in lockstep

## First Real Project: Matrix Multiplication

### CPU Version (Naive)
\`\`\`c
void matrix_multiply_cpu(float *A, float *B, float *C, int N) {
    for (int i = 0; i < N; i++) {
        for (int j = 0; j < N; j++) {
            float sum = 0;
            for (int k = 0; k < N; k++) {
                sum += A[i*N + k] * B[k*N + j];
            }
            C[i*N + j] = sum;
        }
    }
}
\`\`\`

Time for 1024×1024: 8.2 seconds

### GPU Version (Basic)
\`\`\`cuda
__global__ void matrix_multiply_gpu(float *A, float *B, float *C, int N) {
    int row = blockIdx.y * blockDim.y + threadIdx.y;
    int col = blockIdx.x * blockDim.x + threadIdx.x;
    
    if (row < N && col < N) {
        float sum = 0;
        for (int k = 0; k < N; k++) {
            sum += A[row*N + k] * B[k*N + col];
        }
        C[row*N + col] = sum;
    }
}
\`\`\`

Time for 1024×1024: 0.12 seconds (68× speedup!)

### GPU Version (Optimized with Shared Memory)
\`\`\`cuda
__global__ void matrix_multiply_tiled(float *A, float *B, float *C, int N) {
    __shared__ float As[TILE_SIZE][TILE_SIZE];
    __shared__ float Bs[TILE_SIZE][TILE_SIZE];
    
    int bx = blockIdx.x, by = blockIdx.y;
    int tx = threadIdx.x, ty = threadIdx.y;
    
    int row = by * TILE_SIZE + ty;
    int col = bx * TILE_SIZE + tx;
    
    float sum = 0;
    
    for (int t = 0; t < (N + TILE_SIZE - 1) / TILE_SIZE; t++) {
        if (row < N && t*TILE_SIZE + tx < N)
            As[ty][tx] = A[row*N + t*TILE_SIZE + tx];
        else
            As[ty][tx] = 0;
            
        if (col < N && t*TILE_SIZE + ty < N)
            Bs[ty][tx] = B[(t*TILE_SIZE + ty)*N + col];
        else
            Bs[ty][tx] = 0;
            
        __syncthreads();
        
        for (int k = 0; k < TILE_SIZE; k++)
            sum += As[ty][k] * Bs[k][tx];
            
        __syncthreads();
    }
    
    if (row < N && col < N)
        C[row*N + col] = sum;
}
\`\`\`

Time for 1024×1024: 0.018 seconds (455× speedup!)

## Bitcoin Mining

Perfect CUDA application:
\`\`\`cuda
__global__ void bitcoin_mine(uint32_t *nonce_start, uint32_t *results) {
    uint32_t nonce = *nonce_start + blockIdx.x * blockDim.x + threadIdx.x;
    
    // Simplified - real implementation is more complex
    uint32_t hash[8];
    sha256_transform(block_header, nonce, hash);
    
    if (hash[7] == 0 && hash[6] == 0) {  // Difficulty check
        results[0] = nonce;  // Found valid hash!
    }
}
\`\`\`

Getting 95 MH/s vs 2 MH/s on CPU!

## Neural Network Training

Training a simple feedforward network:

### Forward Pass
\`\`\`cuda
__global__ void forward_pass(float *input, float *weights, 
                            float *output, int n_in, int n_out) {
    int idx = blockIdx.x * blockDim.x + threadIdx.x;
    if (idx < n_out) {
        float sum = 0;
        for (int i = 0; i < n_in; i++) {
            sum += input[i] * weights[i * n_out + idx];
        }
        output[idx] = 1.0f / (1.0f + expf(-sum));  // Sigmoid
    }
}
\`\`\`

Training MNIST: 50× faster than CPU!

## Image Processing

Gaussian blur on GPU:
\`\`\`cuda
__global__ void gaussian_blur(uint8_t *input, uint8_t *output, 
                             int width, int height) {
    int x = blockIdx.x * blockDim.x + threadIdx.x;
    int y = blockIdx.y * blockDim.y + threadIdx.y;
    
    if (x >= width || y >= height) return;
    
    float kernel[5][5] = { /* Gaussian kernel values */ };
    float sum = 0;
    
    for (int ky = -2; ky <= 2; ky++) {
        for (int kx = -2; kx <= 2; kx++) {
            int px = min(max(x + kx, 0), width - 1);
            int py = min(max(y + ky, 0), height - 1);
            sum += input[py * width + px] * kernel[ky+2][kx+2];
        }
    }
    
    output[y * width + x] = (uint8_t)sum;
}
\`\`\`

Processing 1080p video in real-time!

## Profiling and Optimization

Using nvprof revealed issues:
1. **Memory bandwidth limited** - Use shared memory
2. **Low occupancy** - Adjust block size
3. **Divergent warps** - Minimize branches
4. **Uncoalesced access** - Align memory patterns

## Lessons Learned

### The Good
1. **Massive speedups possible** - 100× is common
2. **Great for specific problems** - Parallel, arithmetic heavy
3. **Active ecosystem** - Libraries for everything
4. **Skills transfer** - OpenCL, compute shaders similar

### The Challenging
1. **Different programming model** - Think parallel
2. **Memory management** - Manual and complex
3. **Debugging is hard** - Thousands of threads
4. **Not everything parallelizes** - Amdahl's Law

## Future Projects

Now that I have GPU power:
- Ray tracing renderer
- Fluid dynamics simulation
- Deep learning experiments
- Protein folding?
- Password cracking (ethically!)

## Resources That Helped

- NVIDIA's CUDA guides (excellent)
- Udacity's CS344 course
- GPU Gems books
- Stack Overflow (as always)

## Conclusion

CUDA programming opened a new world of computational possibilities. Problems I thought were intractable on my desktop suddenly become feasible.

The future is parallel, and it's incredibly exciting. Time to port everything to GPU!`,
    tags: ['cuda', 'gpu', 'parallel-computing', 'optimization'],
    readTime: '14 min',
  },
  {
    date: '2011-02-22',
    title: 'Grad School Acceptance: Stanford Bound!',
    summary: 'The envelope arrived. Starting PhD at Stanford in the fall. Excited, terrified, and ready for the next chapter.',
    content: `Checked email obsessively for weeks. Then it arrived: "Congratulations! You have been admitted to Stanford University's Electrical Engineering PhD program."

I literally fell out of my chair.

## The Decision Process

Incredibly fortunate to have options:

### Stanford EE
- **Pros**: Silicon Valley, amazing faculty, startup culture
- **Research fit**: Embedded systems lab perfect match
- **Funding**: Full fellowship + stipend
- **Cons**: Cost of living, far from family

### MIT Media Lab
- **Pros**: Interdisciplinary, space projects
- **Research fit**: Future spacecraft systems
- **Funding**: RA position available
- **Cons**: Boston winters, more structured

### CMU Robotics
- **Pros**: Best robotics program, industry connections
- **Research fit**: Autonomous systems
- **Funding**: Teaching assistantship
- **Cons**: Pittsburgh (no offense)

### The Choice

Stanford won because:
1. Professor working on exactly what I want
2. Silicon Valley opportunities
3. Weather (shallow but true)
4. Startup ecosystem
5. That California energy

## Telling People

### Parents
"Where's Stanford?" - Mom
"It's... it's one of the best schools in the world."
"Oh. Is it expensive?"
*Explains PhD funding*
"They PAY you to go to school?!"

### Advisor
"Great choice. Now don't get distracted by startups... immediately."
He knows me too well.

### Friends
Mixed reactions:
- "California? Sellout!" (jokingly)
- "Can I crash on your couch?"
- "You'll fit right in with the nerds"

## The Path Here

Looking back at what got me here:

### GPA: 3.84
Not perfect, but consistent. That one C in English Lit still haunts me.

### GRE: 800Q/680V/5.5W
Quantitative perfect, verbal decent. Studied for months.

### Research
- Two published papers
- CubeSat project leadership
- Acoustic localization system
- Consistent lab presence

### Letters of Recommendation
Three professors who knew me well:
- Research advisor (2 years)
- Senior design advisor
- Electromagnetics professor

### Statement of Purpose
Rewrote 15 times. Key themes:
- Clear research vision
- Demonstrated hardware skills
- Passion for embedded systems
- Future goals aligned with program

## What This Means

### Academically
- 5-6 years of focused research
- World-class resources
- Brilliant peer group
- Pressure to perform

### Personally
- Moving across country
- Leaving comfort zone
- New chapter of life
- Growth opportunity

### Professionally
- Access to Silicon Valley
- Networking opportunities
- Credibility boost
- Research freedom

## Concerns

Being honest about fears:

1. **Imposter Syndrome**
   Everyone will be smarter

2. **Financial**
   Bay Area is expensive, even with stipend

3. **Workload**
   PhD is grueling journey

4. **Isolation**
   Leaving friends and family

5. **Failure**
   What if I can't cut it?

## Preparation Plans

### Summer Before
- Finish CubeSat launch
- Read advisor's papers
- Learn new skills (machine learning?)
- Save money
- Visit campus

### Skills to Develop
- Better programming practices
- Statistical analysis
- Technical writing
- Presentation skills
- Time management

### Mental Preparation
- This will be hard
- Failure is part of research
- Ask for help
- Maintain work-life balance
- Remember why I'm doing this

## The Bigger Picture

This isn't just about me. First generation college student, now PhD bound. My family sacrificed for this. I carry their dreams too.

## Thank You List

People who made this possible:
- Parents (always supportive)
- Professors who pushed me
- Lab mates who helped
- Friends who listened
- That one TA who explained pointers

## Looking Forward

Research interests for PhD:
- Ultra-low power embedded systems
- Energy harvesting
- Sensor networks
- Space systems
- Maybe some ML/embedded fusion

## The Email I'll Frame

"Dear Michael,

Congratulations! On behalf of the Department of Electrical Engineering, I am delighted to inform you that you have been admitted to the PhD program at Stanford University..."

Still doesn't feel real.

## Final Thoughts

Four years ago, I was struggling with basic circuits. Now Stanford thinks I can contribute to human knowledge. Either they made a mistake, or maybe, just maybe, I can do this.

Time to prove it's the latter.

California, here I come! 🌴

*PS - Already looking at bikes. Apparently everyone bikes at Stanford.*`,
    tags: ['grad-school', 'stanford', 'personal', 'milestone'],
    readTime: '11 min',
  },
  {
    date: '2011-03-05',
    title: 'Presenting at ICASSP: First Conference Experience',
    summary: 'Presenting my acoustic localization research at ICASSP in Prague. First international conference, first time in Europe, lots of firsts.',
    content: `Just returned from presenting at ICASSP 2011 in Prague. My first academic conference, first international travel, first time feeling like a "real" researcher. What an experience!

## The Paper

"Robust Acoustic Source Localization Using Distributed Microphone Arrays"
- 3D localization using time delays
- Novel approach to multipath mitigation
- Real-time implementation on DSP

Eight pages that took six months to write.

## Preparation Terror

### The Presentation
Created approximately 47 versions of my slides:
- Version 1-10: Too much math
- Version 11-20: Too little math
- Version 21-30: Bad flow
- Version 31-40: Ugly figures
- Version 41-46: Overthinking
- Version 47: Just right (maybe?)

### Practice Runs
Presented to:
- Empty room (many times)
- Lab mates (harsh but helpful)
- Advisor (terrifying)
- Mirror (desperate)
- Parents via Skype (confused but supportive)

Timed at exactly 19 minutes, 47 seconds. Perfect.

## The Journey

### Buffalo → Prague
- First transatlantic flight
- Watched three movies about public speaking
- Didn't sleep at all
- Revised slides on napkins

### Arrival
Prague is stunning! But no time for tourism. Conference starts in 6 hours. Find hotel, shower, more practice.

## Conference Day One

### Registration
"First time at ICASSP?"
"How could you tell?"
"The terror in your eyes."

Got my badge. "Michael D'Angelo - University at Buffalo" Never felt more official.

### Poster Session Exploration
Hundreds of research posters. Everyone seems to know everything about everything. Imposter syndrome intensifying.

Notable papers:
- Compressed sensing (everywhere!)
- Deep learning for speech (the future?)
- Array processing advances
- My exact topic done better (panic!)

### Evening Reception
Free food! Networking attempt:
"Hi, I'm Mike, I work on acoustic localization."
"Oh, like Brandstein's 1997 paper?"
"... yes, exactly like that."
*furiously googles Brandstein later*

## Presentation Day

### 7:00 AM - Wake Up
Already awake. Never slept.

### 8:00 AM - Conference Breakfast
Can't eat. Stomach full of butterflies.

### 9:00 AM - Session Starts
My session: "Array Processing II"
I'm third. Watch first two presenters. They're so confident. How?

### 9:40 AM - My Turn
Walk to podium. Legs surprisingly functional.

"Good morning. Today I'll present our work on robust acoustic source localization..."

The next 20 minutes blur by:
- Slide 3: Forget everything
- Slide 5: Remember everything
- Slide 8: Question from audience (handled!)
- Slide 12: Live demo works!
- Slide 15: Running out of time
- Slide 18: Perfect landing

"... and that concludes my presentation. Thank you."

Applause! Questions!

### The Questions

**Question 1**: "How does your method compare to MUSIC algorithm?"
*I actually know this!*

**Question 2**: "What about non-stationary sources?"
*Good question, future work*

**Question 3**: "Have you considered the Cramér-Rao bound?"
*Pretend to understand, nod thoughtfully*

Survived!

## Post-Presentation

### Immediate Aftermath
- Adrenaline crash
- Find bathroom
- Call parents
- Sleep for 3 hours

### Evening Session
Can finally enjoy other presentations:
- Speech recognition advances
- Musical instrument separation
- Beamforming innovations
- So much to learn!

## Networking Adventures

### Coffee Breaks
Learned the conference coffee break dance:
1. Approach interesting person
2. Read name tag discreetly
3. "Hi, I really enjoyed your paper on..."
4. Exchange business cards
5. Promise to read each other's work
6. Repeat

Collected 47 business cards.

### Conference Dinner
Seated with:
- Professor from Tokyo Tech
- PhD student from ETH Zurich
- Researcher from Samsung
- Me, trying not to say anything stupid

Conversation topics:
- Research (safe)
- Funding nightmares (universal)
- Favorite algorithms (nerdy)
- Beer quality (important)

## Tourist Finale

Last day, finally explored Prague:
- Charles Bridge at sunrise
- Prague Castle
- Old Town Square
- Astronomical Clock

Posted one tourist photo. Caption: "Presenting at conferences has perks."

## Lessons Learned

### Technical
1. My research holds up internationally
2. So much happening in signal processing
3. Deep learning is coming for everything
4. Need to read more papers (always)

### Professional
1. Conferences are about connections
2. Everyone's nervous presenting
3. Business cards still matter
4. Free conference t-shirts are terrible

### Personal
1. I can do this
2. Travel is exhausting but worth it
3. Czech beer is dangerous
4. Always pack presentation clothes in carry-on

## Impact

Post-conference:
- 6 researchers contacted me
- 2 collaboration offers
- 15 paper downloads
- 1 citation already!
- Advisor impressed
- Confidence boosted 1000%

## The Best Part

Random email two weeks later:
"Hi Michael, I saw your ICASSP presentation. I'm working on something similar. Want to collaborate?"

From a professor at EPFL. We're now writing a journal paper together.

## Would Do Again?

Absolutely. Already looking at next year's conference in Kyoto.

Budget required:
- Registration: $500
- Flight: $1,200
- Hotel: $600
- Food: $200
- Worth it: Priceless

Time to start writing the next paper!`,
    tags: ['conference', 'research', 'travel', 'acoustic-localization'],
    readTime: '13 min',
  },
  {
    date: '2011-03-20',
    title: 'The IoT Revolution Begins: Connecting Everything',
    summary: 'Building internet-connected devices before "IoT" was cool. WiFi modules are finally cheap enough for hobby projects!',
    content: `The Microchip WiFi module just dropped to $30, and the ESP8266 rumors are starting. We're on the verge of connecting everything to the internet. Built three IoT projects this week alone!

## Project 1: Smart Dorm Room

Living in the future, one sensor at a time.

### The System
- **Temperature/humidity**: DHT22 sensors
- **Motion detection**: PIR sensors  
- **Door sensor**: Magnetic reed switch
- **Lighting**: RGB LED strips
- **Brain**: Arduino + WiFi shield
- **Backend**: PHP script on shared hosting

### Features Implemented
1. **Auto lighting** - Lights on when door opens after sunset
2. **Climate logging** - Graphs of temperature over time
3. **Presence detection** - Texts me if door opens when I'm out
4. **Party mode** - Lights pulse to music
5. **Statistics** - Time spent in room, sleep patterns

### The Code
\`\`\`cpp
void loop() {
    if (motionDetected() && isDark()) {
        fadeIn(lights, 2000);
        lastMotion = millis();
    }
    
    if (millis() - lastMotion > 300000) {  // 5 min
        fadeOut(lights, 5000);
    }
    
    if (millis() - lastUpdate > 60000) {  // 1 min
        postToServer(temperature, humidity, presence);
        lastUpdate = millis();
    }
}
\`\`\`

### Web Dashboard
Simple PHP + MySQL:
\`\`\`php
<?php
$temp = $_POST['temp'];
$humidity = $_POST['humidity'];
$time = time();

$sql = "INSERT INTO readings (temp, humidity, timestamp) 
        VALUES ($temp, $humidity, $time)";
mysqli_query($conn, $sql);

// Check for alerts
if ($temp > 85) {
    mail("me@email.com", "Room too hot!", "Currently $temp°F");
}
?>
\`\`\`

## Project 2: Cafeteria Crowd Tracker

How busy is the dining hall?

### The Approach
- WiFi module counts probe requests
- Estimates crowd based on phone density
- Updates every 5 minutes
- Public web interface

### Privacy Considerations
- Only count, don't store MACs
- Hash MACs for uniqueness
- Clear data hourly
- Posted privacy notice

### Results
Can predict:
- Peak meal times
- Best times to avoid crowds
- Special event impacts
- Weekend patterns

Students love it! Website gets 500 hits/day.

## Project 3: Laundry Alert System

The killer app for dorms.

### Problem
- 4 washers/dryers for 50 students
- People forget their laundry
- Angry confrontations

### Solution  
- Current sensor on each machine
- Detects running/stopped states
- Web interface shows availability
- Notifications when cycle completes

### Implementation
\`\`\`cpp
float current = readCurrent(A0);
bool running = current > THRESHOLD;

if (wasRunning && !running) {
    // Machine just stopped
    notifyUser(machineId);
    updateWebStatus(machineId, "Available");
}

wasRunning = running;
\`\`\`

### Unexpected Benefits
- 30% reduction in wait times
- Fewer abandoned loads
- Data shows usage patterns
- Maintenance predictions

## The Backend Challenge

### Shared Hosting Limitations
- No persistent processes
- No websockets
- Limited CPU
- Basic PHP only

### Workarounds
- Polling every 30 seconds
- Cron jobs for cleanup
- File-based queuing
- Creative caching

### Database Schema
Keep it simple:
\`\`\`sql
CREATE TABLE sensor_data (
    id INT AUTO_INCREMENT,
    device_id VARCHAR(32),
    sensor_type VARCHAR(32),
    value FLOAT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_device_time (device_id, timestamp)
);
\`\`\`

## Power Consumption Reality

WiFi is hungry:
- Transmit: 300mA
- Receive: 100mA  
- Sleep: 10mA

Battery life calculations:
- Always on: 6 hours
- Update every minute: 2 days
- Update every hour: 2 weeks
- Deep sleep between: 2 months

Power optimization crucial!

## Security Disasters

Learned the hard way:

### Mistake 1: HTTP Basic Auth
Someone sniffed password, turned lights into strobe. Migraine induced.

### Mistake 2: No Rate Limiting
Script kiddie found endpoint. 50,000 requests. Hosting suspended.

### Mistake 3: SQL Injection
\`\`\`php
$id = $_GET['id'];
$sql = "SELECT * FROM devices WHERE id = $id";  // DON'T DO THIS
\`\`\`

Room temperature set to 9999°F in database.

### Fixes Applied
- HTTPS everywhere (even self-signed)
- API keys for each device
- Rate limiting (10 requests/minute)
- Prepared statements
- Input validation

## Lessons Learned

### Technical
1. **WiFi range sucks** - Walls are the enemy
2. **Time sync matters** - NTP is your friend
3. **Debugging remote devices** - Add lots of logging
4. **OTA updates** - Essential for deployed devices
5. **Watchdog timers** - WiFi code crashes randomly

### Practical
1. **Start simple** - Blink LED over internet first
2. **Plan for failure** - Network will go down
3. **Cache aggressively** - Reduce server load
4. **Battery included** - Power outages happen
5. **Physical security** - People unplug things

## The Future Vision

Imagine when every device has an IP:
- Fridge orders milk
- Lights follow you
- Energy optimization
- Predictive maintenance
- Context-aware computing

We're building the nervous system of the world!

## Current Costs

Making IoT accessible:
- Arduino: $30
- WiFi shield: $30
- Sensors: $20
- Total: $80 per node

Still expensive, but dropping fast.

## Community Response

Posted projects online:
- GitHub stars: 127
- Forks: 34
- Pull requests: 8
- "How-to" blog posts: 3
- Copycats on campus: 7

Open source FTW!

## What's Next

Working on:
1. Mesh networking between nodes
2. Local processing (edge computing?)
3. Voice control integration
4. Machine learning for patterns
5. Standardized protocol

The ESP8266 rumors sound promising. $5 WiFi would change everything!

## Philosophical Questions

As we connect everything:
- Privacy implications?
- Security nightmares?
- Dependency concerns?
- Environmental impact?
- Social changes?

Building the future requires thinking about consequences.

For now, I'm just excited my dorm room texts me. Living in the future, one connected device at a time!`,
    tags: ['iot', 'wifi', 'projects', 'embedded'],
    readTime: '15 min',
  },
  {
    date: '2011-04-02',
    title: 'April Fools Hack: The Oscilloscope Music Player',
    summary: 'Turned the lab oscilloscope into a music visualizer for April Fools. Professor was not amused. Students were delighted.',
    content: `For April Fools, I decided to "fix" all the oscilloscopes in the EE lab. When turned on, instead of boring waveforms, they now play music with perfectly synchronized X-Y mode visualizations. The prank that became a viral hit!

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

Happy April Fools! 🎵📊`,
    tags: ['april-fools', 'oscilloscope', 'prank', 'audio-visual'],
    readTime: '14 min',
  },
  {
    date: '2011-04-18',
    title: 'Time-Lapse Photography: Capturing Our CubeSat Assembly',
    summary: 'Documenting 6 months of satellite construction in 3 minutes. Technical challenges of long-term time-lapse and the art of showing progress.',
    content: `Our CubeSat is nearly complete, and I've been capturing its assembly with time-lapse photography since January. 50,000 photos later, we have a mesmerizing 3-minute video showing a satellite being born.

## The Setup

### Camera System
- Canon T2i with AC adapter (crucial!)
- Manual focus locked
- Manual exposure (1/60, f/8, ISO 400)
- 18-55mm lens at 24mm
- Mounted to ceiling with heavy-duty clamp

### Intervalometer
Built my own with Arduino:
\`\`\`cpp
const int INTERVAL = 60000;  // 1 minute
const int WORK_START = 8;    // 8 AM
const int WORK_END = 22;     // 10 PM

void loop() {
    DateTime now = rtc.now();
    
    if (now.hour() >= WORK_START && now.hour() < WORK_END) {
        triggerCamera();
        delay(INTERVAL);
    } else {
        // Sleep during off hours
        delay(3600000);  // Check every hour
    }
}
\`\`\`

### Lighting Consistency
Major challenge! Solution:
- Blocked windows (no natural light)
- LED panels on timers
- Color temperature locked at 5600K
- Light meter readings logged

## Technical Challenges

### Storage Management
- 18 MP × 50,000 photos = 900 GB raw files
- Automated transfer to NAS every night
- Redundant backups (learned the hard way)
- JPEG proxy files for preview

### Camera Maintenance
Over 6 months:
- Sensor cleaning: 3 times
- Lens cleaning: Weekly
- Position checks: Daily
- One power outage incident

### Stability
Preventing camera movement:
- Vibration dampening mount
- Marked floor positions
- "DO NOT TOUCH" signs everywhere
- One accidental kick (visible in final video)

## Processing Pipeline

### 1. Import and Organize
Python script for sorting:
\`\`\`python
import os
from datetime import datetime
import shutil

def organize_photos(source_dir, dest_dir):
    for filename in os.listdir(source_dir):
        if filename.endswith('.JPG'):
            # Extract date from EXIF
            date = get_exif_date(os.path.join(source_dir, filename))
            
            # Create date-based directory
            date_dir = os.path.join(dest_dir, date.strftime('%Y-%m-%d'))
            os.makedirs(date_dir, exist_ok=True)
            
            # Move file
            shutil.move(
                os.path.join(source_dir, filename),
                os.path.join(date_dir, filename)
            )
\`\`\`

### 2. Deflicker
Time-lapse flicker is awful. Used custom script:
\`\`\`python
def deflicker(images):
    # Calculate average brightness for each image
    brightnesses = [get_average_brightness(img) for img in images]
    
    # Smooth brightness curve
    smoothed = gaussian_filter1d(brightnesses, sigma=5)
    
    # Adjust each image
    for i, img in enumerate(images):
        adjustment = smoothed[i] / brightnesses[i]
        images[i] = adjust_brightness(img, adjustment)
    
    return images
\`\`\`

### 3. Stabilization
Despite precautions, slight drift occurred:
- Used Adobe After Effects warp stabilizer
- Tracked corner of workbench
- Sub-pixel alignment achieved

### 4. Speed Ramping
Not all moments are equal:
- Slow during interesting assembly
- Fast during lunch breaks
- Super slow for milestone moments
- Music-synchronized tempo changes

## Interesting Captures

### The Human Element
- Evolution of team dynamics
- Fashion changes over 6 months
- Hair growth (surprisingly noticeable)
- Coffee cup accumulation

### Technical Milestones
1. **First PCB arrival** - Team excitement visible
2. **Solar panel attachment** - Delicate process
3. **The dropped screw incident** - 2 hours condensed to 5 seconds
4. **Integration complete** - Actual cheering

### Unexpected Moments
- Spider building web in corner (kept it)
- Janitor photobombing at 2 AM
- Power outage candle-lit assembly
- Pizza delivery time-lapse within time-lapse

## Color Grading

Created consistent look:
- Slight desaturation (technical feel)
- Teal/orange split tone
- Vignetting to focus attention
- Matched shots despite lighting changes

## Audio Design

### Music Selection
Composed custom soundtrack:
- Building intensity matching progress
- 120 BPM for easy sync
- Electronic/orchestral hybrid
- Climax at final assembly

### Sound Effects
Subtle additions:
- Servo whirs during precise moments
- Clicking for fast sequences
- Heartbeat during tense operations
- Silence for dramatic effect

## The Final Product

### Statistics
- Duration: 3 minutes 24 seconds
- Frame rate: 24 fps (4,896 frames used)
- Resolution: 1080p
- File size: 847 MB (ProRes)
- Render time: 14 hours

### Distribution
Posted everywhere:
- YouTube: 75K views in first week
- University website: Featured content
- NASA education: Shared to 50K followers
- Local news: "Students Build Satellite"

## Lessons Learned

### Planning
1. **Start earlier** - Missed first month
2. **Multiple angles** - One camera limiting
3. **Higher interval** - 50K photos excessive
4. **Better signage** - Prevent disturbances
5. **Automated processing** - Manual work killed me

### Technical
1. **RAW necessary** - JPEG limits grading
2. **Backup everything** - Corruption happens
3. **Monitor daily** - Catch issues early
4. **Light consistency** - Most important factor
5. **Audio 50%** - Sound design crucial

## Behind the Scenes

### Storage Array
Built custom NAS:
- 4×4TB drives in RAID 5
- Automated offload script
- Network attached for team access
- Version control for edits

### Preview System
Daily time-lapse generation:
\`\`\`bash
#!/bin/bash
# Generate daily preview
ffmpeg -pattern_type glob -i '*.JPG' \
    -vf "scale=1920:1080,deflicker" \
    -c:v h264 -crf 25 \
    daily_preview.mp4

# Upload to team Dropbox
rclone copy daily_preview.mp4 dropbox:CubeSat/TimeLapse/
\`\`\`

## Impact

### Team Morale
- Daily previews motivated team
- Visible progress combated frustration
- Accountability (on camera!)
- Pride in documentation

### Educational Value
- Shows real engineering process
- Failures included (important!)
- Time investment visible
- Inspired other teams

### Personal Growth
- Learned video production
- Patience (so much patience)
- Planning complex projects
- Mixed technical/artistic skills

## Future Plans

For next project:
1. **Motion control** - Motorized slider
2. **Multiple cameras** - Different angles
3. **4K resolution** - Future-proof
4. **Live streaming** - Real-time progress
5. **AI analysis** - Auto-highlight detection

## Tips for Others

Starting a long-term time-lapse?
1. **Test everything** - One week trial run
2. **Automate early** - Manual = burnout
3. **Plan storage** - 3× expected amount
4. **Mark positions** - Tape everywhere
5. **Tell everyone** - Prevent interference
6. **Start now** - Can't go back in time

## Conclusion

This time-lapse became more than documentation - it's the story of our team building something incredible. Every frame represents hours of work, problems solved, and dreams taking shape.

When we launch this satellite, we'll have more than memories. We'll have proof of every step, every setback, and every success.

Time-lapse photography: turning months of grinding into minutes of magic. ✨📸🛰️`,
    tags: ['photography', 'cubesat', 'time-lapse', 'documentation'],
    readTime: '13 min',
  },
  {
    date: '2011-05-07',
    title: 'Graduation Day: From Buffalo to Silicon Valley',
    summary: 'Four years of engineering education complete. Diploma in hand, California bound. Reflecting on the journey and looking ahead.',
    content: `Today I walked across the stage at UB's Center for the Arts and received my Bachelor of Science in Electrical Engineering. Four years of all-nighters, failed projects, successful builds, and incredible growth. Now it's time for the next chapter.

## By the Numbers

The undergraduate experience quantified:
- Credits completed: 144
- Final GPA: 3.84
- All-nighters: ~200
- Coffee consumed: ~8,000 cups
- Components burned: 47
- Projects built: 100+
- Friends made: Countless
- Debt accumulated: $32,000
- Worth it: Absolutely

## The Ceremony

### 6:00 AM - Preparation
Iron the gown. Find the cap. Panic about the tassel side.

### 8:00 AM - Family Arrives
Parents drove 6 hours. Mom cries before anything even happens. Dad asks if I can fix his phone after this.

### 9:30 AM - Engineering Breakfast
Department reception. Professor mentions my oscilloscope prank in his speech. Mixed pride and embarrassment.

### 11:00 AM - The Walk
"Michael D'Angelo, Electrical Engineering, Magna Cum Laude"

Those 3 seconds walking across stage represent 4 years of work. Don't trip. Don't trip. Didn't trip!

### 12:30 PM - Photos
Every possible combination:
- With diploma
- With parents  
- With professors
- With CubeSat team
- With burned Arduino (tradition)

## Reflection on Four Years

### Freshman Year (2007-2008)
- Couldn't solve basic circuits
- First LED blink = magic
- Discovered passion for embedded
- GPA: 3.6 (C in English)

### Sophomore Year (2008-2009)
- Built first real projects
- Joined IEEE chapter
- Started research
- GPA: 3.8

### Junior Year (2009-2010)
- CubeSat team leadership
- First conference paper
- Internship at automation company
- GPA: 3.9

### Senior Year (2010-2011)
- Senior design success
- Grad school acceptance
- Launch preparation
- GPA: 3.9

## Memorable Professors

The educators who shaped me:

### Dr. Wireless
"If you can't explain it simply, you don't understand it."
Taught me RF isn't actually magic.

### Prof. Circuits
"Current flows in loops. ALWAYS."
Said this 1000 times. Finally sank in around time 800.

### Dr. DSP
"The Fourier Transform is your friend."
Made math beautiful. Still my friend.

### Prof. Embedded
"Read the datasheet. All of it."
Best advice ever. Saved countless hours.

## Final Projects Summary

What I'm most proud of:
1. **CubeSat** - Launching to space!
2. **Acoustic localization** - Published research
3. **SDR from scratch** - Actually works
4. **Autonomous quadcopter** - Sometimes flies
5. **LED cube** - Still mesmerizing

## Lessons Beyond Engineering

### Technical Skills
- Problem decomposition
- Systematic debugging  
- Documentation discipline
- Project planning
- Team dynamics

### Life Skills
- Time management (forced)
- Stress handling (required)
- Coffee appreciation (essential)
- Sleep deprivation (mastered)
- Friendship value (priceless)

## The Stanford Transition

### What's Next
- Summer: CubeSat launch
- August: Drive to California
- September: PhD begins
- 2016?: Dr. D'Angelo (weird)

### Concerns
- Imposter syndrome intensifying
- Bay Area cost of living
- Academic pressure
- Missing Buffalo wings

### Excitement
- World-class resources
- Silicon Valley access
- Weather upgrade
- New challenges

## Thank You Notes

People who made this possible:

### Parents
For believing in the kid who took apart everything. For not complaining (much) when I set the garage on fire. For driving to every presentation.

### Team Members
For late night debugging sessions. For covering when I broke things. For celebrating small victories.

### Professors
For office hours patience. For recommendation letters. For pushing harder.

### Janitors
For not reporting the 3 AM lab sessions. For saving my projects from trash. For the understanding nods.

## Advice for Future Students

Starting your EE journey?

1. **Build constantly** - Theory needs practice
2. **Document everything** - Future you will thank you
3. **Join clubs early** - Community matters
4. **Take hard professors** - Growth requires challenge
5. **Sleep sometimes** - Burnout is real
6. **Have fun** - It goes fast

## The Bitter Sweet

Leaving Buffalo means leaving:
- $1 pizza slices
- Brutal winters that build character
- Professors who became mentors
- Lab that feels like home
- Friends who understand op-amp jokes

## Looking Forward

Goals for next 5 years:
- Complete PhD
- Contribute to space technology
- Start a company?
- Stay connected to UB
- Give back to community

## The Last Lab Visit

Spent last night in the lab. Cleaned my bench. Organized components for next student. Left note: "Your turn to create magic. -Mike 2011"

Found similar note from 2007. Circle complete.

## Final Thoughts

Four years ago, I was terrified of calculus and couldn't solder straight. Today, I'm heading to Stanford to push the boundaries of embedded systems.

To every professor who stayed late, every TA who explained pointers again, every classmate who shared notes, every family member who pretended to understand my projects - thank you.

Buffalo made me an engineer. Time to see what California makes me.

Let's go Bulls! Forever proud to be UB Engineering.

*Now to pack everything I own and drive 3,000 miles. What could go wrong?*

🎓⚡🚀`,
    tags: ['graduation', 'university', 'personal', 'milestone'],
    readTime: '12 min',
  },
  {
    date: '2011-05-20',
    title: 'Cross-Country Road Trip: Buffalo to Palo Alto',
    summary: 'Driving 3,000 miles with everything I own. A road trip filled with electronics stores, national parks, and the excitement of starting fresh.',
    content: `Just completed a 3,000-mile solo drive from Buffalo to Palo Alto. My 2003 Honda Civic packed with oscilloscopes, development boards, and dreams. Here's the journey to my new life in Silicon Valley.

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

California, let's do this! ☀️🚗💻`,
    tags: ['road-trip', 'moving', 'stanford', 'personal'],
    readTime: '14 min',
  },
];

// Function to generate blog post files
async function generateBlogPosts() {
  console.log('🚀 Starting blog post generation for 2011...\n');
  
  for (const post of posts2011) {
    const date = new Date(post.date);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // Create slug from title
    const slug = post.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    
    // Create directory path
    const dirPath = path.join(process.cwd(), 'app', 'blog', `${year}-${month}-${day}-${slug}`);
    
    // Create directory if it doesn't exist
    await fs.mkdir(dirPath, { recursive: true });
    
    // Create the page.tsx content
    const pageContent = `import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="${post.date}"
      title="${post.title.replace(/"/g, '\\"')}"
      summary="${post.summary.replace(/"/g, '\\"')}"
      content={\`${post.content.replace(/`/g, '\\`')}\`}
      tags={${JSON.stringify(post.tags)}}
      readTime="${post.readTime}"
    />
  );
}

export function generateMetadata() {
  return {
    title: "${post.title.replace(/"/g, '\\"')} - Michael D'Angelo",
    description: "${post.summary.replace(/"/g, '\\"')}",
  };
}`;

    // Write the file
    const filePath = path.join(dirPath, 'page.tsx');
    await fs.writeFile(filePath, pageContent, 'utf8');
    
    console.log(`✅ Created: ${post.title}`);
  }
  
  console.log(`\n📝 Summary:`);
  console.log(`   Created: ${posts2011.length} posts`);
  console.log(`   Year: 2011`);
  console.log(`   Topics: Senior year, SDR, quadcopter, CUDA, grad school, ICASSP, IoT, graduation, road trip`);
}

// Run the generator
generateBlogPosts().catch(console.error);