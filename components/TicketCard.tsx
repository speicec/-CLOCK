import React from 'react';

interface TicketCardProps {
  title: string;
  status: string;
  icon: string;
  bgColor?: string; // e.g., 'bg-white'
}

export const TicketCard: React.FC<TicketCardProps> = ({ title, status, icon, bgColor = 'bg-white' }) => {
  return (
    <div className="relative w-full h-24 mb-4 flex filter drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-1 transition-transform">
      {/* Left Section (Main) */}
      <div className={`flex-1 ${bgColor} rounded-l-xl border-2 border-r-0 border-black p-4 flex items-center justify-between relative`}>
        <div className="flex items-center gap-3">
          <div className="text-3xl">{icon}</div>
          <div className="flex flex-col">
            <span className="font-black text-lg font-hand text-black">{title}</span>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Boarding Pass</span>
          </div>
        </div>
      </div>

      {/* Divider (Perforated Line) */}
      <div className={`w-4 ${bgColor} border-t-2 border-b-2 border-black relative flex items-center justify-center`}>
         {/* Dashed Line */}
         <div className="h-[80%] border-l-2 border-dashed border-gray-400"></div>
         
         {/* Notches */}
         <div className="absolute -top-[2px] left-1/2 -translate-x-1/2 w-4 h-4 bg-[#4ade80] rounded-full border-b-2 border-black"></div>
         <div className="absolute -bottom-[2px] left-1/2 -translate-x-1/2 w-4 h-4 bg-[#4ade80] rounded-full border-t-2 border-black"></div>
      </div>

      {/* Right Section (Stub) */}
      <div className={`w-28 ${bgColor} rounded-r-xl border-2 border-l-0 border-black flex items-center justify-center relative`}>
        <div className="text-center transform -rotate-6">
           <span className="block text-xs font-bold text-gray-400 mb-1">Status</span>
           <span className="block text-xl font-black font-mono text-red-500 animate-pulse">{status}</span>
        </div>
      </div>
    </div>
  );
};