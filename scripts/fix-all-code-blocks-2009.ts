import fs from 'fs';

// Read the file
const filePath = './scripts/generate-2009-remaining-posts.ts';
let content = fs.readFileSync(filePath, 'utf-8');

// Replace all ``` with \`\`\` but only in the content strings
// We need to be careful not to replace in the actual code logic

// First, let's handle the multi-line strings
const lines = content.split('\n');
let inPostContent = false;
let contentDepth = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Track when we're inside post content
  if (line.includes('content: `')) {
    inPostContent = true;
    contentDepth = 1;
  }
  
  if (inPostContent) {
    // Count backticks to track nesting
    for (let j = 0; j < line.length; j++) {
      if (line[j] === '`' && line[j-1] !== '\\') {
        if (line[j+1] === '`' && line[j+2] === '`') {
          // Found triple backticks that need escaping
          if (!line.substring(j-1, j+4).includes('\\`\\`\\`')) {
            lines[i] = line.substring(0, j) + '\\`\\`\\`' + line.substring(j+3);
            j += 4; // Skip past what we just added
          }
        }
      }
    }
    
    // Check if we're at the end of the content
    if (line.includes('`,') && line.trim().endsWith('`,')) {
      inPostContent = false;
    }
  }
}

// Write back
fs.writeFileSync(filePath, lines.join('\n'));

console.log('Fixed code blocks in generate-2009-remaining-posts.ts');