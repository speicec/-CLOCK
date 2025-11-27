import React, { useState, useEffect } from 'react';
import { View as TaroView, Text as TaroText, ScrollView as TaroScrollView } from '@tarojs/components';
import { Navbar } from '../../components/layout/Navbar';
import { SettingsDrawer } from '../../components/settings/SettingsDrawer';
import { BaseCard } from '../../components/cards/BaseCard';
import { Storage } from '../../utils/storage';
import { calculateEarnings } from '../../utils/calculator';
import { UserSettings, WorkStatus, EarningsData } from '../../types';

const View = TaroView as any;
const Text = TaroText as any;
const ScrollView = TaroScrollView as any;

export default function Index() {
  const [settings, setSettings] = useState<UserSettings>(Storage.getSettings());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [status, setStatus] = useState<WorkStatus>(WorkStatus.NOT_STARTED);
  const [earnings, setEarnings] = useState<EarningsData>({
    earnedToday: 0,
    perSecond: 0,
    progressPercentage: 0,
    isOvertime: false,
    timeRemaining: '00:00:00'
  });

  // Main Loop
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setCurrentTime(now);
      const result = calculateEarnings(settings);
      setStatus(result.status);
      setEarnings(result.earnings);
    };

    tick(); // Initial call
    const timer = setInterval(tick, 1000); // 1 Second interval
    return () => clearInterval(timer);
  }, [settings]);

  const handleSaveSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    Storage.saveSettings(newSettings);
  };

  const formattedTime = currentTime.toLocaleTimeString('zh-CN', { hour12: false });

  // Styles based on status
  const timeColorClass = status === WorkStatus.OVERTIME ? 'text-red-500' : 'text-black';

  return (
    <View className="min-h-screen bg-[#fcfbf7] pb-10 font-sans">
      <Navbar 
        avatar={settings.avatar} 
        isRunMode={false} 
        isBreakdownMode={false}
        runAnimationActive={false}
        onAvatarClick={() => {}}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenShare={() => {}}
      />

      <ScrollView scrollY className="p-4 h-[calc(100vh-80px)]">
        {/* Header / Time Display */}
        <View className="text-center mb-6 mt-4">
          <View className={`inline-block px-6 py-2 rounded-full mb-4 shadow-comic ${status === WorkStatus.OVERTIME ? 'bg-red-500 text-white' : 'bg-black text-white'}`}>
             <Text className="font-bold tracking-widest">{status}</Text>
          </View>
          <View className="flex justify-center items-baseline">
             <Text className={`text-6xl font-black font-mono tracking-tighter ${timeColorClass}`}>
               {formattedTime}
             </Text>
          </View>
          <Text className="text-sm font-bold text-gray-500 mt-2 block">
             {currentTime.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
          </Text>
        </View>

        {/* --- CARDS --- */}

        {/* 1. Earnings Card */}
        <BaseCard 
          title="今日含泪收入" 
          icon={<Text className="animate-bounce">💰</Text>} 
          bgColor="bg-[#ffde59]"
        >
           <View className="flex flex-col items-center py-2">
              <View className="relative">
                <Text className="text-5xl font-black font-mono text-black tracking-tight drop-shadow-sm">
                  {settings.currencySymbol}{earnings.earnedToday.toFixed(4)}
                </Text>
                {status === WorkStatus.WORKING && (
                   <Text className="absolute -right-6 -top-2 text-2xl animate-pulse">✨</Text>
                )}
              </View>
              <View className="mt-2 text-xs font-bold bg-white/50 px-3 py-1 rounded-full border border-black/10">
                 秒薪: {settings.currencySymbol}{earnings.perSecond.toFixed(5)}
              </View>
           </View>
        </BaseCard>

        {/* 2. Time Remaining Card */}
        <BaseCard 
          title={status === WorkStatus.OVERTIME ? "自由延期 (加班)" : "距离下班"} 
          icon={<Text>⚡</Text>} 
          bgColor={status === WorkStatus.OVERTIME ? "bg-[#ff6b6b]" : "bg-[#5cff88]"}
        >
           <View className="mt-2">
              <View className="flex justify-between items-end mb-2">
                 <Text className={`text-2xl font-black font-mono ${status === WorkStatus.OVERTIME ? 'text-white' : 'text-black'}`}>
                   {earnings.timeRemaining}
                 </Text>
                 <Text className="font-bold text-black/60">{Math.floor(earnings.progressPercentage)}%</Text>
              </View>
              <View className="w-full h-6 bg-black/10 border-2 border-black rounded-full overflow-hidden relative">
                 <View 
                   className="h-full bg-black transition-all duration-1000 ease-linear flex items-center justify-end px-2"
                   style={{ width: `${earnings.progressPercentage}%` }}
                 >
                   {earnings.progressPercentage > 5 && <Text className="text-white text-xs font-bold">🏃</Text>}
                 </View>
              </View>
           </View>
        </BaseCard>

        {/* 3. Placeholder for other cards */}
        <BaseCard title="更多功能" icon={<Text>🚧</Text>} bgColor="bg-gray-200">
           <Text className="text-sm font-bold text-gray-500 text-center block">
             其他卡片 (打卡/里程碑/摸鱼) 正在搬运中...
           </Text>
        </BaseCard>

      </ScrollView>

      <SettingsDrawer 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={handleSaveSettings}
      />
    </View>
  );
}