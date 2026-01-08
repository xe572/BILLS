
import { Bill, Budget } from '../types';

const BILLS_KEY = 'wechat_bookkeeping_bills';
const BUDGET_KEY = 'wechat_bookkeeping_budget';

export const db = {
  getBills: (): Bill[] => {
    const data = localStorage.getItem(BILLS_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveBill: (bill: Bill) => {
    const bills = db.getBills();
    bills.push(bill);
    localStorage.setItem(BILLS_KEY, JSON.stringify(bills));
  },
  deleteBill: (id: string) => {
    const bills = db.getBills().filter(b => b.id !== id);
    localStorage.setItem(BILLS_KEY, JSON.stringify(bills));
  },
  getBudgets: (): Budget[] => {
    const data = localStorage.getItem(BUDGET_KEY);
    return data ? JSON.parse(data) : [];
  },
  saveBudget: (budget: Budget) => {
    const budgets = db.getBudgets().filter(b => b.month !== budget.month);
    budgets.push(budget);
    localStorage.setItem(BUDGET_KEY, JSON.stringify(budgets));
  }
};
