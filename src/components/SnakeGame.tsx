import React, { useState, useEffect, useCallback, useRef } from 'react';

interface Point {
  x: number;
  y: number;
}

const GRID_SIZE = 25;
const INITIAL_SNAKE: Point[] = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export default function SnakeGame({ onScoreChange }: { onScoreChange: (score: number) => void }) {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(120);
  const gameLoopRef = useRef<number | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood({ x: 5, y: 5 });
    setIsGameOver(false);
    setScore(0);
    setSpeed(120);
    onScoreChange(0);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check collision with food
      if (newHead.x === food.x && newHead.y === food.y) {
        const newScore = score + 10;
        setScore(newScore);
        onScoreChange(newScore);
        setFood(generateFood(newSnake));
        setSpeed(prev => Math.max(60, prev - 2));
        return newSnake;
      }

      newSnake.pop();
      return newSnake;
    });
  }, [direction, food, isGameOver, score, onScoreChange, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    if (!isGameOver) {
      gameLoopRef.current = window.setInterval(moveSnake, speed);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, isGameOver, speed]);

  return (
    <div className="relative w-full aspect-square bg-zinc-950/80 rounded-xl border border-green-500/20 neon-border p-1 overflow-hidden group">
      {/* Grid Background */}
      <div className="absolute inset-0 grid grid-cols-[repeat(25,1fr)] grid-rows-[repeat(25,1fr)] opacity-5 pointer-events-none">
        {Array.from({ length: 25 * 25 }).map((_, i) => (
          <div key={i} className="border-[0.5px] border-white/20" />
        ))}
      </div>

      <div className="relative w-full h-full">
        {/* Snake segments */}
        {snake.map((segment, i) => (
          <div
            key={i}
            className="absolute bg-green-500 rounded-sm shadow-[0_0_8px_#22c55e]"
            style={{
              width: `${100 / GRID_SIZE}%`,
              height: `${100 / GRID_SIZE}%`,
              left: `${(segment.x / GRID_SIZE) * 100}%`,
              top: `${(segment.y / GRID_SIZE) * 100}%`,
              opacity: 1 - (i / snake.length) * 0.5,
              zIndex: 10 + (snake.length - i)
            }}
          />
        ))}

        {/* Food */}
        <div
          className="absolute bg-pink-500 rounded-full shadow-[0_0_12px_#ec4899] animate-pulse"
          style={{
            width: `${100 / GRID_SIZE}%`,
            height: `${100 / GRID_SIZE}%`,
            left: `${(food.x / GRID_SIZE) * 100}%`,
            top: `${(food.y / GRID_SIZE) * 100}%`,
            zIndex: 5
          }}
        />

        {/* Status badges */}
        <div className="absolute bottom-4 left-4 flex gap-2 z-20">
          <div className="px-3 py-1 bg-green-500/10 border border-green-500/30 rounded text-[10px] uppercase tracking-tighter text-green-400 font-bold">
            Status: {isGameOver ? 'Offline' : 'Active'}
          </div>
          <div className="px-3 py-1 bg-zinc-900/80 border border-zinc-700/50 rounded text-[10px] uppercase tracking-tighter text-zinc-400">
            Speed: {speed}ms
          </div>
        </div>

        {/* Game Over Overlay */}
        {isGameOver && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 p-8 text-center">
            <h2 className="text-4xl font-black italic neon-text-pink mb-2">SYSTEM FAILURE</h2>
            <p className="text-zinc-400 uppercase tracking-widest text-xs mb-8">Snake collision detected at grid hex {snake[0].x}:{snake[0].y}</p>
            <button
              onClick={resetGame}
              className="px-8 py-3 bg-green-500 text-black font-black uppercase tracking-tighter hover:scale-105 transition-transform rounded-sm"
            >
              Reboot Matrix
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
