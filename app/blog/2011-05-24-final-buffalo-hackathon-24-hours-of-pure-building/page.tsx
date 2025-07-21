import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="2011-05-25"
      title="Final Buffalo Hackathon: 24 Hours of Pure Building"
      summary="Last hackathon before graduation. Built a mesh network emergency communication system. Won \"Most Impactful\". Perfect send-off from UB."
      content={`Just finished my final hackathon at UB - "Hack for Good Buffalo." Our team built an emergency mesh network communication system in 24 hours. Won "Most Impactful Project." What a way to end the undergraduate chapter.

## The Challenge

Buffalo Hackathon theme: "Community Resilience"
After recent storms knocked out cell towers, organizers asked: "How do we communicate when infrastructure fails?"

Perfect challenge for our skills.

## Team Formation

The gang back together:
- Me: Mesh networking and embedded
- Jake: Android app development  
- Sarah: Hardware and antennas
- Ahmed: Backend and visualization
- Chris: UI/UX and presentation

One last ride.

## The Concept: MeshChat

Emergency communication when cell towers fail:
- Phone-to-phone mesh network
- No infrastructure required
- Text messaging and location sharing
- Self-healing network topology
- Battery efficient

"WhatsApp for disasters"

## Technical Architecture

### Hardware Nodes
ESP8266 modules as mesh repeaters:
- Solar powered
- Weatherproof enclosure
- Magnetic mounting
- $15 per node

Deploy on cars, buildings, anywhere.

### Phone Integration
Android phones connect via WiFi Direct:
- No root required
- Background service
- Automatic mesh joining
- Seamless handoff

### Mesh Protocol
Custom protocol optimized for disasters:
\`\`\`java
public class MeshMessage {
    String id = UUID.randomUUID();
    String sender;
    String content;
    long timestamp;
    int hopCount = 0;
    List<String> path = new ArrayList<>();
    
    void addHop(String nodeId) {
        hopCount++;
        path.add(nodeId);
        if (hopCount > MAX_HOPS) {
            // Prevent infinite loops
            return;
        }
    }
}
\`\`\`

## The Build Sprint

### Hour 0-4: Architecture Design
Whiteboard sessions, protocol design, task division.
Key decision: Keep it simple. Lives might depend on this.

### Hour 4-8: Core Implementation
\`\`\`java
// Mesh discovery
private void discoverPeers() {
    WifiP2pManager.DnsSdServiceRequest request = 
        WifiP2pManager.DnsSdServiceRequest.newInstance();
    
    manager.addServiceRequest(channel, request,
        new ActionListener() {
            @Override
            public void onSuccess() {
                manager.discoverServices(channel, 
                    new ActionListener() {
                        @Override
                        public void onSuccess() {
                            Log.d("MeshChat", "Service discovery started");
                        }
                    });
            }
        });
}

// Message routing
private void routeMessage(MeshMessage msg) {
    if (messageCache.contains(msg.id)) {
        return; // Already seen
    }
    
    messageCache.add(msg.id);
    
    if (msg.recipient.equals(deviceId)) {
        deliverMessage(msg);
    } else {
        msg.addHop(deviceId);
        broadcastToPeers(msg);
    }
}
\`\`\`

### Hour 8-12: Android App
Material Design UI built at 3 AM:
- Clean chat interface
- Network topology view
- Battery optimization
- Offline maps integration

### Hour 12-16: Hardware Nodes
ESP8266 repeater firmware:
\`\`\`cpp
void setup() {
    // Initialize mesh
    mesh.setDebugMsgTypes(ERROR | STARTUP);
    mesh.init(MESH_PREFIX, MESH_PASSWORD, MESH_PORT);
    mesh.onReceive(&receivedCallback);
    
    // Solar power management
    pinMode(SOLAR_PIN, INPUT);
    pinMode(BATTERY_PIN, INPUT);
}

void loop() {
    mesh.update();
    
    // Power management
    float batteryVoltage = analogRead(BATTERY_PIN) * 0.0048;
    if (batteryVoltage < 3.3) {
        // Low power mode
        mesh.stop();
        ESP.deepSleep(60e6); // Sleep 1 minute
    }
}
\`\`\`

### Hour 16-20: Integration Hell
Nothing works together. Debugging with energy drinks and determination:
- WiFi Direct conflicts with mesh
- Message loops crashing apps
- Battery drain excessive

One by one, squashed bugs.

### Hour 20-24: Polish and Demo
- Live demo preparation
- Disaster scenario simulation
- Presentation practice
- More coffee

## The Demo

Simulated disaster scenario:
1. "Cell towers down" (WiFi disabled)
2. 5 phones form instant mesh
3. Send messages across room
4. One phone leaves - network self-heals
5. Deploy hardware node - range extends
6. Show message routing visualization

Judges impressed by reliability.

## Technical Innovations

### Adaptive Routing
\`\`\`java
// Choose best path based on signal strength
private String selectNextHop(String destination) {
    List<Peer> peers = getSortedPeersBySignal();
    
    for (Peer peer : peers) {
        if (peer.hasRouteTo(destination)) {
            return peer.id;
        }
    }
    
    // No known route, use highest signal peer
    return peers.get(0).id;
}
\`\`\`

### Message Priority Queue
Emergency messages get priority:
\`\`\`java
enum MessagePriority {
    EMERGENCY(0),    // "Need medical help"
    HIGH(1),        // "Building collapsed here"
    NORMAL(2),      // "I'm safe"
    LOW(3)          // "Battery at 20%"
}

PriorityQueue<MeshMessage> messageQueue = 
    new PriorityQueue<>((a, b) -> 
        a.priority.compareTo(b.priority));
\`\`\`

### Battery Optimization
- Adaptive transmission power
- Duty cycling when idle
- Wake on motion (using accelerometer)
- Batch message transmission

Result: 72 hours on standard phone battery.

## Competition Results

### Other Projects
Strong competition:
- Food waste tracking app
- Community skill sharing platform
- Elderly care coordination system
- Local business discovery tool

All solving real problems.

### Judging Criteria
- Technical complexity ✓
- Community impact ✓
- Implementation quality ✓
- Presentation ✓
- Innovation ✓

### The Win
"Most Impactful Project: MeshChat"

Prize: $1000 + Raspberry Pis + Buffalo News coverage

But really: Validation that we built something meaningful.

## Post-Hackathon Interest

Project went viral:
- Buffalo Emergency Management wants pilot
- Red Cross reached out
- GitHub: 500 stars in 48 hours
- Multiple deployment requests

From hackathon to real impact.

## Open Source Release

Everything on GitHub:
- Android app source
- ESP8266 firmware
- Protocol specification
- Deployment guide
- Disaster response tips

Already being adapted for:
- Music festivals
- Hiking groups
- Protest organization
- Rural communities

## Lessons from Last Hackathon

What 4 years taught us:
1. **Simple beats complex** - Especially under pressure
2. **User need drives design** - Not technology
3. **Test constantly** - Not just at end
4. **Document while building** - Memory fades
5. **Have fun** - It's about the journey

## Team Reflection

Pizza at 6 AM, exhausted but proud:

Jake: "Remember freshman year LED cube?"
Sarah: "We've come far from blinking lights"
Ahmed: "This could actually save lives"
Chris: "Perfect final project together"
Me: "Couldn't ask for better team"

Some friendships are forged in solder and code.

## Buffalo Goodbye

This hackathon was more than competition:
- Celebrated 4 years of growth
- Applied everything we learned
- Gave back to community
- Ended where we started: building together

From that first IEEE meeting to this moment.

## Impact Update

Two weeks later:
- Buffalo considering deployment
- FEMA expressed interest
- Someone used it at music festival
- Feature requests pouring in

We built something that matters.

## Personal Growth

Comparing to first hackathon:
- Then: "How do I blink LED?"
- Now: "How do we save lives?"

- Then: Following tutorials
- Now: Creating solutions

- Then: Individual learning
- Now: Team leadership

## The Code I'll Remember

Not the complex algorithms, but:
\`\`\`java
// When everything else fails, people help people
public void onMessageReceived(String message) {
    if (message.contains("HELP")) {
        notification.priority = MAXIMUM;
        alert.sound = EMERGENCY;
        human.respondTo(human);
    }
}
\`\`\`

## Final Thoughts

24 hours. 5 friends. 1 mission. Countless memories.

This wasn't just my last Buffalo hackathon. It was the culmination of an engineering education. We didn't just build an app - we built something that could matter when everything else fails.

Perfect way to say goodbye to UB: by giving back to Buffalo.

California, here I come. But part of me will always be in those hackathon halls, building the future one sleepless night at a time.

Go Bulls. Forever. 🐃💙💻`}
      tags={["hackathon","mesh-networking","emergency-tech","teamwork"]}
      readTime="14 min"
    />
  );
}

export function generateMetadata() {
  return {
    title: "Final Buffalo Hackathon: 24 Hours of Pure Building - Michael D'Angelo",
    description: "Last hackathon before graduation. Built a mesh network emergency communication system. Won \"Most Impactful\". Perfect send-off from UB.",
  };
}