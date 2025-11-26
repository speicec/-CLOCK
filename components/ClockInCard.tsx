import React from 'react';
import { InfoCard } from './InfoCard';
import confetti from 'canvas-confetti';
import { WorkLog } from '../types';

interface ClockInCardProps {
  logs: WorkLog[];
  onClockIn: () => void;
  onClockOut: () => void;
  onShowStats: () => void;
}

export const ClockInCard: React.FC<ClockInCardProps> = ({ logs, onClockIn, onClockOut, onShowStats }) => {
  // Get today's status
  const todayStr = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
  const todayLog = logs.find(log => log.date === todayStr);
  const totalDays = logs.length;

  const handlePress = (type: 'in' | 'out') => {
    // Visual reward
    if (type === 'in') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ffde59', '#000000', '#ffffff'], // Yellow/Black/White theme
      });
      onClockIn();
    } else {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#5cff88', '#ffffff', '#000000'], // Green/White/Black theme
        shapes: ['circle', 'square'],
      });
      onClockOut();
    }
  };

  let buttonContent;
  if (!todayLog) {
    buttonContent = (
      <button 
        onClick={() => handlePress('in')}
        className="w-full py-4 bg-[#ffde59] text-black font-black text-xl border-2 border-black rounded-xl shadow-comic active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all hover:brightness-105"
      >
        ☕ 打卡上班
      </button>
    );
  } else if (!todayLog.endTime) {
    buttonContent = (
      <button 
        onClick={() => handlePress('out')}
        className="w-full py-4 bg-[#5cff88] text-black font-black text-xl border-2 border-black rounded-xl shadow-comic active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all hover:brightness-105"
      >
        🏃‍♂️ 打卡下班
      </button>
    );
  } else {
    buttonContent = (
      <div className="w-full py-4 bg-gray-200 text-gray-500 font-bold text-xl border-2 border-gray-400 rounded-xl flex flex-col items-center justify-center cursor-not-allowed">
        <span>✅ 今日已搬完</span>
        <span className="text-xs font-normal mt-1">工时: {todayLog.startTime} - {todayLog.endTime}</span>
      </div>
    );
  }

  return (
    <InfoCard 
      title="每日打卡" 
      bgColor="bg-white" 
      icon={
        <button 
           onClick={(e) => { e.stopPropagation(); onShowStats(); }}
           className="text-xl hover:scale-110 transition-transform active:scale-90"
           title="查看血汗史"
        >
           📈
        </button>
      }
    >
      <div className="mt-2">
        <div className="mb-4 text-center">
           <span className="text-sm font-bold text-gray-500">累计搬砖</span>
           <div className="flex items-baseline justify-center gap-1">
             <span className="text-4xl font-black font-mono text-black">{totalDays}</span>
             <span className="text-base font-bold text-black">天</span>
           </div>
        </div>
        
        {buttonContent}
        
        <div className="mt-3 text-center text-xs text-gray-400 font-bold">
           坚持打卡，见证你的血汗史
        </div>
      </div>
    </InfoCard>
  );
};
