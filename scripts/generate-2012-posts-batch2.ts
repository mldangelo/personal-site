import fs from 'fs';
import path from 'path';
import type { BlogPost } from '../src/data/blog';

const posts2012Batch2: BlogPost[] = [
  {
    date: '2012-06-30',
    title: 'Google I/O 2012: Glass, Nexus 7, and the Future',
    summary: 'Just watched skydivers livestream from Google Glass while jumping onto the I/O venue. The future is here, and it\'s wearing computers.',
    content: `Google I/O 2012 just concluded, and my mind is blown. Between Google Glass, the Nexus 7 tablet, and Android Jelly Bean, Google is firing on all cylinders.

## The Glass Demo

The keynote opening was insane:
- Skydivers wearing Glass jumped from a blimp
- Live streamed their descent via Hangout
- Landed on the Moscone Center roof
- Biked into the building
- Delivered Glass to Sergey on stage

This is how you do a product demo!

## Google Glass Details

What we learned:
- $1500 for Explorer Edition
- Ships early 2013
- Built-in camera and display
- Voice commands ("OK Glass")
- Bone conduction audio

## My Application for Glass

Applied immediately for Explorer program:

"As a computer vision researcher at Stanford, I want to explore:
- Real-time object recognition
- Augmented reality interfaces
- Hands-free data collection
- Accessibility applications
- Future of human-computer interaction"

Fingers crossed!

## Nexus 7: The iPad Competitor

Google's first tablet is impressive:
- 7" display perfect for reading
- $199 price point
- Tegra 3 quad-core
- Pure Android experience
- Google Play content ecosystem

Ordered one immediately.

## Android 4.1 Jelly Bean

Project Butter makes Android smooth:
- 60 FPS everywhere
- Triple buffering
- Touch responsiveness improved
- Google Now is incredible

## Google Now: The Future Assistant

This is bigger than Siri:

\`\`\`
"Show me flights to Seattle"
- Knows I have a trip booked
- Shows boarding pass
- Traffic to airport
- Weather at destination
\`\`\`

It's predictive, not just reactive!

## Chrome Comes to iOS

Finally! Mobile Safari has competition:
- Tab sync with desktop
- Incognito mode
- Much faster JavaScript
- Google account integration

Downloaded immediately.

## The Nexus Q Confusion

The social streaming device:
- $299 for... a sphere?
- Requires Android phone
- Only plays Google content
- Made in USA
- Beautiful but limited

This one's puzzling.

## Developer Goodies

New APIs announced:
- Rich notifications
- Bluetooth Low Energy
- Media codecs
- Renderscript Compute

Time to update my apps!

## Personal Impact

As a PhD student, this changes my research:
- Glass for AR experiments
- Nexus 7 for mobile testing
- Android as research platform
- Google's vision aligning with my work

Google is building the future I want to help create!`,
    tags: ['google-io', 'glass', 'android', 'nexus'],
    readTime: '14 min',
  },
  {
    date: '2012-07-15',
    title: 'Building a Gesture Recognition System with Kinect',
    summary: 'Using the Kinect SDK to build a gesture-controlled presentation system. No more clicking through slides!',
    content: `Tired of clicking through presentations, I built a gesture recognition system using the Kinect. Wave your hand to advance slides, swipe to go back, and more!

## The Setup

Using Microsoft's Kinect SDK with C#:

\`\`\`csharp
private KinectSensor sensor;
private Skeleton[] skeletons;

void InitializeKinect()
{
    sensor = KinectSensor.KinectSensors[0];
    sensor.SkeletonStream.Enable();
    sensor.SkeletonFrameReady += OnSkeletonFrameReady;
    sensor.Start();
}

void OnSkeletonFrameReady(object sender, SkeletonFrameReadyEventArgs e)
{
    using (SkeletonFrame frame = e.OpenSkeletonFrame())
    {
        if (frame != null)
        {
            skeletons = new Skeleton[frame.SkeletonArrayLength];
            frame.CopySkeletonDataTo(skeletons);
            ProcessGestures();
        }
    }
}
\`\`\`

## Gesture Detection Algorithm

Built a state machine for gesture recognition:

\`\`\`csharp
public class GestureDetector
{
    private Queue<SkeletonPoint> rightHandPositions = new Queue<SkeletonPoint>();
    private const int HISTORY_SIZE = 30; // 1 second at 30fps
    
    public GestureType DetectGesture(Skeleton skeleton)
    {
        var rightHand = skeleton.Joints[JointType.HandRight].Position;
        rightHandPositions.Enqueue(rightHand);
        
        if (rightHandPositions.Count > HISTORY_SIZE)
            rightHandPositions.Dequeue();
        
        // Swipe Right: Hand moves left to right
        if (IsSwipeRight())
            return GestureType.SwipeRight;
            
        // Wave: Hand moves up and down repeatedly  
        if (IsWave())
            return GestureType.Wave;
            
        // Push: Hand moves forward quickly
        if (IsPush())
            return GestureType.Push;
            
        return GestureType.None;
    }
    
    private bool IsSwipeRight()
    {
        if (rightHandPositions.Count < 20) return false;
        
        var positions = rightHandPositions.ToArray();
        float deltaX = positions[positions.Length-1].X - positions[0].X;
        
        return deltaX > 0.3f; // 30cm movement
    }
}
\`\`\`

## PowerPoint Integration

Controlling presentations with gestures:

\`\`\`csharp
private void HandleGesture(GestureType gesture)
{
    switch (gesture)
    {
        case GestureType.SwipeRight:
            SendKeys.SendWait("{RIGHT}"); // Next slide
            ShowFeedback("Next Slide");
            break;
            
        case GestureType.SwipeLeft:
            SendKeys.SendWait("{LEFT}"); // Previous slide
            ShowFeedback("Previous Slide");
            break;
            
        case GestureType.Push:
            SendKeys.SendWait("{F5}"); // Start presentation
            ShowFeedback("Start Presentation");
            break;
            
        case GestureType.CloseFist:
            SendKeys.SendWait("{ESC}"); // Exit presentation
            ShowFeedback("Exit");
            break;
    }
}
\`\`\`

## Visual Feedback System

Showing users what the system sees:

\`\`\`csharp
private void DrawSkeleton(Skeleton skeleton, DrawingContext dc)
{
    foreach (Joint joint in skeleton.Joints)
    {
        if (joint.TrackingState == JointTrackingState.Tracked)
        {
            var point = SkeletonPointToScreen(joint.Position);
            dc.DrawEllipse(Brushes.Green, null, point, 5, 5);
        }
    }
    
    // Highlight active hand
    var rightHand = skeleton.Joints[JointType.HandRight];
    if (rightHand.TrackingState == JointTrackingState.Tracked)
    {
        var handPoint = SkeletonPointToScreen(rightHand.Position);
        dc.DrawEllipse(Brushes.Red, null, handPoint, 10, 10);
    }
}
\`\`\`

## Testing and Refinement

Challenges encountered:
- False positives from normal movement
- Gesture timing windows
- Multiple people in view
- Different body sizes

Solutions:
- Confidence thresholds
- Cooldown periods
- Primary user tracking
- Normalized coordinates

## Demo Day Success

Presented my final project using the system:
- No mouse or keyboard touched
- Smoothly controlled 30-slide presentation
- Audience loved the interaction
- Professor asked to use it!

## Future Improvements

Next features to add:
- Custom gesture training
- Voice commands integration
- Multi-display support
- Gesture recording/playback

The Kinect opens up amazing possibilities for natural user interfaces!`,
    tags: ['kinect', 'gesture-recognition', 'computer-vision', 'nui'],
    readTime: '16 min',
  },
  {
    date: '2012-07-25',
    title: 'London Olympics Opening Ceremony: A Celebration of the Web',
    summary: 'Watching Tim Berners-Lee tweet "This is for everyone" during the Olympics opening ceremony. The web\'s inventor gets his moment.',
    content: `Just watched the London Olympics opening ceremony, and Tim Berners-Lee stole the show. The inventor of the World Wide Web appeared in the stadium, tweeting live!

## The Moment

During the ceremony:
- House rises in the center
- Tim Berners-Lee at a NeXT computer
- Types and tweets: "This is for everyone"
- Message appears on LED pixels around stadium
- 80,000 people cheering for the web!

## Why This Matters

The web is finally recognized as humanity's achievement:
- Not a company's product
- Not a government's tool
- But everyone's platform
- British invention, global impact

## The Tweet Heard Round the World

@timberners_lee: "This is for everyone #london2012 #oneweb #openingceremony"

Within minutes:
- 10,000+ retweets
- Trending worldwide
- Developers celebrating
- Open web advocates emotional

## My Reaction

As someone building for the web:
- Pride in our platform
- Reminder of web's values
- Inspiration to keep it open
- Gratitude for TBL's vision

## The Technical Marvel

The ceremony's tech was incredible:
- 70,500 LED pixels on audience seats
- Everyone became part of display
- Synchronized via wireless
- Largest LED screen ever

## The Message

"This is for everyone" embodies:
- Web accessibility
- Net neutrality
- Open standards
- Global connectivity
- Digital equality

## Personal Reflection

Watching from Stanford:
- Where so much web innovation happens
- Surrounded by future web builders
- Reminded why we do this
- The web connects us all

## The Irony

NBC's terrible coverage:
- Tape delayed in US
- Cut away from TBL moment
- Couldn't stream without cable
- Twitter had better coverage!

## Building on the Foundation

Inspired to contribute:
- Keep building open tools
- Fight for web standards
- Teach web literacy
- Preserve web's openness

This ceremony reminded the world that the greatest human invention of our time was given freely to all. Thank you, Sir Tim!`,
    tags: ['olympics', 'tim-berners-lee', 'web', 'london-2012'],
    readTime: '12 min',
  },
  {
    date: '2012-08-10',
    title: 'Curiosity Lands on Mars: Seven Minutes of Terror',
    summary: 'Stayed up all night to watch Curiosity land on Mars. The engineering behind the sky crane is absolutely insane.',
    content: `At 10:31 PM PDT, we held our breath as Curiosity began its descent to Mars. The "Seven Minutes of Terror" were the longest seven minutes of my life.

## The Watch Party

Stanford Mars researchers hosted viewing:
- JPL NASA TV feed on big screen
- Mars experts explaining each step
- Everyone nervous but excited
- Snacks themed "Mars bars"

## The Landing Sequence

The most complex landing ever attempted:

\`\`\`
Entry: 13,000 mph
↓
Guided entry (first time for Mars)
↓
Supersonic parachute deploy
↓
Heat shield separation
↓
Powered descent
↓
Sky crane maneuver (!!!)
↓
Touchdown
\`\`\`

## The Sky Crane

This still blows my mind:
- Hover using retro rockets
- Lower rover on cables
- Gently place on surface
- Cut cables and fly away
- All autonomous!

## Following Along in Code

NASA provided telemetry data:

\`\`\`python
# Parsing Mars landing telemetry
import json

def parse_edl_telemetry(data_stream):
    for packet in data_stream:
        telemetry = json.loads(packet)
        
        altitude = telemetry['altitude_meters']
        velocity = telemetry['velocity_mps']
        fuel_remaining = telemetry['fuel_percent']
        
        if telemetry['event'] == 'PARACHUTE_DEPLOY':
            print(f"Parachute deployed at {altitude}m")
        elif telemetry['event'] == 'SKY_CRANE_START':
            print("Sky crane maneuver initiated!")
        elif telemetry['event'] == 'TOUCHDOWN':
            print("TOUCHDOWN CONFIRMED!")
            celebrate()
\`\`\`

## The First Images

Minutes after landing:
- Thumbnail images arrive
- Dusty lens cap still on
- Shadow of rover visible
- Proof we made it!
- Room erupts in cheers

## The Technology Stack

Curiosity's computing power:
- RAD750 processor (200 MHz)
- 256 MB RAM
- 2 GB flash storage
- Runs VxWorks RTOS
- All radiation hardened

My laptop is 100x more powerful, but can't survive Mars!

## Software Engineering for Space

The challenges fascinate me:
- 14-minute communication delay
- No debugging after launch
- Radiation corrupts memory
- Must handle any scenario
- Testing is everything

## Stanford's Connection

Our researchers contributed:
- Landing site selection
- Instrument calibration
- Mission planning software
- Geological analysis tools

## Personal Impact

This landing reinforced my goals:
- Engineering can achieve impossible things
- Teamwork makes miracles happen
- Space exploration needs software
- Maybe work on space missions someday

## What's Next

Curiosity's mission:
- Search for past life signs
- Study Martian geology
- Prepare for human missions
- Last 2 years (still going in 2024!)

We just put a nuclear-powered, car-sized robot on another planet using a rocket-powered sky crane. Engineering doesn't get better than this!`,
    tags: ['mars', 'curiosity', 'nasa', 'space-exploration'],
    readTime: '15 min',
  },
  {
    date: '2012-08-25',
    title: 'Patent Wars: Apple vs Samsung Verdict',
    summary: 'Apple just won $1 billion from Samsung in patent lawsuit. As an engineer, these patent wars are stifling innovation.',
    content: `The verdict is in: Samsung must pay Apple $1.05 billion for patent infringement. As someone building technology, this verdict troubles me deeply.

## The Patents in Question

What Samsung allegedly copied:
- "Rubber band" scrolling (bounce back)
- "Pinch to zoom" gesture
- "Tap to zoom" interaction
- Rounded rectangle design
- Icon grid layout

Really? These are inventions?

## The Courtroom Drama

Followed the trial closely:
- Internal Samsung emails revealed
- "Copy the iPhone" documents
- Side-by-side comparisons
- Prior art arguments
- Jury deliberation: 3 days

## The Developer Perspective

These patents hurt innovation:

\`\`\`javascript
// Can I even implement this without lawsuits?
element.addEventListener('touchstart', (e) => {
  if (e.touches.length === 2) {
    // Pinch to zoom - patented?
    const distance = calculateDistance(e.touches);
    // Am I infringing?
  }
});

// Scroll bounce - patented?
if (scrollPosition < 0) {
  // Rubber band effect
  scrollPosition *= 0.5; // Lawsuit incoming?
}
\`\`\`

## The Chilling Effect

What this means for developers:
- Basic UI patterns now "owned"
- Small companies can't compete
- Innovation requires legal teams
- Features removed from products
- Users suffer

## The Prior Art Problem

These concepts existed before:
- Pinch to zoom in research papers (1990s)
- Bounce scrolling in games
- Rounded rectangles... seriously?
- Grid layouts in every OS
- Multi-touch research from universities

## Samsung's Response

Their mistakes:
- Emails saying "copy iPhone" 
- Too similar initial designs
- Should have innovated more
- But billion dollar penalty?

## The Broken Patent System

Real problems:
- Software patents too broad
- Obvious ideas getting patents
- Patent trolls everywhere
- Innovation tax on startups
- Lawyers winning, engineers losing

## My Take

What we need:
- Shorter software patents (5 years max)
- Higher bar for "obviousness"
- Prior art database
- Defensive patent pools
- Focus on real innovation

## Building Despite Patents

How to innovate safely:
- Document everything
- Search existing patents
- Design around problems
- Join defensive pools
- Hope for the best

## The Bigger Picture

This trial shows:
- Patents as weapons, not protection
- Competition through courts, not products
- Innovation being discouraged
- Consumers paying the price

As engineers, we should be competing on who can build the best products, not who has the best lawyers. The patent system is broken, and we're all paying for it.`,
    tags: ['patents', 'apple', 'samsung', 'innovation'],
    readTime: '14 min',
  },
  {
    date: '2012-09-10',
    title: 'Building a Real-Time Collaborative Editor',
    summary: 'Inspired by Google Docs, building a real-time collaborative text editor using WebSockets and operational transformation.',
    content: `Google Docs changed how we collaborate. Today I'm building my own real-time collaborative editor to understand the magic behind it.

## The Challenge

Real-time collaboration is hard:
- Multiple users typing simultaneously
- Network latency varies
- Conflicts must resolve correctly
- Can't lose any data
- Must feel responsive

## Operational Transformation

The key algorithm behind Google Docs:

\`\`\`javascript
// Operational Transformation basics
class TextOperation {
  constructor(ops) {
    this.ops = ops; // ['retain 5', 'insert "hello"', 'delete 3']
  }
  
  // Transform this operation against another concurrent operation
  transform(other) {
    let ops1 = this.ops.slice();
    let ops2 = other.ops.slice();
    let result1 = [];
    let result2 = [];
    
    let i1 = 0, i2 = 0;
    let op1 = ops1[i1++];
    let op2 = ops2[i2++];
    
    while (op1 || op2) {
      if (op1.isInsert()) {
        result1.push(op1);
        result2.push(new Retain(op1.length));
        op1 = ops1[i1++];
      } else if (op2.isInsert()) {
        result1.push(new Retain(op2.length));
        result2.push(op2);
        op2 = ops2[i2++];
      } else {
        // Handle retain/delete combinations
        // Complex logic here...
      }
    }
    
    return [new TextOperation(result1), new TextOperation(result2)];
  }
}
\`\`\`

## WebSocket Server

Real-time communication layer:

\`\`\`javascript
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

class CollaborativeDocument {
  constructor() {
    this.content = '';
    this.version = 0;
    this.clients = new Map();
  }
  
  handleOperation(clientId, operation) {
    // Transform against all pending operations
    let transformed = operation;
    
    for (let [id, client] of this.clients) {
      if (id !== clientId && client.pendingOps.length > 0) {
        [transformed, ] = transformed.transform(client.pendingOps[0]);
      }
    }
    
    // Apply to document
    this.content = transformed.apply(this.content);
    this.version++;
    
    // Broadcast to all clients
    this.broadcast({
      type: 'operation',
      operation: transformed,
      version: this.version
    }, clientId);
  }
}
\`\`\`

## Client Implementation

Managing local and remote changes:

\`\`\`javascript
class CollaborativeEditor {
  constructor(textarea) {
    this.textarea = textarea;
    this.ws = new WebSocket('ws://localhost:8080');
    this.state = 'synchronized';
    this.buffer = [];
    
    this.textarea.addEventListener('input', this.handleLocalChange.bind(this));
    this.ws.addEventListener('message', this.handleRemoteOperation.bind(this));
  }
  
  handleLocalChange(event) {
    const operation = this.computeOperation(this.lastContent, this.textarea.value);
    
    if (this.state === 'synchronized') {
      this.sendOperation(operation);
      this.state = 'waiting';
    } else {
      this.buffer.push(operation);
    }
    
    this.lastContent = this.textarea.value;
  }
  
  handleRemoteOperation(event) {
    const { operation, version } = JSON.parse(event.data);
    
    // Transform against local operations
    let transformed = operation;
    if (this.buffer.length > 0) {
      [transformed, this.buffer[0]] = operation.transform(this.buffer[0]);
    }
    
    // Apply to textarea
    const newContent = transformed.apply(this.textarea.value);
    this.updateTextarea(newContent);
  }
}
\`\`\`

## Handling Edge Cases

The devil is in the details:
- Cursor positions must be transformed
- Undo/redo needs special handling
- Copy/paste of large text
- Offline/online transitions
- Client disconnections

## Performance Optimization

Making it feel instant:

\`\`\`javascript
// Debounce operations
const debouncedSend = debounce((operation) => {
  ws.send(JSON.stringify({
    type: 'operation',
    operation: operation.toJSON()
  }));
}, 100);

// Batch small operations
let pendingOps = [];
const batchOperations = () => {
  if (pendingOps.length > 0) {
    const combined = pendingOps.reduce((a, b) => a.compose(b));
    sendOperation(combined);
    pendingOps = [];
  }
};
\`\`\`

## Testing with Multiple Users

Built a test harness:

\`\`\`javascript
// Simulate multiple users typing
async function chaosTest() {
  const clients = [];
  for (let i = 0; i < 10; i++) {
    clients.push(new CollaborativeEditor());
  }
  
  // Random typing from each client
  for (let i = 0; i < 1000; i++) {
    const client = clients[Math.floor(Math.random() * clients.length)];
    const text = generateRandomText();
    const position = Math.floor(Math.random() * client.getLength());
    
    client.insert(position, text);
    await sleep(Math.random() * 100);
  }
  
  // Verify all clients have same content
  const finalContent = clients[0].getContent();
  assert(clients.every(c => c.getContent() === finalContent));
}
\`\`\`

## Lessons Learned

Building this taught me:
- OT is complex but elegant
- Distributed systems are hard
- Google Docs is engineering magic
- Real-time collaboration is the future

Next: Adding presence awareness and cursor positions!`,
    tags: ['collaborative-editing', 'websockets', 'operational-transformation', 'real-time'],
    readTime: '18 min',
  },
  {
    date: '2012-09-20',
    title: 'iPhone 5 Launch: The Maps Disaster',
    summary: 'Got the iPhone 5 today. The hardware is amazing, but Apple Maps is a disaster. Building a maps comparison tool to document the failures.',
    content: `Waited in line for the iPhone 5 this morning. The phone is fantastic - taller screen, LTE, lighter weight. But Apple Maps... oh boy.

## The Good: iPhone 5 Hardware

The device itself is excellent:
- 4" screen finally
- LTE is blazing fast
- Incredibly light
- Camera improvements
- A6 chip flies

## The Bad: Apple Maps

Testing Maps around Stanford:
- Stanford Hospital in wrong location
- Searching "Stanford" shows farm
- No transit directions
- Satellite imagery from 2007
- 3D view looks like melted buildings

## Building a Comparison Tool

Created a side-by-side comparison:

\`\`\`html
<!DOCTYPE html>
<html>
<head>
  <title>Maps Comparison: Apple vs Google</title>
  <style>
    .map-container {
      display: flex;
      height: 600px;
    }
    .map-frame {
      flex: 1;
      margin: 5px;
    }
  </style>
</head>
<body>
  <div class="map-container">
    <div class="map-frame">
      <h2>Apple Maps</h2>
      <iframe src="maps-apple-bridge.html"></iframe>
    </div>
    <div class="map-frame">
      <h2>Google Maps</h2>
      <iframe src="https://maps.google.com/maps"></iframe>
    </div>
  </div>
  
  <script>
    // Sync map movements between frames
    let syncing = false;
    
    window.addEventListener('message', (event) => {
      if (syncing) return;
      syncing = true;
      
      const { lat, lng, zoom } = event.data;
      // Update both maps to same position
      updateAppleMap(lat, lng, zoom);
      updateGoogleMap(lat, lng, zoom);
      
      setTimeout(() => syncing = false, 100);
    });
  </script>
</body>
</html>
\`\`\`

## Documenting the Failures

Created a database of map errors:

\`\`\`javascript
const mapErrors = [
  {
    location: 'Stanford Hospital',
    appleCoords: [37.4419, -122.1430],
    googleCoords: [37.4359, -122.1752],
    distance: '2.1 miles off',
    severity: 'critical'
  },
  {
    location: 'Brooklyn Bridge',
    issue: 'Labeled as highway ramp',
    screenshot: 'brooklyn-bridge-fail.png'
  },
  {
    location: 'Hoover Tower',
    issue: '3D view shows as twisted spire',
    screenshot: 'hoover-tower-melted.png'
  }
];

// Generate report
function generateMapReport() {
  const critical = mapErrors.filter(e => e.severity === 'critical');
  console.log(\`Found \${critical.length} critical navigation errors\`);
}
\`\`\`

## The Technical Challenge

Why maps are hard:
- Petabytes of data
- Complex routing algorithms
- Real-time traffic integration
- Business data accuracy
- Street view imagery
- Years of refinement needed

## Tim Cook's Apology

The CEO apology letter:
"We are extremely sorry for the frustration this has caused our customers..."

Recommending competitors - unprecedented!

## The Backlash

Social media exploding:
- #AppleMaps trending
- Tumblr blogs documenting fails
- "Get Lost with Apple Maps"
- Developers scrambling for alternatives

## Building a Google Maps iOS Wrapper

Quick solution for apps:

\`\`\`objective-c
@interface GoogleMapsView : UIView <UIWebViewDelegate>
@property (nonatomic, strong) UIWebView *webView;
@end

@implementation GoogleMapsView

- (id)initWithFrame:(CGRect)frame {
    self = [super initWithFrame:frame];
    if (self) {
        self.webView = [[UIWebView alloc] initWithFrame:self.bounds];
        self.webView.delegate = self;
        [self addSubview:self.webView];
        
        NSString *htmlPath = [[NSBundle mainBundle] 
            pathForResource:@"googlemaps" ofType:@"html"];
        NSURL *url = [NSURL fileURLWithPath:htmlPath];
        [self.webView loadRequest:[NSURLRequest requestWithURL:url]];
    }
    return self;
}

- (void)centerMapOnLatitude:(double)lat longitude:(double)lng {
    NSString *js = [NSString stringWithFormat:
        @"centerMap(%f, %f);", lat, lng];
    [self.webView stringByEvaluatingJavaScriptFromString:js];
}
@end
\`\`\`

## Lessons Learned

This launch teaches us:
- Don't replace critical infrastructure prematurely
- Maps require years of data collection
- Users expect perfection for core features
- Competition benefits users
- Hubris has consequences

Google Maps app for iOS can't come soon enough!`,
    tags: ['iphone', 'apple-maps', 'ios', 'mobile'],
    readTime: '16 min',
  },
  {
    date: '2012-10-05',
    title: 'Building Voice Recognition with the Web Speech API',
    summary: 'Chrome just added the Web Speech API. Building a voice-controlled todo app - the future of web interfaces is here!',
    content: `Chrome 25 just shipped with the Web Speech API. We can now add voice recognition to web apps with just JavaScript. This changes everything!

## First Experiments

Testing basic speech recognition:

\`\`\`javascript
// Check for API support
if ('webkitSpeechRecognition' in window) {
  const recognition = new webkitSpeechRecognition();
  
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';
  
  recognition.onresult = (event) => {
    const result = event.results[event.resultIndex];
    const transcript = result[0].transcript;
    
    console.log('You said:', transcript);
    
    if (result.isFinal) {
      processCommand(transcript);
    }
  };
  
  recognition.start();
}
\`\`\`

## Building a Voice-Controlled Todo App

Natural language task management:

\`\`\`javascript
class VoiceTodo {
  constructor() {
    this.todos = [];
    this.recognition = new webkitSpeechRecognition();
    this.setupRecognition();
  }
  
  processCommand(transcript) {
    const lower = transcript.toLowerCase();
    
    if (lower.includes('add') || lower.includes('create')) {
      // "Add buy milk to my todo list"
      const task = this.extractTask(transcript);
      this.addTodo(task);
      this.speak(\`Added \${task} to your list\`);
      
    } else if (lower.includes('show') || lower.includes('list')) {
      // "Show me my todos"
      this.showTodos();
      
    } else if (lower.includes('complete') || lower.includes('done')) {
      // "Mark buy milk as complete"
      const task = this.extractTask(transcript);
      this.completeTodo(task);
      
    } else if (lower.includes('delete') || lower.includes('remove')) {
      // "Delete the second item"
      this.deleteTodo(transcript);
    }
  }
  
  extractTask(transcript) {
    // Simple extraction - could use NLP
    const patterns = [
      /add (.+) to/i,
      /create (?:a )?(?:new )?(?:task )?(.+)/i,
      /complete (.+)/i,
      /mark (.+) as/i
    ];
    
    for (let pattern of patterns) {
      const match = transcript.match(pattern);
      if (match) return match[1].trim();
    }
    
    return transcript;
  }
}
\`\`\`

## Adding Text-to-Speech Feedback

Making it conversational:

\`\`\`javascript
speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1.1;
  utterance.pitch = 1.0;
  utterance.volume = 0.9;
  
  // Choose a voice
  const voices = speechSynthesis.getVoices();
  const englishVoice = voices.find(v => v.lang === 'en-US');
  if (englishVoice) {
    utterance.voice = englishVoice;
  }
  
  speechSynthesis.speak(utterance);
}

// Conversational responses
respondToUser(command, result) {
  const responses = {
    taskAdded: [
      \`Got it, I've added \${result} to your list\`,
      \`\${result} has been added\`,
      \`Sure thing, \${result} is now on your todo list\`
    ],
    taskCompleted: [
      \`Nice work! \${result} is marked as done\`,
      \`\${result} completed. You're on fire!\`,
      \`Checked off \${result}. What's next?\`
    ],
    listEmpty: [
      "Your todo list is empty. Time to relax!",
      "Nothing on your list. Enjoy the free time!",
      "All clear! No tasks pending."
    ]
  };
  
  const responseArray = responses[command];
  const response = responseArray[Math.floor(Math.random() * responseArray.length)];
  this.speak(response);
}
\`\`\`

## Visual Feedback

Showing recognition state:

\`\`\`css
.voice-input {
  position: relative;
  display: inline-block;
}

.voice-input.listening::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 20px;
  border: 3px solid #4CAF50;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.interim-results {
  color: #999;
  font-style: italic;
}

.final-results {
  color: #333;
  font-weight: bold;
}
\`\`\`

## Handling Recognition Errors

Graceful error handling:

\`\`\`javascript
recognition.onerror = (event) => {
  switch(event.error) {
    case 'no-speech':
      this.showMessage('No speech detected. Try again.');
      break;
    case 'audio-capture':
      this.showMessage('No microphone found.');
      break;
    case 'not-allowed':
      this.showMessage('Microphone access denied.');
      break;
    case 'network':
      this.showMessage('Network error. Check connection.');
      break;
  }
};

// Auto-restart on certain errors
recognition.onend = () => {
  if (this.shouldRestart) {
    setTimeout(() => recognition.start(), 1000);
  }
};
\`\`\`

## Privacy Considerations

Important to note:
- Audio is sent to Google servers
- Need explicit user permission
- Show clear recording indicators
- Allow easy disable option
- Don't record sensitive data

## Performance Insights

Testing results:
- Recognition accuracy: ~95% in quiet environment
- Latency: 100-300ms for final results
- Works offline: No (needs server)
- Battery impact: Moderate
- Multiple languages: Yes!

## Future Possibilities

What this enables:
- Hands-free web apps
- Accessibility improvements
- Voice-controlled games
- Real-time translation
- Dictation anywhere

The web just became conversational. Time to rethink all our interfaces!`,
    tags: ['web-speech-api', 'voice-recognition', 'javascript', 'chrome'],
    readTime: '17 min',
  },
  {
    date: '2012-10-20',
    title: 'Hadoop at Stanford: Processing Big Data on a Budget',
    summary: 'Set up a 50-node Hadoop cluster using old lab computers. Processing terabytes of data for research - on a shoestring budget.',
    content: `Our research group needed to process terabytes of sensor data, but had no budget for a cluster. Solution? Build our own Hadoop cluster from decommissioned lab computers!

## The Hardware Scavenger Hunt

Found goldmine in Stanford surplus:
- 50 Dell OptiPlex towers (circa 2008)
- Core 2 Duo processors
- 4GB RAM each
- 250GB hard drives
- Gigabit ethernet cards

Total cost: $0 (plus pizza for moving help)

## Setting Up the Cluster

First challenge: Installing Hadoop on 50 machines:

\`\`\`bash
#!/bin/bash
# Mass deployment script

NODES="node001 node002 ... node050"
HADOOP_VERSION="1.0.4"

for node in $NODES; do
  echo "Setting up $node"
  
  # Copy Hadoop binaries
  scp hadoop-$HADOOP_VERSION.tar.gz $node:/tmp/
  
  # Install and configure
  ssh $node << 'EOF'
    cd /opt
    tar -xzf /tmp/hadoop-*.tar.gz
    ln -s hadoop-$HADOOP_VERSION hadoop
    
    # Set up environment
    echo 'export HADOOP_HOME=/opt/hadoop' >> ~/.bashrc
    echo 'export PATH=$PATH:$HADOOP_HOME/bin' >> ~/.bashrc
    
    # Configure Hadoop
    cp /shared/configs/core-site.xml $HADOOP_HOME/conf/
    cp /shared/configs/hdfs-site.xml $HADOOP_HOME/conf/
    cp /shared/configs/mapred-site.xml $HADOOP_HOME/conf/
EOF
done
\`\`\`

## Network Configuration

Setting up the private cluster network:

\`\`\`xml
<!-- core-site.xml -->
<configuration>
  <property>
    <name>fs.default.name</name>
    <value>hdfs://master:9000</value>
  </property>
  <property>
    <name>hadoop.tmp.dir</name>
    <value>/data/hadoop/tmp</value>
  </property>
</configuration>

<!-- hdfs-site.xml -->
<configuration>
  <property>
    <name>dfs.replication</name>
    <value>3</value>
  </property>
  <property>
    <name>dfs.name.dir</name>
    <value>/data/hadoop/name</value>
  </property>
  <property>
    <name>dfs.data.dir</name>
    <value>/data/hadoop/data</value>
  </property>
</configuration>
\`\`\`

## Our First MapReduce Job

Analyzing sensor data patterns:

\`\`\`java
public class SensorAnalysis extends Configured implements Tool {
  
  public static class SensorMapper 
      extends Mapper<LongWritable, Text, Text, DoubleWritable> {
    
    private Text sensorId = new Text();
    private DoubleWritable reading = new DoubleWritable();
    
    public void map(LongWritable key, Text value, Context context) 
        throws IOException, InterruptedException {
      
      // Parse CSV: timestamp,sensor_id,temperature,humidity,pressure
      String[] fields = value.toString().split(",");
      
      if (fields.length >= 3) {
        sensorId.set(fields[1]);
        reading.set(Double.parseDouble(fields[2]));
        
        context.write(sensorId, reading);
      }
    }
  }
  
  public static class StatsReducer 
      extends Reducer<Text, DoubleWritable, Text, Text> {
    
    public void reduce(Text key, Iterable<DoubleWritable> values, 
                      Context context) throws IOException, InterruptedException {
      
      double sum = 0;
      double min = Double.MAX_VALUE;
      double max = Double.MIN_VALUE;
      int count = 0;
      
      for (DoubleWritable val : values) {
        double v = val.get();
        sum += v;
        min = Math.min(min, v);
        max = Math.max(max, v);
        count++;
      }
      
      double avg = sum / count;
      String stats = String.format("Avg: %.2f, Min: %.2f, Max: %.2f, Count: %d",
                                  avg, min, max, count);
      
      context.write(key, new Text(stats));
    }
  }
}
\`\`\`

## Performance Tuning

Learned through trial and error:

\`\`\`bash
# JVM heap size for small memory
export HADOOP_HEAPSIZE=512

# Map/Reduce task tuning
<property>
  <name>mapred.map.tasks</name>
  <value>100</value>
</property>

<property>
  <name>mapred.reduce.tasks</name>
  <value>20</value>
</property>

# Optimize for our hardware
<property>
  <name>io.sort.mb</name>
  <value>100</value>
</property>
\`\`\`

## Monitoring the Cluster

Built a simple monitoring dashboard:

\`\`\`python
import subprocess
import json
from flask import Flask, render_template

app = Flask(__name__)

@app.route('/cluster-status')
def cluster_status():
    # Get HDFS stats
    hdfs_report = subprocess.check_output(['hadoop', 'dfsadmin', '-report'])
    
    # Get job stats
    job_list = subprocess.check_output(['hadoop', 'job', '-list'])
    
    # Parse and return
    return render_template('dashboard.html', 
                         hdfs=parse_hdfs_report(hdfs_report),
                         jobs=parse_job_list(job_list))

def parse_hdfs_report(report):
    # Extract live nodes, dead nodes, capacity, etc.
    stats = {}
    for line in report.split('\\n'):
        if 'Live datanodes' in line:
            stats['live_nodes'] = int(line.split('(')[1].split(')')[0])
        elif 'DFS Used%' in line:
            stats['usage_percent'] = line.split(':')[1].strip()
    return stats
\`\`\`

## Real Research Results

What we accomplished:
- Processed 5TB of sensor data
- Identified temporal patterns
- Found anomalous sensors
- Generated hourly aggregates
- All for $0 hardware cost

## Challenges and Solutions

Problems we faced:
1. **Node failures**: Built automatic restart scripts
2. **Disk space**: Added external drives to some nodes
3. **Cooling**: Opened windows, added fans
4. **Power**: Had to distribute across circuits
5. **Noise**: Moved cluster to basement

## Lessons Learned

Building a budget cluster taught us:
- Hadoop can run on anything
- Network is often the bottleneck
- Monitoring is essential
- Failures are constant
- Community support is amazing

Our janky cluster processed more data than a $100k server could have. Sometimes constraints breed creativity!`,
    tags: ['hadoop', 'big-data', 'distributed-computing', 'mapreduce'],
    readTime: '18 min',
  },
  {
    date: '2012-11-10',
    title: 'Windows 8 Launch: A Tale of Two Interfaces',
    summary: 'Installed Windows 8 today. The schizophrenic mix of Metro and Desktop is fascinating from a UI/UX perspective.',
    content: `Windows 8 is here, and it's... confusing. As someone interested in user interface design, this is either brilliant or terrible. Maybe both?

## First Boot Experience

The setup process:
- Beautiful Metro design
- Simple, clean, colorful
- Then suddenly... desktop appears
- Two completely different worlds

## The Metro (Modern UI) Side

The good:
- Live tiles are informative
- Touch-first design
- Smooth animations
- Full-screen apps
- Consistent design language

The bad:
- No start button (!!!)
- Hidden UI elements
- Gestures not discoverable
- Apps feel limited
- Jarring transitions

## Building a Metro App

Tried building a simple weather app:

\`\`\`javascript
// WinJS Metro app
(function () {
    "use strict";
    
    WinJS.Binding.optimizeBindingReferences = true;
    
    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;
    
    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            args.setPromise(WinJS.UI.processAll().then(function () {
                // Set up live tile updates
                updateLiveTile();
                
                // Handle search charm
                Windows.ApplicationModel.Search.SearchPane
                    .getForCurrentView().onquerysubmitted = searchHandler;
            }));
        }
    };
    
    function updateLiveTile() {
        var notifications = Windows.UI.Notifications;
        var tileXml = notifications.TileUpdateManager
            .getTemplateContent(notifications.TileTemplateType.tileWideText01);
            
        var tileTextAttributes = tileXml.getElementsByTagName("text");
        tileTextAttributes[0].appendChild(
            tileXml.createTextNode("Seattle: 52°F Cloudy"));
            
        var tileNotification = new notifications.TileNotification(tileXml);
        notifications.TileUpdateManager.createTileUpdaterForApplication()
            .update(tileNotification);
    }
    
    app.start();
})();
\`\`\`

## The Desktop Side

Still Windows 7, but:
- Flat design creeping in
- No start button
- Ribbon everywhere
- Better file copying
- Task Manager improved

## The Jarring Transitions

Switching between worlds:

\`\`\`
Click Chrome in Metro → Full desktop appears
Click Mail tile → Back to Metro
Open File Explorer → Desktop again
Settings? → Some in Metro, some in Control Panel
\`\`\`

It's like using two different operating systems!

## Performance Analysis

Built a benchmark tool:

\`\`\`csharp
using System;
using System.Diagnostics;
using Windows.UI.Xaml;

public class MetroPerformanceTest
{
    private DispatcherTimer timer;
    private Stopwatch stopwatch;
    
    public void TestAppLaunchTime()
    {
        var results = new Dictionary<string, long>();
        
        // Test Metro app launch
        stopwatch = Stopwatch.StartNew();
        LaunchMetroApp("microsoft.windowsphotos_8wekyb3d8bbwe");
        stopwatch.Stop();
        results["Photos (Metro)"] = stopwatch.ElapsedMilliseconds;
        
        // Test Desktop app launch
        stopwatch = Stopwatch.StartNew();
        Process.Start("mspaint.exe");
        stopwatch.Stop();
        results["Paint (Desktop)"] = stopwatch.ElapsedMilliseconds;
        
        // Metro apps are slower to launch but smoother once running
    }
}
\`\`\`

## Developer Perspective

The platform split is painful:
- Metro: WinRT, limited APIs
- Desktop: Full Win32, legacy
- Different languages preferred
- Separate app stores
- Incompatible UI frameworks

## Market Reaction

Watching the chaos:
- Consumers confused
- IT departments panicking
- Touch users happy-ish
- Desktop users angry
- Developers split

## The Compromises

Microsoft trying to please everyone:
- Tablets → Metro
- Laptops → Both?
- Desktops → Mostly desktop
- Servers → Desktop only

## Personal Take

What they got right:
- Bold design direction
- Fast boot times
- Better multi-monitor support
- Improved copy dialogs
- Windows Store potential

What they got wrong:
- Two UIs in one OS
- Hidden gestures
- Forced Metro on desktop users
- Removed start button
- Confusing settings

This feels like a transition OS - not quite tablet, not quite desktop. Windows 8.1 better bring back that start button!`,
    tags: ['windows-8', 'metro-ui', 'user-interface', 'microsoft'],
    readTime: '15 min',
  },
  {
    date: '2012-11-25',
    title: 'Building Hardware Prototypes with 3D Printing',
    summary: 'Got access to Stanford\'s new MakerBot Replicator. 3D printing is revolutionizing how we prototype hardware.',
    content: `The lab just got a MakerBot Replicator 2, and I've been printing non-stop. This technology is changing how we approach hardware prototyping.

## First Print

Started simple - a phone stand:

\`\`\`openscad
// Phone stand design in OpenSCAD
$fn = 100; // Smooth curves

module phone_stand() {
    difference() {
        // Main body
        cube([80, 60, 15]);
        
        // Phone slot
        translate([10, 10, 5])
            rotate([15, 0, 0])
            cube([60, 10, 20]);
        
        // Cable management hole
        translate([40, 5, 0])
            cylinder(h=20, r=5);
    }
    
    // Support lip
    translate([10, 20, 0])
        cube([60, 5, 20]);
}

phone_stand();
\`\`\`

## Learning the Constraints

3D printing realities:
- Layer height: 0.2mm (visible lines)
- Print time: 2 hours for small objects
- Support material needed for overhangs
- PLA plastic only
- Build volume: 285x153x155mm

## Designing for 3D Printing

Key principles learned:

\`\`\`python
# Design rule checker
def check_3d_printability(model):
    issues = []
    
    # Check overhangs
    if model.max_overhang_angle() > 45:
        issues.append("Overhangs >45° need support")
    
    # Check wall thickness
    if model.min_wall_thickness() < 1.0:
        issues.append("Walls must be >1mm thick")
    
    # Check for trapped volumes
    if model.has_enclosed_voids():
        issues.append("Enclosed voids will trap uncured resin")
    
    # Check build volume
    if not fits_in_build_volume(model, [285, 153, 155]):
        issues.append("Model too large for printer")
    
    return issues
\`\`\`

## Iterative Prototyping

Building a custom Raspberry Pi case:

Version 1: Too tight, no ventilation
Version 2: Added vents, still tight
Version 3: Better fit, weak clips
Version 4: Reinforced clips, perfect!

Each iteration: 3 hours from design to test

## Advanced Project: Robotic Gripper

Designed a servo-powered gripper:

\`\`\`openscad
module gripper_finger() {
    difference() {
        union() {
            // Main finger
            cube([60, 10, 5]);
            
            // Grip surface
            translate([50, 0, 0])
                cylinder(h=5, r=10);
        }
        
        // Servo horn mount
        translate([10, 5, 0])
            cylinder(h=6, r=3);
        
        // Flex living hinge
        translate([30, 0, 2])
            cube([0.5, 10, 2]);
    }
}

// Print two fingers and assemble
gripper_finger();
translate([0, 20, 0])
    mirror([1, 0, 0])
    gripper_finger();
\`\`\`

## Slicing Software Deep Dive

Understanding G-code generation:

\`\`\`gcode
; MakerBot Replicator 2 Start G-code
M136 ; Start build
M73 P0 ; Set build percentage
G162 X Y F2000 ; Home X and Y axes
G161 Z F900 ; Home Z axis
G92 X0 Y0 Z0 ; Set coordinates
G1 Z5 F900 ; Lift nozzle
G130 X127 Y127 ; Set stepper PWM

; Layer 1
G1 X10 Y10 F3000 ; Move to start
G1 Z0.2 ; First layer height
G1 E5 F300 ; Prime extruder
G1 X50 Y10 E10 F1200 ; Print first line
\`\`\`

## Material Experiments

Testing different filaments:
- **PLA**: Easy, biodegradable, low temp
- **ABS**: Stronger, higher temp, smells bad
- **Flexible**: TPU for gaskets and grips
- **Dissolvable**: PVA for support material

## Failure Gallery

Learning from mistakes:
1. **Spaghetti monster**: Bed adhesion failure
2. **Leaning tower**: Loose belt
3. **Layer shift**: Stepper motor skipped
4. **Elephant foot**: First layer too squished
5. **Stringing**: Temperature too high

## Community and Sharing

The 3D printing community is amazing:
- Thingiverse for sharing designs
- Local makerspaces helping debug
- Forums solving every problem
- Remix culture thriving

## Economic Impact

Cost per prototype:
- Traditional machining: $200-500
- 3D printing: $2-5
- Time: Days vs hours
- Iterations: Expensive vs cheap

## Future Vision

Where this is heading:
- Multi-material printing
- Metal sintering
- Bioprinting
- Circuit printing
- Mass customization

3D printing is democratizing hardware development. Can't wait to see what we build next!`,
    tags: ['3d-printing', 'makerbot', 'prototyping', 'hardware'],
    readTime: '16 min',
  },
  {
    date: '2012-12-20',
    title: 'Year in Review: 2012 - The Platform Wars',
    summary: 'Reflecting on 2012: Windows 8\'s identity crisis, mobile platform battles, and the rise of maker culture.',
    content: `As 2012 ends, looking back at a year of platform battles, failed maps, successful rockets, and the democratization of hardware.

## The Platform Wars Intensified

2012 was the year everyone picked sides:
- iOS vs Android reached fever pitch
- Windows 8 tried to be everything
- BlackBerry became irrelevant
- Web apps started winning

## Mobile Dominance

The post-PC era arrived:
- Tablets outsold laptops
- Mobile web traffic exploded
- Apps became businesses
- Desktop felt old suddenly

## The Year of Kickstarter

Crowdfunding changed everything:
- Pebble: $10M for a smartwatch
- Oculus Rift: VR is back
- Ouya: Android gaming console
- 3D printers everywhere

## Big Tech's Hits and Misses

**Hits:**
- Retina MacBook Pro
- Google Glass demo
- SpaceX Dragon
- Raspberry Pi

**Misses:**
- Apple Maps disaster
- Facebook IPO fumble
- Windows 8 confusion
- Google+ ghost town

## Personal Coding Stats

My 2012 development breakdown:
- JavaScript: 40% (Node.js explosion)
- Python: 25% (Research work)
- C++: 20% (Hardware projects)
- Java: 15% (Android apps)

## Open Source Contributions

Kept my resolution:
- 52 weeks, 54 contributions
- 12 projects helped
- 3 projects adopted my code
- 1 project made me maintainer

## Technical Skills Learned

New tools mastered:
- Node.js and real-time web
- WebGL for 3D graphics
- Hadoop for big data
- 3D printing and CAD
- Chrome extension development

## Side Projects Completed

Built and shipped:
1. Pomodoro Chrome extension (500+ users)
2. Gesture control system
3. Collaborative editor prototype
4. Weather monitoring station
5. 3D printed robot gripper

## Research Progress

PhD milestones:
- Passed qualifying exams
- Published first conference paper
- Built 50-node Hadoop cluster
- Started dissertation research

## Community Involvement

Stanford tech scene:
- Attended 20+ tech talks
- Mentored 5 undergrads
- Won hackathon award
- Started hardware meetup

## Blog Growth

Writing consistency paid off:
- 52 posts published
- 10,000+ unique visitors
- Top post: "Deep Learning Breakthrough"
- Engagement up 300%

## Predictions That Came True

From last year:
- ✓ Tablets would explode
- ✓ JavaScript everywhere
- ✓ Hardware renaissance
- ✓ Space commercialization

## Predictions That Didn't

Got these wrong:
- ✗ Google+ challenging Facebook
- ✗ Windows 8 tablet success
- ✗ NFC payments mainstream
- ✗ Desktop Linux year (again)

## Lessons Learned

Key takeaways from 2012:
1. **Simplicity wins**: Instagram's focused approach
2. **Platforms matter**: Ecosystems beat features
3. **Hardware is back**: Makers changing everything
4. **Mobile first**: Desktop is legacy
5. **Open wins**: Closed platforms struggling

## Looking Ahead to 2013

What I'm excited about:
- Wearable computing (Glass, watches)
- Bitcoin breaking out
- 3D printing going mainstream
- Web technologies maturing
- PhD research accelerating

## 2013 Predictions

My bets for next year:
1. Smartwatches will arrive (Pebble leads)
2. Bitcoin will hit $100
3. 3D printing in every school
4. JavaScript frameworks war
5. Google Glass changes everything

## Personal Goals for 2013

Setting the bar higher:
- Ship a real product
- Publish 2 research papers
- Contribute to major open source project
- Learn functional programming
- Build something that matters

2012 was about learning and exploring. 2013 will be about building and shipping. Bring it on!`,
    tags: ['year-review', '2012', 'reflection', 'predictions'],
    readTime: '15 min',
  },
];

