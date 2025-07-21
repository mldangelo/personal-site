'use client';

import React, { useState, useEffect } from 'react';
import { useKonamiCode } from '@/hooks/useKonamiCode';

export default function EasterEgg() {
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; emoji: string }>>([]);

  useKonamiCode(() => {
    setShowEasterEgg(true);
    // Create particle explosion
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      emoji: ['🚀', '⭐', '✨', '🎮', '👾', '🎯', '🔥', '💫'][Math.floor(Math.random() * 8)],
    }));
    setParticles(newParticles);

    // Hide after 5 seconds
    setTimeout(() => {
      setShowEasterEgg(false);
      setParticles([]);
    }, 5000);
  });

  if (!showEasterEgg) return null;

  return (
    <>
      {/* Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="fixed text-2xl animate-bounce pointer-events-none z-[100]"
          style={{
            left: particle.x,
            top: particle.y,
            animation: `float-away 3s ease-out forwards`,
          }}
        >
          {particle.emoji}
        </div>
      ))}

      {/* Achievement Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[99] pointer-events-none">
        <div className="bg-black/90 text-white px-8 py-6 rounded-lg animate-bounce-in">
          <h2 className="text-2xl font-bold mb-2">🎮 Achievement Unlocked!</h2>
          <p className="text-gray-300">Konami Code Master</p>
          <p className="text-sm text-gray-400 mt-2">You found the secret! +1337 XP</p>
        </div>
      </div>

      {/* Retro scanlines effect */}
      <div className="fixed inset-0 pointer-events-none z-[98]">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/10 to-transparent animate-scan" />
      </div>

      <style jsx>{`
        @keyframes float-away {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(-200px) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes bounce-in {
          0% {
            transform: scale(0) rotate(-180deg);
            opacity: 0;
          }
          50% {
            transform: scale(1.1) rotate(10deg);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
          }
        }

        @keyframes scan {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }

        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }

        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>
    </>
  );
}