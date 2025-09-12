import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Keyboard } from 'lucide-react';
import NeonButton from '../ui/NeonButton';

interface VirtualTypingProps {
  onComplete: (score: number) => void;
}

const VirtualTyping: React.FC<VirtualTypingProps> = ({ onComplete }) => {
  const [currentText, setCurrentText] = useState('');
  const [targetText, setTargetText] = useState('The quick brown fox jumps over the lazy dog');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [accuracy, setAccuracy] = useState(100);
  const [wpm, setWpm] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const sampleTexts = [
    'The quick brown fox jumps over the lazy dog',
    'Pack my box with five dozen liquor jugs',
    'How vexingly quick daft zebras jump',
    'Bright vixens jump; dozy fowl quack',
    'Sphinx of black quartz, judge my vow'
  ];

  useEffect(() => {
    setTargetText(sampleTexts[Math.floor(Math.random() * sampleTexts.length)]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (startTime && !isComplete) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime, isComplete]);

  useEffect(() => {
    if (currentText.length === 1 && startTime === null) {
      setStartTime(Date.now());
    }

    if (currentText.length > 0) {
      let correct = 0;
      for (let i = 0; i < currentText.length; i++) {
        if (currentText[i] === targetText[i]) {
          correct++;
        }
      }
      setAccuracy(Math.round((correct / currentText.length) * 100));
    }

    if (currentText === targetText && !isComplete) {
      setIsComplete(true);
      const endTime = Date.now();
      if (startTime) {
        const timeInMinutes = (endTime - startTime) / 60000;
        const calculatedWpm = Math.round(targetText.split(' ').length / timeInMinutes);
        setWpm(calculatedWpm);
        
        // Calculate final score based on WPM and accuracy
        const finalScore = Math.round((calculatedWpm * accuracy) / 100);
        setTimeout(() => onComplete(finalScore), 2000);
      }
    }
  }, [currentText, targetText, startTime, isComplete, accuracy, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-8"
    >
      <div className="text-center mb-8">
        <Keyboard className="w-16 h-16 text-neon-cyan mx-auto mb-4 neon-glow-cyan" />
        <h2 className="text-3xl font-bold font-poppins text-neon-purple mb-2">
          Virtual Typing Assessment
        </h2>
        <p className="text-gray-300">Type the text as quickly and accurately as possible</p>
      </div>

      <div className="bg-dark-card bg-opacity-50 backdrop-blur-md rounded-xl p-8 neon-border mb-6">
        <div className="text-2xl font-mono leading-relaxed mb-6 p-4 bg-dark-bg rounded-lg">
          {targetText.split('').map((char, index) => {
            let className = 'text-gray-400';
            if (index < currentText.length) {
              className = currentText[index] === char ? 'text-neon-cyan' : 'text-red-400 bg-red-900 bg-opacity-30';
            } else if (index === currentText.length) {
              className = 'text-white bg-neon-purple bg-opacity-50 animate-pulse';
            }
            return (
              <span key={index} className={className}>
                {char}
              </span>
            );
          })}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={currentText}
          onChange={(e) => setCurrentText(e.target.value)}
          disabled={isComplete}
          className="w-full p-4 text-xl font-mono bg-dark-bg rounded-lg neon-border text-white focus:outline-none focus:neon-glow-cyan"
          placeholder="Start typing here..."
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-dark-card bg-opacity-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-neon-cyan">{accuracy}%</div>
          <div className="text-sm text-gray-400">Accuracy</div>
        </div>
        <div className="bg-dark-card bg-opacity-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-neon-purple">{wpm}</div>
          <div className="text-sm text-gray-400">WPM</div>
        </div>
        <div className="bg-dark-card bg-opacity-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-neon-blue">{elapsedTime}s</div>
          <div className="text-sm text-gray-400">Time</div>
        </div>
        <div className="bg-dark-card bg-opacity-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-neon-pink">{targetText.length - currentText.length}</div>
          <div className="text-sm text-gray-400">Remaining</div>
        </div>
      </div>

      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-3xl font-bold text-neon-cyan mb-2">Assessment Complete!</div>
          <div className="text-lg text-gray-300">Analyzing neural patterns...</div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default VirtualTyping;