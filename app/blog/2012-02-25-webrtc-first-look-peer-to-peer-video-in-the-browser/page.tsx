import BlogPost from '@/components/Blog/BlogPost';

export const metadata = {
  title: 'WebRTC First Look: Peer-to-Peer Video in the Browser',
  description: 'Google released WebRTC in Chrome. Built a video chat app with no servers - the future of communication is peer-to-peer.',
  keywords: ['webrtc', 'peer-to-peer', 'video-chat', 'real-time'],
  openGraph: {
    title: 'WebRTC First Look: Peer-to-Peer Video in the Browser',
    description: 'Google released WebRTC in Chrome. Built a video chat app with no servers - the future of communication is peer-to-peer.',
    type: 'article',
    publishedTime: '2012-02-25',
    authors: ['Michael D'Angelo'],
  },
};

const post = {
  date: '2012-02-25',
  title: 'WebRTC First Look: Peer-to-Peer Video in the Browser',
  content: `WebRTC (Web Real-Time Communication) just landed in Chrome Canary. This technology enables peer-to-peer audio, video, and data sharing directly between browsers. Mind = blown.

## Building a Simple Video Chat

The basics are surprisingly simple:

\`\`\`javascript
// Get user media
navigator.getUserMedia = navigator.getUserMedia || 
                        navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia;

// Get local video stream
navigator.getUserMedia(
  { video: true, audio: true },
  (stream) => {
    const localVideo = document.getElementById('localVideo');
    localVideo.srcObject = stream;
    localStream = stream;
    
    // Ready to connect to peer
    initializePeerConnection();
  },
  (error) => {
    console.error('getUserMedia error:', error);
  }
);
\`\`\`

## The PeerConnection Magic

Setting up peer-to-peer connection:

\`\`\`javascript
function initializePeerConnection() {
  // STUN server helps with NAT traversal
  const configuration = {
    iceServers: [{
      urls: 'stun:stun.l.google.com:19302'
    }]
  };
  
  pc = new webkitRTCPeerConnection(configuration);
  
  // Add local stream
  pc.addStream(localStream);
  
  // Handle remote stream
  pc.onaddstream = (event) => {
    const remoteVideo = document.getElementById('remoteVideo');
    remoteVideo.srcObject = event.stream;
  };
  
  // Handle ICE candidates
  pc.onicecandidate = (event) => {
    if (event.candidate) {
      sendToSignalingServer({
        type: 'ice-candidate',
        candidate: event.candidate
      });
    }
  };
}
\`\`\`

## Signaling Server

The only server needed - just for initial connection:

\`\`\`javascript
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 8080 });

const rooms = new Map();

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const data = JSON.parse(message);
    
    switch(data.type) {
      case 'join':
        joinRoom(ws, data.room);
        break;
        
      case 'offer':
      case 'answer':
      case 'ice-candidate':
        // Relay to other peer in room
        relayToPeer(ws, data);
        break;
    }
  });
});

function joinRoom(ws, roomId) {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, []);
  }
  
  const room = rooms.get(roomId);
  room.push(ws);
  
  if (room.length === 2) {
    // Tell first peer to create offer
    room[0].send(JSON.stringify({ type: 'create-offer' }));
  }
}

function relayToPeer(ws, data) {
  const room = findRoomForSocket(ws);
  if (room) {
    const peer = room.find(s => s !== ws);
    if (peer) {
      peer.send(JSON.stringify(data));
    }
  }
}
\`\`\`

## The Offer/Answer Dance

Establishing the connection:

\`\`\`javascript
// Creating an offer (caller)
async function createOffer() {
  const offer = await pc.createOffer();
  await pc.setLocalDescription(offer);
  
  sendToSignalingServer({
    type: 'offer',
    offer: offer
  });
}

// Handling offer and creating answer (callee)
async function handleOffer(offer) {
  await pc.setRemoteDescription(offer);
  
  const answer = await pc.createAnswer();
  await pc.setLocalDescription(answer);
  
  sendToSignalingServer({
    type: 'answer',
    answer: answer
  });
}

// Handling answer (caller)
async function handleAnswer(answer) {
  await pc.setRemoteDescription(answer);
  // Connection established!
}
\`\`\`

## Data Channels Too!

Not just video - send any data:

\`\`\`javascript
// Create data channel
const dataChannel = pc.createDataChannel('chat', {
  ordered: true,
  maxRetransmits: 3
});

dataChannel.onopen = () => {
  console.log('Data channel opened!');
  dataChannel.send('Hello peer!');
};

dataChannel.onmessage = (event) => {
  console.log('Received:', event.data);
  displayChatMessage(event.data);
};

// Receive data channel on other side
pc.ondatachannel = (event) => {
  const channel = event.channel;
  channel.onmessage = handleDataChannelMessage;
};
\`\`\`

## Building a Screen Sharing Feature

WebRTC can share screens too:

\`\`\`javascript
async function shareScreen() {
  try {
    // Chrome experimental flag needed
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false
    });
    
    // Replace video track
    const videoTrack = stream.getVideoTracks()[0];
    const sender = pc.getSenders().find(
      s => s.track && s.track.kind === 'video'
    );
    
    sender.replaceTrack(videoTrack);
    
    // Switch back when screen share ends
    videoTrack.onended = () => {
      sender.replaceTrack(localStream.getVideoTracks()[0]);
    };
  } catch (err) {
    console.error('Error sharing screen:', err);
  }
}
\`\`\`

## Performance Considerations

Testing connection quality:

\`\`\`javascript
// Monitor connection stats
setInterval(async () => {
  const stats = await pc.getStats();
  
  stats.forEach((report) => {
    if (report.type === 'inbound-rtp' && report.mediaType === 'video') {
      console.log(\`Bitrate: ${report.bytesReceived * 8 / 1000} kbps\`);
      console.log(\`Packets lost: ${report.packetsLost}\`);
      console.log(\`Jitter: ${report.jitter}\`);
    }
  });
}, 1000);
\`\`\`

## Security and Privacy

Important considerations:
- Always use HTTPS
- getUserMedia requires user permission
- Peer connections are encrypted (DTLS)
- No data goes through my servers!

## What This Enables

The possibilities are endless:
- Video conferencing without servers
- Peer-to-peer file sharing
- Collaborative editing
- Distributed CDNs
- Multiplayer games

WebRTC is going to change how we build real-time applications. No more central servers for everything!`,
  tags: ['webrtc', 'peer-to-peer', 'video-chat', 'real-time'],
  readTime: '17 min',
};

export default function WebRTCFirstLookPeertoPeerVideointheBrowserPage() {
  return <BlogPost post={post} />;
}
