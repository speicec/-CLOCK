export interface UserSettings {
  monthlySalary: number;
  workDaysPerMonth: number;
  dailyHours: number;
  startTime: string;
  endTime: string;
  currencySymbol: string;
  birthDate: string;
  retirementAge: number;
  targetName?: string;
  targetDate?: string;
  avatar?: string;
  salaryDay: number;
}

export enum WorkStatus {
  NOT_STARTED = '还没开工',
  WORKING = '搬砖中',
  OVERTIME = '加班地狱',
  FREEDOM = '已下班',
}

export interface EarningsData {
  earnedToday: number;
  perSecond: number;
  progressPercentage: number;
  isOvertime: boolean;
  timeRemaining: string;
}

export interface WorkLog {
  date: string;
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
