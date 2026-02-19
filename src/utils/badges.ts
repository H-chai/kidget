import type { Transaction, Goal } from '../types';

/** Returns badge IDs that should be earned given the current data */
export const checkEarnedBadgeIds = (
  transactions: Transaction[],
  goals: Goal[]
): string[] => {
  const earned: string[] = [];
  const incomes = transactions.filter(t => t.type === 'income');
  const expenses = transactions.filter(t => t.type === 'expense');

  if (incomes.length >= 1) earned.push('first_chore');
  if (incomes.length >= 10) earned.push('chore_10');
  if (expenses.length >= 1) earned.push('first_expense');
  if (goals.length >= 1) earned.push('first_goal');
  if (goals.some(g => g.achieved_at !== null)) earned.push('goal_achieved');
  if (hasChoreStreak(incomes, 7)) earned.push('chore_streak_7');
  if (hasSaverMonth(transactions)) earned.push('saver_month');

  return earned;
};

const hasChoreStreak = (incomes: Transaction[], days: number): boolean => {
  if (incomes.length < days) return false;
  const uniqueDates = [...new Set(incomes.map(t => t.date))].sort();
  let streak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const diff =
      (new Date(uniqueDates[i]).getTime() - new Date(uniqueDates[i - 1]).getTime()) /
      86_400_000;
    if (diff === 1) {
      streak++;
      if (streak >= days) return true;
    } else {
      streak = 1;
    }
  }
  return false;
};

/** Returns true if any calendar month has income transactions but zero expenses */
const hasSaverMonth = (transactions: Transaction[]): boolean => {
  const incomeMonths = new Set(
    transactions.filter(t => t.type === 'income').map(t => t.date.slice(0, 7))
  );
  const expenseMonths = new Set(
    transactions.filter(t => t.type === 'expense').map(t => t.date.slice(0, 7))
  );
  for (const month of incomeMonths) {
    if (!expenseMonths.has(month)) return true;
  }
  return false;
};
