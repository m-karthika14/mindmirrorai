import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

interface NBackMemoryProps {
  onComplete: (score: number) => void;
}

const NBackMemory: React.FC<NBackMemoryProps> = ({ onComplete }) => {
  const [currentPosition, setCurrentPosition] = useState<number | null>(null);
  const [sequence, setSequence] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [trials, setTrials] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [feedback, setFeedback] = useState<string>('');
  const [correctResponses, setCorrectResponses] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);

  const totalTrials = 20;
  const nBack = 2; // 2-back task
  const gridSize = 3;
  const stimulusDuration = 500;
  const interStimulusInterval = 1500;

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStartTime && !isComplete) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - gameStartTime) / 1000);
        setElapsedTime(elapsed);
        if (elapsed >= 30 && !isComplete) {
          setIsComplete(true);
          const accuracy = (correctResponses / Math.max(currentIndex - nBack + 1, 1)) * 100;
          const finalScore = Math.round(accuracy);
          setTimeout(() => onComplete(finalScore), 2000);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStartTime, isComplete, correctResponses, currentIndex, nBack, onComplete]);

  // Generate random sequence
  useEffect(() => {
    const newSequence = Array.from({ length: totalTrials }, () => 
      Math.floor(Math.random() * (gridSize * gridSize))
    );
    setSequence(newSequence);
  }, []);

  const showNextStimulus = () => {
    if (isComplete || elapsedTime >= 30) {
      return;
    }
    if (currentIndex >= totalTrials) {
      setIsComplete(true);
      const accuracy = (correctResponses / Math.max(totalTrials - nBack, 1)) * 100;
      const finalScore = Math.round(accuracy);
      setTimeout(() => onComplete(finalScore), 2000);
      return;
    }

    setCurrentPosition(sequence[currentIndex]);
    setFeedback('');

    setTimeout(() => {
      setCurrentPosition(null);
      
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        showNextStimulus();
      }, interStimulusInterval);
    }, stimulusDuration);
  };

  useEffect(() => {
    if (sequence.length > 0) {
      setGameStartTime(Date.now());
      setTimeout(showNextStimulus, 1000);
    }
  }, [sequence]);

  useEffect(() => {
    const handleSpacebar = (e: KeyboardEvent) => {
      if (e.code === 'Space' && currentPosition !== null && currentIndex >= nBack) {
        e.preventDefault();
        
        const targetPosition = sequence[currentIndex - nBack];
        const isMatch = currentPosition === targetPosition;
        
        if (isMatch) {
          setCorrectResponses(prev => prev + 1);
          setScore(prev => prev + 10);
          setFeedback('Match! +10');
        } else {
          setFeedback('Not a match!');
        }
      }
    };

    window.addEventListener('keydown', handleSpacebar);
    return () => window.removeEventListener('keydown', handleSpacebar);
  }, [currentPosition, currentIndex, sequence, nBack]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-8"
    >
      <div className="text-center mb-8">
        <Brain className="w-16 h-16 text-neon-pink mx-auto mb-4 neon-glow-pink" />
        <h2 className="text-3xl font-bold font-poppins text-neon-pink mb-2">
          N-Back Memory Test
        </h2>
        <p className="text-gray-300 mb-4">
          Press SPACEBAR when the current position matches the position {nBack} steps back
        </p>
        <div className="text-lg text-neon-cyan">
          Trial {currentIndex + 1} / {totalTrials}
        </div>
      </div>

      <div className="bg-dark-card bg-opacity-50 backdrop-blur-md rounded-xl p-8 neon-border mb-6">
        <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
          {Array.from({ length: gridSize * gridSize }).map((_, index) => (
            <motion.div
              key={index}
              className={`aspect-square rounded-lg border-2 ${
                currentPosition === index
                  ? 'bg-neon-cyan neon-glow-cyan border-neon-cyan'
                  : 'border-gray-600 bg-dark-bg'
              } transition-all duration-300`}
              animate={currentPosition === index ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.3 }}
            />
          ))}
        </div>
        
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-center mt-6 text-xl font-bold ${
              feedback.includes('+10') ? 'text-neon-cyan' : 'text-red-400'
            }`}
          >
            {feedback}
          </motion.div>
        )}
        
        {currentIndex < nBack && (
          <div className="text-center mt-6 text-gray-400">
            Building sequence... (No responses needed yet)
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-dark-card bg-opacity-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-neon-blue">{elapsedTime}s</div>
          <div className="text-sm text-gray-400">Time</div>
        </div>
        <div className="bg-dark-card bg-opacity-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-neon-cyan">{score}</div>
          <div className="text-sm text-gray-400">Score</div>
        </div>
        <div className="bg-dark-card bg-opacity-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-neon-pink">
            {currentIndex >= nBack 
              ? Math.round((correctResponses / Math.max(currentIndex - nBack + 1, 1)) * 100)
              : 0}%
          </div>
          <div className="text-sm text-gray-400">Accuracy</div>
        </div>
      </div>

      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-3xl font-bold text-neon-pink mb-2">Memory Test Complete!</div>
          <div className="text-lg text-gray-300">Processing working memory...</div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default NBackMemory;