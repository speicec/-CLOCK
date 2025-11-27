import React, { useState } from 'react';
import { View, Text, Input, Button, ScrollView, Image } from '@tarojs/components';
import { UserSettings } from '../../types';
import Taro from '@tarojs/taro';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSave: (newSettings: UserSettings) => void;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);

  if (!isOpen) return null;

  const handleChange = (key: keyof UserSettings, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: (key.includes('Time') || key.includes('Date') || key === 'currencySymbol' || key === 'targetName') ? value : Number(value)
    }));
  };

  const handleChooseImage = async () => {
    try {
      const res = await Taro.chooseImage({ count: 1, sizeType: ['compressed'] });
      const tempFilePath = res.tempFilePaths[0];
      // 注意：小程序中通常需要将图片转 Base64 或上传服务器。此处简化处理，假设直接用路径(本地预览用)或转Base64
      const fs = Taro.getFileSystemManager();
      const base64 = fs.readFileSync(tempFilePath, 'base64');
      setLocalSettings(prev => ({ ...prev, avatar: 'data:image/jpeg;base64,' + base64 }));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View className="fixed inset-0 z-50">
      <View className="absolute inset-0 bg-black/50" onClick={onClose}></View>
      <View className="absolute right-0 top-0 bottom-0 w-3/4 bg-[#fffdf5] border-l-4 border-black flex flex-col">
        <ScrollView scrollY className="flex-1 p-4">
          <Text className="text-2xl font-black font-hand mb-6 block">⚙️ 设定身价</Text>
          
          {/* 头像 */}
          <View className="mb-6 p-4 bg-white border-2 border-black shadow-comic-sm rounded-xl items-center flex flex-col">
             <View className="w-20 h-20 rounded-full bg-gray-200 border-2 border-black overflow-hidden mb-2">
                {localSettings.avatar && <Image src={localSettings.avatar} className="w-full h-full" mode="aspectFill"/>}
             </View>
             <Button size="mini" onClick={handleChooseImage} className="bg-black text-white">上传头像</Button>
          </View>

          {/* 薪资 */}
          <View className="mb-4">
             <Text className="font-bold mb-1 block">月薪</Text>
             <Input 
               type="number" 
               className="border-2 border-black p-2 rounded bg-white" 
               value={String(localSettings.monthlySalary)}
               onInput={(e) => handleChange('monthlySalary', e.detail.value)}
             />
          </View>

          <View className="mb-4">
             <Text className="font-bold mb-1 block">上班时间</Text>
             <Input 
               className="border-2 border-black p-2 rounded bg-white" 
               value={localSettings.startTime}
               onInput={(e) => handleChange('startTime', e.detail.value)}
             />
          </View>
          
          <View className="mb-4">
             <Text className="font-bold mb-1 block">下班时间</Text>
             <Input 
               className="border-2 border-black p-2 rounded bg-white" 
               value={localSettings.endTime}
               onInput={(e) => handleChange('endTime', e.detail.value)}
             />
          </View>

          <Button 
            className="mt-6 bg-[#ff6b6b] text-white border-2 border-black shadow-comic font-black"
            onClick={() => { onSave(localSettings); onClose(); }}
          >
            保存配置
          </Button>
        </ScrollView>
      </View>
    </View>
  );
};