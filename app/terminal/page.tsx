'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Command {
  input: string;
  output: string | React.ReactNode;
}

const COMMANDS = {
  help: {
    description: 'Show available commands',
    output: (
      <div>
        <p className="mb-2">Available commands:</p>
        <div className="ml-4 space-y-1">
          <p><span className="text-green-400">help</span> - Show this help message</p>
          <p><span className="text-green-400">about</span> - Learn about me</p>
          <p><span className="text-green-400">skills</span> - List technical skills</p>
          <p><span className="text-green-400">contact</span> - Get contact information</p>
          <p><span className="text-green-400">projects</span> - View recent projects</p>
          <p><span className="text-green-400">resume</span> - Download resume</p>
          <p><span className="text-green-400">secret</span> - Find the hidden command</p>
          <p><span className="text-green-400">clear</span> - Clear terminal</p>
        </div>
      </div>
    ),
  },
  about: {
    description: 'Learn about me',
    output: (
      <div className="space-y-2">
        <p>Michael D\'Angelo</p>
        <p>CTO & Co-founder at Promptfoo</p>
        <p>Building open-source LLM security tools for 125,000+ developers</p>
        <p>Previously: VP Engineering at SmileID (170M users)</p>
      </div>
    ),
  },
  skills: {
    description: 'List technical skills',
    output: (
      <div>
        <p className="mb-2">Technical Skills:</p>
        <div className="grid grid-cols-2 gap-4 ml-4">
          <div>
            <p className="text-green-400">Languages</p>
            <p>TypeScript, Python, Go, Rust</p>
          </div>
          <div>
            <p className="text-green-400">AI/ML</p>
            <p>PyTorch, TensorFlow, LLMs</p>
          </div>
          <div>
            <p className="text-green-400">Infrastructure</p>
            <p>AWS, Docker, Kubernetes</p>
          </div>
          <div>
            <p className="text-green-400">Databases</p>
            <p>PostgreSQL, Redis, DynamoDB</p>
          </div>
        </div>
      </div>
    ),
  },
  contact: {
    description: 'Get contact information',
    output: (
      <div className="space-y-1">
        <p>Email: michael@mldangelo.com</p>
        <p>GitHub: github.com/mldangelo</p>
        <p>LinkedIn: linkedin.com/in/michaelldangelo</p>
        <p>Twitter: @dangelosaurus</p>
      </div>
    ),
  },
  projects: {
    description: 'View recent projects',
    output: (
      <div className="space-y-2">
        <p className="text-green-400">Recent Projects:</p>
        <p>• Promptfoo - LLM vulnerability scanner (125k+ users)</p>
        <p>• SmileID - Biometric verification (170M users)</p>
        <p>• Arthena - Art investment platform ($1.5B valued)</p>
        <p>• Satellite Systems - 60+ person team</p>
      </div>
    ),
  },
  resume: {
    description: 'Download resume',
    output: <p>Opening resume... <a href="/resume" className="text-blue-400 hover:underline">View Resume →</a></p>,
  },
  secret: {
    description: 'Hidden command',
    output: '🎉 You found it! The secret code is: TESLA-COIL-11',
  },
  clear: {
    description: 'Clear terminal',
    output: 'CLEAR',
  },
  // Easter eggs
  'sudo rm -rf /': {
    output: '🚫 Nice try! Permission denied. This incident will be reported.',
  },
  'ls -la': {
    output: (
      <div className="font-mono text-sm">
        <p>drwxr-xr-x  5 michael  staff   160 Jan 19 12:00 .</p>
        <p>drwxr-xr-x  3 michael  staff    96 Jan 19 11:00 ..</p>
        <p>-rw-r--r--  1 michael  staff  1337 Jan 19 12:00 .secret</p>
        <p>-rw-r--r--  1 michael  staff  2048 Jan 19 12:00 resume.pdf</p>
        <p>drwxr-xr-x  4 michael  staff   128 Jan 19 12:00 projects/</p>
      </div>
    ),
  },
  'cat .secret': {
    output: '🔐 The real treasure was the friends we made along the way.',
  },
  whoami: {
    output: 'visitor@mldangelo.com',
  },
  pwd: {
    output: '/home/michael/public',
  },
  date: {
    output: new Date().toString(),
  },
  echo: {
    output: 'Usage: echo [text]',
  },
};

export default function TerminalPage() {
  const [history, setHistory] = useState<Command[]>([
    { input: '', output: 'Welcome to Michael\'s Terminal! Type "help" to get started.' }
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    terminalRef.current?.scrollTo(0, terminalRef.current.scrollHeight);
  }, [history]);

  const handleCommand = (input: string) => {
    const trimmedInput = input.trim().toLowerCase();
    let output: string | React.ReactNode = 'Command not found. Type "help" for available commands.';

    if (trimmedInput.startsWith('echo ')) {
      output = input.substring(5);
    } else if (COMMANDS[trimmedInput as keyof typeof COMMANDS]) {
      const command = COMMANDS[trimmedInput as keyof typeof COMMANDS];
      output = command.output;
    }

    if (output === 'CLEAR') {
      setHistory([{ input: '', output: 'Terminal cleared. Type "help" to get started.' }]);
    } else {
      setHistory([...history, { input, output }]);
    }

    setCommandHistory([...commandHistory, input]);
    setHistoryIndex(-1);
    setCurrentInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCommand(currentInput);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentInput('');
      }
    }
  };

  return (
    <main className="min-h-screen bg-black text-green-400 font-mono p-4">
      <div className="max-w-4xl mx-auto h-[calc(100vh-2rem)]">
        <div className="glass bg-black/90 rounded-lg p-6 h-full flex flex-col">
          <div className="mb-4 border-b border-green-400/30 pb-2">
            <h1 className="text-xl">Terminal v1.0.0</h1>
            <p className="text-sm text-green-400/70">Interactive command line interface</p>
          </div>
          
          <div ref={terminalRef} className="flex-1 overflow-y-auto space-y-2">
            {history.map((cmd, index) => (
              <div key={index}>
                {cmd.input && (
                  <div className="flex items-center gap-2">
                    <span className="text-blue-400">visitor@mldangelo.com</span>
                    <span className="text-gray-400">$</span>
                    <span>{cmd.input}</span>
                  </div>
                )}
                <div className="ml-4 text-gray-300">{cmd.output}</div>
              </div>
            ))}
            
            <div className="flex items-center gap-2">
              <span className="text-blue-400">visitor@mldangelo.com</span>
              <span className="text-gray-400">$</span>
              <input
                ref={inputRef}
                type="text"
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent outline-none text-green-400"
                autoFocus
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}