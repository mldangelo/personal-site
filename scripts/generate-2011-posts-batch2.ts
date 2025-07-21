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

const posts2011Batch2: BlogPost[] = [
  {
    date: '2011-06-10',
    title: 'Stanford Orientation: Welcome to the PhD Life',
    summary: 'First week as a Stanford PhD student. Imposter syndrome, world-class facilities, and finding my place in Silicon Valley academia.',
    content: `Orientation week at Stanford just ended. After driving 3,000 miles and settling into Escondido Village, I'm officially a Stanford PhD student. The reality is both exciting and terrifying.

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

Stanford, let's see what you've got. 🌲📚💻`,
    tags: ['stanford', 'phd', 'orientation', 'silicon-valley'],
    readTime: '13 min',
  },
  {
    date: '2011-07-04',
    title: 'CubeSat Launch Day: Three Years of Work Reaches Space',
    summary: 'Our satellite finally launches! Watching three years of work ride a rocket to orbit. The anxiety, excitement, and first contact from space.',
    content: `Today, July 4th 2011, at 5:39 AM PDT, our CubeSat rode a Minotaur-IV rocket from Vandenberg Air Force Base into orbit. Three years of work now circles Earth every 90 minutes. Here's the launch day story.

## T-24 Hours: Final Preparations

### Pre-Launch Checkout
At the integration facility:
- Final battery charge: 95%
- Systems check: All green
- Remove before flight tags: Removed
- Team photo with satellite: ✓
- Trying not to cry: Failed

### The Handover
Physically giving our satellite to launch personnel:
"Take care of our baby."
"We'll get it to orbit safely."

Three years of late nights in a small metal box. Now it's out of our hands.

## Launch Day

### 2:00 AM - Wake Up
Couldn't sleep anyway. Check email obsessively. Review orbital parameters one more time.

### 3:30 AM - Arrive at Viewing Site
Fog. Of course there's fog. Can't see launch pad 10 miles away.

Team assembled:
- 12 team members
- 3 advisors
- 5 family members
- 1 very nervous project lead (me)

### 4:00 AM - Weather Brief
"50% chance of visibility at launch."
Rockets don't care about fog, but we want to see it!

### 5:00 AM - Final Poll
Launch director polls all stations:
"Propulsion?" "GO"
"Range?" "GO"
"Payload?" "GO"

Our satellite is the payload. We're GO.

### 5:30 AM - Terminal Count
T-minus 10 minutes. Fog lifting slightly. Can see pad lights.

Team huddles together. Some prayers. Some silence. All anxiety.

### 5:39 AM - LAUNCH

The countdown: "3... 2... 1... Ignition!"

Bright light pierces fog. Ground shakes. Rumble arrives seconds later.

The Minotaur rises, disappears into fog after 10 seconds. But we know it's climbing.

"Vehicle is supersonic."
"Mach 1.5 and climbing."
"Stage separation confirmed."

Each callout = relief.

### 5:52 AM - Orbital Insertion
"All payloads deployed successfully."

WE'RE IN SPACE!

Cheering. Crying. Hugging. Three years of work now orbiting at 17,500 mph.

## The Waiting Game

### T+45 Minutes - First Pass Preparation
Rush to ground station. Our first communication window in 45 minutes.

Boot up systems:
- Antenna tracking: Enabled
- Receiver: Configured
- Decoder: Ready
- Heart rate: Dangerous

### T+90 Minutes - First Pass

Antenna points to horizon. Waiting.

Static... Static... 

Then: BEEP BEEP BEEP

"WE HAVE SIGNAL!"

Telemetry floods screen:
- Battery voltage: 7.8V
- Temperature: 15°C
- Solar panels: Deployed
- Status: ALIVE

Our satellite is talking to us from space!

## Decoding First Data

### Health Check
All systems nominal:
- Power system: Charging
- Communications: Strong signal
- Attitude control: Stable
- Payload: Standby

It survived launch. It's working. We built something that works in space.

### First Image
Download first Earth image. Low resolution, but it's EARTH. FROM OUR SATELLITE.

Post to Twitter: "Hello Earth, from UB CubeSat!"
Goes viral in university community.

## The Celebration

### Immediate
- Champagne at 7 AM (don't judge)
- Call families
- Update university PR
- More crying

### Press Coverage
- Local news interviews
- University homepage feature
- Department newsletter
- Even hometown paper calls

"UB Students Successfully Launch Satellite"

## Reflection on the Journey

### 2008: The Beginning
- Knew nothing about satellites
- Thought space was for NASA only
- Joined team as freshman

### 2009: Learning
- First PCB design
- Power budget struggles
- "Why doesn't it work?" phase

### 2010: Building
- Integration nightmares
- Thermal vacuum testing
- Vibration test failures

### 2011: Success
- Final assembly
- Launch campaign
- Orbital operations

## Lessons Learned

### Technical
1. **Space is hard** - Every detail matters
2. **Test everything** - Then test again
3. **Documentation crucial** - Saved us multiple times
4. **Redundancy works** - Backup systems activated
5. **Simple is reliable** - Complex features all failed

### Team Dynamics
1. **Trust is essential** - Can't micromanage everything
2. **Communication breaks** - Have protocols
3. **Celebrate small wins** - Maintains morale
4. **Document decisions** - People forget why
5. **Include everyone** - Best ideas come from unexpected places

## What's Next

### Operations Phase
- Daily passes (4-5 per day)
- Data collection
- Science objectives
- Anomaly resolution

### Personal Journey
- PhD at Stanford starts in September
- Bringing space experience
- Already planning next mission
- CubeSat knowledge valuable

## The Bigger Picture

We're part of the CubeSat revolution:
- Universities accessing space
- $100K missions vs $100M
- Rapid iteration possible
- Students becoming space engineers

## Thank You List

This happened because of:
- Advisors who believed
- Team members who sacrificed
- University funding support
- Family patience
- Coffee (so much coffee)

## One Week Later Update

Satellite still operational:
- 100+ successful passes
- 50 MB data downloaded
- Minor anomalies resolved
- Exceeding mission requirements

Expected lifetime: 6 months
Hoping for: Years

## Advice for Future Teams

Starting a CubeSat project?
1. **Start simpler than you think**
2. **Budget 3x time expected**
3. **Test earlier than comfortable**
4. **Document obsessively**
5. **Enjoy the journey**

## The Moment

Sitting in Stanford apartment. Our satellite passes overhead. Pull out phone app, watch the dot traverse sky.

That dot is our satellite. We put it there.

From freshman who couldn't solder to satellite designer. From Buffalo basement to space.

Dreams do reach orbit. Happy Independence Day indeed. 🚀🛰️🎆`,
    tags: ['cubesat', 'space', 'launch', 'milestone'],
    readTime: '14 min',
  },
  {
    date: '2011-07-20',
    title: 'Silicon Valley Summer: Internships and Startups',
    summary: 'First summer in Silicon Valley. Everyone\'s starting companies, including my roommate. The startup bug is contagious.',
    content: `Summer in Silicon Valley is unlike anywhere else. While officially doing research at Stanford, I'm surrounded by interns, entrepreneurs, and world-changing ambitions. The energy is intoxicating.

## The Intern Invasion

Bay Area population swells with interns:
- Google interns everywhere (colorful backpacks)
- Facebook interns (they look tired)
- Apple interns (can't talk about it)
- Startup interns (working for equity)

Stanford campus becomes intern central.

## My "Internship" - Research

Officially not interning, but research feels similar:
- Low pay ✓
- Long hours ✓
- Learning constantly ✓
- Free food hunting ✓
- Imposter syndrome ✓

Working on energy harvesting for wireless sensors. Trying to power devices from ambient RF. Theoretical limit: microwatts. Need: milliwatts. Physics: unforgiving.

## Roommate's Startup Journey

My roommate dropped out to start a company. Watching in real-time:

### Week 1: The Idea
"What if photos organized themselves?"
*Builds prototype in 48 hours*

### Week 2: The Pivot
"Actually, what if photos had AI captions?"
*Another prototype*

### Week 3: The Re-Pivot
"Forget photos. Grocery lists!"
*I stop tracking*

### Week 4: The Investment
"We got $50K from an angel!"
*How?!*

## Startup Events Everywhere

Can't throw stone without hitting a pitch event:
- "Disrupting X with AI"
- "Uber for Y"
- "Facebook for Z"
- "Blockchain for everything"

Free food quality directly proportional to funding round.

## The Y Combinator Effect

YC Demo Day approaching. Entire Valley buzzing:
- Coffee shops full of pitches
- "Stealth mode" startups everywhere
- NDAs for casual conversations
- FOMO intensifying

Attended one YC party. Felt like freshman at senior prom.

## Technical Talks Circuit

Summer tech talk season:
- **Google**: Machine learning at scale
- **Facebook**: Social graph architecture
- **LinkedIn**: Data infrastructure
- **Twitter**: Real-time systems

Key insight: Everyone's solving same problems at different scales.

## Hacker Houses

Visited friend's "hacker house":
- 12 people in 4-bedroom house
- Bunk beds in living room
- Whiteboards on every wall
- 3 startups operating from garage
- Rent: Still $6000/month

Silicon Valley housing is broken.

## The Pressure to Start Something

Every conversation:
"What are you working on?"
"PhD research in energy harvesting."
"But what's your startup?"
"I... don't have one?"
*Visible disappointment*

## Weekend Projects

Can't help but build:

### IoT Plant Monitor
- Moisture sensor + WiFi
- Tweets when thirsty
- 500 GitHub stars overnight
- "You should monetize this!"

### Parking Spot Finder
- Computer vision on phone
- Identifies empty spots
- Works 70% of time
- "This could be huge!"

Everything's a potential startup here.

## Stanford's Role

University embracing entrepreneurship:
- StartX accelerator
- Entrepreneurship courses
- Patent office hours
- "Leave of absence" normalized

Professors expect students to start companies.

## Meeting VCs

Coffee with venture capitalist (friend's connection):
"Tell me about your research."
*Explains energy harvesting*
"What's the market size?"
"Well, it's more about pushing boundaries..."
"Come back when you have customers."

Lesson learned.

## The Success Stories

Meeting Stanford entrepreneurs:
- Classmate sold company for $10M
- Lab mate's startup hiring rapidly
- Professor's spinoff going public
- Undergrad raising Series A

Success feels tangible here.

## The Failure Stories

But also:
- Roommate's friend: Failed, moving back home
- PhD student: Dropped out, startup folded
- Post-doc: Burned through savings
- Many: Living on credit cards

Survivorship bias is real.

## Cultural Observations

Silicon Valley summer insights:
1. **Everyone's optimistic** - Sometimes naively
2. **Failure celebrated** - "What did you learn?"
3. **Network > Knowledge** - Connections matter
4. **Youth favored** - Ageism visible
5. **Diversity lacking** - Working on it?

## My Research Progress

Actual PhD work:
- New antenna design: 15% more efficient
- Power management circuit: Sub-μW sleep
- First paper draft: In progress
- Advisor satisfaction: Moderate

Hard to focus with startup energy everywhere.

## The Burnout

By August, exhaustion visible:
- Coffee shop conversations repetitive
- "Disrupting" loses meaning
- Pitch fatigue sets in
- Missing pure research

Valley intensity isn't sustainable.

## Intern Exodus

End of summer:
- Google interns flood airport
- Housing prices drop slightly
- Coffee shops less crowded
- Normalcy returns briefly

Until next summer.

## Personal Reflection

First Silicon Valley summer thoughts:
1. **Entrepreneurship is infectious**
2. **Research feels slow** compared to startups
3. **Money flows freely** (if you fit pattern)
4. **Innovation is real** but hyped
5. **PhD still right choice** (I think?)

## The Dilemma

Constant internal debate:
- Continue PhD: Deep expertise, slower pace
- Join startup: Fast learning, high risk
- Start company: Ultimate challenge

Advisor's advice: "PhD first, startup later."
Valley's advice: "Why wait?"

## End of Summer

Labor Day approaching. New quarter starts soon.

Roommate's startup already pivoted twice more. Some interns return to school rich (stock). Others just tired.

I've got working energy harvester prototype. 100 microwatts from WiFi signals. Not revolutionary, but real research.

## The Balance

Learning to navigate:
- Valley ambition AND academic rigor
- Quick pivots AND deep thinking
- Network building AND focused research
- Startup culture AND PhD life

It's possible. Just exhausting.

## Conclusion

Silicon Valley summer: Where every idea is fundable, every problem is solvable, and every engineer is one pivot away from billions.

Reality is messier. But the energy, the ambition, the sheer possibility - it's addictive.

Back to research. But keeping one eye on the startup world. Because in Silicon Valley, you never know when inspiration—or investment—might strike.`,
    tags: ['silicon-valley', 'startups', 'summer', 'phd-life'],
    readTime: '13 min',
  },
  {
    date: '2011-08-15',
    title: 'Building a Quadcopter from Scratch: The PhD Version',
    summary: 'Starting fresh at Stanford means building a better quadcopter. This time with custom flight controller, advanced sensors, and actual control theory.',
    content: `With access to Stanford's resources and knowledge from senior design, I'm building a quadcopter from scratch. Not from a kit. Every component designed, every line of code written, every control loop tuned. This is the PhD version.

## Why Another Quadcopter?

Senior design quad was good, but compromises were made:
- Used Arduino (too slow for advanced control)
- Basic sensors (just IMU and GPS)
- Simple PID control (no state estimation)
- Limited payload capacity

This time: No compromises.

## The Design Philosophy

Building for research, not just flight:
- Modular architecture for experiments
- Computational power for real-time vision
- Research-grade sensors
- Data logging everything
- Over-engineer first, optimize later

## Hardware Architecture

### Flight Controller
Custom board with:
- **MCU**: STM32F427 (180 MHz, FPU)
- **IMU**: MPU-9250 + secondary ICM-20689
- **Barometer**: MS5611 (high precision)
- **GPS**: Ublox M8Q with RTK capability
- **Radio**: 915 MHz for telemetry
- **Interfaces**: CAN, I2C, SPI, UART galore

### Power System
Learned from others' mistakes:
- **Motors**: T-Motor U3 700KV (efficiency)
- **ESCs**: 40A with telemetry feedback
- **Battery**: 4S 10,000mAh (25 min hover)
- **Power Module**: Hall effect current sensing
- **Redundancy**: Dual power paths

### Companion Computer
The brain for intelligence:
- NVIDIA Jetson TX1 (just released!)
- 256 CUDA cores for vision processing
- Running ROS for modularity
- Connected via high-speed UART

## Software Stack

### Flight Controller Firmware

Real-time operating system (FreeRTOS):
\`\`\`c
void vTask_AttitudeControl(void *pvParameters) {
    TickType_t xLastWakeTime = xTaskGetTickCount();
    
    while(1) {
        // Read sensors
        IMU_GetData(&imu_data);
        
        // State estimation (EKF)
        EKF_Update(&state, &imu_data, dt);
        
        // Control law
        Control_ComputeOutputs(&state, &setpoint, &motors);
        
        // Output to motors
        Motors_SetThrust(&motors);
        
        // Maintain 500Hz update rate
        vTaskDelayUntil(&xLastWakeTime, pdMS_TO_TICKS(2));
    }
}
\`\`\`

### State Estimation

Implementing proper Extended Kalman Filter:
\`\`\`c
// EKF state vector: [position, velocity, attitude, gyro_bias, accel_bias]
// 15 states total

void EKF_Predict(ekf_t *ekf, float dt) {
    // Predict state forward
    ekf->x[0] += ekf->x[3] * dt;  // position += velocity * dt
    ekf->x[1] += ekf->x[4] * dt;
    ekf->x[2] += ekf->x[5] * dt;
    
    // Predict attitude using quaternion integration
    Quaternion_Integrate(&ekf->q, &ekf->gyro, dt);
    
    // Update covariance
    Matrix_Multiply(&ekf->F, &ekf->P, &ekf->P_temp);
    Matrix_Add(&ekf->P_temp, &ekf->Q, &ekf->P);
}
\`\`\`

### Advanced Control

Beyond basic PID:
- Cascaded loops (attitude → angular rate → motor)
- Feedforward for aggressive maneuvers
- Adaptive gains based on battery voltage
- Anti-windup protection
- Notch filters for vibration

## Sensor Fusion

Multiple sensors for robustness:
1. **Dual IMUs**: Voting for fault detection
2. **Optical flow**: Velocity without GPS
3. **Lidar**: Altitude hold and landing
4. **Computer vision**: Feature tracking

All fused in EKF for optimal estimate.

## Computer Vision Integration

Using Jetson for real-time processing:

### Visual Odometry
\`\`\`python
class VisualOdometry:
    def __init__(self):
        self.orb = cv2.ORB_create(1000)
        self.matcher = cv2.BFMatcher(cv2.NORM_HAMMING)
        
    def process_frame(self, frame):
        # Detect features
        kp, desc = self.orb.detectAndCompute(frame, None)
        
        if self.last_desc is not None:
            # Match features
            matches = self.matcher.match(self.last_desc, desc)
            
            # Estimate motion
            E, mask = cv2.findEssentialMat(pts1, pts2)
            _, R, t, _ = cv2.recoverPose(E, pts1, pts2)
            
            # Send to flight controller
            self.send_visual_update(R, t)
\`\`\`

### Object Detection
Running YOLO on Jetson:
- 10 FPS on 640x480
- Detecting people, cars, signs
- Future: Custom training for targets

## Testing and Tuning

### System Identification
Measuring actual dynamics:
- Frequency sweeps for motor response
- Step responses for control gains
- Thrust mapping vs. PWM
- Battery voltage compensation

### Control Tuning
Systematic approach:
1. Rate loops first (inner)
2. Attitude loops (middle)
3. Position loops (outer)
4. Verify stability margins
5. Test disturbance rejection

## Flight Tests

### First Hover
After weeks of preparation:
- Tethered for safety
- Slowly increase throttle
- IT FLIES! And stable!
- Only minor oscillations

### Autonomous Flights
Progressive testing:
1. Altitude hold: ±5cm precision
2. Position hold: ±10cm in wind
3. Waypoint navigation: Smooth
4. Return to home: Reliable
5. Orbit mode: Cinematic!

## Performance Metrics

Achieved specifications:
- Flight time: 28 minutes hover
- Max speed: 20 m/s
- Position accuracy: ±15cm (GPS+vision)
- Attitude precision: ±0.5°
- Update rate: 500 Hz control loop
- Telemetry: 50 Hz full state

## Crashes and Lessons

Not everything perfect:

### Crash #1: Vibration
High-frequency oscillation → structural failure
Solution: Notch filter at frame resonance

### Crash #2: GPS Glitch  
Jumped 50m instantly → aggressive correction
Solution: Innovation gating in EKF

### Crash #3: Battery Failsafe
Ignored low voltage → fell from sky
Solution: Hard landing at 3.5V/cell

## Research Applications

Platform enables research:
1. **Aggressive maneuvers**: Flips, rolls at 400°/s
2. **Multi-agent coordination**: Swarm algorithms
3. **Vision-based navigation**: GPS-denied flight
4. **Fault tolerance**: Surviving motor failures
5. **AI pilot**: Learning from demonstrations

## Open Source Release

Sharing with community:
- Hardware designs on GitHub
- Firmware fully documented
- ROS packages available
- Build instructions detailed

Already 50+ forks, 10 pull requests!

## Cost Analysis

Building research-grade quad:
- Flight controller PCB: $200
- Sensors: $150
- Frame and motors: $400
- Jetson TX1: $500
- Batteries and misc: $300
- **Total: $1,550**

Commercial equivalent: $5,000+

## Future Upgrades

Planning additions:
- RTK GPS for cm accuracy
- Thermal camera for night ops
- LTE modem for unlimited range
- Sonic sensors for indoor
- Maybe even radar?

## Community Response

Shared at Stanford Robotics Club:
- "Can you help me build one?"
- "What about adding arms?"
- "Can it deliver burritos?"

Silicon Valley priorities...

## Reflection

This quadcopter represents PhD approach:
- Deep understanding of every component
- No black boxes
- Research-grade performance
- Extensible platform
- Knowledge shared freely

From Arduino-based senior design to custom flight computer with computer vision. The learning curve is exponential.

Building robots at Stanford with unlimited resources? Living the dream. Time to make it do something nobody's done before.`,
    tags: ['quadcopter', 'robotics', 'control-systems', 'computer-vision'],
    readTime: '16 min',
  },
  {
    date: '2011-09-05',
    title: 'First Quarter as PhD Student: Classes, Research, and Survival',
    summary: 'The first quarter at Stanford begins. Graduate courses are different, research is hard, and everyone seems smarter. But slowly finding my rhythm.',
    content: `First quarter as a Stanford PhD student officially begins. The honeymoon period is over. Now it's time for the real work: graduate courses, research progress, and figuring out how to survive in this pressure cooker.

## The Course Load

Three courses for first quarter:

### EE 271: Advanced VLSI Design
Not your undergraduate digital design:
- Custom silicon layout
- Sub-threshold circuit design  
- Variation-aware design
- Tape out actual chip

Professor: "If your chip doesn't work, you fail."
No pressure.

### CS 229: Machine Learning (Ng)
The legendary course:
- 300+ students packed in
- Andrew Ng teaching personally
- Mathematical rigor intense
- Problem sets destroy weekends

Everyone says take it. Everyone's right. Everyone's also suffering.

### EE 384X: Packet Switch Architectures
How the internet actually works:
- Router architecture
- Scheduling algorithms
- Buffer management
- 100Gbps+ design challenges

Taught by Nick McKeown. Invented OpenFlow. Casual.

## Research Reality Check

First real meeting with advisor:
"Show me your progress."
*Shows energy harvesting prototype*
"This harvests 100 microwatts?"
"Yes! Up from 10!"
"We need milliwatts. Think differently."

Back to drawing board.

## The PhD Student Life

### Daily Schedule
- 6:00 AM: Wake up, gym (sanity maintenance)
- 8:00 AM: Coffee, emails, panic about deadlines
- 9:00 AM: Classes
- 12:00 PM: Free lunch seminar (survival strategy)
- 1:00 PM: Research time
- 6:00 PM: More free food
- 7:00 PM: Problem sets
- 12:00 AM: Question life choices
- 1:00 AM: Sleep (maybe)

### Office Assignment
Got desk in Gates building:
- Shared with 3 other students
- One monitor from 2003
- Chair probably violates Geneva Convention
- But it's MINE

Decorated with oscilloscope and CubeSat photo.

## The Learning Curve

### VLSI Design Pain
Drawing transistors for hours:
\`\`\`
Layout rules violated: 127
DRC clean after: 47 iterations
LVS matches after: ∞ attempts
Sanity remaining: 0
\`\`\`

Custom designing 8-bit processor. Every. Single. Transistor.

### Machine Learning Math
Problem set 1 returns:
Mean: 75/100
My score: 72/100
Below average at Stanford. Wonderful.

Study group forms immediately. Survival requires collaboration.

### Network Architecture Insights
Learning how Internet really works:
- Packets don't route themselves
- Buffers are everything
- Scheduling is NP-hard
- Internet held together by prayers

Building 4x4 packet switch in Verilog. Debugging takes days.

## Research Progress

Trying new approaches:

### Ambient RF Harvesting
- Built rectenna array
- Measured power from WiFi, cellular, TV
- Result: 250 μW peak, 50 μW average
- Still not enough

### Mechanical Vibration
- Piezoelectric harvester
- Tested on HVAC systems
- Result: 1-2 mW possible
- But not universal

### Hybrid Approach?
Maybe combining sources:
- Solar for daytime
- RF for communication
- Vibration where available
- Thermal differences?

Advisor: "Now you're thinking like a researcher."

## The Imposter Syndrome

Everyone seems smarter:
- Classmate: "I implemented this paper over weekend"
- Other classmate: "My startup just got funded"
- Lab mate: "Submitting to Nature"
- Me: "I made an LED blink with harvested energy"

Remember: Everyone feels this way. Right? RIGHT?

## Stanford Culture Observations

### The Good
- Resources truly unlimited
- Professors accessible
- Peers brilliant and helpful
- Weather still perfect
- Innovation everywhere

### The Intense  
- Competition subtle but real
- Work-life balance nonexistent
- Startup pressure constant
- Success expected
- Failure not discussed

## First Conference Submission

Advisor: "Submit to ISLPED"
Me: "But my results aren't ready"
Advisor: "They never are. Submit."

Writing first Stanford paper:
- 2 weeks of experiments
- 1 week of writing
- 3 days without sleep
- 47 draft versions
- Submitted 3 minutes before deadline

## Social Life (What's That?)

Attempts at balance:
- Friday pizza talks (work disguised as social)
- Hiking (discussing research)
- Parties (networking events)
- Dating (explaining research kills mood)

## The Valley Bubble

Living in Silicon Valley bubble:
- $8 coffee normal
- Everyone has startup idea
- Discussions about "changing world"
- Reality distortion field strong
- Easy to lose perspective

Weekend trip to Santa Cruz helps. Ocean doesn't care about your startup.

## Financial Stress

PhD stipend math:
- Monthly income: $3,166
- Rent: $1,200
- Food: $500 (cooking everything)
- Transport: $100 (bike life)
- Remaining: $1,366
- Unexpected expenses: $1,400

Credit card balance growing. Part of PhD experience?

## Health Concerns

First quarter taking toll:
- Sleep average: 5 hours
- Coffee consumption: 6 cups/day
- Exercise: Declining
- Stress level: Maximum
- Eye twitch: Constant

Counseling center busy. Not just me then.

## Small Victories

But progress exists:
- First successful chip simulation
- ML assignment finally clicked
- Router handles 1Gbps
- Energy harvester improving
- Made friends in cohort

Celebrating small wins crucial.

## Advisor Relationship

Learning to work with advisor:
- Meetings weekly (prepared or die)
- Expectations high but fair
- Pushes beyond comfort zone
- Actually cares about development
- Gives credit generously

Lucky match. Others not so fortunate.

## End of Quarter Crunch

Finals week approaches:
- VLSI chip due
- ML project due
- Network implementation due
- Research paper reviews back
- Sleep becomes legend

Everyone in survival mode. Gates building becomes home.

## Quarter Reflection

Survived first quarter. Lessons:
1. **Graduate courses are HARD**
2. **Research requires creativity**
3. **Time management crucial**
4. **Imposter syndrome normal**
5. **Support network essential**

GPA: 3.7 (B+ in ML, A- in others)
Not stellar, but survived.

## Winter Break Plans

Two weeks "off":
- Revise conference paper
- Catch up on sleep
- Visit family (explain why PhD)
- Read papers for next quarter
- Maybe actual rest?

Who am I kidding.

## Looking Ahead

Winter quarter coming:
- Quals preparation beginning
- Research direction solidifying
- Course load similar
- Experience helps (hopefully)
- Survival seems possible

## The Verdict

First quarter at Stanford: Brutal but transformative.

Every day is challenging. Every week brings growth. Every month feels like a year.

This is what I came for. This is what shapes researchers. This is the Stanford PhD experience.

Tired? Exhausted. 
Quitting? Never.
Ready for more? Somehow, yes.

Bring on winter quarter. ⚡📚💪`,
    tags: ['stanford', 'phd-life', 'courses', 'research'],
    readTime: '15 min',
  },
  {
    date: '2011-10-10',
    title: 'Steve Jobs Passes: Silicon Valley Mourns',
    summary: 'Steve Jobs died today. Stanford and Silicon Valley mourn the loss of a visionary. Reflecting on his impact and the famous Stanford commencement speech.',
    content: `Steve Jobs died today, October 5, 2011. The news spread across Stanford campus like wildfire. Classes stopped. Silicon Valley paused. We lost more than a CEO - we lost the person who showed us technology could be magical.

## The News Breaks

Walking through campus when phones started buzzing:
"Steve Jobs died."
"What?"
"CNN confirmed. Cancer."
"He was only 56."

Silence. Then quiet conversations everywhere.

## Campus Reaction

### Engineering Quad
Students gathering in small groups. Some crying. Many just standing, processing.

Someone places flowers at the Apple Store in Stanford Shopping Center. Within hours, hundreds of flowers, apples, and iPads with condolence messages.

### Computer Science Building
Professors canceling classes. Nick McKeown: "We'll discuss packet switching next week. Today, let's talk about changing the world."

Impromptu gathering in Gates. Stories shared about Jobs' visits to campus, his influence on their work.

## His Stanford Connection

Everyone sharing the 2005 commencement speech:
"Stay hungry. Stay foolish."

Watched it again. Hits different now:
- Connecting the dots
- Love and loss  
- Death

"Your time is limited, so don't waste it living someone else's life."

Sitting in my PhD cubicle, questioning everything.

## Personal Reflection

Never met him, but influenced by him:
- First computer: Mac Classic in 1992
- Learned to code: HyperCard
- First smartphone: iPhone
- Daily tools: MacBook Pro

More than products - he showed technology could be beautiful.

## Silicon Valley Mourns

### Apple Stores
Palo Alto store becomes shrine. Thousands visiting. Leaving flowers, notes, old Apple products.

Security guards crying. Employees hugging customers. Never seen anything like it.

### Company Responses
- Google: Homepage tribute
- Facebook: Flags at half-staff
- Microsoft: Sincere condolences
- Samsung: Full-page newspaper ad

Even competitors acknowledging the loss.

## The Legend

Stories circulating:
- Perfectionism (reality distortion field)
- Simplicity obsession
- "One more thing"
- Brutal honesty
- Incredible comebacks

Not all positive, but all impactful.

## Stanford Students React

Overheard conversations:

"He dropped out of college and changed the world."
"Should we all drop out?"
"He also got fired from Apple."
"And came back stronger."

The entrepreneurial spirit amplified.

## Technical Legacy

In EE department, discussing his technical impact:
- Personal computing revolution
- Digital music transformation
- Smartphone era begun
- Tablet computing defined
- Ecosystem thinking

Not inventor, but perfector. Made technology human.

## The Products That Changed Everything

My generation's timeline:
- Apple II: Before my time, but started it all
- Macintosh: First computer with personality
- iMac: Computers could be beautiful
- iPod: 1,000 songs in pocket
- iPhone: Everything device
- iPad: Post-PC era

Each revolutionary in its way.

## Lessons for Engineers

What he taught us:
1. **Design matters** - Not just function
2. **Simplicity is hard** - But worth it
3. **Integration wins** - Hardware + software
4. **Details count** - Obsess over them
5. **Vision essential** - See what others don't

## The Startup Impact

Every Silicon Valley startup influenced:
- Product presentations mimicked
- "Design thinking" everywhere
- User experience prioritized
- "What would Steve do?"
- Black turtleneck sales increase

His shadow over everything.

## Research Lab Discussion

In lab meeting, advisor asks: "What can we learn?"

Responses:
- "Focus on impact, not papers"
- "Make technology accessible"
- "Perfect is enemy of good, except when it's not"
- "Marketing matters for research too"
- "Change the world sounds cliché until someone does"

## The Human Side

Behind the legend:
- Adopted child made good
- Cancer fighter
- Father and husband
- Buddhist influences
- Complicated person

Reminder: Heroes are human.

## My iPhone Moment

Looking at my iPhone 4. Remembering first iPhone launch:
- Lines around block
- "Internet in your pocket!"
- Pinch to zoom magic
- App Store revolution

This device changed everything. One person's vision.

## The Future Without Jobs

Questions everywhere:
- Can Apple continue?
- Who's the next visionary?
- Is the era ending?
- What would he build next?

No answers. Just uncertainty.

## A Personal Decision

His Stanford speech echoing:
"Don't settle."
"Follow your heart."
"Stay hungry."

Am I settling in PhD? Following my heart? Hungry enough?

Time for honest reflection.

## The Vigil

Evening at Apple Store Palo Alto. Hundreds gathered. Candles, flowers, iPads with "Thank You Steve" messages.

Strangers sharing stories:
- "First Mac changed my life"
- "iPhone helped me start my company"
- "iPad let my grandma video chat"

Technology as human connection.

## Media Coverage

Every outlet covering:
- CNN: Breaking news all day
- Tech blogs: Retrospectives
- International: Global mourning
- Social media: #ThankYouSteve trending

Rare unanimous appreciation.

## The Stanford Legacy

University response:
- Flags lowered
- Memorial planned
- Entrepreneurship programs expanded
- Innovation emphasized more

His spirit embedded here.

## One Week Later

Life continues but changed:
- Apple stock volatile
- Biography pre-orders soaring
- Documentary plans announced
- Everyone asking "what's next?"

But also:
- More students starting companies
- Design classes overflowing
- Risk-taking encouraged
- Dreams seem possible

## The Lesson

Steve Jobs showed us:
- Vision matters
- Execution crucial
- Perfection possible
- Change achievable
- Life short

"Stay hungry. Stay foolish."

We will, Steve. We will.

Rest in peace. Thank you for the magic. 🍎

*Sent from my iPhone*`,
    tags: ['steve-jobs', 'silicon-valley', 'reflection', 'stanford'],
    readTime: '12 min',
  },
  {
    date: '2011-10-25',
    title: 'Halloween Hack 2.0: Distributed Scare Network',
    summary: 'Upgrading last year\'s Halloween project with mesh networking, machine learning, and coordinated scares. Because PhD students need hobbies too.',
    content: `Last year's Halloween hack was a hit at UB. This year, with Stanford resources and Silicon Valley ambition, I'm building a distributed scare network. Multiple nodes, mesh networking, and ML-based scare optimization. Way over-engineered? Absolutely.

## The Concept

Instead of one scare point:
- 5 sensor nodes around yard
- Mesh network communication
- Central brain coordinates
- Synchronized multi-point scares
- Machine learning for optimization

Because scaring trick-or-treaters should be data-driven.

## Hardware Architecture

### Sensor Nodes
Each node contains:
- ESP8266 (WiFi mesh capable)
- PIR motion sensor
- Ultrasonic rangefinder
- Temperature sensor (why not?)
- RGB LED status indicator
- Battery powered (18650 cell)

Cost per node: $15. WiFi MCUs are amazing now.

### Scare Actuators
Distributed around yard:
- Compressed air cannons
- Servo-powered props
- Strobe lights
- Spatial audio (4 speakers)
- Fog machine (network controlled!)

### Central Controller
Raspberry Pi 2 running:
- Mesh network coordinator
- TensorFlow Lite for predictions
- Node-RED for logic
- Web interface for monitoring

## Mesh Networking

Using ESP-MESH protocol:
\`\`\`cpp
void setupMesh() {
    mesh.setDebugMsgTypes(ERROR | STARTUP);
    mesh.init(MESH_PREFIX, MESH_PASSWORD, &scheduler, MESH_PORT);
    mesh.onReceive(&receivedCallback);
    mesh.onNewConnection(&newConnectionCallback);
}

void receivedCallback(uint32_t from, String &msg) {
    // Parse sensor data
    StaticJsonDocument<200> doc;
    deserializeJson(doc, msg);
    
    float distance = doc["distance"];
    bool motion = doc["motion"];
    
    // Update central model
    updateTargetModel(from, distance, motion);
}
\`\`\`

Self-healing network. If node dies, others route around.

## Machine Learning Component

Training scare effectiveness model:

### Data Collection
From last year + testing:
- Distance to target
- Approach speed
- Group size
- Time since last scare
- Scare type used
- Reaction score (manual from video)

### Model Architecture
Simple neural network in TensorFlow:
\`\`\`python
model = tf.keras.Sequential([
    tf.keras.layers.Dense(16, activation='relu', input_shape=(5,)),
    tf.keras.layers.Dense(8, activation='relu'),
    tf.keras.layers.Dense(4, activation='softmax')  # 4 scare types
])
\`\`\`

Outputs probability distribution over scare types.

### Edge Deployment
Converted to TensorFlow Lite, runs on Pi:
- Inference time: 5ms
- RAM usage: 50KB
- Predicts optimal scare type in real-time

## Coordination Algorithm

The magic is synchronized scares:

\`\`\`python
class ScareCoordinator:
    def __init__(self):
        self.nodes = {}
        self.last_scare = 0
        self.cooldown = 15  # seconds
        
    def update_node(self, node_id, data):
        self.nodes[node_id] = {
            'distance': data['distance'],
            'motion': data['motion'],
            'timestamp': time.time()
        }
        
        if self.should_trigger_scare():
            self.execute_scare_sequence()
    
    def should_trigger_scare(self):
        # Check all nodes for target
        targets = [n for n in self.nodes.values() 
                  if n['motion'] and n['distance'] < 3.0]
        
        # Multiple nodes see target = group
        if len(targets) >= 2:
            return time.time() - self.last_scare > self.cooldown
            
        return False
    
    def execute_scare_sequence(self):
        # ML model predicts best scare
        scare_type = self.model.predict(self.get_features())
        
        # Coordinate nodes
        if scare_type == 'surround':
            self.surround_scare()
        elif scare_type == 'chase':
            self.chase_scare()
        # etc...
\`\`\`

## Scare Patterns

### 1. The Surround
- Detect approach on path
- Wait until centered
- Activate all nodes simultaneously
- Fog + strobes + sound
- No escape!

### 2. The Chase
- Trigger nodes sequentially
- Creates illusion of following
- Increasing intensity
- Culminates at candy bowl

### 3. The Fake-Out
- Initial small scare
- Victim relaxes
- THEN the big scare
- Psychological warfare

### 4. The Ambush
- All quiet on approach
- Sudden activation at optimal distance
- Maximum startle response

## Web Interface

Real-time monitoring dashboard:
- Node status (battery, connectivity)
- Heat map of activity
- Scare effectiveness scores
- Manual override controls
- Live video feeds

Built with Socket.io for real-time updates.

## Safety Improvements

Learned from last year:
- Pressure-sensitive mat (no scaring toddlers)
- "Scary" vs "Friendly" hours
- Emergency stop button (big red)
- Warning signs (with QR code to project page)
- Parental approval detection (adults only mode)

## Power Management

Battery-powered nodes require efficiency:
\`\`\`cpp
void loop() {
    if (detectMotion()) {
        // Wake up
        WiFi.begin();
        
        // Send data
        mesh.sendBroadcast(getSensorData());
        
        // Sleep again
        ESP.deepSleep(30e6);  // 30 seconds
    }
    
    // Ultra low power between checks
    ESP.deepSleep(1e6);  // 1 second
}
\`\`\`

Nodes last full night on single 18650 cell.

## Testing With Volunteers

Stanford students make great guinea pigs:
- "For science!"
- Recorded reactions
- Gathered feedback
- Optimized timing
- Achieved 85% scream rate

## Halloween Night Results

### Statistics
- Visitors: 127
- Successful scares: 98 (77%)
- Candy dropped: 15 bags
- Compliments: 47
- Complaints: 0
- "Best house ever": 12

### ML Model Performance
- Correctly predicted effective scares: 71%
- Adapted to crowd patterns
- Learned to identify repeat visitors
- Optimized for maximum reactions

### Technical Performance
- Zero node failures
- Mesh network stable
- 50ms average latency
- 8-hour battery life achieved

## Neighbor Reactions

Mixed but mostly positive:
- "The MIT of Halloween houses"
- "My kids loved it!"
- "Maybe too scary?" (added warning sign)
- "Can you install at my house?"

One job offer from impressed parent at Google.

## Lessons Learned

1. **Over-engineering is fun** - But know your audience
2. **Test on willing subjects** - Not unsuspecting children
3. **Have non-scary option** - Some kids just want candy
4. **Document everything** - Paper potential?
5. **Mesh networks rock** - ESP8266 is incredible

## Code Release

Open sourced on GitHub:
- Full node firmware
- Coordinator software
- ML training notebook
- Hardware designs
- Safety guidelines

Already forked for Christmas lights!

## Media Coverage

Unexpected attention:
- Stanford Daily article
- Hackaday feature (again!)
- Local news segment
- IEEE Spectrum mention

"Stanford PhD Student Brings Machine Learning to Halloween"

## Cost Analysis

- ESP8266 nodes: $75
- Raspberry Pi: $35
- Props and actuators: $100  
- Fog machine: $40
- Development time: 60 hours
- **Total: $250**

Scaring efficiently: Priceless.

## Future Improvements

For next year (if I have time):
- Computer vision for demographic detection
- Drone integration (flying scares!)
- Haptic feedback path
- Social media integration
- Scare effectiveness API

## Reflection

Building silly projects keeps me sane during PhD stress. Plus:
- Practiced mesh networking
- Deployed edge ML
- Made kids happy(?)
- Met neighbors
- Remembered engineering is fun

Not every project needs to change the world. Sometimes it just needs to make Halloween awesome.

Happy Halloween from Stanford! 🎃👻🤖`,
    tags: ['halloween', 'mesh-networking', 'machine-learning', 'iot'],
    readTime: '14 min',
  },
  {
    date: '2011-11-15',
    title: 'The Raspberry Pi Arrives: $35 Computer Changes Everything',
    summary: 'Got my hands on one of the first Raspberry Pi boards. This $35 computer is going to democratize computing and launch a million projects.',
    content: `Through a connection at Cambridge, I got early access to a Raspberry Pi Model B. This credit-card sized computer costs $35 and runs Linux. It's going to change everything about computer education and embedded projects.

## First Impressions

Opening the anti-static bag:
- Tiny! Credit card sized
- Feels substantial despite size
- That beautiful BCM2835 SoC
- GPIO pins calling to me
- Smells like revolution

## Specifications

What $35 gets you:
- 700 MHz ARM11
- 256 MB RAM (Model A has 128MB)
- HDMI output
- 2x USB ports
- Ethernet
- SD card storage
- GPIO pins!

Not powerful, but powerful enough.

## First Boot

Moment of truth:
1. Write Debian image to SD card
2. Connect HDMI, keyboard, power
3. Red LED lights up
4. Boot messages scroll by
5. Linux prompt appears!

Full computer for $35. Still can't believe it.

## Benchmarking

Let's see what it can do:
\`\`\`bash
$ cat /proc/cpuinfo
Processor : ARMv6-compatible processor rev 7 (v6l)
BogoMIPS : 697.95

$ free -m
             total  used  free
Mem:          186    38   148

$ hdparm -tT /dev/mmcblk0
Timing cached reads: 188 MB in 2.00 seconds = 93.96 MB/sec
Timing buffered disk reads: 60 MB in 3.06 seconds = 19.62 MB/sec
\`\`\`

Not fast, but usable!

## GPIO Exploration

The killer feature - 26 GPIO pins:
\`\`\`python
import RPi.GPIO as GPIO
import time

GPIO.setmode(GPIO.BCM)
GPIO.setup(18, GPIO.OUT)

# Blink LED
for i in range(10):
    GPIO.output(18, GPIO.HIGH)
    time.sleep(0.5)
    GPIO.output(18, GPIO.LOW)
    time.sleep(0.5)
\`\`\`

Python libraries already available. Amazing community.

## Performance Tests

### Web Server
Installed nginx:
- Serves static pages fine
- PHP works but slow
- Could handle small site

### Desktop Environment  
LXDE runs... eventually:
- Takes 45 seconds to load
- Browsing painful but possible
- Youtube? Don't even try

### Compilation
Compiling hello world:
\`\`\`bash
$ time gcc hello.c -o hello
real    0m2.847s
\`\`\`

Slower than my laptop but totally workable.

## First Real Project: PiCam Security System

Built in an afternoon:

### Hardware
- RPi Model B
- USB webcam
- PIR motion sensor
- LED indicator

### Software
\`\`\`python
#!/usr/bin/env python
import RPi.GPIO as GPIO
import subprocess
import datetime
import time

PIR_PIN = 23
LED_PIN = 24

GPIO.setmode(GPIO.BCM)
GPIO.setup(PIR_PIN, GPIO.IN)
GPIO.setup(LED_PIN, GPIO.OUT)

def capture_image():
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    filename = f"capture_{timestamp}.jpg"
    subprocess.call(["fswebcam", "-r", "640x480", filename])
    return filename

def motion_detected(channel):
    GPIO.output(LED_PIN, GPIO.HIGH)
    print(f"Motion detected at {datetime.datetime.now()}")
    
    filename = capture_image()
    print(f"Image saved: {filename}")
    
    time.sleep(5)  # Cooldown
    GPIO.output(LED_PIN, GPIO.LOW)

GPIO.add_event_detect(PIR_PIN, GPIO.RISING, 
                      callback=motion_detected,
                      bouncetime=300)

print("PiCam Security System Active")
print("Press Ctrl+C to exit")

try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    GPIO.cleanup()
\`\`\`

Total cost: $50. Works perfectly!

## Educational Impact

This will revolutionize CS education:
- Every student can have one
- Real computer, not microcontroller
- Learn Linux, programming, hardware
- GPIO bridges physical world

Already planning workshop for local school.

## Community Response

Forums exploding:
- "What should I build first?"
- "Can it run Minecraft?" (Barely)
- "Cluster of 64 Pis?"
- "Media center for parents?"
- "Robot brain upgrade!"

Everyone has ideas.

## Comparison Shopping

What else $35 buys:
- 0.5 Arduino Unos
- 0.1 BeagleBone
- 2 movie tickets
- 5 Starbucks coffees
- ∞ learning potential

No competition really.

## Limitations Discovered

Being honest:
- SD card corruption common
- Power supply critical (needs 1A)
- USB power limited
- No analog inputs
- Heat can be issue

But for $35? Minor complaints.

## Project Ideas Brewing

My growing list:
1. Cluster computing teaching tool
2. Software defined radio platform
3. Home automation hub
4. Retro gaming console
5. Weather station network
6. Quadcopter brain upgrade
7. Distributed sensor mesh
8. Machine learning edge node

Too many ideas, not enough time.

## The Bigger Picture

Why this matters:
- Democratizes computing
- Enables makers worldwide
- Educational game-changer
- IoT development platform
- Spark for innovation

Wozniak would be proud.

## Ordering More

Immediately ordered 5 more:
- One for each project
- Gifts for maker friends
- Backup (SD cards die)
- Because I can

Limit 1 per person currently. Demand insane.

## Teaching Opportunity

Planning Stanford workshop:
"Intro to Physical Computing with Raspberry Pi"
- Basic Linux
- Python programming
- GPIO control
- Simple projects

Making computing accessible.

## Industry Impact

This will disrupt:
- Educational computing
- Embedded systems
- IoT development
- Prototype market
- Maybe everything?

At $35, why not put computer in everything?

## One Month Later

Built so far:
- Security camera
- Temperature logger
- Spotify player
- VPN server
- Retro game emulator

Still have 3 boards left!

## The Philosophy

Eben Upton's vision:
- Affordable computing
- Inspire next generation
- Learn by doing
- No black boxes

Same philosophy as open source movement.

## Global Impact

Thinking bigger:
- Developing world education
- Research on budget
- Startup enabler
- Creativity democratizer

This little board could change lives.

## Personal Reflection

The Raspberry Pi represents everything I love about engineering:
- Elegant simplicity
- Incredible capability
- Accessible to all
- Community-driven
- Endless possibilities

It's not the fastest computer. It's not the most capable. But at $35, it might be the most important.

## Future Predictions

In 5 years:
- Pi in every classroom
- Millions of makers enabled
- New generation of programmers
- IoT explosion
- Version 2, 3, 4...

The revolution starts with a $35 computer.

## Conclusion

Holding this tiny board, I see the future of computing. Not in expensive workstations or locked-down tablets, but in accessible, hackable, affordable computers that anyone can program.

The Raspberry Pi isn't just a product. It's a movement. And I'm all in.

Time to order more SD cards... 🥧`,
    tags: ['raspberry-pi', 'single-board-computer', 'education', 'makers'],
    readTime: '13 min',
  },
  {
    date: '2011-12-20',
    title: 'Year in Review: From CubeSat to Stanford PhD',
    summary: 'Reflecting on 2011 - launched a satellite, graduated college, started PhD at Stanford, and discovered Silicon Valley. What a journey.',
    content: `As 2011 draws to a close, I'm sitting in my Stanford office at midnight (as usual), reflecting on what might be the most transformative year of my life. From launching a satellite to starting a PhD, this year changed everything.

## Major Milestones

### January - Senior Spring
Started the year at UB:
- Senior design quadcopter
- Grad school applications pending
- CubeSat integration crunch
- Last semester with friends

Seemed busy then. Cute in retrospect.

### February - Acceptance
Stanford acceptance changed trajectory:
- Dream school said yes
- California adventure awaiting
- Imposter syndrome beginning
- Future suddenly different

Still have the acceptance email starred.

### March - First Conference
ICASSP in Prague:
- First international presentation
- Acoustic localization paper
- Networking with researchers
- Confidence boost needed

Learned I could play with the big kids.

### May - Graduation
Four years at UB complete:
- BS in Electrical Engineering
- Magna Cum Laude
- Satellite builder
- California bound

Walked across stage. Parents cried. I might have too.

### May - Cross Country
3,000 miles to new life:
- Car packed with oscilloscopes
- Desert, mountains, dreams
- Arrived at Stanford
- New chapter begins

That drive was meditation and transition.

### July - Space Success
CubeSat launched successfully:
- Three years of work
- Reached orbit safely
- Communicated from space
- Team achievement unlocked

Watching our satellite launch = career highlight.

### September - PhD Begins
Stanford life starts:
- Classes harder than expected
- Research direction unclear
- Silicon Valley culture shock
- Learning constantly

The deep end of the pool.

### October - Jobs Passes
Silicon Valley mourns:
- Steve Jobs dies
- Industry reflects
- Innovation inspiration
- "Stay hungry, stay foolish"

His Stanford speech hits different as student here.

### November - Building Again
Never stop making:
- Halloween mesh network
- Quadcopter 2.0
- Raspberry Pi experiments
- Research slowly progressing

Building things keeps me grounded.

## Technical Growth

### Skills Acquired
This year's learning:
- **VLSI Design**: Drawing transistors
- **Machine Learning**: Math intensity
- **Mesh Networking**: Distributed systems
- **Energy Harvesting**: Physics limits
- **Research Process**: Papers and pain

### Projects Completed
Built this year:
- CubeSat (launched!)
- SDR from scratch
- Autonomous quadcopter
- Halloween scare network
- Various energy harvesters
- Too many failed experiments

Failure teaches most.

### Papers Published
- ICASSP acoustic localization
- ISLPED submission (pending)
- CubeSat lessons learned (writing)

Publishing is harder than building.

## Personal Evolution

### From Buffalo
Small town kid → Silicon Valley researcher
- Comfortable → Challenged daily
- Big fish → Tiny minnow
- Undergrad confidence → PhD humility
- Regional view → Global perspective

Growth requires discomfort.

### Mindset Shifts
- "Building for fun" → "Building for impact"
- "Good enough" → "Push the boundary"
- "I know things" → "I know nothing"
- "Fear failure" → "Fail faster"

Stanford changes you.

### Life Lessons
2011 taught me:
1. **Dream big** - They might say yes
2. **Ship it** - Perfect is enemy of done
3. **Ask questions** - Everyone's learning
4. **Network matters** - But substance more
5. **Health first** - Burnout helps nobody

## Silicon Valley Observations

Living here 6 months:
- **Innovation everywhere** - But hype too
- **Money flows** - To specific patterns
- **Failure accepted** - If you learn
- **Network effects** - Real and powerful
- **Reality distortion** - Stay grounded

It's simultaneously inspiring and exhausting.

## Challenges Faced

### Academic
- Imposter syndrome constant
- Course difficulty shocking
- Research progress slow
- Time management failing
- Stress levels maximal

PhD is supposed to be hard. It is.

### Personal
- 3,000 miles from family
- Making new friends at 22
- Dating? What's that?
- Financial stress real
- Work-life balance mythical

Growing pains necessary.

### Technical
- Energy harvesting stubborn
- Physics has limits
- Theory meets reality
- Complexity overwhelming
- Progress non-linear

Research is humbling.

## Gratitude List

People who made this year possible:
- **Parents**: Unwavering support
- **UB Professors**: Foundation builders
- **CubeSat Team**: Dream achievers
- **Stanford Advisor**: Patient guide
- **New Friends**: Sanity savers

Success requires community.

## Looking Ahead to 2012

### Q1 Goals
- Pass qualifying exams
- Submit ISLPED paper
- Energy harvesting breakthrough?
- Maintain health
- Visit home

### Year Goals
- Define thesis direction
- Publish 2 papers
- Build something impactful
- Teach a course
- Stay hungry

### Life Goals
- PhD in 4 years (aggressive)
- Technical leadership
- Start company?
- Space involvement
- Change world (cliché but sincere)

## By the Numbers

2011 statistics:
- Miles moved: 3,000
- Satellites launched: 1
- Papers published: 1
- All-nighters: ~50
- Coffee consumed: ~1,500 cups
- New friends made: Dozens
- Life changed: Completely

## The Transformation

January 2011 Mike:
- Undergraduate at UB
- Building for fun
- Regional perspective
- Confident in knowledge

December 2011 Mike:
- PhD student at Stanford
- Building for impact
- Global perspective
- Humbled by ignorance

Same person, different world.

## Late Night Thoughts

It's 1 AM. Lab is quiet. Silicon Valley lights twinkle outside. Oscilloscope hums beside me. Energy harvester shows 400 microwatts. Progress.

A year ago, I was debugging CubeSat firmware in Buffalo snow. Now I'm pushing physics boundaries in California sunshine. Life moves fast when you say yes to opportunities.

## The Journey

2011 was about transitions:
- Student → Researcher
- Builder → Scholar
- Follower → Leader
- Dreamer → Doer

Each transition painful but necessary.

## Closing Reflection

This year launched more than satellites. It launched a new chapter of life. From Buffalo winters to Stanford palm trees. From undergraduate projects to PhD research. From comfortable to challenged.

The CubeSat reaching orbit proved dreams can fly. Stanford acceptance proved hard work pays off. Silicon Valley proved innovation thrives on ambition.

2012 will bring new challenges. Qualifying exams. Research struggles. Paper rejections. Silicon Valley pressures.

But also: Knowledge. Growth. Impact. Community. Purpose.

As Jobs said at Stanford: "Stay hungry. Stay foolish."

After this year, I'm hungrier than ever. And just foolish enough to believe I can make a difference.

Here's to 2011 - the year everything changed.
Here's to 2012 - the year we build on it.

Happy New Year from Stanford! 🎊🚀📚`,
    tags: ['year-review', 'reflection', 'stanford', 'personal'],
    readTime: '14 min',
  },
];

// Function to generate blog post files
async function generateBlogPosts() {
  console.log('🚀 Starting blog post generation for 2011 batch 2...\n');
  
  for (const post of posts2011Batch2) {
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
  console.log(`   Created: ${posts2011Batch2.length} posts`);
  console.log(`   Year: 2011`);
  console.log(`   Topics: Stanford orientation, CubeSat launch, Silicon Valley summer, quadcopter 2.0, first quarter, Steve Jobs, Halloween mesh, Raspberry Pi, year review`);
}

// Run the generator
generateBlogPosts().catch(console.error);