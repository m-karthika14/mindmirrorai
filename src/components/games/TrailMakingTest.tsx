import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Target } from 'lucide-react';

interface TrailMakingTestProps {
  onComplete: (score: number) => void;
}

const TrailMakingTest: React.FC<TrailMakingTestProps> = ({ onComplete }) => {
  const [targets, setTargets] = useState<{ x: number; y: number; number: number; connected: boolean }[]>([]);
  const [currentTarget, setCurrentTarget] = useState(1);
  const [path, setPath] = useState<{ x: number; y: number }[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [errors, setErrors] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  const totalTargets = 15;

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (startTime && !isComplete) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        setElapsedTime(elapsed);
        if (elapsed >= 30 && !isComplete) {
          setIsComplete(true);
          // Calculate score based on time and errors
          const timeScore = Math.max(0, 100 - elapsed * 2);
          const errorPenalty = errors * 10;
          const finalScore = Math.round(Math.max(0, timeScore - errorPenalty));
          setTimeout(() => onComplete(finalScore), 2000);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime, isComplete, errors, onComplete]);

  // Generate random positions for targets
  useEffect(() => {
    const newTargets = Array.from({ length: totalTargets }, (_, index) => ({
      x: 100 + Math.random() * 600,
      y: 100 + Math.random() * 400,
      number: index + 1,
      connected: false
    }));
    setTargets(newTargets);
  }, []);

  const handleTargetClick = (targetNumber: number, targetX: number, targetY: number) => {
    if (isComplete || elapsedTime >= 30) {
      return;
    }

    if (!startTime) {
      setStartTime(Date.now());
    }

    if (targetNumber === currentTarget) {
      // Correct target clicked
      setTargets(prev => prev.map(t => 
        t.number === targetNumber ? { ...t, connected: true } : t
      ));
      setPath(prev => [...prev, { x: targetX, y: targetY }]);
      
      if (targetNumber === totalTargets) {
        setIsComplete(true);
        const endTime = Date.now();
        const timeInSeconds = startTime ? (endTime - startTime) / 1000 : 60;
        
        // Calculate score based on time and errors
        const timeScore = Math.max(0, 100 - timeInSeconds * 2);
        const errorPenalty = errors * 10;
        const finalScore = Math.round(Math.max(0, timeScore - errorPenalty));
        
        setTimeout(() => onComplete(finalScore), 2000);
      } else {
        setCurrentTarget(prev => prev + 1);
      }
    } else {
      // Wrong target clicked
      setErrors(prev => prev + 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto p-8"
    >
      <div className="text-center mb-6">
        <Target className="w-16 h-16 text-neon-cyan mx-auto mb-4 neon-glow-cyan" />
        <h2 className="text-3xl font-bold font-poppins text-neon-cyan mb-2">
          Trail Making Test
        </h2>
        <p className="text-gray-300 mb-4">Click the numbers in order from 1 to {totalTargets}</p>
        <div className="text-lg text-neon-purple">
          Next Target: {currentTarget}
        </div>
      </div>

      <div className="bg-dark-card bg-opacity-50 backdrop-blur-md rounded-xl p-4 neon-border mb-6 relative h-96 overflow-hidden">
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {path.map((point, index) => {
            if (index === 0) return null;
            const prevPoint = path[index - 1];
            return (
              <motion.line
                key={index}
                x1={prevPoint.x}
                y1={prevPoint.y}
                x2={point.x}
                y2={point.y}
                stroke="#22d3ee"
                strokeWidth="3"
                className="neon-glow-cyan"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3 }}
              />
            );
          })}
        </svg>

        {targets.map((target) => (
          <motion.button
            key={target.number}
            onClick={() => handleTargetClick(target.number, target.x, target.y)}
            className={`absolute w-12 h-12 rounded-full border-2 font-bold text-sm transition-all duration-300 ${
              target.connected
                ? 'bg-neon-cyan border-neon-cyan text-dark-bg neon-glow-cyan'
                : target.number === currentTarget
                ? 'bg-neon-purple border-neon-purple text-white neon-glow animate-pulse'
                : 'bg-dark-bg border-gray-500 text-white hover:border-neon-pink'
            }`}
            style={{
              left: `${(target.x / 800) * 100}%`,
              top: `${(target.y / 500) * 100}%`,
              transform: 'translate(-50%, -50%)'
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={target.connected}
          >
            {target.number}
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-dark-card bg-opacity-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-neon-cyan">{currentTarget - 1}</div>
          <div className="text-sm text-gray-400">Connected</div>
        </div>
        <div className="bg-dark-card bg-opacity-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-neon-purple">
            {elapsedTime}s
          </div>
          <div className="text-sm text-gray-400">Time</div>
        </div>
        <div className="bg-dark-card bg-opacity-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-400">{errors}</div>
          <div className="text-sm text-gray-400">Errors</div>
        </div>
      </div>

      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-3xl font-bold text-neon-cyan mb-2">Trail Complete!</div>
          <div className="text-lg text-gray-300">Analyzing executive function...</div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TrailMakingTest;