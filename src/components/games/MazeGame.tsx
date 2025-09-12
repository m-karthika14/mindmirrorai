import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from 'lucide-react';

interface MazeGameProps {
  onComplete: (score: number) => void;
}

const MazeGame: React.FC<MazeGameProps> = ({ onComplete }) => {
  const mazeSize = 15;
  const [playerPos, setPlayerPos] = useState({ x: 1, y: 1 });
  const [startTime, setStartTime] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Simple maze layout (1 = wall, 0 = path, 2 = goal)
  const maze = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,0,1,1,1,1,1,1,1,0,1],
    [1,0,1,0,0,0,0,0,0,0,0,0,1,0,1],
    [1,0,1,1,1,1,1,1,1,0,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,1,0,1,0,0,0,1],
    [1,1,1,1,0,1,1,0,1,0,1,1,1,0,1],
    [1,0,0,0,0,1,0,0,1,0,0,0,0,0,1],
    [1,0,1,1,0,1,0,1,1,1,1,1,1,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,1,0,1],
    [1,1,0,1,1,1,1,1,1,0,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,1,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ];

  const goalPos = { x: 13, y: 13 };

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

  const movePlayer = useCallback((dx: number, dy: number) => {
    if (isComplete) return;
    
    setPlayerPos(prev => {
      const newX = prev.x + dx;
      const newY = prev.y + dy;
      
      if (newX >= 0 && newX < mazeSize && newY >= 0 && newY < mazeSize && maze[newY][newX] !== 1) {
        setMoves(m => m + 1);
        
        if (!startTime) {
          setStartTime(Date.now());
        }
        
        if (newX === goalPos.x && newY === goalPos.y) {
          setIsComplete(true);
          const endTime = Date.now();
          const timeInSeconds = startTime ? (endTime - startTime) / 1000 : 60;
          
          // Calculate score based on time and moves (lower is better)
          const timeScore = Math.max(0, 100 - timeInSeconds);
          const moveScore = Math.max(0, 100 - moves);
          const finalScore = Math.round((timeScore + moveScore) / 2);
          
          setTimeout(() => onComplete(finalScore), 2000);
        }
        
        return { x: newX, y: newY };
      }
      return prev;
    });
  }, [isComplete, maze, moves, startTime, onComplete, goalPos.x, goalPos.y]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          e.preventDefault();
          movePlayer(0, -1);
          break;
        case 'ArrowDown':
        case 's':
          e.preventDefault();
          movePlayer(0, 1);
          break;
        case 'ArrowLeft':
        case 'a':
          e.preventDefault();
          movePlayer(-1, 0);
          break;
        case 'ArrowRight':
        case 'd':
          e.preventDefault();
          movePlayer(1, 0);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [movePlayer]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-8"
    >
      <div className="text-center mb-8">
        <Navigation className="w-16 h-16 text-neon-purple mx-auto mb-4 neon-glow" />
        <h2 className="text-3xl font-bold font-poppins text-neon-purple mb-2">
          Neural Maze Navigation
        </h2>
        <p className="text-gray-300 mb-4">Navigate through the maze to reach the goal</p>
        <p className="text-sm text-gray-400">Use WASD or Arrow keys to move</p>
      </div>

      <div className="bg-dark-card bg-opacity-50 backdrop-blur-md rounded-xl p-6 neon-border mb-6">
        <div className="grid grid-cols-15 gap-1 max-w-md mx-auto" style={{ gridTemplateColumns: `repeat(${mazeSize}, minmax(0, 1fr))` }}>
          {maze.map((row, y) =>
            row.map((cell, x) => {
              const isPlayer = x === playerPos.x && y === playerPos.y;
              const isGoal = x === goalPos.x && y === goalPos.y;
              
              return (
                <div
                  key={`${x}-${y}`}
                  className={`aspect-square rounded-sm ${
                    cell === 1
                      ? 'bg-gray-700'
                      : isPlayer
                      ? 'bg-neon-cyan neon-glow-cyan'
                      : isGoal
                      ? 'bg-neon-pink neon-glow-pink'
                      : 'bg-dark-bg'
                  } transition-all duration-300`}
                >
                  {isPlayer && (
                    <motion.div
                      className="w-full h-full bg-neon-cyan rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6 max-w-md mx-auto">
        <div className="bg-dark-card bg-opacity-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-neon-cyan">{moves}</div>
          <div className="text-sm text-gray-400">Moves</div>
        </div>
        <div className="bg-dark-card bg-opacity-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-neon-purple">
            {elapsedTime}s
          </div>
          <div className="text-sm text-gray-400">Time</div>
        </div>
      </div>

      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="text-3xl font-bold text-neon-pink mb-2">Maze Conquered!</div>
          <div className="text-lg text-gray-300">Processing spatial intelligence...</div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MazeGame;