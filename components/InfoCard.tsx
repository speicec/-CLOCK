import React from 'react';

interface InfoCardProps {
  title: string;
  value?: React.ReactNode;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  bgColor?: string; // Tailwind class like 'bg-yellow-300'
  className?: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({ title, value, children, icon, bgColor = 'bg-white', className = '' }) => {
  return (
    <div className={`${bgColor} border-2 border-black rounded-xl p-5 shadow-comic transition-transform hover:-translate-y-1 relative overflow-hidden ${className}`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-black font-hand text-black opacity-90">{title}</h3>
        {icon && <div className="text-2xl opacity-100">{icon}</div>}
      </div>
      
      {value && (
        <div className="text-3xl font-black font-mono tracking-tight text-black">
          {value}
        </div>
      )}
      
      {children}
    </div>
  );
};