import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SettingsDrawer } from './components/SettingsDrawer';
import { InfoCard } from './components/InfoCard';
import { generateWorkerQuote } from './services/geminiService';
import { UserSettings, EarningsData, WorkStatus, WorkLog } from './types';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './components/SortableItem';
import { LunarCalendarModal } from './components/LunarCalendarModal';
import { FocusMode } from './components/FocusMode';
import { HolidayCard } from './components/HolidayCard';
import { RedemptionCard } from './components/RedemptionCard';
import { ShareModal } from './components/ShareModal';
import { ClockInCard } from './components/ClockInCard';

// Default Settings
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
};

const QUOTE_REFRESH_INTERVAL = 30 * 60 * 1000; 

function App() {
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('niuMaSettings_v2');
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  });

  const [cardOrder, setCardOrder] = useState<string[]>(() => {
    const saved = localStorage.getItem('niuMaCardOrder');
    // Migration: ensure new cards exist for old users
    const defaultOrder = ['clockIn', 'earnings', 'shortPain', 'holidays', 'redemption', 'longPain', 'quote'];
    if (saved) {
      const parsed = JSON.parse(saved);
      // Merge unique items from defaultOrder that are missing in parsed
      const missing = defaultOrder.filter(item => !parsed.includes(item));
      return [...missing, ...parsed]; // Add new cards to top usually, or stick to bottom
    }
    return defaultOrder;
  });

  const [workLogs, setWorkLogs] = useState<WorkLog[]>(() => {
    const saved = localStorage.getItem('niuMaWorkLogs');
    return saved ? JSON.parse(saved) : [];
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  // Focus Mode State
  const [isFocusMode, setIsFocusMode] = useState(false);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [earnings, setEarnings] = useState<EarningsData>({
    earnedToday: 0,
    perSecond: 0,
    progressPercentage: 0,
    isOvertime: false,
    timeRemaining: '00:00:00'
  });
  const [status, setStatus] = useState<WorkStatus>(WorkStatus.NOT_STARTED);
  const [quote, setQuote] = useState<string>("正在连接牛马神经网络...");
  const [isQuoteLoading, setIsQuoteLoading] = useState(false);
  
  // Retirement Stats
  const [retirementStats, setRetirementStats] = useState({
    yearsLeft: 0,
    daysLeft: 0,
    progress: 0,
  });

  const lastQuoteTimeRef = useRef<number>(0);

  // DnD Sensors with activation constraints to allow clicking buttons (like refresh quote)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Detect Orientation and Fullscreen for Focus Mode
  useEffect(() => {
    const checkFocusCondition = () => {
      const isLandscape = window.matchMedia("(orientation: landscape)").matches;
      // On mobile, isLandscape is often enough. On desktop, check for fullscreen API.
      const isFullscreen = !!document.fullscreenElement;
      
      // We trigger focus mode if:
      // 1. It is Fullscreen (Desktop or Mobile via API)
      // 2. OR it is Mobile Landscape (width > height and touch capable roughly)
      const isMobileLandscape = isLandscape && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
      
      if (isFullscreen || isMobileLandscape) {
        setIsFocusMode(true);
      } else {
        setIsFocusMode(false);
      }
    };

    window.addEventListener('resize', checkFocusCondition);
    document.addEventListener('fullscreenchange', checkFocusCondition);
    // Initial check
    checkFocusCondition();

    return () => {
      window.removeEventListener('resize', checkFocusCondition);
      document.removeEventListener('fullscreenchange', checkFocusCondition);
    };
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setCardOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        localStorage.setItem('niuMaCardOrder', JSON.stringify(newOrder));
        return newOrder;
      });
    }
  };

  // Save settings to local storage
  const handleSaveSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    localStorage.setItem('niuMaSettings_v2', JSON.stringify(newSettings));
    lastQuoteTimeRef.current = 0; 
  };

  // Save logs
  useEffect(() => {
    localStorage.setItem('niuMaWorkLogs', JSON.stringify(workLogs));
  }, [workLogs]);

  // Handle Clock In
  const handleClockIn = () => {
    const now = new Date();
    const todayStr = now.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
    const timeStr = now.toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit' });

    setWorkLogs(prev => {
      // Check if already clocked in today
      const exists = prev.find(l => l.date === todayStr);
      if (exists) return prev;
      return [...prev, { date: todayStr, startTime: timeStr }];
    });
  };

  // Handle Clock Out
  const handleClockOut = () => {
    const now = new Date();
    const todayStr = now.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '-');
    const timeStr = now.toLocaleTimeString('zh-CN', { hour12: false, hour: '2-digit', minute: '2-digit' });

    setWorkLogs(prev => {
      return prev.map(log => {
        if (log.date === todayStr) {
          return { ...log, endTime: timeStr };
        }
        return log;
      });
    });
  };

  // Calculate Logic
  const calculateEarnings = useCallback(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    const start = new Date(`${todayStr}T${settings.startTime}:00`);
    const end = new Date(`${todayStr}T${settings.endTime}:00`);
    
    // Per second calculation
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
      
      earnedToday = diffSeconds * perSecond;
      const totalShiftSeconds = (end.getTime() - start.getTime()) / 1000;
      
      if (now > end) {
        currentStatus = WorkStatus.OVERTIME;
        isOvertime = true;
        progressPercentage = 100; // Cap at 100 for the main bar, maybe show overflow elsewhere
        timeRemainingStr = "自由延期";
        // Calculate overtime pay if needed, for now just continue standard rate or mark as overtime
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

    setEarnings({
      earnedToday,
      perSecond,
      progressPercentage,
      isOvertime,
      timeRemaining: timeRemainingStr
    });
    
    return currentStatus;
  }, [settings]);

  // Calculate Retirement Logic
  useEffect(() => {
    if (!settings.birthDate) return;
    
    const now = new Date();
    const birth = new Date(settings.birthDate);
    const retirementDate = new Date(birth.getFullYear() + settings.retirementAge, birth.getMonth(), birth.getDate());
    
    const careerStart = new Date(birth.getFullYear() + 22, birth.getMonth(), birth.getDate());
    
    const totalCareerTime = retirementDate.getTime() - careerStart.getTime();
    const timeWorked = now.getTime() - careerStart.getTime();
    
    let progress = 0;
    if (totalCareerTime > 0) {
      progress = Math.max(0, Math.min((timeWorked / totalCareerTime) * 100, 100));
    }

    const diffTime = retirementDate.getTime() - now.getTime();
    if (diffTime <= 0) {
      setRetirementStats({ yearsLeft: 0, daysLeft: 0, progress: 100 });
    } else {
      const yearsLeft = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
      const daysLeft = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24));
      setRetirementStats({ yearsLeft, daysLeft, progress });
    }
  }, [settings, currentTime]);

  // Main Timer Loop
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      const newStatus = calculateEarnings();
      setStatus(newStatus);
    }, 1000); // Update every second

    const moneyTimer = setInterval(() => {
        // Just triggering a re-render for smooth money count if we wanted ms precision
    }, 100);

    return () => {
      clearInterval(timer);
      clearInterval(moneyTimer);
    };
  }, [calculateEarnings]);

  // AI Quote Fetcher
  const fetchQuote = useCallback(async (currentStatus: WorkStatus) => {
    const now = Date.now();
    if (now - lastQuoteTimeRef.current < QUOTE_REFRESH_INTERVAL && lastQuoteTimeRef.current !== 0) {
      return;
    }

    setIsQuoteLoading(true);
    const timeString = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
    
    try {
      const newQuote = await generateWorkerQuote(currentStatus, timeString);
      setQuote(newQuote);
      lastQuoteTimeRef.current = now;
    } finally {
      setIsQuoteLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuote(status);
  }, [status, fetchQuote]);

  const handleRefreshQuote = () => {
    lastQuoteTimeRef.current = 0; 
    fetchQuote(status);
  };

  // Trigger Fullscreen for Focus Mode
  const enterFocusMode = async () => {
    try {
        if (!document.fullscreenElement) {
            await document.documentElement.requestFullscreen();
        }
    } catch (err) {
        console.error("Error attempting to enable full-screen mode:", err);
    }
  };

  const exitFocusMode = async () => {
    try {
        if (document.fullscreenElement) {
            await document.exitFullscreen();
        }
        // Force state update if logic relies on resize event that hasn't fired yet
        setIsFocusMode(false);
    } catch (err) {
        console.error("Error attempting to exit full-screen mode:", err);
    }
  };

  const formattedTime = currentTime.toLocaleTimeString('zh-CN', { 
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  });
  
  const formattedSeconds = currentTime.getSeconds().toString().padStart(2, '0');

  // Render Map
  const renderCard = (id: string) => {
    switch(id) {
      case 'clockIn':
        return (
          <ClockInCard 
            logs={workLogs} 
            onClockIn={handleClockIn} 
            onClockOut={handleClockOut} 
          />
        );
      case 'earnings':
        return (
          <InfoCard 
            title="今日含泪收入" 
            bgColor="bg-[#ffde59]" 
            icon={<span className="text-2xl animate-bounce">💰</span>}
          >
            <div className="flex flex-col items-center py-2">
               <div className="relative">
                  <div className="text-5xl md:text-6xl font-black font-mono text-black tracking-tight drop-shadow-sm">
                    {settings.currencySymbol}{earnings.earnedToday.toFixed(4)}
                  </div>
                  {status === WorkStatus.WORKING && (
                     <div className="absolute -right-6 -top-2 text-2xl animate-pulse">✨</div>
                  )}
               </div>
               
               <div className="mt-2 text-sm font-bold bg-white/50 px-3 py-1 rounded-full border border-black/10">
                  秒薪: {settings.currencySymbol}{earnings.perSecond.toFixed(5)}
               </div>
            </div>
          </InfoCard>
        );
      case 'shortPain':
        return (
          <InfoCard 
            title="距离下班 (短痛)" 
            bgColor={status === WorkStatus.OVERTIME ? "bg-[#ff6b6b]" : "bg-[#5cff88]"} 
            icon={<span>⚡</span>}
          >
            <div className="mt-2">
               {status === WorkStatus.OVERTIME ? (
                  <div className="text-center">
                      <div className="text-4xl font-black font-mono text-white mb-2 blink">
                         {earnings.timeRemaining}
                      </div>
                      <p className="font-bold text-black/70">义务奉献中...</p>
                  </div>
               ) : (
                 <>
                   <div className="flex justify-between items-end mb-2">
                      <span className="text-4xl font-black font-mono">{earnings.timeRemaining}</span>
                      <span className="font-bold text-black/60">{Math.floor(earnings.progressPercentage)}%</span>
                   </div>
                   <div className="w-full h-8 bg-black/10 border-2 border-black rounded-full overflow-hidden relative">
                      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(45deg,rgba(0,0,0,0.1)_25%,transparent_25%,transparent_50%,rgba(0,0,0,0.1)_50%,rgba(0,0,0,0.1)_75%,transparent_75%,transparent)] bg-[length:20px_20px]"></div>
                      <div 
                        className="h-full bg-black transition-all duration-1000 ease-linear flex items-center justify-end px-2"
                        style={{ width: `${earnings.progressPercentage}%` }}
                      >
                        {earnings.progressPercentage > 5 && <span className="text-white text-xs font-bold">🏃</span>}
                      </div>
                   </div>
                 </>
               )}
            </div>
          </InfoCard>
        );
      case 'holidays':
        return <HolidayCard endTime={settings.endTime} />;
      case 'redemption':
        return <RedemptionCard targetName={settings.targetName} targetDate={settings.targetDate} />;
      case 'longPain':
        return (
          <InfoCard 
            title="距离退休 (长痛)" 
            bgColor="bg-[#a2d2ff]" 
            icon={<span>🏖️</span>}
          >
            <div className="mt-2">
               <div className="flex items-baseline gap-2 mb-3">
                 <span className="text-4xl font-black font-mono">{retirementStats.yearsLeft}</span>
                 <span className="text-xl font-bold">年</span>
                 <span className="text-4xl font-black font-mono ml-2">{retirementStats.daysLeft}</span>
                 <span className="text-xl font-bold">天</span>
               </div>
               
               <div className="w-full h-4 bg-white border-2 border-black rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#5e60ce]"
                    style={{ width: `${retirementStats.progress}%` }}
                  ></div>
               </div>
               <div className="flex justify-between mt-1 text-xs font-bold text-black/60">
                  <span>22岁</span>
                  <span>进度: {retirementStats.progress.toFixed(1)}%</span>
                  <span>{settings.retirementAge}岁</span>
               </div>
            </div>
          </InfoCard>
        );
      case 'quote':
        return (
          <div className="bg-white border-2 border-black rounded-xl p-6 shadow-comic relative mt-2 group-hover:translate-y-0 transition-transform">
             <div className="absolute -top-5 -left-3 bg-black text-white px-3 py-1 text-sm font-bold rotate-[-3deg] border-2 border-white shadow-sm font-hand">
                每日一碗毒鸡汤
             </div>
             
             <blockquote className="text-xl font-bold text-gray-800 leading-relaxed font-hand text-center min-h-[80px] flex items-center justify-center">
               "{quote}"
             </blockquote>
             
             <div className="flex justify-center mt-4 pointer-events-auto">
                <button 
                  onClick={(e) => {
                    // Prevent drag
                    e.stopPropagation();
                    handleRefreshQuote();
                  }}
                  onPointerDown={(e) => e.stopPropagation()} // Stop DnD start
                  disabled={isQuoteLoading}
                  className="text-sm font-bold text-gray-500 hover:text-black underline decoration-2 underline-offset-4 decoration-wavy decoration-red-400 cursor-pointer relative z-30"
                >
                  {isQuoteLoading ? '熬汤中...' : '再来一碗'}
                </button>
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full font-sans pb-12">
      
      {/* Focus Mode Overlay */}
      {isFocusMode && <FocusMode onExit={exitFocusMode} />}

      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-[#fcfbf7]/90 backdrop-blur-md border-b-4 border-black py-3">
        <div className="max-w-xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-2xl border-2 border-white shadow-sm">
               🐂
            </div>
            <h1 className="font-black text-2xl tracking-tighter font-hand">牛马时钟</h1>
          </div>
          <div className="flex gap-2">
             <button
               onClick={() => setIsShareModalOpen(true)}
               className="p-2 border-2 border-black rounded-lg hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
             >
                📸
             </button>
             <button
               onClick={enterFocusMode}
               className="hidden md:block p-2 text-sm font-bold border-2 border-black rounded-lg hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
               title="全屏进入专注模式"
             >
               🍅 专注模式
             </button>
             <button 
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 border-2 border-black rounded-lg hover:bg-black hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
             >
                ⚙️ 设置
             </button>
          </div>
        </div>
      </nav>

      <main className="max-w-xl mx-auto px-4 py-6 flex flex-col gap-6">
        
        {/* Top Header - Time */}
        <div className="text-center mb-2 cursor-pointer group relative" onClick={() => setIsCalendarOpen(true)}>
           <div className="inline-block bg-black text-white px-6 py-2 rounded-full border-2 border-black mb-4 shadow-comic transition-transform group-hover:scale-105">
              <span className="font-bold tracking-widest uppercase">{status}</span>
           </div>
           <div className="flex justify-center items-baseline font-black text-7xl md:text-8xl text-black font-mono tracking-tighter group-hover:text-gray-800 transition-colors">
             {formattedTime}
             <span className="text-4xl ml-2 text-gray-400">{formattedSeconds}</span>
           </div>
           <div className="flex items-center justify-center gap-2 mt-1">
             <p className="text-gray-500 font-bold group-hover:text-black transition-colors">
               {currentTime.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
             </p>
             <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded font-bold animate-pulse">宜忌</span>
           </div>
        </div>

        {/* Draggable List */}
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={cardOrder}
            strategy={verticalListSortingStrategy}
          >
            {cardOrder.map((id) => (
              <SortableItem key={id} id={id}>
                {renderCard(id)}
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>

      </main>

      <SettingsDrawer 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        settings={settings}
        onSave={handleSaveSettings}
      />

      <LunarCalendarModal 
        isOpen={isCalendarOpen} 
        onClose={() => setIsCalendarOpen(false)} 
        date={currentTime}
      />

      <ShareModal
         isOpen={isShareModalOpen}
         onClose={() => setIsShareModalOpen(false)}
         status={status}
         timeRemaining={earnings.timeRemaining}
         earned={earnings.earnedToday.toFixed(2)}
      />
    </div>
  );
}

export default App;