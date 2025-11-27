import React from 'react';
import { RandomEvent } from '../types';

interface RandomEventModalProps {
  event: RandomEvent | null;
  onClose: () => void;
}

export const RandomEventModal: React.FC<RandomEventModalProps> = ({ event, onClose }) => {
  if (!event) return null;

  const isGood = event.type === 'good';
  const bgColor = isGood ? 'bg-[#5cff88]' : (event.type === 'bad' ? 'bg-[#ff6b6b]' : 'bg-[#a2d2ff]');
  const textColor = isGood ? 'text-black' : (event.type === 'bad' ? 'text-white' : 'text-black');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>
      
      <div className={`relative w-full max-w-sm rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] p-0 overflow-hidden animate-bounce-sm ${bgColor}`}>
         
         {/* Comic Header */}
         <div className="bg-black text-white text-center py-2 font-black text-xl font-hand uppercase tracking-widest relative overflow-hidden">
             {event.type === 'bad' ? '⚠ 寄中寄 ⚠' : (event.type === 'good' ? '★ 小确幸 ★' : 'Notice')}
             <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_25%,rgba(255,255,255,0.1)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.1)_75%,rgba(255,255,255,0.1)_100%)] bg-[length:10px_10px]"></div>
         </div>

         <div className="p-6 flex flex-col items-center text-center">
            <div className={`text-7xl mb-4 filter drop-shadow-md ${event.type === 'bad' ? 'animate-shake' : 'animate-bounce'}`}>
               {event.icon}
            </div>

            <h2 className={`text-2xl font-black mb-2 font-hand ${textColor}`}>
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