import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="2011-05-15"
      title="Senior Design Demo Day: The Final Presentation"
      summary="Today we demonstrated our autonomous quadcopter to judges, professors, and industry representatives. Everything that could go wrong did. We still won second place."
      content={`Senior Design Demo Day - the culmination of two semesters of work. Our autonomous search-and-rescue quadcopter was ready (mostly). The demo gods, however, had other plans. Here's how we turned disaster into second place.

## The Setup

Buffalo's Center for the Arts, 8 AM:
- 15 teams presenting
- Industry judges arriving
- Parents with cameras
- Our quadcopter in pieces

Last night's "final test" revealed motor mount crack.

## Emergency Repairs

### 7:00 AM - Problem Discovery
Motor mount fracture. No flight without fix.

### 7:30 AM - Hardware Store Run
Bought entire aisle of epoxy.

### 8:00 AM - Field Surgery
Team roles:
- Jake: Mixing epoxy
- Sarah: Holding pieces
- Ahmed: Hair dryer for curing
- Me: Praying

### 8:45 AM - Test Hover
It flies! Sort of. Vibration concerning.

"It'll hold for demo," Sarah says.
Narrator: It would not.

## The Presentation Slot

### 10:30 AM - Our Turn
Judges approach. Deep breaths.

"Tell us about your project."

The pitch:
- Autonomous search and rescue
- Computer vision for victim detection
- GPS waypoint navigation
- Return-to-home on battery low
- $1,200 budget

Judges intrigued.

## Demo Attempt #1

"Let's see it fly."

Power on. Motors spin. Liftoff!

Two feet up: CRACK.

Motor mount fails. Quadcopter tilts.
Emergency kill switch. Crash landing.

Silence.

"Well, that's unfortunate," judge says.

## The Recovery

### Quick Assessment
- Motor mount completely separated
- No structural damage
- Electronics intact
- 20 minutes until next slot

### Team Huddle
"We can fix this."
"With what?"
"Zip ties and hope."

### MacGyver Mode
- Zip ties as motor mount
- Duct tape reinforcement
- Weight rebalancing
- Code adjustment for vibration

## Demo Attempt #2

### 11:00 AM - Second Chance
Judges return, skeptical.

"Ready to try again?"

Power on. Gentler throttle.
It rises. It hovers. IT'S STABLE!

"Now show autonomous features."

## The Working Demo

### GPS Hold
Flip switch. Quadcopter locks position.
Wind gust. Compensates perfectly.
Judges nod approvingly.

### Obstacle Detection
Ultrasonic sensors working.
Approaches wall, stops, hovers.
"Impressive reaction time."

### Vision System
Red blanket on ground (victim).
Camera feed on laptop.
"TARGET DETECTED" overlay appears.
Quadcopter descends, hovers over target.

### Return to Home
Battery warning triggered.
Autonomous flight back.
Perfect landing at start point.

Applause!

## Technical Deep Dive for Judges

Explained our innovations:

### Control System
\`\`\`cpp
// Cascaded PID with feedforward
attitude_error = desired_attitude - current_attitude;
rate_command = kp_att * attitude_error + 
               kd_att * (attitude_error - last_error) +
               feedforward_rate;

rate_error = rate_command - current_rate;
motor_command = kp_rate * rate_error + 
                ki_rate * integral_rate_error +
                kd_rate * rate_derivative;
\`\`\`

### Vision Processing
\`\`\`python
# Real-time victim detection
def detect_victim(frame):
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
    
    # Red color threshold
    mask = cv2.inRange(hsv, lower_red, upper_red)
    
    # Morphological ops
    kernel = np.ones((5,5), np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
    
    # Find contours
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL)
    
    # Largest red blob = victim
    if contours:
        victim = max(contours, key=cv2.contourArea)
        return cv2.boundingRect(victim)
\`\`\`

Judges asking technical questions. Good sign!

## Other Teams' Projects

Tough competition:
- Solar panel optimizer (winner)
- Prosthetic hand controller
- Water quality monitor
- Smart traffic system
- Gesture-controlled wheelchair

All impressive. Winning uncertain.

## The Waiting

Judges deliberating. Teams nervous.
Replaying demo in heads.
"Should have used Loctite."
"Zip ties saved us."
"Did you see judge smile?"

## Results Announcement

### Third Place
"Smart Traffic Management System"

### Second Place
"Autonomous Search and Rescue Quadcopter"

WE PLACED! Despite catastrophic failure!

### First Place
"Maximum Power Point Tracking for Solar Arrays"
(Deserved. Thing was flawless.)

## Judges' Feedback

What they liked:
- Recovery from failure
- Technical complexity
- Real-world application
- Team problem-solving
- Working computer vision

What needs improvement:
- Mechanical robustness (obviously)
- Flight time (18 minutes)
- Weather resistance
- Cost reduction

## Lessons from Demo Day

1. **Murphy's Law is real** - Plan for failure
2. **Field repairs crucial** - Bring everything
3. **Team chemistry matters** - Stayed calm
4. **Story sells** - Recovery impressed judges
5. **Documentation helps** - Videos saved us

## The Aftermath

### Industry Interest
Two judges approached:
- Defense contractor wants details
- Startup founder exchanged cards
- "Ever considered commercializing?"

### Professor's Comment
"Best recovery I've seen in 10 years. That's real engineering - solving problems under pressure."

### Parent Reactions
My mom: "Why did it break?"
"Because that's what prototypes do."
"But you fixed it!"
"That's what engineers do."

## Technical Postmortem

What actually failed:
- 3D printed PLA motor mount
- Layer adhesion issue
- Vibration fatigue
- Should have been ABS
- Or aluminum

Fix for future:
- CNC machined mounts
- Vibration dampening
- Redundant attachment
- Better material choice

## Team Reflection

Pizza celebration that night:
- Exhausted but proud
- Second place feels like victory
- Bonds forged in crisis
- Already planning improvements
- Might continue post-graduation

## Impact on Future

This project opened doors:
- Resume highlight
- Interview stories
- Technical confidence
- Problem-solving proof
- Team experience

## The Real Win

Not the place or prize.
The real win:
- Built something that flies
- Solved hard problems
- Recovered from failure
- Worked as team
- Inspired others

One parent said: "My daughter wants to be an engineer now after seeing your presentation."

That's the real victory.

## Final Thoughts

Senior Design teaches more than technical skills. It teaches perseverance, teamwork, and grace under pressure.

Our quadcopter broke spectacularly. We fixed it with zip ties. It flew again. We placed second.

That's engineering in its purest form.

To future teams: Your demo will fail. Have zip ties ready. Keep calm. Solve the problem. Tell the story.

The judges aren't just evaluating your project. They're evaluating future engineers.

Show them what you're made of.

🚁🔧🏆`}
      tags={["senior-design","demo-day","quadcopter","presentation"]}
      readTime="14 min"
    />
  );
}

export function generateMetadata() {
  return {
    title: "Senior Design Demo Day: The Final Presentation - Michael D'Angelo",
    description: "Today we demonstrated our autonomous quadcopter to judges, professors, and industry representatives. Everything that could go wrong did. We still won second place.",
  };
}