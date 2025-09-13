import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProgressBar from '../components/ui/ProgressBar';
import GameSequence from '../components/games/GameSequence';

const GameFlowPage: React.FC = () => {
  const [currentGameIndex] = useState(0);
  const [totalElapsedTime, setTotalElapsedTime] = useState(0);
  const [sessionStartTime] = useState(Date.now());

  const games = [
    // { component: VirtualTyping, name: 'Typing' },
    { component: GameSequence, name: 'Cognitive Games' },
    // { component: GoNoGoReaction, name: 'Reaction' },
    // { component: NBackMemory, name: 'Memory' },
    // { component: TrailMakingTest, name: 'Trails' },
  ];

  const gameNames = games.map(game => game.name);
  const CurrentGameComponent = games[currentGameIndex]?.component;

  // Update total elapsed time
  useEffect(() => {
    const interval = setInterval(() => {
      setTotalElapsedTime(Math.floor((Date.now() - sessionStartTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [sessionStartTime]);

  return (
    <div className="min-h-screen gradient-bg">
      <ProgressBar 
        currentGame={currentGameIndex} 
        totalGames={games.length} 
        gameNames={gameNames}
        elapsedTime={totalElapsedTime}
      />
      
      <div className="container mx-auto px-4 pb-8">
        <motion.div
          key={currentGameIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="bg-dark-card bg-opacity-30 backdrop-blur-md rounded-2xl neon-border min-h-[600px]"
        >
          {CurrentGameComponent && (
            <CurrentGameComponent />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default GameFlowPage;