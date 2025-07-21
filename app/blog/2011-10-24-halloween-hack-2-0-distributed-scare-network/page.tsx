import BlogPost from '@/components/Blog/BlogPost';

export default function Page() {
  return (
    <BlogPost 
      date="2011-10-25"
      title="Halloween Hack 2.0: Distributed Scare Network"
      summary="Upgrading last year's Halloween project with mesh networking, machine learning, and coordinated scares. Because PhD students need hobbies too."
      content={`Last year's Halloween hack was a hit at UB. This year, with Stanford resources and Silicon Valley ambition, I'm building a distributed scare network. Multiple nodes, mesh networking, and ML-based scare optimization. Way over-engineered? Absolutely.

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

Happy Halloween from Stanford! 🎃👻🤖`}
      tags={["halloween","mesh-networking","machine-learning","iot"]}
      readTime="14 min"
    />
  );
}

export function generateMetadata() {
  return {
    title: "Halloween Hack 2.0: Distributed Scare Network - Michael D'Angelo",
    description: "Upgrading last year's Halloween project with mesh networking, machine learning, and coordinated scares. Because PhD students need hobbies too.",
  };
}