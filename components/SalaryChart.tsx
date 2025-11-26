import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface SalaryChartProps {
  earned: number;
  totalDaily: number;
  isOvertime: boolean;
}

export const SalaryChart: React.FC<SalaryChartProps> = ({ earned, totalDaily, isOvertime }) => {
  const remaining = Math.max(0, totalDaily - earned);
  // If overtime, earned > totalDaily.
  
  const data = isOvertime 
    ? [
        { name: 'Standard', value: totalDaily },
        { name: 'Overtime', value: earned - totalDaily }
      ]
    : [
        { name: 'Earned', value: earned },
        { name: 'Remaining', value: remaining }
      ];

  const COLORS = isOvertime 
    ? ['#059669', '#e11d48'] // Emerald (Base), Rose (Overtime)
    : ['#059669', '#334155']; // Emerald (Earned), Slate (Remaining)

  return (
    <div className="h-48 w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
            formatter={(value: number) => value.toFixed(2)}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-xs text-slate-400 uppercase tracking-widest">{isOvertime ? '加班工资' : '今日进度'}</span>
        <span className={`text-xl font-bold font-mono ${isOvertime ? 'text-rose-400' : 'text-emerald-400'}`}>
          {isOvertime ? `${Math.floor(((earned - totalDaily)/totalDaily)*100)}%` : `${Math.floor((earned/totalDaily)*100)}%`}
        </span>
      </div>
    </div>
  );
};