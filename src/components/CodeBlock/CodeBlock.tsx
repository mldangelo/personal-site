'use client';

import React, { useEffect, useRef } from 'react';

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
}

export default function CodeBlock({ code, language = 'javascript', showLineNumbers = true }: CodeBlockProps) {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Simple syntax highlighting using CSS
    if (codeRef.current) {
      // This is a simplified version. In production, you'd use Prism.js or similar
      const highlighted = highlightCode(code, language);
      codeRef.current.innerHTML = highlighted;
    }
  }, [code, language]);

  const highlightCode = (code: string, lang: string): string => {
    // Basic syntax highlighting patterns
    const patterns: Record<string, Array<{ pattern: RegExp; className: string }>> = {
      javascript: [
        { pattern: /\b(const|let|var|function|return|if|else|for|while|class|import|export|default|from)\b/g, className: 'keyword' },
        { pattern: /\b(true|false|null|undefined)\b/g, className: 'boolean' },
        { pattern: /\b(\d+)\b/g, className: 'number' },
        { pattern: /(["'`])(?:(?=(\\?))\2.)*?\1/g, className: 'string' },
        { pattern: /\/\/.*$/gm, className: 'comment' },
        { pattern: /\/\*[\s\S]*?\*\//g, className: 'comment' },
      ],
      typescript: [
        { pattern: /\b(const|let|var|function|return|if|else|for|while|class|import|export|default|from|type|interface|enum)\b/g, className: 'keyword' },
        { pattern: /\b(true|false|null|undefined)\b/g, className: 'boolean' },
        { pattern: /\b(\d+)\b/g, className: 'number' },
        { pattern: /(["'`])(?:(?=(\\?))\2.)*?\1/g, className: 'string' },
        { pattern: /\/\/.*$/gm, className: 'comment' },
        { pattern: /\/\*[\s\S]*?\*\//g, className: 'comment' },
        { pattern: /\b(string|number|boolean|any|void|never)\b/g, className: 'type' },
      ],
      python: [
        { pattern: /\b(def|class|import|from|return|if|else|elif|for|while|try|except|finally|with|as|pass|break|continue)\b/g, className: 'keyword' },
        { pattern: /\b(True|False|None)\b/g, className: 'boolean' },
        { pattern: /\b(\d+)\b/g, className: 'number' },
        { pattern: /(["'])(?:(?=(\\?))\2.)*?\1/g, className: 'string' },
        { pattern: /#.*$/gm, className: 'comment' },
      ],
    };

    let highlighted = code;
    const langPatterns = patterns[lang] || patterns.javascript;

    // Escape HTML
    highlighted = highlighted
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Apply highlighting
    langPatterns.forEach(({ pattern, className }) => {
      highlighted = highlighted.replace(pattern, (match) => `<span class="${className}">${match}</span>`);
    });

    return highlighted;
  };

  const lines = code.split('\n');

  return (
    <div className="relative group">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => navigator.clipboard.writeText(code)}
          className="px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
        >
          Copy
        </button>
      </div>
      <pre className="overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm">
        <code ref={codeRef} className={`language-${language}`}>
          {showLineNumbers
            ? lines.map((line, i) => (
                <div key={i} className="table-row">
                  <span className="table-cell pr-4 text-gray-500 select-none">{i + 1}</span>
                  <span className="table-cell">{line}</span>
                </div>
              ))
            : code}
        </code>
      </pre>
      <style jsx global>{`
        .language-${language} .keyword { color: #ff79c6; }
        .language-${language} .boolean { color: #bd93f9; }
        .language-${language} .number { color: #f1fa8c; }
        .language-${language} .string { color: #8be9fd; }
        .language-${language} .comment { color: #6272a4; }
        .language-${language} .type { color: #50fa7b; }
      `}</style>
    </div>
  );
}