import React, { useEffect, useState } from 'react';
import * as LunarLib from 'lunar-javascript';

// Handle potential ESM/CJS interop issues where library might be on .default
// @ts-ignore
const Solar = LunarLib.Solar || (LunarLib.default && LunarLib.default.Solar) || (window as any).Solar;
// @ts-ignore
const Lunar = LunarLib.Lunar || (LunarLib.default && LunarLib.default.Lunar) || (window as any).Lunar;

interface LunarCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: Date;
}

export const LunarCalendarModal: React.FC<LunarCalendarModalProps> = ({ isOpen, onClose, date }) => {
  const [lunarData, setLunarData] = useState<any>(null);

  useEffect(() => {
    if (isOpen && Solar && Lunar) {
      try {
        const solar = Solar.fromDate(date);
        const lunar = solar.getLunar();
        setLunarData({
          lunarMonth: lunar.getMonthInChinese() + '月',
          lunarDay: lunar.getDayInChinese(),
          yearGanZhi: lunar.getYearInGanZhi() + '年',
          zodiac: lunar.getYearShengXiao(),
          yi: lunar.getDayYi(),
          ji: lunar.getDayJi(),
          jieQi: lunar.getJieQi(),
          week: lunar.getWeekInChinese(),
          suit: lunar.getDayYi().slice(0, 4), // Take up to 4 items
          avoid: lunar.getDayJi().slice(0, 4),
        });
      } catch (e) {
        console.error("Error generating lunar date:", e);
      }
    }
  }, [isOpen, date]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>
      
      <div className="relative bg-[#fcfbf7] w-full max-w-sm rounded-lg shadow-2xl border-4 border-black animate-bounce-sm transform rotate-1 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        
        {/* Tear-off Header */}
        <div className="bg-[#d90429] text-[#fffdf5] p-4 text-center border-b-4 border-black relative">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-black rounded-full border-4 border-[#8d99ae]"></div>
            <h3 className="text-xl font-bold font-hand mt-2 opacity-90">{date.getFullYear()} 公历</h3>
            <div className="text-5xl font-black font-hand mt-1">{date.getMonth() + 1}月{date.getDate()}日</div>
            <div className="text-lg font-bold mt-1 opacity-90">星期{lunarData?.week || ''}</div>
        </div>

        {/* Calendar Body */}
        {lunarData ? (
          <div className="p-6 text-center">
              <div className="flex justify-center items-center gap-2 mb-2">
                  <span className="bg-black text-white px-2 py-0.5 text-xs font-bold rounded">农历</span>
                  <span className="font-bold text-xl font-hand">{lunarData.yearGanZhi} ({lunarData.zodiac})</span>
              </div>
              
              <div className="text-6xl font-black font-hand text-black mb-2">
                  {lunarData.lunarMonth}{lunarData.lunarDay}
              </div>
              
              {lunarData.jieQi && (
                  <div className="text-rose-500 font-bold mb-4">
                      ◆ {lunarData.jieQi} ◆
                  </div>
              )}

              <div className="grid grid-cols-2 gap-4 mt-6 border-t-2 border-dashed border-gray-300 pt-4">
                  <div className="text-left">
                      <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-[#38b000] text-white flex items-center justify-center font-black text-sm border-2 border-black">宜</div>
                      </div>
                      <ul className="text-sm font-bold text-gray-700 space-y-1">
                          {lunarData.suit.map((item: string, i: number) => (
                              <li key={i}>{item}</li>
                          ))}
                      </ul>
                  </div>
                  <div className="text-left">
                      <div className="flex items-center gap-2 mb-2">
                           <div className="w-8 h-8 rounded-full bg-[#d90429] text-white flex items-center justify-center font-black text-sm border-2 border-black">忌</div>
                      </div>
                      <ul className="text-sm font-bold text-gray-700 space-y-1">
                          {lunarData.avoid.map((item: string, i: number) => (
                              <li key={i}>{item}</li>
                          ))}
                      </ul>
                  </div>
              </div>
          </div>
        ) : (
          <div className="p-10 text-center font-bold text-gray-500">
            日历加载中...
          </div>
        )}

        {/* Footer */}
        <div className="bg-[#edf2f4] p-3 text-center border-t-4 border-black">
            <p className="text-xs text-gray-500 font-bold">今日运势：{Math.random() > 0.5 ? '搬砖' : '摸鱼'}</p>
        </div>
      </div>
    </div>
  );
};