'use client';

import React, { useState, useEffect } from 'react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  secret?: boolean;
}

const QUESTIONS = [
  {
    id: 1,
    question: "How many developers use Promptfoo?",
    options: ["50,000+", "75,000+", "125,000+", "200,000+"],
    correct: 2,
    hint: "Check the About page for the latest numbers!",
    fact: "Promptfoo has grown 10x in the last year alone!"
  },
  {
    id: 2,
    question: "How many users did I help reach with SmileID?",
    options: ["50 million", "100 million", "170 million", "250 million"],
    correct: 2,
    hint: "It's one of the largest biometric systems in Africa!",
    fact: "SmileID processes over 1 million verifications daily."
  },
  {
    id: 3,
    question: "At what age did I build my first Tesla coil?",
    options: ["8", "11", "14", "16"],
    correct: 1,
    hint: "I started young, without my parents' permission!",
    fact: "I went on to build one of the first audio-modulated coils."
  },
  {
    id: 4,
    question: "How many countries have I visited?",
    options: ["30+", "40+", "50+", "60+"],
    correct: 2,
    hint: "I've been to every continent except Antarctica!",
    fact: "My favorite trip was to Svalbard in the Arctic."
  },
  {
    id: 5,
    question: "What's the secret code from the terminal?",
    options: ["LASER-TAG-CHAMPION", "TESLA-COIL-11", "OREGON-TRAIL-II", "SATELLITE-BUILDER"],
    correct: 1,
    hint: "Try typing 'secret' in the terminal!",
    fact: "You're really exploring the site!"
  }
];

export default function QuestPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [questComplete, setQuestComplete] = useState(false);
  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: 'first_correct', name: 'Quick Learner', description: 'Got your first answer correct!', unlocked: false },
    { id: 'perfect_score', name: 'Perfectionist', description: 'Answered all questions correctly!', unlocked: false },
    { id: 'hint_master', name: 'Hint Master', description: 'Used hints wisely', unlocked: false },
    { id: 'explorer', name: 'Site Explorer', description: 'Found the terminal secret', unlocked: false, secret: true },
    { id: 'speed_demon', name: 'Speed Demon', description: 'Completed quest in under 2 minutes', unlocked: false },
  ]);
  const [startTime] = useState(Date.now());

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);

    if (answerIndex === QUESTIONS[currentQuestion].correct) {
      setScore(score + 1);
      
      // Unlock first correct achievement
      if (score === 0) {
        unlockAchievement('first_correct');
      }
      
      // Check for explorer achievement
      if (currentQuestion === 4 && answerIndex === 1) {
        unlockAchievement('explorer');
      }
    }

    setTimeout(() => {
      if (currentQuestion < QUESTIONS.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowResult(false);
        setShowHint(false);
      } else {
        completeQuest();
      }
    }, 2000);
  };

  const unlockAchievement = (id: string) => {
    setAchievements(prev => 
      prev.map(ach => ach.id === id ? { ...ach, unlocked: true } : ach)
    );
  };

  const completeQuest = () => {
    setQuestComplete(true);
    
    // Check for perfect score
    if (score === QUESTIONS.length - 1) {
      unlockAchievement('perfect_score');
    }
    
    // Check for speed demon
    const timeTaken = (Date.now() - startTime) / 1000;
    if (timeTaken < 120) {
      unlockAchievement('speed_demon');
    }
    
    // Check for hint master
    if (showHint) {
      unlockAchievement('hint_master');
    }
  };

  const restartQuest = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowHint(false);
    setSelectedAnswer(null);
    setShowResult(false);
    setQuestComplete(false);
  };

  if (questComplete) {
    const unlockedCount = achievements.filter(a => a.unlocked).length;
    
    return (
      <main className="min-h-screen flex items-center justify-center px-6 py-16">
        <div className="max-w-2xl w-full">
          <div className="glass rounded-lg p-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Quest Complete!</h1>
            <p className="text-xl mb-6">
              Your Score: {score}/{QUESTIONS.length}
            </p>
            
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Achievements Unlocked</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.filter(a => a.unlocked).map((achievement) => (
                  <div key={achievement.id} className="glass rounded-lg p-4 text-left">
                    <h3 className="font-semibold">{achievement.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
                  </div>
                ))}
              </div>
              {unlockedCount < achievements.filter(a => !a.secret).length && (
                <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                  {achievements.filter(a => !a.secret).length - unlockedCount} achievements remaining!
                </p>
              )}
            </div>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={restartQuest}
                className="px-6 py-3 bg-black dark:bg-white text-white dark:text-black rounded-lg hover:opacity-80 transition-opacity"
              >
                Try Again
              </button>
              <a
                href="/about"
                className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Learn More About Me
              </a>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const question = QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="max-w-2xl w-full">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-2xl font-semibold">The Michael Quest</h1>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Question {currentQuestion + 1} of {QUESTIONS.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
            <div
              className="bg-black dark:bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="glass rounded-lg p-8">
          <h2 className="text-xl font-semibold mb-6">{question.question}</h2>
          
          <div className="space-y-3 mb-6">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => !showResult && handleAnswer(index)}
                disabled={showResult}
                className={`w-full text-left p-4 rounded-lg transition-all ${
                  showResult && index === question.correct
                    ? 'bg-green-100 dark:bg-green-900 border-green-500'
                    : showResult && index === selectedAnswer && index !== question.correct
                    ? 'bg-red-100 dark:bg-red-900 border-red-500'
                    : 'glass glass-hover'
                } ${!showResult && 'hover:scale-[1.02]'}`}
              >
                {option}
              </button>
            ))}
          </div>

          {showResult && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm">
                <span className="font-semibold">Fun Fact:</span> {question.fact}
              </p>
            </div>
          )}

          {!showResult && !showHint && (
            <button
              onClick={() => setShowHint(true)}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Need a hint?
            </button>
          )}

          {showHint && !showResult && (
            <p className="text-sm text-gray-600 dark:text-gray-400 italic">
              Hint: {question.hint}
            </p>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Score: {score}/{currentQuestion}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}