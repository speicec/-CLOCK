import React from 'react';
import { View, Image, Text } from '@tarojs/components';

interface NavbarProps {
  avatar?: string;
  isRunMode: boolean;
  isBreakdownMode: boolean;
  runAnimationActive: boolean;
  onAvatarClick: () => void;
  onOpenSettings: () => void;
  onOpenShare: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  avatar,
  isRunMode,
  isBreakdownMode,
  runAnimationActive,
  onAvatarClick,
  onOpenSettings,
  onOpenShare
}) => {
  // 动态计算样式类
  const navBgClass = isRunMode ? 'bg-[#4ade80]/90' : (isBreakdownMode ? 'bg-slate-800/90' : 'bg-[#fcfbf7]/90');
  const textColorClass = isRunMode ? 'text-white' : (isBreakdownMode ? 'text-gray-200' : 'text-black');

  return (
    <View className={`sticky top-0 z-40 border-b-4 border-black py-3 px-4 flex flex-row items-center justify-between transition-colors duration-500 ${navBgClass}`}>
      <View className="flex flex-row items-center gap-2 relative" onClick={onAvatarClick}>
        <View className={`w-10 h-10 rounded-full flex items-center justify-center border-2 border-black overflow-hidden bg-white ${runAnimationActive ? 'animate-run-sequence' : ''}`}>
          {avatar ? (
             <Image src={avatar} className="w-full h-full object-cover" mode="aspectFill" />
          ) : (
             <Text className="text-xl">🐂</Text>
          )}
        </View>
        <Text className={`font-black text-xl tracking-tighter font-hand ${textColorClass}`}>
          {isRunMode ? '润！！！' : (isBreakdownMode ? '牛马 (倒霉版)' : '牛马时钟')}
        </Text>
      </View>

      <View className="flex flex-row gap-2">
         <View 
           onClick={onOpenShare}
           className="p-2 border-2 border-black rounded-lg bg-white shadow-comic-sm active:translate-y-1 active:shadow-none"
         >
           <Text>{isRunMode ? '✈️' : (isBreakdownMode ? '⚰️' : '📸')}</Text>
         </View>
         <View 
           onClick={onOpenSettings}
           className="p-2 border-2 border-black rounded-lg bg-black shadow-comic-sm active:translate-y-1 active:shadow-none"
         >
           <Text className="text-white">⚙️</Text>
         </View>
      </View>
    </View>
  );
};
