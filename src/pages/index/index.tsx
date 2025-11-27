import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { Navbar } from '../../components/layout/Navbar';
import { SettingsDrawer } from '../../components/settings/SettingsDrawer';
import { BaseCard } from '../../components/cards/BaseCard';
import { Storage } from '../../utils/storage';
import { UserSettings, WorkStatus } from '../../types';

// 导入其他卡片组件（这里用 BaseCard 示例，实际应拆分）
// 由于篇幅限制，此处简化展示逻辑

export default function Index() {
  const [settings, setSettings] = useState<UserSettings>(Storage.getSettings());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [status, setStatus] = useState<WorkStatus>(WorkStatus.NOT_STARTED);
  
  // 核心计时器逻辑
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      // TODO: 调用 calculateEarnings 逻辑 (需迁移 App.tsx 中的计算函数)
    }, 1000);
    return () => clearInterval(timer);
  }, [settings]);

  const handleSaveSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    Storage.saveSettings(newSettings);
  };

  const formattedTime = currentTime.toLocaleTimeString('zh-CN', { hour12: false });

  return (
    <View className="min-h-screen bg-[#fcfbf7] pb-10">
      <Navbar 
        avatar={settings.avatar} 
        isRunMode={false} 
        isBreakdownMode={false}
        runAnimationActive={false}
        onAvatarClick={() => {}}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenShare={() => {}}
      />

      <ScrollView scrollY className="p-4">
        {/* 时间大屏 */}
        <View className="text-center mb-6 mt-4">
          <View className="inline-block bg-black text-white px-6 py-2 rounded-full mb-4 shadow-comic">
             <Text className="font-bold tracking-widest">{status}</Text>
          </View>
          <View className="flex justify-center items-baseline">
             <Text className="text-6xl font-black font-mono tracking-tighter">{formattedTime}</Text>
          </View>
        </View>

        {/* 卡片列表 (原 DragContext 替换为直接渲染) */}
        <BaseCard title="今日含泪收入" icon={<Text>💰</Text>} bgColor="bg-[#ffde59]">
           <View className="flex flex-col items-center">
              <Text className="text-4xl font-black font-mono">{settings.currencySymbol}0.0000</Text>
              <Text className="text-xs text-gray-500 mt-2">点击此处会有特效(待实现)</Text>
           </View>
        </BaseCard>

        <BaseCard title="距离下班" icon={<Text>⚡</Text>} bgColor="bg-[#5cff88]">
           <View className="mt-2">
              <Text className="text-2xl font-black font-mono">00:00:00</Text>
              <View className="w-full h-4 bg-black/10 border-2 border-black rounded-full mt-2 overflow-hidden">
                 <View className="h-full bg-black w-1/2"></View>
              </View>
           </View>
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
