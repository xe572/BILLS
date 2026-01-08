
import React, { useState } from 'react';
import { BillType, Bill } from '../types';
import { CATEGORIES, COLORS, CategoryIcon } from '../constants';

interface AddBillViewProps {
  onSave: (bill: Partial<Bill>) => void;
}

const AddBillView: React.FC<AddBillViewProps> = ({ onSave }) => {
  const [type, setType] = useState<BillType>(BillType.EXPENSE);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [inputBuffer, setInputBuffer] = useState('');

  const handleKeyClick = (key: string) => {
    if (key === 'delete') {
      setInputBuffer(prev => prev.slice(0, -1));
    } else if (key === '.') {
      if (inputBuffer === '') {
        setInputBuffer('0.');
      } else if (!inputBuffer.includes('.')) {
        setInputBuffer(prev => prev + '.');
      }
    } else {
      if (inputBuffer.includes('.') && inputBuffer.split('.')[1].length >= 2) return;
      setInputBuffer(prev => prev + key);
    }
  };

  const displayAmount = inputBuffer === '' ? '' : Number(inputBuffer).toFixed(2);

  const handleSubmit = () => {
    const val = parseFloat(inputBuffer);
    if (!activeCategory) return alert('请选择收支类别');
    if (isNaN(val) || val <= 0) return alert('请输入有效金额');
    
    onSave({
      type,
      category: activeCategory,
      amount: val,
      date
    });
    
    setInputBuffer('');
    setActiveCategory('');
  };

  const categories = type === BillType.EXPENSE ? CATEGORIES.expense : CATEGORIES.income;

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC]">
      {/* Tab Switcher - Pill Style */}
      <div className="flex h-[4rem] px-6 items-center shrink-0">
        <div className="flex w-full bg-white rounded-2xl p-1.5 shadow-sm border border-gray-50">
          {[BillType.EXPENSE, BillType.INCOME].map(t => (
            <button
              key={t}
              onClick={() => { setType(t); setActiveCategory(''); }}
              className={`flex-1 h-[2.2rem] rounded-xl text-[0.75rem] font-black transition-all duration-300 ${type === t ? 'bg-[#FFD166] text-[#3D5A80] shadow-md' : 'text-[#8A9CA9]'}`}
            >
              {t === BillType.EXPENSE ? '支出' : '收入'}
            </button>
          ))}
        </div>
      </div>

      {/* Categories Grid - Card Inspired */}
      <div className="flex-1 overflow-y-auto no-scrollbar grid grid-cols-4 p-4 gap-3 bg-white mx-4 rounded-t-[2rem] shadow-sm">
        {categories.map(cat => (
          <div
            key={cat.id}
            onClick={() => setActiveCategory(cat.name)}
            className={`flex flex-col items-center justify-center h-[5.5rem] rounded-2xl transition-all duration-200 active-press ${activeCategory === cat.name ? 'bg-[#FFD166] shadow-inner scale-95' : 'bg-[#F8FAFC]'}`}
          >
            <CategoryIcon path={cat.path} size="1.6rem" color={activeCategory === cat.name ? COLORS.TEXT_MAIN : '#8A9CA9'} />
            <span className={`text-[0.55rem] font-bold mt-2 tracking-wide ${activeCategory === cat.name ? 'text-[#3D5A80]' : 'text-[#8A9CA9]'}`}>
              {cat.name}
            </span>
          </div>
        ))}
      </div>

      {/* Modern Input Panel */}
      <div className="bg-white border-t border-[#F1F5F9] pb-[env(safe-area-inset-bottom)] px-4">
        <div className="flex h-[3.5rem] items-center justify-between border-b border-gray-50">
          <div className="flex items-center gap-2 relative">
            <div className="w-8 h-8 rounded-full bg-[#F8FAFC] flex items-center justify-center">
               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3D5A80" strokeWidth="2.5"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            </div>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="text-[0.75rem] text-[#3D5A80] font-black outline-none border-none bg-transparent"
            />
          </div>
          <div className="flex items-baseline gap-1">
             <span className="text-[0.6rem] font-bold text-[#8A9CA9] uppercase tracking-widest">金额</span>
             <span className="text-[1.2rem] font-black text-[#3D5A80] transition-all min-w-[1rem] text-right">
               {displayAmount || <span className="opacity-10">0.00</span>}
             </span>
          </div>
        </div>

        {/* Floating Style Keyboard */}
        <div className="grid grid-cols-4 h-[15rem] gap-2 py-4">
          <div className="col-span-3 grid grid-cols-3 gap-2">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'delete'].map(k => (
              <button 
                key={k} 
                onClick={() => handleKeyClick(k)}
                className="flex items-center justify-center text-[1.1rem] font-black text-[#3D5A80] bg-[#F8FAFC] rounded-2xl active-press soft-shadow"
              >
                {k === 'delete' ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 4H8l-7 8 7 8h13a2 2 0 002-2V6a2 2 0 00-2-2z M18 9l-6 6 M12 9l6 6"/></svg>
                ) : k}
              </button>
            ))}
          </div>
          <button 
            onClick={handleSubmit}
            className="flex items-center justify-center bg-[#FFD166] text-[1rem] font-black text-[#3D5A80] rounded-[2rem] shadow-lg btn-active"
          >
            DONE
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBillView;
