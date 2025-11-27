import Taro from '@tarojs/taro';
import { UserSettings, WorkLog } from '../types';

const KEYS = {
  SETTINGS: 'niuMaSettings_v2',
  WORK_LOGS: 'niuMaWorkLogs',
  CARD_ORDER: 'niuMaCardOrder',
  BREAKDOWN_UNTIL: 'niuMaBreakdownUntil',
  BAD_COMBO: 'niuMaBadCombo'
};

const DEFAULT_SETTINGS: UserSettings = {
  monthlySalary: 15000,
  workDaysPerMonth: 21.75,
  dailyHours: 8,
  startTime: '09:00',
  endTime: '18:00',
  currencySymbol: '¥',
  birthDate: '1995-01-01',
  retirementAge: 60,
  targetName: '',
  targetDate: '',
  salaryDay: 15,
};

export const Storage = {
  getSettings: (): UserSettings => {
    try {
      const data = Taro.getStorageSync(KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },
  saveSettings: (settings: UserSettings) => {
    Taro.setStorageSync(KEYS.SETTINGS, JSON.stringify(settings));
  },
  getWorkLogs: (): WorkLog[] => {
    try {
      const data = Taro.getStorageSync(KEYS.WORK_LOGS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  saveWorkLogs: (logs: WorkLog[]) => {
    Taro.setStorageSync(KEYS.WORK_LOGS, JSON.stringify(logs));
  },
  getBreakdownUntil: (): number => {
    return Number(Taro.getStorageSync(KEYS.BREAKDOWN_UNTIL) || 0);
  },
  setBreakdownUntil: (val: number) => {
    Taro.setStorageSync(KEYS.BREAKDOWN_UNTIL, val.toString());
  },
  getBadCombo: (): number => {
    return Number(Taro.getStorageSync(KEYS.BAD_COMBO) || 0);
  },
  setBadCombo: (val: number) => {
    Taro.setStorageSync(KEYS.BAD_COMBO, val.toString());
  }
};
