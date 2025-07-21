import fs from 'fs';

// Read the file
const filePath = './scripts/generate-2009-posts.ts';
let content = fs.readFileSync(filePath, 'utf-8');

// Replace all ``` with \`\`\`
// But be careful not to replace already escaped ones
content = content.replace(/([^\\])```/g, '$1\\`\\`\\`');

// Fix any cases where we might have double-escaped
content = content.replace(/\\\\```/g, '\\`\\`\\`');

// Write back
fs.writeFileSync(filePath, content);

console.log('Fixed code blocks in generate-2009-posts.ts');