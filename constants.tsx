
import React from 'react';

export const COLORS = {
  PRIMARY: '#FFD166',
  EXPENSE: '#FF7F50',
  INCOME: '#66CC99',
  TEXT_MAIN: '#3D5A80',
  TEXT_SUB: '#8A9CA9',
  BG: '#FFFFFF',
  BORDER: '#E6E9EC',
};

export const CATEGORIES = {
  expense: [
    { id: 'dining', name: '餐饮', path: 'M20 10 L20 40 M15 25 L25 25 M15 15 L25 35 M25 15 L15 35' },
    { id: 'shopping', name: '购物', path: 'M10 35 L30 35 L28 15 Q25 5 20 5 Q15 5 12 15 L10 35 M15 5 L25 5' },
    { id: 'snack', name: '零食', path: 'M10 35 L30 35 L28 25 L12 25 Z M15 25 L25 25 M14 20 L26 20 M13 15 L27 15' },
    { id: 'fruit', name: '水果', path: 'M20 10 Q28 12 32 20 Q34 28 30 35 Q25 40 20 40 Q15 40 10 35 Q6 28 8 20 Q12 12 20 10 M25 10 L28 8' },
    { id: 'transport', name: '交通', path: 'M10 30 L30 30 L28 20 L22 15 L18 15 L12 20 Z M15 30 L15 35 M25 30 L25 35 M18 20 L22 20' },
    { id: 'daily', name: '日用', path: 'M10 15 L30 15 L28 35 L12 35 Z M15 20 L25 25 M18 28 L22 23' },
    { id: 'entertainment', name: '娱乐', path: 'M20 10 Q25 8 27 13 Q29 18 27 23 Q25 28 20 28 L20 40 M15 13 Q18 10 20 10 Q22 10 25 13' },
    { id: 'communication', name: '通讯', path: 'M10 30 Q15 25 20 20 Q25 15 30 10 L25 5 L15 5 Z M10 30 L5 35 L10 40' },
    { id: 'clothing', name: '服饰', path: 'M10 20 L30 20 Q33 25 30 30 L25 35 L15 35 L10 30 Q7 25 10 20 M15 20 L25 20' },
    { id: 'transfer', name: '转账', path: 'M10 20 L25 20 L20 15 M25 20 L20 25 M30 20 L15 20 L20 25 M15 20 L20 15' },
    { id: 'study', name: '学习', path: 'M10 15 L30 10 L28 35 L8 30 Z M15 20 L25 22 M16 25 L24 27' },
    { id: 'digital', name: '数码', path: 'M12 10 L28 10 L28 38 L12 38 Z M18 10 L22 10 M15 35 L25 35' },
    { id: 'medical', name: '医疗', path: 'M10 15 L30 15 L30 35 L10 35 Z M20 15 L20 35 M15 20 L25 20 M15 25 L25 25 M15 30 L25 30' },
    { id: 'other', name: '其他', path: 'M20 10 Q30 10 35 20 Q30 30 20 30 Q10 30 5 20 Q10 10 20 10' },
  ],
  income: [
    { id: 'salary', name: '工资', path: 'M10 20 L30 20 L28 35 L12 35 Z M15 15 L25 15 L23 20 L17 20 Z M20 25 L20 30 M22 27 L18 27' },
    { id: 'finance', name: '理财', path: 'M10 35 L30 35 L28 30 L20 25 L12 32' },
    { id: 'transfer', name: '转账', path: 'M10 20 L25 20 L20 15 M25 20 L20 25 M30 20 L15 20 L20 25 M15 20 L20 15' },
    { id: 'other', name: '其他', path: 'M20 10 Q30 10 35 20 Q30 30 20 30 Q10 30 5 20 Q10 10 20 10' },
  ]
};

export const CategoryIcon = ({ path, color = COLORS.TEXT_MAIN, size = "2rem" }: { path: string, color?: string, size?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 40 40" 
    stroke={color} 
    strokeWidth="2px" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d={path} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
