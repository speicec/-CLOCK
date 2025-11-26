import React, { useState } from 'react';
import { UserSettings } from '../types';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSave: (newSettings: UserSettings) => void;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalSettings(prev => ({
      ...prev,
      [name]: (name.includes('Time') || name.includes('Date') || name === 'currencySymbol' || name === 'targetName') ? value : Number(value)
    }));
  };

  if (!isOpen) return null;

  const inputClass = "w-full bg-white border-2 border-black rounded-lg py-2 px-3 text-black focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all outline-none font-bold";
  const labelClass = "block text-sm font-bold text-black mb-1 font-hand tracking-wider";

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Drawer */}
      <div className="relative w-full max-w-md bg-[#fffdf5] h-full shadow-2xl p-6 overflow-y-auto border-l-4 border-black animate-slide-in">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black text-black font-hand">
            ⚙️ 设定你的身价
          </h2>
          <button onClick={onClose} className="text-2xl hover:scale-110 transition-transform">✖️</button>
        </div>
        
        <div className="space-y-6 font-sans pb-10">
          
          <div className="bg-yellow-100 p-4 border-2 border-black shadow-comic-sm rounded-xl">
             <h3 className="font-black text-lg mb-3">💰 薪资待遇</h3>
             <div className="space-y-4">
                <div>
                  <label className={labelClass}>月薪 (税前)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 font-bold text-gray-500">{localSettings.currencySymbol}</span>
                    <input
                      type="number"
                      name="monthlySalary"
                      value={localSettings.monthlySalary}
                      onChange={handleChange}
                      className={`${inputClass} pl-8`}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>月工作天数</label>
                    <input
                      type="number"
                      name="workDaysPerMonth"
                      value={localSettings.workDaysPerMonth}
                      onChange={handleChange}
                      step="0.1"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>日工作时长</label>
                    <input
                      type="number"
                      name="dailyHours"
                      value={localSettings.dailyHours}
                      onChange={handleChange}
                      className={inputClass}
                    />
                  </div>
                </div>
             </div>
          </div>

          <div className="bg-blue-100 p-4 border-2 border-black shadow-comic-sm rounded-xl">
            <h3 className="font-black text-lg mb-3">⏰ 作息时间</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>上班时间</label>
                <input
                  type="time"
                  name="startTime"
                  value={localSettings.startTime}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>下班时间</label>
                <input
                  type="time"
                  name="endTime"
                  value={localSettings.endTime}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="bg-purple-100 p-4 border-2 border-black shadow-comic-sm rounded-xl">
            <h3 className="font-black text-lg mb-3">👴 退休规划</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>出生日期</label>
                <input
                  type="date"
                  name="birthDate"
                  value={localSettings.birthDate}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>退休年龄</label>
                <input
                  type="number"
                  name="retirementAge"
                  value={localSettings.retirementAge}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* New Redemption Section */}
          <div className="bg-orange-100 p-4 border-2 border-black shadow-comic-sm rounded-xl">
            <h3 className="font-black text-lg mb-3">⚔️ 牛马救赎 (里程碑)</h3>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>目标名称 (如: 提桶跑路)</label>
                <input
                  type="text"
                  name="targetName"
                  value={localSettings.targetName || ''}
                  placeholder="给自己一个盼头"
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>目标日期</label>
                <input
                  type="date"
                  name="targetDate"
                  value={localSettings.targetDate || ''}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div>
             <label className={labelClass}>货币符号</label>
              <input
                type="text"
                name="currencySymbol"
                value={localSettings.currencySymbol}
                onChange={handleChange}
                className={inputClass}
              />
          </div>

          <button
            onClick={() => {
              onSave(localSettings);
              onClose();
            }}
            className="w-full mt-4 bg-[#ff6b6b] hover:bg-[#ff5252] text-white font-black text-xl py-4 px-4 rounded-xl border-2 border-black shadow-comic active:shadow-comic-hover active:translate-x-[2px] active:translate-y-[2px] transition-all font-hand"
          >
            保存并开始搬砖
          </button>
          
          <p className="text-xs text-gray-500 text-center font-bold">
            数据仅保存在本地 LocalStorage，老板看不见。
          </p>
        </div>
      </div>
    </div>
  );
};