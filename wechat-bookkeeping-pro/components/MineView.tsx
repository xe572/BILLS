
import React, { useState, useEffect } from 'react';
import { Bill } from '../types';
import { getFinancialInsights } from '../services/gemini';

interface MineViewProps {
  bills: Bill[];
}

const MineView: React.FC<MineViewProps> = ({ bills }) => {
  const [aiTip, setAiTip] = useState('分析中...');
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    if (bills.length > 0) {
      setLoadingAi(true);
      getFinancialInsights(bills).then(tip => {
        setAiTip(tip);
        setLoadingAi(false);
      });
    } else {
      setAiTip('开启你的第一笔记账，解锁AI理财分析。');
    }
  }, [bills]);

  const totalDays = new Set(bills.map(b => b.date)).size;
  const totalBills = bills.length;

  return (
    <div className="flex flex-col items-center bg-[#F8FAFC] h-full overflow-y-auto no-scrollbar pb-10">
      {/* Header Profile Section */}
      <div className="w-full bg-[#FFD166] pt-10 pb-20 rounded-b-[3rem] shadow-sm flex flex-col items-center">
        <div className="relative">
          <div className="w-[6rem] h-[6rem] rounded-[2.5rem] bg-white p-1.5 shadow-xl rotate-3 transform">
            <img src="https://picsum.photos/200/200?random=1" alt="Avatar" className="w-full h-full object-cover rounded-[2rem]" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-white w-8 h-8 rounded-2xl shadow-lg flex items-center justify-center">
            <span className="text-[0.8rem]">👋</span>
          </div>
        </div>
        <h2 className="text-[1.2rem] font-black text-[#3D5A80] mt-6 tracking-tight">你好, 记账达人</h2>
        <span className="text-[0.6rem] text-[#3D5A80]/60 font-bold uppercase tracking-widest mt-1">WeChat Account</span>
      </div>

      {/* Stats Cards Dashboard */}
      <div className="flex w-full gap-4 px-6 -mt-10">
        <div className="flex-1 bg-white rounded-[2rem] p-6 soft-shadow border border-gray-50 flex flex-col items-center">
          <span className="text-[1.5rem] font-black text-[#3D5A80]">{totalDays}</span>
          <span className="text-[0.55rem] text-[#8A9CA9] font-bold uppercase tracking-widest mt-1">记账天数</span>
        </div>
        <div className="flex-1 bg-white rounded-[2rem] p-6 soft-shadow border border-gray-50 flex flex-col items-center">
          <span className="text-[1.5rem] font-black text-[#3D5A80]">{totalBills}</span>
          <span className="text-[0.55rem] text-[#8A9CA9] font-bold uppercase tracking-widest mt-1">记录笔数</span>
        </div>
      </div>

      {/* AI Assistant Insight Bubble */}
      <div className="w-full px-6 mt-8">
        <div className="bg-white rounded-[2.5rem] p-8 soft-shadow border border-gray-50 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-[#FFD166]/20 flex items-center justify-center">
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3D5A80" strokeWidth="2.5">
                 <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/>
               </svg>
            </div>
            <span className="text-[0.7rem] font-black text-[#3D5A80] uppercase tracking-widest">AI 理财建议</span>
          </div>
          
          <div className="relative">
            {loadingAi && (
              <div className="flex gap-1 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FFD166] animate-bounce" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#FFD166] animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#FFD166] animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <p className={`text-[0.8rem] leading-relaxed text-[#3D5A80] font-medium transition-all duration-700 ${loadingAi ? 'opacity-30 blur-[2px]' : 'opacity-100'}`}>
              {aiTip}
            </p>
          </div>
          
          <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-[#FFD166] opacity-[0.05] rounded-full" />
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-auto pt-10 pb-4 opacity-20 flex flex-col items-center">
         <span className="text-[0.5rem] font-black uppercase tracking-[0.3em]">Smart Wallet Pro</span>
         <span className="text-[0.4rem] font-bold mt-1">v2.0.4 • AI Powered</span>
      </div>
    </div>
  );
};

export default MineView;
