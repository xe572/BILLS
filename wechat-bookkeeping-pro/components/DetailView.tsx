
import React, { useState, useMemo } from 'react';
import { Bill, BillType, DetailTab, Budget } from '../types';
import { COLORS, CATEGORIES, CategoryIcon } from '../constants';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface DetailViewProps {
  bills: Bill[];
  budgets: Budget[];
  onSaveBudget: (amount: number, month: string) => void;
}

const DetailView: React.FC<DetailViewProps> = ({ bills, budgets, onSaveBudget }) => {
  const [activeTab, setActiveTab] = useState<DetailTab>(DetailTab.DETAIL);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [budgetInput, setBudgetInput] = useState('');

  const monthStats = useMemo(() => {
    const filtered = bills.filter(b => b.date.startsWith(currentMonth));
    const income = filtered.filter(b => b.type === BillType.INCOME).reduce((sum, b) => sum + b.amount, 0);
    const expense = filtered.filter(b => b.type === BillType.EXPENSE).reduce((sum, b) => sum + b.amount, 0);
    return { income, expense, filtered };
  }, [bills, currentMonth]);

  const currentBudget = budgets.find(b => b.month === currentMonth)?.amount || 0;
  const budgetUsedPercent = currentBudget > 0 ? Math.min(100, (monthStats.expense / currentBudget) * 100) : 0;

  const chartData = [
    { name: 'Used', value: monthStats.expense },
    { name: 'Remaining', value: Math.max(0, currentBudget - monthStats.expense) }
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#F8FAFC]">
      {/* Dynamic Header Dashboard */}
      <div className="bg-[#FFD166] px-[1.33rem] pb-[1rem] pt-[0.5rem] shadow-sm rounded-b-[2rem]">
        <div className="flex flex-col items-center">
          <div className="relative mb-4 group active-press">
            <input 
              type="month" 
              value={currentMonth}
              onChange={(e) => setCurrentMonth(e.target.value)}
              className="text-[0.8rem] font-extrabold text-[#3D5A80] bg-white/20 backdrop-blur-md rounded-full px-4 py-1.5 border-none outline-none cursor-pointer text-center"
            />
          </div>
          <div className="grid grid-cols-2 w-full gap-4 px-4">
            <div className="bg-white/40 backdrop-blur rounded-2xl p-3 flex flex-col items-center">
              <span className="text-[0.55rem] font-bold text-[#3D5A80]/60 uppercase tracking-widest mb-1">收入</span>
              <span className="text-[0.9rem] font-black text-[#3D5A80]">{monthStats.income.toFixed(2)}</span>
            </div>
            <div className="bg-white/40 backdrop-blur rounded-2xl p-3 flex flex-col items-center">
              <span className="text-[0.55rem] font-bold text-[#3D5A80]/60 uppercase tracking-widest mb-1">支出</span>
              <span className="text-[0.9rem] font-black text-[#3D5A80]">{monthStats.expense.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex h-[3.5rem] mt-4 px-4 gap-2">
        {[DetailTab.DETAIL, DetailTab.BILL, DetailTab.BUDGET].map((tab) => (
          <div 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 flex items-center justify-center text-[0.7rem] font-bold rounded-2xl transition-all duration-300 active-press ${activeTab === tab ? 'bg-[#3D5A80] text-white shadow-lg' : 'bg-white text-[#8A9CA9]'}`}
          >
            {tab === DetailTab.BILL ? '账单' : tab === DetailTab.BUDGET ? '预算' : '明细'}
          </div>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto mt-4 px-4 pb-10 no-scrollbar">
        {activeTab === DetailTab.DETAIL && (
          <div className="space-y-[0.8rem]">
            {monthStats.filtered.length > 0 ? (
              monthStats.filtered.sort((a,b) => b.createTime - a.createTime).map(bill => {
                const catInfo = [...CATEGORIES.expense, ...CATEGORIES.income].find(c => c.name === bill.category);
                return (
                  <div key={bill.id} className="flex items-center h-[4.5rem] bg-white rounded-2xl px-4 soft-shadow active-press border border-gray-50">
                    <div className="w-[2.6rem] h-[2.6rem] bg-[#F8FAFC] rounded-xl flex items-center justify-center mr-4">
                      {catInfo && <CategoryIcon path={catInfo.path} size="1.6rem" color={COLORS.TEXT_MAIN} />}
                    </div>
                    <div className="flex-1 flex flex-col">
                      <span className="text-[0.75rem] font-bold text-[#3D5A80]">{bill.category}</span>
                      <span className="text-[0.55rem] text-[#8A9CA9] font-medium mt-0.5">{bill.date}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`text-[0.9rem] font-black tracking-tight ${bill.type === BillType.INCOME ? 'text-[#66CC99]' : 'text-[#FF7F50]'}`}>
                        {bill.type === BillType.INCOME ? '+' : '-'}{bill.amount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-20 opacity-40">
                <div className="w-16 h-16 rounded-full bg-gray-200 mb-4" />
                <span className="text-[0.7rem] font-bold tracking-widest uppercase">暂无明细数据</span>
              </div>
            )}
          </div>
        )}

        {activeTab === DetailTab.BUDGET && (
          <div className="space-y-6">
            <div className="bg-white rounded-[2rem] p-6 soft-shadow border border-gray-50 flex flex-col items-center">
              <div className="w-full flex items-center justify-between mb-8">
                <span className="text-[0.8rem] font-black text-[#3D5A80]">设置月预算</span>
                <div className="flex gap-2">
                  <input 
                    type="number"
                    placeholder="0.00"
                    value={budgetInput}
                    onChange={(e) => setBudgetInput(e.target.value)}
                    className="w-[5rem] h-[2.2rem] bg-[#F8FAFC] border-none rounded-xl px-3 text-[0.75rem] font-bold outline-none focus:ring-2 focus:ring-[#FFD166]"
                  />
                  <button 
                    onClick={() => {
                      const val = parseFloat(budgetInput);
                      if (val > 0) {
                        onSaveBudget(val, currentMonth);
                        setBudgetInput('');
                      }
                    }}
                    className="bg-[#FFD166] h-[2.2rem] px-4 rounded-xl text-[0.75rem] font-black text-[#3D5A80] btn-active shadow-sm"
                  >
                    保存
                  </button>
                </div>
              </div>

              {currentBudget > 0 ? (
                <div className="flex flex-col items-center w-full">
                  <div className="w-[12rem] h-[12rem] relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          innerRadius="75%"
                          outerRadius="100%"
                          paddingAngle={8}
                          dataKey="value"
                          startAngle={90}
                          endAngle={-270}
                          stroke="none"
                        >
                          <Cell fill={COLORS.EXPENSE} />
                          <Cell fill="#F1F5F9" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[1.8rem] font-black text-[#3D5A80] leading-none">{budgetUsedPercent.toFixed(0)}<span className="text-[0.8rem] font-bold">%</span></span>
                      <span className="text-[0.55rem] text-[#8A9CA9] font-bold uppercase tracking-widest mt-1">已用</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 w-full mt-10 gap-2">
                    <div className="bg-[#F8FAFC] rounded-2xl p-4 flex flex-col items-center">
                      <span className="text-[0.5rem] text-[#8A9CA9] font-bold uppercase mb-1">剩余</span>
                      <span className="text-[0.7rem] font-black text-[#3D5A80]">{(currentBudget - monthStats.expense).toFixed(0)}</span>
                    </div>
                    <div className="bg-[#F8FAFC] rounded-2xl p-4 flex flex-col items-center border-x border-white">
                      <span className="text-[0.5rem] text-[#8A9CA9] font-bold uppercase mb-1">预算</span>
                      <span className="text-[0.7rem] font-black text-[#3D5A80]">{currentBudget.toFixed(0)}</span>
                    </div>
                    <div className="bg-[#F8FAFC] rounded-2xl p-4 flex flex-col items-center">
                      <span className="text-[0.5rem] text-[#8A9CA9] font-bold uppercase mb-1">支出</span>
                      <span className="text-[0.7rem] font-black text-[#3D5A80]">{monthStats.expense.toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 opacity-30">
                  <span className="text-[0.7rem] font-bold uppercase tracking-widest">设置预算开启进度监控</span>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === DetailTab.BILL && (
          <div className="flex flex-col items-center justify-center py-20 opacity-30">
             <div className="w-16 h-16 rounded-3xl bg-gray-200 flex items-center justify-center mb-4">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                 <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
               </svg>
             </div>
             <span className="text-[0.7rem] font-bold uppercase tracking-widest">月度报表优化中</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailView;
