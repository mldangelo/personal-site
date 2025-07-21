import BlogPost from '@/components/Blog/BlogPost';

export const metadata = {
  title: 'Building a Real-Time Collaborative Editor',
  description: 'Inspired by Google Docs, building a real-time collaborative text editor using WebSockets and operational transformation.',
  keywords: ['collaborative-editing', 'websockets', 'operational-transformation', 'real-time'],
  openGraph: {
    title: 'Building a Real-Time Collaborative Editor',
    description: 'Inspired by Google Docs, building a real-time collaborative text editor using WebSockets and operational transformation.',
    type: 'article',
    publishedTime: '2012-09-10',
    authors: ['Michael D'Angelo'],
  },
};

const post = {
  date: '2012-09-10',
  title: 'Building a Real-Time Collaborative Editor',
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
};

export default function BuildingaRealTimeCollaborativeEditorPage() {
  return <BlogPost post={post} />;
}
