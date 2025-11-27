import React from 'react';
import { InfoCard } from './InfoCard';
import { getNextHoliday, getWeekendWait } from '../utils/holidayUtils';

interface MultiGoalCardProps {
  endTime: string;
  salaryDay: number;
  birthDate: string;
}

const calculateDaysToDate = (targetDate: Date) => {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
};

const getSalaryCountdown = (day: number) => {
  const now = new Date();
  const currentDay = now.getDate();
  
  let target = new Date();
  if (currentDay < day) {
    target.setDate(day); // This month
  } else {
    target.setMonth(target.getMonth() + 1); // Next month
    target.setDate(day);
  }
  return calculateDaysToDate(target);
};

const getBaldnessCountdown = (birthDateStr: string) => {
  if (!birthDateStr) return { days: 9999, label: '未知' };
  const birth = new Date(birthDateStr);
  // Satirical: Balding starts at 35
  const baldingDate = new Date(birth.getFullYear() + 35, birth.getMonth(), birth.getDate());
  const days = calculateDaysToDate(baldingDate);
  return { days, label: '距离秃头 (35岁)' };
};

export const MultiGoalCard: React.FC<MultiGoalCardProps> = ({ endTime, salaryDay, birthDate }) => {
  const weekendData = getWeekendWait(endTime);
  const holidayData = getNextHoliday();
  const salaryDays = getSalaryCountdown(salaryDay);
  const baldnessData = getBaldnessCountdown(birthDate);

  // Determine priority emotion based on closest goal
  // Order: Salary -> Weekend -> Holiday -> Baldness
  // We can just list them.

  const goals = [
    {
      icon: '💸',
      label: '发薪日',
      value: salaryDays === 0 ? '就是今天!' : `${salaryDays}天`,
      highlight: salaryDays <= 5,
      color: 'bg-yellow-100'
    },
    {
      icon: '🏝️',
      label: holidayData ? holidayData.name : '下个假期',
      value: holidayData ? `${holidayData.days}天` : '遥遥无期',
      highlight: holidayData && holidayData.days <= 3,
      color: 'bg-red-100'
    },
    {
      icon: '🧑‍🦲',
      label: '发际线防线',
      value: `${baldnessData.days}天`,
      highlight: false,
      color: 'bg-gray-100'
    }
  ];

  return (
    <InfoCard 
      title="多线程盼头" 
      bgColor="bg-white" 
      icon={<span>🎯</span>}
    >
      <div className="space-y-3 mt-2">
        
        {/* Weekend (Primary) */}
        <div className="flex items-center justify-between p-3 border-2 border-black rounded-lg bg-[#5cff88] shadow-sm">
           <div className="flex items-center gap-2">
              <span className="text-2xl">🍺</span>
              <span className="font-bold">距离周末</span>
           </div>
           {weekendData.status === 'weekend' ? (
              <span className="font-black animate-pulse">正在进行时!</span>
           ) : (
              <span className="font-black font-mono text-lg">{weekendData.text}</span>
           )}
        </div>

        {/* Other Goals Grid */}
        <div className="grid grid-cols-1 gap-2">
           {goals.map((goal, idx) => (
             <div key={idx} className={`flex items-center justify-between p-2 rounded-lg border-2 border-black/10 ${goal.highlight ? 'bg-yellow-200 border-black animate-pulse' : goal.color}`}>
                <div className="flex items-center gap-2">
                   <span className="text-xl">{goal.icon}</span>
                   <span className="text-xs font-bold text-gray-600">{goal.label}</span>
                </div>
                <span className={`font-black font-mono ${goal.highlight ? 'text-red-600' : 'text-black'}`}>
                   {goal.value}
                </span>
             </div>
           ))}
        </div>

      </div>
    </InfoCard>
  );
};