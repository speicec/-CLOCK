import React, { useEffect } from 'react';
import { RandomEvent } from '../types';
import confetti from 'canvas-confetti';

interface RandomEventModalProps {
  event: RandomEvent | null;
  onClose: () => void;
}

export const RandomEventModal: React.FC<RandomEventModalProps> = ({ event, onClose }) => {
  useEffect(() => {
    if (event?.type === 'good') {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#5cff88', '#ffde59', '#ffffff'],
        zIndex: 9999
      });
    }
  }, [event]);

  if (!event) return null;

  const isGood = event.type === 'good';
  const bgColor = isGood ? 'bg-[#5cff88]' : (event.type === 'bad' ? 'bg-[#ff6b6b]' : 'bg-[#a2d2ff]');
  const textColor = isGood ? 'text-black' : (event.type === 'bad' ? 'text-white' : 'text-black');

  // Determine specific animation class based on event ID
  let animationClass = 'animate-bounce-sm';
  let overlayEffect = null;

  switch (event.id) {
    case 'urgent_meeting': // Midnight Ring
      animationClass = 'animate-shake-hard bg-red-600';
      overlayEffect = (
         <div className="absolute inset-0 bg-red-500/30 animate-pulse pointer-events-none z-0"></div>
      );
      break;
    case 'ppt_crash': // Crash
    case 'system_down': // Crash
      animationClass = 'animate-glitch';
      overlayEffect = (
         <div className="absolute top-2 right-2 text-xs font-mono text-white/50 z-0">
             ERROR: 0x0000DEAD
         </div>
      );
      break;
    case 'kpi_increase': // Pressure
      animationClass = 'animate-pulse-red';
      break;
    case 'wifi_slow': // Lag
      animationClass = 'animate-blur-pulse';
      overlayEffect = (
         <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none opacity-50">
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin-slow"></div>
         </div>
      );
      break;
    case 'keyboard_broken': // Broken
      animationClass = 'rotate-2';
      overlayEffect = (
         <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(45deg, transparent 48%, rgba(0,0,0,0.2) 49%, rgba(0,0,0,0.2) 51%, transparent 52%)' }}></div>
      );
      break;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      {/* Background Dimmer */}
      <div 
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in ${event.id === 'urgent_meeting' ? 'animate-pulse' : ''}`} 
        onClick={onClose}
      ></div>
      
      <div className={`relative w-full max-w-sm rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] p-0 overflow-hidden ${bgColor} ${animationClass} transition-all`}>
         
         {overlayEffect}

         {/* Comic Header */}
         <div className="bg-black text-white text-center py-2 font-black text-xl font-hand uppercase tracking-widest relative overflow-hidden z-10">
             {event.type === 'bad' ? '⚠ 寄中寄 ⚠' : (event.type === 'good' ? '★ 小确幸 ★' : 'Notice')}
             <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_25%,rgba(255,255,255,0.1)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.1)_75%,rgba(255,255,255,0.1)_100%)] bg-[length:10px_10px]"></div>
         </div>

         <div className="p-6 flex flex-col items-center text-center relative z-10">
            <div className={`text-7xl mb-4 filter drop-shadow-md ${event.id === 'urgent_meeting' ? 'animate-shake-hard' : (event.type === 'bad' ? 'animate-shake' : 'animate-bounce')}`}>
               {event.icon}
            </div>

            <h2 className={`text-2xl font-black mb-2 font-hand ${textColor} ${event.id === 'ppt_crash' ? 'font-mono tracking-tighter' : ''}`}>
               {event.title}
            </h2>

            <p className={`font-bold mb-6 text-sm ${textColor} opacity-90`}>
               {event.description}
            </p>

            <div className="w-full bg-black/10 border-2 border-black/50 rounded-lg p-3 backdrop-blur-sm">
               <p className={`font-black font-mono text-lg ${textColor}`}>
                  {event.effectText}
               </p>
            </div>

            <button 
              onClick={onClose}
              className="mt-6 w-full bg-black text-white font-bold py-3 rounded-lg border-2 border-transparent hover:bg-gray-800 hover:scale-105 transition-all shadow-lg active:scale-95"
            >
              {event.type === 'bad' ? '含泪接受' : '欣然接受'}
            </button>
         </div>
      </div>
    </div>
  );
};