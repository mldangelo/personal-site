import fs from 'fs';
import path from 'path';

// Function to properly escape content for JSX
function escapeForJSX(content: string): string {
  return content
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '\\"')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/{/g, '&#123;')
    .replace(/}/g, '&#125;');
}

// Function to convert markdown to proper JSX
function markdownToJSX(content: string): string {
  const lines = content.split('\n');
  const jsxElements: string[] = [];
  let inCodeBlock = false;
  let codeContent: string[] = [];
  let codeLanguage = '';
  let inList = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle code blocks
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLanguage = line.replace('```', '').trim() || 'text';
        codeContent = [];
      } else {
        inCodeBlock = false;
        const escapedCode = codeContent.join('\\n').replace(/'/g, "\\'").replace(/"/g, '\\"');
        jsxElements.push(`            <pre className="language-${codeLanguage}"><code>{\`${escapedCode}\`}</code></pre>`);
      }
      continue;
    }

    if (inCodeBlock) {
      codeContent.push(line);
      continue;
    }

    // Handle empty lines
    if (line.trim() === '') {
      if (inList) {
        jsxElements.push('            </ul>');
        inList = false;
      }
      continue;
    }

    // Handle headers
    if (line.startsWith('### ')) {
      jsxElements.push(`            <h3>${escapeForJSX(line.substring(4))}</h3>`);
    } else if (line.startsWith('## ')) {
      jsxElements.push(`            <h2>${escapeForJSX(line.substring(3))}</h2>`);
    } else if (line.startsWith('# ')) {
      jsxElements.push(`            <h1>${escapeForJSX(line.substring(2))}</h1>`);
    } 
    // Handle list items
    else if (line.startsWith('- ') || line.match(/^\d+\.\s/)) {
      if (!inList) {
        jsxElements.push('            <ul>');
        inList = true;
      }
      const content = line.replace(/^-\s/, '').replace(/^\d+\.\s/, '');
      jsxElements.push(`              <li>${escapeForJSX(content)}</li>`);
    }
    // Handle regular paragraphs
    else {
      if (inList) {
        jsxElements.push('            </ul>');
        inList = false;
      }
      
      // Handle bold text
      let processedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      // Handle inline code
      processedLine = processedLine.replace(/`([^`]+)`/g, '<code>$1</code>');
      
      jsxElements.push(`            <p>${processedLine}</p>`);
    }
  }

  if (inList) {
    jsxElements.push('            </ul>');
  }

  return jsxElements.join('\n');
}

// Read all blog directories
const blogDir = path.join(process.cwd(), 'app/blog');
const blogDirs = fs.readdirSync(blogDir).filter(dir => {
  return fs.statSync(path.join(blogDir, dir)).isDirectory() && /^\d{4}-/.test(dir);
});

console.log(`Found ${blogDirs.length} blog posts to fix`);

// Fix each blog post
blogDirs.forEach(dir => {
  const pagePath = path.join(blogDir, dir, 'page.tsx');
  
  if (!fs.existsSync(pagePath)) {
    console.log(`Skipping ${dir} - no page.tsx found`);
    return;
  }
  
  const content = fs.readFileSync(pagePath, 'utf-8');
  
  // Check if it needs fixing (has problematic patterns)
  if (content.includes('<li>') && !content.includes('<ul>')) {
    console.log(`Fixing ${dir}`);
    
    // Extract the prose content
    const proseMatch = content.match(/<div className="prose[^"]*">\s*([\s\S]*?)\s*<\/div>/);
    
    if (proseMatch) {
      const proseContent = proseMatch[1];
      
      // Convert back to markdown-ish format
      let markdown = proseContent
        .replace(/<p>/g, '')
        .replace(/<\/p>/g, '\n')
        .replace(/<h1>/g, '# ')
        .replace(/<\/h1>/g, '\n')
        .replace(/<h2>/g, '## ')
        .replace(/<\/h2>/g, '\n')
        .replace(/<h3>/g, '### ')
        .replace(/<\/h3>/g, '\n')
        .replace(/<li>/g, '- ')
        .replace(/<\/li>/g, '')
        .replace(/<ul>/g, '')
        .replace(/<\/ul>/g, '')
        .replace(/<pre[^>]*><code>/g, '```\n')
        .replace(/<\/code><\/pre>/g, '\n```')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&amp;/g, '&')
        .replace(/\s*\n\s*\n\s*/g, '\n\n')
        .trim();
      
      // Reconvert to proper JSX
      const newJSX = markdownToJSX(markdown);
      
      // Replace in the original content
      const newContent = content.replace(
        /<div className="prose[^"]*">\s*[\s\S]*?\s*<\/div>/,
        `<div className="prose prose-gray dark:prose-invert max-w-none">\n${newJSX}\n          </div>`
      );
      
      fs.writeFileSync(pagePath, newContent);
    }
  }
});

console.log('Done fixing blog posts!');