import { useEffect, useRef, useState, useCallback } from 'react';
import { Trophy, RefreshCcw } from 'lucide-react';
import { motion } from 'motion/react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };

interface SnakeGameProps {
  neonColor: string;
  onScoreChange?: (score: number) => void;
  onHighScoreChange?: (highScore: number) => void;
}

export default function SnakeGame({ neonColor, onScoreChange, onHighScoreChange }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const gameLoopRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  const playEatSound = useCallback(() => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    audio.volume = 0.4;
    audio.play().catch(() => {});
  }, []);

  const playGameOverSound = useCallback(() => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
    audio.volume = 0.5;
    audio.play().catch(() => {});
  }, []);

  // Sync score with parent safely in useEffect
  useEffect(() => {
    onScoreChange?.(score);
  }, [score, onScoreChange]);

  // Sync high score with parent safely in useEffect
  useEffect(() => {
    if (score > highScore) {
      const newHighScore = score;
      setHighScore(newHighScore);
      onHighScoreChange?.(newHighScore);
    }
  }, [score, highScore, onHighScoreChange]);

  const generateFood = useCallback(() => {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    return { x, y };
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setScore(0);
    setGameOver(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      switch (key) {
        case 'arrowup':
        case 'w':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'arrowdown':
        case 's':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'arrowleft':
        case 'a':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'arrowright':
        case 'd':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  const update = useCallback((time: number) => {
    if (gameOver) return;

    if (time - lastUpdateRef.current > 90) {
      lastUpdateRef.current = time;

      setSnake((prev) => {
        const head = { x: prev[0].x + direction.x, y: prev[0].y + direction.y };

        // Check wall collision
        if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
          setGameOver(true);
          playGameOverSound();
          return prev;
        }

        // Check self collision
        if (prev.some((segment) => segment.x === head.x && segment.y === head.y)) {
          setGameOver(true);
          playGameOverSound();
          return prev;
        }

        const newSnake = [head, ...prev];

        // Check food collision
        if (head.x === food.x && head.y === food.y) {
          // Update internal score; useEffect will handle syncing to parent
          setScore((s) => s + 10);
          setFood(generateFood());
          playEatSound();
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }

    gameLoopRef.current = requestAnimationFrame(update);
  }, [direction, food, gameOver, generateFood, playEatSound, playGameOverSound]);

  useEffect(() => {
    gameLoopRef.current = requestAnimationFrame(update);
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [update]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear canvas
    ctx.fillStyle = '#0a0a0a'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      const color = index === 0 ? '#00ffff' : '#00ffff99';
      ctx.fillStyle = color;
      ctx.shadowBlur = index === 0 ? 15 : 5;
      ctx.shadowColor = '#00ffff';
      
      const padding = 1;
      ctx.fillRect(
        segment.x * cellSize + padding,
        segment.y * cellSize + padding,
        cellSize - padding * 2,
        cellSize - padding * 2
      );
      ctx.shadowBlur = 0;
    });

    // Draw food
    ctx.fillStyle = '#ff00ff';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff00ff';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize / 2,
      food.y * cellSize + cellSize / 2,
      cellSize / 3,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;
  }, [snake, food]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative p-1 bg-cyan-900/30 border-2 border-cyan-500/50 rounded-sm shadow-[0_0_40px_rgba(0,255,255,0.1)] mb-4">
        <div className="bg-black w-[300px] h-[300px] md:w-[460px] md:h-[460px] relative overflow-hidden">
          <canvas
            ref={canvasRef}
            width={460}
            height={460}
            className="w-full h-full"
          />
        
          {gameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center z-50 overflow-hidden"
            >
              <div className="noise-overlay" />
              <h2 className="text-4xl font-black text-magenta-500 mb-2 tracking-tighter uppercase animate-glitch">CORE_MELTDOWN</h2>
              <div 
                className="font-pixel uppercase tracking-widest text-[10px]"
                style={{
                  color: '#00ffff',
                  marginBottom: '23px',
                  borderColor: '#ff00ff',
                  backgroundColor: '#ff00ff11',
                  borderWidth: '1px',
                  borderStyle: 'dashed',
                  padding: '8px 16px'
                }}
              >
                RESULT: {score.toString().padStart(5, '0')} ERROR_CODE_404
              </div>
              <button
                onClick={resetGame}
                className="group relative flex items-center gap-2 px-8 py-3 border-2 border-cyan-500 hover:border-magenta-500 hover:text-magenta-500 transition-all bg-black text-cyan-400 text-xs font-pixel uppercase active:scale-95"
              >
                <div className="absolute inset-0 bg-magenta-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                <RefreshCcw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
                INIT_REBOOT
              </button>
            </motion.div>
          )}
        </div>
      </div>
      
      <div className="mt-4 flex gap-8 lg:hidden bg-cyan-950/20 p-4 border border-cyan-900/30">
        <div className="text-center">
          <p className="text-[9px] text-cyan-800 uppercase">Nodes</p>
          <p className="text-xl font-pixel text-magenta-500 tabular-nums">{score.toString().padStart(4, '0')}</p>
        </div>
        <div className="text-center">
          <p className="text-[9px] text-cyan-800 uppercase">Record</p>
          <p className="text-xl font-pixel text-cyan-700 tabular-nums">{highScore.toString().padStart(4, '0')}</p>
        </div>
      </div>
    </div>
  );
}
