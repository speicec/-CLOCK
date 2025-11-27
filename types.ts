export interface UserSettings {
  monthlySalary: number;
  workDaysPerMonth: number; // Usually 21.75
  dailyHours: number; // Usually 8
  startTime: string; // "09:00"
  endTime: string; // "18:00"
  currencySymbol: string;
  birthDate: string; // "1990-01-01"
  retirementAge: number; // 60
  targetName?: string; // "Quit Job"
  targetDate?: string; // "2025-12-31"
  avatar?: string; // Base64 string of user avatar
  salaryDay: number; // Day of month (1-31)
}

export interface EarningsData {
  earnedToday: number;
  perSecond: number;
  progressPercentage: number;
  isOvertime: boolean;
  timeRemaining: string;
}

export enum WorkStatus {
  NOT_STARTED = '还没开工',
  WORKING = '搬砖中',
  OVERTIME = '加班地狱',
  FREEDOM = '已下班',
}

export interface WorkLog {
  date: string; // "YYYY-MM-DD"
  startTime: string;
  endTime?: string;
}

export interface RandomEvent {
  id: string;
  title: string;
  description: string;
  type: 'good' | 'bad' | 'neutral';
  effectText: string;
  icon: string;
}