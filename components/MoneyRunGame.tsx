import React, { useEffect, useRef, useState } from 'react';

interface MoneyRunGameProps {
  onExit: () => void;
  avatar?: string;
  currencySymbol: string;
}

export const MoneyRunGame: React.FC<MoneyRunGameProps> = ({ onExit, avatar, currencySymbol }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  // Game Constants
  const GRAVITY = 0.6;
  const JUMP_FORCE = -10; // Slightly weaker jump for "heavy" feeling
  const SPEED = 5;
  const GROUND_HEIGHT = 100;
  
  // Game State Refs (to avoid closure staleness in loop)
  const stateRef = useRef({
    player: { x: 50, y: 0, vy: 0, width: 40, height: 40, isGrounded: true },
    obstacles: [] as { x: number; y: number; width: number; height: number; type: 'ground' | 'air'; icon: string }[],
    coins: [] as { x: number; y: number; width: number; height: number; collected: boolean }[],
    frame: 0,
    score: 0,
    running: false,
    speed: SPEED
  });

  const avatarImgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    // Preload Avatar
    if (avatar) {
      const img = new Image();
      img.src = avatar;
      avatarImgRef.current = img;
    }
    
    // Initial resize
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const requestRef = useRef<number>(0);

  const handleResize = () => {
    if (canvasRef.current) {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
    }
  };

  const spawnObstacle = (canvasWidth: number, canvasHeight: number) => {
    const { frame, speed } = stateRef.current;
    
    // Spawn rate increases with speed/time slightly
    if (frame % Math.floor(1500 / (speed * 6)) === 0) {
      const type = Math.random() > 0.6 ? 'air' : 'ground';
      const obstacleIcons = type === 'ground' ? ['⏰', '📉', '🧱', '💩'] : ['🥞', '🍳', '🔨'];
      const icon = obstacleIcons[Math.floor(Math.random() * obstacleIcons.length)];
      
      const size = 40;
      stateRef.current.obstacles.push({
        x: canvasWidth,
        y: type === 'ground' ? canvasHeight - GROUND_HEIGHT - size : canvasHeight - GROUND_HEIGHT - size - 90, // Air is higher
        width: size,
        height: size,
        type,
        icon
      });
    }

    // Spawn Coins
    if (frame % 60 === 0) {
      if (Math.random() > 0.5) {
        stateRef.current.coins.push({
          x: canvasWidth,
          y: canvasHeight - GROUND_HEIGHT - 40 - (Math.random() * 100), // Random height
          width: 30,
          height: 30,
          collected: false
        });
      }
    }
  };

  const update = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const state = stateRef.current;
    const { width, height } = canvas;

    // --- Update Logic ---
    state.frame++;
    state.speed += 0.001; // Slowly increase speed

    // Player Physics
    state.player.vy += GRAVITY;
    state.player.y += state.player.vy;

    // Ground Collision
    const floorY = height - GROUND_HEIGHT - state.player.height;
    if (state.player.y >= floorY) {
      state.player.y = floorY;
      state.player.vy = 0;
      state.player.isGrounded = true;
    } else {
      state.player.isGrounded = false;
    }

    // Obstacles Movement & Collision
    for (let i = state.obstacles.length - 1; i >= 0; i--) {
      const obs = state.obstacles[i];
      obs.x -= state.speed;

      // Remove off-screen
      if (obs.x + obs.width < 0) {
        state.obstacles.splice(i, 1);
        continue;
      }

      // Simple AABB Collision
      if (
        state.player.x < obs.x + obs.width - 10 &&
        state.player.x + state.player.width > obs.x + 10 &&
        state.player.y < obs.y + obs.height - 10 &&
        state.player.y + state.player.height > obs.y + 10
      ) {
        gameOver();
        return; 
      }
    }

    // Coins Movement & Collection
    for (let i = state.coins.length - 1; i >= 0; i--) {
      const coin = state.coins[i];
      coin.x -= state.speed;

      if (coin.x + coin.width < 0) {
        state.coins.splice(i, 1);
        continue;
      }

      if (
        !coin.collected &&
        state.player.x < coin.x + coin.width &&
        state.player.x + state.player.width > coin.x &&
        state.player.y < coin.y + coin.height &&
        state.player.y + state.player.height > coin.y
      ) {
        coin.collected = true;
        state.score += 10;
        setScore(state.score);
        state.coins.splice(i, 1);
      }
    }

    spawnObstacle(width, height);

    // --- Draw Logic ---
    
    // Sky
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, width, height);
    
    // Sun
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(width - 50, 50, 30, 0, Math.PI * 2);
    ctx.fill();

    // Ground
    ctx.fillStyle = '#5c4033'; // Dirt
    ctx.fillRect(0, height - GROUND_HEIGHT, width, GROUND_HEIGHT);
    ctx.fillStyle = '#4ade80'; // Grass
    ctx.fillRect(0, height - GROUND_HEIGHT, width, 10);

    // Player
    ctx.save();
    if (avatarImgRef.current && avatar) {
        ctx.beginPath();
        ctx.arc(state.player.x + state.player.width/2, state.player.y + state.player.height/2, state.player.width/2, 0, Math.PI*2);
        ctx.clip();
        ctx.drawImage(avatarImgRef.current, state.player.x, state.player.y, state.player.width, state.player.height);
        ctx.restore();
        // Add a border
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(state.player.x + state.player.width/2, state.player.y + state.player.height/2, state.player.width/2, 0, Math.PI*2);
        ctx.stroke();
    } else {
        // Fallback Emoji
        ctx.font = '30px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🐂', state.player.x + state.player.width/2, state.player.y + state.player.height/2 + 2);
    }
    ctx.restore();

    // Obstacles
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    state.obstacles.forEach(obs => {
      ctx.fillText(obs.icon, obs.x + obs.width/2, obs.y + obs.height/2 + 2);
    });

    // Coins
    state.coins.forEach(coin => {
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('💰', coin.x + coin.width/2, coin.y + coin.height/2 + 2);
    });

    // Score Text
    ctx.fillStyle = 'black';
    ctx.font = 'bold 24px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`${currencySymbol} ${state.score}`, 20, 40);

    if (state.running) {
       requestRef.current = requestAnimationFrame(update);
    }
  };

  const jump = () => {
    if (stateRef.current.player.isGrounded && stateRef.current.running) {
      stateRef.current.player.vy = JUMP_FORCE;
      stateRef.current.player.isGrounded = false;
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setIsGameOver(false);
    setScore(0);
    stateRef.current = {
      player: { x: 50, y: 0, vy: 0, width: 50, height: 50, isGrounded: true },
      obstacles: [],
      coins: [],
      frame: 0,
      score: 0,
      running: true,
      speed: SPEED
    };
    requestRef.current = requestAnimationFrame(update);
  };

  const gameOver = () => {
    stateRef.current.running = false;
    cancelAnimationFrame(requestRef.current);
    setIsGameOver(true);
  };

  return (
    <div 
      className="fixed inset-0 z-[100] bg-white flex flex-col font-sans"
      onPointerDown={jump} // Touch or click anywhere to jump
    >
      {/* Canvas Layer */}
      <canvas ref={canvasRef} className="block w-full h-full touch-none" />

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
         <button 
           onClick={(e) => { e.stopPropagation(); onExit(); }}
           className="absolute top-4 right-4 pointer-events-auto bg-black text-white rounded-full w-10 h-10 font-bold border-2 border-white shadow-lg z-20"
         >
           ✖
         </button>
         
         {!gameStarted && !isGameOver && (
           <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-auto">
              <div className="bg-[#fffdf5] p-8 rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] text-center animate-bounce-sm">
                  <h1 className="text-4xl font-black mb-2 font-hand">工资大暴走</h1>
                  <p className="text-gray-600 font-bold mb-6">点击屏幕跳跃，躲避大饼和黑锅，收集金币！</p>
                  <button 
                    onClick={startGame}
                    className="bg-[#ffde59] text-black text-xl font-black py-3 px-8 rounded-xl border-2 border-black shadow-comic hover:scale-105 transition-transform"
                  >
                    开始搬砖
                  </button>
              </div>
           </div>
         )}

         {isGameOver && (
           <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto">
              <div className="bg-white p-8 rounded-xl border-4 border-black text-center animate-shake">
                  <h2 className="text-3xl font-black mb-2 text-red-500 font-hand">惨遭辞退</h2>
                  <p className="text-gray-600 font-bold mb-4">本次卷得: {currencySymbol}{score}</p>
                  <div className="flex gap-4 justify-center">
                    <button 
                      onClick={startGame}
                      className="bg-[#5cff88] text-black font-black py-2 px-6 rounded-lg border-2 border-black shadow-comic hover:scale-105"
                    >
                      再来一次
                    </button>
                    <button 
                      onClick={onExit}
                      className="bg-gray-200 text-black font-bold py-2 px-6 rounded-lg border-2 border-black hover:bg-gray-300"
                    >
                      不玩了
                    </button>
                  </div>
              </div>
           </div>
         )}
      </div>
    </div>
  );
};