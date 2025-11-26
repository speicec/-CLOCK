interface Holiday {
  name: string;
  date: string; // YYYY-MM-DD
}

// 2025 Chinese Public Holidays (Simplified list)
const HOLIDAYS_2025: Holiday[] = [
  { name: '元旦', date: '2025-01-01' },
  { name: '春节', date: '2025-01-29' },
  { name: '清明节', date: '2025-04-04' },
  { name: '劳动节', date: '2025-05-01' },
  { name: '端午节', date: '2025-05-31' },
  { name: '中秋节', date: '2025-10-06' },
  { name: '国庆节', date: '2025-10-01' },
  { name: '元旦(2026)', date: '2026-01-01' },
];

export const getNextHoliday = (): { name: string; days: number } | null => {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  
  // Sort holidays just in case
  const upcoming = HOLIDAYS_2025
    .filter(h => h.date >= todayStr)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (upcoming.length === 0) return null;

  const next = upcoming[0];
  const diffTime = new Date(next.date).getTime() - now.getTime();
  const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return { name: next.name, days: Math.max(0, days) };
};

export const getWeekendWait = (endTimeStr: string): { status: string; text: string } => {
  const now = new Date();
  const day = now.getDay(); // 0 is Sunday, 6 is Saturday
  
  if (day === 0 || day === 6) {
    return { status: 'weekend', text: '周末狂欢中' };
  }

  // Target: Next Friday at endTime
  const target = new Date();
  const daysUntilFriday = (5 - day + 7) % 7; // if Friday (5), returns 0. If Mon (1), returns 4.
  
  // Parse end time
  const [hours, minutes] = endTimeStr.split(':').map(Number);
  
  // If it's Friday and past end time, it's weekend
  if (day === 5 && (now.getHours() > hours || (now.getHours() === hours && now.getMinutes() >= minutes))) {
     return { status: 'weekend', text: '周末狂欢中' };
  }
  
  target.setDate(now.getDate() + daysUntilFriday);
  target.setHours(hours, minutes, 0, 0);

  // If calculation pushed us to past Friday, move to next week? 
  // (Logic handled above: if today is Fri and work is done, it's weekend. Else count to this Fri or next Fri)
  if (target.getTime() < now.getTime()) {
     // Should rely on isWeekend check, but safety net:
     return { status: 'weekend', text: '周末狂欢中' };
  }

  const diffMs = target.getTime() - now.getTime();
  const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(totalHours / 24);
  const remHours = totalHours % 24;

  if (days > 0) {
      return { status: 'working', text: `${days}天${remHours}小时` };
  } else {
      return { status: 'working', text: `${remHours}小时` };
  }
};