import React, { useState, useEffect, useRef } from 'react';

interface FocusModeProps {
  onExit: () => void;
}

type TimerMode = 'WORK' | 'BREAK';

export const FocusMode: React.FC<FocusModeProps> = ({ onExit }) => {
  const [mode, setMode] = useState<TimerMode>('WORK');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  
  // Use ref for audio to avoid re-creating it
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio context lazily if needed, or use simple Beep logic
  // For this implementation, we will use visual cues predominantly to avoid browser autoplay blocks

  useEffect(() => {
    let interval: number | null = null;

    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Timer finished logic
      if (mode === 'WORK') {
         // Auto switch to break or wait for user? Let's wait for user but change UI
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'WORK' ? 25 * 60 : 5 * 60);
  };

  const switchMode = () => {
    const newMode = mode === 'WORK' ? 'BREAK' : 'WORK';
    setMode(newMode);
    setTimeLeft(newMode === 'WORK' ? 25 * 60 : 5 * 60);
    setIsActive(false);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'WORK' 
    ? ((25 * 60 - timeLeft) / (25 * 60)) * 100 
    : ((5 * 60 - timeLeft) / (5 * 60)) * 100;

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col items-center justify-center font-mono select-none">
      
      {/* Background Pulse Animation */}
      {isActive && (
        <div 
          className={`absolute inset-0 opacity-10 animate-pulse ${mode === 'WORK' ? 'bg-red-900' : 'bg-green-900'}`}
          style={{ animationDuration: '2s' }}
        ></div>
      )}

      {/* Exit Button */}
      <button 
        onClick={onExit}
        className="absolute top-6 right-6 text-gray-500 hover:text-white border-2 border-gray-500 hover:border-white rounded-full w-10 h-10 flex items-center justify-center transition-all z-20"
      >
        ✕
      </button>

      {/* Mode Label */}
      <div className={`text-2xl md:text-3xl font-black font-hand mb-8 tracking-widest ${mode === 'WORK' ? 'text-red-400' : 'text-green-400'}`}>
        {mode === 'WORK' ? '🚧 全神贯注搬砖中' : '☕ 合法摸鱼时间'}
      </div>

      {/* Main Timer Display */}
      <div className="relative z-10">
         <div className="text-[20vw] leading-none font-bold tabular-nums tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            {formatTime(timeLeft)}
         </div>
         
         {/* Progress Bar under timer */}
         <div className="w-full h-2 bg-gray-800 rounded-full mt-4 overflow-hidden">
            <div 
               className={`h-full transition-all duration-1000 ${mode === 'WORK' ? 'bg-red-500' : 'bg-green-500'}`}
               style={{ width: `${progress}%` }}
            ></div>
         </div>
      </div>

      {/* Controls */}
      <div className="flex gap-8 mt-12 z-10">
        <button 
          onClick={toggleTimer}
          className="bg-white text-black text-xl md:text-2xl font-black py-4 px-12 rounded-full hover:scale-105 active:scale-95 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]"
        >
          {isActive ? '⏸ 暂停' : '▶ 开始'}
        </button>
        
        <button 
          onClick={resetTimer}
          className="bg-transparent border-2 border-white/30 text-white/50 hover:text-white hover:border-white text-xl font-bold py-4 px-6 rounded-full transition-all"
        >
          重置
        </button>
      </div>

      {/* Mode Switcher */}
      <button 
        onClick={switchMode}
        className="mt-8 text-sm md:text-base font-bold text-gray-500 hover:text-gray-300 underline underline-offset-4 decoration-2"
      >
        切换到{mode === 'WORK' ? '休息模式 (5min)' : '工作模式 (25min)'}
      </button>

      <div className="absolute bottom-6 text-xs text-gray-600 font-sans">
         {window.innerWidth < 768 ? '竖屏或退出全屏以结束' : '按 ESC 退出全屏以结束'}
      </div>
    </div>
  );
};
