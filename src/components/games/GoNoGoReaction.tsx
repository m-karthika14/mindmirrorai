import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

interface GoNoGoReactionProps {
  onComplete: (score: number) => void;
}

const GoNoGoReaction: React.FC<GoNoGoReactionProps> = ({ onComplete }) => {
  const [currentStimulus, setCurrentStimulus] = useState<'go' | 'nogo' | null>(null);
  const [score, setScore] = useState(0);
  const [trials, setTrials] = useState(0);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const [stimulusStartTime, setStimulusStartTime] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [correctResponses, setCorrectResponses] = useState(0);
  const [feedback, setFeedback] = useState<string>('');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);

  const totalTrials = 20;
  const stimulusDuration = 1000;
  const interStimulusInterval = 1500;

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (gameStartTime && !isComplete) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - gameStartTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStartTime, isComplete]);

  const showNextStimulus = () => {
    if (trials >= totalTrials) {
      setIsComplete(true);
      const avgReactionTime = reactionTimes.length > 0 
        ? reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length 
        : 1000;
      const accuracy = (correctResponses / totalTrials) * 100;
      const timeScore = Math.max(0, 100 - avgReactionTime / 10);
      const finalScore = Math.round((accuracy + timeScore) / 2);
      setTimeout(() => onComplete(finalScore), 2000);
      return;
    }

    setTimeout(() => {
      const isGo = Math.random() > 0.3; // 70% go stimuli, 30% no-go
      setCurrentStimulus(isGo ? 'go' : 'nogo');
      setStimulusStartTime(Date.now());
      setFeedback('');

      setTimeout(() => {
        if (currentStimulus === 'nogo') {
          // Correct no response for nogo stimulus
          setCorrectResponses(prev => prev + 1);
          setFeedback('Correct!');
        } else {
          // Missed go stimulus
          setFeedback('Too slow!');
        }
        
        setCurrentStimulus(null);
        setStimulusStartTime(null);
        setTrials(prev => prev + 1);
        
        setTimeout(showNextStimulus, interStimulusInterval);
      }, stimulusDuration);
    }, 500);
  };

  useEffect(() => {
    setGameStartTime(Date.now());
    showNextStimulus();
  }, []);

  useEffect(() => {
    const handleSpacebar = (e: KeyboardEvent) => {
      if (e.code === 'Space' && currentStimulus && stimulusStartTime) {
        e.preventDefault();
        const reactionTime = Date.now() - stimulusStartTime;
        
        if (currentStimulus === 'go') {
          // Correct response to go stimulus
          setReactionTimes(prev => [...prev, reactionTime]);
          setCorrectResponses(prev => prev + 1);
          setFeedback(`Great! ${reactionTime}ms`);
        } else {
          // Incorrect response to nogo stimulus
          setFeedback('Stop! No-Go!');
        }
        
        setCurrentStimulus(null);
        setStimulusStartTime(null);
        setTrials(prev => prev + 1);
        
        setTimeout(showNextStimulus, interStimulusInterval);
      }
    };

    window.addEventListener('keydown', handleSpacebar);
    return () => window.removeEventListener('keydown', handleSpacebar);
  }, [currentStimulus, stimulusStartTime]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-8"
    >
      <div className="text-center mb-8">
        <Zap className="w-16 h-16 text-neon-blue mx-auto mb-4 neon-glow-blue" />
        <h2 className="text-3xl font-bold font-poppins text-neon-blue mb-2">
          Go/No-Go Reaction Test
        </h2>
        <p className="text-gray-300 mb-4">Press SPACEBAR for green circles, avoid pressing for red circles</p>
        <div className="text-lg text-neon-cyan">
          Trial {trials + 1} / {totalTrials}
        </div>
      </div>

      <div className="bg-dark-card bg-opacity-50 backdrop-blur-md rounded-xl p-12 neon-border mb-6">
        <div className="flex items-center justify-center h-64">
          {currentStimulus && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className={`w-32 h-32 rounded-full ${
                currentStimulus === 'go' 
                  ? 'bg-neon-cyan neon-glow-cyan' 
                  : 'bg-red-500'
              } flex items-center justify-center`}
            >
              <div className="text-2xl font-bold text-white">
                {currentStimulus === 'go' ? 'GO' : 'STOP'}
              </div>
            </motion.div>
          )}
          
          {!currentStimulus && !isComplete && (
            <div className="text-gray-400 text-xl">Get ready...</div>
          )}
          
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-2xl font-bold ${
                feedback.includes('Correct') || feedback.includes('Great') 
                  ? 'text-neon-cyan' 
                  : 'text-red-400'
              }`}
            >
              {feedback}
            </motion.div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-dark-card bg-opacity-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-neon-blue">{elapsedTime}s</div>
          <div className="text-sm text-gray-400">Time</div>
        </div>
        <div className="bg-dark-card bg-opacity-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-neon-cyan">{correctResponses}</div>
          <div className="text-sm text-gray-400">Correct</div>
        </div>
        <div className="bg-dark-card bg-opacity-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-neon-pink">
            {reactionTimes.length > 0 
              ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
              : 0}ms
          </div>
          <div className="text-sm text-gray-400">Avg RT</div>
        </div>
      </div>

      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-3xl font-bold text-neon-blue mb-2">Reaction Test Complete!</div>
          <div className="text-lg text-gray-300">Analyzing impulse control...</div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default GoNoGoReaction;