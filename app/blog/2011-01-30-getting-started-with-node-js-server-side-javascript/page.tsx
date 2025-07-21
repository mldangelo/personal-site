import BlogPost from '@/components/Blog/BlogPost';

export const metadata = {
  title: 'Getting Started with Node.js: Server-Side JavaScript',
  description: 'Node.js is gaining traction. Building my first server-side JavaScript application. Event-driven, non-blocking I/O feels revolutionary.',
  keywords: ['nodejs', 'javascript', 'server', 'real-time'],
  openGraph: {
    title: 'Getting Started with Node.js: Server-Side JavaScript',
    description: 'Node.js is gaining traction. Building my first server-side JavaScript application. Event-driven, non-blocking I/O feels revolutionary.',
    type: 'article',
    publishedTime: '2011-01-30',
    authors: ['Michael D'Angelo'],
  },
};

const post = {
  date: '2011-01-30',
  title: 'Getting Started with Node.js: Server-Side JavaScript',
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
};

export default function GettingStartedwithNodejsServerSideJavaScriptPage() {
  return <BlogPost post={post} />;
}
