
import { UserSettings, WorkStatus, EarningsData } from '../types';

export const calculateEarnings = (settings: UserSettings): { 
  earnings: EarningsData; 
  status: WorkStatus; 
} => {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  
  // Construct Start/End dates
  const start = new Date(`${todayStr}T${settings.startTime}:00`);
  const end = new Date(`${todayStr}T${settings.endTime}:00`);
  
  const dailyPay = settings.monthlySalary / settings.workDaysPerMonth;
  const hourlyPay = dailyPay / settings.dailyHours;
  const perSecond = hourlyPay / 3600;

  let earnedToday = 0;
  let progressPercentage = 0;
  let isOvertime = false;
  let currentStatus = WorkStatus.NOT_STARTED;
  let timeRemainingStr = "00:00:00";

  if (now < start) {
    currentStatus = WorkStatus.NOT_STARTED;
    timeRemainingStr = "等待刑期";
    progressPercentage = 0;
  } else {
    const diffMs = now.getTime() - start.getTime();
    const diffSeconds = diffMs / 1000;
    
    // Base earned for the day so far
    earnedToday = diffSeconds * perSecond;
    const totalShiftSeconds = (end.getTime() - start.getTime()) / 1000;
    
    if (now > end) {
      currentStatus = WorkStatus.OVERTIME;
      isOvertime = true;
      progressPercentage = 100;
      timeRemainingStr = "自由延期";
      // Overtime continues accumulating money
      earnedToday = diffSeconds * perSecond; 
    } else {
      currentStatus = WorkStatus.WORKING;
      progressPercentage = Math.min((diffSeconds / totalShiftSeconds) * 100, 100);
      
      const remainingMs = end.getTime() - now.getTime();
      const remH = Math.floor(remainingMs / (1000 * 60 * 60));
      const remM = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
      const remS = Math.floor((remainingMs % (1000 * 60)) / 1000);
      timeRemainingStr = `${remH.toString().padStart(2, '0')}:${remM.toString().padStart(2, '0')}:${remS.toString().padStart(2, '0')}`;
    }
  }

  return {
    status: currentStatus,
    earnings: {
      earnedToday,
      perSecond,
      progressPercentage,
      isOvertime,
      timeRemaining: timeRemainingStr
    }
  };
};
