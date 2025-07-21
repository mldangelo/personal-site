'use client';

import React, { useState, useEffect, useRef } from 'react';

interface Experiment {
  id: string;
  title: string;
  description: string;
  category: 'visualization' | 'simulation' | 'interactive' | 'ml';
  component: React.FC;
}

// Particle Life Simulation
const ParticleLifeSimulation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Particle system
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      type: number;
      color: string;
    }> = [];

    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#F7DC6F'];
    const numTypes = 4;
    const numParticles = 200;
    const attraction = Array(numTypes).fill(0).map(() => 
      Array(numTypes).fill(0).map(() => (Math.random() - 0.5) * 0.1)
    );

    // Initialize particles
    for (let i = 0; i < numParticles; i++) {
      const type = Math.floor(Math.random() * numTypes);
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: 0,
        vy: 0,
        type,
        color: colors[type],
      });
    }

    const animate = () => {
      if (!isRunning) return;

      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update particles
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        
        // Apply forces from other particles
        for (let j = 0; j < particles.length; j++) {
          if (i === j) continue;
          
          const p2 = particles[j];
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          
          if (d > 0 && d < 100) {
            const F = attraction[p1.type][p2.type] / d;
            p1.vx += F * dx;
            p1.vy += F * dy;
          }
        }
        
        // Update position
        p1.x += p1.vx;
        p1.y += p1.vy;
        
        // Damping
        p1.vx *= 0.95;
        p1.vy *= 0.95;
        
        // Boundaries
        if (p1.x < 0 || p1.x > canvas.width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > canvas.height) p1.vy *= -1;
        
        p1.x = Math.max(0, Math.min(canvas.width, p1.x));
        p1.y = Math.max(0, Math.min(canvas.height, p1.y));
        
        // Draw particle
        ctx.fillStyle = p1.color;
        ctx.beginPath();
        ctx.arc(p1.x, p1.y, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning]);

  return (
    <div className="space-y-4">
      <canvas
        ref={canvasRef}
        width={600}
        height={400}
        className="w-full max-w-2xl border border-gray-300 dark:border-gray-700 rounded-lg bg-black"
      />
      <button
        onClick={() => setIsRunning(!isRunning)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {isRunning ? 'Pause' : 'Resume'}
      </button>
    </div>
  );
};

// Conway's Game of Life
const GameOfLife: React.FC = () => {
  const [grid, setGrid] = useState<boolean[][]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [generation, setGeneration] = useState(0);
  const rows = 30;
  const cols = 40;

  useEffect(() => {
    // Initialize empty grid
    const newGrid = Array(rows).fill(null).map(() => Array(cols).fill(false));
    setGrid(newGrid);
  }, []);

  const toggleCell = (i: number, j: number) => {
    const newGrid = grid.map(row => [...row]);
    newGrid[i][j] = !newGrid[i][j];
    setGrid(newGrid);
  };

  const randomize = () => {
    const newGrid = Array(rows).fill(null).map(() => 
      Array(cols).fill(false).map(() => Math.random() > 0.7)
    );
    setGrid(newGrid);
    setGeneration(0);
  };

  const clear = () => {
    setGrid(Array(rows).fill(null).map(() => Array(cols).fill(false)));
    setGeneration(0);
    setIsRunning(false);
  };

  const countNeighbors = (grid: boolean[][], x: number, y: number) => {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        const newX = x + i;
        const newY = y + j;
        if (newX >= 0 && newX < rows && newY >= 0 && newY < cols) {
          count += grid[newX][newY] ? 1 : 0;
        }
      }
    }
    return count;
  };

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setGrid(currentGrid => {
        const newGrid = currentGrid.map((row, i) =>
          row.map((cell, j) => {
            const neighbors = countNeighbors(currentGrid, i, j);
            if (cell) {
              return neighbors === 2 || neighbors === 3;
            } else {
              return neighbors === 3;
            }
          })
        );
        return newGrid;
      });
      setGeneration(gen => gen + 1);
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={randomize}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Randomize
        </button>
        <button
          onClick={clear}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Clear
        </button>
        <span className="text-sm text-gray-600 dark:text-gray-400">
          Generation: {generation}
        </span>
      </div>
      <div className="inline-block border border-gray-300 dark:border-gray-700 rounded overflow-hidden">
        {grid.map((row, i) => (
          <div key={i} className="flex">
            {row.map((cell, j) => (
              <div
                key={`${i}-${j}`}
                onClick={() => toggleCell(i, j)}
                className={`w-4 h-4 border border-gray-200 dark:border-gray-800 cursor-pointer ${
                  cell ? 'bg-green-500' : 'bg-gray-100 dark:bg-gray-900'
                }`}
              />
            ))}
          </div>
        ))}
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Click cells to toggle them. Try patterns like gliders, blinkers, or create your own!
      </p>
    </div>
  );
};

