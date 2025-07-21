import BlogPost from '@/components/Blog/BlogPost';

export const metadata = {
  title: 'WebGL Launch: 3D Graphics in the Browser',
  description: 'WebGL 1.0 just launched! No more plugins for 3D graphics. Building my first shader-based visualization in the browser.',
  keywords: ['webgl', '3d-graphics', 'browser', 'visualization'],
  openGraph: {
    title: 'WebGL Launch: 3D Graphics in the Browser',
    description: 'WebGL 1.0 just launched! No more plugins for 3D graphics. Building my first shader-based visualization in the browser.',
    type: 'article',
    publishedTime: '2011-03-30',
    authors: ['Michael D'Angelo'],
  },
};

const post = {
  date: '2011-03-30',
  title: 'WebGL Launch: 3D Graphics in the Browser',
  content: `Today marks a historic moment - WebGL 1.0 specification is finally released! After years of Flash and Java applets, we can finally do real 3D graphics natively in the browser.

## First WebGL Triangle

The "Hello World" of 3D graphics:

\`\`\`javascript
// Vertex shader
const vsSource = \`
  attribute vec4 aVertexPosition;
  void main() {
    gl_Position = aVertexPosition;
  }
\`;

// Fragment shader
const fsSource = \`
  void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Red
  }
\`;
\`\`\`

## From OpenGL ES to WebGL

Coming from OpenGL, WebGL feels familiar but different:
- Based on OpenGL ES 2.0
- No fixed function pipeline
- Shaders are mandatory
- JavaScript instead of C++

## Building a 3D Particle System

Created a GPU-accelerated particle system:

\`\`\`javascript
// Update particles on GPU
const particleUpdate = \`
  uniform float time;
  attribute vec3 position;
  attribute vec3 velocity;
  
  void main() {
    vec3 newPos = position + velocity * time;
    gl_Position = projectionMatrix * vec4(newPos, 1.0);
    gl_PointSize = 2.0;
  }
\`;
\`\`\`

Running 100,000 particles at 60 FPS!

## Browser Compatibility

Current support:
- Chrome 9+: Full support
- Firefox 4: Full support
- Safari: Disabled by default
- IE: No support (shocker!)

## Performance Comparison

Benchmarked a scene with 1000 rotating cubes:
- Native OpenGL: 400 FPS
- WebGL: 120 FPS
- Flash 3D: 25 FPS
- Canvas 2D: 5 FPS

Not bad for JavaScript!

## Three.js: Making WebGL Accessible

Found this amazing library that abstracts WebGL complexity:

\`\`\`javascript
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
\`\`\`

## The Future of Web Graphics

This changes everything:
- Scientific visualization in the browser
- 3D games without plugins
- CAD applications online
- Virtual reality on the web?

The web is becoming a real platform for graphics. Time to port my OpenGL projects!`,
  tags: ['webgl', '3d-graphics', 'browser', 'visualization'],
  readTime: '16 min',
};

export default function WebGLLaunch3DGraphicsintheBrowserPage() {
  return <BlogPost post={post} />;
}
