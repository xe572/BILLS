
import React, { useState, useMemo } from 'react';
import { Bill, BillType } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { COLORS, CATEGORIES, CategoryIcon } from '../constants';

interface ChartViewProps {
  bills: Bill[];
}

const ChartView: React.FC<ChartViewProps> = ({ bills }) => {
  const [dimension, setDimension] = useState<'day' | 'month' | 'year'>('day');

  const chartData = useMemo(() => {
    const expenseBills = bills.filter(b => b.type === BillType.EXPENSE);
    if (dimension === 'day') {
      const days: Record<string, number> = {};
      for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split('T')[0].substring(5);
        days[key] = 0;
      }
      expenseBills.forEach(b => {
        const key = b.date.substring(5);
        if (days[key] !== undefined) days[key] += b.amount;
      });
      return Object.entries(days).map(([name, value]) => ({ name, value }));
    } else if (dimension === 'month') {
      const months: Record<string, number> = {};
      for (let i = 1; i <= 12; i++) {
        months[`${i}月`] = 0;
      }
      const year = new Date().getFullYear();
      expenseBills.forEach(b => {
        if (b.date.startsWith(year.toString())) {
          const m = parseInt(b.date.split('-')[1]);
          months[`${m}月`] += b.amount;
        }
      });
      return Object.entries(months).map(([name, value]) => ({ name, value }));
    } else {
      const years: Record<string, number> = {};
      expenseBills.forEach(b => {
        const y = b.date.split('-')[0];
        years[y] = (years[y] || 0) + b.amount;
      });
      return Object.entries(years).sort().map(([name, value]) => ({ name, value }));
    }
  }, [bills, dimension]);

  const ranking = useMemo(() => {
    const categories: Record<string, number> = {};
    const filtered = bills.filter(b => b.type === BillType.EXPENSE);
    const total = filtered.reduce((sum, b) => sum + b.amount, 0);
    
    filtered.forEach(b => {
      categories[b.category] = (categories[b.category] || 0) + b.amount;
    });

    return Object.entries(categories)
      .map(([name, value]) => ({ name, value, percent: total > 0 ? (value / total) * 100 : 0 }))
      .sort((a, b) => b.value - a.value);
  }, [bills]);

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      {/* Modern Filter Pill */}
      <div className="flex h-[4rem] px-6 items-center shrink-0">
        <div className="flex w-full bg-white rounded-2xl p-1.5 shadow-sm border border-gray-50">
          {['day', 'month', 'year'].map((dim) => (
            <button
              key={dim}
              onClick={() => setDimension(dim as any)}
              className={`flex-1 h-[2.2rem] rounded-xl text-[0.7rem] font-black transition-all duration-300 ${dimension === dim ? 'bg-[#FFD166] text-[#3D5A80] shadow-md' : 'text-[#8A9CA9]'}`}
            >
              {dim === 'day' ? '日' : dim === 'month' ? '月' : '年'}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Section - Card Based */}
      <div className="h-[18rem] bg-white mx-4 rounded-3xl soft-shadow border border-gray-50 p-6 flex flex-col shrink-0">
        <div className="flex justify-between items-center mb-6">
           <span className="text-[0.7rem] font-black text-[#3D5A80] uppercase tracking-widest">消费趋势</span>
           <div className="w-2 h-2 rounded-full bg-[#FF7F50] animate-pulse" />
        </div>
        <div className="flex-1 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 25, right: 0, left: 0, bottom: 0 }}>
              <XAxis 
                dataKey="name" 
                fontSize={8} 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#8A9CA9', fontWeight: 'bold'}}
                interval={dimension === 'day' ? 5 : 0}
              />
              <Tooltip 
                cursor={{fill: '#F8FAFC', radius: 8}}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px rgba(61,90,128,0.1)', fontSize: '10px', fontWeight: 'bold' }}
              />
              <Bar dataKey="value" radius={[6, 6, 6, 6]} barSize={dimension === 'day' ? 8 : 20}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS.EXPENSE} />
                ))}
                <LabelList 
                  dataKey="value" 
                  position="top" 
                  offset={10}
                  fontSize={8}
                  fill="#3D5A80"
                  fontWeight="900"
                  formatter={(val: number) => val > 0 ? val.toFixed(0) : ''}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Ranking List */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 mt-2">
        <div className="flex items-center justify-between mb-6">
           <h3 className="text-[0.8rem] font-black text-[#3D5A80] uppercase tracking-widest">支出排行榜</h3>
           <span className="text-[0.55rem] font-bold text-[#8A9CA9] uppercase">{ranking.length} Categories</span>
        </div>
        
        <div className="space-y-4">
          {ranking.length > 0 ? ranking.map((item, idx) => {
             const catInfo = CATEGORIES.expense.find(c => c.name === item.name);
             return (
               <div key={item.name} className="bg-white rounded-3xl p-4 soft-shadow flex flex-col gap-3 border border-gray-50 active-press">
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-[#F8FAFC] rounded-2xl flex items-center justify-center">
                       {catInfo && <CategoryIcon path={catInfo.path} size="1.4rem" color={COLORS.TEXT_MAIN} />}
                     </div>
                     <div className="flex flex-col">
                       <span className="text-[0.75rem] font-black text-[#3D5A80]">{item.name}</span>
                       <span className="text-[0.55rem] text-[#8A9CA9] font-bold uppercase tracking-widest">{item.percent.toFixed(1)}%</span>
                     </div>
                   </div>
                   <div className="text-right">
                     <span className="text-[0.85rem] font-black text-[#3D5A80] tracking-tighter">{item.value.toFixed(2)}</span>
                   </div>
                 </div>
                 <div className="w-full h-[0.4rem] bg-[#F8FAFC] rounded-full overflow-hidden">
                   <div 
                     className="h-full bg-gradient-to-r from-[#FF7F50] to-[#FFD166] rounded-full" 
                     style={{ width: `${item.percent}%` }}
                   />
                 </div>
               </div>
             )
          }) : (
            <div className="flex flex-col items-center py-10 opacity-30">
              <div className="w-12 h-12 rounded-full bg-gray-200 mb-4" />
              <span className="text-[0.6rem] font-bold uppercase tracking-widest">暂无排行数据</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChartView;
