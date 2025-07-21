import BlogPost from '@/components/Blog/BlogPost';

export const metadata = {
  title: 'Building a Music Visualizer with Web Audio API',
  description: 'The Web Audio API just landed in Chrome. Creating stunning audio visualizations with JavaScript and Canvas.',
  keywords: ['web-audio-api', 'visualization', 'canvas', 'javascript'],
  openGraph: {
    title: 'Building a Music Visualizer with Web Audio API',
    description: 'The Web Audio API just landed in Chrome. Creating stunning audio visualizations with JavaScript and Canvas.',
    type: 'article',
    publishedTime: '2012-06-05',
    authors: ['Michael D'Angelo'],
  },
};

const post = {
  date: '2012-06-05',
  title: 'Building a Music Visualizer with Web Audio API',
  content: `Chrome just shipped the Web Audio API, opening up incredible possibilities for audio processing in the browser. Built a music visualizer that reacts to audio in real-time!

## Getting Started with Web Audio

The basics of the Web Audio API:

\`\`\`javascript
// Create audio context
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Load and decode audio file
async function loadAudio(url) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return audioBuffer;
}

// Play audio
function playAudio(audioBuffer) {
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);
  source.start();
  return source;
}
\`\`\`

## Creating the Analyzer

Setting up frequency analysis:

\`\`\`javascript
class AudioVisualizer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.audioContext = new AudioContext();
    
    // Create analyzer node
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 2048;
    this.bufferLength = this.analyser.frequencyBinCount;
    this.dataArray = new Uint8Array(this.bufferLength);
    
    // Canvas setup
    this.width = canvas.width;
    this.height = canvas.height;
    
    // Visual settings
    this.barWidth = (this.width / this.bufferLength) * 2.5;
    this.barGap = 1;
  }
  
  connectSource(source) {
    source.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);
  }
  
  draw() {
    requestAnimationFrame(() => this.draw());
    
    // Get frequency data
    this.analyser.getByteFrequencyData(this.dataArray);
    
    // Clear canvas
    this.ctx.fillStyle = 'rgb(0, 0, 0)';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Draw frequency bars
    let x = 0;
    
    for (let i = 0; i < this.bufferLength; i++) {
      const barHeight = (this.dataArray[i] / 255) * this.height;
      
      // Color based on frequency and amplitude
      const r = barHeight + (25 * (i / this.bufferLength));
      const g = 250 * (i / this.bufferLength);
      const b = 50;
      
      this.ctx.fillStyle = \`rgb(${r}, ${g}, ${b})\`;
      this.ctx.fillRect(x, this.height - barHeight, this.barWidth, barHeight);
      
      x += this.barWidth + this.barGap;
    }
  }
}
\`\`\`

## Advanced Visualizations

Creating different visual effects:

\`\`\`javascript
class CircularVisualizer extends AudioVisualizer {
  draw() {
    requestAnimationFrame(() => this.draw());
    
    this.analyser.getByteFrequencyData(this.dataArray);
    
    // Fade effect
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Draw circular visualization
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const radius = 100;
    
    for (let i = 0; i < this.bufferLength; i++) {
      const amplitude = this.dataArray[i] / 255;
      const angle = (i / this.bufferLength) * Math.PI * 2;
      
      // Calculate positions
      const x1 = centerX + Math.cos(angle) * radius;
      const y1 = centerY + Math.sin(angle) * radius;
      const x2 = centerX + Math.cos(angle) * (radius + amplitude * 100);
      const y2 = centerY + Math.sin(angle) * (radius + amplitude * 100);
      
      // Draw line
      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      
      // Color based on amplitude
      const hue = (i / this.bufferLength) * 360;
      this.ctx.strokeStyle = \`hsl(${hue}, 100%, ${50 + amplitude * 50}%)\`;
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
    }
  }
}
\`\`\`

## Waveform Visualization

Showing the actual waveform:

\`\`\`javascript
class WaveformVisualizer extends AudioVisualizer {
  constructor(canvas) {
    super(canvas);
    this.waveArray = new Uint8Array(this.analyser.fftSize);
  }
  
  draw() {
    requestAnimationFrame(() => this.draw());
    
    // Get waveform data
    this.analyser.getByteTimeDomainData(this.waveArray);
    
    // Clear with gradient
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Draw waveform
    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = '#00ff00';
    this.ctx.beginPath();
    
    const sliceWidth = this.width / this.waveArray.length;
    let x = 0;
    
    for (let i = 0; i < this.waveArray.length; i++) {
      const v = this.waveArray[i] / 128.0;
      const y = v * this.height / 2;
      
      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
      
      x += sliceWidth;
    }
    
    this.ctx.stroke();
    
    // Draw frequency bars on top
    this.analyser.getByteFrequencyData(this.dataArray);
    
    for (let i = 0; i < this.bufferLength; i += 10) {
      const barHeight = (this.dataArray[i] / 255) * this.height * 0.5;
      const x = (i / this.bufferLength) * this.width;
      
      this.ctx.fillStyle = \`hsla(${(i / this.bufferLength) * 360}, 100%, 50%, 0.5)\`;
      this.ctx.fillRect(x, this.height - barHeight, 5, barHeight);
    }
  }
}
\`\`\`

## 3D Visualization with Three.js

Taking it to another dimension:

\`\`\`javascript
class ThreeJSVisualizer {
  constructor(container) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(this.renderer.domElement);
    
    // Create visualization objects
    this.bars = [];
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    
    for (let i = 0; i < 32; i++) {
      for (let j = 0; j < 32; j++) {
        const material = new THREE.MeshPhongMaterial({
          color: new THREE.Color(\`hsl(${(i * j) / 1024 * 360}, 100%, 50%)\`)
        });
        const bar = new THREE.Mesh(geometry, material);
        bar.position.set(i - 16, 0, j - 16);
        this.scene.add(bar);
        this.bars.push(bar);
      }
    }
    
    // Lighting
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(0, 20, 0);
    this.scene.add(light);
    
    this.camera.position.set(30, 30, 30);
    this.camera.lookAt(0, 0, 0);
  }
  
  update(dataArray) {
    // Update bar heights based on frequency data
    for (let i = 0; i < this.bars.length; i++) {
      const dataIndex = Math.floor(i / this.bars.length * dataArray.length);
      const scale = dataArray[dataIndex] / 255 * 10 + 0.1;
      this.bars[i].scale.y = scale;
      this.bars[i].position.y = scale / 2;
    }
    
    // Rotate camera
    const time = Date.now() * 0.001;
    this.camera.position.x = Math.cos(time) * 40;
    this.camera.position.z = Math.sin(time) * 40;
    this.camera.lookAt(0, 0, 0);
    
    this.renderer.render(this.scene, this.camera);
  }
}
\`\`\`

## Microphone Input

Visualizing live audio:

\`\`\`javascript
async function setupMicrophoneInput(visualizer) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const source = visualizer.audioContext.createMediaStreamSource(stream);
    visualizer.connectSource(source);
    visualizer.draw();
  } catch (err) {
    console.error('Error accessing microphone:', err);
  }
}
\`\`\`

## Performance Optimization

Keeping it smooth at 60fps:

\`\`\`javascript
class OptimizedVisualizer extends AudioVisualizer {
  constructor(canvas) {
    super(canvas);
    this.skipFrames = 0;
    this.targetFPS = 60;
    this.lastFrameTime = 0;
  }
  
  draw() {
    const now = performance.now();
    const delta = now - this.lastFrameTime;
    
    // Skip frame if running too slow
    if (delta < 1000 / this.targetFPS) {
      requestAnimationFrame(() => this.draw());
      return;
    }
    
    this.lastFrameTime = now;
    
    // Use lower resolution data for better performance
    const step = Math.max(1, Math.floor(this.bufferLength / 128));
    
    this.analyser.getByteFrequencyData(this.dataArray);
    
    // ... render with step
    
    requestAnimationFrame(() => this.draw());
  }
}
\`\`\`

The Web Audio API opens up amazing possibilities for creative audio applications right in the browser!`,
  tags: ['web-audio-api', 'visualization', 'canvas', 'javascript'],
  readTime: '18 min',
};

export default function BuildingaMusicVisualizerwithWebAudioAPIPage() {
  return <BlogPost post={post} />;
}
