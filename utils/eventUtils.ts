import { RandomEvent } from '../types';

const EVENTS: RandomEvent[] = [
  {
    id: 'boss_trip',
    title: '天降祥瑞',
    description: '老板临时出差三天，办公室气氛突然变得快活起来。',
    type: 'good',
    effectText: '摸鱼难度 -50%',
    icon: '✈️'
  },
  {
    id: 'free_coffee',
    title: '能量补给',
    description: '隔壁部门请喝奶茶，居然有你的一杯。',
    type: 'good',
    effectText: '快乐值 +10',
    icon: '🧋'
  },
  {
    id: 'system_down',
    title: '赛博罢工',
    description: '公司内网崩了，全体无法工作，被迫带薪发呆。',
    type: 'good',
    effectText: '带薪发呆 +2小时',
    icon: '💻'
  },
  {
    id: 'urgent_meeting',
    title: '午夜凶铃',
    description: '下班前5分钟，老板突然说“简单开个会”。',
    type: 'bad',
    effectText: '下班时间 +???',
    icon: '📞'
  },
  {
    id: 'keyboard_broken',
    title: '装备损毁',
    description: '键盘的回车键突然坏了，发送消息变得异常艰难。',
    type: 'bad',
    effectText: '工作效率 -30%',
    icon: '⌨️'
  },
  {
    id: 'ppt_crash',
    title: '非正常退出',
    description: '做了一下午的PPT突然崩溃，且没有保存。',
    type: 'bad',
    effectText: 'san值 -100',
    icon: '📉'
  },
  {
    id: 'rain_commute',
    title: '落汤鸡',
    description: '忘带伞的下班路上突然暴雨，共享单车座垫全是水。',
    type: 'bad',
    effectText: '体面 -100',
    icon: '🌧️'
  },
  {
    id: 'dream_crusher',
    title: '画饼充饥',
    description: '老板又在画饼了：“公司上市后大家都有期权”。',
    type: 'neutral',
    effectText: '信任度 -10',
    icon: '🥞'
  }
];

// 20% chance to trigger an event per day
const TRIGGER_PROBABILITY = 0.2; 

export const checkDailyRandomEvent = (): RandomEvent | null => {
  const today = new Date().toLocaleDateString();
  const lastCheck = localStorage.getItem('niuMaLastEventCheck');
  
  // If already checked today, don't trigger again
  if (lastCheck === today) {
    return null;
  }
  
  // Mark as checked
  localStorage.setItem('niuMaLastEventCheck', today);

  // Roll dice
  if (Math.random() > TRIGGER_PROBABILITY) {
    return null;
  }

  // Pick random event
  const randomIndex = Math.floor(Math.random() * EVENTS.length);
  return EVENTS[randomIndex];
};