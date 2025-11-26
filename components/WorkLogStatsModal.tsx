import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
  AreaChart,
  Area,
  CartesianGrid
} from 'recharts';
import { WorkLog } from '../types';

interface WorkLogStatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: WorkLog[];
  dailyHoursTarget: number;
}

export const WorkLogStatsModal: React.FC<WorkLogStatsModalProps> = ({ isOpen, onClose, logs, dailyHoursTarget }) => {
  // Process Data
  const stats = useMemo(() => {
    // 1. Monthly Counts
    const monthlyCounts: Record<string, number> = {};
    
    // 2. Recent Logs with Duration
    const recentLogs = logs.slice(-14); // Last 14 entries
    const durationData = recentLogs.map(log => {
      let duration = 0;
      if (log.startTime && log.endTime) {
        const [startH, startM] = log.startTime.split(':').map(Number);
        const [endH, endM] = log.endTime.split(':').map(Number);
        const startVal = startH + startM / 60;
        const endVal = endH + endM / 60;
        duration = endVal - startVal;
      }
      
      // Update Monthly Count
      const monthKey = log.date.substring(0, 7); // YYYY-MM
      monthlyCounts[monthKey] = (monthlyCounts[monthKey] || 0) + 1;

      return {
        date: log.date.substring(5), // MM-DD
        hours: parseFloat(duration.toFixed(1)),
        fullDate: log.date
      };
    });

    const monthlyData = Object.keys(monthlyCounts).sort().map(key => ({
      name: key,
      days: monthlyCounts[key]
    }));

    return { monthlyData, durationData };
  }, [logs]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>
      
      <div className="relative bg-[#fcfbf7] w-full max-w-2xl rounded-xl shadow-2xl border-4 border-black p-6 animate-slide-in max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-black font-hand">📊 牛马血汗史</h3>
            <button onClick={onClose} className="text-2xl hover:scale-110 transition-transform">✖️</button>
        </div>

        {logs.length === 0 ? (
           <div className="text-center py-20 bg-gray-100 rounded-lg border-2 border-dashed border-gray-400">
              <div className="text-6xl mb-4">🤷‍♂️</div>
              <p className="font-bold text-gray-500">还未开始打卡，<br/>是一张白纸（也是一种幸福）。</p>
           </div>
        ) : (
          <div className="space-y-8">
            
            {/* Chart 1: Daily Duration */}
            <div className="bg-white p-4 border-2 border-black rounded-xl shadow-comic-sm">
               <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                 <span>⏱️</span>
                 <span>近期工时波动 (心率图)</span>
               </h4>
               <div className="h-64 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={stats.durationData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ff6b6b" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#ff6b6b" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                      <XAxis 
                        dataKey="date" 
                        tick={{fontSize: 10, fill: '#666', fontWeight: 'bold'}} 
                        axisLine={{stroke: '#000', strokeWidth: 2}}
                      />
                      <YAxis 
                        tick={{fontSize: 10, fill: '#666', fontWeight: 'bold'}} 
                        axisLine={{stroke: '#000', strokeWidth: 2}}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '8px', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                        formatter={(value: number) => [`${value} 小时`, '工时']}
                        labelStyle={{ color: '#aaa', marginBottom: '4px' }}
                      />
                      <ReferenceLine y={dailyHoursTarget} label="标准" stroke="red" strokeDasharray="3 3" />
                      <Area 
                        type="monotone" 
                        dataKey="hours" 
                        stroke="#000" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorHours)" 
                      />
                    </AreaChart>
                 </ResponsiveContainer>
               </div>
               <p className="text-xs text-gray-500 text-center mt-2 font-bold">显示最近14次打卡记录</p>
            </div>

            {/* Chart 2: Monthly Attendance */}
            <div className="bg-[#fffdf5] p-4 border-2 border-black rounded-xl shadow-comic-sm">
               <h4 className="font-bold text-lg mb-4 flex items-center gap-2">
                 <span>📅</span>
                 <span>月度出勤 (纯狱风)</span>
               </h4>
               <div className="h-64 w-full">
                 <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                      <XAxis 
                        dataKey="name" 
                        tick={{fontSize: 10, fill: '#666', fontWeight: 'bold'}} 
                        axisLine={{stroke: '#000', strokeWidth: 2}}
                      />
                      <YAxis 
                        tick={{fontSize: 10, fill: '#666', fontWeight: 'bold'}} 
                        axisLine={{stroke: '#000', strokeWidth: 2}}
                      />
                      <Tooltip 
                         cursor={{fill: 'transparent'}}
                         contentStyle={{ backgroundColor: '#000', border: 'none', borderRadius: '8px', color: '#fff' }}
                         itemStyle={{ color: '#fff' }}
                         formatter={(value: number) => [`${value} 天`, '出勤']}
                      />
                      <Bar dataKey="days" radius={[4, 4, 0, 0]} barSize={40}>
                        {stats.monthlyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#ffde59' : '#5cff88'} stroke="#000" strokeWidth={2} />
                        ))}
                      </Bar>
                    </BarChart>
                 </ResponsiveContainer>
               </div>
            </div>

            {/* Summary Text */}
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-gray-100 p-3 rounded-lg border-2 border-black text-center">
                  <div className="text-xs text-gray-500 font-bold">累计打卡</div>
                  <div className="text-2xl font-black">{logs.length} <span className="text-sm">次</span></div>
               </div>
               <div className="bg-gray-100 p-3 rounded-lg border-2 border-black text-center">
                  <div className="text-xs text-gray-500 font-bold">最近状态</div>
                  <div className="text-2xl font-black">
                    {stats.durationData.length > 0 && stats.durationData[stats.durationData.length-1].hours > dailyHoursTarget 
                      ? '💀 卷王' 
                      : '🐟 养生'}
                  </div>
               </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
