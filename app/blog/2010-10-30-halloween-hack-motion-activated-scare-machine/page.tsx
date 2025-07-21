import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="2010-10-31"
      title="Halloween Hack: Motion-Activated Scare Machine"
      summary="Built an over-engineered Halloween prop that terrorizes trick-or-treaters. PIR sensors, servo motors, and psychological timing create maximum scares."
      content={`Halloween is the perfect excuse to build unnecessary electronics. This year's project: a motion-activated scare machine that's claimed several bags of dropped candy.

## The Concept

Simple goal: Detect approaching trick-or-treaters and scare them at the optimal moment. The engineering challenge: making it reliable, weather-resistant, and genuinely startling.

## System Architecture

### Sensors
- 3 PIR motion sensors (staged detection zones)
- Ultrasonic rangefinder (precise triggering)
- Ambient light sensor (dusk activation)
- Sound level meter (detect footsteps)

### Actuators
- High-torque servo (props jump out)
- Compressed air solenoid (air blast)
- LED spotlights (strobing)
- 20W audio amplifier (screams)

### Brain
- Arduino Mega (lots of I/O needed)
- SD card (sound storage)
- RTC module (timed behaviors)
- XBee (remote monitoring)

## Detection Algorithm

Multi-stage presence detection:

\`\`\`c
typedef enum {
    WAITING,
    DETECTED_FAR,
    APPROACHING,
    IN_RANGE,
    TRIGGERED,
    COOLDOWN
} ScarState;

void updateDetection() {
    if (state == WAITING && pirFar.detected()) {
        state = DETECTED_FAR;
        startTracking();
    }
    
    if (state == DETECTED_FAR && pirMid.detected()) {
        state = APPROACHING;
        calculateSpeed();
    }
    
    if (state == APPROACHING && 
        ultrasonicRange() < TRIGGER_DISTANCE) {
        state = IN_RANGE;
        armScare();
    }
    
    if (state == IN_RANGE && perfectTiming()) {
        SCARE_THEM();
        state = TRIGGERED;
    }
}
\`\`\`

## Scare Sequence

Carefully orchestrated for maximum effect:

1. **T-0.5s**: Kill porch light (darkness)
2. **T+0s**: Trigger servo (physical motion)
3. **T+0.1s**: Strobe lights (disorientation)
4. **T+0.2s**: Compressed air (physical sensation)
5. **T+0.3s**: Play scream (auditory assault)
6. **T+2s**: Return to normal (relief)

## Sound Design

Created custom horror sounds:
- Recorded actual screams (me, after seeing the electricity bill)
- Pitched down for demonic effect
- Layered with mechanical noises
- Random selection prevents habituation

## Weatherproofing

Halloween means potential rain:
- Conformal coating on PCBs
- Sealed enclosures (IP65)
- Moisture sensors for safety cutoff
- Drainage channels in housing

## Power Management

Running all night requires efficiency:
- Sleep modes between triggers
- PWM for LED dimming
- Servo power only when needed
- Total consumption: 2W idle, 50W active

## Psychological Optimization

Studied scare effectiveness:
- **Anticipation**: Subtle cues something's wrong
- **Startle**: Sudden activation
- **Uncanny valley**: Almost-human movements
- **Recovery time**: 30 seconds between scares

## Safety Features

Don't want lawsuits:
- Motion stops if resistance detected
- Air pressure limited to safe levels
- Emergency stop button
- Warning sign (small, per Halloween tradition)

## Testing Results

First deployment statistics:
- Successful scares: 47
- Candy bags dropped: 12
- Parents scared: 15
- Complaints: 0 (surprisingly)
- "That's awesome!": 23

## Failure Modes

Not everything went perfectly:
- Cat triggered it repeatedly
- Servo stripped gears on adult
- Speaker distortion at max volume
- One kid tried to steal it

## Iterative Improvements

Based on field testing:
- Added pet immunity to PIR
- Reinforced mechanical parts
- Implemented volume limiting
- GPS tracker (seriously)

## Code Highlights

### Adaptive Timing
\`\`\`c
// Learn optimal trigger distance based on walking speed
void calculateTriggerPoint() {
    float speed = getApproachSpeed();
    float reactionTime = 0.5;  // seconds
    triggerDistance = speed * reactionTime + PROP_DISTANCE;
}
\`\`\`

### Random Variations
\`\`\`c
// Prevent pattern recognition
void randomizeScare() {
    scareDelay = random(0, 200);  // ms
    soundIndex = random(0, NUM_SOUNDS);
    strobePattern = random(0, NUM_PATTERNS);
    servoSpeed = random(80, 100);  // percentage
}
\`\`\`

## Best Reactions

Memorable moments:
1. Teenager acted tough, screamed the loudest
2. Dad carrying toddler - protected kid, sacrificed dignity
3. Group approached together - domino effect of fear
4. One kid came back three times
5. Delivery person... sorry about that

## Neighbor Relations

Pre-emptive diplomacy:
- Warned adjacent houses
- Offered "safe" hours for young kids
- Shared videos of scares
- Nobody complained!

## Future Enhancements

Ideas for next year:
- Machine learning for scare optimization
- Multiple synchronized props
- Fog machine integration
- Projection mapping
- Heart rate detection for feedback

## Cost Breakdown

- Arduino and shields: $60
- Sensors: $40
- Servo and mechanics: $50
- Audio system: $30
- Compressed air: $40
- Enclosures and misc: $30
- **Total: $250**
- Scaring children: Priceless

## Lessons Learned

1. **Test on adults first** - Kids are unpredictable
2. **Weather happens** - Design for it
3. **Batteries die** - Have backups
4. **Document build** - For next year
5. **Video everything** - Best reactions are fleeting

## Ethical Considerations

Is it wrong to scare children with engineering?
- They came to my house
- On Halloween
- Expecting scares
- I'm providing a service!

## Conclusion

This project combined sensor fusion, mechanical design, psychology, and embedded systems. It's engineering applied to pure entertainment.

The best part? Hearing kids tell their friends "You HAVE to go to the house with the crazy robot!" Mission accomplished.

Already planning next year's upgrade. Thinking about adding computer vision for facial expression analysis. Too much?

Happy Halloween from your friendly neighborhood mad scientist!`}
      tags={["halloween","sensors","automation","projects"]}
      readTime="14 min"
    />
  );
}

export function generateMetadata() {
  return {
    title: "Halloween Hack: Motion-Activated Scare Machine - Michael D'Angelo",
    description: "Built an over-engineered Halloween prop that terrorizes trick-or-treaters. PIR sensors, servo motors, and psychological timing create maximum scares.",
  };
}