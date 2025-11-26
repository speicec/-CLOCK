import React, { useState, useEffect, useRef } from 'react';
import { InfoCard } from './InfoCard';

type GameType = 'fish' | 'reflex';

interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
}

export const SlackingWidget: React.FC = () => {
  const [gameType, setGameType] = useState<GameType>('fish');
  
  // === Fish Game State ===
  const [meritCount, setMeritCount] = useState(0);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const clickIdRef = useRef(0);

  // === Reflex Game State ===
  const [reflexState, setReflexState] = useState<'idle' | 'waiting' | 'now' | 'result' | 'early'>('idle');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  // Toggle Game
  const toggleGame = () => {
    setGameType(prev => prev === 'fish' ? 'reflex' : 'fish');
    // Reset states
    setReflexState('idle');
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  // --- Fish Logic ---
  const handleFishClick = (e: React.MouseEvent) => {
    setMeritCount(prev => prev + 1);
    
    // Add floating text
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    // Calculate relative position inside the card roughly
    const id = clickIdRef.current++;
    const newText = {
      id,
      x: e.clientX - rect.left + (Math.random() * 20 - 10), 
      y: e.clientY - rect.top,
      text: '功德 +1'
    };
    
    setFloatingTexts(prev => [...prev, newText]);

    // Remove text after animation
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(item => item.id !== id));
    }, 1000);
  };

  // --- Reflex Logic ---
  const startReflexGame = () => {
    setReflexState('waiting');
    setReactionTime(null);
    
    const delay = 2000 + Math.random() * 3000; // 2-5 seconds
    
    timerRef.current = window.setTimeout(() => {
      setReflexState('now');
      startTimeRef.current = Date.now();
    }, delay);
  };

  const handleReflexClick = () => {
    if (reflexState === 'idle') {
      startReflexGame();
    } else if (reflexState === 'waiting') {
      if (timerRef.current) clearTimeout(timerRef.current);
      setReflexState('early');
    } else if (reflexState === 'now') {
      const time = Date.now() - startTimeRef.current;
      setReactionTime(time);
      setReflexState('result');
    } else {
      // result or early, restart
      startReflexGame();
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <InfoCard 
      title={gameType === 'fish' ? "电子木鱼" : "老板雷达"} 
      bgColor="bg-white" 
      icon={
        <button 
          onClick={(e) => { e.stopPropagation(); toggleGame(); }}
          className="text-xs font-bold border-2 border-black px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          🔄 换个摸法
        </button>
      }
    >
      <div className="mt-2 h-32 flex flex-col items-center justify-center relative overflow-hidden select-none">
        
        {/* === CYBER WOODEN FISH === */}
        {gameType === 'fish' && (
          <>
            <div 
              className="relative cursor-pointer group"
              onClick={handleFishClick}
            >
              <div className="text-6xl transition-transform active:scale-90 group-hover:scale-105 filter drop-shadow-md">
                🐡
              </div>
              <div className="absolute -bottom-2 w-full h-2 bg-black/10 rounded-full blur-sm"></div>
            </div>
            <div className="mt-3 font-bold font-mono text-gray-500">
              当前功德: <span className="text-black text-xl">{meritCount}</span>
            </div>

            {/* Floating +1s */}
            {floatingTexts.map(item => (
              <div
                key={item.id}
                className="absolute text-sm font-bold text-yellow-600 pointer-events-none animate-[bounce-sm_1s_ease-out_forwards]"
                style={{ 
                  left: item.x, 
                  top: item.y,
                  opacity: 1
                }}
              >
                {item.text}
              </div>
            ))}
          </>
        )}

        {/* === BOSS REFLEX === */}
        {gameType === 'reflex' && (
          <div 
            onClick={handleReflexClick}
            className={`w-full h-full rounded-lg border-2 border-black flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 ${
              reflexState === 'idle' ? 'bg-gray-100' :
              reflexState === 'waiting' ? 'bg-red-100' :
              reflexState === 'now' ? 'bg-[#5cff88]' :
              reflexState === 'early' ? 'bg-yellow-100' : 'bg-white'
            }`}
          >
            {reflexState === 'idle' && (
              <>
                <div className="text-4xl mb-1">👀</div>
                <div className="font-bold text-gray-600">点击开始测试</div>
              </>
            )}
            {reflexState === 'waiting' && (
              <>
                <div className="text-4xl mb-1 animate-pulse">😡</div>
                <div className="font-bold text-red-600">老板盯着呢...别动</div>
              </>
            )}
            {reflexState === 'now' && (
              <>
                <div className="text-5xl mb-1">🏃💨</div>
                <div className="font-black text-black text-xl">快切屏! (点击)</div>
              </>
            )}
            {reflexState === 'early' && (
              <>
                <div className="text-4xl mb-1">🚫</div>
                <div className="font-bold text-yellow-700">太急了! 被发现了</div>
                <div className="text-xs text-gray-500 mt-1">点击重试</div>
              </>
            )}
            {reflexState === 'result' && (
              <>
                <div className="text-sm font-bold text-gray-500">反应时间</div>
                <div className="text-4xl font-black font-mono text-black">{reactionTime}ms</div>
                <div className="text-xs font-bold text-gray-400 mt-1">
                  {reactionTime && reactionTime < 250 ? "摸鱼大师级" : "还得练"}
                </div>
                <div className="text-xs text-gray-400 mt-2">点击再来</div>
              </>
            )}
          </div>
        )}

      </div>
    </InfoCard>
  );
};