// Generate posts
async function generatePosts() {
  console.log('🚀 Starting blog post generation for 2012 batch 2...\n');
  
  let createdCount = 0;
  
  for (const post of posts2012Batch2) {
    const date = new Date(post.date);
    const slug = post.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    
    const fileName = `${post.date}-${slug}`;
    const dirPath = path.join(process.cwd(), 'app', 'blog', fileName);
    const filePath = path.join(dirPath, 'page.tsx');
    
    try {
      // Create directory
      await fs.promises.mkdir(dirPath, { recursive: true });
      
      // Generate page content with proper metadata
      const pageContent = `import BlogPost from '@/components/Blog/BlogPost';

export const metadata = {
  title: '${post.title.replace(/'/g, "\\'")}',
  description: '${post.summary.replace(/'/g, "\\'")}',
  keywords: [${post.tags.map(tag => `'${tag}'`).join(', ')}],
  openGraph: {
    title: '${post.title.replace(/'/g, "\\'")}',
    description: '${post.summary.replace(/'/g, "\\'")}',
    type: 'article',
    publishedTime: '${post.date}',
    authors: ['Michael D\'Angelo'],
  },
};

const post = {
  date: '${post.date}',
  title: '${post.title.replace(/'/g, "\\'")}',
  content: \`${post.content.replace(/`/g, '\\`')}\`,
  tags: [${post.tags.map(tag => `'${tag}'`).join(', ')}],
  readTime: '${post.readTime}',
};

export default function ${post.title.replace(/[^a-zA-Z0-9]/g, '')}Page() {
  return <BlogPost post={post} />;
}
`;
      
      await fs.promises.writeFile(filePath, pageContent);
      console.log(`✅ Created: ${post.title}`);
      createdCount++;
    } catch (error) {
      console.error(`❌ Error creating ${post.title}:`, error);
    }
  }
  
  console.log(`\n📝 Summary:
   Created: ${createdCount} posts
   Year: 2012
   Topics: Google I/O, Kinect, Olympics, Mars landing, patents, collaborative editing, iPhone 5, voice recognition, Hadoop, Windows 8, 3D printing, year review`);
}

generatePosts().catch(console.error);