import fs from 'fs';
import path from 'path';
import type { BlogPost } from '../src/data/blog';

const posts2011Final2: BlogPost[] = [
  {
    date: '2011-01-30',
    title: 'Getting Started with Node.js: Server-Side JavaScript',
    summary: 'Node.js is gaining traction. Building my first server-side JavaScript application. Event-driven, non-blocking I/O feels revolutionary.',
    content: `After years of JavaScript being confined to the browser, Node.js (just 2 years old) is changing everything. Today I built my first real server application in JavaScript.

## Why Node.js?

Coming from traditional server languages (PHP, Python, Ruby), Node.js feels different:

\`\`\`javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello from Node.js!');
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
\`\`\`

## The Event Loop

The non-blocking, event-driven architecture is mind-bending at first:

\`\`\`javascript
// Traditional blocking I/O
const data = readFileSync('big-file.txt'); // Blocks here
processData(data);

// Node.js non-blocking I/O
readFile('big-file.txt', (err, data) => {
  if (err) throw err;
  processData(data);
});
// Continues immediately
\`\`\`

## NPM: The Game Changer

NPM (Node Package Manager) already has thousands of packages. Installing dependencies is trivial:

\`\`\`bash
npm install express
npm install socket.io
npm install mongodb
\`\`\`

## Building a Real-Time Chat App

Created a simple chat application using Socket.io:

\`\`\`javascript
const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log('User connected');
  
  socket.on('chat message', (msg) => {
    io.emit('chat message', msg);
  });
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});
\`\`\`

Real-time bidirectional communication in just a few lines!

## Performance Observations

Benchmarked a simple HTTP server:
- Node.js: ~5000 requests/second
- Apache/PHP: ~1000 requests/second
- Python/WSGI: ~800 requests/second

The event-driven model really shines for I/O-heavy operations.

## Early Ecosystem Challenges

Not everything is smooth:
- Debugging async code is hard
- Callback hell is real
- Library ecosystem is young
- No standard project structure

## Future Potential

Despite the rough edges, JavaScript on the server feels like the future:
- One language for full stack
- JSON native
- Real-time apps are trivial
- Growing community

Ryan Dahl might be onto something big here. Time to rewrite some services in Node.js!`,
    tags: ['nodejs', 'javascript', 'server', 'real-time'],
    readTime: '15 min',
  },
  {
    date: '2011-03-30',
    title: 'WebGL Launch: 3D Graphics in the Browser',
    summary: 'WebGL 1.0 just launched! No more plugins for 3D graphics. Building my first shader-based visualization in the browser.',
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
  },
  {
    date: '2011-08-20',
    title: 'Google+ Launch: Can It Challenge Facebook?',
    summary: 'Got my Google+ invite! Exploring Google\'s take on social networking. Circles are clever, but will anyone switch from Facebook?',
    content: `Just got my coveted Google+ invite! Google's latest attempt at social networking is here, and it's... actually pretty good?

## First Impressions

The UI is clean, fast, and feels more "grown-up" than Facebook:
- Material design elements
- Generous whitespace
- Fast loading
- No ads (yet)

## Circles: Privacy Done Right

The Circles concept is brilliant. Finally, a social network that understands relationships have context:

- Family Circle: Parents, siblings
- Friends Circle: Close friends only
- Acquaintances: That guy from the conference
- Following: Public figures, tech leaders

Sharing is contextual - I can share party photos with friends without my boss seeing them.

## Hangouts: Video Chat That Works

Tried Hangouts with Stanford colleagues:
- Up to 10 people video chat
- Automatic speaker switching
- Screen sharing built-in
- No plugins required

This could replace Skype for group calls.

## The Stream

The feed (called Stream) feels cleaner than Facebook:
- No game invites
- Better formatting for long posts
- +1 instead of Like (subtle but different)
- Inline photo viewing

## Sparks: Interest-Based Discovery

Sparks aggregates content around interests:
- "Machine Learning" spark
- "Robotics" spark
- "Space Exploration" spark

Like RSS feeds but social.

## Early Adopter Paradise

Right now it's mostly tech people:
- Actual discussions in comments
- High-quality content
- No memes (yet)
- Real names policy

## Integration with Google Services

The ecosystem play is obvious:
- Gmail integration
- YouTube comments
- Google Docs sharing
- Android deep integration

## Will It Survive?

Challenges ahead:
- Facebook has 750 million users
- Network effects are strong
- Google's social track record (Wave, Buzz)
- Needs mainstream appeal

## My Take

Google+ is the best-designed social network yet. But being better might not be enough when everyone's already on Facebook.

Still, I'm moving my tech discussions here. The signal-to-noise ratio is incredible right now. Let's see if it lasts.

Anyone need an invite?`,
    tags: ['google-plus', 'social-media', 'technology', 'review'],
    readTime: '14 min',
  },
  {
    date: '2011-11-05',
    title: 'Building with Bootstrap: Twitter\'s Gift to Web Developers',
    summary: 'Twitter just open-sourced Bootstrap. This CSS framework might finally make me a competent front-end developer.',
    content: `Twitter just released Bootstrap to the world, and it's a game-changer for those of us who can't CSS our way out of a paper bag.

## The Problem It Solves

As a backend/embedded engineer, my web UIs always looked like:
- Misaligned forms
- Inconsistent buttons
- Tables from 1995
- "Best viewed in Netscape"

## Bootstrap to the Rescue

With Bootstrap, I can build professional-looking UIs:

\`\`\`html
<div class="container">
  <div class="row">
    <div class="span8">
      <h1>My App</h1>
      <p class="lead">Now with actual design!</p>
    </div>
    <div class="span4">
      <div class="well">
        <h3>Sidebar</h3>
        <p>Look, it's properly aligned!</p>
      </div>
    </div>
  </div>
</div>
\`\`\`

## The Grid System

12-column responsive grid that just works:
- span1 through span12
- Nested grids
- Responsive breakpoints
- No more float nightmares

## Pre-Styled Components

Everything I need out of the box:
- Buttons that don't look terrible
- Forms with proper spacing
- Navigation bars
- Modals and dropdowns
- Alerts and badges

\`\`\`html
<button class="btn btn-primary">I'm Pretty!</button>
<button class="btn btn-danger">Delete</button>
<button class="btn btn-large btn-success">Big Green Button</button>
\`\`\`

## JavaScript Plugins

Included jQuery plugins for common patterns:
- Tooltips
- Popovers
- Accordions
- Carousels
- Typeahead

## Rebuilt My Portfolio Site

Converted my embarrassing portfolio to Bootstrap in 2 hours:
- Before: Tables and inline styles
- After: Responsive, professional, modern

## The Community Response

GitHub is exploding with Bootstrap themes:
- Admin dashboards
- Landing pages
- Full applications
- WordPress themes

## Customization Options

LESS files for easy customization:
- Change colors
- Adjust spacing
- Modify components
- Build your theme

## Impact on Web Development

This democratizes good design:
- Engineers can build decent UIs
- Consistent look across projects
- Faster prototyping
- Mobile-first approach

## The Future

Bootstrap might become the jQuery of CSS - ubiquitous and essential.

Thank you Twitter for making me look like I know design!`,
    tags: ['bootstrap', 'css', 'web-development', 'design'],
    readTime: '13 min',
  },
];

// Generate posts
async function generatePosts() {
  console.log('🚀 Starting blog post generation for 2011 final posts 2...\n');
  
  let createdCount = 0;
  
  for (const post of posts2011Final2) {
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
   Year: 2011
   Topics: Node.js, WebGL, Google+, Bootstrap`);
}

generatePosts().catch(console.error);