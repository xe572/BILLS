
export enum BillType {
  EXPENSE = 'expense',
  INCOME = 'income'
}

export enum TabType {
  DETAIL = 'detail',
  CHART = 'chart',
  ADD = 'add',
  MINE = 'mine'
}

export enum DetailTab {
  BILL = 'bill',
  BUDGET = 'budget',
  DETAIL = 'detail'
}

export interface Bill {
  id: string;
  type: BillType;
  category: string;
  amount: number;
  date: string; // YYYY-MM-DD
  createTime: number;
}

export interface Budget {
  month: string; // YYYY-MM
  amount: number;
}

export interface UserStats {
  totalDays: number;
  totalBills: number;
}
