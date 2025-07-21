import fs from 'fs';

// Read the file
const filePath = './scripts/generate-2009-posts.ts';
let content = fs.readFileSync(filePath, 'utf-8');

// Find all inline backticks (single backticks, not triple backticks)
// We need to escape inline code like `code` to \`code\`
// But not inside code blocks or already escaped backticks

const lines = content.split('\n');
let inCodeBlock = false;
const fixedLines = [];

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  
  // Check if we're entering or exiting a code block
  if (line.includes('```')) {
    inCodeBlock = !inCodeBlock;
    fixedLines.push(line);
    continue;
  }
  
  // Skip if we're inside a code block
  if (inCodeBlock) {
    fixedLines.push(line);
    continue;
  }
  
  // Skip lines that are part of the JSX processing logic
  if (line.includes('.replace(/`/g,') || 
      line.includes('line.startsWith(\'`') ||
      line.includes('.map(tag => `') ||
      line.includes('jsxElements.push(`') ||
      line.includes('console.log(`')) {
    fixedLines.push(line);
    continue;
  }
  
  // Find and escape inline code backticks in content strings
  // This regex looks for backticks that are part of the content, not the code
  if (line.includes('`') && !line.includes('\\`')) {
    // Only process lines that look like content (inside quotes)
    const contentMatch = line.match(/(['"])(.*?)\1/g);
    if (contentMatch) {
      for (const match of contentMatch) {
        const quote = match[0];
        const content = match.slice(1, -1);
        if (content.includes('`')) {
          const escaped = content.replace(/`/g, '\\`');
          line = line.replace(match, quote + escaped + quote);
        }
      }
    }
  }
  
  fixedLines.push(line);
}

// Write back
fs.writeFileSync(filePath, fixedLines.join('\n'));

console.log('Fixed inline backticks in generate-2009-posts.ts');