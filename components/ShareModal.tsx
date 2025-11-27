import React, { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { getEquipment } from './RedemptionCard';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: string;
  timeRemaining: string;
  earned: string;
  avatar?: string;
  targetName?: string;
  targetDate?: string;
  // New props for breakdown mode
  isBreakdownMode?: boolean;
  retirementStats?: { yearsLeft: number; daysLeft: number; progress: number };
  birthDate?: string;
  retirementAge?: number;
  // New prop for Run Mode
  isRunMode?: boolean;
}

const DESTINATIONS = [
  { name: 'Reykjavik, Iceland', image: 'https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=600&q=80' },
  { name: 'Kyoto, Japan', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600&q=80' },
  { name: 'Maldives', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80' },
  { name: 'Swiss Alps', image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80' },
  { name: 'Santorini, Greece', image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=600&q=80' },
  { name: 'Queenstown, NZ', image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=600&q=80' },
  { name: 'Banff, Canada', image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80' },
  { name: 'Amalfi Coast, Italy', image: 'https://images.unsplash.com/photo-1633321088355-d0f8c1eaad4b?auto=format&fit=crop&w=600&q=80' },
];

export const ShareModal: React.FC<ShareModalProps> = ({ 
  isOpen, 
  onClose, 
  status, 
  timeRemaining, 
  earned, 
  avatar, 
  targetName, 
  targetDate,
  isBreakdownMode = false,
  retirementStats,
  birthDate,
  retirementAge,
  isRunMode = false
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [equipment, setEquipment] = useState<any>(null);
  const [epitaph, setEpitaph] = useState('');
  const [destination, setDestination] = useState(DESTINATIONS[0]);

  // Equipment Logic for Standard Mode
  useEffect(() => {
    if (targetName && targetDate) {
      const now = new Date();
      const target = new Date(targetDate);
      const diffTime = target.getTime() - now.getTime();
      const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setEquipment(getEquipment(targetName, daysLeft));
    }
  }, [targetName, targetDate]);

  // Logic for Breakdown Mode and Run Mode
  useEffect(() => {
    if (isOpen) {
      if (isBreakdownMode) {
        const epitaphs = [
          "KPI 未达标，含恨离去。",
          "生前是个好牛马，可惜话太多。",
          "房贷没还完，人先走了。",
          "终于可以不用回钉钉了。",
          "下辈子争取当个熊猫。",
          "这里长眠着一个没有梦想的灵魂。",
          "他差点就熬到了退休。",
          "最大的遗憾是没把老板带走。",
          "因过度画饼导致消化不良而亡。",
          "至死都没等到涨薪通知。",
          "比起死亡，周一早上更可怕。",
          "不仅没留下遗产，还欠了花呗。"
        ];
        setEpitaph(epitaphs[Math.floor(Math.random() * epitaphs.length)]);
      } else if (isRunMode) {
        setDestination(DESTINATIONS[Math.floor(Math.random() * DESTINATIONS.length)]);
      }
    }
  }, [isOpen, isBreakdownMode, isRunMode]);

  if (!isOpen) return null;

  const handleShare = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Ensure images load (longer for external)
      
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true,
      });

      const image = canvas.toDataURL('image/png');
      
      const link = document.createElement('a');
      link.href = image;
      link.download = `niu-ma-clock-${isRunMode ? 'freedom' : (isBreakdownMode ? 'rip' : 'status')}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (err) {
      console.error("Screenshot failed:", err);
      alert("生成图片失败，请手动截图");
    } finally {
      setIsGenerating(false);
    }
  };

  const getEmoji = () => {
    if (status.includes('加班')) return '💀';
    if (status.includes('下班')) return '🎉';
    return '🐴';
  };

  const getTitle = () => {
    if (status.includes('加班')) return 'SOS! 救命!';
    if (status.includes('下班')) return '我自由了!';
    return '牛马求生中';
  };

  const birthYear = birthDate ? new Date(birthDate).getFullYear() : 1995;
  const retireYear = birthYear + (retirementAge || 60);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>
      
      <div className={`relative w-full max-w-sm rounded-xl shadow-2xl border-4 ${isBreakdownMode ? 'bg-gray-800 border-gray-600' : 'bg-[#fcfbf7] border-black'} p-6 animate-bounce-sm max-h-[90vh] overflow-y-auto`}>
        <div className="flex justify-between items-center mb-4">
            <h3 className={`text-xl font-black ${isBreakdownMode ? 'text-gray-300 font-serif' : 'text-black font-hand'}`}>
              {isRunMode ? '✈️ 自由之路' : (isBreakdownMode ? '⚰️ 工位墓碑生成器' : '一键社死')}
            </h3>
            <button onClick={onClose} className={`text-2xl hover:scale-110 ${isBreakdownMode ? 'text-gray-400' : 'text-black'}`}>✖️</button>
        </div>

        {/* --- TOMBSTONE MODE --- */}
        {isBreakdownMode ? (
          <div 
            ref={cardRef} 
            className="bg-[#1a1a1a] p-8 rounded-t-full rounded-b-lg border-8 border-gray-600 shadow-[0px_10px_20px_rgba(0,0,0,0.5)] mb-6 relative overflow-hidden flex flex-col items-center text-center font-serif"
          >
             {/* Rain/Texture Overlay */}
             <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'1\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'1\'/%3E%3C/g%3E%3C/svg%3E")' }}></div>
             
             <div className="text-gray-500 text-4xl mb-4 opacity-50">✝</div>

             {/* Grayscale Avatar */}
             <div className="w-24 h-24 rounded-full border-4 border-gray-500 overflow-hidden mb-6 filter grayscale contrast-125 sepia-[.3]">
                {avatar ? (
                  <img src={avatar} alt="RIP" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center text-4xl">💀</div>
                )}
             </div>

             <h2 className="text-gray-300 text-sm font-bold mb-2 tracking-widest uppercase">
               这里埋葬着打工人的梦想
             </h2>
             
             <div className="text-4xl font-black text-gray-200 mb-2 tracking-tighter">
               {birthYear} - {retireYear}
             </div>

             <div className="w-32 h-1 bg-gray-600 my-4"></div>

             <div className="text-gray-400 text-xs font-bold mb-6">
                剩余刑期: <span className="text-gray-200 text-base">{retirementStats?.yearsLeft || 0}</span> 年 <span className="text-gray-200 text-base">{retirementStats?.daysLeft || 0}</span> 天
             </div>

             <div className="bg-black/30 p-4 rounded-lg border border-gray-700 w-full">
                <p className="text-gray-400 italic font-medium leading-relaxed">
                   "{epitaph}"
                </p>
             </div>

             <div className="absolute bottom-2 text-[10px] text-gray-600">
                牛马时钟 · 2025
             </div>
          </div>
        ) : isRunMode ? (
           /* --- RUN MODE --- */
           <div
             ref={cardRef}
             className="relative mb-6 rounded-lg overflow-hidden border-4 border-white shadow-2xl h-[400px] flex flex-col"
           >
              {/* Background Image */}
              <div className="absolute inset-0">
                 <img src={destination.image} alt="Dest" className="w-full h-full object-cover" crossOrigin="anonymous" />
                 {/* Rainbow Gradient Overlay */}
                 <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/30 via-purple-500/30 to-yellow-500/30 mix-blend-screen pointer-events-none"></div>
                 {/* Darken bottom for text */}
                 <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 flex flex-col h-full justify-between p-6">
                  <div className="flex justify-between items-start">
                      <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg border-2 border-black transform -rotate-2">
                         <span className="font-black text-xl font-hand">RUN! 润!</span>
                      </div>
                      <div className="w-16 h-16 rounded-full border-2 border-white overflow-hidden shadow-lg">
                          {avatar ? (
                            <img src={avatar} alt="Me" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-white flex items-center justify-center text-2xl">😎</div>
                          )}
                      </div>
                  </div>

                  <div className="text-white">
                      <h2 className="text-3xl font-black font-hand mb-2 leading-tight drop-shadow-md">
                        世界那么大<br/>我想去看看
                      </h2>
                      <div className="flex items-center gap-2 mb-4">
                         <span className="text-2xl">📍</span>
                         <span className="font-bold font-mono tracking-widest uppercase text-yellow-300">
                            {destination.name}
                         </span>
                      </div>
                      
                      {/* Ticket Stub Look */}
                      <div className="bg-white text-black p-3 rounded-lg flex justify-between items-center">
                          <div className="flex flex-col">
                             <span className="text-[10px] text-gray-500 font-bold uppercase">Destination</span>
                             <span className="font-black text-lg">FREEDOM</span>
                          </div>
                          <div className="h-8 border-r-2 border-dashed border-gray-300 mx-2"></div>
                          <div className="flex flex-col items-end">
                             <span className="text-[10px] text-gray-500 font-bold uppercase">Date</span>
                             <span className="font-black text-lg text-[#4ade80]">NOW</span>
                          </div>
                      </div>
                  </div>
              </div>
           </div>
        ) : (
          /* --- STANDARD MODE --- */
          <div 
            ref={cardRef} 
            className="bg-[#ffe66d] p-6 rounded-lg border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-6 relative overflow-hidden font-sans"
          >
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black to-transparent bg-[length:10px_10px]"></div>
              
              <div className="relative z-10 flex flex-col items-center text-center">
                  <div className="bg-black text-white px-4 py-1 text-lg font-black font-hand -rotate-2 mb-4 border-2 border-white shadow-sm">
                    {getTitle()}
                  </div>

                  {/* Avatar / Emoji Display */}
                  <div className="relative mb-4">
                    <div className="w-28 h-28 rounded-full border-4 border-black overflow-hidden bg-white flex items-center justify-center shadow-md relative z-10">
                      {avatar ? (
                        <img src={avatar} alt="Me" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-6xl animate-shake">{getEmoji()}</div>
                      )}
                    </div>
                    
                    {/* Equipment Badge */}
                    {equipment && (
                      <div className="absolute -bottom-2 -right-4 z-20 transform -rotate-12 bg-white rounded-full border-2 border-black w-12 h-12 flex items-center justify-center text-2xl shadow-sm">
                        {equipment.icon}
                      </div>
                    )}
                  </div>
                  
                  {equipment && (
                    <div className="bg-[#2ec4b6] text-white text-xs font-bold px-3 py-1 rounded-full border-2 border-black mb-3 -rotate-1">
                      正在攻略: {equipment.item}
                    </div>
                  )}

                  <div className="bg-white/80 border-2 border-black p-3 w-full mb-3 rounded-lg backdrop-blur-sm">
                      <p className="text-xs font-bold text-gray-500 mb-1">当前状态</p>
                      <p className="text-2xl font-black font-mono text-black">{status}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 w-full">
                      <div className="bg-white/80 border-2 border-black p-2 rounded-lg">
                          <p className="text-[10px] font-bold text-gray-500">距离下班</p>
                          <p className="text-lg font-black font-mono">{timeRemaining}</p>
                      </div>
                      <div className="bg-white/80 border-2 border-black p-2 rounded-lg">
                          <p className="text-[10px] font-bold text-gray-500">今日含泪</p>
                          <p className="text-lg font-black font-mono">¥{earned}</p>
                      </div>
                  </div>

                  <div className="mt-4 pt-2 border-t-2 border-black/20 w-full">
                      <p className="text-xs font-bold font-hand text-black/60">来自：牛马时钟 App</p>
                  </div>
              </div>
          </div>
        )}

        <button 
          onClick={handleShare}
          disabled={isGenerating}
          className={`w-full ${isBreakdownMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-900' : (isRunMode ? 'bg-[#4ade80] hover:bg-green-400 text-black border-black' : 'bg-[#ff6b6b] hover:bg-[#ff5252] text-white border-black')} font-black text-xl py-3 px-4 rounded-xl border-2 shadow-comic active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all font-hand flex items-center justify-center gap-2`}
        >
          {isGenerating ? '生成中...' : (isBreakdownMode ? '🪦 立碑留念' : (isRunMode ? '✈️ 晒晒机票' : '📸 保存并发朋友圈'))}
        </button>
      </div>
    </div>
  );
};