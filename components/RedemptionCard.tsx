import React from 'react';
import { InfoCard } from './InfoCard';

interface RedemptionCardProps {
  targetName?: string;
  targetDate?: string;
}

// Gamification Levels
const LEVELS = [
  { days: 365, title: '初级牛马', icon: '🧹', item: '破旧扫帚' },
  { days: 180, title: '资深社畜', icon: '🛡️', item: '木制锅盖' },
  { days: 90,  title: '摸鱼高手', icon: '⚔️', item: '生锈铁剑' },
  { days: 30,  title: '自由斗士', icon: '🔥', item: '勇者之剑' },
  { days: 7,   title: '觉醒之神', icon: '👑', item: '黄金圣衣' },
  { days: 0,   title: '完全自由', icon: '🕊️', item: '自由之翼' },
];

export const RedemptionCard: React.FC<RedemptionCardProps> = ({ targetName, targetDate }) => {
  if (!targetName || !targetDate) {
    return (
      <InfoCard title="牛马救赎 (未设定)" bgColor="bg-gray-200" icon={<span>🔒</span>}>
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
  
  // Find current level based on days left
  // Logic: The closer the date, the better the item.
  // We find the first level threshold that is SMALLER or EQUAL to daysLeft? 
  // Actually, we want the highest tier achieved.
  // If daysLeft > 365, level 0.
  // If daysLeft <= 7, level is near max.
  
  let currentLevel = LEVELS[0]; // Default worst
  
  // Find the BEST item unlocked (meaning daysLeft is LESS than the requirement)
  // Sorted from High Days to Low Days in definition.
  // We want the smallest 'days' value that is still >= daysLeft? No.
  
  // Let's iterate.
  // If daysLeft is 400. > 365. Base level.
  // If daysLeft is 100. < 180. Unlocked 'Senior'.
  // If daysLeft is 5. < 7. Unlocked 'God'.
  
  for (let i = 0; i < LEVELS.length; i++) {
     if (daysLeft <= LEVELS[i].days) {
         currentLevel = LEVELS[i];
     }
  }
  
  // Progress for bar (inverse log scale or just simple linear clamp for visuals?)
  // Let's make it a progress towards 0.
  // Assume start date was... unknown. Let's just visualize "Closeness".
  // Let's cap visual progress at 365 days = 0%, 0 days = 100%.
  const visualProgress = Math.max(0, Math.min(100, ((365 - daysLeft) / 365) * 100));

  return (
    <InfoCard 
      title={`救赎: ${targetName}`} 
      bgColor="bg-[#2ec4b6]" 
      icon={<span className="animate-bounce-sm">{currentLevel.icon}</span>}
      className="border-2 border-black"
    >
      <div className="mt-2 text-white/90">
         <div className="flex justify-between items-end mb-2">
            <div className="flex flex-col">
                <span className="text-xs font-bold text-black/60">当前装备</span>
                <span className="text-lg font-black text-black font-hand">{currentLevel.item}</span>
            </div>
            <div className="text-right">
                <span className="text-4xl font-black font-mono text-black">{daysLeft}</span>
                <span className="text-sm font-bold text-black ml-1">天</span>
            </div>
         </div>
         
         {/* RPG Progress Bar */}
         <div className="w-full h-5 bg-black/20 border-2 border-black rounded-lg overflow-hidden relative">
            <div 
              className="h-full bg-[#ffbf69] border-r-2 border-black relative"
              style={{ width: `${visualProgress}%` }}
            >
                {/* Glint effect */}
                <div className="absolute top-0 right-0 bottom-0 w-1 bg-white/50"></div>
            </div>
         </div>
         
         <div className="mt-2 flex justify-between text-xs font-bold text-black/60">
             <span>苦难</span>
             <span>里程碑等级: {currentLevel.title}</span>
             <span>自由</span>
         </div>
      </div>
    </InfoCard>
  );
};