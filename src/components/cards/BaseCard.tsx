import React from 'react';
import { View, Text } from '@tarojs/components';

interface BaseCardProps {
  title: string;
  icon?: React.ReactNode;
  bgColor?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export const BaseCard: React.FC<BaseCardProps> = ({ 
  title, 
  icon, 
  bgColor = 'bg-white', 
  children, 
  onClick,
  className = ''
}) => {
  return (
    <View 
      className={`${bgColor} border-2 border-black rounded-xl p-5 mb-4 shadow-comic relative overflow-hidden ${className}`}
      onClick={onClick}
    >
      <View className="flex flex-row justify-between items-center mb-3">
        <Text className="text-lg font-black font-hand text-black opacity-90">{title}</Text>
        {icon && <View className="text-2xl">{icon}</View>}
      </View>
      <View>
        {children}
      </View>
    </View>
  );
};
