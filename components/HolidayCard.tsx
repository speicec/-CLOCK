import React from 'react';
import { InfoCard } from './InfoCard';
import { getNextHoliday, getWeekendWait } from '../utils/holidayUtils';

interface HolidayCardProps {
  endTime: string;
}

export const HolidayCard: React.FC<HolidayCardProps> = ({ endTime }) => {
  const weekendData = getWeekendWait(endTime);
  const holidayData = getNextHoliday();

  return (
    <InfoCard 
      title="放假倒计时" 
      bgColor="bg-[#ff9f1c]" // Bright orange
      icon={<span>🏝️</span>}
    >
      <div className="mt-3 space-y-4">
        {/* Weekend Countdown */}
        <div className="bg-white/50 border-2 border-black rounded-lg p-2 flex justify-between items-center">
           <div className="flex items-center gap-2">
              <span className="text-xl">📅</span>
              <span className="font-bold text-sm">距离周末</span>
           </div>
           {weekendData.status === 'weekend' ? (
             <span className="font-black text-green-600 animate-pulse">🎉 ENJOY!</span>
           ) : (
             <span className="font-black font-mono text-xl">{weekendData.text}</span>
           )}
        </div>

        {/* Public Holiday Countdown */}
        {holidayData && (
          <div className="bg-white/50 border-2 border-black rounded-lg p-2 flex justify-between items-center">
             <div className="flex items-center gap-2">
                <span className="text-xl">🧧</span>
                <span className="font-bold text-sm">距离{holidayData.name}</span>
             </div>
             <div className="flex items-baseline gap-1">
                <span className="font-black font-mono text-2xl text-red-600">{holidayData.days}</span>
                <span className="text-xs font-bold">天</span>
             </div>
          </div>
        )}
      </div>
    </InfoCard>
  );
};