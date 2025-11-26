export interface UserSettings {
  monthlySalary: number;
  workDaysPerMonth: number; // Usually 21.75
  dailyHours: number; // Usually 8
  startTime: string; // "09:00"
  endTime: string; // "18:00"
  currencySymbol: string;
  birthDate: string; // "1990-01-01"
  retirementAge: number; // 60
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