
import React from 'react';
import { InfoCard } from './InfoCard';

interface RedemptionCardProps {
  targetName?: string;
  targetDate?: string;
  avatar?: string;
}

const LEVELS = [
  { days: 365, title: '初级牛马', icon: '🧹', item: '破旧扫帚' },
  { days: 180, title: '资深社畜', icon: '🛡️', item: '木制锅盖' },
  { days: 90,  title: '摸鱼高手', icon: '⚔️', item: '生锈铁剑' },
  { days: 30,  title: '自由斗士', icon: '🔥', item: '勇者之剑' },
  { days: 7,   title: '觉醒之神', icon: '👑', item: '黄金圣衣' },
  { days: 0,   title: '完全自由', icon: '🕊️', item: '自由之翼' },
];

export const getEquipment = (targetName: string | undefined, daysLeft: number) => {
  if (!targetName) return LEVELS[0];

  const name = targetName.toLowerCase();
  let specialIcon = '';
  let specialItem = '';

  if (name.includes('车') || name.includes('car') || name.includes('drive')) {
    specialIcon = '🏎️';
    specialItem = '极速座驾';
  } else if (name.includes('房') || name.includes('house') || name.includes('home')) {
    specialIcon = '🏠';
    specialItem = '豪华别墅';
  } else if (name.includes('游') || name.includes('travel') || name.includes('trip') || name.includes('玩')) {
    specialIcon = '✈️';
    specialItem = '环球机票';
  } else if (name.includes('离职') || name.includes('quit') || name.includes('fire') || name.includes('跑路')) {
    specialIcon = '📜';
    specialItem = '离职证明';
  } else if (name.includes('钱') || name.includes('富') || name.includes('rich')) {
    specialIcon = '💰';
    specialItem = '暴富金砖';
  }

  let currentLevel = LEVELS[0];
  for (let i = 0; i < LEVELS.length; i++) {
     if (daysLeft <= LEVELS[i].days) {
         currentLevel = LEVELS[i];
     }
  }

  if (specialIcon) {
    return {
      ...currentLevel,
      icon: specialIcon,
      item: specialItem
    };
  }

  return currentLevel;
};

export const RedemptionCard: React.FC<RedemptionCardProps> = ({ targetName, targetDate, avatar }) => {
  if (!targetName || !targetDate) {
    return (
      <InfoCard title="牛马救赎 (未设定)" bgColor="bg-accent-gray" icon={<span>🔒</span>}>
         <div className="text-center py-4">
            <p className="text-sm font-bold text-gray-500 mb-2">设定一个目标日期，解锁你的专属装备</p>
            <div className="text-xs text-gray-400">请在设置中添加目标</div>
         </div>
      </InfoCard>
    );
  }

  const now = new Date();
  const target = new Date(targetDate);
  const diffTime = target.getTime() - now.getTime();
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  const equipment = getEquipment(targetName, daysLeft);
  const isCompleted = daysLeft <= 0;
  
  const visualProgress = Math.max(0, Math.min(100, ((365 - daysLeft) / 365) * 100));

  return (
    <InfoCard 
      title={`救赎: ${targetName}`} 
      bgColor="bg-accent-teal" 
      icon={null} 
      className="border-2 border-app-border"
    >
      <div className="absolute top-4 right-4 text-3xl animate-bounce-sm z-10">
        {equipment.icon}
      </div>

      <div className="flex gap-4 mt-2 items-end">
        <div className="relative shrink-0">
          <div className="w-20 h-20 rounded-full border-4 border-app-border overflow-hidden bg-white shadow-comic-sm">
             {avatar ? (
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
             ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">🐂</div>
             )}
          </div>
          
          {isCompleted ? (
             <div className="absolute -bottom-2 -right-2 text-4xl filter drop-shadow-md transform -rotate-12 animate-pulse" title="已装备">
               {equipment.icon}
             </div>
          ) : (
             <div className="absolute -top-4 -right-6 bg-card-bg border-2 border-app-border px-2 py-1 rounded-lg text-xs font-bold whitespace-nowrap animate-bounce-sm text-app-text">
                想要 {equipment.icon}...
                <div className="absolute bottom-[-6px] left-2 w-3 h-3 bg-card-bg border-b-2 border-r-2 border-app-border transform rotate-45"></div>
             </div>
          )}
        </div>

        <div className="flex-1 text-app-text">
             <div className="flex flex-col items-end">
                <span className="text-4xl font-black font-mono leading-none">{daysLeft > 0 ? daysLeft : 0}</span>
                <span className="text-sm font-bold mt-1">天后装备: {equipment.item}</span>
            </div>
        </div>
      </div>
      
      <div className="w-full h-6 bg-black/20 border-2 border-app-border rounded-lg overflow-hidden relative mt-3">
        <div 
          className="h-full bg-accent-orange border-r-2 border-app-border relative transition-all duration-1000"
          style={{ width: `${visualProgress}%` }}
        >
            <div className="absolute top-0 right-0 bottom-0 w-1 bg-white/50"></div>
            <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzhhZWGMYAEYB8RmROaABADeOQ8CXl/xfgAAAABJRU5ErkJggg==')] opacity-10"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-black/50">
           {isCompleted ? '已达成成就' : `当前等级: ${equipment.title}`}
        </div>
      </div>
    </InfoCard>
  );
};
