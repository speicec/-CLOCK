import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: string;
  timeRemaining: string;
  earned: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, status, timeRemaining, earned }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleShare = async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    
    try {
      // Small delay to ensure rendering
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null, // Transparent bg to capture the card's color
        scale: 2, // Retine quality
        useCORS: true,
      });

      const image = canvas.toDataURL('image/png');
      
      // Create download link
      const link = document.createElement('a');
      link.href = image;
      link.download = `niu-ma-clock-${Date.now()}.png`;
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>
      
      <div className="relative bg-[#fcfbf7] w-full max-w-sm rounded-xl shadow-2xl border-4 border-black p-6 animate-bounce-sm">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-black font-hand">一键社死</h3>
            <button onClick={onClose} className="text-2xl hover:scale-110">✖️</button>
        </div>

        {/* The Card to Capture */}
        <div 
          ref={cardRef} 
          className="bg-[#ffe66d] p-6 rounded-lg border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-6 relative overflow-hidden"
        >
            {/* Watermark/Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black to-transparent bg-[length:10px_10px]"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center">
                <div className="bg-black text-white px-4 py-1 text-lg font-black font-hand -rotate-2 mb-4 border-2 border-white shadow-sm">
                   {getTitle()}
                </div>

                <div className="text-6xl mb-2 animate-shake">{getEmoji()}</div>
                
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

        <button 
          onClick={handleShare}
          disabled={isGenerating}
          className="w-full bg-[#ff6b6b] hover:bg-[#ff5252] text-white font-black text-xl py-3 px-4 rounded-xl border-2 border-black shadow-comic active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all font-hand flex items-center justify-center gap-2"
        >
          {isGenerating ? '生成中...' : '📸 保存并发朋友圈'}
        </button>
      </div>
    </div>
  );
};