// Fourier Transform Visualization
const FourierVisualization: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [frequency, setFrequency] = useState(2);
  const [amplitude, setAmplitude] = useState(100);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerY = canvas.height / 2;
      
      // Draw sine wave
      ctx.strokeStyle = '#4ECDC4';
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      for (let x = 0; x < canvas.width; x++) {
        const y = centerY + amplitude * Math.sin((x + time) * frequency * 0.01);
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Draw Fourier circles
      const circleX = 100;
      const circleY = centerY;
      
      ctx.strokeStyle = '#FF6B6B';
      ctx.beginPath();
      ctx.arc(circleX, circleY, amplitude, 0, Math.PI * 2);
      ctx.stroke();

      // Draw rotating vector
      const angle = time * frequency * 0.01;
      const vectorX = circleX + amplitude * Math.cos(angle);
      const vectorY = circleY + amplitude * Math.sin(angle);
      
      ctx.strokeStyle = '#F7DC6F';
      ctx.beginPath();
      ctx.moveTo(circleX, circleY);
      ctx.lineTo(vectorX, vectorY);
      ctx.stroke();

      // Draw point
      ctx.fillStyle = '#45B7D1';
      ctx.beginPath();
      ctx.arc(vectorX, vectorY, 5, 0, Math.PI * 2);
      ctx.fill();

      time += 2;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationId);
  }, [frequency, amplitude]);

  return (
    <div className="space-y-4">
      <canvas
        ref={canvasRef}
        width={600}
        height={300}
        className="w-full max-w-2xl border border-gray-300 dark:border-gray-700 rounded-lg bg-black"
      />
      <div className="space-y-2">
        <div>
          <label className="block text-sm font-medium mb-1">
            Frequency: {frequency}
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={frequency}
            onChange={(e) => setFrequency(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Amplitude: {amplitude}
          </label>
          <input
            type="range"
            min="20"
            max="120"
            value={amplitude}
            onChange={(e) => setAmplitude(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

// Neural Network Playground
const NeuralNetworkPlayground: React.FC = () => {
  const [weights, setWeights] = useState<number[][]>([
    [0.5, -0.3, 0.8],
    [0.2, 0.7, -0.4],
  ]);
  const [input, setInput] = useState([1, 0]);
  const [output, setOutput] = useState<number[]>([]);

  const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

  useEffect(() => {
    // Simple forward pass
    const hidden = weights[0].map((_, i) => 
      sigmoid(input.reduce((sum, inp, j) => sum + inp * (weights[j]?.[i] || 0), 0))
    );
    setOutput(hidden);
  }, [input, weights]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center">
        <svg width="400" height="200" className="border border-gray-300 dark:border-gray-700 rounded">
          {/* Input layer */}
          {input.map((val, i) => (
            <g key={`input-${i}`}>
              <circle
                cx="50"
                cy={50 + i * 100}
                r="20"
                fill={val > 0.5 ? '#4ECDC4' : '#333'}
                stroke="#666"
                strokeWidth="2"
              />
              <text x="50" y={55 + i * 100} textAnchor="middle" fill="white" fontSize="12">
                {val.toFixed(1)}
              </text>
            </g>
          ))}
          
          {/* Hidden layer */}
          {output.map((val, i) => (
            <g key={`hidden-${i}`}>
              <circle
                cx="200"
                cy={30 + i * 60}
                r="20"
                fill={`rgba(78, 205, 196, ${val})`}
                stroke="#666"
                strokeWidth="2"
              />
              <text x="200" y={35 + i * 60} textAnchor="middle" fill="white" fontSize="12">
                {val.toFixed(2)}
              </text>
            </g>
          ))}
          
          {/* Connections */}
          {input.map((_, i) =>
            output.map((_, j) => (
              <line
                key={`conn-${i}-${j}`}
                x1="70"
                y1={50 + i * 100}
                x2="180"
                y2={30 + j * 60}
                stroke={weights[i]?.[j] > 0 ? '#4ECDC4' : '#FF6B6B'}
                strokeWidth={Math.abs(weights[i]?.[j] || 0) * 2}
                opacity="0.6"
              />
            ))
          )}
        </svg>
      </div>
      
      <div className="space-y-2">
        <div>
          <label className="block text-sm font-medium mb-1">Input 1: {input[0].toFixed(2)}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={input[0]}
            onChange={(e) => setInput([Number(e.target.value), input[1]])}
            className="w-full"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Input 2: {input[1].toFixed(2)}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={input[1]}
            onChange={(e) => setInput([input[0], Number(e.target.value)])}
            className="w-full"
          />
        </div>
      </div>
      
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Adjust the inputs to see how they flow through the neural network. Line thickness represents weight magnitude, color represents sign.
      </p>
    </div>
  );
};

const experiments: Experiment[] = [
  {
    id: 'particle-life',
    title: 'Particle Life Simulation',
    description: 'Emergent behavior from simple attraction/repulsion rules between particle types',
    category: 'simulation',
    component: ParticleLifeSimulation,
  },
  {
    id: 'game-of-life',
    title: "Conway's Game of Life",
    description: 'Cellular automaton demonstrating complex patterns from simple rules',
    category: 'simulation',
    component: GameOfLife,
  },
  {
    id: 'fourier',
    title: 'Fourier Transform Visualization',
    description: 'See how sine waves can be decomposed into rotating circles',
    category: 'visualization',
    component: FourierVisualization,
  },
  {
    id: 'neural-network',
    title: 'Neural Network Playground',
    description: 'Interactive visualization of a simple neural network forward pass',
    category: 'ml',
    component: NeuralNetworkPlayground,
  },
];

export default function LabPage() {
  const [selectedExperiment, setSelectedExperiment] = useState<Experiment | null>(null);

  return (
    <main className="px-6 py-16 sm:px-12 lg:px-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold mb-4">Lab</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-12">
          Interactive experiments and visualizations. Where code meets creativity.
        </p>

        {!selectedExperiment ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {experiments.map((exp) => (
              <div
                key={exp.id}
                className="glass glass-hover rounded-lg p-6 cursor-pointer"
                onClick={() => setSelectedExperiment(exp)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold">{exp.title}</h3>
                  <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">
                    {exp.category}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{exp.description}</p>
                <button className="mt-4 text-blue-600 dark:text-blue-400 hover:underline">
                  Launch Experiment →
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div>
            <button
              onClick={() => setSelectedExperiment(null)}
              className="mb-6 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              ← Back to experiments
            </button>
            <div className="glass rounded-lg p-8">
              <h2 className="text-2xl font-semibold mb-4">{selectedExperiment.title}</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                {selectedExperiment.description}
              </p>
              <selectedExperiment.component />
            </div>
          </div>
        )}

        {!selectedExperiment && (
          <section className="mt-16">
            <h2 className="text-2xl font-semibold mb-6">About the Lab</h2>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p>
                This is where I experiment with interactive visualizations, simulations, and creative coding. 
                Each experiment is built from scratch using React, Canvas, and WebGL.
              </p>
              <p>
                The goal is to make complex concepts tangible and fun to explore. Whether it's emergence in 
                particle systems, cellular automata, or neural network dynamics, there's something magical 
                about seeing algorithms come to life.
              </p>
              <p>
                All experiments are open source. Feel free to inspect the code, fork, and build your own!
              </p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}