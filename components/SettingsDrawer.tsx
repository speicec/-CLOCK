
import React, { useState, useRef } from 'react';
import { UserSettings } from '../types';
import { THEMES } from '../themes';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onSave: (newSettings: UserSettings) => void;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setLocalSettings(prev => ({
      ...prev,
      [name]: (name.includes('Time') || name.includes('Date') || name === 'currencySymbol' || name === 'targetName' || name === 'theme') ? value : Number(value)
    }));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 500 * 1024) {
      alert("图片太大了！请上传 500KB 以下的图片（LocalStorage 空间有限）。");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setLocalSettings(prev => ({ ...prev, avatar: base64String }));
    };
    reader.readAsDataURL(file);
  };

  const clearAvatar = () => {
    setLocalSettings(prev => ({ ...prev, avatar: undefined }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  if (!isOpen) return null;

  const inputClass = "w-full bg-card-bg border-2 border-app-border rounded-lg py-2 px-3 text-app-text focus:shadow-[4px_4px_0px_0px_var(--app-shadow)] focus:translate-x-[-2px] focus:translate-y-[-2px] transition-all outline-none font-bold";
  const labelClass = "block text-sm font-bold text-app-text mb-1 font-hand tracking-wider";

  return (
    <div className="fixed inset-0 z-50 flex justify-end text-app-text">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Drawer */}
      <div className="relative w-full max-w-md bg-app-bg h-full shadow-2xl p-6 overflow-y-auto border-l-4 border-app-border animate-slide-in">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black font-hand">
            ⚙️ 设定你的身价
          </h2>
          <button onClick={onClose} className="text-2xl hover:scale-110 transition-transform">✖️</button>
        </div>
        
        <div className="space-y-6 font-sans pb-10">
          
          {/* Theme Section */}
           <div className="bg-card-bg p-4 border-2 border-app-border shadow-comic-sm rounded-xl">
             <h3 className="font-black text-lg mb-3">🎨 主题风格</h3>
             <div className="grid grid-cols-2 gap-3">
               {Object.keys(THEMES).map(key => {
                 const theme = THEMES[key];
                 const isActive = (localSettings.theme || 'default') === key;
                 return (
                   <button
                     key={key}
                     onClick={() => setLocalSettings(prev => ({ ...prev, theme: key }))}
                     className={`p-2 rounded-lg border-2 text-sm font-bold transition-all ${
                       isActive 
                         ? 'border-app-border shadow-comic-sm scale-105' 
                         : 'border-transparent opacity-70 hover:opacity-100 hover:border-gray-300'
                     }`}
                     style={{
                        backgroundColor: theme.colors['--app-bg'],
                        color: theme.colors['--app-text']
                     }}
                   >
                      {theme.name}
                      {isActive && ' ✓'}
                   </button>
                 );
               })}
             </div>
          </div>

          {/* Avatar Section */}
          <div className="bg-card-bg p-4 border-2 border-app-border shadow-comic-sm rounded-xl text-center">
             <h3 className="font-black text-lg mb-3">📸 你的尊容</h3>
             <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-full border-4 border-app-border overflow-hidden bg-gray-100 flex items-center justify-center relative shadow-sm">
                   {localSettings.avatar ? (
                     <img src={localSettings.avatar} alt="Avatar" className="w-full h-full object-cover" />
                   ) : (
                     <span className="text-4xl">🐂</span>
                   )}
                </div>
                <div className="flex gap-2">
                   <button 
                     onClick={() => fileInputRef.current?.click()}
                     className="px-3 py-1 bg-app-text text-app-bg text-sm font-bold rounded hover:opacity-80 transition-colors"
                   >
                     上传头像
                   </button>
                   {localSettings.avatar && (
                     <button 
                       onClick={clearAvatar}
                       className="px-3 py-1 bg-accent-red text-white text-sm font-bold rounded hover:opacity-90 transition-colors"
                     >
                       删除
                     </button>
                   )}
                   <input 
                     type="file" 
                     ref={fileInputRef} 
                     onChange={handleAvatarUpload} 
                     accept="image/*" 
                     className="hidden" 
                   />
                </div>
             </div>
          </div>

          <div className="bg-accent-yellow p-4 border-2 border-app-border shadow-comic-sm rounded-xl">
             <h3 className="font-black text-lg mb-3">💰 薪资待遇</h3>
             <div className="space-y-4">
                <div>
                  <label className={labelClass}>月薪 (税前)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 font-bold opacity-60">{localSettings.currencySymbol}</span>
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
                <div>
                    <label className={labelClass}>每月发薪日 (几号)</label>
                    <input
                      type="number"
                      name="salaryDay"
                      value={localSettings.salaryDay}
                      onChange={handleChange}
                      min="1"
                      max="31"
                      className={inputClass}
                      placeholder="例如: 15"
                    />
                  </div>
             </div>
          </div>

          <div className="bg-accent-blue p-4 border-2 border-app-border shadow-comic-sm rounded-xl">
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

          <div className="bg-accent-green p-4 border-2 border-app-border shadow-comic-sm rounded-xl">
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

          <div className="bg-accent-orange p-4 border-2 border-app-border shadow-comic-sm rounded-xl">
            <h3 className="font-black text-lg mb-3">⚔️ 牛马救赎 (里程碑)</h3>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>目标名称 (如: 买车/买房/离职)</label>
                <input
                  type="text"
                  name="targetName"
                  value={localSettings.targetName || ''}
                  placeholder="输入具体目标有惊喜"
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
            className="w-full mt-4 bg-accent-red hover:opacity-90 text-white font-black text-xl py-4 px-4 rounded-xl border-2 border-app-border shadow-comic active:shadow-comic-hover active:translate-x-[2px] active:translate-y-[2px] transition-all font-hand"
          >
            保存并开始搬砖
          </button>
          
          <p className="text-xs text-app-text opacity-70 text-center font-bold">
            数据仅保存在本地 LocalStorage，老板看不见。
          </p>
        </div>
      </div>
    </div>
  );
};
