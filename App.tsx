
import React, { useState, useEffect } from 'react';
import { TabType, Bill, Budget } from './types';
import { db } from './services/db';
import DetailView from './components/DetailView';
import ChartView from './components/ChartView';
import AddBillView from './components/AddBillView';
import MineView from './components/MineView';
import Toast from './components/Toast';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.DETAIL);
  const [bills, setBills] = useState<Bill[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [toast, setToast] = useState<{msg: string, type: 'success' | 'error'} | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setBills(db.getBills());
      setBudgets(db.getBudgets());
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleSaveBill = (partialBill: Partial<Bill>) => {
    const newBill: Bill = {
      ...partialBill,
      id: Math.random().toString(36).substr(2, 9),
      createTime: Date.now(),
    } as Bill;
    db.saveBill(newBill);
    setBills(prev => [...prev, newBill]);
    setToast({ msg: '记录成功', type: 'success' });
    setActiveTab(TabType.DETAIL);
  };

  const handleSaveBudget = (amount: number, month: string) => {
    const newBudget = { amount, month };
    db.saveBudget(newBudget);
    setBudgets(db.getBudgets());
    setToast({ msg: '预算设置成功', type: 'success' });
  };

  return (
    <div className="fixed inset-0 flex flex-col max-w-[500px] mx-auto bg-white shadow-2xl overflow-hidden ring-1 ring-gray-100">
      {/* Top Navigation Bar - Elegant Centered */}
      <header className="h-[2.133rem] min-h-[2.133rem] flex items-center justify-center bg-[#FFD166] w-full shrink-0 shadow-sm z-10">
        <span className="text-[0.853rem] text-[#3D5A80] font-bold tracking-wider uppercase">bills</span>
      </header>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-[10000] bg-white/60 backdrop-blur-md flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-[2rem] h-[2rem] border-[3px] border-[#FFD166] border-t-transparent rounded-full animate-spin" />
            <span className="text-[0.6rem] text-[#8A9CA9] font-medium tracking-widest">LOADING</span>
          </div>
        </div>
      )}

      {/* Main Content Area with Fade Transition placeholder style */}
      <main className="flex-1 relative overflow-hidden bg-[#F8FAFC]">
        {activeTab === TabType.DETAIL && <DetailView bills={bills} budgets={budgets} onSaveBudget={handleSaveBudget} />}
        {activeTab === TabType.CHART && <ChartView bills={bills} />}
        {activeTab === TabType.ADD && <AddBillView onSave={handleSaveBill} />}
        {activeTab === TabType.MINE && <MineView bills={bills} />}
      </main>

      {/* Bottom Navigation - Modern Pill Style active state */}
      <nav className="h-[4.4rem] min-h-[4.4rem] border-t border-[#F1F5F9] bg-white/90 backdrop-blur-xl flex items-center pb-[env(safe-area-inset-bottom)] shrink-0 px-2">
        {[
          { type: TabType.DETAIL, label: '明细', icon: 'M10 10 H30 M10 20 H30 M10 30 H20' },
          { type: TabType.CHART, label: '图表', icon: 'M10 30 V15 H15 V30 M20 30 V10 H25 V30 M30 30 V20 H35 V30' },
          { type: TabType.ADD, label: '记账', icon: 'M20 10 V30 M10 20 H30' },
          { type: TabType.MINE, label: '我的', icon: 'M10 35 Q10 25 20 25 Q30 25 30 35 M20 20 Q25 20 25 10 Q20 5 15 10 Q15 20 20 20' }
        ].map((tab) => {
          const isActive = activeTab === tab.type;
          return (
            <div
              key={tab.type}
              onClick={() => setActiveTab(tab.type)}
              className={`flex-1 flex flex-col items-center justify-center gap-1.5 transition-all duration-300 relative cursor-pointer active-press`}
            >
              <div className={`p-2 rounded-2xl transition-all duration-300 ${isActive ? 'bg-[#FFD166]/20 text-[#3D5A80]' : 'text-[#8A9CA9]'}`}>
                <svg width="1.2rem" height="1.2rem" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.5px">
                   <path d={tab.icon} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className={`text-[0.55rem] font-bold tracking-wide ${isActive ? 'text-[#3D5A80]' : 'text-[#8A9CA9]'}`}>
                {tab.label}
              </span>
            </div>
          );
        })}
      </nav>

      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.msg} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
};

export default App;
